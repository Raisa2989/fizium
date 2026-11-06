'use client';

import { useEffect, useState } from 'react';
import type { GradeId, Section } from '@/data/types';
import { loadGrade, getCachedGrade } from '@/data';

interface GradeDataState {
  sections: Section[] | null;
  loading: boolean;
  error: string | null;
}

/** Ленивая загрузка контента класса с кэшем */
export function useGradeData(grade: GradeId | null): GradeDataState {
  const [loaded, setLoaded] = useState<{
    grade: GradeId | null;
    sections: Section[] | null;
    error: string | null;
  }>(() => {
    if (!grade) return { grade: null, sections: null, error: null };
    const cached = getCachedGrade(grade);
    return cached ? { grade, sections: cached, error: null } : { grade: null, sections: null, error: null };
  });

  useEffect(() => {
    if (!grade) return;
    let alive = true;
    loadGrade(grade)
      .then((sections) => {
        if (alive) setLoaded({ grade, sections, error: null });
      })
      .catch(() => {
        if (alive) setLoaded({ grade, sections: null, error: 'Не удалось загрузить материал' });
      });
    return () => {
      alive = false;
    };
  }, [grade]);

  const isCurrent = loaded.grade === grade;
  return {
    sections: isCurrent ? loaded.sections : null,
    loading: Boolean(grade) && !isCurrent,
    error: isCurrent ? loaded.error : null,
  };
}

/** Загрузка сразу нескольких классов (для поиска и статистики) */
export function useManyGrades(ids: GradeId[]): Record<GradeId, Section[] | null> {
  const key = ids.join(',');
  const [data, setData] = useState<Record<string, Section[]>>({});

  useEffect(() => {
    let alive = true;
    const list = key.split(',') as GradeId[];
    for (const id of list) {
      loadGrade(id)
        .then((s) => {
          if (alive) setData((d) => ({ ...d, [id]: s }));
        })
        .catch(() => undefined);
    }
    return () => {
      alive = false;
    };
  }, [key]);

  return data as Record<GradeId, Section[] | null>;
}
