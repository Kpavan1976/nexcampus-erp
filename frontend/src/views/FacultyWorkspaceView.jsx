import React, { useState, useEffect } from 'react';
import { CheckCheck, Save, ClipboardList, Calculator } from 'lucide-react';

export default function FacultyWorkspaceView({
  students,
  courses,
  marks,
  onSubmitAttendance,
  onSaveMarks
}) {
  const [subTab, setSubTab] = useState('attendance');
  const [selectedCourseCode, setSelectedCourseCode] = useState(courses[0]?.code || 'UE25AI3301');
  const [attendanceMap, setAttendanceMap] = useState({});
  const [marksDraft, setMarksDraft] = useState({});

  const selectedCourse = courses.find((c) => c.code === selectedCourseCode) || courses[0];

  const cohort = students.filter(
    (s) =>
      s.department === selectedCourse?.department &&
      s.semester === selectedCourse?.semester
  );

  const activeStudents = cohort.length > 0 ? cohort : students.slice(0, 8);

  useEffect(() => {
    const initialAtt = {};
    const initialMarks = {};
    activeStudents.forEach((stu) => {
      initialAtt[stu.usn] = 'Present';
      const existing = marks.find(
        (m) => m.student_usn === stu.usn && m.course_code === selectedCourseCode
      );
      initialMarks[stu.usn] = {
        ia1: existing ? existing.ia1 : 15,
        ia2: existing ? existing.ia2 : 16,
        lab: existing ? existing.lab : 8
      };
    });
    setAttendanceMap(initialAtt);
    setMarksDraft(initialMarks);
  }, [selectedCourseCode, students.length]);

  const markAllPresent = () => {
    const all = {};
    activeStudents.forEach((s) => {
      all[s.usn] = 'Present';
    });
    setAttendanceMap(all);
  };

  const handleAttendanceSubmit = () => {
    const records = activeStudents.map((s) => ({
      usn: s.usn,
      status: attendanceMap[s.usn] || 'Present'
    }));
    onSubmitAttendance({
      course_code: selectedCourseCode,
      date: new Date().toISOString().slice(0, 10),
      records
    });
  };

  const handleMarksSave = () => {
    const items = activeStudents.map((s) => {
      const m = marksDraft[s.usn] || { ia1: 0, ia2: 0, lab: 0 };
      return {
        student_usn: s.usn,
        student_name: s.full_name,
        course_code: selectedCourseCode,
        ia1: Number(m.ia1),
        ia2: Number(m.ia2),
        lab: Number(m.lab)
      };
    });
    onSaveMarks(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Faculty Academic Workspace</h1>
          <p className="text-sm text-slate-400">
            Smart attendance register & CIE Internal Assessment (IA-1, IA-2, Lab) grading
          </p>
        </div>

        <div className="flex rounded-xl border border-white/10 bg-[#111827] p-1">
          <button
            onClick={() => setSubTab('attendance')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              subTab === 'attendance' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="h-4 w-4" /> Smart Attendance Sheet
          </button>
          <button
            onClick={() => setSubTab('marks')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              subTab === 'marks' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="h-4 w-4" /> Internal Marks (CIE)
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Select Assigned Subject (Dept • Semester • Course Code)
          </label>
          <select
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
            className="w-full md:max-w-lg rounded-xl border border-white/10 bg-[#0B0F19] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
          >
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.title} ({c.department} • Sem {c.semester})
              </option>
            ))}
          </select>
        </div>

        {subTab === 'attendance' ? (
          <div className="flex items-center gap-3">
            <button
              onClick={markAllPresent}
              className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25"
            >
              <CheckCheck className="h-4 w-4" /> Mark All Present
            </button>
            <button
              onClick={handleAttendanceSubmit}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
            >
              <Save className="h-4 w-4" /> Submit Attendance
            </button>
          </div>
        ) : (
          <button
            onClick={handleMarksSave}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
          >
            <Save className="h-4 w-4" /> Save CIE Marks
          </button>
        )}
      </div>

      {subTab === 'attendance' ? (
        <div className="glass-card overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase text-slate-400">
                <th className="py-3.5 px-4">USN</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Current %</th>
                <th className="py-3.5 px-4 text-right">Session Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {activeStudents.map((stu) => {
                const status = attendanceMap[stu.usn] || 'Present';
                return (
                  <tr key={stu.usn} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-mono text-xs text-cyan-400">{stu.usn}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{stu.full_name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-semibold ${stu.attendance_pct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {stu.attendance_pct}% ({stu.classes_attended}/{stu.total_classes})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex rounded-xl border border-white/10 bg-[#0B0F19] p-1 gap-1">
                        {['Present', 'Absent', 'Late'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setAttendanceMap({ ...attendanceMap, [stu.usn]: opt })}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                              status === opt
                                ? opt === 'Present'
                                  ? 'bg-emerald-600 text-white'
                                  : opt === 'Absent'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-amber-500 text-slate-950'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase text-slate-400">
                  <th className="py-3.5 px-4">USN</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">IA-1 (20M)</th>
                  <th className="py-3.5 px-4">IA-2 (20M)</th>
                  <th className="py-3.5 px-4">Lab / Assign (10M)</th>
                  <th className="py-3.5 px-4">Total (50M)</th>
                  <th className="py-3.5 px-4 text-right">SEE Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {activeStudents.map((stu) => {
                  const row = marksDraft[stu.usn] || { ia1: 0, ia2: 0, lab: 0 };
                  const total = Number(row.ia1) + Number(row.ia2) + Number(row.lab);
                  const eligible = total >= 20 && stu.attendance_pct >= 75;
                  return (
                    <tr key={stu.usn} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono text-xs text-cyan-400">{stu.usn}</td>
                      <td className="py-3 px-4 font-medium text-white">{stu.full_name}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={row.ia1}
                          onChange={(e) =>
                            setMarksDraft({
                              ...marksDraft,
                              [stu.usn]: { ...row, ia1: Math.min(20, Math.max(0, Number(e.target.value))) }
                            })
                          }
                          className="w-20 rounded-lg border border-white/10 bg-[#0B0F19] px-2.5 py-1.5 text-sm text-white"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={row.ia2}
                          onChange={(e) =>
                            setMarksDraft({
                              ...marksDraft,
                              [stu.usn]: { ...row, ia2: Math.min(20, Math.max(0, Number(e.target.value))) }
                            })
                          }
                          className="w-20 rounded-lg border border-white/10 bg-[#0B0F19] px-2.5 py-1.5 text-sm text-white"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={row.lab}
                          onChange={(e) =>
                            setMarksDraft({
                              ...marksDraft,
                              [stu.usn]: { ...row, lab: Math.min(10, Math.max(0, Number(e.target.value))) }
                            })
                          }
                          className="w-20 rounded-lg border border-white/10 bg-[#0B0F19] px-2.5 py-1.5 text-sm text-white"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{total} / 50</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            eligible
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {eligible ? 'Eligible' : 'Shortage / Not Eligible'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}