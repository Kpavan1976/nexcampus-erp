import React, { useState, useEffect, useRef } from 'react';
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
  Users,
  Volume2,
  VolumeX
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

// Zero-dependency Web Audio API synthesizer for tactile glass UI sounds
class UISoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playHover() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(1380, now + 0.035);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playSelect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.025);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 0.11);

      gain.gain.setValueAtTime(0.055, now + idx * 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.025);
      osc.stop(now + 0.13);
    });
  }

  playFocus() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.028);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const start = now + i * 0.055;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.065, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  }

  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [190, 145].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const start = now + i * 0.08;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.04, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.1);
    });
  }
}

export default function LoginPage({ onLogin, students = INITIAL_STUDENTS }) {
  const [role, setRole] = useState('Admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [soundMuted, setSoundMuted] = useState(false);

  // 3D Tilt & Cursor Spotlight State
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 350, y: 250, opacity: 0 });
  const [hudCoords, setHudCoords] = useState({ x: '+65,38', y: '-23,38' });

  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const soundRef = useRef(new UISoundEngine());
  const mousePosRef = useRef({ x: -1000, y: -1000, active: false });
  const ctaHoverRef = useRef(false);

  const studentList = students.length > 0 ? students : INITIAL_STUDENTS;

  const toggleMute = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundRef.current.muted = next;
    if (!next) {
      soundRef.current.playSelect();
    }
  };

  // Interactive HTML5 Canvas: Liquid-Gold Orbs + Wireframe Terrain + Luminous Comet Trail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const trail = [];
    const sparkles = [];
    const orbs = [
      { rx: 0.84, ry: 0.24, r: 92, speed: 0.0012, phase: 0, parallax: -0.025 },
      { rx: 0.68, ry: 0.11, r: 22, speed: 0.0018, phase: 1.4, parallax: -0.04 },
      { rx: 0.14, ry: 0.78, r: 68, speed: 0.0014, phase: 2.6, parallax: 0.03 },
      { rx: 0.08, ry: 0.56, r: 14, speed: 0.0021, phase: 4.1, parallax: 0.045 },
      { rx: 0.91, ry: 0.82, r: 44, speed: 0.0015, phase: 5.0, parallax: -0.02 }
    ];

    const spawnSparkles = (x, y, count = 2, burst = false) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 1.2 + Math.random() * 3.2 : 0.25 + Math.random() * 1.1;
        sparkles.push({
          x: x + (Math.random() - 0.5) * 14,
          y: y + (Math.random() - 0.5) * 14,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.2,
          size: burst ? 1.8 + Math.random() * 2.4 : 1 + Math.random() * 1.8,
          life: 1,
          decay: burst ? 0.022 + Math.random() * 0.015 : 0.028 + Math.random() * 0.02
        });
      }
    };

    const handleGlobalMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY, active: true };
      trail.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.length > 28) trail.shift();
      spawnSparkles(e.clientX, e.clientY, ctaHoverRef.current ? 4 : 2, ctaHoverRef.current);
    };

    const handleGlobalClick = (e) => {
      soundRef.current.init();
      spawnSparkles(e.clientX, e.clientY, 16, true);
    };

    window.addEventListener('pointermove', handleGlobalMove);
    window.addEventListener('pointerdown', handleGlobalClick);

    const drawWireframeWave = (time, originX, originY, mirrorX, mirrorY) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.lineWidth = 1;
      const rows = 14;
      const cols = 20;
      const spacingX = 24;
      const spacingY = 16;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const wave =
            Math.sin(c * 0.35 + time * 0.0015 + r * 0.4) * 16 +
            Math.cos(r * 0.45 - time * 0.0012) * 10;
          const px = originX + mirrorX * (c * spacingX - r * 8);
          const py = originY + mirrorY * (r * spacingY + wave);
          if (c === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      const offsetX = mousePosRef.current.active ? mousePosRef.current.x - width / 2 : 0;
      const offsetY = mousePosRef.current.active ? mousePosRef.current.y - height / 2 : 0;

      // 1. Subtle Top-Right & Bottom-Left Wireframe Terrain Meshes
      drawWireframeWave(time, width - 30 - offsetX * 0.015, 220 - offsetY * 0.015, -1, 1);
      drawWireframeWave(time, 30 - offsetX * 0.015, height - 40 - offsetY * 0.015, 1, -1);

      // 2. Floating Liquid-Gold / Amber Orbs with Depth Parallax
      orbs.forEach((orb) => {
        const floatY = Math.sin(time * orb.speed + orb.phase) * 14;
        const floatX = Math.cos(time * orb.speed * 0.8 + orb.phase) * 10;
        const cx = width * orb.rx + floatX + offsetX * orb.parallax;
        const cy = height * orb.ry + floatY + offsetY * orb.parallax;

        const grad = ctx.createRadialGradient(
          cx - orb.r * 0.3,
          cy - orb.r * 0.3,
          orb.r * 0.08,
          cx,
          cy,
          orb.r
        );
        grad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
        grad.addColorStop(0.35, 'rgba(245, 158, 11, 0.55)');
        grad.addColorStop(0.75, 'rgba(180, 83, 9, 0.22)');
        grad.addColorStop(1, 'rgba(180, 83, 9, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Luminous Comet Ribbon Trail
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1];
          const p1 = trail[i];
          const ratio = i / trail.length;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(253, 224, 71, ${ratio * p1.life * 0.65})`;
          ctx.lineWidth = ratio * 5;
          ctx.lineCap = 'round';
          ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
          ctx.shadowBlur = 14;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life -= 0.035;
        if (trail[i].life <= 0) trail.splice(i, 1);
      }

      // 4. Twinkling Golden Starburst Sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= sp.decay;
        if (sp.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.fillStyle = `rgba(254, 249, 195, ${sp.life})`;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.95)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handleGlobalMove);
      window.removeEventListener('pointerdown', handleGlobalClick);
    };
  }, []);

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTilt({ rotateX, rotateY });
    setSpotlight({ x, y, opacity: 1 });
    setHudCoords({
      x: `${x - centerX >= 0 ? '+' : ''}${Math.round((x - centerX) / 6)},${Math.round(y / 12)}`,
      y: `${y - centerY >= 0 ? '+' : ''}${Math.round((y - centerY) / 6)},${Math.round(x / 18)}`
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleRoleSwitch = (newRole) => {
    soundRef.current.playSelect();
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
    soundRef.current.playSelect();
    setIdentifier(usn);
    if (!password) setPassword('Student@123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      soundRef.current.playError();
      setError('Please enter or select your Email address or Student USN.');
      return;
    }
    if (password.trim().length < 4) {
      soundRef.current.playError();
      setError('Please enter a password (minimum 4 characters).');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      soundRef.current.playSuccess();
      await onLogin(identifier, password, role);
    } catch (err) {
      soundRef.current.playError();
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#070A12] via-[#0B101D] to-[#0E1526] px-4 py-12 text-slate-100">
      {/* Ambient Radial Glows */}
      <div className="pointer-events-none absolute -left-36 -top-36 h-[28rem] w-[28rem] rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-36 h-[28rem] w-[28rem] rounded-full bg-amber-400/10 blur-3xl" />

      {/* Full-Screen Interactive Particle & Liquid-Gold Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10 h-full w-full"
      />

      {/* Sound Toggle Pill */}
      <button
        type="button"
        onClick={toggleMute}
        onMouseEnter={() => soundRef.current.playHover()}
        className="fixed right-5 top-5 z-30 flex items-center gap-2 rounded-full border border-amber-400/30 bg-[#111726]/80 px-3.5 py-1.5 text-xs font-medium text-amber-200 backdrop-blur-xl transition hover:border-amber-400/70 hover:bg-amber-500/15"
      >
        {soundMuted ? (
          <>
            <VolumeX className="h-3.5 w-3.5 text-slate-400" />
            <span>UI Sound Off</span>
          </>
        ) : (
          <>
            <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>UI Sound On</span>
          </>
        )}
      </button>

      {/* 3D Perspective Glassmorphic Card */}
      <div
        style={{ perspective: '1300px' }}
        className="relative z-20 w-full max-w-5xl"
      >
        <div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transition: spotlight.opacity ? 'transform 120ms ease-out' : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
          }}
          className="relative grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-amber-400/25 bg-[#111726]/80 shadow-[0_25px_90px_rgba(0,0,0,0.8)] backdrop-blur-2xl lg:grid-cols-12"
        >
          {/* Cursor-Tracking Spotlight Overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              opacity: spotlight.opacity,
              background: `radial-gradient(560px circle at ${spotlight.x}px ${spotlight.y}px, rgba(251, 191, 36, 0.14), transparent 45%)`
            }}
          />

          {/* Subtle Technical HUD Coordinate Readouts */}
          <div className="pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-16 font-mono text-[10px] text-amber-300/35 sm:flex">
            <span>{hudCoords.x}</span>
            <span>{hudCoords.y}</span>
          </div>

          {/* Left Role Selection Panel (5 Columns) */}
          <div className="relative z-10 flex flex-col justify-between border-b border-white/10 bg-gradient-to-br from-amber-500/[0.08] via-[#111726]/60 to-transparent p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div>
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-[0_0_25px_rgba(245,158,11,0.45)]">
                  <Cpu className="h-6 w-6 text-slate-950" />
                </div>
                <div>
                  <div className="text-lg font-bold tracking-wide text-white">NexCampus ERP</div>
                  <div className="text-xs font-medium text-amber-300/80">Engineering University Portal</div>
                </div>
              </div>

              <h1 className="mt-8 text-2xl font-extrabold leading-snug text-white">
                Select Your Workspace Role
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Choose your role below. Selecting <strong className="text-amber-200">Student Portal</strong> reveals the full 26-student quick-select directory.
              </p>

              <div className="mt-7 space-y-3">
                {ROLES.map((item) => {
                  const Icon = item.icon;
                  const active = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => soundRef.current.playHover()}
                      onClick={() => handleRoleSwitch(item.id)}
                      className={`w-full rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                        active
                          ? 'border-amber-400/80 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                          : 'border-white/10 bg-[#0B0F19]/60 hover:border-amber-400/40 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2.5 text-xs font-bold text-white">
                          <Icon className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                          {item.label}
                        </span>
                        {active && (
                          <span className="rounded-md border border-amber-400/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-400">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4 text-[11px] text-slate-500">
              NexCampus Authentication Gateway • AY 2026–27
            </div>
          </div>

          {/* Right Sign-In Form (7 Columns) */}
          <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
            <div className="mb-6">
              <span className="inline-block rounded-full border border-amber-400/40 bg-amber-500/15 px-3.5 py-1 text-xs font-semibold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
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
                <div className="rounded-2xl border border-amber-400/35 bg-amber-500/10 p-3.5">
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
                    <Users className="h-3.5 w-3.5" />
                    Select Enrolled Student ({studentList.length} Students)
                  </label>
                  <select
                    value={studentList.some((s) => s.usn === identifier) ? identifier : ''}
                    onFocus={() => soundRef.current.playFocus()}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#090D16] px-3 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
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
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-amber-400/70" />
                  <input
                    type="text"
                    value={identifier}
                    onFocus={() => soundRef.current.playFocus()}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === 'Student' ? 'e.g., 4GM25AI001 or student email...' : 'Enter your email or ID...'}
                    className="w-full rounded-xl border border-white/10 bg-[#090D16]/90 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-amber-400/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onFocus={() => soundRef.current.playFocus()}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter any password..."
                    className="w-full rounded-xl border border-white/10 bg-[#090D16]/90 py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      soundRef.current.playHover();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-amber-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                onMouseEnter={() => {
                  ctaHoverRef.current = true;
                  soundRef.current.playHover();
                }}
                onMouseLeave={() => {
                  ctaHoverRef.current = false;
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 py-3.5 text-sm font-extrabold text-slate-950 shadow-[0_10px_35px_rgba(245,158,11,0.4)] transition hover:brightness-110 disabled:opacity-50"
              >
                {submitting ? 'Signing In...' : `Continue as ${role}`}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}