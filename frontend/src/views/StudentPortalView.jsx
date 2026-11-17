import React, { useState, useEffect } from 'react';
import { Download, Calculator, Award, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StudentPortalView({ students, marks, onNotify, defaultUsn }) {
  const [selectedUsn, setSelectedUsn] = useState(defaultUsn || students[0]?.usn);

  useEffect(() => {
    if (defaultUsn && students.some((s) => s.usn === defaultUsn)) {
      setSelectedUsn(defaultUsn);
    } else if (!selectedUsn && students.length > 0) {
      setSelectedUsn(students[0].usn);
    }
  }, [defaultUsn, students]);

  const student = students.find((s) => s.usn === selectedUsn) || students[0];

  if (!student) return null;

  const classesNeeded =
    student.attendance_pct >= 75
      ? 0
      : Math.max(0, Math.ceil(3 * student.total_classes - 4 * student.classes_attended));

  const studentMarks = marks.filter((m) => m.student_usn === student.usn);

  const semesterHistory = Array.from({ length: student.semester }, (_, i) => {
    const sem = i + 1;
    const sgpa = Number(Math.min(9.9, Math.max(6.5, student.cgpa + ((sem % 3) - 1) * 0.22)).toFixed(2));
    return { semester: `Semester ${sem}`, credits: 22, sgpa };
  });

  const handleDownloadSummary = () => {
    const lines = [
      '====================================================',
      'NEXCAMPUS ENGINEERING UNIVERSITY — GRADE & FEE CARD',
      '====================================================',
      `Student Name : ${student.full_name}`,
      `USN          : ${student.usn}`,
      `Program      : B.E. ${student.department} (Sem ${student.semester}, Sec ${student.section})`,
      `CGPA         : ${student.cgpa} / 10.0`,
      `Attendance   : ${student.attendance_pct}% (${student.classes_attended}/${student.total_classes})`,
      `Fee Status   : ${student.fee_status} (Due: INR ${student.fee_due})`,
      '----------------------------------------------------',
      'SEMESTER SGPA RECORD:',
      ...semesterHistory.map((h) => `  ${h.semester}: SGPA ${h.sgpa} (${h.credits} Credits)`),
      '===================================================='
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student.usn}_Grade_Fee_Summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify(`Downloaded Grade & Fee Summary for ${student.usn}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Self-Service 360° Portal</h1>
          <p className="text-sm text-slate-400">Personal academic transcript, 75% attendance predictor & fee summary</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedUsn}
            onChange={(e) => setSelectedUsn(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#111827] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
          >
            {students.map((s) => (
              <option key={s.usn} value={s.usn}>
                {s.usn} — {s.full_name}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownloadSummary}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
          >
            <Download className="h-4 w-4" /> Download Grade/Fee Summary
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="rounded-md bg-cyan-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-cyan-300">
                {student.usn}
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white">{student.full_name}</h2>
              <p className="text-sm text-slate-400">
                B.E. {student.department} • Semester {student.semester} • Section {student.section} • Batch {student.batch}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase text-slate-400">Current CGPA</div>
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                {student.cgpa}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-xs text-slate-500">University Email</div>
              <div className="font-medium text-slate-200 truncate">{student.email}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Contact Phone</div>
              <div className="font-medium text-slate-200">{student.phone}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Fee Ledger Status</div>
              <div className={`font-semibold ${student.fee_status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {student.fee_status} {student.fee_due > 0 ? `(₹${student.fee_due.toLocaleString('en-IN')})` : ''}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Classes Attended</div>
              <div className="font-medium text-slate-200">{student.classes_attended} / {student.total_classes}</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-indigo-500/30">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Calculator className="h-4 w-4 text-cyan-400" />
              75% Attendance Target Calculator
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Minimum attendance required for Semester End Exam eligibility
            </p>
          </div>

          <div className="my-4">
            <div className="flex items-baseline justify-between">
              <span className={`text-4xl font-extrabold ${student.attendance_pct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {student.attendance_pct}%
              </span>
              <span className="text-xs text-slate-400">Target: 75.0%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-white/10">
              <div
                className={`h-2 rounded-full ${student.attendance_pct < 75 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                style={{ width: `${Math.min(100, student.attendance_pct)}%` }}
              />
            </div>
          </div>

          {classesNeeded > 0 ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs text-rose-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                You must attend the next <strong>{classesNeeded} consecutive classes</strong> without any absence to reach 75.0%.
              </span>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-xs text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Safe standing! You meet the 75% attendance requirement for all exams.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-indigo-400" /> Semester-Wise SGPA Progression
          </h3>
          <div className="space-y-2.5">
            {semesterHistory.map((sem) => (
              <div key={sem.semester} className="flex items-center justify-between rounded-xl bg-[#0B0F19] px-4 py-3 border border-white/[0.06]">
                <div>
                  <div className="text-sm font-semibold text-white">{sem.semester}</div>
                  <div className="text-xs text-slate-400">{sem.credits} Credits Earned</div>
                </div>
                <span className="rounded-lg bg-indigo-500/20 px-3 py-1 font-mono text-sm font-bold text-indigo-300">
                  SGPA {sem.sgpa}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Subject Attendance & CIE Marks</h3>
          <div className="space-y-3">
            {(student.subject_breakdown || []).map((sub, i) => {
              const pct = Math.round((sub.attended / (sub.total || 1)) * 100);
              return (
                <div key={i} className="rounded-xl bg-[#0B0F19] p-3.5 border border-white/[0.06]">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-white">{sub.code} — {sub.subject}</span>
                    <span className={`font-semibold ${pct < 75 ? 'text-rose-400' : 'text-cyan-400'}`}>{pct}%</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Attended {sub.attended} of {sub.total} sessions
                  </div>
                </div>
              );
            })}

            {studentMarks.map((m) => (
              <div key={m.id} className="rounded-xl bg-indigo-500/10 p-3.5 border border-indigo-500/25 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-cyan-300">{m.course_code} CIE Score</div>
                  <div className="text-xs text-slate-300">IA-1: {m.ia1}/20 • IA-2: {m.ia2}/20 • Lab: {m.lab}/10</div>
                </div>
                <div className="text-sm font-bold text-white">{m.ia1 + m.ia2 + m.lab} / 50</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}