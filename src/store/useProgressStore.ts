import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LessonRecord, SessionResult } from '../types';

const STORAGE_KEY = '@patois_progress';
const MAX_HEARTS = 5;

interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  hearts: number;
  lastHeartRefill: string | null;
  completedLessons: Record<string, LessonRecord>;
  weakVocabIds: string[];

  // Actions
  commitSessionResult: (result: SessionResult) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  checkAndUpdateStreak: () => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonRecord: (lessonId: string) => LessonRecord | undefined;
  isUnitUnlocked: (prerequisiteUnitId: string | null) => boolean;
  loadFromStorage: () => Promise<void>;
  _saveToStorage: () => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export const useProgressStore = create<ProgressState>((set, get) => ({
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  hearts: MAX_HEARTS,
  lastHeartRefill: null,
  completedLessons: {},
  weakVocabIds: [],

  commitSessionResult: (result: SessionResult) => {
    const state = get();
    const existing = state.completedLessons[result.lessonId];
    const stars = result.stars;
    const bestAccuracy = Math.max(result.accuracy, existing?.bestAccuracy ?? 0);

    const updated: LessonRecord = {
      completedAt: existing?.completedAt ?? new Date().toISOString(),
      stars: Math.max(stars, existing?.stars ?? 0),
      bestAccuracy,
      timesPlayed: (existing?.timesPlayed ?? 0) + 1,
    };

    set((s) => ({
      xp: s.xp + result.xpEarned,
      completedLessons: {
        ...s.completedLessons,
        [result.lessonId]: updated,
      },
    }));

    get().checkAndUpdateStreak();
    get()._saveToStorage();
  },

  loseHeart: () => {
    set((s) => ({ hearts: Math.max(0, s.hearts - 1) }));
    get()._saveToStorage();
  },

  refillHearts: () => {
    set({ hearts: MAX_HEARTS, lastHeartRefill: new Date().toISOString() });
    get()._saveToStorage();
  },

  checkAndUpdateStreak: () => {
    const state = get();
    const today = todayISO();

    if (state.lastActiveDate === today) return;

    if (state.lastActiveDate) {
      const last = new Date(state.lastActiveDate);
      const now = new Date(today);
      const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        set((s) => ({ streak: s.streak + 1, lastActiveDate: today }));
      } else {
        set({ streak: 1, lastActiveDate: today });
      }
    } else {
      set({ streak: 1, lastActiveDate: today });
    }
  },

  isLessonCompleted: (lessonId: string) => {
    return !!get().completedLessons[lessonId];
  },

  getLessonRecord: (lessonId: string) => {
    return get().completedLessons[lessonId];
  },

  isUnitUnlocked: (prerequisiteUnitId: string | null) => {
    if (prerequisiteUnitId === null) return true;
    const state = get();

    // Import units lazily to avoid circular dependency
    const { UNITS } = require('../data/units');
    const prereqUnit = UNITS.find((u: any) => u.id === prerequisiteUnitId);
    if (!prereqUnit) return true;

    return prereqUnit.lessons.every((lesson: any) =>
      state.completedLessons[lesson.id] !== undefined
    );
  },

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        set(saved);
      }
    } catch {
      // First run — no data yet
    }
  },

  _saveToStorage: () => {
    const { xp, streak, lastActiveDate, hearts, lastHeartRefill, completedLessons, weakVocabIds } = get();
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ xp, streak, lastActiveDate, hearts, lastHeartRefill, completedLessons, weakVocabIds })
    ).catch(() => {});
  },
}));
