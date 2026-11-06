'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { GradeId } from '@/data/types';
import { GRADES, topicsForLevel } from '@/data';
import { useAppStore } from '@/lib/store';
import { BASE_LEVEL_THEME, LEVEL_THEME, gradeTheme, stageTheme } from '@/lib/stage-theme';
import { useManyGrades } from '@/hooks/use-grade-data';
import { ACHIEVEMENTS, evaluateAchievements, type AchievementStats } from '@/data/achievements';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  BookOpen,
  Zap,
  Flame,
  Footprints,
  TrendingUp,
  Target,
  Atom,
  FlaskConical,
  Hexagon,
  Crown,
  GraduationCap,
  Sparkles,
  Trash2,
  Lock,
} from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Footprints,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Star,
  Target,
  Trophy,
  Atom,
  FlaskConical,
  Hexagon,
  Crown,
  Flame,
};

export function ProgressView() {
  const level = useAppStore((s) => s.level);
  const progress = useAppStore((s) => s.progress);
  const unlocked = useAppStore((s) => s.unlockedAchievements);
  const setStage = useAppStore((s) => s.setStage);
  const openTopic = useAppStore((s) => s.openTopic);

  const ids: GradeId[] = ['g7', 'g8', 'g9', 'g10', 'g11'];
  const data = useManyGrades(ids);

  const stats = useMemo<AchievementStats>(() => {
    let totalQuestions = 0;
    let totalCorrect = 0;
    let topicsStarted = 0;
    let topicsCompleted = 0;
    let perfectTopics = 0;
    let theoryViewed = 0;
    let attempts = 0;
    const gradeComplete: Record<string, boolean> = {};
    for (const gid of ids) {
      const sections = data[gid];
      if (!sections) continue;
      const filtered = topicsForLevel(sections, level);
      let gradeTopics = 0;
      let gradeDone = 0;
      for (const sec of filtered) {
        for (const t of sec.topics) {
          gradeTopics++;
          const qs = t.questions.filter((q) => level === 'advanced' || !q.advanced);
          totalQuestions += qs.length;
          const p = progress[t.id];
          if (!p) continue;
          topicsStarted++;
          attempts += p.attempts;
          if (p.theoryViewed) theoryViewed++;
          const mastered = p.correctIds.filter((id) => qs.some((q) => q.id === id)).length;
          totalCorrect += mastered;
          if (qs.length > 0 && mastered / qs.length >= 0.8) {
            topicsCompleted++;
            gradeDone++;
          }
          if (qs.length > 0 && mastered === qs.length) perfectTopics++;
        }
      }
      gradeComplete[gid] = gradeTopics > 0 && gradeDone === gradeTopics;
    }
    return { totalQuestions, totalCorrect, topicsStarted, topicsCompleted, perfectTopics, theoryViewed, attempts, gradeComplete };
  }, [data, progress, level]);

  // разблокировка достижений с уведомлением
  const notifiedRef = useRef<Set<string>>(new Set());
  const unlock = useAppStore((s) => s.unlockAchievement);
  useEffect(() => {
    const unlockedIds = evaluateAchievements(stats);
    for (const id of unlockedIds) {
      if (!unlocked[id] && !notifiedRef.current.has(id)) {
        unlock(id);
        notifiedRef.current.add(id);
        const a = ACHIEVEMENTS.find((x) => x.id === id);
        if (a) {
          toast({ title: `🏆 Достижение: ${a.title}`, description: a.description });
        }
      }
    }
  }, [stats, unlocked, unlock]);

  const overallPct = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Мой прогресс</h1>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            Уровень:
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-bold',
                level === 'base' ? BASE_LEVEL_THEME.chip : LEVEL_THEME.chip
              )}
            >
              {level === 'base' ? 'базовый' : 'углублённый'}
            </span>
            <span aria-hidden="true">·</span> прогресс сохраняется автоматически
          </p>
        </div>
        <ResetButton />
      </div>

      {/* Сводка */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BigStat value={`${overallPct}%`} label="Общий прогресс" icon={<Trophy className="h-5 w-5" />} />
        <BigStat value={stats.totalCorrect} label="Верно отвечено" icon={<Zap className="h-5 w-5" />} />
        <BigStat value={stats.theoryViewed} label="Тем изучено" icon={<BookOpen className="h-5 w-5" />} />
        <BigStat value={stats.attempts} label="Заездов" icon={<Flame className="h-5 w-5" />} />
      </div>

      {/* По классам: акценты по этапам (7–9 — вишнёвая гамма, 10–11 — шоколадная) */}
      <div>
        <h2 className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xl font-bold">
          По классам
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <span className={cn('h-2 w-2 rounded-full', stageTheme('main').dot)} aria-hidden="true" />
            8–9 классы · основной этап
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <span className={cn('h-2 w-2 rounded-full', stageTheme('senior').dot)} aria-hidden="true" />
            10–11 классы · старший этап
          </span>
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ids.map((gid) => {
            const meta = GRADES.find((g) => g.id === gid)!;
            const gt = gradeTheme(gid);
            const sections = data[gid];
            const filtered = sections ? topicsForLevel(sections, level) : [];
            let total = 0;
            let done = 0;
            let weak: { id: string; title: string; pct: number }[] = [];
            for (const sec of filtered) {
              for (const t of sec.topics) {
                total++;
                const qs = t.questions.filter((q) => level === 'advanced' || !q.advanced);
                const p = progress[t.id];
                const mastered = p ? p.correctIds.filter((id) => qs.some((q) => q.id === id)).length : 0;
                const pct = qs.length > 0 ? Math.round((mastered / qs.length) * 100) : 0;
                if (pct >= 80) done++;
                if (pct < 60) weak.push({ id: t.id, title: t.title, pct });
              }
            }
            return (
              <motion.div
                key={gid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('relative overflow-hidden rounded-2xl border bg-card p-5 pl-6', gt.border)}
              >
                <span className={cn('absolute inset-y-0 left-0 w-1.5', gt.bar)} aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2.5 font-bold">
                    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', gt.iconBg)}>
                      {meta.stage === 'senior' ? <FlaskConical className="h-4 w-4" /> : <Atom className="h-4 w-4" />}
                    </span>
                    {meta.title}
                  </h3>
                  <span className={cn('text-sm font-bold tabular-nums', gt.textStrong)}>
                    {total > 0 ? Math.round((done / total) * 100) : 0}%
                  </span>
                </div>
                <Progress className={cn('mt-3 h-2', gt.progress)} value={total > 0 ? (done / total) * 100 : 0} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {done} из {total} тем завершено (≥80%)
                </p>
                {weak.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">Стоит повторить:</p>
                    {weak.slice(0, 3).map((w) => (
                      <button
                        key={w.id}
                        onClick={() => openTopic(w.id)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg border px-3 py-1.5 text-sm transition',
                          gt.hoverBorder,
                          gt.hoverBg
                        )}
                      >
                        <span className="mr-2 truncate">{w.title}</span>
                        <span className="shrink-0 text-xs font-bold text-muted-foreground">{w.pct}%</span>
                      </button>
                    ))}
                  </div>
                )}
                <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setStage(meta.stage)}>
                  Открыть программу
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Достижения */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
          <Trophy className="h-5 w-5 text-amber-500" /> Достижения ({Object.keys(unlocked).length}/{ACHIEVEMENTS.length})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const got = Boolean(unlocked[a.id]);
            const Icon = ICONS[a.icon] ?? Trophy;
            return (
              <div
                key={a.id}
                className={cn(
                  'flex items-center gap-3.5 rounded-2xl border p-4 transition-all',
                  got ? 'border-amber-400/50 bg-amber-400/[0.08] shadow-sm' : 'bg-card opacity-70'
                )}
              >
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                    got ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {got ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <div className="font-bold leading-tight">{a.title}</div>
                  <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{a.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BigStat({ value, label, icon }: { value: React.ReactNode; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="truncate text-2xl font-extrabold leading-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function ResetButton() {
  const resetProgress = useAppStore((s) => s.resetProgress);
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      {!confirming ? (
        <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => setConfirming(true)}>
          <Trash2 className="h-4 w-4" /> Сбросить прогресс
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              resetProgress();
              setConfirming(false);
              toast({ title: 'Прогресс сброшен', description: 'Можно начать с чистого листа' });
            }}
          >
            Точно сбросить
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
            Отмена
          </Button>
        </div>
      )}
    </>
  );
}
