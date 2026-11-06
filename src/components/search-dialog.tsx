'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { GRADES, loadGrade } from '@/data';
import type { Section } from '@/data/types';
import { flattenTokens } from '@/lib/markup';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Atom, Orbit, BookOpen } from 'lucide-react';

interface SearchEntry {
  topicId: string;
  title: string;
  flatTitle: string;
  sectionTitle: string;
  gradeId: string;
  summary: string;
  haystack: string;
}

let searchIndex: SearchEntry[] | null = null;
let building: Promise<SearchEntry[]> | null = null;

async function buildIndex(): Promise<SearchEntry[]> {
  if (searchIndex) return searchIndex;
  if (building) return building;
  building = (async () => {
    const entries: SearchEntry[] = [];
    for (const gid of ['g7', 'g8', 'g9', 'g10', 'g11'] as const) {
      let sections: Section[] = [];
      try {
        sections = await loadGrade(gid);
      } catch {
        continue;
      }
      for (const sec of sections) {
        for (const t of sec.topics) {
          entries.push({
            topicId: t.id,
            title: t.title,
            flatTitle: flattenTokens(t.title).toLowerCase(),
            sectionTitle: sec.title,
            gradeId: gid,
            summary: t.summary,
            haystack: [
              ...t.tags,
              flattenTokens(t.summary),
              ...t.theory.map((b) => flattenTokens(JSON.stringify(b))),
            ]
              .join(' ')
              .toLowerCase(),
          });
        }
      }
    }
    searchIndex = entries;
    return entries;
  })();
  return building;
}

export function SearchDialog() {
  const open = useAppStore((s) => s.searchOpen);
  const setOpen = useAppStore((s) => s.setSearchOpen);
  const openTopic = useAppStore((s) => s.openTopic);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'л') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!useAppStore.getState().searchOpen);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open && !index) {
      void buildIndex().then(setIndex);
    }
  }, [open, index]);

  const results = useMemo(() => {
    if (!index || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    return index
      .filter((e) => e.flatTitle.includes(q) || e.haystack.includes(q))
      .sort((a, b) => {
        const aT = a.flatTitle.includes(q) ? 0 : 1;
        const bT = b.flatTitle.includes(q) ? 0 : 1;
        return aT - bT;
      })
      .slice(0, 12);
  }, [index, query]);

  const pick = (topicId: string) => {
    setOpen(false);
    setQuery('');
    openTopic(topicId);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder={index ? 'Поиск по темам: «инерция», «резистор», «фотон»…' : 'Загрузка индекса…'}
      />
      <CommandList className="nice-scroll">
        {index === null ? (
          <div className="p-4 text-sm text-muted-foreground">Готовим поисковый индекс…</div>
        ) : (
          <>
            <CommandEmpty>Ничего не найдено. Попробуйте другой запрос.</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading="Темы">
                {results.map((r) => {
                  const meta = GRADES.find((g) => g.id === r.gradeId)!;
                  return (
                    <CommandItem
                      key={r.topicId}
                      value={`${r.title} ${r.topicId}`}
                      onSelect={() => pick(r.topicId)}
                      className="gap-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {meta.stage === 'main' ? <Atom className="h-4 w-4" /> : <Orbit className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{r.title}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {meta.title} · {r.sectionTitle}
                        </div>
                      </div>
                      <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
