import React, { useState, useEffect } from 'react';
import { Search, X, User, BookOpen } from 'lucide-react';

export default function CommandSearchModal({ open, onClose, students, courses, onSelectStudent }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        open ? onClose() : null;
      }
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const matchedStudents = students
    .filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.usn.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    )
    .slice(0, 6);

  const matchedCourses = courses
    .filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.faculty_name.toLowerCase().includes(q)
    )
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-20 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#111827] shadow-2xl">
        <div className="flex items-center border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 text-cyan-400 mr-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type USN (e.g., 4GM25AI001), name, or course code..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Students ({matchedStudents.length})
            </div>
            {matchedStudents.length === 0 ? (
              <p className="px-2 py-2 text-xs text-slate-500">No matching students.</p>
            ) : (
              matchedStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectStudent(s);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-indigo-500/15"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-indigo-400" />
                    <div>
                      <div className="text-sm font-medium text-white">{s.full_name}</div>
                      <div className="text-xs text-slate-400">
                        {s.usn} • {s.department} Sem {s.semester}-{s.section}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">CGPA {s.cgpa}</span>
                </button>
              ))
            )}
          </div>

          <div>
            <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Courses ({matchedCourses.length})
            </div>
            {matchedCourses.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  <div>
                    <div className="font-medium text-slate-200">{c.title}</div>
                    <div className="text-xs text-slate-400">{c.code} • {c.faculty_name}</div>
                  </div>
                </div>
                <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                  {c.credits} Cr
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}