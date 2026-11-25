import React, { useState, useMemo } from 'react';
import {
  Users,
  GraduationCap,
  Briefcase,
  Award,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar as CalendarIcon,
  MessageSquare,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const ATTENDANCE_DATA = {
  AIML: [
    { day: 'Mon', present: 92, absent: 8 },
    { day: 'Tue', present: 88, absent: 12 },
    { day: 'Wed', present: 95, absent: 5 },
    { day: 'Thu', present: 90, absent: 10 },
    { day: 'Fri', present: 86, absent: 14 },
  ],
  CSE: [
    { day: 'Mon', present: 89, absent: 11 },
    { day: 'Tue', present: 91, absent: 9 },
    { day: 'Wed', present: 94, absent: 6 },
    { day: 'Thu', present: 87, absent: 13 },
    { day: 'Fri', present: 84, absent: 16 },
  ],
  All: [
    { day: 'Mon', present: 91, absent: 9 },
    { day: 'Tue', present: 89, absent: 11 },
    { day: 'Wed', present: 95, absent: 5 },
    { day: 'Thu', present: 88, absent: 12 },
    { day: 'Fri', present: 85, absent: 15 },
  ],
};

const WEEK_DAYS = [
  { label: 'Sun', date: 22 },
  { label: 'Mon', date: 23 },
  { label: 'Tue', date: 24 },
  { label: 'Wed', date: 25 },
  { label: 'Thu', date: 26 },
  { label: 'Fri', date: 27 },
  { label: 'Sat', date: 28 },
];

const AGENDA_BY_DATE = {
  25: [
    {
      time: '08:00 am',
      tag: 'All Departments',
      title: 'Morning Briefing & Attendance Sync',
      accent: 'border-indigo-400/40 bg-indigo-500/15 text-indigo-200',
    },
    {
      time: '10:00 am',
      tag: 'AIML • Sem 3',
      title: 'CIE-2 Question Paper Audit & Review',
      accent: 'border-amber-400/40 bg-amber-500/15 text-amber-200',
    },
    {
      time: '02:15 pm',
      tag: 'CSE & ISE',
      title: 'Lab Infrastructure & Timetable Check',
      accent: 'border-cyan-400/40 bg-cyan-500/15 text-cyan-200',
    },
  ],
  default: [
    {
      time: '09:00 am',
      tag: 'Administration',
      title: 'Faculty Leave & OD Approval Window',
      accent: 'border-indigo-400/40 bg-indigo-500/15 text-indigo-200',
    },
    {
      time: '11:30 am',
      tag: 'Academic Cell',
      title: 'Syllabus Coverage & Shortage Review',
      accent: 'border-amber-400/40 bg-amber-500/15 text-amber-200',
    },
    {
      time: '03:00 pm',
      tag: 'Student 360°',
      title: 'Mentor-Mentee Progress Verification',
      accent: 'border-cyan-400/40 bg-cyan-500/15 text-cyan-200',
    },
  ],
};

const RECENT_MESSAGES = [
  {
    id: 'm1',
    sender: 'Dr. Raghavendra Kulkarni',
    role: 'HOD • AIML',
    time: '09:00 AM',
    text: 'IA-1 and IA-2 marks for Sem 3 AIML have been verified and locked.',
    initials: 'RK',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  },
  {
    id: 'm2',
    sender: 'Prof. Sneha Deshmukh',
    role: 'Class Coordinator',
    time: '10:15 AM',
    text: 'Submitted revised lab batch allocation for 22AIL36 Python & DSA Lab.',
    initials: 'SD',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'm3',
    sender: 'Dr. Ananya Rao',
    role: 'Associate Prof • CSE',
    time: '11:40 AM',
    text: 'VTU BOE scrutiny duty report uploaded under On-Duty leave record.',
    initials: 'AR',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
];

export default function DashboardView({
  students = [],
  faculty = [],
  onNavigate,
}) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [timeframe, setTimeframe] = useState('Weekly');
  const [hoveredDay, setHoveredDay] = useState('Wed');
  const [selectedDate, setSelectedDate] = useState(25);

  // Dynamic counts with realistic fallbacks so KPIs look rich immediately
  const totalStudents = students.length > 0 ? students.length : 1248;
  const totalFaculty = faculty.length > 0 ? faculty.length : 86;
  const totalStaff = 42;
  const totalAwards = 164;

  // Gender / Cohort split calculation for Donut Chart
  const { maleCount, femaleCount, malePct, femalePct } = useMemo(() => {
    if (students.length > 0) {
      const females = students.filter(
        (s) => s.gender?.toLowerCase() === 'female' || s.gender?.toLowerCase() === 'f'
      ).length;
      const males = Math.max(0, students.length - females);
      if (females > 0) {
        const fPct = Math.round((females / students.length) * 100);
        return {
          maleCount: males,
          femaleCount: females,
          malePct: 100 - fPct,
          femalePct: fPct,
        };
      }
    }
    return {
      maleCount: 661,
      femaleCount: 587,
      malePct: 53,
      femalePct: 47,
    };
  }, [students]);

  const bars = ATTENDANCE_DATA[selectedDept] || ATTENDANCE_DATA.All;
  const activeAgenda = AGENDA_BY_DATE[selectedDate] || AGENDA_BY_DATE.default;

  // SVG Donut Ring geometry
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const maleStroke = (malePct / 100) * circumference;
  const femaleStroke = (femalePct / 100) * circumference;

  const kpiCards = [
    {
      title: 'Students',
      value: totalStudents.toLocaleString(),
      trend: '+15%',
      icon: GraduationCap,
      cardStyle:
        'border-indigo-400/30 bg-gradient-to-br from-indigo-500/20 via-[#151C2E] to-[#111827]',
      pillStyle: 'bg-indigo-400/20 text-indigo-200 border-indigo-400/30',
      iconColor: 'text-indigo-300',
      targetTab: 'students',
    },
    {
      title: 'Faculty',
      value: totalFaculty.toLocaleString(),
      trend: '+6%',
      icon: Users,
      cardStyle:
        'border-amber-400/30 bg-gradient-to-br from-amber-400/20 via-[#1C1B22] to-[#111827]',
      pillStyle: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
      iconColor: 'text-amber-300',
      targetTab: 'courses',
    },
    {
      title: 'Admin & Lab Staff',
      value: totalStaff.toLocaleString(),
      trend: '+3%',
      icon: Briefcase,
      cardStyle:
        'border-violet-400/30 bg-gradient-to-br from-violet-500/20 via-[#17172B] to-[#111827]',
      pillStyle: 'bg-violet-400/20 text-violet-200 border-violet-400/30',
      iconColor: 'text-violet-300',
      targetTab: 'courses',
    },
    {
      title: 'Merit & Hackathons',
      value: totalAwards.toLocaleString(),
      trend: '+12%',
      icon: Award,
      cardStyle:
        'border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 via-[#11212B] to-[#111827]',
      pillStyle: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/30',
      iconColor: 'text-cyan-300',
      targetTab: 'portal',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      {/* =====================================================================
          CENTER ANALYTICS WORKSPACE (8 COLUMNS ON DESKTOP)
      ====================================================================== */}
      <div className="space-y-6 xl:col-span-8">
        {/* Top 4 Pastel-Glow Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => onNavigate && onNavigate(card.targetTab)}
                className={`group cursor-pointer rounded-2xl border p-4 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${card.cardStyle}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${card.pillStyle}`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {card.trend}
                  </span>
                  <button
                    type="button"
                    aria-label={card.title}
                    className="text-slate-400 transition group-hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-extrabold tracking-tight text-white">
                      {card.value}
                    </div>
                    <div className="mt-0.5 text-xs font-medium text-slate-300">
                      {card.title}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/25 p-2">
                    <Icon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Middle Analytics Row: Donut Chart + Grouped Attendance Bar Chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Students Ratio Donut Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl lg:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Students</h2>
                <p className="text-[11px] text-slate-400">Active cohort distribution</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('students')}
                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white"
                title="Open Student Directory"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            {/* Dual-Arc SVG Ring */}
            <div className="relative my-5 flex items-center justify-center">
              <svg className="h-44 w-44 -rotate-90 transform" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="14"
                />
                {/* Cyan / Sky Arc (Boys / Male) */}
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="transparent"
                  stroke="#38BDF8"
                  strokeWidth="14"
                  strokeDasharray={`${maleStroke} ${circumference}`}
                  strokeLinecap="round"
                />
                {/* Warm Amber / Gold Arc (Girls / Female) */}
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="transparent"
                  stroke="#FBBF24"
                  strokeWidth="14"
                  strokeDasharray={`${femaleStroke} ${circumference}`}
                  strokeDashoffset={-maleStroke}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute flex flex-col items-center text-center">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-1.5 rounded-full bg-sky-400" />
                  <span className="h-3 w-1.5 rounded-full bg-amber-400" />
                </div>
                <span className="mt-1 text-lg font-extrabold text-white">
                  {totalStudents.toLocaleString()}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">
                  Enrolled
                </span>
              </div>
            </div>

            {/* Bottom Legend Stats */}
            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                  <span className="text-sm font-bold text-white">
                    {maleCount.toLocaleString()}
                  </span>
                </div>
                <div className="pl-4 text-[11px] text-slate-400">
                  Male ({malePct}%)
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="text-sm font-bold text-white">
                    {femaleCount.toLocaleString()}
                  </span>
                </div>
                <div className="pl-4 text-[11px] text-slate-400">
                  Female ({femalePct}%)
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Grouped Bar Chart Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white">Attendance</h2>
                <div className="mt-1 flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    Total Present
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                    Total Absent
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0B0F19] px-2.5 py-1.5 text-[11px] font-medium text-slate-300 focus:outline-none"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0B0F19] px-2.5 py-1.5 text-[11px] font-medium text-cyan-300 focus:outline-none"
                >
                  <option value="All">All Depts</option>
                  <option value="AIML">AIML</option>
                  <option value="CSE">CSE</option>
                </select>
              </div>
            </div>

            {/* Bar Chart Plot Area */}
            <div className="relative mt-6 flex h-52 items-end justify-between gap-3 border-b border-white/10 px-2 pb-2 pt-8">
              {/* Horizontal Guide Lines */}
              <div className="pointer-events-none absolute inset-x-0 top-6 flex flex-col justify-between h-44 text-[10px] text-slate-500">
                <div className="border-b border-dashed border-white/[0.06] pb-1">100%</div>
                <div className="border-b border-dashed border-white/[0.06] pb-1">75%</div>
                <div className="border-b border-dashed border-white/[0.06] pb-1">50%</div>
                <div className="border-b border-dashed border-white/[0.06] pb-1">25%</div>
              </div>

              {bars.map((item) => {
                const isHighlighted = hoveredDay === item.day;
                return (
                  <div
                    key={item.day}
                    onMouseEnter={() => setHoveredDay(item.day)}
                    className="relative z-10 flex flex-1 flex-col items-center"
                  >
                    {/* Floating Tooltip Badge */}
                    {isHighlighted && (
                      <div className="mb-2 rounded-xl border border-white/15 bg-[#0B0F19] px-2.5 py-1 text-center shadow-lg">
                        <div className="text-xs font-extrabold text-white">
                          {item.present}%
                        </div>
                        <div className="text-[9px] text-amber-300">Present</div>
                      </div>
                    )}

                    {/* Paired Pill Bars */}
                    <div className="flex h-36 items-end gap-1.5">
                      <div
                        style={{ height: `${item.present}%` }}
                        className={`w-3 sm:w-3.5 rounded-t-full transition-all duration-300 ${
                          isHighlighted
                            ? 'bg-amber-400 shadow-lg shadow-amber-400/30'
                            : 'bg-amber-400/75 hover:bg-amber-400'
                        }`}
                      />
                      <div
                        style={{ height: `${Math.max(14, item.absent * 2.2)}%` }}
                        className={`w-3 sm:w-3.5 rounded-t-full transition-all duration-300 ${
                          isHighlighted
                            ? 'bg-sky-400 shadow-lg shadow-sky-400/30'
                            : 'bg-sky-400/70 hover:bg-sky-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Day Labels */}
            <div className="mt-2 flex justify-between px-2 text-xs font-medium text-slate-400">
              {bars.map((item) => (
                <div
                  key={item.day}
                  className={`flex-1 text-center ${
                    hoveredDay === item.day ? 'font-bold text-white' : ''
                  }`}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          RIGHT RAIL: CALENDAR + AGENDA TIMELINE + MESSAGES (4 COLUMNS)
      ====================================================================== */}
      <div className="space-y-6 xl:col-span-4">
        {/* Mini Interactive Week Calendar */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedDate((d) => (d > 22 ? d - 1 : 28))}
              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <CalendarIcon className="h-4 w-4 text-cyan-400" />
              <span>November 2026</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDate((d) => (d < 28 ? d + 1 : 22))}
              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {WEEK_DAYS.map((w) => {
              const active = selectedDate === w.date;
              return (
                <button
                  key={w.date}
                  type="button"
                  onClick={() => setSelectedDate(w.date)}
                  className={`flex flex-col items-center rounded-xl py-2 transition ${
                    active
                      ? 'bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-400/25'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] uppercase">{w.label}</span>
                  <span className="mt-1 text-xs font-bold">{w.date}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Agenda Timeline */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl">
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Agenda</h3>
            <span className="text-[11px] text-slate-400">Nov {selectedDate}, 2026</span>
          </div>

          <div className="space-y-3">
            {activeAgenda.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-16 shrink-0 text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {item.time}
                </div>
                <div className={`flex-1 rounded-xl border px-3 py-2.5 ${item.accent}`}>
                  <div className="text-[10px] font-semibold opacity-80">{item.tag}</div>
                  <div className="text-xs font-bold text-white">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Faculty & Admin Messages */}
        <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl">
          <div className="mb-3.5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-400" />
              Messages
            </h3>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('courses')}
              className="text-[11px] font-semibold text-cyan-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-[#0B0F19]/80 p-3"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${msg.badgeColor}`}
                >
                  {msg.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-xs font-bold text-white">{msg.sender}</div>
                    <span className="shrink-0 text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <div className="text-[10px] text-cyan-400">{msg.role}</div>
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-300">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}