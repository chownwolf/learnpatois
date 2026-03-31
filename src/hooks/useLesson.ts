import { useState, useCallback } from 'react';
import { Lesson } from '../types';
import {
  SessionState,
  createSession,
  getCurrentExercise,
  advance,
  calculateAccuracy,
  calculateStars,
  calculateXP,
} from '../engine/lessonRunner';
import { useProgressStore } from '../store/useProgressStore';

type Phase = 'question' | 'feedback' | 'complete';

export function useLesson(lesson: Lesson) {
  const hearts = useProgressStore((s) => s.hearts);
  const [session, setSession] = useState<SessionState>(() => createSession(lesson, hearts));
  const [phase, setPhase] = useState<Phase>('question');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);

  const currentExercise = getCurrentExercise(session);

  const submitAnswer = useCallback(
    (answer: string | string[]) => {
      if (phase !== 'question' || !currentExercise) return;

      let correct = false;

      if (currentExercise.type === 'multiple_choice') {
        correct = answer === currentExercise.correctAnswer;
      } else if (currentExercise.type === 'translation') {
        const tokens = Array.isArray(answer) ? answer : [answer];
        correct =
          tokens.length === currentExercise.correctTokens.length &&
          tokens.every((t, i) => t === currentExercise.correctTokens[i]);
      } else if (currentExercise.type === 'fill_blank') {
        const a = typeof answer === 'string' ? answer.trim().toLowerCase() : '';
        correct = a === currentExercise.correctAnswer.toLowerCase();
      } else if (currentExercise.type === 'pronunciation') {
        correct = true;
      } else if (currentExercise.type === 'listening') {
        correct = answer === currentExercise.correctAnswer;
      }

      setLastAnswerCorrect(correct);
      setSelectedAnswer(answer);
      setPhase('feedback');
    },
    [phase, currentExercise]
  );

  const continueLesson = useCallback(() => {
    const next = advance(session, lastAnswerCorrect);
    setSession(next);
    setSelectedAnswer(null);

    if (next.isComplete) {
      setPhase('complete');
    } else {
      setPhase('question');
    }
  }, [session, lastAnswerCorrect]);

  const accuracy = calculateAccuracy(session);
  const stars = calculateStars(accuracy);
  const xpEarned = calculateXP(lesson.xpReward, accuracy);
  const progress = session.exercises.length > 0 ? session.currentIndex / session.exercises.length : 0;

  return {
    currentExercise,
    phase,
    lastAnswerCorrect,
    selectedAnswer,
    sessionHearts: session.sessionHearts,
    progress,
    accuracy,
    stars,
    xpEarned,
    isComplete: session.isComplete,
    submitAnswer,
    continueLesson,
    totalExercises: session.exercises.length,
    currentIndex: session.currentIndex,
  };
}
