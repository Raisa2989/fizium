// ─── Типы данных учебника-тренажёра по физике ──────────────────────────────

export type Level = 'base' | 'advanced';
export type StageId = 'main' | 'senior'; // main = 7–9 классы, senior = 10–11 классы
export type GradeId = 'g7' | 'g8' | 'g9' | 'g10' | 'g11';

/** Блок теоретического материала темы */
export type TheoryBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'def'; term: string; text: string }
  | { kind: 'formula'; text: string; caption?: string }
  | { kind: 'list'; items: string[]; ordered?: boolean; caption?: string }
  | { kind: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { kind: 'tip'; text: string }
  | { kind: 'warn'; text: string }
  | { kind: 'example'; title?: string; text: string }
  /** Материал только углублённого уровня */
  | { kind: 'deep'; title: string; blocks: TheoryBlock[] };

export type QuestionType = 'single' | 'multiple' | 'input' | 'matching';

export interface MatchPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  /** Текст задания. Поддерживает разметку _{нижний индекс} и ^{верхний индекс} */
  text: string;
  /** Варианты ответа (для single / multiple) */
  options?: string[];
  /** single — индекс верного варианта; multiple — индексы верных вариантов */
  correct?: number | number[];
  /** input — эталонный ответ (без разметки) */
  answer?: string;
  /** input — принимаемые альтернативы (единицы измерения и т.п.) */
  accept?: string[];
  /** matching — пары (левая колонка → правая колонка) */
  pairs?: MatchPair[];
  explanation: string;
  /** 1 — базовый, 2 — средний, 3 — сложный */
  difficulty: 1 | 2 | 3;
  /** Только для углублённого уровня */
  advanced?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  /** Краткое описание для карточки */
  summary: string;
  /** undefined — тема входит в оба уровня; 'advanced' — только углублённый */
  only?: 'advanced';
  tags: string[];
  theory: TheoryBlock[];
  questions: Question[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}

export interface GradeContent {
  id: GradeId;
  sections: Section[];
}

// ─── Прогресс ───────────────────────────────────────────────────────────────

export interface TopicProgress {
  /** Идентификаторы вопросов, отвеченных верно */
  correctIds: string[];
  /** Идентификаторы вопросов с ошибками */
  failedIds: string[];
  attempts: number;
  bestPct: number;
  lastPct: number;
  theoryViewed: boolean;
  updatedAt: number;
}

// ─── Достижения ─────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // имя иконки из lucide (см. achievements.ts)
}
