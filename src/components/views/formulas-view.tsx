'use client';

import { useMemo, useState } from 'react';
import { FORMULAS } from '@/data/formulas';
import { MarkupText } from '@/components/markup-text';
import { flattenTokens } from '@/lib/markup';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Search, Sigma, ChevronDown, ChevronRight, Ruler } from 'lucide-react';

export function FormulasView() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return FORMULAS;
    return FORMULAS.map((g) => ({
      ...g,
      sections: g.sections
        .map((s) => ({
          ...s,
          cards: s.cards.filter(
            (c) =>
              flattenTokens(c.formula).toLowerCase().includes(q) ||
              c.title.toLowerCase().includes(q) ||
              flattenTokens(c.vars.join(' ')).toLowerCase().includes(q) ||
              s.title.toLowerCase().includes(q)
          ),
        }))
        .filter((s) => s.cards.length > 0),
    })).filter((g) => g.sections.length > 0);
  }, [q]);

  const totalCards = useMemo(
    () => FORMULAS.reduce((n, g) => n + g.sections.reduce((m, s) => m + s.cards.length, 0), 0),
    []
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
          <Sigma className="h-7 w-7 text-primary" aria-hidden="true" />
          Шпаргалка формул
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Все формулы школьного курса физики — {totalCards} штук по классам и разделам, с расшифровкой величин.
        </p>
      </div>

      {/* поиск */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти формулу: скорость, КПД, закон Ома…"
          aria-label="Поиск по формулам"
          className="w-full rounded-xl border bg-card px-10 py-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/25"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted"
          >
            сбросить
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          По запросу «{query}» формул не найдено. Попробуйте другое слово — например, «энергия» или «ток».
        </div>
      )}

      {filtered.map((grade, gi) => (
        <motion.section
          key={grade.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ delay: Math.min(gi * 0.05, 0.2) }}
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold">
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-extrabold text-primary">
              {grade.title}
            </span>
          </h2>

          <div className="space-y-3">
            {grade.sections.map((section) => {
              const key = `${grade.id}/${section.id}`;
              const isOpen = q ? true : open[key] ?? gi === 0;
              const cardsCount = section.cards.length;
              return (
                <div key={section.id} className="overflow-hidden rounded-2xl border bg-card">
                  <button
                    onClick={() => setOpen((o) => ({ ...o, [key]: !isOpen }))}
                    className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-muted/50"
                    aria-expanded={isOpen}
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span className="font-bold">{section.title}</span>
                    <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      {cardsCount}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="grid gap-2.5 border-t bg-muted/20 p-3 sm:grid-cols-2 lg:grid-cols-3">
                      {section.cards.map((card) => (
                        <div
                          key={card.formula + card.title}
                          className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
                        >
                          <div className="phys text-lg font-bold text-foreground">
                            <MarkupText text={card.formula} />
                          </div>
                          <div className="mt-1.5 text-sm font-semibold text-primary">{card.title}</div>
                          {card.vars.length > 0 && (
                            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-muted-foreground">
                              {card.vars.map((v, i) => (
                                <li key={i} className="flex gap-1.5">
                                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary/50" aria-hidden="true" />
                                  <span><MarkupText text={v} /></span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>
      ))}

      <p className={cn('flex items-start gap-2 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground')}>
        <Ruler className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Совет: прежде чем подставлять числа в формулу, переведите все величины в СИ (км → м, км/ч ÷ 3,6 → м/с,
          г → кг). Раздел «Справочник» содержит таблицу переводов.
        </span>
      </p>
    </div>
  );
}
