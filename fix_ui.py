import os, re

folders = [
    r"C:\Users\Pavankumar D Butta\nexcampus-erp\frontend",
    r"C:\Users\Pavankumar D Butta\nexcampus-erp\nexcampus-erp\frontend",
]

canvas_code = """import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

class DashboardSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
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
    osc.frequency.exponentialRampToValueAtTime(1380, now + 0.032);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.024);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 0.11);
      gain.gain.setValueAtTime(0.045, now + idx * 0.024);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.024);
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
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }
}

export default function AmbientGoldCanvas() {
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: -1000, y: -1000, active: false });
  const soundRef = useRef(new DashboardSoundEngine());
  const lastHoveredRef = useRef(null);
  const [muted, setMuted] = useState(false);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    soundRef.current.muted = next;
    if (!next) soundRef.current.playClick();
  };

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
      { rx: 0.87, ry: 0.14, r: 84, speed: 0.0012, phase: 0, parallax: -0.02 },
      { rx: 0.72, ry: 0.07, r: 16, speed: 0.0018, phase: 1.4, parallax: -0.035 },
      { rx: 0.09, ry: 0.82, r: 74, speed: 0.0014, phase: 2.6, parallax: 0.025 },
      { rx: 0.08, ry: 0.48, r: 12, speed: 0.0021, phase: 4.1, parallax: 0.04 },
      { rx: 0.93, ry: 0.86, r: 42, speed: 0.0015, phase: 5.0, parallax: -0.02 }
    ];

    const spawnSparkles = (x, y, count = 2, burst = false) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 1.1 + Math.random() * 2.8 : 0.25 + Math.random() * 1.0;
        sparkles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.2,
          size: burst ? 1.6 + Math.random() * 2.2 : 0.9 + Math.random() * 1.6,
          life: 1,
          decay: burst ? 0.024 + Math.random() * 0.015 : 0.03 + Math.random() * 0.02
        });
      }
    };

    const handleGlobalMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY, active: true };
      trail.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.length > 26) trail.shift();
      spawnSparkles(e.clientX, e.clientY, 2, false);

      const interactive = e.target?.closest?.('button, a, select, [role="button"]');
      if (interactive && interactive !== lastHoveredRef.current) {
        lastHoveredRef.current = interactive;
        soundRef.current.playHover();
      } else if (!interactive) {
        lastHoveredRef.current = null;
      }
    };

    const handleGlobalClick = (e) => {
      soundRef.current.init();
      spawnSparkles(e.clientX, e.clientY, 14, true);
      if (e.target?.closest?.('button, a, select, [role="button"]')) {
        soundRef.current.playClick();
      }
    };

    const handleGlobalFocus = (e) => {
      if (e.target?.matches?.('input, select, textarea')) {
        soundRef.current.playFocus();
      }
    };

    window.addEventListener('pointermove', handleGlobalMove);
    window.addEventListener('pointerdown', handleGlobalClick);
    window.addEventListener('focusin', handleGlobalFocus);

    const drawWireframeWave = (time, originX, originY, mirrorX, mirrorY) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.11)';
      ctx.lineWidth = 1;
      for (let r = 0; r < 13; r++) {
        ctx.beginPath();
        for (let c = 0; c < 18; c++) {
          const wave = Math.sin(c * 0.35 + time * 0.0015 + r * 0.4) * 14 + Math.cos(r * 0.45 - time * 0.0012) * 9;
          const px = originX + mirrorX * (c * 22 - r * 8);
          const py = originY + mirrorY * (r * 15 + wave);
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

      drawWireframeWave(time, width - 20 - offsetX * 0.012, 180 - offsetY * 0.012, -1, 1);
      drawWireframeWave(time, 20 - offsetX * 0.012, height - 30 - offsetY * 0.012, 1, -1);

      orbs.forEach((orb) => {
        const floatY = Math.sin(time * orb.speed + orb.phase) * 12;
        const floatX = Math.cos(time * orb.speed * 0.8 + orb.phase) * 9;
        const cx = width * orb.rx + floatX + offsetX * orb.parallax;
        const cy = height * orb.ry + floatY + offsetY * orb.parallax;
        const grad = ctx.createRadialGradient(cx - orb.r * 0.3, cy - orb.r * 0.3, orb.r * 0.08, cx, cy, orb.r);
        grad.addColorStop(0, 'rgba(254, 240, 138, 0.82)');
        grad.addColorStop(0.35, 'rgba(245, 158, 11, 0.5)');
        grad.addColorStop(0.75, 'rgba(180, 83, 9, 0.2)');
        grad.addColorStop(1, 'rgba(180, 83, 9, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1];
          const p1 = trail[i];
          const ratio = i / trail.length;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(253, 224, 71, ${ratio * p1.life * 0.6})`;
          ctx.lineWidth = ratio * 4.5;
          ctx.lineCap = 'round';
          ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
          ctx.shadowBlur = 12;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life -= 0.036;
        if (trail[i].life <= 0) trail.splice(i, 1);
      }

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= sp.decay;
        if (sp.life <= 0) { sparkles.splice(i, 1); continue; }
        ctx.save();
        ctx.fillStyle = `rgba(254, 249, 195, ${sp.life})`;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.95)';
        ctx.shadowBlur = 9;
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
      window.removeEventListener('focusin', handleGlobalFocus);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-30 h-full w-full" />
      <button
        type="button"
        onClick={toggleSound}
        title="Toggle Dashboard UI Sound"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-amber-400/35 bg-[#111726]/85 px-3.5 py-1.5 text-xs font-semibold text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-xl transition hover:border-amber-400 hover:bg-amber-500/20"
      >
        {muted ? <><VolumeX className="h-3.5 w-3.5 text-slate-400" /><span>Sound Off</span></> : <><Volume2 className="h-3.5 w-3.5 text-amber-400 animate-pulse" /><span>Sound On</span></>}
      </button>
    </>
  );
}
"""

css_code = """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background: radial-gradient(circle at 18% 12%, #131c31 0%, #0b111e 48%, #070b14 100%) !important;
    color: #f8fafc;
    overflow-x: hidden;
  }
}

.bg-\\[\\#090D16\\],
.bg-\\[\\#0B0F19\\],
.bg-\\[\\#0D1322\\],
.bg-\\[\\#111726\\],
.bg-slate-900\\/80,
.bg-slate-900\\/70,
.bg-slate-950 {
  background-color: rgba(15, 22, 37, 0.78) !important;
  backdrop-filter: blur(18px);
}

.bg-indigo-600,
.bg-indigo-500,
.bg-blue-600,
.bg-blue-500,
.from-indigo-600,
.from-indigo-500,
.from-blue-600,
.from-blue-500 {
  background-image: linear-gradient(135deg, #d97706 0%, #f59e0b 52%, #fde047 100%) !important;
  color: #090d16 !important;
  font-weight: 700 !important;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3) !important;
}

.bg-indigo-500\\/20,
.bg-indigo-500\\/15,
.bg-indigo-500\\/10,
.bg-blue-500\\/20,
.bg-blue-500\\/15,
.bg-blue-500\\/10,
.bg-cyan-500\\/15,
.bg-cyan-500\\/10 {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(217, 119, 6, 0.08)) !important;
  border-color: rgba(251, 191, 36, 0.45) !important;
}

.text-indigo-400,
.text-indigo-300,
.text-blue-400,
.text-blue-300,
.text-cyan-400,
.text-cyan-300,
.text-violet-400,
.text-purple-400 {
  color: #fbbf24 !important;
}

.border-indigo-500\\/50,
.border-indigo-500\\/40,
.border-indigo-500\\/30,
.border-blue-500\\/40,
.border-blue-500\\/30,
.border-cyan-500\\/30 {
  border-color: rgba(251, 191, 36, 0.45) !important;
}

.rounded-2xl.border,
.rounded-3xl.border {
  border-color: rgba(251, 191, 36, 0.22) !important;
  box-shadow: inset 0 1px 0 rgba(254, 243, 199, 0.08), 0 14px 36px rgba(0, 0, 0, 0.45);
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

.rounded-2xl.border:hover,
.rounded-3xl.border:hover {
  border-color: rgba(251, 191, 36, 0.5) !important;
  box-shadow: inset 0 1px 0 rgba(254, 243, 199, 0.16), 0 18px 42px rgba(245, 158, 11, 0.12);
}

.bg-emerald-500,
.bg-teal-500,
.bg-sky-500 {
  background: linear-gradient(180deg, #fde047 0%, #f59e0b 65%, #b45309 100%) !important;
}

::-webkit-scrollbar { width: 7px; height: 7px; }
::-webkit-scrollbar-track { background: #090d16; }
::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.35); border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(251, 191, 36, 0.65); }
"""

for folder in folders:
    src_dir = os.path.join(folder, "src")
    if os.path.isdir(src_dir):
        comp_dir = os.path.join(src_dir, "components")
        os.makedirs(comp_dir, exist_ok=True)
        with open(os.path.join(comp_dir, "AmbientGoldCanvas.jsx"), "w", encoding="utf-8") as f:
            f.write(canvas_code)
        with open(os.path.join(src_dir, "index.css"), "w", encoding="utf-8") as f:
            f.write(css_code)

        app_path = os.path.join(src_dir, "App.jsx")
        if os.path.isfile(app_path):
            with open(app_path, "r", encoding="utf-8") as f:
                app = f.read()
            if "AmbientGoldCanvas" not in app:
                app = "import AmbientGoldCanvas from './components/AmbientGoldCanvas';\n" + app
            app = re.sub(r"else if \((session\.role|newRole) === 'Faculty'\)", r"if (\1 === 'Faculty')", app)
            app = re.sub(r"(?m)^\s*```\[cite:.*$", "", app)
            if not re.search(r"<AmbientGoldCanvas\s*/>", app):
                app = re.sub(r"(<Sidebar\b)", r"<AmbientGoldCanvas/>\n      \1", app, count=1)
            with open(app_path, "w", encoding="utf-8") as f:
                f.write(app)
        print("SUCCESS: Synced Obsidian & Liquid-Gold UI/UX + Sound into:", folder)
"""

### 3. Run the Python sync script and launch Vite in your terminal:
```powershell
python fix_ui.py
cd frontend
npm run dev