'use client';

import { useAppStore } from '@/lib/store';
import { STAGES, PROGRAM_STATS } from '@/data';
import { BASE_LEVEL_THEME, LEVEL_THEME, STAGE_EXAM, stageTheme } from '@/lib/stage-theme';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Atom,
  BookOpen,
  CircleHelp,
  Orbit,
  GraduationCap,
  Layers,
  ListChecks,
  MousePointerClick,
  PenLine,
  Signal,
  Sigma,
  Trophy,
  WifiOff,
} from 'lucide-react';

/** Справка: как устроено приложение */
export function HelpView() {
  const navigate = useAppStore((s) => s.navigate);
  const setStage = useAppStore((s) => s.setStage);
  const level = useAppStore((s) => s.level);
  const setLevel = useAppStore((s) => s.setLevel);

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
            <CircleHelp className="h-7 w-7 text-primary" /> Как устроен ФизиУм
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Короткая справка: структура курса, разница уровней, тренажёр, прогресс и офлайн-режим.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => navigate('home')}>
          <ArrowLeft className="h-4 w-4" /> На главную
        </Button>
      </div>

      {/* ─── 1. Структура курса ─── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border bg-card p-5 sm:p-6"
      >
        <h2 className="text-lg font-bold sm:text-xl">Структура курса: 2 этапа × 2 уровня</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Курс соответствует федеральным рабочим программам и разделён на два этапа: 7–9 классы (подготовка к
          ОГЭ) и 10–11 классы (подготовка к ЕГЭ). Внутри каждого этапа можно выбрать уровень программы —
          переключатель находится на главной и на странице этапа.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {STAGES.map((stage) => {
            const t = stageTheme(stage.id);
            const isSenior = stage.id === 'senior';
            return (
              <div key={stage.id} className={cn('relative overflow-hidden rounded-xl border p-4 pl-5', t.border, t.gradient)}>
                <span className={cn('absolute inset-y-0 left-0 w-1.5', t.bar)} aria-hidden="true" />
                <div className="flex items-center gap-2.5">
                  <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', t.iconBg)}>
                    {isSenior ? <Orbit className="h-5 w-5" /> : <Atom className="h-5 w-5" />}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold">{stage.shortTitle}</span>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', t.examBadge)}>
                        {STAGE_EXAM[stage.id]}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{stage.title}</div>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.description}</p>
                <Button size="sm" variant="outline" className="mt-3 h-8 gap-1.5 text-xs" onClick={() => setStage(stage.id)}>
                  Открыть этап
                </Button>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ─── 2. Модель уровней ─── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.06 }}
        className="rounded-2xl border bg-card p-5 sm:p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <GraduationCap className="h-5 w-5 text-primary" /> Уровни: углублённый включает базовый
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Как и в федеральных рабочих программах, <b className="text-foreground">углублённый уровень — это
          надстройка над базовым</b>, а не отдельный курс: углублённый ученик должен уверенно владеть и базой,
          и материалом сверх неё.
        </p>

        {/* визуальная схема */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className={cn('rounded-xl border p-4', BASE_LEVEL_THEME.border, BASE_LEVEL_THEME.bgSoft)}>
            <div className="flex items-center gap-2">
              <span className={cn('h-2.5 w-2.5 rounded-full', BASE_LEVEL_THEME.dot)} aria-hidden="true" />
              <span className={cn('font-bold', BASE_LEVEL_THEME.textStrong)}>Базовый уровень</span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>· вся основная теория по программе;</li>
              <li>· {PROGRAM_STATS.questions - 130} вопросов (сложность 1–2);</li>
              <li>· задания в формате ОГЭ и базового ЕГЭ.</li>
            </ul>
          </div>
          <div className={cn('rounded-xl border p-4', LEVEL_THEME.border, LEVEL_THEME.bgSoft)}>
            <div className="flex items-center gap-2">
              <span className={cn('h-2.5 w-2.5 rounded-full', LEVEL_THEME.dot)} aria-hidden="true" />
              <span className={cn('font-bold', LEVEL_THEME.textStrong)}>Углублённый уровень</span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>· все базовые вопросы <b className="text-foreground">плюс</b>;</li>
              <li>· 130 задач повышенной сложности (статика, скрещённые поля, спектральный анализ, СТО…);</li>
              <li>· блоки «Углубление» в теории каждой темы и отдельные темы только для профиля.</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-primary/25 bg-primary/[0.06] p-4">
          <div className="min-w-0 flex-1 text-sm leading-relaxed">
            Прогресс хранится <b>по темам и общий для обоих уровней</b>: переключение уровня ничего не
            сбрасывает. Если вопрос входит в оба уровня, верный ответ засчитывается один раз.
          </div>
          <div className="flex rounded-xl border bg-card p-1" role="radiogroup" aria-label="Переключить уровень">
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
                      ? LEVEL_THEME.bgSolid
                      : BASE_LEVEL_THEME.bgSolid
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {l === 'base' ? 'Базовый' : <>Углублённый <GraduationCap className="h-3.5 w-3.5" /></>}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── 3. Как заниматься ─── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12 }}
        className="rounded-2xl border bg-card p-5 sm:p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <BookOpen className="h-5 w-5 text-primary" /> Как заниматься
        </h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: <BookOpen className="h-4 w-4" />,
              t: 'Читайте теорию',
              d: 'Каждая тема — раздел учебника: определения, формулы с расшифровками, таблицы и примеры решения задач. Блоки «Углубление» появляются только на углублённом уровне.',
            },
            {
              icon: <ListChecks className="h-4 w-4" />,
              t: 'Решайте тренажёр',
              d: 'Закрепляйте тему сразу после чтения. Каждый вопрос — с подробным разбором: почему верный именно такой ответ. Работайте над ошибками точечно.',
            },
            {
              icon: <Trophy className="h-4 w-4" />,
              t: 'Следите за прогрессом',
              d: 'Цель — 80–100% по каждой теме. Прогресс сохраняется автоматически, достижения помогают не сдаваться.',
            },
          ].map((s, i) => (
            <li key={i} className="relative rounded-xl border bg-background/60 p-4 pl-11">
              <span className="absolute left-3 top-4 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {s.icon}
              </span>
              <h3 className="font-bold">{s.t}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* ─── 4. Тренажёр ─── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.18 }}
        className="rounded-2xl border bg-card p-5 sm:p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <MousePointerClick className="h-5 w-5 text-primary" /> Типы заданий и сложность
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <MousePointerClick className="h-4 w-4" />, t: 'Выбор ответа', d: 'один верный вариант из нескольких' },
            { icon: <ListChecks className="h-4 w-4" />, t: 'Множественный выбор', d: 'несколько верных вариантов' },
            { icon: <PenLine className="h-4 w-4" />, t: 'Ввод ответа', d: 'впишите число — результат расчёта' },
            { icon: <Layers className="h-4 w-4" />, t: 'Соответствие', d: 'соедините пары «формула → величина»' },
          ].map((q) => (
            <div key={q.t} className="rounded-xl border bg-background/60 p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{q.icon}</div>
              <div className="text-sm font-bold">{q.t}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{q.d}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border bg-background/60 px-4 py-3 text-sm">
          <span className="font-semibold">Сложность вопросов:</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-chart-1" aria-hidden="true" /> 1 — репродуктивный
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-chart-3" aria-hidden="true" /> 2 — применение
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-chart-5" aria-hidden="true" /> 3 — анализ (чаще на углублённом)
          </span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          В настройках прогресса можно включить мгновенную обратную связь и перемешивание вопросов.
          Поиск по всем темам открывается сочетанием <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-semibold">Ctrl K</kbd>.
        </p>
      </motion.section>

      {/* ─── 5. Инструменты и офлайн ─── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.24 }}
        className="grid gap-3 sm:grid-cols-3"
      >
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sigma className="h-5 w-5" />
          </div>
          <h3 className="font-bold">Шпаргалка формул</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Все формулы школьного курса в одном месте — по классам и разделам, с расшифровкой величин
            и поиском по ключевым словам.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="font-bold">Справочник</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Физические постоянные, единицы СИ, приставки-множители, греческий алфавит, плотности веществ
            и таблица переводов единиц — всё для быстрых проверок при решении задач.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <WifiOff className="h-5 w-5" />
          </div>
          <h3 className="font-bold">Офлайн и установка</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            ФизиУм — PWA: устанавливается как приложение и работает без интернета. Весь прогресс хранится
            на устройстве — занимайтесь где угодно.
          </p>
        </div>
      </motion.section>

      {/* ─── 6. Цветовое кодирование ─── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="rounded-2xl border bg-card p-5 sm:p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <Signal className="h-5 w-5 text-primary" /> Цветовое кодирование «Спектр»
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-4">
            <div className="text-sm font-bold">Этапы и классы</div>
            <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className={cn('h-2.5 w-2.5 rounded-full', stageTheme('main').dot)} aria-hidden="true" />
                7–9 классы — фиолетовая гамма (основное общее образование, подготовка к ОГЭ)
              </span>
              <span className="flex items-center gap-2">
                <span className={cn('h-2.5 w-2.5 rounded-full', stageTheme('senior').dot)} aria-hidden="true" />
                10–11 классы — розовая гамма (механика и кванты, подготовка к ЕГЭ)
              </span>
            </div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="text-sm font-bold">Уровни</div>
            <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className={cn('h-2.5 w-2.5 rounded-full', BASE_LEVEL_THEME.dot)} aria-hidden="true" />
                базовый — фиолетовый
              </span>
              <span className="flex items-center gap-2">
                <span className={cn('h-2.5 w-2.5 rounded-full', LEVEL_THEME.dot)} aria-hidden="true" />
                углублённый — оранжевый
              </span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Палитра повторяет видимый спектр: от фиолетового в 7 классе к розово-красному в 11-м, а углублённый
          уровень отмечен «энергичным» оранжевым. Цветная полоса слева на карточках тем, бейджи уровней и
          точечные индикаторы помогают мгновенно понимать, где вы находитесь в структуре курса.
        </p>
      </motion.section>

      {/* CTA */}
      <div className="flex flex-wrap gap-2.5">
        <Button className="gap-2" onClick={() => setStage('main')}>
          <Atom className="h-4 w-4" /> Начать с программы 7–9 классов
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setStage('senior')}>
          <Orbit className="h-4 w-4" /> Программа 10–11 классов
        </Button>
      </div>
    </div>
  );
}
