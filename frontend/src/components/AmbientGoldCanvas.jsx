import React, { useEffect, useRef, useState } from 'react';
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

    // Cosmic, cinematic configuration
    const staticSparkles = [];
    const trail = [];
    const interactiveSparkles = [];

    // Dense floating cinematic background particles
    for (let i = 0; i < 120; i++) {
      staticSparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseY: Math.random() * height,
        speed: 0.1 + Math.random() * 0.35,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.6,
        freq: 0.001 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
        wavyX: Math.random() * 30
      });
    }

    // Floating Bokeh & Atmospheric Light Orbs
    const orbs = [
      { rx: 0.32, ry: 0.22, r: 160, baseR: 160, speed: 0.0004, phase: 0, parallax: -0.012, pulse: 0.15 },
      { rx: 0.76, ry: 0.18, r: 110, baseR: 110, speed: 0.0006, phase: 1.8, parallax: -0.025, pulse: 0.2 },
      { rx: 0.42, ry: 0.32, r: 140, baseR: 140, speed: 0.0003, phase: 3.4, parallax: -0.015, pulse: 0.12 },
      { rx: 0.88, ry: 0.72, r: 90, baseR: 90, speed: 0.0009, phase: 4.8, parallax: 0.02, pulse: 0.25 },
      { rx: 0.12, ry: 0.78, r: 130, baseR: 130, speed: 0.0005, phase: 2.1, parallax: -0.018, pulse: 0.18 }
    ];

    const spawnSparkles = (x, y, count = 2, burst = false) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 1.2 + Math.random() * 3.0 : 0.25 + Math.random() * 1.1;
        interactiveSparkles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.2,
          size: burst ? 1.6 + Math.random() * 2.4 : 0.8 + Math.random() * 1.5,
          life: 1,
          decay: burst ? 0.02 + Math.random() * 0.012 : 0.025 + Math.random() * 0.018
        });
      }
    };

    const handleGlobalMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY, active: true };
      trail.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.length > 22) trail.shift();
      spawnSparkles(e.clientX, e.clientY, 1, false);

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
      spawnSparkles(e.clientX, e.clientY, 12, true);
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

    // Advanced, organic generative wave lines
    const drawComplexGoldenWave = (time, originY, waveScale, opacity, waveCount = 5) => {
      ctx.save();
      ctx.lineWidth = 1.2;
      for (let j = 0; j < waveCount; j++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(245, 158, 11, ${opacity * (1 - j / waveCount)})`;
        for (let x = 0; x < width; x += 15) {
          const wave1 = Math.sin(x * 0.0035 + time * 0.0008 + j * 0.6) * 45;
          const wave2 = Math.cos(x * 0.0018 - time * 0.0005 + j * 0.4) * 25;
          const ripple = Math.sin(x * 0.012 + time * 0.0015) * (4 + j);
          const y = originY + (wave1 + wave2 + ripple) * waveScale;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);
      
      const mouseActive = mousePosRef.current.active;
      const offsetX = mouseActive ? mousePosRef.current.x - width / 2 : 0;
      const offsetY = mouseActive ? mousePosRef.current.y - height / 2 : 0;

      // 1. Interactive Atmospheric Orbs / Natural Bokeh Background
      orbs.forEach((orb) => {
        const floatY = Math.sin(time * orb.speed + orb.phase) * 20;
        const floatX = Math.cos(time * orb.speed * 0.8 + orb.phase) * 15;
        const cx = width * orb.rx + floatX + offsetX * orb.parallax;
        const cy = height * orb.ry + floatY + offsetY * orb.parallax;
        
        const pulseRatio = 1 + Math.sin(time * 0.001 + orb.phase) * orb.pulse;
        const currentRadius = orb.baseR * pulseRatio;

        const grad = ctx.createRadialGradient(
          cx - currentRadius * 0.25, 
          cy - currentRadius * 0.25, 
          currentRadius * 0.02, 
          cx, 
          cy, 
          currentRadius
        );
        grad.addColorStop(0, 'rgba(254, 240, 138, 0.48)');
        grad.addColorStop(0.35, 'rgba(245, 158, 11, 0.22)');
        grad.addColorStop(0.7, 'rgba(180, 83, 9, 0.06)');
        grad.addColorStop(1, 'rgba(7, 10, 18, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Continuous Flow of Natural Generative Wave lines
      drawComplexGoldenWave(time, height * 0.45, 0.9, 0.11, 4);
      drawComplexGoldenWave(time, height * 0.72, 1.2, 0.07, 3);

      // 3. Sprawling Shimmer & Natural Glint Particle System (Stardust Wave)
      staticSparkles.forEach((sp) => {
        sp.x -= sp.speed;
        sp.phase += sp.freq;
        const floatOffset = Math.sin(sp.phase) * sp.wavyX;
        const currentY = sp.baseY + floatOffset;

        if (sp.x < -10) {
          sp.x = width + 10;
          sp.baseY = Math.random() * height;
        }

        ctx.beginPath();
        ctx.arc(sp.x, currentY, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 224, 71, ${sp.opacity * (0.6 + Math.sin(time * 0.0015 + sp.phase) * 0.4)})`;
        ctx.fill();
      });

      // 4. Cursor Follower Luminous Gold Trail
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1];
          const p1 = trail[i];
          const ratio = i / trail.length;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(253, 224, 71, ${ratio * p1.life * 0.6})`;
          ctx.lineWidth = ratio * 4.2;
          ctx.lineCap = 'round';
          ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
          ctx.shadowBlur = 12;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life -= 0.038;
        if (trail[i].life <= 0) trail.splice(i, 1);
      }

      // 5. Dynamic Interactive Spark particles (Click burst and fast cursor movement)
      for (let i = interactiveSparkles.length - 1; i >= 0; i--) {
        const sp = interactiveSparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= sp.decay;
        if (sp.life <= 0) { interactiveSparkles.splice(i, 1); continue; }
        ctx.save();
        ctx.fillStyle = `rgba(254, 249, 195, ${sp.life})`;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
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