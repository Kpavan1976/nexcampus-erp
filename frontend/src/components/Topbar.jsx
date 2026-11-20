import React, { useState } from 'react';
import { Search, Bell, Shield, UserCheck, AlertTriangle } from 'lucide-react';
import AnimatedLogoutButton from './AnimatedLogoutButton';

export default function Topbar({
  role,
  user,
  onLogout,
  onOpenSearch,
  shortageStudents,
  onSelectStudent
}) {
  const [notifOpen, setNotifOpen] = useState(false);

  const RoleIcon = role === 'Admin' ? Shield : UserCheck;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#0B0F19]/85 px-4 lg:px-8 backdrop-blur-xl">
      <button
        onClick={onOpenSearch}
        className="flex w-56 sm:w-72 items-center justify-between rounded-xl border border-white/10 bg-[#111827]/90 px-3.5 py-2 text-sm text-slate-400 hover:border-indigo-500/40 hover:text-slate-200 transition"
      >
        <span className="flex items-center gap-2 truncate">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="truncate">Search USN, student, course...</span>
        </span>
        <kbd className="hidden sm:inline-block rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] font-mono text-slate-400">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 select-none">
          <RoleIcon className="h-3.5 w-3.5" />
          <span>{role} Portal</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111827] text-slate-300 hover:border-indigo-500/40 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {shortageStudents.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {shortageStudents.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#111827] p-3 shadow-2xl">
              <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Attendance Shortage (&lt;75%)
                </span>
                <span className="text-xs text-slate-400">{shortageStudents.length} flagged</span>
              </div>
              <div className="max-h-64 space-y-1.5 overflow-y-auto">
                {shortageStudents.map((stu) => (
                  <button
                    key={stu.id}
                    onClick={() => {
                      onSelectStudent(stu);
                      setNotifOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-2 text-left hover:bg-white/[0.07]"
                  >
                    <div>
                      <div className="text-xs font-medium text-white">{stu.full_name}</div>
                      <div className="text-[11px] text-slate-400">{stu.usn} • {stu.department} Sem {stu.semester}</div>
                    </div>
                    <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300">
                      {stu.attendance_pct}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 border-l border-white/10 pl-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-white truncate max-w-[150px]">{user?.full_name}</div>
            <div className="text-[10px] text-cyan-400">{user?.role} • {user?.department}</div>
          </div>

          <AnimatedLogoutButton onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}