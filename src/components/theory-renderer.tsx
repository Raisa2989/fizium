'use client';

import { memo } from 'react';
import type { TheoryBlock, Level } from '@/data/types';
import { MarkupText } from './markup-text';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Calculator,
  Table2,
  GraduationCap,
} from 'lucide-react';

interface Props {
  blocks: TheoryBlock[];
  level: Level;
}

/** Рендер теоретических блоков темы */
export const TheoryRenderer = memo(function TheoryRenderer({ blocks, level }: Props) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} level={level} />
      ))}
    </div>
  );
});

function BlockView({ block, level }: { block: TheoryBlock; level: Level }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className="text-[15px] leading-relaxed sm:text-base text-foreground/90">
          <MarkupText text={block.text} />
        </p>
      );

    case 'h':
      return (
        <h3 className="pt-2 text-lg font-bold sm:text-xl text-foreground flex items-center gap-2">
          <span className="inline-block h-5 w-1.5 rounded-full bg-primary/80" />
          <MarkupText text={block.text} />
        </h3>
      );

    case 'def':
      return (
        <div className="rounded-xl border border-primary/25 bg-primary/[0.06] p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-bold text-primary">
            <BookOpen className="h-4 w-4 shrink-0" />
            <MarkupText text={block.term} />
          </div>
          <p className="text-[15px] leading-relaxed text-foreground/90">
            <MarkupText text={block.text} />
          </p>
        </div>
      );

    case 'formula':
      return (
        <figure className="rounded-xl border bg-muted/40 px-4 py-4 text-center">
          <div className="phys text-xl font-semibold sm:text-2xl text-foreground">
            <MarkupText text={block.text} />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-xs sm:text-sm text-muted-foreground">
              <MarkupText text={block.caption} />
            </figcaption>
          )}
        </figure>
      );

    case 'list':
      return block.ordered ? (
        <ol className="ml-5 list-decimal space-y-2 text-[15px] leading-relaxed text-foreground/90 marker:text-primary marker:font-semibold">
          {block.items.map((item, i) => (
            <li key={i}>
              <MarkupText text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="ml-5 list-disc space-y-2 text-[15px] leading-relaxed text-foreground/90 marker:text-primary">
          {block.items.map((item, i) => (
            <li key={i}>
              <MarkupText text={item} />
            </li>
          ))}
        </ul>
      );

    case 'table':
      return (
        <figure className="space-y-2">
          {block.caption && (
            <figcaption className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Table2 className="h-4 w-4" />
              <MarkupText text={block.caption} />
            </figcaption>
          )}
          <div className="overflow-x-auto rounded-xl border nice-scroll">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="bg-primary/[0.08]">
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-3 py-2.5 text-left font-bold text-primary">
                      <MarkupText text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className={cn('border-t', ri % 2 === 1 && 'bg-muted/30')}
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-foreground/90">
                        <MarkupText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );

    case 'tip':
      return (
        <div className="flex gap-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-[15px] leading-relaxed text-foreground/90">
            <MarkupText text={block.text} />
          </p>
        </div>
      );

    case 'warn':
      return (
        <div className="flex gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="text-[15px] leading-relaxed text-foreground/90">
            <MarkupText text={block.text} />
          </p>
        </div>
      );

    case 'example':
      return (
        <div className="rounded-xl border border-dashed border-primary/40 bg-card p-4">
          <div className="mb-1.5 flex items-center gap-2 text-sm font-bold text-primary">
            <Calculator className="h-4 w-4 shrink-0" />
            {block.title ?? 'Пример'}
          </div>
          <p className="text-[15px] leading-relaxed text-foreground/90">
            <MarkupText text={block.text} />
          </p>
        </div>
      );

    case 'deep':
      if (level === 'advanced') {
        return (
          <div className="rounded-2xl border border-orange-400/40 bg-orange-500/[0.07] p-4 dark:border-orange-400/40 dark:bg-orange-400/[0.09] sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-700 dark:text-orange-300">
              <GraduationCap className="h-4 w-4" />
              Углублённый уровень · <MarkupText text={block.title} />
            </div>
            <div className="space-y-4">
              {block.blocks.map((inner, i) => (
                <BlockView key={i} block={inner} level={level} />
              ))}
            </div>
          </div>
        );
      }
      return (
        <div className="rounded-xl border border-orange-300/50 bg-orange-500/[0.05] px-4 py-3.5 text-sm text-muted-foreground dark:border-orange-400/40 dark:bg-orange-400/[0.06]">
          <div className="mb-1 flex items-center gap-2 font-semibold text-orange-700 dark:text-orange-300">
            <GraduationCap className="h-4 w-4" />
            Материал углублённого уровня: <MarkupText text={block.title} />
          </div>
          Переключитесь на углублённый уровень, чтобы изучить этот материал.
        </div>
      );

    default:
      return null;
  }
}
