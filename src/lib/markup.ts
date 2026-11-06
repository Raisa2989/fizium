import type { Question } from '@/data/types';
import type { ReactNode } from 'react';
import { createElement, Fragment } from 'react';

// ─── Разметка физических формул и величин ───────────────────────────────────
// В текстах используется нотация:
//   H_{2}O        → нижний индекс
//   SO_{4}^{2-}   → верхний индекс
//   ^{2-}         → верхний индекс в начале
// Парсер разбивает строку на сегменты и возвращает React-элементы.

const TOKEN_RE = /(\^\{[^}]*\}|_\{[^}]*\})/g;

/**
 * Разбирает текст с химической разметкой в массив React-узлов.
 * Безопасно: не использует dangerouslySetInnerHTML.
 */
export function parseTokens(input: string): ReactNode[] {
  const parts = input.split(TOKEN_RE).filter((p) => p !== '');
  return parts.map((part, i) => {
    if (part.startsWith('_{')) {
      return createElement('sub', { key: i }, part.slice(2, -1));
    }
    if (part.startsWith('^{')) {
      return createElement('sup', { key: i }, part.slice(2, -1));
    }
    return createElement(Fragment, { key: i }, part);
  });
}

/** Плоский текст (индексы уходят в строку: v_{ср} → vср) — для поиска */
export function flattenTokens(input: string): string {
  return input.replace(/[_^]\{([^}]*)\}/g, '$1');
}

// ─── Проверка ответов с вводом ──────────────────────────────────────────────

function baseNorm(s: string): string {
  return s
    .replace(/,/g, '.')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Сравнение ввода пользователя с эталоном (числа + варианты с единицами) */
export function checkInput(user: string, q: Question): boolean {
  const candidates = [q.answer ?? '', ...(q.accept ?? [])].map(baseNorm).filter(Boolean);
  if (candidates.length === 0) return false;
  const u = baseNorm(user);
  if (u === '') return false;
  // 1) точное совпадение
  if (candidates.includes(u)) return true;
  // 2) без учёта регистра (для слов)
  const lu = u.toLowerCase();
  if (candidates.some((c) => c.toLowerCase() === lu)) return true;
  // 3) допускаем приписанные единицы: "20 м/с", "20м/с", "0.5 А"
  const uNum = u.replace(/[^0-9.]/g, '');
  if (uNum !== '') {
    const numMatch = candidates.some((c) => {
      const cNum = c.replace(/[^0-9.]/g, '');
      return cNum !== '' && cNum === uNum && Math.abs(parseFloat(cNum) - parseFloat(uNum)) < 1e-9;
    });
    if (numMatch) return true;
  }
  return false;
}

/** Буквы для вариантов ответа */
export const LETTERS = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З'];

/** Перемешивание массива (Fisher–Yates), возвращает копию */
export function shuffle<T>(arr: T[], seed?: number): T[] {
  const a = [...arr];
  let s = seed ?? Date.now();
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
