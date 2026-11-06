'use client';

import { cn } from '@/lib/utils';

/**
 * Компактная марка «ФизиУм»: атом — три эллиптические орбиты
 * с ядром и электроном. Читается даже в 24px.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn('text-primary', className)} aria-hidden="true">
      {/* орбиты */}
      <g transform="translate(24 24)">
        <ellipse rx="19" ry="7.5" stroke="currentColor" strokeWidth="2.6" />
        <ellipse rx="19" ry="7.5" stroke="currentColor" strokeWidth="2.6" transform="rotate(60)" />
        <ellipse rx="19" ry="7.5" stroke="currentColor" strokeWidth="2.6" transform="rotate(120)" />
      </g>
      {/* ядро */}
      <circle cx="24" cy="24" r="4.6" fill="currentColor" />
      {/* электроны */}
      <circle cx="24" cy="16.5" r="2.3" fill="currentColor" opacity="0.6" />
      <circle cx="34.6" cy="30.6" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
