import React, { useRef, useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { erpApi } from '../services/api';

const ROLES = [
  {
    id: 'Admin',
    title: 'Admin / Registrar',
    subtitle: 'Full ERP control, fee ledger, student admissions & analytics',
    icon: ShieldCheck,
    badge: 'Admin Login',
    cta: 'Continue as Admin',
  },
  {
    id: 'Faculty',
    title: 'Faculty / Professor',
    subtitle: 'Daily subject attendance register & CIE internal marks',
    icon: GraduationCap,
    badge: 'Faculty Login',
    cta: 'Continue as Faculty',
  },
];

const LAMP_THEMES = {
  gold: {
    name: 'Liquid Gold',
    dot: '#fbbf24',
    bulb: '#fef08a',
    glow: 'rgba(251, 191, 36, 0.34)',
    coneTop: 'rgba(253, 224, 71, 0.36)',
    coneMid: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(251, 191, 36, 0.65)',
    accentText: '#fde047',
    buttonGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 52%, #fde047 100%)',
    buttonText: '#090d16',
  },
  emerald: {
    name: 'Emerald',
    dot: '#10b981',
    bulb: '#a7f3d0',
    glow: 'rgba(16, 185, 129, 0.32)',
    coneTop: 'rgba(52, 211, 153, 0.34)',
    coneMid: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(52, 211, 153, 0.6)',
    accentText: '#6ee7b7',
    buttonGradient: 'linear-gradient(135deg, #059669 0%, #10b981 52%, #6ee7b7 100%)',
    buttonText: '#052e16',
  },
  crimson: {
    name: 'Crimson',
    dot: '#f43f5e',
    bulb: '#fecdd3',
    glow: 'rgba(244, 63, 94, 0.32)',
    coneTop: 'rgba(251, 113, 133, 0.34)',
    coneMid: 'rgba(244, 63, 94, 0.12)',
    border: 'rgba(251, 113, 133, 0.6)',
    accentText: '#fda4af',
    buttonGradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 52%, #fda4af 100%)',
    buttonText: '#ffffff',
  },
  cyan: {
    name: 'Cyan',
    dot: '#22d3ee',
    bulb: '#cffafe',
    glow: 'rgba(34, 211, 238, 0.32)',
    coneTop: 'rgba(103, 232, 249, 0.34)',
    coneMid: 'rgba(34, 211, 238, 0.12)',
    border: 'rgba(103, 232, 249, 0.6)',
    accentText: '#67e8f9',
    buttonGradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 52%, #67e8f9 100%)',
    buttonText: '#082f49',
  },
};

export default function LoginPage({ onLogin, onLoginSuccess, error: externalError }) {
  const [lampOn, setLampOn] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [themeKey, setThemeKey] = useState('gold');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Persistent Shared Web Audio Context (Unlocked on User Gesture)
  const audioCtxRef = useRef(null);

  const playTone = async (type = 'switch', turningOn = true) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'switch') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(turningOn ? 520 : 380, now);
        osc.frequency.exponentialRampToValueAtTime(turningOn ? 1180 : 190, now + 0.08);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.095);
      } else if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(990, now + 0.14);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      } else if (type === 'login') {
        // Ascending Golden Chord
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.type = 'sine';
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.055);
          noteGain.gain.setValueAtTime(0.09, now + idx * 0.055);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + 0.25);
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.start(now + idx * 0.055);
          noteOsc.stop(now + idx * 0.055 + 0.26);
        });
      }
    } catch (_) {}
  };

  // 3D Magnetic Tilt & Cursor Spotlight
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    '--mouse-x': '50%',
    '--mouse-y': '50%',
  });

  const theme = LAMP_THEMES[themeKey];
  const activeRole = ROLES.find((r) => r.id === role) || ROLES[0];
  const displayError = externalError || localError;

  const handlePullCord = () => {
    const nextState = !lampOn;
    setPulling(true);
    setLampOn(nextState);
    playTone('switch', nextState);
    setTimeout(() => setPulling(false), 260);
  };

  const handleCardMouseMove = (e) => {
    if (!lampOn) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
      '--mouse-x': `${x}px`,
      '--mouse-y': `${y}px`,
    });
  };

  const handleCardMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      '--mouse-x': '50%',
      '--mouse-y': '50%',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    const trimmedEmail = String(email || '').trim();
    const trimmedPassword = String(password || '').trim();

    if (!trimmedEmail || !trimmedPassword) {
      setLocalError('Please enter your institutional email/ID and password.');
      return;
    }

    try {
      setSubmitting(true);
      playTone('login', true);

      if (typeof onLogin === 'function') {
        // Pass positional string arguments (identifier, password, role) expected by App.jsx
        await onLogin(trimmedEmail, trimmedPassword, role);
      } else if (erpApi?.login) {
        const session = await erpApi.login(trimmedEmail, trimmedPassword, role);
        onLoginSuccess?.(session);
      } else {
        onLoginSuccess?.({ role, email: trimmedEmail, name: `${role} User` });
      }
    } catch (err) {
      setLocalError(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#060911] px-4 py-8">
      {/* Top-Right Controls: Sound Toggle + Theme Swatch Dots */}
      <div className="fixed right-6 top-6 z-40 flex items-center gap-3 rounded-full border border-white/15 bg-[#111726]/85 px-4 py-2 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) {
              setTimeout(() => playTone('chime', true), 20);
            }
          }}
          title={soundEnabled ? 'Mute Portal Sound FX' : 'Enable Portal Sound FX'}
          className="flex items-center gap-1.5 border-r border-white/15 pr-3 text-xs font-semibold text-amber-200 transition hover:text-amber-300"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-400">Muted</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {Object.entries(LAMP_THEMES).map(([key, item]) => (
            <button
              key={key}
              type="button"
              title={`Switch Lamp Glow: ${item.name}`}
              onClick={() => {
                setThemeKey(key);
                if (!lampOn) setLampOn(true);
                playTone('chime', true);
              }}
              style={{
                backgroundColor: item.dot,
                boxShadow: themeKey === key ? `0 0 14px ${item.dot}` : 'none',
              }}
              className={`h-3.5 w-3.5 rounded-full transition-transform duration-200 hover:scale-125 ${
                themeKey === key ? 'scale-125 ring-2 ring-white' : 'opacity-70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Split Stage: Interactive Pull-Cord Lamp + NexCampus Login Card */}
      <div className="relative z-20 flex w-full max-w-6xl flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Interactive Desk Lamp Assembly */}
        <div className="relative flex flex-col items-center select-none lg:w-1/3">
          {/* Illuminated Light Cone */}
          <div
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${theme.coneTop} 0%, ${theme.coneMid} 48%, transparent 78%)`,
            }}
            className={`pointer-events-none absolute top-28 h-[440px] w-[520px] transition-opacity duration-500 ${
              lampOn ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="relative flex flex-col items-center">
            {/* Lamp Shade */}
            <div
              onClick={handlePullCord}
              title="Pull cord or click lamp to toggle light"
              style={{
                boxShadow: lampOn ? `0 18px 55px ${theme.glow}` : 'none',
                borderColor: lampOn ? theme.border : 'rgba(255,255,255,0.12)',
              }}
              className="relative z-20 h-28 w-44 cursor-pointer rounded-t-[72px] rounded-b-2xl border bg-gradient-to-b from-[#232b3e] to-[#111625] transition-all duration-300"
            >
              {/* Glowing Bulb Rim */}
              <div
                style={{
                  backgroundColor: lampOn ? theme.bulb : '#1e293b',
                  boxShadow: lampOn ? `0 0 32px 10px ${theme.dot}` : 'none',
                }}
                className="absolute -bottom-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rounded-full transition-all duration-300"
              />
            </div>

            {/* Center Stand & Dangling Pull Cord */}
            <div className="relative flex items-start justify-center">
              <div className="h-44 w-2.5 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800" />
              <button
                type="button"
                onClick={handlePullCord}
                aria-label="Pull lamp cord"
                className="group absolute left-6 top-0 flex flex-col items-center focus:outline-none"
              >
                <div
                  style={{
                    height: pulling ? '118px' : lampOn ? '96px' : '84px',
                  }}
                  className="w-[2px] bg-gradient-to-b from-amber-200/80 to-amber-400 transition-all duration-200"
                />
                <div
                  style={{
                    backgroundColor: lampOn ? theme.dot : '#94a3b8',
                    boxShadow: lampOn ? `0 0 16px ${theme.dot}` : 'none',
                  }}
                  className="h-5 w-3 rounded-full border border-white/40 transition-transform duration-200 group-hover:scale-125 group-active:translate-y-2"
                />
              </button>
            </div>

            {/* Lamp Base */}
            <div className="h-3.5 w-32 rounded-full border border-white/10 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 shadow-xl" />

            {/* Prompt Hint */}
            <button
              type="button"
              onClick={handlePullCord}
              className={`mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                lampOn
                  ? 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
                  : 'animate-bounce border-amber-400/50 bg-amber-500/15 text-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.3)]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{lampOn ? 'Pull cord to dim lamp' : 'Pull the cord to illuminate portal'}</span>
            </button>
          </div>
        </div>

        {/* Illuminated 3D Glass NexCampus Login Frame */}
        <div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            ...tiltStyle,
            borderColor: lampOn ? theme.border : 'rgba(255,255,255,0.06)',
            boxShadow: lampOn
              ? `0 28px 70px rgba(0,0,0,0.75), 0 0 45px ${theme.glow}`
              : 'none',
          }}
          className={`login-tilt-frame relative w-full max-w-3xl overflow-hidden rounded-3xl border bg-[#111726]/85 backdrop-blur-2xl transition-all duration-500 lg:w-2/3 ${
            lampOn
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none translate-y-4 scale-95 opacity-0'
          }`}
        >
          <div className="grid md:grid-cols-12">
            {/* Left Role Selector */}
            <div className="flex flex-col justify-between border-b border-white/10 bg-[#0d121f]/90 p-7 md:col-span-5 md:border-b-0 md:border-r">
              <div>
                <div className="flex items-center gap-3">
                  <div
                    style={{ background: theme.buttonGradient }}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg"
                  >
                    <Cpu className="h-5 w-5 text-slate-950" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">NexCampus ERP</div>
                    <div style={{ color: theme.accentText }} className="text-xs font-medium">
                      Engineering Portal
                    </div>
                  </div>
                </div>

                <h1
                  style={{ color: theme.accentText }}
                  className="mt-7 text-xl font-extrabold leading-snug"
                >
                  Select Workspace Role
                </h1>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300/80">
                  Choose your administrative or academic role to enter the university system.
                </p>

                <div className="mt-6 space-y-3">
                  {ROLES.map((item) => {
                    const Icon = item.icon;
                    const active = role === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setRole(item.id);
                          setLocalError('');
                          playTone('chime', true);
                        }}
                        style={{
                          borderColor: active ? theme.border : 'rgba(255,255,255,0.08)',
                          backgroundColor: active ? theme.coneMid : 'rgba(15, 23, 42, 0.6)',
                        }}
                        className="w-full rounded-2xl border p-3.5 text-left transition-all duration-200 hover:bg-white/5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon
                              style={{ color: active ? theme.accentText : '#94a3b8' }}
                              className="h-4 w-4"
                            />
                            <span className="text-sm font-bold text-white">{item.title}</span>
                          </div>
                          {active && (
                            <span
                              style={{
                                borderColor: theme.border,
                                color: theme.accentText,
                              }}
                              className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase"
                            >
                              Active
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                          {item.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-3 text-[11px] text-slate-400">
                NexCampus Gateway • AY 2026–27
              </div>
            </div>

            {/* Right Sign-In Form */}
            <div className="flex flex-col justify-center p-7 sm:p-9 md:col-span-7">
              <div
                style={{
                  borderColor: theme.border,
                  color: theme.accentText,
                  backgroundColor: theme.coneMid,
                }}
                className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold"
              >
                {activeRole.badge}
              </div>

              <h2 style={{ color: theme.accentText }} className="mt-3.5 text-2xl font-extrabold">
                Welcome Back
              </h2>
              <p className="mt-1 text-xs text-slate-300/80">
                Sign in with your institutional email or ID
              </p>

              {displayError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-500/15 px-3 py-2 text-xs text-amber-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-300" />
                  <span>{displayError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Email or Institutional ID
                  </label>
                  <div className="relative">
                    <Mail
                      style={{ color: theme.accentText }}
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-80"
                    />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email or ID..."
                      autoComplete="username"
                      className="w-full rounded-xl border border-white/15 bg-[#161e31]/90 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      style={{ color: theme.accentText }}
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-80"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password..."
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-white/15 bg-[#161e31]/90 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: theme.buttonGradient,
                    color: theme.buttonText,
                    boxShadow: `0 10px 26px ${theme.glow}`,
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                >
                  <span>{submitting ? 'Signing in...' : activeRole.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}