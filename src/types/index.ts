export type ExerciseType = 'multiple_choice' | 'translation' | 'fill_blank' | 'pronunciation' | 'listening';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  patois: string;
  english: string;
  phonetic: string;
  audioFile: string | null;
  notes: string | null;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple_choice';
  question: string;
  correctAnswer: string;
  distractors: string[];
  direction: 'patois_to_english' | 'english_to_patois';
}

export interface TranslationExercise extends BaseExercise {
  type: 'translation';
  prompt: string;
  wordBank: string[];
  correctTokens: string[];
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill_blank';
  sentenceWithBlank: string;
  correctAnswer: string;
  wordBankOptions: string[] | null;
}

export interface PronunciationExercise extends BaseExercise {
  type: 'pronunciation';
}

export interface ListeningExercise extends BaseExercise {
  type: 'listening';
  correctAnswer: string;   // the correct English meaning
  distractors: string[];   // 3 wrong English meanings
}

export type Exercise =
  | MultipleChoiceExercise
  | TranslationExercise
  | FillBlankExercise
  | PronunciationExercise
  | ListeningExercise;

export interface Lesson {
  id: string;
  title: string;
  xpReward: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  lessons: Lesson[];
  prerequisiteUnitId: string | null;
}

export interface LessonRecord {
  completedAt: string;
  stars: number;
  bestAccuracy: number;
  timesPlayed: number;
}

export interface SessionResult {
  lessonId: string;
  xpEarned: number;
  accuracy: number;
  stars: number;
}

// Navigation types
export type LearnStackParamList = {
  LearnHome: undefined;
  UnitDetail: { unitId: string };
  Lesson: { lessonId: string; unitId: string };
  LessonResult: { result: SessionResult };
};

export type RootTabParamList = {
  Learn: undefined;
  Practice: undefined;
  Profile: undefined;
};

export type PracticeStackParamList = {
  PracticeHome: undefined;
  Flashcard: undefined;
};
