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
  KeyRound
} from 'lucide-react';

const ROLE_PRESETS = [
  {
    role: 'Admin',
    label: 'Admin / Registrar',
    icon: Shield,
    identifier: 'admin@nexcampus.edu.in',
    password: 'Admin@123',
    hint: 'Full ERP, Fee Ledger, Admissions & Analytics'
  },
  {
    role: 'Faculty',
    label: 'Faculty / HOD',
    icon: UserCheck,
    identifier: 'r.kulkarni@nexcampus.edu.in',
    password: 'Faculty@123',
    hint: 'Daily Attendance Register & CIE Internal Marks'
  },
  {
    role: 'Student',
    label: 'Student Portal',
    icon: GraduationCap,
    identifier: '4GM25AI001',
    password: 'Student@123',
    hint: 'SGPA/CGPA Transcript & 75% Target Calculator'
  }
];

export default function LoginPage({ onLogin }) {
  const [selectedPreset, setSelectedPreset] = useState('Admin');
  const [identifier, setIdentifier] = useState('admin@nexcampus.edu.in');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSelectRolePreset = (preset) => {
    setSelectedPreset(preset.role);
    setIdentifier(preset.identifier);
    setPassword(preset.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both your Institutional ID / Email and Password.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onLogin(identifier, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0F19] px-4 py-12 text-slate-100">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/90 shadow-2xl backdrop-blur-xl lg:grid-cols-12">
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
              Unified Academic &amp; Campus Intelligence
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Sign in with your university credentials to access real-time attendance analytics, CIE internal marks, and student 360° records.
            </p>

            <div className="mt-8 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                One-Click Demo Credentials
              </div>
              {ROLE_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const active = selectedPreset === preset.role;
                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handleSelectRolePreset(preset)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      active
                        ? 'border-indigo-500/60 bg-indigo-500/15 shadow-sm'
                        : 'border-white/10 bg-[#0B0F19]/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold text-white">
                        <Icon className={`h-4 w-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                        {preset.label}
                      </span>
                      <span className="font-mono text-[11px] text-indigo-300">{preset.identifier}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{preset.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 text-[11px] text-slate-500">
            ISO 27001 Compliant Campus Auth • AY 2026–27
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
          <div className="mb-6">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              Single Sign-On (SSO)
            </span>
            <h2 className="mt-3 text-2xl font-bold text-white">Sign in to your account</h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter your University Email or Student USN (e.g., <span className="font-mono text-slate-300">4GM25AI001</span>)
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-xs font-medium text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Institutional Email or USN
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@nexcampus.edu.in or 4GM25AI001"
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <span className="font-mono text-[11px] text-slate-500">
                  Default: {selectedPreset}@123
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
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
              {submitting ? 'Authenticating...' : 'Sign In to NexCampus ERP'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}