'use client';

import { useAppStore } from '@/lib/store';
import { PROGRAM_STATS, STAGES, GRADES } from '@/data';
import { BASE_LEVEL_THEME, LEVEL_THEME, STAGE_EXAM, gradeTheme, stageTheme } from '@/lib/stage-theme';
import { HeroAtom } from '@/components/hero-atom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Zap,
  Layers,
  Sigma,
  Trophy,
  Atom,
  Orbit,
  GraduationCap,
  WifiOff,
} from 'lucide-react';

export function HomeView() {
  const setStage = useAppStore((s) => s.setStage);
  const level = useAppStore((s) => s.level);
  const setLevel = useAppStore((s) => s.setLevel);
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* ─── Герой ─── */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/[0.08] via-card to-amber-500/[0.08] px-5 py-10 sm:px-10 sm:py-14">
        <div className="bg-molecules pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Физика школьной программы — <span className="text-gradient">понятно и с тренировкой</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Полный курс в одном приложении: структурированная теория, интерактивный тренажёр с разбором
              ошибок, справочник с постоянными и шпаргалка формул. Работает офлайн.
            </p>
          </motion.div>

          {/* статистика */}
          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mt-9 grid grid-cols-2 gap-3 sm:max-w-lg sm:grid-cols-4"
          >
            {[
              { v: PROGRAM_STATS.topics, l: 'тем теории' },
              { v: `${PROGRAM_STATS.questions}+`, l: 'вопросов' },
              { v: 2, l: 'этапа обучения' },
              { v: 5, l: 'классов: 7–11' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border bg-card/80 px-4 py-3 backdrop-blur">
                <dt className="text-2xl font-extrabold tracking-tight text-primary">{s.v}</dt>
                <dd className="text-xs text-muted-foreground">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
        <HeroAtom className="pointer-events-none absolute right-6 top-1/2 hidden h-52 w-52 -translate-y-1/2 opacity-[0.22] lg:block xl:right-10 xl:h-60 xl:w-60" />
      </section>

      {/* ─── Выбор этапа и уровня ─── */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold sm:text-2xl">Выберите этап и уровень</h2>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex rounded-xl border bg-card p-1" role="radiogroup" aria-label="Уровень программы">
              {(['base', 'advanced'] as const).map((l) => (
                <button
                  key={l}
                  role="radio"
                  aria-checked={level === l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all',
                    level === l
                      ? l === 'advanced'
                        ? LEVEL_THEME.bgSolid + ' shadow-sm'
                        : BASE_LEVEL_THEME.bgSolid + ' shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {l === 'base' ? 'Базовый' : <>Углублённый <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /></>}
                </button>
              ))}
            </div>
            {/* легенда уровня */}
            <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 rounded-full', BASE_LEVEL_THEME.dot)} aria-hidden="true" />
                базовый уровень
              </span>
              <span className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 rounded-full', LEVEL_THEME.dot)} aria-hidden="true" />
                углублённый уровень
              </span>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {STAGES.map((stage, i) => {
            const grades = GRADES.filter((g) => g.stage === stage.id);
            const t = stageTheme(stage.id);
            const isSenior = stage.id === 'senior';
            return (
              <motion.button
                key={stage.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setStage(stage.id)}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border bg-card p-6 pl-7 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg',
                  t.border,
                  t.gradient,
                  t.hoverBorder,
                  t.gradientHover
                )}
              >
                {/* цветная полоса этапа */}
                <span className={cn('absolute inset-y-0 left-0 w-1.5', t.bar)} aria-hidden="true" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-2xl font-extrabold">{stage.shortTitle}</div>
                      <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide', t.examBadge)}>
                        {STAGE_EXAM[stage.id]}
                      </span>
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-muted-foreground">{stage.title}</div>
                  </div>
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110',
                      t.iconBg
                    )}
                  >
                    {isSenior ? <Orbit className="h-6 w-6" /> : <Atom className="h-6 w-6" />}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stage.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {grades.map((g) => (
                    <span
                      key={g.id}
                      className={cn('rounded-full px-3 py-1 text-xs font-semibold', gradeTheme(g.id).chip)}
                    >
                      {g.title}
                    </span>
                  ))}
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold',
                      level === 'base' ? t.chip : LEVEL_THEME.chip
                    )}
                  >
                    {level === 'base' ? 'базовый уровень' : 'углублённый уровень'}
                  </span>
                </div>
                <div className={cn('mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5', t.textStrong)}>
                  Перейти к программе <ArrowRight className="h-4 w-4" />
                </div>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <span
            className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', level === 'base' ? BASE_LEVEL_THEME.dot : LEVEL_THEME.dot)}
            aria-hidden="true"
          />
          <span>
            {level === 'base' ? (
              <>
                <span className={cn('font-bold', BASE_LEVEL_THEME.textStrong)}>Базовый уровень</span> — для уверенного
                освоения школьной программы и подготовки к ОГЭ/ЕГЭ на базовые баллы.
              </>
            ) : (
              <>
                <span className={cn('font-bold', LEVEL_THEME.textStrong)}>Углублённый уровень</span> — расширенная теория и
                усложнённые задания: для профильных классов и высоких баллов на экзаменах.
              </>
            )}
          </span>
        </p>
      </section>

      {/* ─── Возможности ─── */}
      <section>
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">Всё для эффективных занятий</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <BookOpen className="h-5 w-5" />,
              title: 'Учебник с формулами',
              text: 'Теория разбита на темы по программе: определения, все ключевые формулы с расшифровками, таблицы и примеры решения задач.',
            },
            {
              icon: <Zap className="h-5 w-5" />,
              title: 'Умный тренажёр',
              text: '4 типа заданий: выбор ответа, множественный выбор, ввод и соответствие. Каждый вопрос — с подробным разбором. Работайте над ошибками точечно.',
            },
            {
              icon: <Trophy className="h-5 w-5" />,
              title: 'Прогресс и достижения',
              text: 'Отслеживайте освоение каждой темы, собирайте достижения и держите мотивацию на высоком уровне.',
            },
            {
              icon: <Sigma className="h-5 w-5" />,
              title: 'Шпаргалка формул',
              text: 'Все формулы школьного курса в одном месте: по классам и разделам, с расшифровкой каждой величины и единицами измерения.',
            },
            {
              icon: <Layers className="h-5 w-5" />,
              title: 'Справочник под рукой',
              text: 'Физические постоянные, приставки СИ, единицы измерений, греческий алфавит, плотности веществ и переводы единиц.',
            },
            {
              icon: <WifiOff className="h-5 w-5" />,
              title: 'Работает офлайн',
              text: 'Приложение устанавливается как PWA: теория и тренажёр доступны без интернета — занимайтесь где угодно.',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 3) * 0.07 }}
              className="rounded-2xl border bg-card p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {f.icon}
              </div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Как заниматься ─── */}
      <section className="rounded-3xl border bg-card p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
          <GraduationCap className="h-6 w-6 text-primary" /> Как заниматься
        </h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          {[
            { n: 1, t: 'Читайте теорию', d: 'Каждая тема — короткий раздел учебника с формулами и примерами решения задач. 10–15 минут чтения.' },
            { n: 2, t: 'Решайте тренажёр', d: 'Закрепляйте сразу: вопросы с разбором. Ошиблись — вернитесь к теории и повторите.' },
            { n: 3, t: 'Следите за прогрессом', d: 'Цель — 80–100% в каждой теме. Достижения помогут не сдаваться.' },
          ].map((s) => (
            <li key={s.n} className="relative pl-12">
              <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="font-bold">{s.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Button className="gap-2" onClick={() => setStage('main')}>
            Начать обучение <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate('formulas')}>
            <Sigma className="h-4 w-4" /> Шпаргалка формул
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate('reference')}>
            <Layers className="h-4 w-4" /> Справочник
          </Button>
        </div>
      </section>
    </div>
  );
}
