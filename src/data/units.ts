import { Unit, Lesson, ListeningExercise } from '../types';
import { unit1Lessons } from './lessons/unit1_greetings';
import { unit2Lessons } from './lessons/unit2_numbers';
import { unit3Lessons } from './lessons/unit3_family';
import { unit4Lessons } from './lessons/unit4_food';
import { unit5Lessons } from './lessons/unit5_phrases';
import { unit6Lessons } from './lessons/unit6_proverbs';
import {
  unit1Listening,
  unit2Listening,
  unit3Listening,
  unit4Listening,
  unit5Listening,
  unit6Listening,
} from './lessons/listening_exercises';
import { Colors } from '../constants/theme';

// Distribute listening exercises evenly across a unit's lessons (2 per lesson)
function withListening(lessons: Lesson[], listeningPool: ListeningExercise[]): Lesson[] {
  return lessons.map((lesson, i) => ({
    ...lesson,
    exercises: [
      ...lesson.exercises,
      ...listeningPool.slice(i * 2, i * 2 + 2),
    ],
  }));
}

export const UNITS: Unit[] = [
  {
    id: 'unit_1',
    title: 'Greetings & Basics',
    description: 'Learn how to greet people and use essential everyday phrases',
    emoji: '👋',
    color: Colors.unit1,
    lessons: withListening(unit1Lessons, unit1Listening),
    prerequisiteUnitId: null,
  },
  {
    id: 'unit_2',
    title: 'Numbers & Time',
    description: 'Count, tell time, and talk about days and dates',
    emoji: '🕐',
    color: Colors.unit2,
    lessons: withListening(unit2Lessons, unit2Listening),
    prerequisiteUnitId: 'unit_1',
  },
  {
    id: 'unit_3',
    title: 'Family & People',
    description: 'Describe your family, friends, and feelings',
    emoji: '👨‍👩‍👧‍👦',
    color: Colors.unit3,
    lessons: withListening(unit3Lessons, unit3Listening),
    prerequisiteUnitId: 'unit_2',
  },
  {
    id: 'unit_4',
    title: 'Food & Drink',
    description: 'Explore Jamaican cuisine and talk about eating and shopping',
    emoji: '🍽️',
    color: Colors.unit4,
    lessons: withListening(unit4Lessons, unit4Listening),
    prerequisiteUnitId: 'unit_3',
  },
  {
    id: 'unit_5',
    title: 'Everyday Phrases',
    description: 'Master common expressions for daily life and conversations',
    emoji: '💬',
    color: Colors.unit5,
    lessons: withListening(unit5Lessons, unit5Listening),
    prerequisiteUnitId: 'unit_4',
  },
  {
    id: 'unit_6',
    title: 'Culture & Proverbs',
    description: 'Discover deep Jamaican wisdom, music, and Rastafari culture',
    emoji: '🌿',
    color: Colors.unit6,
    lessons: withListening(unit6Lessons, unit6Listening),
    prerequisiteUnitId: 'unit_5',
  },
];

export function getUnitById(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

export function getLessonById(lessonId: string): { lesson: Lesson; unit: Unit } | undefined {
  for (const unit of UNITS) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, unit };
  }
  return undefined;
}
