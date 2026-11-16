import React, { useState } from 'react';
import {
  UserPlus,
  Download,
  Search,
  Edit3,
  Trash2,
  Eye,
  Filter
} from 'lucide-react';
import StudentFormDrawer from '../components/StudentFormDrawer';

export default function StudentDirectoryView({
  students,
  role,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudent,
  onNotify
}) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [semFilter, setSemFilter] = useState('ALL');
  const [feeFilter, setFeeFilter] = useState('ALL');
  const [shortageOnly, setShortageOnly] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesQuery =
      s.full_name.toLowerCase().includes(q) ||
      s.usn.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    const matchesSem = semFilter === 'ALL' || String(s.semester) === semFilter;
    const matchesFee = feeFilter === 'ALL' || s.fee_status === feeFilter;
    const matchesShortage = !shortageOnly || s.attendance_pct < 75;
    return matchesQuery && matchesDept && matchesSem && matchesFee && matchesShortage;
  });

  const handleExportCSV = () => {
    const headers = ['USN', 'Full Name', 'Email', 'Phone', 'Department', 'Semester', 'Section', 'Batch', 'Attendance %', 'CGPA', 'Fee Status', 'Guardian Contact'];
    const rows = filtered.map((s) => [
      s.usn,
      `"${s.full_name}"`,
      s.email,
      `"${s.phone}"`,
      s.department,
      s.semester,
      s.section,
      s.batch,
      s.attendance_pct,
      s.cgpa,
      s.fee_status,
      `"${s.guardian_contact}"`
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexcampus_students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify(`Exported ${filtered.length} student records to CSV.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Directory & Records</h1>
          <p className="text-sm text-slate-400">
            Showing {filtered.length} of {students.length} enrolled engineering students
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111827] px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-cyan-500/40 hover:text-white transition"
          >
            <Download className="h-4 w-4 text-cyan-400" /> Export CSV
          </button>

          {role === 'Admin' && (
            <button
              onClick={() => {
                setEditingStudent(null);
                setDrawerOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition"
            >
              <UserPlus className="h-4 w-4" /> Add New Student
            </button>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
        <div className="lg:col-span-2 relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by USN, Name, Email..."
            className="w-full rounded-xl border border-white/10 bg-[#0B0F19] pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="ALL">All Departments</option>
          {['AIML', 'CSE', 'ISE', 'ECE', 'ME', 'CIVIL'].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={semFilter}
          onChange={(e) => setSemFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="ALL">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={String(s)}>Semester {s}</option>
          ))}
        </select>

        <select
          value={feeFilter}
          onChange={(e) => setFeeFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="ALL">All Fee Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
        </select>

        <button
          onClick={() => setShortageOnly(!shortageOnly)}
          className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            shortageOnly
              ? 'border-rose-500/50 bg-rose-500/20 text-rose-200'
              : 'border-white/10 bg-[#0B0F19] text-slate-300 hover:border-white/20'
          }`}
        >
          <Filter className="h-3.5 w-3.5" /> Attendance &lt; 75%
        </button>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase text-slate-400">
                <th className="py-3.5 px-4">USN</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Dept / Sem</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-4">Fee Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((stu) => (
                <tr key={stu.id} className="hover:bg-white/[0.03] transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-cyan-400">{stu.usn}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSelectStudent(stu)}
                      className="font-semibold text-white hover:text-indigo-400 text-left"
                    >
                      {stu.full_name}
                    </button>
                    <div className="text-xs text-slate-500">{stu.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="rounded bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-300 mr-1.5">
                      {stu.department}
                    </span>
                    Sem {stu.semester}-{stu.section}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        stu.attendance_pct < 75
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-300'
                      }`}
                    >
                      {stu.attendance_pct}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">{stu.cgpa.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        stu.fee_status === 'Paid'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : stu.fee_status === 'Partial'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {stu.fee_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectStudent(stu)}
                        title="Student 360° Profile"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-cyan-400"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {role === 'Admin' && (
                        <>
                          <button
                            onClick={() => {
                              setEditingStudent(stu);
                              setDrawerOpen(true);
                            }}
                            title="Edit Student"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-indigo-400"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(stu)}
                            title="Delete Student"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/15 hover:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StudentFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialStudent={editingStudent}
        onSave={(data) => {
          if (editingStudent) {
            onUpdateStudent(editingStudent.id, data);
          } else {
            onAddStudent(data);
          }
        }}
      />
    </div>
  );
}