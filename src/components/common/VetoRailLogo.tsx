import React from 'react';

export interface VetoRailLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

/**
 * Original, bespoke, unregistered brand mark for VetoRail.
 * Inspired by modern FinTech velocity aesthetics (Razorpay, Stripe),
 * featuring a custom forward-canted geometric double-rail chevron
 * symbolizing autonomous financial gating and rapid bank settlement.
 */
export function VetoRailLogo({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-slate-900'
}: VetoRailLogoProps) {
  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
    xl: 'h-14 w-14'
  };

  const iconPixelSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const px = iconPixelSizes[size] || 36;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none shrink-0 ${className}`}>
      {/* Bespoke Geometric Vector Icon */}
      <svg
        viewBox="0 0 44 44"
        width={px}
        height={px}
        style={{ width: `${px}px`, height: `${px}px`, minWidth: `${px}px`, minHeight: `${px}px`, maxWidth: `${px}px`, maxHeight: `${px}px`, display: 'inline-block' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0 transition-transform duration-300 hover:scale-105`}
        aria-label="VetoRail Brand Mark"
      >
        <defs>
          {/* Primary FinTech Blue Gradient */}
          <linearGradient id="vr-primary-gradient" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284C7" />
            <stop offset="0.5" stopColor="#2563EB" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>

          {/* Compliance Emerald Glow Gradient */}
          <linearGradient id="vr-accent-gradient" x1="16" y1="8" x2="38" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34D399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>

          {/* Subtle Ambient Drop Glow */}
          <filter id="vr-soft-shadow" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2563EB" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Background Rounded Tile */}
        <rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="12"
          fill="url(#vr-primary-gradient)"
          stroke="#38BDF8"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Dynamic Forward-Canted Left Blade (The "V" Downstroke) */}
        <path
          d="M12 11H18.5L25.5 32H19L12 11Z"
          fill="#FFFFFF"
          fillOpacity="0.95"
          filter="url(#vr-soft-shadow)"
        />

        {/* Dynamic Ascending Rail Blade (The "R" / Circuit Path) */}
        <path
          d="M21 11H27.5L34.5 32H28L21 11Z"
          fill="url(#vr-accent-gradient)"
        />

        {/* Cross-Lock Compliance Bar (Circuit-Breaker Gate) */}
        <path
          d="M16 23H32L30 27H14L16 23Z"
          fill="#FFFFFF"
          fillOpacity="0.85"
        />

        {/* Micro Laser Pulse Dot */}
        <circle cx="29" cy="15" r="2" fill="#FDE047" />
      </svg>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight ${textSizes[size]} ${textColor} font-sans`}>
              VetoRail
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200 shadow-2xs">
              AP
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
            Autonomous Banking Rail
          </span>
        </div>
      )}
    </div>
  );
}

export default VetoRailLogo;
