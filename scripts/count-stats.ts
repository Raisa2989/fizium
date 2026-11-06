// Скрипт подсчёта статистики программы и валидации контента
import { sections as g7 } from '../src/data/grade7';
import { sections as g8 } from '../src/data/grade8';
import { sections as g9 } from '../src/data/grade9';
import { sections as g10 } from '../src/data/grade10';
import { sections as g11 } from '../src/data/grade11';
import type { Section } from '../src/data/types';

const all: Record<string, Section[]> = { g7, g8, g9, g10, g11 };

let topics = 0;
let questions = 0;
let sectionsCount = 0;
const errors: string[] = [];
const ids = new Set<string>();

for (const [grade, secs] of Object.entries(all)) {
  for (const sec of secs) {
    sectionsCount++;
    for (const t of sec.topics) {
      topics++;
      if (!t.id.startsWith(grade)) errors.push(`${t.id}: id не начинается с ${grade}`);
      if (ids.has(t.id)) errors.push(`дубликат topic id: ${t.id}`);
      ids.add(t.id);
      if (t.questions.length < 5) errors.push(`${t.id}: только ${t.questions.length} вопросов`);
      for (const q of t.questions) {
        questions++;
        if (ids.has(q.id)) errors.push(`дубликат question id: ${q.id}`);
        ids.add(q.id);
        if (!q.explanation) errors.push(`${q.id}: нет explanation`);
        if (q.type === 'single' && (q.correct === undefined || !q.options)) errors.push(`${q.id}: single без options/correct`);
        if (q.type === 'multiple' && (!Array.isArray(q.correct) || !q.options)) errors.push(`${q.id}: multiple без options/correct[]`);
        if (q.type === 'input' && !q.answer) errors.push(`${q.id}: input без answer`);
        if (q.type === 'matching' && (!q.pairs || q.pairs.length < 3)) errors.push(`${q.id}: matching без pairs`);
        // проверка, что answer не содержит разметку
        if (q.type === 'input' && (q.answer?.includes('_{') || q.answer?.includes('^{')))
          errors.push(`${q.id}: answer содержит разметку индексов`);
      }
    }
  }
}

console.log(JSON.stringify({
  sections: sectionsCount,
  topics,
  questions,
  perGrade: Object.fromEntries(
    Object.entries(all).map(([g, secs]) => [
      g,
      {
        sections: secs.length,
        topics: secs.reduce((a, s) => a + s.topics.length, 0),
        questions: secs.reduce((a, s) => a + s.topics.reduce((b, t) => b + t.questions.length, 0), 0),
      },
    ])
  ),
  errors: errors.slice(0, 30),
  errorCount: errors.length,
}, null, 2));
