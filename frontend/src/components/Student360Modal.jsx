import React from 'react';
import { X, Mail, Phone, ShieldAlert, Award, CreditCard, BookOpen } from 'lucide-react';

export default function Student360Modal({ student, onClose }) {
  if (!student) return null;

  const classesNeeded =
    student.attendance_pct >= 75
      ? 0
      : Math.max(0, Math.ceil(3 * student.total_classes - 4 * student.classes_attended));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#111827] shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-cyan-600/10 p-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-white">{student.full_name}</h2>
              <span className="rounded-md bg-indigo-500/20 px-2.5 py-0.5 font-mono text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                {student.usn}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-300">
              B.E. {student.department} • Semester {student.semester} (Section {student.section}) • Batch {student.batch}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-cyan-400" /> {student.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-cyan-400" /> {student.phone}</span>
              <span className="flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5 text-amber-400" /> Guardian: {student.guardian_contact}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-[#0B0F19] p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Award className="h-4 w-4 text-indigo-400" /> Cumulative GPA
              </div>
              <div className="mt-1 text-2xl font-bold text-white">{student.cgpa} <span className="text-xs font-normal text-slate-500">/ 10.0</span></div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0B0F19] p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <BookOpen className="h-4 w-4 text-cyan-400" /> Overall Attendance
              </div>
              <div className={`mt-1 text-2xl font-bold ${student.attendance_pct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {student.attendance_pct}%
              </div>
              <div className="text-[11px] text-slate-400">
                {student.classes_attended}/{student.total_classes} classes {classesNeeded > 0 ? `(Need +${classesNeeded})` : '(Safe)'}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0B0F19] p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CreditCard className="h-4 w-4 text-amber-400" /> Fee Ledger
              </div>
              <div className="mt-1 text-lg font-bold text-white">{student.fee_status}</div>
              <div className="text-[11px] text-slate-400">
                {student.fee_due > 0 ? `Balance: ₹${student.fee_due.toLocaleString('en-IN')}` : 'No Dues Pending'}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Subject-Wise Attendance Breakdown
            </h3>
            <div className="space-y-2.5">
              {(student.subject_breakdown || []).map((sub, i) => {
                const pct = Math.round((sub.attended / (sub.total || 1)) * 100);
                return (
                  <div key={i} className="rounded-xl border border-white/10 bg-[#0B0F19]/80 p-3.5">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-mono text-xs text-cyan-400 mr-2">{sub.code}</span>
                        <span className="font-medium text-white">{sub.subject}</span>
                      </div>
                      <span className={`font-semibold ${pct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {sub.attended}/{sub.total} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className={`h-1.5 rounded-full ${pct < 75 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}