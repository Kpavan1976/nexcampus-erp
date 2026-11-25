import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  ClipboardEdit,
  GraduationCap,
  Clock,
  FileText,
  AlertTriangle,
  Mail,
  BellRing,
  UserCheck,
  Lock,
  Check,
  X,
  Calendar,
} from 'lucide-react';

const INITIAL_SCHEDULE = [
  {
    id: 'cls-1',
    time: '09:00 AM - 10:30 AM',
    code: '22AI31 (A)',
    title: 'Foundations of Artificial Intelligence',
    room: 'LH-204',
    status: 'completed',
    pct: 94.2,
  },
  {
    id: 'cls-2',
    time: '11:15 AM - 12:45 PM',
    code: '22AI32 (A)',
    title: 'Data Structures & Algorithms in Python',
    room: 'AIML-Lab-1',
    status: 'pending',
    pct: 0,
  },
  {
    id: 'cls-3',
    time: '02:00 PM - 04:00 PM',
    code: '22AIL36 (B)',
    title: 'Machine Learning & Python Lab',
    room: 'Lab-3',
    status: 'scheduled',
    pct: null,
  },
];

const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    type: 'Course Drop / Elective Change',
    student: 'Rohan Kulkarni',
    usn: '4GM25AI041',
    detail: 'Requesting elective switch to 22AI35B (Computer Vision)',
    attachment: null,
    status: 'pending',
    actionMode: 'approve-reject',
  },
  {
    id: 'req-2',
    type: 'Medical Leave Approval: for 22AI31 (Nov 24–25)',
    student: 'Ananya Deshpande',
    usn: '4GM25AI012',
    detail: '2 days medical absence',
    attachment: 'Ananya_medical_cert.pdf',
    status: 'pending',
    actionMode: 'verify',
  },
  {
    id: 'req-3',
    type: 'Credit Overload / Hackathon OD Request',
    student: 'Karthik Gowda',
    usn: '4GM25AI029',
    detail: 'Requesting OD attendance credit for NEXORA Hackathon',
    attachment: null,
    status: 'pending',
    actionMode: 'review',
  },
];

const INITIAL_EXAMS = [
  {
    id: 'ex-1',
    label: '22AI31 CIE-1 Assessment (In progress - 58/64 graded)',
    state: 'in_progress',
    cta: 'Enter Grades',
  },
  {
    id: 'ex-2',
    label: '22AI32 Quiz & Assignment 2 (Not Started - 0/64 graded)',
    state: 'not_started',
    cta: 'Start Entry',
  },
  {
    id: 'ex-3',
    label: '22AIL36 Lab Internal Evaluation (Submitted & Locked)',
    state: 'locked',
    cta: 'Locked',
  },
];

const FALLBACK_ALERTS = [
  {
    id: 'al-1',
    full_name: 'Ananya Deshpande',
    usn: '4GM25AI012',
    subject: '22AI31',
    attendance_pct: 68.2,
    severity: 'Low Attendance',
    actionLabel: 'Send Warn Email',
  },
  {
    id: 'al-2',
    full_name: 'Darshan Hegde',
    usn: '4GM25AI019',
    subject: '22AI32',
    attendance_pct: 71.5,
    severity: 'Yellow Alert',
    actionLabel: 'Send Alert',
  },
  {
    id: 'al-3',
    full_name: 'Meghana Patil',
    usn: '4GM25AI034',
    subject: '22AI31',
    attendance_pct: 74.0,
    severity: 'Borderline',
    actionLabel: 'Check Profile',
  },
];

export default function FacultyWorkspaceView({
  user,
  students = [],
  shortageStudents = [],
  onSelectStudent,
  onNavigate,
  onNotify,
}) {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [alertSentIds, setAlertSentIds] = useState({});

  const notify = (msg, type = 'success') => {
    if (onNotify) onNotify(msg, type);
  };

  // Dynamic KPI metrics
  const totalEnrolled = students.length > 0 ? students.length : 128;
  const markedClassesCount = schedule.filter((c) => c.status === 'completed').length;
  const pendingExamsCount = exams.filter((e) => e.state !== 'locked').length;
  const gradeProgressPct = useMemo(() => {
    const lockedCount = exams.filter((e) => e.state === 'locked').length;
    const inProgCount = exams.filter((e) => e.state === 'in_progress').length;
    return Math.min(100, Math.round(((lockedCount * 100 + inProgCount * 84) / exams.length)));
  }, [exams]);

  // Merge real shortageStudents from App.jsx if available, otherwise use realistic fallback
  const welfareAlerts = useMemo(() => {
    if (shortageStudents && shortageStudents.length > 0) {
      return shortageStudents.slice(0, 4).map((stu, idx) => {
        const pct = Number(stu.attendance_pct ?? 70);
        return {
          ...stu,
          subject: stu.department ? `22${stu.department}31` : '22AI31',
          severity: pct < 70 ? 'Low Attendance' : pct < 73 ? 'Yellow Alert' : 'Borderline',
          actionLabel: idx === 0 ? 'Send Warn Email' : idx === 1 ? 'Send Alert' : 'Check Profile',
        };
      });
    }
    return FALLBACK_ALERTS;
  }, [shortageStudents]);

  const handleMarkAttendance = (cls) => {
    if (cls.status === 'completed') {
      if (onNavigate) onNavigate('attendance');
      return;
    }
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === cls.id ? { ...item, status: 'completed', pct: 92.5 } : item
      )
    );
    notify(`Attendance marked for ${cls.code} (${cls.room}).`);
  };

  const handleRequestAction = (reqId, decision) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: decision } : r))
    );
    notify(`Student request marked as ${decision}.`);
  };

  const handleExamAction = (exam) => {
    if (exam.state === 'locked') return;
    if (onNavigate) {
      onNavigate('attendance');
    }
    setExams((prev) =>
      prev.map((ex) =>
        ex.id === exam.id
          ? {
              ...ex,
              state: 'in_progress',
              label: ex.label.replace('Not Started - 0/64 graded', 'In progress - 32/64 graded'),
              cta: 'Enter Grades',
            }
          : ex
      )
    );
    notify(`Opened grade entry sheet for ${exam.label.split(' ')[0]}.`, 'info');
  };

  const handleWelfareAction = (item) => {
    if (item.actionLabel === 'Check Profile' && onSelectStudent && item.usn) {
      onSelectStudent(item);
      return;
    }
    setAlertSentIds((prev) => ({ ...prev, [item.id]: true }));
    notify(`Attendance shortage warning dispatched to ${item.full_name} (${item.usn}).`);
  };

  const facultyDisplayName = user?.full_name || 'Dr. Raghavendra Kulkarni';

  return (
    <div className="space-y-6">
      {/* =====================================================================
          WELCOME HEADER BANNER
      ====================================================================== */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
              Dashboard Workspace
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white">
            Welcome Back, {facultyDisplayName}
          </h1>
          <p className="text-xs text-slate-400">
            Academic Session: 2026-2027 (Odd Semester) • {user?.department || 'Department of AIML'}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B0F19]/90 px-3.5 py-2 text-xs text-slate-300 self-start sm:self-auto">
          <Calendar className="h-4 w-4 text-cyan-400" />
          <span>Today&apos;s Date: Wednesday, November 25, 2026</span>
        </div>
      </div>

      {/* =====================================================================
          TOP 4 KPI SUMMARY CARDS
      ====================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Total Students Enrolled */}
        <div
          onClick={() => onNavigate && onNavigate('students')}
          className="cursor-pointer rounded-2xl border border-sky-400/25 bg-gradient-to-br from-sky-500/15 via-[#131D2E] to-[#111827] p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-sky-400/50"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Total Students Enrolled</span>
            <Users className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2.5 text-3xl font-extrabold text-white">{totalEnrolled}</div>
          <div className="mt-1 text-[11px] text-sky-300/90">across 3 active courses</div>
        </div>

        {/* Card 2: Attendance Tracked Today */}
        <div
          onClick={() => onNavigate && onNavigate('attendance')}
          className="cursor-pointer rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-500/15 via-[#211C18] to-[#111827] p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-amber-400/50"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Attendance Tracked Today</span>
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2.5 text-3xl font-extrabold text-white">
            {markedClassesCount} of {schedule.length}
          </div>
          <div className="mt-1 text-[11px] text-amber-300/90">Classes marked</div>
        </div>

        {/* Card 3: Grade Entry Progress */}
        <div
          onClick={() => onNavigate && onNavigate('attendance')}
          className="cursor-pointer rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/15 via-[#122421] to-[#111827] p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-400/50"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Grade Entry Progress</span>
            <ClipboardEdit className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2.5 text-3xl font-extrabold text-white">{gradeProgressPct}%</div>
          <div className="mt-1 text-[11px] text-emerald-300/90">
            {pendingExamsCount} assessment sheets active
          </div>
        </div>

        {/* Card 4: Academic Advisees */}
        <div
          onClick={() => onNavigate && onNavigate('students')}
          className="cursor-pointer rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-indigo-500/15 via-[#171B2E] to-[#111827] p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-indigo-400/50"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Academic Advisees</span>
            <GraduationCap className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2.5 text-3xl font-extrabold text-white">22</div>
          <div className="mt-1 text-[11px] text-indigo-300/90">mentees assigned</div>
        </div>
      </div>

      {/* =====================================================================
          MIDDLE ROW: TODAY'S TIMETABLE & STUDENT REQUESTS
      ====================================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Today's Timetable & Attendance Status (7 cols) */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl xl:col-span-7">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white">
              Today&apos;s Timetable &amp; Attendance Status
            </h2>
            <span className="text-[11px] text-slate-400">Live Class Tracker</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-2.5 pr-3">Time</th>
                  <th className="pb-2.5 pr-3">Class</th>
                  <th className="pb-2.5 pr-3">Room</th>
                  <th className="pb-2.5 text-right">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {schedule.map((cls) => (
                  <tr key={cls.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span>{cls.time}</span>
                      </div>
                    </td>

                    <td className="py-3.5 pr-3">
                      <div className="font-bold text-white">{cls.code}</div>
                      <div className="text-[11px] text-slate-400">{cls.title}</div>
                    </td>

                    <td className="py-3.5 pr-3 font-medium text-slate-300 whitespace-nowrap">
                      {cls.room}
                    </td>

                    <td className="py-3.5 text-right whitespace-nowrap">
                      {cls.status === 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleMarkAttendance(cls)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 transition"
                        >
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          Attendance Complete ({cls.pct}%)
                        </button>
                      )}

                      {cls.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleMarkAttendance(cls)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/60 bg-rose-500/25 px-3.5 py-1.5 text-[11px] font-bold text-rose-200 shadow-lg shadow-rose-500/20 hover:bg-rose-500/40 transition"
                        >
                          <span className="h-2 w-2 animate-ping rounded-full bg-rose-400" />
                          Take Attendance (0%)
                        </button>
                      )}

                      {cls.status === 'scheduled' && (
                        <button
                          type="button"
                          onClick={() => handleMarkAttendance(cls)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-white transition"
                        >
                          <span className="h-2 w-2 rounded-full bg-slate-400" />
                          Scheduled
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Student Requests (Approvals Pending) (5 cols) */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl xl:col-span-5">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white">
              Student Requests (Approvals Pending)
            </h2>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              {requests.filter((r) => r.status === 'pending').length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col justify-between gap-2.5 rounded-xl border border-white/10 bg-[#0B0F19]/85 p-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{req.type}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {req.student} (<span className="font-mono text-cyan-400">{req.usn}</span>)
                  </div>
                  {req.attachment ? (
                    <div className="mt-1 inline-flex items-center gap-1 rounded bg-rose-500/15 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                      <FileText className="h-3 w-3" /> {req.attachment}
                    </div>
                  ) : (
                    <div className="mt-0.5 text-[10px] text-slate-500 truncate">{req.detail}</div>
                  )}
                </div>

                <div className="shrink-0">
                  {req.status !== 'pending' ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {req.status === 'Approved' ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      {req.status}
                    </span>
                  ) : req.actionMode === 'approve-reject' ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRequestAction(req.id, 'Approved')}
                        className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/25"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestAction(req.id, 'Rejected')}
                        className="rounded-lg border border-rose-500/40 bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/25"
                      >
                        Reject
                      </button>
                    </div>
                  ) : req.actionMode === 'verify' ? (
                    <button
                      type="button"
                      onClick={() => handleRequestAction(req.id, 'Approved')}
                      className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/25"
                    >
                      Verify &amp; Approve
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestAction(req.id, 'Approved')}
                      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200 hover:border-indigo-400/50"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM ROW: CIE / MID-TERM MARKS ENTRY & ATTENDANCE ALERTS
      ====================================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Mid-Term / Continuous Assessment Marks Entry (7 cols) */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl xl:col-span-7">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white">
              Mid-Term / Continuous Assessment (CIE) Marks Entry
            </h2>
            <span className="text-[11px] text-slate-400">Current Exam &amp; Test Uploads</span>
          </div>

          <div className="space-y-3">
            {exams.map((exam) => {
              const isLocked = exam.state === 'locked';
              return (
                <div
                  key={exam.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                    isLocked
                      ? 'border-emerald-500/40 bg-emerald-600/25 text-emerald-100'
                      : 'border-white/10 bg-[#0B0F19]/85 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    {isLocked && <Lock className="h-3.5 w-3.5 text-emerald-300 shrink-0" />}
                    <span>{exam.label}</span>
                  </div>

                  {!isLocked ? (
                    <button
                      type="button"
                      onClick={() => handleExamAction(exam)}
                      className="shrink-0 rounded-lg border border-sky-400/40 bg-sky-500/15 px-3.5 py-1.5 text-[11px] font-bold text-sky-300 hover:bg-sky-500/25 transition"
                    >
                      {exam.cta}
                    </button>
                  ) : (
                    <span className="shrink-0 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Verified
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Student Welfare & Attendance Alerts (< 75%) (5 cols) */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl xl:col-span-5">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              Student Welfare &amp; Attendance Alerts (&lt; 75%)
            </h2>
          </div>

          <div className="space-y-2.5">
            {welfareAlerts.map((item) => {
              const isLow = item.attendance_pct < 70;
              const isYellow = item.attendance_pct >= 70 && item.attendance_pct < 73;
              const alreadyNotified = alertSentIds[item.id];

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#0B0F19]/85 px-3.5 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-white">
                      {item.full_name} ({item.subject}) -{' '}
                      <span
                        className={
                          isLow
                            ? 'text-rose-400'
                            : isYellow
                            ? 'text-amber-400'
                            : 'text-yellow-300'
                        }
                      >
                        {item.attendance_pct}%
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                      <span className="font-mono text-slate-400">{item.usn}</span>
                      <span
                        className={`font-semibold ${
                          isLow
                            ? 'text-rose-400'
                            : isYellow
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}
                      >
                        • {item.severity}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleWelfareAction(item)}
                    className={`shrink-0 inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition ${
                      alreadyNotified
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                        : isLow
                        ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                        : isYellow
                        ? 'border-yellow-500/40 bg-yellow-500/15 text-yellow-200 hover:bg-yellow-500/25'
                        : 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25'
                    }`}
                  >
                    {alreadyNotified ? (
                      <>
                        <Check className="h-3 w-3" /> Sent
                      </>
                    ) : item.actionLabel === 'Send Warn Email' ? (
                      <>
                        <Mail className="h-3 w-3" /> {item.actionLabel}
                      </>
                    ) : item.actionLabel === 'Send Alert' ? (
                      <>
                        <BellRing className="h-3 w-3" /> {item.actionLabel}
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3 w-3" /> {item.actionLabel}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}