import React from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Cpu
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Faculty', 'Student'] },
  { id: 'students', label: 'Student Directory', icon: Users, roles: ['Admin', 'Faculty'] },
  { id: 'faculty-workspace', label: 'Attendance & Marks', icon: ClipboardCheck, roles: ['Admin', 'Faculty'] },
  { id: 'courses', label: 'Courses & Faculty', icon: BookOpen, roles: ['Admin', 'Faculty', 'Student'] },
  { id: 'student-portal', label: 'Student 360° Portal', icon: GraduationCap, roles: ['Admin', 'Student'] }
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, role, backendOnline }) {
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-white/[0.08] bg-[#0B0F19]/95 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <div className="text-sm font-bold tracking-wide text-white">NexCampus ERP</div>
              <div className="text-[11px] text-cyan-400">Engineering University</div>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 p-3">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-indigo-500/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.08] p-3">
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
              }`}
            />
            {!collapsed && (
              <span className="text-xs font-medium text-slate-300">
                {backendOnline ? 'FastAPI + SQLite Live' : 'Local Persistence Active'}
              </span>
            )}
          </div>
          {!collapsed && (
            <p className="mt-1 text-[11px] text-slate-500">
              AY 2026–27 • Odd/Even Sem Sync
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}