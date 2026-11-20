import React, { useState, useRef, useEffect } from 'react';

export default function AnimatedLogoutButton({ onLogout }) {
  const [stage, setStage] = useState('default'); // 'default' | 'hover' | 'walking' | 'falling' | 'closed'
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleMouseEnter = () => {
    if (stage === 'default') setStage('hover');
  };

  const handleMouseLeave = () => {
    if (stage === 'hover') setStage('default');
  };

  const handleClick = () => {
    if (stage === 'walking' || stage === 'falling' || stage === 'closed') return;
    clearTimers();

    // 1. Figure steps through the open doorway
    setStage('walking');

    // 2. Figure drops down and door slams shut
    timersRef.current.push(
      setTimeout(() => {
        setStage('falling');
      }, 320)
    );

    timersRef.current.push(
      setTimeout(() => {
        setStage('closed');
      }, 620)
    );

    // 3. Trigger actual NexCampus ERP logout after animation completes
    timersRef.current.push(
      setTimeout(() => {
        if (onLogout) onLogout();
      }, 880)
    );
  };

  return (
    <>
      <style>{`
        .nex-logout-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          height: 40px;
          padding: 0 14px 0 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: #111827;
          color: #f8fafc;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          overflow: hidden;
          user-select: none;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
        }

        .nex-logout-btn:hover {
          background: #182236;
          border-color: rgba(244, 63, 94, 0.45);
        }

        .nex-logout-btn:active {
          transform: scale(0.97);
        }

        .nex-logout-text {
          position: relative;
          z-index: 2;
          white-space: nowrap;
        }

        .nex-logout-stage {
          position: relative;
          width: 26px;
          height: 28px;
          flex-shrink: 0;
          perspective: 140px;
        }

        /* Blue Doorway Frame */
        .nex-logout-doorway {
          position: absolute;
          right: 2px;
          top: 2px;
          width: 16px;
          height: 24px;
          border-radius: 2px;
          background: #3b82f6;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
          z-index: 1;
        }

        /* Swinging Door */
        .nex-logout-door {
          position: absolute;
          right: 2px;
          top: 2px;
          width: 16px;
          height: 24px;
          border-radius: 2px;
          background: #1d4ed8;
          border: 1px solid #60a5fa;
          transform-origin: 100% 50%;
          transform: rotateY(0deg);
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 3;
        }

        .nex-logout-door::after {
          content: '';
          position: absolute;
          left: 3px;
          top: 50%;
          width: 2.5px;
          height: 2.5px;
          border-radius: 50%;
          background: #fbbf24;
          transform: translateY(-50%);
        }

        .nex-logout-btn[data-stage="hover"] .nex-logout-door,
        .nex-logout-btn[data-stage="walking"] .nex-logout-door,
        .nex-logout-btn[data-stage="falling"] .nex-logout-door {
          transform: rotateY(38deg);
        }

        .nex-logout-btn[data-stage="closed"] .nex-logout-door {
          transform: rotateY(0deg);
          transition: transform 0.18s ease-in;
        }

        /* Walking Figure SVG */
        .nex-logout-figure {
          position: absolute;
          left: 0px;
          top: 4px;
          width: 20px;
          height: 22px;
          z-index: 2;
          fill: #ffffff;
          stroke: #ffffff;
          stroke-linecap: round;
          stroke-linejoin: round;
          transform: translate(0px, 0px) scale(1) rotate(0deg);
          opacity: 1;
          transition: transform 0.32s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s ease;
        }

        .nex-logout-btn[data-stage="hover"] .nex-logout-figure {
          transform: translate(2px, 0px) rotate(4deg);
        }

        .nex-logout-btn[data-stage="walking"] .nex-logout-figure {
          transform: translate(8px, -1px) scale(0.84) rotate(8deg);
        }

        .nex-logout-btn[data-stage="falling"] .nex-logout-figure,
        .nex-logout-btn[data-stage="closed"] .nex-logout-figure {
          transform: translate(10px, 26px) scale(0.72) rotate(24deg);
          opacity: 0;
          transition: transform 0.28s cubic-bezier(0.55, 0.06, 0.68, 0.19), opacity 0.24s ease;
        }

        /* Leg Stride Animation */
        .nex-logout-leg-front,
        .nex-logout-leg-back {
          transform-origin: 10px 13px;
          transition: transform 0.2s ease;
        }

        .nex-logout-btn[data-stage="hover"] .nex-logout-leg-front {
          transform: rotate(-18deg);
        }

        .nex-logout-btn[data-stage="hover"] .nex-logout-leg-back {
          transform: rotate(16deg);
        }

        .nex-logout-btn[data-stage="walking"] .nex-logout-leg-front {
          transform: rotate(24deg);
        }

        .nex-logout-btn[data-stage="walking"] .nex-logout-leg-back {
          transform: rotate(-22deg);
        }
      `}</style>

      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-stage={stage}
        title="Sign Out"
        className="nex-logout-btn"
      >
        <span className="nex-logout-text">Log Out</span>

        <span className="nex-logout-stage" aria-hidden="true">
          <span className="nex-logout-doorway" />

          <svg className="nex-logout-figure" viewBox="0 0 24 24">
            {/* Head */}
            <circle cx="10" cy="4.5" r="2.3" stroke="none" />
            {/* Torso */}
            <line x1="10" y1="7.5" x2="10" y2="13.5" strokeWidth="2.4" />
            {/* Arms */}
            <polyline points="6.5,11 10,8.5 13.5,10.5" fill="none" strokeWidth="2" />
            {/* Legs */}
            <line className="nex-logout-leg-back" x1="10" y1="13.5" x2="7" y2="20" strokeWidth="2.1" />
            <line className="nex-logout-leg-front" x1="10" y1="13.5" x2="13.5" y2="19.5" strokeWidth="2.1" />
          </svg>

          <span className="nex-logout-door" />
        </span>
      </button>
    </>
  );
}