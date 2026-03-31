import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearnStackParamList, SessionResult } from '../../types';
import { getLessonById } from '../../data/units';
import { useLesson } from '../../hooks/useLesson';
import { useProgressStore } from '../../store/useProgressStore';
import { ProgressBar } from '../../components/lesson/ProgressBar';
import { HeartBar } from '../../components/ui/HeartBar';
import { FeedbackOverlay } from '../../components/lesson/FeedbackOverlay';
import { MultipleChoiceExercise } from '../../components/lesson/MultipleChoiceExercise';
import { TranslationExercise } from '../../components/lesson/TranslationExercise';
import { FillBlankExercise } from '../../components/lesson/FillBlankExercise';
import { PronunciationCard } from '../../components/lesson/PronunciationCard';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';

type Props = NativeStackScreenProps<LearnStackParamList, 'Lesson'>;

export const LessonScreen: React.FC<Props> = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const data = getLessonById(lessonId);
  const commitResult = useProgressStore((s) => s.commitSessionResult);
  const hearts = useProgressStore((s) => s.hearts);

  if (!data) {
    return (
      <View style={styles.error}>
        <Text>Lesson not found</Text>
      </View>
    );
  }

  const { lesson } = data;
  const {
    currentExercise,
    phase,
    lastAnswerCorrect,
    selectedAnswer,
    sessionHearts,
    progress,
    accuracy,
    stars,
    xpEarned,
    isComplete,
    submitAnswer,
    continueLesson,
    totalExercises,
    currentIndex,
  } = useLesson(lesson);

  useEffect(() => {
    if (isComplete && phase === 'complete') {
      const result: SessionResult = {
        lessonId: lesson.id,
        xpEarned,
        accuracy,
        stars,
      };
      commitResult(result);
      navigation.replace('LessonResult', { result });
    }
  }, [isComplete, phase]);

  const handleExit = useCallback(() => {
    Alert.alert('Leave Lesson?', 'Your progress will be lost.', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  }, [navigation]);

  const getCorrectAnswer = (): string => {
    if (!currentExercise) return '';
    switch (currentExercise.type) {
      case 'multiple_choice': return currentExercise.correctAnswer;
      case 'translation': return currentExercise.correctTokens.join(' ');
      case 'fill_blank': return currentExercise.correctAnswer;
      default: return '';
    }
  };

  const canCheck = selectedAnswer !== null && phase === 'question';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <ProgressBar progress={progress} />
        <HeartBar hearts={sessionHearts} />
      </View>

      {/* Exercise Area */}
      <View style={styles.exerciseArea}>
        {currentExercise?.type === 'multiple_choice' && (
          <MultipleChoiceExercise
            exercise={currentExercise}
            selectedAnswer={typeof selectedAnswer === 'string' ? selectedAnswer : null}
            onSelect={submitAnswer}
            showFeedback={phase === 'feedback'}
          />
        )}
        {currentExercise?.type === 'translation' && (
          <TranslationExercise
            exercise={currentExercise}
            onAnswer={submitAnswer}
            showFeedback={phase === 'feedback'}
            lastAnswerCorrect={lastAnswerCorrect}
          />
        )}
        {currentExercise?.type === 'fill_blank' && (
          <FillBlankExercise
            exercise={currentExercise}
            onAnswer={submitAnswer}
            showFeedback={phase === 'feedback'}
            lastAnswerCorrect={lastAnswerCorrect}
          />
        )}
        {currentExercise?.type === 'pronunciation' && (
          <PronunciationCard
            exercise={currentExercise}
            onReady={() => submitAnswer('ready')}
          />
        )}
      </View>

      {/* Check button (only when not in feedback mode) */}
      {phase === 'question' && currentExercise?.type !== 'pronunciation' && (
        <View style={styles.checkArea}>
          <TouchableOpacity
            style={[styles.checkBtn, !canCheck && styles.checkBtnDisabled]}
            onPress={() => {}}
            disabled={!canCheck}
          >
            <Text style={[styles.checkBtnText, !canCheck && styles.checkBtnTextDisabled]}>
              CHECK
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Feedback overlay */}
      <FeedbackOverlay
        visible={phase === 'feedback'}
        correct={lastAnswerCorrect}
        correctAnswer={!lastAnswerCorrect ? getCorrectAnswer() : undefined}
        note={currentExercise?.notes}
        onContinue={continueLesson}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: FontSize.md,
    color: Colors.darkGray,
    fontWeight: '700',
  },
  exerciseArea: {
    flex: 1,
  },
  checkArea: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  checkBtn: {
    backgroundColor: Colors.green,
    borderRadius: BorderRadius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.greenDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  checkBtnDisabled: {
    backgroundColor: Colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  checkBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
  checkBtnTextDisabled: {
    color: Colors.midGray,
  },
});
