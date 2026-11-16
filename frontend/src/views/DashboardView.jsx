import React, { useState } from 'react';
import {
  Users,
  Activity,
  Building2,
  AlertCircle,
  Send,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { MONTHLY_ATTENDANCE_TREND } from '../data/seedData';

export default function DashboardView({ students, onNotify, onSelectStudent }) {
  const [sentNotices, setSentNotices] = useState({});

  const totalStudents = students.length;
  const avgAttendance = totalStudents
    ? (students.reduce((acc, s) => acc + s.attendance_pct, 0) / totalStudents).toFixed(1)
    : 0;
  const feeDefaulters = students.filter((s) => s.fee_status !== 'Paid');
  const detentionRisk = students.filter((s) => s.attendance_pct < 75);

  const departments = ['CSE', 'AIML', 'ECE', 'ME', 'CIVIL'];
  const deptChartData = departments.map((dept) => {
    const group = students.filter((s) => s.department === dept);
    const count = group.length;
    const passRate = count
      ? Math.round((group.filter((s) => s.cgpa >= 7.0).length / count) * 100)
      : 92;
    return { department: dept, students: count || 2, passRate };
  });

  const handleSendNotice = (stu) => {
    setSentNotices((prev) => ({ ...prev, [stu.usn]: true }));
    onNotify(`Attendance warning SMS/Email dispatched to ${stu.full_name} & Guardian (${stu.guardian_contact})`, 'warning');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Campus Overview</h1>
          <p className="text-sm text-slate-400">Real-time academic telemetry, attendance compliance & fee analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Enrolled</span>
            <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-400"><Users className="h-5 w-5" /></div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{totalStudents}</div>
          <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Active B.E. Undergraduate Cohort
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Avg Campus Attendance</span>
            <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-400"><Activity className="h-5 w-5" /></div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{avgAttendance}%</div>
          <div className="mt-1 text-xs text-slate-400">University Threshold: 75.0%</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Active Departments</span>
            <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400"><Building2 className="h-5 w-5" /></div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">5</div>
          <div className="mt-1 text-xs text-slate-400">CSE • AIML • ECE • ME • Civil</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Pending Fee Defaulters</span>
            <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400"><AlertCircle className="h-5 w-5" /></div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white">{feeDefaulters.length}</div>
          <div className="mt-1 text-xs text-amber-400">
            ₹{feeDefaulters.reduce((sum, s) => sum + (s.fee_due || 0), 0).toLocaleString('en-IN')} total receivable
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Department Distribution & Pass Percentage</h3>
          <p className="text-xs text-slate-400 mb-4">Enrolled headcount vs semester pass rate (%)</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.12)', borderRadius: '12px' }}
                />
                <Legend />
                <Bar dataKey="students" name="Students" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="passRate" name="Pass %" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Monthly Campus Attendance Trend</h3>
          <p className="text-xs text-slate-400 mb-4">Cumulative attendance vs 75% statutory benchmark</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_ATTENDANCE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[65, 95]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.12)', borderRadius: '12px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="attendance" name="Campus Avg %" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" name="Min Threshold (75%)" stroke="#F43F5E" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              Live Detention Risk Alerts (Attendance &lt; 75%)
            </h3>
            <p className="text-xs text-slate-400">
              {detentionRisk.length} students currently ineligible for Semester End Examinations (SEE)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-slate-400">
                <th className="py-3 px-3">USN</th>
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Dept / Sem</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Guardian Contact</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {detentionRisk.map((stu) => (
                <tr key={stu.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-mono text-xs text-cyan-400">{stu.usn}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onSelectStudent(stu)}
                      className="font-medium text-white hover:text-indigo-400 text-left"
                    >
                      {stu.full_name}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{stu.department} • Sem {stu.semester}</td>
                  <td className="py-3 px-3">
                    <span className="rounded-lg bg-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-300 border border-rose-500/30">
                      {stu.attendance_pct}% ({stu.classes_attended}/{stu.total_classes})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-400">{stu.guardian_contact}</td>
                  <td className="py-3 px-3 text-right">
                    {sentNotices[stu.usn] ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Notice Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendNotice(stu)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-200 border border-rose-500/30 hover:bg-rose-500/30 transition"
                      >
                        <Send className="h-3.5 w-3.5" /> Send Warning Notice
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}