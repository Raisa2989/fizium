'use client';

import {
  FUNDAMENTAL_CONSTANTS,
  SI_PREFIXES,
  SI_UNITS,
  GREEK_ALPHABET,
  UNIT_CONVERSIONS,
  DENSITIES,
} from '@/data/reference';
import { MarkupText } from '@/components/markup-text';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table2, Sigma, Ruler, Languages, Repeat, Boxes, Variable } from 'lucide-react';

export function ReferenceView() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Справочник</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Физические постоянные, единицы, приставки и таблицы — всегда под рукой.
        </p>
      </div>

      <Tabs defaultValue="constants">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-secondary/60 p-1">
          <RefTab value="constants" icon={<Variable className="h-4 w-4" />} label="Постоянные" />
          <RefTab value="si" icon={<Ruler className="h-4 w-4" />} label="Единицы СИ" />
          <RefTab value="prefixes" icon={<Sigma className="h-4 w-4" />} label="Приставки" />
          <RefTab value="greek" icon={<Languages className="h-4 w-4" />} label="Греческий" />
          <RefTab value="convert" icon={<Repeat className="h-4 w-4" />} label="Переводы" />
          <RefTab value="densities" icon={<Boxes className="h-4 w-4" />} label="Плотности" />
        </TabsList>

        <TabsContent value="constants" className="mt-4">
          <ConstantsTable />
        </TabsContent>
        <TabsContent value="si" className="mt-4">
          <div className="space-y-4">
            <SimpleTable caption="Основные единицы СИ" headers={SI_UNITS.basic.headers} rows={SI_UNITS.basic.rows} />
            <SimpleTable caption="Производные единицы СИ" headers={SI_UNITS.derived.headers} rows={SI_UNITS.derived.rows} />
          </div>
        </TabsContent>
        <TabsContent value="prefixes" className="mt-4">
          <SimpleTable caption="Приставки СИ и десятичные множители" headers={['Приставка', 'Символ', 'Множитель', 'Пример']} rows={SI_PREFIXES.map((p) => [p.prefix, p.symbol, p.factor, p.example])} />
        </TabsContent>
        <TabsContent value="greek" className="mt-4">
          <SimpleTable caption="Греческие буквы в физических формулах" headers={GREEK_ALPHABET.headers} rows={GREEK_ALPHABET.rows} />
        </TabsContent>
        <TabsContent value="convert" className="mt-4">
          <SimpleTable caption="Перевод внесистемных единиц в СИ" headers={UNIT_CONVERSIONS.headers} rows={UNIT_CONVERSIONS.rows} />
        </TabsContent>
        <TabsContent value="densities" className="mt-4">
          <SimpleTable caption="Плотности веществ (школьная таблица)" headers={DENSITIES.headers} rows={DENSITIES.rows} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RefTab({ value, icon, label }: { value: string; icon: React.ReactNode; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
    >
      {icon}
      {label}
    </TabsTrigger>
  );
}

function ConstantsTable() {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-2xl border nice-scroll">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-primary/[0.08]">
              <th className="px-3 py-2.5 text-left font-bold text-primary">Обозначение</th>
              <th className="px-3 py-2.5 text-left font-bold text-primary">Название</th>
              <th className="px-3 py-2.5 text-right font-bold text-primary">Значение</th>
              <th className="px-3 py-2.5 text-left font-bold text-primary">Единицы</th>
              <th className="px-3 py-2.5 text-center font-bold text-primary">Классы</th>
            </tr>
          </thead>
          <tbody>
            {FUNDAMENTAL_CONSTANTS.map((c) => (
              <tr key={c.symbol + c.name} className="border-t odd:bg-muted/20">
                <td className="px-3 py-2.5 font-bold">
                  <MarkupText text={c.symbol} />
                </td>
                <td className="px-3 py-2.5">{c.name}</td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                  <MarkupText text={c.value} />
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  <MarkupText text={c.unit} />
                </td>
                <td className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">{c.grades}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3.5 text-sm">
        Значения указаны с точностью, достаточной для школьных задач. В справочных таблицах задач ОГЭ и ЕГЭ могут
        быть свои округления — всегда сверяйтесь с таблицами в условии задачи.
      </p>
    </div>
  );
}

function SimpleTable({ headers, rows, caption }: { headers: string[]; rows: string[][]; caption?: string }) {
  return (
    <div className="space-y-2">
      {caption && (
        <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Table2 className="h-4 w-4" />
          {caption}
        </h3>
      )}
      <div className="overflow-x-auto rounded-2xl border nice-scroll">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="bg-primary/[0.08]">
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2.5 text-left font-bold text-primary">
                  <MarkupText text={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? 'border-t bg-muted/30' : 'border-t'}>
                {row.map((cell, ci) => (
                  <td key={ci} className={ci === 0 ? 'px-3 py-2.5 font-medium' : 'px-3 py-2.5'}>
                    <MarkupText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
