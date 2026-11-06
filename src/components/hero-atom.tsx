'use client';

import { cn } from '@/lib/utils';

/**
 * Декоративный атом для героя: ядро, три орбиты с электронами
 * и траектории-подсказки. Компактный — полностью помещается в карточку.
 */
export function HeroAtom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 220" fill="none" className={cn('text-primary', className)} aria-hidden="true">
      <g transform="translate(110 110)">
        {/* три основные орбиты */}
        <ellipse rx="88" ry="34" stroke="currentColor" strokeWidth="2.6" />
        <ellipse rx="88" ry="34" stroke="currentColor" strokeWidth="2.6" transform="rotate(60)" />
        <ellipse rx="88" ry="34" stroke="currentColor" strokeWidth="2.6" transform="rotate(120)" />

        {/* внутренняя орбита */}
        <ellipse rx="46" ry="17" stroke="currentColor" strokeWidth="2" opacity="0.5" />

        {/* ядро */}
        <circle r="10" fill="currentColor" />
        <circle r="14" stroke="currentColor" strokeWidth="1.6" opacity="0.4" />

        {/* электроны */}
        <circle cx="0" cy="-34" r="5" fill="currentColor" opacity="0.75" />
        <circle cx="29.4" cy="51" r="5" fill="currentColor" opacity="0.65" />
        <circle cx="76" cy="-17" r="4.4" fill="currentColor" opacity="0.55" />
        <circle cx="-38" cy="8" r="4" fill="currentColor" opacity="0.5" />

        {/* вектор скорости электрона (касательная) */}
        <path d="M4 -34 L26 -50" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
        <path d="M26 -50 l-5 1 M26 -50 l-1 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
      </g>

      {/* плавающие частицы */}
      <circle cx="30" cy="42" r="4.5" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <circle cx="186" cy="180" r="3.5" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <circle cx="196" cy="52" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="36" cy="190" r="3" fill="currentColor" opacity="0.35" />

      {/* волновая синусоида */}
      <path d="M14 116 q14 -18 28 0 t 28 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}
