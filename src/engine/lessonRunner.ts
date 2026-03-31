import { Exercise, Lesson } from '../types';

export interface SessionState {
  exercises: Exercise[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  sessionHearts: number;
  isComplete: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createSession(lesson: Lesson, startingHearts: number): SessionState {
  return {
    exercises: shuffle(lesson.exercises),
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    sessionHearts: startingHearts,
    isComplete: false,
  };
}

export function getCurrentExercise(state: SessionState): Exercise | null {
  return state.exercises[state.currentIndex] ?? null;
}

export function advance(state: SessionState, wasCorrect: boolean): SessionState {
  const next = state.currentIndex + 1;
  const isComplete = next >= state.exercises.length;

  return {
    ...state,
    currentIndex: next,
    correctCount: wasCorrect ? state.correctCount + 1 : state.correctCount,
    wrongCount: wasCorrect ? state.wrongCount : state.wrongCount + 1,
    sessionHearts: wasCorrect ? state.sessionHearts : Math.max(0, state.sessionHearts - 1),
    isComplete,
  };
}

export function calculateAccuracy(state: SessionState): number {
  const total = state.correctCount + state.wrongCount;
  if (total === 0) return 100;
  return Math.round((state.correctCount / total) * 100);
}

export function calculateStars(accuracy: number): number {
  if (accuracy >= 90) return 3;
  if (accuracy >= 70) return 2;
  return 1;
}

export function calculateXP(baseXP: number, accuracy: number): number {
  const bonus = Math.round(baseXP * (accuracy / 100));
  return Math.min(baseXP + bonus, baseXP * 2);
}
