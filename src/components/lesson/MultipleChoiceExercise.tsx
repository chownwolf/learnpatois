import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MultipleChoiceExercise as MCExercise } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';

interface Props {
  exercise: MCExercise;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  showFeedback: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MultipleChoiceExercise: React.FC<Props> = ({
  exercise,
  selectedAnswer,
  onSelect,
  showFeedback,
}) => {
  const options = useMemo(
    () => shuffle([exercise.correctAnswer, ...exercise.distractors]),
    [exercise.id]
  );

  const getTileStyle = (option: string) => {
    if (!showFeedback || selectedAnswer !== option) {
      return selectedAnswer === option ? styles.tileSelected : styles.tile;
    }
    if (option === exercise.correctAnswer) return styles.tileCorrect;
    if (option === selectedAnswer) return styles.tileWrong;
    return styles.tile;
  };

  const getTextStyle = (option: string) => {
    if (!showFeedback) {
      return selectedAnswer === option ? styles.textSelected : styles.tileText;
    }
    if (option === exercise.correctAnswer) return styles.textCorrect;
    if (option === selectedAnswer) return styles.textWrong;
    return styles.tileText;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{exercise.question}</Text>

      {exercise.type === 'multiple_choice' && exercise.direction === 'patois_to_english' && (
        <View style={styles.wordCard}>
          <Text style={styles.patoisWord}>{exercise.patois}</Text>
          <Text style={styles.phonetic}>{exercise.phonetic}</Text>
        </View>
      )}

      <View style={styles.grid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={getTileStyle(option)}
            onPress={() => !showFeedback && onSelect(option)}
            activeOpacity={0.75}
          >
            <Text style={getTextStyle(option)}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  prompt: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  wordCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.card,
  },
  patoisWord: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  phonetic: {
    fontSize: FontSize.sm,
    color: Colors.midGray,
    marginTop: 4,
    fontStyle: 'italic',
  },
  grid: {
    gap: Spacing.sm,
  },
  tile: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    alignItems: 'center',
    ...Shadow.card,
  },
  tileSelected: {
    backgroundColor: Colors.blue + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.blue,
    alignItems: 'center',
  },
  tileCorrect: {
    backgroundColor: Colors.greenBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.green,
    alignItems: 'center',
  },
  tileWrong: {
    backgroundColor: Colors.redBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.red,
    alignItems: 'center',
  },
  tileText: {
    fontSize: FontSize.md,
    color: Colors.charcoal,
    fontWeight: '600',
    textAlign: 'center',
  },
  textSelected: {
    fontSize: FontSize.md,
    color: Colors.blue,
    fontWeight: '700',
    textAlign: 'center',
  },
  textCorrect: {
    fontSize: FontSize.md,
    color: Colors.green,
    fontWeight: '700',
    textAlign: 'center',
  },
  textWrong: {
    fontSize: FontSize.md,
    color: Colors.red,
    fontWeight: '700',
    textAlign: 'center',
  },
});
