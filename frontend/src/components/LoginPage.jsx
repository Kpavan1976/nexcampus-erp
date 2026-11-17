import React, { useState } from 'react';
import {
  Cpu,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  UserCheck,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  Users
} from 'lucide-react';
import { INITIAL_STUDENTS } from '../data/seedData';

const ROLES = [
  {
    id: 'Admin',
    label: 'Admin / Registrar',
    icon: Shield,
    desc: 'Full ERP control, fee ledger, student admissions & analytics'
  },
  {
    id: 'Faculty',
    label: 'Faculty / Professor',
    icon: UserCheck,
    desc: 'Daily subject attendance register & CIE internal marks'
  },
  {
    id: 'Student',
    label: 'Student Portal',
    icon: GraduationCap,
    desc: 'Select any student from the list to view their SGPA & 75% calculator'
  }
];

export default function LoginPage({ onLogin, students = INITIAL_STUDENTS }) {
  const [role, setRole] = useState('Admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const studentList = students.length > 0 ? students : INITIAL_STUDENTS;

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'Student' && studentList.length > 0) {
      setIdentifier(studentList[0].usn);
      if (!password) setPassword('Student@123');
    } else {
      setIdentifier('');
    }
  };

  const handleStudentSelect = (usn) => {
    setIdentifier(usn);
    if (!password) setPassword('Student@123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter or select your Email address or Student USN.');
      return;
    }
    if (password.trim().length < 4) {
      setError('Please enter a password (minimum 4 characters).');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onLogin(identifier, password, role);
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0F19] px-4 py-12 text-slate-100">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/90 shadow-2xl backdrop-blur-xl lg:grid-cols-12">
        {/* Left Role Selection Panel */}
        <div className="flex flex-col justify-between border-b border-white/10 bg-gradient-to-br from-indigo-600/20 via-[#111827] to-cyan-600/10 p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/30">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-wide text-white">NexCampus ERP</div>
                <div className="text-xs font-medium text-cyan-400">Engineering University Portal</div>
              </div>
            </div>

            <h1 className="mt-8 text-2xl font-extrabold leading-snug text-white">
              Select Your Workspace Role
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Choose your role below. Selecting <strong>Student Portal</strong> reveals the full 26-student quick-select directory.
            </p>

            <div className="mt-7 space-y-3">
              {ROLES.map((item) => {
                const Icon = item.icon;
                const active = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRoleSwitch(item.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition ${
                      active
                        ? 'border-indigo-500/60 bg-indigo-500/15 shadow-sm'
                        : 'border-white/10 bg-[#0B0F19]/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold text-white">
                        <Icon className={`h-4 w-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                        {item.label}
                      </span>
                      {active && (
                        <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 text-[11px] text-slate-500">
            NexCampus Authentication Gateway • AY 2026–27
          </div>
        </div>

        {/* Right Sign-In Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
          <div className="mb-6">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {role} Login
            </span>
            <h2 className="mt-3 text-2xl font-bold text-white">Sign in to your account</h2>
            <p className="mt-1 text-sm text-slate-400">
              {role === 'Student'
                ? 'Select a student from the dropdown below or enter any USN/email'
                : 'Enter any email address or ID and your chosen password'}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-xs font-medium text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Dropdown Wrapper (Shown when Student role is active) */}
            {role === 'Student' && (
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-3.5">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  <Users className="h-3.5 w-3.5" />
                  Select Enrolled Student ({studentList.length} Students)
                </label>
                <select
                  value={studentList.some((s) => s.usn === identifier) ? identifier : ''}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#0B0F19] px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="" disabled>
                    -- Choose a Student (USN • Name • Dept • Sem) --
                  </option>
                  {studentList.map((stu) => (
                    <option key={stu.usn} value={stu.usn}>
                      {stu.usn} — {stu.full_name} ({stu.department} • Sem {stu.semester}-{stu.section})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                {role === 'Student' ? 'Student USN or Email' : 'Email Address or Institutional ID'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === 'Student' ? 'e.g., 4GM25AI001 or student email...' : 'Enter your email or ID...'}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter any password..."
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 transition"
            >
              {submitting ? 'Signing In...' : `Continue as ${role}`}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}