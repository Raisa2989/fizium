'use client';

import { parseTokens } from '@/lib/markup';
import { cn } from '@/lib/utils';

interface MarkupTextProps {
  text: string;
  className?: string;
}

/** Рендер текста с разметкой формул _{} и ^{} */
export function MarkupText({ text, className }: MarkupTextProps) {
  return <span className={cn('phys', className)}>{parseTokens(text)}</span>;
}
