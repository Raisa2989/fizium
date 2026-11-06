'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Level, StageId, GradeId, TopicProgress } from '@/data/types';

export type View =
  | { name: 'home' }
  | { name: 'stage'; stage: StageId }
  | { name: 'topic'; topicId: string; tab?: 'theory' | 'trainer' }
  | { name: 'progress' }
  | { name: 'reference' }
  | { name: 'formulas' }
  | { name: 'help' };

export type SimpleViewName = 'home' | 'progress' | 'reference' | 'formulas' | 'help';

export interface Settings {
  instantFeedback: boolean;
  shuffleQuestions: boolean;
}

interface AppState {
  view: View;
  stage: StageId;
  level: Level;
  grade: GradeId;
  progress: Record<string, TopicProgress>;
  unlockedAchievements: Record<string, number>;
  settings: Settings;
  searchOpen: boolean;
  // actions
  navigate: (view: View | SimpleViewName) => void;
  setStage: (stage: StageId) => void;
  setLevel: (level: Level) => void;
  setGrade: (grade: GradeId) => void;
  openTopic: (topicId: string, tab?: 'theory' | 'trainer') => void;
  markTheoryViewed: (topicId: string) => void;
  recordAnswer: (topicId: string, questionId: string, correct: boolean) => void;
  finishRun: (topicId: string, correct: number, total: number) => void;
  unlockAchievement: (id: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  setSearchOpen: (open: boolean) => void;
  resetProgress: () => void;
}

function emptyProgress(): TopicProgress {
  return { correctIds: [], failedIds: [], attempts: 0, bestPct: 0, lastPct: 0, theoryViewed: false, updatedAt: Date.now() };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: { name: 'home' },
      stage: 'main',
      level: 'base',
      grade: 'g7',
      progress: {},
      unlockedAchievements: {},
      settings: { instantFeedback: true, shuffleQuestions: false },
      searchOpen: false,

      navigate: (v) => set({ view: typeof v === 'string' ? { name: v } : v }),
      setStage: (stage) =>
        set((s) => ({
          stage,
          grade: stage === 'main' ? 'g7' : 'g10',
          view: { name: 'stage', stage },
        })),
      setLevel: (level) => set({ level }),
      setGrade: (grade) => set({ grade }),

      openTopic: (topicId, tab) => set({ view: { name: 'topic', topicId, tab: tab ?? 'theory' } }),

      markTheoryViewed: (topicId) =>
        set((s) => {
          const p = s.progress[topicId] ?? emptyProgress();
          if (p.theoryViewed) return s;
          return { progress: { ...s.progress, [topicId]: { ...p, theoryViewed: true, updatedAt: Date.now() } } };
        }),

      recordAnswer: (topicId, questionId, correct) =>
        set((s) => {
          const p = s.progress[topicId] ?? emptyProgress();
          const correctIds = correct
            ? Array.from(new Set([...p.correctIds, questionId]))
            : p.correctIds.filter((id) => id !== questionId);
          const failedIds = correct
            ? p.failedIds.filter((id) => id !== questionId)
            : Array.from(new Set([...p.failedIds, questionId]));
          return {
            progress: {
              ...s.progress,
              [topicId]: { ...p, correctIds, failedIds, updatedAt: Date.now() },
            },
          };
        }),

      finishRun: (topicId, correct, total) =>
        set((s) => {
          const p = s.progress[topicId] ?? emptyProgress();
          const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
          return {
            progress: {
              ...s.progress,
              [topicId]: {
                ...p,
                attempts: p.attempts + 1,
                lastPct: pct,
                bestPct: Math.max(p.bestPct, pct),
                updatedAt: Date.now(),
              },
            },
          };
        }),

      unlockAchievement: (id) =>
        set((s) => {
          if (s.unlockedAchievements[id]) return s;
          return { unlockedAchievements: { ...s.unlockedAchievements, [id]: Date.now() } };
        }),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setSearchOpen: (open) => set({ searchOpen: open }),

      resetProgress: () => set({ progress: {}, unlockedAchievements: {} }),

    }),
    {
      name: 'fizium-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        stage: s.stage,
        level: s.level,
        grade: s.grade,
        progress: s.progress,
        unlockedAchievements: s.unlockedAchievements,
        settings: s.settings,
      }),
    }
  )
);
