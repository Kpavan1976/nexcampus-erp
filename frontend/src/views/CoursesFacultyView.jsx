import React, { useState } from 'react';
import { BookOpen, Plus, Mail, Phone, Award } from 'lucide-react';

export default function CoursesFacultyView({ courses, faculty, role, onAddCourse }) {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('AIML');
  const [semester, setSemester] = useState(3);
  const [credits, setCredits] = useState(4);
  const [facultyId, setFacultyId] = useState(faculty[0]?.id || 1);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;
    const chosenFac = faculty.find((f) => f.id === Number(facultyId)) || faculty[0];
    onAddCourse({
      code: code.toUpperCase(),
      title,
      department,
      semester: Number(semester),
      credits: Number(credits),
      faculty_id: chosenFac.id,
      faculty_name: chosenFac.name
    });
    setCode('');
    setTitle('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Courses & Faculty Allocation</h1>
        <p className="text-sm text-slate-400">Outcome-Based Education (OBE) curriculum mapping & assigned instructors</p>
      </div>

      {role === 'Admin' && (
        <form onSubmit={handleCreate} className="glass-card rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Course Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="UE25CS4305"
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs text-slate-400 mb-1">Subject Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cloud Computing & Microservices"
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Dept & Sem</label>
            <div className="flex gap-2">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-1/2 rounded-xl border border-white/10 bg-[#0B0F19] px-2 py-2 text-sm text-white"
              >
                {['AIML', 'CSE', 'ECE', 'ME'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-1/2 rounded-xl border border-white/10 bg-[#0B0F19] px-2 py-2 text-sm text-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>S{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Assigned Faculty</label>
            <select
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white"
            >
              {faculty.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Allocate
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-cyan-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-cyan-300">
                  {c.code}
                </span>
                <span className="text-xs font-medium text-slate-400">{c.credits} Credits</span>
              </div>
              <h3 className="mt-3 text-base font-bold text-white">{c.title}</h3>
              <p className="mt-1 text-xs text-indigo-300">
                {c.department} Department • Semester {c.semester}
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 flex items-center gap-2 text-xs text-slate-300">
              <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
              <span className="truncate">{c.faculty_name}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Engineering Faculty Roster ({faculty.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map((f) => (
            <div key={f.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-bold text-white">{f.name}</div>
                  <div className="text-xs text-cyan-400">{f.designation}</div>
                </div>
                <span className="rounded-lg bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                  {f.department}
                </span>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-slate-500" /> ID: {f.faculty_code}</div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-500" /> {f.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-500" /> {f.phone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}