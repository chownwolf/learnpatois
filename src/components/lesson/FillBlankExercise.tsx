import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FillBlankExercise as FBExercise } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';

interface Props {
  exercise: FBExercise;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean;
}

export const FillBlankExercise: React.FC<Props> = ({
  exercise,
  onAnswer,
  showFeedback,
  lastAnswerCorrect,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const parts = exercise.sentenceWithBlank.split('___');

  const select = (option: string) => {
    if (showFeedback) return;
    setSelected(option);
    onAnswer(option);
  };

  const blankBg = selected
    ? showFeedback
      ? lastAnswerCorrect
        ? Colors.greenBg
        : Colors.redBg
      : Colors.blue + '15'
    : Colors.offWhite;

  const blankBorder = selected
    ? showFeedback
      ? lastAnswerCorrect
        ? Colors.green
        : Colors.red
      : Colors.blue
    : Colors.lightGray;

  const blankText = selected ?? '      ';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fill in the blank</Text>

      <View style={styles.sentenceCard}>
        <View style={styles.sentenceRow}>
          {parts[0] ? <Text style={styles.sentenceText}>{parts[0]}</Text> : null}
          <View style={[styles.blank, { backgroundColor: blankBg, borderColor: blankBorder }]}>
            <Text style={[styles.blankText, !selected && styles.blankEmpty]}>
              {selected ?? '       '}
            </Text>
          </View>
          {parts[1] ? <Text style={styles.sentenceText}>{parts[1]}</Text> : null}
        </View>
      </View>

      {exercise.wordBankOptions && (
        <View style={styles.wordBank}>
          {exercise.wordBankOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                selected === option && styles.optionSelected,
                showFeedback && selected === option && lastAnswerCorrect && styles.optionCorrect,
                showFeedback && selected === option && !lastAnswerCorrect && styles.optionWrong,
              ]}
              onPress={() => select(option)}
              disabled={showFeedback}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === option && styles.optionTextSelected,
                  showFeedback && selected === option && lastAnswerCorrect && styles.optionTextCorrect,
                  showFeedback && selected === option && !lastAnswerCorrect && styles.optionTextWrong,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  label: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  sentenceCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    ...Shadow.card,
  },
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sentenceText: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  blank: {
    borderWidth: 2,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginHorizontal: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  blankText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  blankEmpty: {
    color: 'transparent',
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  option: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    ...Shadow.card,
  },
  optionSelected: {
    backgroundColor: Colors.blue + '15',
    borderColor: Colors.blue,
  },
  optionCorrect: {
    backgroundColor: Colors.greenBg,
    borderColor: Colors.green,
  },
  optionWrong: {
    backgroundColor: Colors.redBg,
    borderColor: Colors.red,
  },
  optionText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  optionTextSelected: {
    color: Colors.blue,
    fontWeight: '700',
  },
  optionTextCorrect: {
    color: Colors.green,
    fontWeight: '700',
  },
  optionTextWrong: {
    color: Colors.red,
    fontWeight: '700',
  },
});
