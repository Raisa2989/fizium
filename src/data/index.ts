import type { GradeId, Level, Section, StageId, Topic } from './types';

// ─── Метаданные классов ─────────────────────────────────────────────────────

export interface GradeMeta {
  id: GradeId;
  stage: StageId;
  title: string;
  shortTitle: string;
  subtitle: string;
  accent: 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose';
}

export const GRADES: GradeMeta[] = [
  { id: 'g7', stage: 'main', title: '7 класс', shortTitle: '7 кл.', subtitle: 'Первоначальные сведения, движение и силы, давление, работа и энергия', accent: 'violet' },
  { id: 'g8', stage: 'main', title: '8 класс', shortTitle: '8 кл.', subtitle: 'Тепловые явления, электричество и магнетизм', accent: 'purple' },
  { id: 'g9', stage: 'main', title: '9 класс', shortTitle: '9 кл.', subtitle: 'Механика, колебания и волны, электромагнитное поле, оптика, квант', accent: 'fuchsia' },
  { id: 'g10', stage: 'senior', title: '10 класс', shortTitle: '10 кл.', subtitle: 'Механика, молекулярная физика и термодинамика, электродинамика', accent: 'pink' },
  { id: 'g11', stage: 'senior', title: '11 класс', shortTitle: '11 кл.', subtitle: 'Колебания и волны, оптика, СТО, квантовая физика, астрономия', accent: 'rose' },
];

export const STAGES: { id: StageId; title: string; shortTitle: string; description: string; grades: GradeId[] }[] = [
  {
    id: 'main',
    title: 'Основное общее образование',
    shortTitle: '7–9 классы',
    description:
      'Первоначальные физические понятия, строение вещества, механические явления, давление, тепловые, электрические и магнитные явления, колебания и волны, свет и первые квантовые представления. Подготовка к ОГЭ.',
    grades: ['g7', 'g8', 'g9'],
  },
  {
    id: 'senior',
    title: 'Среднее общее образование',
    shortTitle: '10–11 классы',
    description:
      'Механика и законы сохранения, молекулярная физика и термодинамика, электродинамика, колебания и волны, оптика, элементы теории относительности, квантовая физика и астрономия. Подготовка к ЕГЭ.',
    grades: ['g10', 'g11'],
  },
];

// ─── Ленивая загрузка контента классов ─────────────────────────────────────

const loaders: Record<GradeId, () => Promise<Section[]>> = {
  g7: () => import('./grade7').then((m) => m.sections),
  g8: () => import('./grade8').then((m) => m.sections),
  g9: () => import('./grade9').then((m) => m.sections),
  g10: () => import('./grade10').then((m) => m.sections),
  g11: () => import('./grade11').then((m) => m.sections),
};

const cache = new Map<GradeId, Section[]>();

export async function loadGrade(id: GradeId): Promise<Section[]> {
  const hit = cache.get(id);
  if (hit) return hit;
  const sections = await loaders[id]();
  cache.set(id, sections);
  return sections;
}

export function getCachedGrade(id: GradeId): Section[] | undefined {
  return cache.get(id);
}

// ─── Фильтрация по уровню ───────────────────────────────────────────────────

/** Темы секции с учётом уровня (база / углубление) */
export function topicsForLevel(sections: Section[], level: Level): Section[] {
  return sections.map((sec) => ({
    ...sec,
    topics: sec.topics.filter((t) => t.only === undefined || level === 'advanced'),
  }));
}

/** Вопросы темы с учётом уровня */
export function questionsForLevel(topic: Topic, level: Level) {
  return topic.questions.filter((q) => level === 'advanced' || !q.advanced);
}

export function topicById(sections: Section[], topicId: string): Topic | undefined {
  for (const sec of sections) {
    const t = sec.topics.find((x) => x.id === topicId);
    if (t) return t;
  }
  return undefined;
}

/** Идентификатор класса по теме: 'g7-s1-t3' → 'g7' */
export function gradeOfTopic(topicId: string): GradeId {
  const m = topicId.match(/^(g\d+)/);
  if (m && ['g7', 'g8', 'g9', 'g10', 'g11'].includes(m[1])) return m[1] as GradeId;
  return 'g7';
}

// ─── Сводная статистика ───────────────────────────────────────────────────
// Подсчитывается по факту при загрузке приложения (см. useProgramStats в store)

export const PROGRAM_STATS = {
  topics: 82,
  questions: 872,
  sections: 22,
  years: 5,
};
