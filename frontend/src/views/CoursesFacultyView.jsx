import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Building2, Calendar, CheckCircle2 } from 'lucide-react';
import AdminFacultyHubView from './AdminFacultyHubView';
import { facultyGovernanceApi } from '../services/facultyGovernanceApi';

export default function CoursesFacultyView({ role = 'Admin', user, onNotify }) {
  const [storeData, setStoreData] = useState({
    faculty: [],
    allocations: [],
    timetable: [],
    audits: [],
  });

  useEffect(() => {
    facultyGovernanceApi.getAll().then((res) => {
      if (res) setStoreData(res);
    });
  }, []);

  if (role === 'Admin') {
    return <AdminFacultyHubView role={role} onNotify={onNotify} />;
  }

  const matchedFaculty =
    storeData.faculty.find(
      (f) =>
        f.email?.toLowerCase() === user?.email?.toLowerCase() ||
        f.full_name?.toLowerCase() === user?.full_name?.toLowerCase()
    ) || storeData.faculty[0];

  const myAllocations = matchedFaculty
    ? storeData.allocations.filter((a) => a.faculty_id === matchedFaculty.id)
    : storeData.allocations;

  const myTimetable = matchedFaculty
    ? storeData.timetable.filter((t) => t.faculty_id === matchedFaculty.id)
    : storeData.timetable;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl">
        <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
          Faculty Academic View
        </span>
        <h1 className="mt-1.5 text-xl font-bold text-white">My Assigned Courses & Weekly Schedule</h1>
        <p className="text-xs text-slate-400">
          Viewing active term subject allocations and classroom timetable for{' '}
          <span className="font-semibold text-slate-200">{user?.full_name || matchedFaculty?.full_name}</span>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {myAllocations.map((alloc) => {
          const audit = storeData.audits.find((a) => a.allocation_id === alloc.id);
          return (
            <div
              key={alloc.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{alloc.subject_code}</span>
                  <span className="rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                    {alloc.subject_type}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-white">{alloc.subject_name}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  {alloc.department} • {alloc.semester} (Section {alloc.section})
                </p>
              </div>

              <div className="mt-4 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-cyan-400" /> Syllabus Progress
                  </span>
                  <span className="font-bold text-cyan-300">{audit?.syllabus_pct ?? 0}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                    style={{ width: `${audit?.syllabus_pct ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" /> My Weekly Class Timetable
          </h2>
          <span className="text-xs text-slate-400">{myTimetable.length} scheduled slots</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myTimetable.map((slot) => (
            <div
              key={slot.id}
              className="rounded-xl border border-white/10 bg-[#0B0F19]/90 p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[11px] font-bold text-indigo-300">
                  {slot.day_of_week}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="h-3 w-3" /> {slot.time_slot}
                </span>
              </div>
              <div className="text-xs font-bold text-white">
                {slot.subject_code} • {slot.semester} (Sec {slot.section})
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-300 pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> {slot.room_no}
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> {slot.hours} hrs/wk
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}