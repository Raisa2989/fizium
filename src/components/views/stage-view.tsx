'use client';

import { useMemo } from 'react';
import type { StageId } from '@/data/types';
import { GRADES, STAGES, topicsForLevel } from '@/data';
import { useGradeData } from '@/hooks/use-grade-data';
import { useAppStore } from '@/lib/store';
import { LEVEL_THEME, STAGE_EXAM, gradeTheme, stageTheme, type StageTheme } from '@/lib/stage-theme';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  BookOpen,
  Zap,
  CheckCircle2,
  Circle,
  Star,
  Atom,
  Orbit,
  Layers,
  Sparkles,
  Eraser,
} from 'lucide-react';

export function StageView({ stage }: { stage: StageId }) {
  const level = useAppStore((s) => s.level);
  const setLevel = useAppStore((s) => s.setLevel);
  const grade = useAppStore((s) => s.grade);
  const setGrade = useAppStore((s) => s.setGrade);
  const openTopic = useAppStore((s) => s.openTopic);
  const progress = useAppStore((s) => s.progress);

  const stageInfo = STAGES.find((s) => s.id === stage)!;
  const theme = stageTheme(stage);
  const grades = GRADES.filter((g) => g.stage === stage);
  const activeGrade = grades.find((g) => g.id === grade) ?? grades[0];
  const { sections, loading } = useGradeData(activeGrade.id);

  // темы с учётом уровня
  const filtered = useMemo(() => (sections ? topicsForLevel(sections, level) : []), [sections, level]);

  const stats = useMemo(() => {
    let totalTopics = 0;
    let totalQuestions = 0;
    let done = 0;
    let questionsDone = 0;
    for (const sec of filtered) {
      for (const t of sec.topics) {
        totalTopics++;
        totalQuestions += t.questions.filter((q) => level === 'advanced' || !q.advanced).length;
        const p = progress[t.id];
        if (p) {
          questionsDone += p.correctIds.length;
          if (p.bestPct >= 80) done++;
        }
      }
    }
    return { totalTopics, totalQuestions, done, questionsDone };
  }, [filtered, progress, level]);

  return (
    <div className="space-y-6">
      {/* Цветной баннер этапа */}
      <div className={cn('overflow-hidden rounded-2xl border', theme.border, theme.gradient)}>
        <div className="flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', theme.iconBg)}>
                {stage === 'senior' ? <Orbit className="h-6 w-6" /> : <Atom className="h-6 w-6" />}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className={cn('text-2xl font-extrabold tracking-tight sm:text-3xl', theme.textStrong)}>{stageInfo.shortTitle}</h1>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide', theme.examBadge)}>
                    {STAGE_EXAM[stage]}
                  </span>
                </div>
                <div className="mt-0.5 text-sm font-medium text-muted-foreground">{stageInfo.title}</div>
              </div>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{stageInfo.description}</p>
          </div>
          {/* Переключатель уровня: базовый — цвет этапа, углублённый — тёмный шоколад */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex rounded-xl border bg-card p-1" role="radiogroup" aria-label="Уровень программы">
              {(['base', 'advanced'] as const).map((l) => (
                <button
                  key={l}
                  role="radio"
                  aria-checked={level === l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    'rounded-lg px-4 py-1.5 text-sm font-semibold transition-all',
                    level === l
                      ? l === 'advanced'
                        ? cn(LEVEL_THEME.bgSolid, 'shadow-sm')
                        : cn(theme.bgSolid, 'shadow-sm')
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {l === 'base' ? 'Базовый' : 'Углублённый'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 rounded-full', theme.dot)} aria-hidden="true" />
                базовый
              </span>
              <span className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 rounded-full', LEVEL_THEME.dot)} aria-hidden="true" />
                углублённый
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Переключатель классов: акцент цвета класса (g7 pink · g8 rose · g9 red · g10 orange · g11 amber) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        {grades.map((g) => {
          const gt = gradeTheme(g.id);
          const active = g.id === activeGrade.id;
          return (
            <button
              key={g.id}
              onClick={() => setGrade(g.id)}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all',
                active
                  ? cn(gt.borderStrong, gt.bgSoft, 'shadow-sm')
                  : cn('bg-card', gt.hoverBorder, gt.hoverBg)
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    active ? gt.bgSolid : gt.iconBg
                  )}
                >
                  {g.id === 'g10' || g.id === 'g11' ? <Orbit className="h-5 w-5" /> : <Atom className="h-5 w-5" />}
                </span>
                <div>
                  <div className="flex items-center gap-2 font-extrabold leading-tight">
                    {g.title}
                    <span className={cn('h-1.5 w-1.5 rounded-full', gt.dot)} aria-hidden="true" />
                  </div>
                  <div className="text-xs text-muted-foreground">{g.subtitle}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Статистика класса: иконки-чипы цвета этапа */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-4 sm:p-5">
        <Stat label="Тем" value={stats.totalTopics} icon={<Layers className="h-4 w-4" />} tone={theme} />
        <Stat label="Вопросов" value={stats.totalQuestions} icon={<Zap className="h-4 w-4" />} tone={theme} />
        <Stat label="Отработано" value={stats.questionsDone} icon={<Sparkles className="h-4 w-4" />} tone={theme} />
        <Stat label="Тем ≥80%" value={`${stats.done}/${stats.totalTopics}`} icon={<CheckCircle2 className="h-4 w-4" />} tone={theme} />
      </div>

      {/* Разделы и темы */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((sec, si) => {
            const secQuestions = sec.topics.reduce(
              (acc, t) => acc + t.questions.filter((q) => level === 'advanced' || !q.advanced).length,
              0
            );
            return (
              <motion.section
                key={sec.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.05 }}
                className="overflow-hidden rounded-2xl border bg-card"
              >
                <header className="border-b bg-secondary/40 px-4 py-4 sm:px-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold sm:text-lg">{sec.title}</h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">{sec.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {sec.topics.length} тем · {secQuestions} вопр.
                    </span>
                  </div>
                </header>
                <ul className="divide-y">
                  {sec.topics.map((t) => {
                    const qs = t.questions.filter((q) => level === 'advanced' || !q.advanced);
                    const p = progress[t.id];
                    const mastered = p ? p.correctIds.filter((id) => qs.some((q) => q.id === id)).length : 0;
                    const pct = qs.length > 0 ? Math.round((mastered / qs.length) * 100) : 0;
                    const stars = pct >= 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;
                    const hasMistakes = p ? p.failedIds.some((id) => !p.correctIds.includes(id)) : false;
                    return (
                      <li key={t.id}>
                        <button
                          onClick={() => openTopic(t.id)}
                          className={cn('group flex w-full items-center gap-3.5 px-4 py-4 text-left transition-colors sm:px-6', theme.hoverBg)}
                        >
                          <span className="shrink-0">
                            {stars >= 3 ? (
                              <CheckCircle2 className={cn('h-6 w-6', theme.textStrong)} />
                            ) : pct > 0 ? (
                              <span className="relative flex h-6 w-6 items-center justify-center">
                                <Circle className={cn('h-6 w-6', theme.textFaint)} />
                                <span
                                  className={cn('absolute inset-0 flex items-center justify-center text-[10px] font-bold', theme.textStrong)}
                                >
                                  {pct}
                                </span>
                              </span>
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground/30" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className={cn('font-semibold leading-snug transition-colors', theme.groupHoverText)}>
                                {t.title}
                              </span>
                              {t.only === 'advanced' && (
                                <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', LEVEL_THEME.chip)}>
                                  углубл.
                                </span>
                              )}
                              {hasMistakes && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-bold text-destructive">
                                  <Eraser className="h-3 w-3" /> ошибки
                                </span>
                              )}
                              {p?.theoryViewed && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground">
                                  <BookOpen className="h-3 w-3" /> теория
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{t.summary}</p>
                            <div className="mt-2 flex items-center gap-3">
                              <Progress value={pct} className={cn('h-1.5 max-w-56', theme.progress)} />
                              <span className="text-xs tabular-nums text-muted-foreground">
                                {mastered}/{qs.length}
                              </span>
                              <span className="flex gap-0.5">
                                {[0, 1, 2].map((s) => (
                                  <Star
                                    key={s}
                                    className={cn(
                                      'h-3.5 w-3.5',
                                      s < stars ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/25'
                                    )}
                                  />
                                ))}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={cn('h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5', theme.groupHoverText)} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon, tone }: { label: string; value: React.ReactNode; icon: React.ReactNode; tone: StageTheme }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', tone.iconBg)}>{icon}</span>
      <div className="min-w-0">
        <div className="truncate text-lg font-extrabold leading-tight">{value}</div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
