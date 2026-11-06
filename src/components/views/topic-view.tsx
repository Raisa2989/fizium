'use client';

import { useEffect, useRef, useMemo } from 'react';
import { gradeOfTopic, GRADES, loadGrade, topicById } from '@/data';
import { useAppStore } from '@/lib/store';
import { LEVEL_THEME, gradeTheme } from '@/lib/stage-theme';
import { useGradeData } from '@/hooks/use-grade-data';
import { TheoryRenderer } from '@/components/theory-renderer';
import { Trainer } from '@/components/trainer';
import { MarkupText } from '@/components/markup-text';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BookOpen, Zap, ChevronLeft, Star, CircleCheck } from 'lucide-react';

export function TopicView({ topicId }: { topicId: string }) {
  const level = useAppStore((s) => s.level);
  const view = useAppStore((s) => s.view);
  const openTopic = useAppStore((s) => s.openTopic);
  const navigate = useAppStore((s) => s.navigate);
  const setStage = useAppStore((s) => s.setStage);
  const markTheoryViewed = useAppStore((s) => s.markTheoryViewed);
  const progress = useAppStore((s) => s.progress[topicId]);

  const gradeId = gradeOfTopic(topicId);
  const gradeMeta = GRADES.find((g) => g.id === gradeId)!;
  // цветовая тема топика — акцент его класса (g7 pink · g8 rose · g9 red · g10 orange · g11 amber)
  const theme = gradeTheme(gradeId);
  const { sections, loading } = useGradeData(gradeId);

  const topic = useMemo(() => (sections ? topicById(sections, topicId) : undefined), [sections, topicId]);

  // помечаем теорию изученной при прокрутке до конца
  const endRef = useRef<HTMLDivElement>(null);
  const tab = view.name === 'topic' ? view.tab ?? 'theory' : 'theory';

  useEffect(() => {
    if (!topic || tab !== 'theory') return;
    const el = endRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) markTheoryViewed(topicId);
      },
      { rootMargin: '0px 0px -20% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [topic, topicId, tab, markTheoryViewed]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <p className="font-semibold">Тема не найдена</p>
        <Button className="mt-4" variant="secondary" onClick={() => setStage(gradeMeta.stage)}>
          Вернуться к программе
        </Button>
      </div>
    );
  }

  const qs = topic.questions.filter((q) => level === 'advanced' || !q.advanced);
  const mastered = progress ? progress.correctIds.filter((id) => qs.some((q) => q.id === id)).length : 0;
  const pct = qs.length > 0 ? Math.round((mastered / qs.length) * 100) : 0;
  const stars = pct >= 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;
  const nextTopic = findNextTopic(sections ?? [], topicId, level);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Хлебные крошки — цвет класса/этапа топика */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground" aria-label="Навигация">
        <button
          onClick={() => setStage(gradeMeta.stage)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors',
            theme.chip,
            theme.hoverBg
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', theme.dot)} aria-hidden="true" />
          {gradeMeta.title}
        </button>
        <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
        <span className="font-medium text-foreground">{topic.title}</span>
      </nav>

      {/* Заголовок */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            <MarkupText text={topic.title} />
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{topic.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topic.tags.slice(0, 6).map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {tag}
              </span>
            ))}
            {topic.only === 'advanced' && (
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', LEVEL_THEME.chip)}>
                только углублённый уровень
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-0.5 rounded-xl border bg-card px-3 py-2">
            {[0, 1, 2].map((s) => (
              <Star key={s} className={cn('h-4 w-4', s < stars ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/25')} />
            ))}
            <span className="ml-2 text-sm font-bold tabular-nums">{pct}%</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {mastered} из {qs.length} вопросов
          </span>
          {progress?.theoryViewed && (
            <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', theme.chip)}>
              <CircleCheck className="h-3 w-3" /> теория изучена
            </span>
          )}
        </div>
      </div>

      {/* Переключатель теория/тренажёр */}
      <Tabs value={tab} onValueChange={(v) => openTopic(topicId, v as 'theory' | 'trainer')}>
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="theory" className="gap-1.5">
            <BookOpen className="h-4 w-4" /> Теория
          </TabsTrigger>
          <TabsTrigger value="trainer" className="gap-1.5">
            <Zap className="h-4 w-4" /> Тренажёр · {qs.length}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Контент */}
      {tab === 'theory' ? (
        <article className="rounded-2xl border bg-card p-5 sm:p-7">
          <TheoryRenderer blocks={topic.theory} level={level} />
          <div ref={endRef} className="h-1" />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markTheoryViewed(topicId)}
              className="gap-1.5 text-muted-foreground"
            >
              <CircleCheck className="h-4 w-4" /> {progress?.theoryViewed ? 'Теория отмечена' : 'Отметить как изученную'}
            </Button>
            <Button className="gap-2" onClick={() => openTopic(topicId, 'trainer')}>
              <Zap className="h-4 w-4" /> К тренажёру ({qs.length})
            </Button>
          </div>
        </article>
      ) : (
        <div className="pb-20 sm:pb-0">
          <Trainer topic={topic} level={level} />
        </div>
      )}

      {/* Навигация между темами */}
      {nextTopic && tab === 'theory' && (
        <div className="flex justify-end">
          <Button variant="outline" className="gap-2" onClick={() => openTopic(nextTopic.id)}>
            Следующая тема: <span className="max-w-56 truncate font-semibold">{nextTopic.title}</span>
          </Button>
        </div>
      )}
      <div className="h-2" />
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground"
        onClick={() => navigate('progress')}
      >
        Мой прогресс
      </Button>
    </motion.div>
  );
}

/** Следующая тема в порядке программы (по текущему классу) */
function findNextTopic(sections: Parameters<typeof topicById>[0], currentId: string, _level: string) {
  const all = sections.flatMap((s) => s.topics);
  const idx = all.findIndex((t) => t.id === currentId);
  if (idx === -1 || idx + 1 >= all.length) return null;
  return all[idx + 1];
}
