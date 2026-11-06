import type { GradeId, StageId } from '@/data/types';

// ─── Цветовая система этапов и уровней «Вишня и шоколад» ────────────────────
//
// Концепция: от спелой вишни к тёмному шоколаду.
// ЭТАП 1 «7–9 классы» (main)    → ВИШНЁВАЯ гамма (rose), маркер «ОГЭ»
// ЭТАП 2 «10–11 классы» (senior) → ШОКОЛАДНАЯ гамма (amber), маркер «ЕГЭ»
// УРОВЕНЬ «Базовый»  → наследует вишнёвый (rose) для глобальных элементов
// УРОВЕНЬ «Углублённый» → ТЁМНЫЙ ШОКОЛАД (amber-900) всюду — «глубже»
//
// Все классы заданы литералами (без конкатенации), чтобы Tailwind находил их
// при сканировании исходников. Каждый токен содержит dark:-варианты.

export interface StageTheme {
  /** Цветной текст для бейджей и подписей */
  text: string;
  /** Усиленный цветной текст для заголовков и иконок */
  textStrong: string;
  /** Приглушённый цветной текст/иконки (пустые кружки прогресса) */
  textFaint: string;
  /** Насыщенный фон + контрастный текст (активные сегменты, иконки) */
  bgSolid: string;
  /** Мягкий цветной фон (чипы, активные строки) */
  bgSoft: string;
  /** Едва заметный цветной фон */
  bgSofter: string;
  /** Цветная рамка (только цвет — ширину задаёт 'border') */
  border: string;
  /** Насыщенная цветная рамка */
  borderStrong: string;
  /** Градиентный фон карточки/баннера этапа (~10–15% непрозрачности) */
  gradient: string;
  /** Усиление градиента карточки при наведении */
  gradientHover: string;
  /** Цветная полоса-маркер (вертикальная/верхняя) */
  bar: string;
  /** Чип иконки: мягкий фон + цветной текст */
  iconBg: string;
  /** Цветовой токен бейджа: мягкий фон + цветной текст (без layout-классов) */
  chip: string;
  /** Бейдж экзамена «ОГЭ»/«ЕГЭ»: фон + текст + рамка (без layout-классов) */
  examBadge: string;
  /** Цветная точка-маркер */
  dot: string;
  /** Кольцо фокуса */
  ring: string;
  /** Активная кнопка навигации: мягкий фон + цветной текст */
  navActive: string;
  /** Ховер строки/кнопки: цветная подсветка этапа */
  hoverBg: string;
  /** Ховер неактивной карточки: цветная рамка этапа */
  hoverBorder: string;
  /** Цветной текст при ховере группы (строки тем) */
  groupHoverText: string;
  /** Перекраска <Progress>: трек + индикатор в цвет этапа */
  progress: string;
}

// ─── Этапы ──────────────────────────────────────────────────────────────────

export const STAGE_THEMES: Record<StageId, StageTheme> = {
  // ЭТАП 1 · 7–9 классы · вишнёвая гамма (rose) · ОГЭ
  main: {
    text: 'text-rose-700 dark:text-rose-300',
    textStrong: 'text-rose-600 dark:text-rose-400',
    textFaint: 'text-rose-500/40 dark:text-rose-400/40',
    bgSolid: 'bg-rose-600 text-white dark:bg-rose-500 dark:text-white',
    bgSoft: 'bg-rose-500/10 dark:bg-rose-400/15',
    bgSofter: 'bg-rose-500/[0.04] dark:bg-rose-400/[0.05]',
    border: 'border-rose-500/30 dark:border-rose-400/30',
    borderStrong: 'border-rose-500/60 dark:border-rose-400/60',
    gradient:
      'bg-gradient-to-br from-rose-500/[0.12] via-rose-500/[0.05] to-red-500/[0.10] dark:from-rose-400/[0.14] dark:via-rose-400/[0.06] dark:to-red-400/[0.12]',
    gradientHover:
      'hover:from-rose-500/[0.20] hover:via-rose-500/[0.09] hover:to-red-500/[0.16] dark:hover:from-rose-400/[0.22] dark:hover:via-rose-400/[0.10] dark:hover:to-red-400/[0.18]',
    bar: 'bg-gradient-to-b from-rose-500 to-red-600 dark:from-rose-400 dark:to-red-500',
    iconBg: 'bg-rose-500/15 text-rose-600 dark:bg-rose-400/20 dark:text-rose-400',
    chip: 'bg-rose-500/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
    examBadge:
      'border border-rose-500/30 bg-rose-500/15 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/20 dark:text-rose-300',
    dot: 'bg-rose-500 dark:bg-rose-400',
    ring: 'focus-visible:ring-rose-500/40 dark:focus-visible:ring-rose-400/40',
    navActive: 'bg-rose-500/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
    hoverBg: 'hover:bg-rose-500/[0.05] dark:hover:bg-rose-400/[0.06]',
    hoverBorder: 'hover:border-rose-500/40 dark:hover:border-rose-400/40',
    groupHoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    progress:
      'bg-rose-500/20 dark:bg-rose-400/20 [&_[data-slot=progress-indicator]]:bg-rose-600 dark:[&_[data-slot=progress-indicator]]:bg-rose-500',
  },
  // ЭТАП 2 · 10–11 классы · шоколадная гамма (amber) · ЕГЭ
  senior: {
    text: 'text-amber-700 dark:text-amber-300',
    textStrong: 'text-amber-600 dark:text-amber-400',
    textFaint: 'text-amber-500/40 dark:text-amber-400/40',
    bgSolid: 'bg-amber-600 text-white dark:bg-amber-500 dark:text-white',
    bgSoft: 'bg-amber-500/10 dark:bg-amber-400/15',
    bgSofter: 'bg-amber-500/[0.04] dark:bg-amber-400/[0.05]',
    border: 'border-amber-500/30 dark:border-amber-400/30',
    borderStrong: 'border-amber-500/60 dark:border-amber-400/60',
    gradient:
      'bg-gradient-to-br from-amber-500/[0.12] via-amber-500/[0.05] to-orange-500/[0.10] dark:from-amber-400/[0.14] dark:via-amber-400/[0.06] dark:to-orange-400/[0.12]',
    gradientHover:
      'hover:from-amber-500/[0.20] hover:via-amber-500/[0.09] hover:to-orange-500/[0.16] dark:hover:from-amber-400/[0.22] dark:hover:via-amber-400/[0.10] dark:hover:to-orange-400/[0.18]',
    bar: 'bg-gradient-to-b from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500',
    iconBg: 'bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400',
    chip: 'bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
    examBadge:
      'border border-amber-500/30 bg-amber-500/15 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/20 dark:text-amber-300',
    dot: 'bg-amber-500 dark:bg-amber-400',
    ring: 'focus-visible:ring-amber-500/40 dark:focus-visible:ring-amber-400/40',
    navActive: 'bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
    hoverBg: 'hover:bg-amber-500/[0.05] dark:hover:bg-amber-400/[0.06]',
    hoverBorder: 'hover:border-amber-500/40 dark:hover:border-amber-400/40',
    groupHoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    progress:
      'bg-amber-500/20 dark:bg-amber-400/20 [&_[data-slot=progress-indicator]]:bg-amber-600 dark:[&_[data-slot=progress-indicator]]:bg-amber-500',
  },
};

/** Маркер экзамена этапа */
export const STAGE_EXAM: Record<StageId, string> = {
  main: 'ОГЭ',
  senior: 'ЕГЭ',
};

// ─── Акценты классов (g7 pink · g8 rose · g9 red · g10 orange · g11 amber) ───
// Вишня созревает и переходит в шоколад: светлая вишня → спелая вишня →
// тёмная вишня → какао → горький шоколад.

export const GRADE_THEMES: Record<GradeId, StageTheme> = {
  // 7 класс — светлая вишня (pink)
  g7: {
    text: 'text-pink-700 dark:text-pink-300',
    textStrong: 'text-pink-600 dark:text-pink-400',
    textFaint: 'text-pink-500/40 dark:text-pink-400/40',
    bgSolid: 'bg-pink-600 text-white dark:bg-pink-500 dark:text-white',
    bgSoft: 'bg-pink-500/10 dark:bg-pink-400/15',
    bgSofter: 'bg-pink-500/[0.04] dark:bg-pink-400/[0.05]',
    border: 'border-pink-500/30 dark:border-pink-400/30',
    borderStrong: 'border-pink-500/60 dark:border-pink-400/60',
    gradient:
      'bg-gradient-to-br from-pink-500/[0.10] via-pink-500/[0.04] to-pink-500/[0.08] dark:from-pink-400/[0.12] dark:via-pink-400/[0.05] dark:to-pink-400/[0.09]',
    gradientHover:
      'hover:from-pink-500/[0.18] hover:via-pink-500/[0.08] hover:to-pink-500/[0.14] dark:hover:from-pink-400/[0.20] dark:hover:via-pink-400/[0.09] dark:hover:to-pink-400/[0.16]',
    bar: 'bg-pink-500 dark:bg-pink-400',
    iconBg: 'bg-pink-500/15 text-pink-600 dark:bg-pink-400/20 dark:text-pink-400',
    chip: 'bg-pink-500/10 text-pink-700 dark:bg-pink-400/15 dark:text-pink-300',
    examBadge:
      'border border-pink-500/30 bg-pink-500/15 text-pink-700 dark:border-pink-400/30 dark:bg-pink-400/20 dark:text-pink-300',
    dot: 'bg-pink-500 dark:bg-pink-400',
    ring: 'focus-visible:ring-pink-500/40 dark:focus-visible:ring-pink-400/40',
    navActive: 'bg-pink-500/10 text-pink-700 dark:bg-pink-400/15 dark:text-pink-300',
    hoverBg: 'hover:bg-pink-500/[0.05] dark:hover:bg-pink-400/[0.06]',
    hoverBorder: 'hover:border-pink-500/40 dark:hover:border-pink-400/40',
    groupHoverText: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
    progress:
      'bg-pink-500/20 dark:bg-pink-400/20 [&_[data-slot=progress-indicator]]:bg-pink-600 dark:[&_[data-slot=progress-indicator]]:bg-pink-500',
  },
  // 8 класс — спелая вишня (rose)
  g8: {
    text: 'text-rose-700 dark:text-rose-300',
    textStrong: 'text-rose-600 dark:text-rose-400',
    textFaint: 'text-rose-500/40 dark:text-rose-400/40',
    bgSolid: 'bg-rose-600 text-white dark:bg-rose-500 dark:text-white',
    bgSoft: 'bg-rose-500/10 dark:bg-rose-400/15',
    bgSofter: 'bg-rose-500/[0.04] dark:bg-rose-400/[0.05]',
    border: 'border-rose-500/30 dark:border-rose-400/30',
    borderStrong: 'border-rose-500/60 dark:border-rose-400/60',
    gradient:
      'bg-gradient-to-br from-rose-500/[0.10] via-rose-500/[0.04] to-rose-500/[0.08] dark:from-rose-400/[0.12] dark:via-rose-400/[0.05] dark:to-rose-400/[0.09]',
    gradientHover:
      'hover:from-rose-500/[0.18] hover:via-rose-500/[0.08] hover:to-rose-500/[0.14] dark:hover:from-rose-400/[0.20] dark:hover:via-rose-400/[0.09] dark:hover:to-rose-400/[0.16]',
    bar: 'bg-rose-500 dark:bg-rose-400',
    iconBg: 'bg-rose-500/15 text-rose-600 dark:bg-rose-400/20 dark:text-rose-400',
    chip: 'bg-rose-500/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
    examBadge:
      'border border-rose-500/30 bg-rose-500/15 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/20 dark:text-rose-300',
    dot: 'bg-rose-500 dark:bg-rose-400',
    ring: 'focus-visible:ring-rose-500/40 dark:focus-visible:ring-rose-400/40',
    navActive: 'bg-rose-500/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
    hoverBg: 'hover:bg-rose-500/[0.05] dark:hover:bg-rose-400/[0.06]',
    hoverBorder: 'hover:border-rose-500/40 dark:hover:border-rose-400/40',
    groupHoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    progress:
      'bg-rose-500/20 dark:bg-rose-400/20 [&_[data-slot=progress-indicator]]:bg-rose-600 dark:[&_[data-slot=progress-indicator]]:bg-rose-500',
  },
  // 9 класс — тёмная вишня (red)
  g9: {
    text: 'text-red-700 dark:text-red-300',
    textStrong: 'text-red-600 dark:text-red-400',
    textFaint: 'text-red-500/40 dark:text-red-400/40',
    bgSolid: 'bg-red-600 text-white dark:bg-red-500 dark:text-white',
    bgSoft: 'bg-red-500/10 dark:bg-red-400/15',
    bgSofter: 'bg-red-500/[0.04] dark:bg-red-400/[0.05]',
    border: 'border-red-500/30 dark:border-red-400/30',
    borderStrong: 'border-red-500/60 dark:border-red-400/60',
    gradient:
      'bg-gradient-to-br from-red-500/[0.10] via-red-500/[0.04] to-red-500/[0.08] dark:from-red-400/[0.12] dark:via-red-400/[0.05] dark:to-red-400/[0.09]',
    gradientHover:
      'hover:from-red-500/[0.18] hover:via-red-500/[0.08] hover:to-red-500/[0.14] dark:hover:from-red-400/[0.20] dark:hover:via-red-400/[0.09] dark:hover:to-red-400/[0.16]',
    bar: 'bg-red-500 dark:bg-red-400',
    iconBg: 'bg-red-500/15 text-red-600 dark:bg-red-400/20 dark:text-red-400',
    chip: 'bg-red-500/10 text-red-700 dark:bg-red-400/15 dark:text-red-300',
    examBadge:
      'border border-red-500/30 bg-red-500/15 text-red-700 dark:border-red-400/30 dark:bg-red-400/20 dark:text-red-300',
    dot: 'bg-red-500 dark:bg-red-400',
    ring: 'focus-visible:ring-red-500/40 dark:focus-visible:ring-red-400/40',
    navActive: 'bg-red-500/10 text-red-700 dark:bg-red-400/15 dark:text-red-300',
    hoverBg: 'hover:bg-red-500/[0.05] dark:hover:bg-red-400/[0.06]',
    hoverBorder: 'hover:border-red-500/40 dark:hover:border-red-400/40',
    groupHoverText: 'group-hover:text-red-600 dark:group-hover:text-red-400',
    progress:
      'bg-red-500/20 dark:bg-red-400/20 [&_[data-slot=progress-indicator]]:bg-red-600 dark:[&_[data-slot=progress-indicator]]:bg-red-500',
  },
  // 10 класс — какао (orange)
  g10: {
    text: 'text-orange-700 dark:text-orange-300',
    textStrong: 'text-orange-600 dark:text-orange-400',
    textFaint: 'text-orange-500/40 dark:text-orange-400/40',
    bgSolid: 'bg-orange-600 text-white dark:bg-orange-500 dark:text-white',
    bgSoft: 'bg-orange-500/10 dark:bg-orange-400/15',
    bgSofter: 'bg-orange-500/[0.04] dark:bg-orange-400/[0.05]',
    border: 'border-orange-500/30 dark:border-orange-400/30',
    borderStrong: 'border-orange-500/60 dark:border-orange-400/60',
    gradient:
      'bg-gradient-to-br from-orange-500/[0.10] via-orange-500/[0.04] to-orange-500/[0.08] dark:from-orange-400/[0.12] dark:via-orange-400/[0.05] dark:to-orange-400/[0.09]',
    gradientHover:
      'hover:from-orange-500/[0.18] hover:via-orange-500/[0.08] hover:to-orange-500/[0.14] dark:hover:from-orange-400/[0.20] dark:hover:via-orange-400/[0.09] dark:hover:to-orange-400/[0.16]',
    bar: 'bg-orange-500 dark:bg-orange-400',
    iconBg: 'bg-orange-500/15 text-orange-600 dark:bg-orange-400/20 dark:text-orange-400',
    chip: 'bg-orange-500/10 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300',
    examBadge:
      'border border-orange-500/30 bg-orange-500/15 text-orange-700 dark:border-orange-400/30 dark:bg-orange-400/20 dark:text-orange-300',
    dot: 'bg-orange-500 dark:bg-orange-400',
    ring: 'focus-visible:ring-orange-500/40 dark:focus-visible:ring-orange-400/40',
    navActive: 'bg-orange-500/10 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300',
    hoverBg: 'hover:bg-orange-500/[0.05] dark:hover:bg-orange-400/[0.06]',
    hoverBorder: 'hover:border-orange-500/40 dark:hover:border-orange-400/40',
    groupHoverText: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
    progress:
      'bg-orange-500/20 dark:bg-orange-400/20 [&_[data-slot=progress-indicator]]:bg-orange-600 dark:[&_[data-slot=progress-indicator]]:bg-orange-500',
  },
  // 11 класс — горький шоколад (amber)
  g11: {
    text: 'text-amber-700 dark:text-amber-300',
    textStrong: 'text-amber-600 dark:text-amber-400',
    textFaint: 'text-amber-500/40 dark:text-amber-400/40',
    bgSolid: 'bg-amber-600 text-white dark:bg-amber-500 dark:text-white',
    bgSoft: 'bg-amber-500/10 dark:bg-amber-400/15',
    bgSofter: 'bg-amber-500/[0.04] dark:bg-amber-400/[0.05]',
    border: 'border-amber-500/30 dark:border-amber-400/30',
    borderStrong: 'border-amber-500/60 dark:border-amber-400/60',
    gradient:
      'bg-gradient-to-br from-amber-500/[0.10] via-amber-500/[0.04] to-amber-500/[0.08] dark:from-amber-400/[0.12] dark:via-amber-400/[0.05] dark:to-amber-400/[0.09]',
    gradientHover:
      'hover:from-amber-500/[0.18] hover:via-amber-500/[0.08] hover:to-amber-500/[0.14] dark:hover:from-amber-400/[0.20] dark:hover:via-amber-400/[0.09] dark:hover:to-amber-400/[0.16]',
    bar: 'bg-amber-500 dark:bg-amber-400',
    iconBg: 'bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400',
    chip: 'bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
    examBadge:
      'border border-amber-500/30 bg-amber-500/15 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/20 dark:text-amber-300',
    dot: 'bg-amber-500 dark:bg-amber-400',
    ring: 'focus-visible:ring-amber-500/40 dark:focus-visible:ring-amber-400/40',
    navActive: 'bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
    hoverBg: 'hover:bg-amber-500/[0.05] dark:hover:bg-amber-400/[0.06]',
    hoverBorder: 'hover:border-amber-500/40 dark:hover:border-amber-400/40',
    groupHoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    progress:
      'bg-amber-500/20 dark:bg-amber-400/20 [&_[data-slot=progress-indicator]]:bg-amber-600 dark:[&_[data-slot=progress-indicator]]:bg-amber-500',
  },
};

// ─── Уровень «Углублённый» — ТЁМНЫЙ ШОКОЛАД (amber-900) всюду ───────────────

export interface LevelTheme {
  /** Цветной текст для бейджей */
  text: string;
  /** Усиленный цветной текст */
  textStrong: string;
  /** Насыщенный фон + контрастный текст (активный сегмент) */
  bgSolid: string;
  /** Мягкий цветной фон */
  bgSoft: string;
  /** Цветная рамка */
  border: string;
  /** Насыщенная цветная рамка */
  borderStrong: string;
  /** Цветовой токен бейджа (без layout-классов) */
  chip: string;
  /** Чип иконки: мягкий фон + цветной текст */
  iconBg: string;
  /** Цветная точка-маркер */
  dot: string;
  /** Кольцо фокуса */
  ring: string;
}

export const LEVEL_THEME: LevelTheme = {
  text: 'text-amber-800 dark:text-amber-300',
  textStrong: 'text-amber-700 dark:text-amber-400',
  bgSolid: 'bg-amber-900 text-white dark:bg-amber-600 dark:text-white',
  bgSoft: 'bg-amber-800/10 dark:bg-amber-400/15',
  border: 'border-amber-800/30 dark:border-amber-400/30',
  borderStrong: 'border-amber-800/60 dark:border-amber-400/60',
  chip: 'bg-amber-800/10 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  iconBg: 'bg-amber-800/15 text-amber-700 dark:bg-amber-400/20 dark:text-amber-400',
  dot: 'bg-amber-800 dark:bg-amber-400',
  ring: 'focus-visible:ring-amber-800/40 dark:focus-visible:ring-amber-400/40',
};

/** Базовый уровень — вишнёвый (rose) для глобальных переключателей */
export const BASE_LEVEL_THEME: LevelTheme = {
  text: 'text-rose-700 dark:text-rose-300',
  textStrong: 'text-rose-600 dark:text-rose-400',
  bgSolid: 'bg-rose-600 text-white dark:bg-rose-500 dark:text-white',
  bgSoft: 'bg-rose-500/10 dark:bg-rose-400/15',
  border: 'border-rose-500/30 dark:border-rose-400/30',
  borderStrong: 'border-rose-500/60 dark:border-rose-400/60',
  chip: 'bg-rose-500/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
  iconBg: 'bg-rose-500/15 text-rose-600 dark:bg-rose-400/20 dark:text-rose-400',
  dot: 'bg-rose-500 dark:bg-rose-400',
  ring: 'focus-visible:ring-rose-500/40 dark:focus-visible:ring-rose-400/40',
};

// ─── Helper-функции ─────────────────────────────────────────────────────────

/** Тема этапа: 'main' → вишнёвая (rose), 'senior' → шоколадная (amber) */
export function stageTheme(stage: StageId): StageTheme {
  return STAGE_THEMES[stage];
}

/** Тема акцента класса: g7 pink · g8 rose · g9 red · g10 orange · g11 amber */
export function gradeTheme(grade: GradeId): StageTheme {
  return GRADE_THEMES[grade];
}

/** Этап по классу: 7–9 классы → main, 10–11 классы → senior */
export function gradeStage(grade: GradeId): StageId {
  return grade === 'g7' || grade === 'g8' || grade === 'g9' ? 'main' : 'senior';
}
