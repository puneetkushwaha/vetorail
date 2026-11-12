'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface GsapFadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

/**
 * High-performance GSAP entrance animation component.
 * Executes silky smooth directional fade on mount.
 */
export function GsapFadeIn({
  children,
  delay = 0,
  duration = 0.8,
  yOffset = 25,
  direction = 'up',
  className = ''
}: GsapFadeInProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !elRef.current) return;

    let initX = 0;
    let initY = 0;

    switch (direction) {
      case 'up':
        initY = yOffset;
        break;
      case 'down':
        initY = -yOffset;
        break;
      case 'left':
        initX = yOffset > 0 ? yOffset : 35;
        break;
      case 'right':
        initX = yOffset > 0 ? -yOffset : -35;
        break;
      default:
        initY = yOffset;
    }

    gsap.fromTo(
      elRef.current,
      {
        opacity: 0,
        x: initX,
        y: initY,
        willChange: 'transform, opacity'
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power3.out'
      }
    );
  }, [delay, duration, yOffset, direction]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}

/**
 * GSAP continuous float animation component for floating interactive chips & cards.
 */
export function GsapFloatingItem({
  children,
  yRange = 8,
  floatOffset,
  duration = 3,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode;
  yRange?: number;
  floatOffset?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const effectiveRange = floatOffset !== undefined ? Math.abs(floatOffset) : yRange;

  useEffect(() => {
    if (typeof window === 'undefined' || !elRef.current) return;

    const anim = gsap.to(elRef.current, {
      y: -effectiveRange,
      duration,
      delay,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    return () => {
      anim.kill();
    };
  }, [effectiveRange, duration, delay]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Interactive 3D tilt hover effect powered by GSAP.
 */
export function GsapTiltCard({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotationY: x * 0.04,
      rotationX: -y * 0.04,
      transformPerspective: 1000,
      ease: 'power1.out',
      duration: 0.3
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      ease: 'power2.out',
      duration: 0.5
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </div>
  );
}
