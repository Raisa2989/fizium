'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { Question, Topic, Level } from '@/data/types';
import { useAppStore } from '@/lib/store';
import { checkInput, LETTERS, shuffle } from '@/lib/markup';
import { MarkupText } from './markup-text';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Trophy,
  Target,
  Zap,
  ListChecks,
  Sparkles,
  Eraser,
  BookOpen,
} from 'lucide-react';

type Mode = 'all' | 'unseen' | 'mistakes';

interface TrainerProps {
  topic: Topic;
  level: Level;
}

export function Trainer({ topic, level }: TrainerProps) {
  const questions = useMemo(
    () => topic.questions.filter((q) => level === 'advanced' || !q.advanced),
    [topic, level]
  );

  const progress = useAppStore((s) => s.progress[topic.id]);
  const [phase, setPhase] = useState<'config' | 'run' | 'results'>('config');
  const [mode, setMode] = useState<Mode>('all');
  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ q: Question; correct: boolean }[]>([]);

  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);

  const correctCount = results.filter((r) => r.correct).length;
  const streak = useMemo(() => {
    let s = 0;
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i].correct) s++;
      else break;
    }
    return s;
  }, [results]);

  const buildQueue = useCallback(
    (m: Mode): Question[] => {
      const correctSet = new Set(progress?.correctIds ?? []);
      const failedSet = new Set(progress?.failedIds ?? []);
      let list: Question[];
      switch (m) {
        case 'unseen':
          list = questions.filter((q) => !correctSet.has(q.id));
          break;
        case 'mistakes':
          list = questions.filter((q) => failedSet.has(q.id) && !correctSet.has(q.id));
          break;
        default:
          list = questions;
      }
      if (list.length === 0 && m !== 'all') list = questions;
      return settings.shuffleQuestions ? shuffle(list) : list;
    },
    [questions, progress, settings.shuffleQuestions]
  );

  const start = useCallback(
    (m: Mode) => {
      const q = buildQueue(m);
      if (q.length === 0) return;
      setQueue(q);
      setIndex(0);
      setResults([]);
      setPhase('run');
    },
    [buildQueue]
  );

  const onQuestionDone = useCallback(
    (q: Question, correct: boolean) => {
      useAppStore.getState().recordAnswer(topic.id, q.id, correct);
      setResults((r) => [...r, { q, correct }]);
    },
    [topic.id]
  );

  const next = useCallback(() => {
    if (index + 1 >= queue.length) {
      const finalResults = results;
      const correct = finalResults.filter((r) => r.correct).length;
      useAppStore.getState().finishRun(topic.id, correct, finalResults.length);
      setPhase('results');
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, queue.length, results, topic.id]);

  const unseenCount = questions.filter((q) => !(progress?.correctIds ?? []).includes(q.id)).length;
  const mistakesCount = questions.filter(
    (q) => (progress?.failedIds ?? []).includes(q.id) && !(progress?.correctIds ?? []).includes(q.id)
  ).length;

  // ─── Экран настройки ──────────────────────────────────────────────────
  if (phase === 'config') {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Тренажёр темы</h3>
              <p className="text-sm text-muted-foreground">{questions.length} вопросов по уровню «{level === 'base' ? 'базовый' : 'углублённый'}»</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ModeCard
              active={mode === 'all'}
              onClick={() => setMode('all')}
              icon={<ListChecks className="h-4 w-4" />}
              title="Все вопросы"
              desc={`${questions.length}`}
            />
            <ModeCard
              active={mode === 'unseen'}
              onClick={() => setMode('unseen')}
              icon={<Sparkles className="h-4 w-4" />}
              title="Неотработанные"
              desc={`${unseenCount}`}
            />
            <ModeCard
              active={mode === 'mistakes'}
              onClick={() => setMode('mistakes')}
              icon={<Eraser className="h-4 w-4" />}
              title="Работа над ошибками"
              desc={mistakesCount > 0 ? `${mistakesCount}` : 'нет ошибок'}
              disabled={mistakesCount === 0}
            />
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Перемешивать вопросы</div>
              <div className="text-xs text-muted-foreground">случайный порядок</div>
            </div>
            <Switch
              checked={settings.shuffleQuestions}
              onCheckedChange={(v) => setSettings({ shuffleQuestions: v })}
              aria-label="Перемешивать вопросы"
            />
          </div>

          <Button className="mt-5 w-full gap-2" size="lg" onClick={() => start(mode)}>
            Начать тренировку <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {progress && progress.attempts > 0 && (
          <div className="rounded-2xl border bg-card p-5">
            <h4 className="mb-3 text-sm font-bold text-muted-foreground">Ваша статистика по теме</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatMini label="Заездов" value={progress.attempts} />
              <StatMini label="Лучший результат" value={`${progress.bestPct}%`} />
              <StatMini label="Последний" value={`${progress.lastPct}%`} />
              <StatMini label="Отработано" value={`${new Set(progress.correctIds).size}/${questions.length}`} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Результаты ───────────────────────────────────────────────────────
  if (phase === 'results') {
    const pct = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
    const wrong = results.filter((r) => !r.correct);
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div
          className={cn(
            'rounded-2xl border p-6 text-center',
            pct >= 80 ? 'border-primary/40 bg-primary/[0.07]' : pct >= 60 ? 'border-amber-400/40 bg-amber-400/10' : 'border-destructive/40 bg-destructive/10'
          )}
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
            {pct >= 80 ? (
              <Trophy className="h-7 w-7 text-primary" />
            ) : pct >= 60 ? (
              <Target className="h-7 w-7 text-amber-600 dark:text-amber-400" />
            ) : (
              <RotateCcw className="h-7 w-7 text-destructive" />
            )}
          </div>
          <div className="text-4xl font-extrabold tracking-tight">{pct}%</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {correctCount} из {results.length} верно · тема «{topic.title}»
          </p>
          <p className="mt-3 text-sm font-medium">
            {pct === 100 && 'Идеально! Все вопросы отработаны!'}
            {pct >= 80 && pct < 100 && 'Отличный результат — почти безупречно!'}
            {pct >= 60 && pct < 80 && 'Неплохо! Загляните в теорию и поработайте над ошибками.'}
            {pct < 60 && 'Есть куда расти: повторите теорию и попробуйте снова.'}
          </p>
        </div>

        {wrong.length > 0 && (
          <div className="rounded-2xl border bg-card p-4 sm:p-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <X className="h-4 w-4 text-destructive" /> Ошибки ({wrong.length})
            </h4>
            <div className="max-h-96 space-y-3 overflow-y-auto pr-2 nice-scroll">
              {wrong.map(({ q }) => (
                <div key={q.id} className="rounded-xl border border-destructive/25 bg-destructive/[0.04] p-3.5">
                  <p className="text-sm font-medium">
                    <MarkupText text={q.text} />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Ответ: </span>
                    <AnswerPreview q={q} />
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    <MarkupText text={q.explanation} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {wrong.length > 0 && (
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => {
                const ids = new Set(wrong.map((w) => w.q.id));
                const q = settings.shuffleQuestions ? shuffle(questions.filter((x) => ids.has(x.id))) : questions.filter((x) => ids.has(x.id));
                setQueue(q);
                setIndex(0);
                setResults([]);
                setPhase('run');
              }}
            >
              <RotateCcw className="h-4 w-4" /> Повторить ошибочные ({wrong.length})
            </Button>
          )}
          <Button variant="secondary" className="gap-2" onClick={() => setPhase('config')}>
            <ListChecks className="h-4 w-4" /> Новая тренировка
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => useAppStore.getState().openTopic(topic.id, 'theory')}
          >
            <BookOpen className="h-4 w-4" /> К теории
          </Button>
        </div>
      </motion.div>
    );
  }

  // ─── Прогон вопросов ──────────────────────────────────────────────────
  const q = queue[index];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-sm font-semibold text-muted-foreground">
          {index + 1} / {queue.length}
        </span>
        <Progress value={(index / queue.length) * 100} className="h-2" />
        {streak >= 2 && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary soft-pulse">
            <Zap className="h-3 w-3" /> {streak}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.18 }}
        >
          <QuestionCard
            q={q}
            onDone={(correct) => onQuestionDone(q, correct)}
            onNext={next}
            isLast={index + 1 >= queue.length}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Карточка вопроса ──────────────────────────────────────────────────

function QuestionCard({
  q,
  onDone,
  onNext,
  isLast,
}: {
  q: Question;
  onDone: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [multi, setMulti] = useState<number[]>([]);
  const [text, setText] = useState('');
  const [match, setMatch] = useState<Record<number, number>>({}); // leftIdx → rightIdx
  const [activeLeft, setActiveLeft] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const rightOrder = useMemo(() => shuffle(q.pairs?.map((_, i) => i) ?? []), [q.pairs]);

  // показываем разбор — плавно прокручиваем к нему
  useEffect(() => {
    if (checked && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [checked]);

  const canCheck = (): boolean => {
    switch (q.type) {
      case 'single':
        return selected !== null;
      case 'multiple':
        return multi.length > 0;
      case 'input':
        return text.trim().length > 0;
      case 'matching':
        return (q.pairs?.length ?? 0) > 0 && Object.keys(match).length === q.pairs?.length;
    }
    return false;
  };

  const doCheck = () => {
    let correct = false;
    switch (q.type) {
      case 'single':
        correct = selected === q.correct;
        break;
      case 'multiple': {
        const need = [...(q.correct as number[])].sort().join(',');
        const got = [...multi].sort().join(',');
        correct = need === got;
        break;
      }
      case 'input':
        correct = checkInput(text, q);
        break;
      case 'matching':
        correct = (q.pairs ?? []).every((_, i) => match[i] !== undefined && rightOrder[match[i]] === i);
        break;
    }
    setWasCorrect(correct);
    setChecked(true);
    onDone(correct);
  };

  const optionState = (i: number): 'idle' | 'selected' | 'correct' | 'wrong' => {
    if (!checked) {
      if (q.type === 'single' && selected === i) return 'selected';
      if (q.type === 'multiple' && multi.includes(i)) return 'selected';
      return 'idle';
    }
    const correctSet =
      q.type === 'single' ? [q.correct as number] : q.type === 'multiple' ? (q.correct as number[]) : [];
    const chosenSet = q.type === 'single' ? (selected !== null ? [selected] : []) : multi;
    if (correctSet.includes(i)) return 'correct';
    if (chosenSet.includes(i)) return 'wrong';
    return 'idle';
  };

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {q.type === 'single' && 'один ответ'}
          {q.type === 'multiple' && 'несколько ответов'}
          {q.type === 'input' && 'ввод ответа'}
          {q.type === 'matching' && 'соответствие'}
        </span>
        <span className="flex items-center gap-0.5" aria-label={`Сложность ${q.difficulty} из 3`}>
          {[1, 2, 3].map((d) => (
            <span
              key={d}
              className={cn('h-1.5 w-4 rounded-full', d <= q.difficulty ? 'bg-primary' : 'bg-muted')}
            />
          ))}
        </span>
        {q.advanced && (
          <span className="rounded-full bg-amber-800/10 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
            углублённый
          </span>
        )}
      </div>

      <p className="text-base font-semibold leading-relaxed sm:text-lg">
        <MarkupText text={q.text} />
      </p>

      {/* single / multiple */}
      {(q.type === 'single' || q.type === 'multiple') && (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {(q.options ?? []).map((opt, i) => {
            const st = optionState(i);
            return (
              <button
                key={i}
                disabled={checked}
                onClick={() => {
                  if (q.type === 'single') setSelected(i);
                  else setMulti((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]));
                }}
                className={cn(
                  'group flex items-start gap-3 rounded-xl border p-3.5 text-left text-[15px] transition-all',
                  st === 'idle' && 'hover:border-primary/50 hover:bg-primary/[0.03] cursor-pointer',
                  st === 'selected' && 'border-primary bg-primary/[0.08]',
                  st === 'correct' && 'border-primary bg-primary/10 font-medium',
                  st === 'wrong' && 'border-destructive bg-destructive/10'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                    st === 'idle' && 'border-border text-muted-foreground',
                    st === 'selected' && 'border-primary bg-primary text-primary-foreground',
                    st === 'correct' && 'border-primary bg-primary text-primary-foreground',
                    st === 'wrong' && 'border-destructive bg-destructive text-destructive-foreground'
                  )}
                >
                  {st === 'correct' ? <Check className="h-3.5 w-3.5" /> : st === 'wrong' ? <X className="h-3.5 w-3.5" /> : LETTERS[i]}
                </span>
                <span className="leading-snug">
                  <MarkupText text={opt} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* input */}
      {q.type === 'input' && (
        <div className="mt-4">
          <input
            value={text}
            disabled={checked}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canCheck() && !checked) doCheck();
            }}
            placeholder="Ваш ответ…"
            className="w-full rounded-xl border bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-70"
            aria-label="Поле ввода ответа"
          />
          {checked && (
            <p className={cn('mt-2 text-sm font-medium', wasCorrect ? 'text-primary' : 'text-destructive')}>
              {wasCorrect ? 'Верно!' : <>Правильный ответ: <b><AnswerPreview q={q} /></b></>}
            </p>
          )}
        </div>
      )}

      {/* matching */}
      {q.type === 'matching' && q.pairs && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            {q.pairs.map((p, li) => {
              const pairedRight = match[li];
              return (
                <button
                  key={li}
                  disabled={checked}
                  onClick={() => {
                    if (pairedRight !== undefined) {
                      setMatch((m) => {
                        const c = { ...m };
                        delete c[li];
                        return c;
                      });
                    } else {
                      setActiveLeft(li);
                    }
                  }}
                  className={cn(
                    'w-full rounded-xl border px-3.5 py-2.5 text-left text-[15px] transition',
                    !checked && 'cursor-pointer hover:border-primary/50',
                    activeLeft === li && !checked && 'border-primary bg-primary/[0.08] ring-2 ring-primary/20',
                    checked && match[li] !== undefined && rightOrder[match[li]] === li && 'border-primary bg-primary/10',
                    checked && (match[li] === undefined || rightOrder[match[li]] !== li) && 'border-destructive bg-destructive/10',
                    pairedRight !== undefined && !checked && 'border-primary/50 bg-primary/[0.05]'
                  )}
                >
                  <MarkupText text={p.left} />
                  {pairedRight !== undefined && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      → <MarkupText text={q.pairs![rightOrder[pairedRight]].right} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            {rightOrder.map((ri, vi) => {
              const usedBy = Object.entries(match).find(([, vr]) => vr === vi)?.[0];
              return (
                <button
                  key={vi}
                  disabled={checked || usedBy !== undefined}
                  onClick={() => {
                    if (activeLeft !== null) {
                      setMatch((m) => ({ ...m, [activeLeft]: vi }));
                      setActiveLeft(null);
                    }
                  }}
                  className={cn(
                    'w-full rounded-xl border px-3.5 py-2.5 text-left text-[15px] transition',
                    !checked && usedBy === undefined && 'cursor-pointer hover:border-primary/50 hover:bg-primary/[0.03]',
                    usedBy !== undefined && !checked && 'bg-muted/50 text-muted-foreground',
                    checked && usedBy !== undefined && rightOrder[vi] === Number(usedBy) && 'border-primary bg-primary/10',
                    checked && usedBy !== undefined && rightOrder[vi] !== Number(usedBy) && 'border-destructive/5'
                  )}
                >
                  <MarkupText text={q.pairs![ri].right} />
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Нажмите элемент слева, затем — соответствующий справа. Нажмите на связанный элемент, чтобы отвязать.
          </p>
        </div>
      )}

      {/* Разбор */}
      {checked && (
        <motion.div
          ref={feedbackRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 overflow-hidden"
        >
          <div
            className={cn(
              'rounded-xl border p-4',
              wasCorrect ? 'border-primary/30 bg-primary/[0.06]' : 'border-destructive/30 bg-destructive/[0.05]'
            )}
          >
            <div className={cn('mb-1 flex items-center gap-1.5 text-sm font-bold', wasCorrect ? 'text-primary' : 'text-destructive')}>
              {wasCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {wasCorrect ? 'Верно!' : 'Неверно'}
            </div>
            <p className="text-sm leading-relaxed text-foreground/85">
              <MarkupText text={q.explanation} />
            </p>
          </div>
        </motion.div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        {!checked ? (
          <Button size="lg" className="gap-2" disabled={!canCheck()} onClick={doCheck}>
            Ответить <Check className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="lg" className="gap-2" onClick={onNext}>
            {isLast ? 'К результатам' : 'Далее'} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Вспомогательные ───────────────────────────────────────────────────

function ModeCard({
  active,
  onClick,
  icon,
  title,
  desc,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'rounded-xl border p-3.5 text-left transition-all',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'cursor-pointer hover:border-primary/50',
        active ? 'border-primary bg-primary/[0.08] ring-1 ring-primary/30' : 'bg-card'
      )}
    >
      <div className="flex items-center gap-2 text-sm font-bold">
        <span className={cn('text-primary', active && 'text-primary')}>{icon}</span>
        {title}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}

function StatMini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-muted/30 px-3 py-2.5 text-center">
      <div className="text-lg font-bold leading-tight">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function AnswerPreview({ q }: { q: Question }) {
  switch (q.type) {
    case 'single':
      return <MarkupText text={q.options?.[q.correct as number] ?? ''} />;
    case 'multiple':
      return (
        <>
          {(q.correct as number[])
            .map((i) => q.options?.[i])
            .filter(Boolean)
            .map((t, i) => (
              <span key={i}>
                {i > 0 && '; '}
                <MarkupText text={t as string} />
              </span>
            ))}
        </>
      );
    case 'input':
      return <b>{q.answer}</b>;
    case 'matching':
      return (
        <span className="inline-flex flex-wrap gap-x-3">
          {q.pairs?.map((p, i) => (
            <span key={i}>
              <MarkupText text={p.left} /> → <MarkupText text={p.right} />
            </span>
          ))}
        </span>
      );
  }
  return null;
}
