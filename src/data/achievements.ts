import type { Achievement } from './types';

export interface AchievementStats {
  totalCorrect: number; // уникальные верно отвеченные вопросы (сумма)
  totalQuestions: number; // всего доступных вопросов на текущем уровне
  topicsStarted: number;
  topicsCompleted: number; // bestPct >= 80
  perfectTopics: number; // bestPct = 100
  theoryViewed: number;
  attempts: number;
  gradeComplete: Record<string, boolean>; // все темы класса завершены
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-steps', title: 'Первые шаги', description: 'Завершите первый тренировочный заезд', icon: 'Footprints' },
  { id: 'reader', title: 'Книжный червь', description: 'Изучите теорию 10 тем', icon: 'BookOpen' },
  { id: 'theory-master', title: 'Теоретик', description: 'Изучите теорию 30 тем', icon: 'GraduationCap' },
  { id: 'good-run', title: 'Хороший старт', description: 'Наберите 80% или выше в любой теме', icon: 'TrendingUp' },
  { id: 'perfect', title: 'Безупречно', description: 'Пройдите тему на 100%', icon: 'Star' },
  { id: 'hundred', title: 'Сотня', description: '100 верных ответов суммарно', icon: 'Target' },
  { id: 'five-hundred', title: 'Пол-тысячи', description: '500 верных ответов суммарно', icon: 'Trophy' },
  { id: 'explorer-7', title: 'Знаток 7 класса', description: 'Завершите все темы 7 класса (≥80%)', icon: 'Atom' },
  { id: 'explorer-8', title: 'Знаток 8 класса', description: 'Завершите все темы 8 класса (≥80%)', icon: 'Zap' },
  { id: 'explorer-9', title: 'Знаток 9 класса', description: 'Завершите все темы 9 класса (≥80%)', icon: 'Radio' },
  { id: 'explorer-10', title: 'Механик и термодинамик', description: 'Завершите все темы 10 класса (≥80%)', icon: 'Orbit' },
  { id: 'explorer-11', title: 'Мастер физики', description: 'Завершите все темы 11 класса (≥80%)', icon: 'Crown' },
  { id: 'persistent', title: 'Упорство', description: '50 тренировочных заездов суммарно', icon: 'Flame' },
];

export function evaluateAchievements(stats: AchievementStats): string[] {
  const out: string[] = [];
  if (stats.attempts >= 1) out.push('first-steps');
  if (stats.theoryViewed >= 10) out.push('reader');
  if (stats.theoryViewed >= 30) out.push('theory-master');
  if (stats.topicsCompleted >= 1) out.push('good-run');
  if (stats.perfectTopics >= 1) out.push('perfect');
  if (stats.totalCorrect >= 100) out.push('hundred');
  if (stats.totalCorrect >= 500) out.push('five-hundred');
  if (stats.gradeComplete['g7']) out.push('explorer-7');
  if (stats.gradeComplete['g8']) out.push('explorer-8');
  if (stats.gradeComplete['g9']) out.push('explorer-9');
  if (stats.gradeComplete['g10']) out.push('explorer-10');
  if (stats.gradeComplete['g11']) out.push('explorer-11');
  if (stats.attempts >= 50) out.push('persistent');
  return out;
}
