import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TranslationExercise as TExercise } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';

interface Props {
  exercise: TExercise;
  onAnswer: (tokens: string[]) => void;
  showFeedback: boolean;
  lastAnswerCorrect: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const TranslationExercise: React.FC<Props> = ({
  exercise,
  onAnswer,
  showFeedback,
  lastAnswerCorrect,
}) => {
  const shuffledBank = useMemo(() => shuffle(exercise.wordBank), [exercise.id]);
  const [selected, setSelected] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const addToken = (token: string, idx: number) => {
    if (showFeedback || usedIndices.has(idx)) return;
    const next = [...selected, token];
    setSelected(next);
    setUsedIndices((s) => new Set([...s, idx]));
    onAnswer(next);
  };

  const removeToken = (pos: number) => {
    if (showFeedback) return;
    const token = selected[pos];
    // Find the original index of that token in shuffledBank
    const origIdx = shuffledBank.findIndex((t, i) => t === token && usedIndices.has(i) && !
      selected.slice(0, pos).includes(t));

    // More reliable: track with indices
    const usedArr = [...usedIndices];
    // Remove first matching used index for this token
    const bankIdx = shuffledBank.findIndex((t, i) => t === token && usedIndices.has(i));

    const next = [...selected];
    next.splice(pos, 1);
    setSelected(next);

    if (bankIdx !== -1) {
      setUsedIndices((s) => {
        const copy = new Set(s);
        copy.delete(bankIdx);
        return copy;
      });
    }
    onAnswer(next);
  };

  const answerBg = showFeedback
    ? lastAnswerCorrect
      ? Colors.greenBg
      : Colors.redBg
    : Colors.offWhite;

  const answerBorder = showFeedback
    ? lastAnswerCorrect
      ? Colors.green
      : Colors.red
    : Colors.lightGray;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Translate this sentence</Text>
      <View style={styles.promptCard}>
        <Text style={styles.prompt}>{exercise.prompt}</Text>
      </View>

      {/* Answer construction zone */}
      <View style={[styles.answerZone, { backgroundColor: answerBg, borderColor: answerBorder }]}>
        {selected.length === 0 ? (
          <Text style={styles.placeholder}>Tap words below to build your answer</Text>
        ) : (
          <View style={styles.tokenRow}>
            {selected.map((token, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => removeToken(i)}
                style={styles.selectedToken}
              >
                <Text style={styles.selectedTokenText}>{token}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Word bank */}
      <View style={styles.wordBank}>
        {shuffledBank.map((token, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.bankToken, usedIndices.has(i) && styles.bankTokenUsed]}
            onPress={() => addToken(token, i)}
            disabled={usedIndices.has(i) || showFeedback}
          >
            <Text style={[styles.bankTokenText, usedIndices.has(i) && styles.bankTokenTextUsed]}>
              {token}
            </Text>
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
  label: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  promptCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  prompt: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.charcoal,
    textAlign: 'center',
  },
  answerZone: {
    minHeight: 72,
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    justifyContent: 'center',
  },
  placeholder: {
    color: Colors.midGray,
    fontSize: FontSize.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  selectedToken: {
    backgroundColor: Colors.blue + '20',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: Colors.blue,
  },
  selectedTokenText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.blue,
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  bankToken: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    ...Shadow.card,
  },
  bankTokenUsed: {
    opacity: 0.3,
    backgroundColor: Colors.offWhite,
    borderColor: Colors.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  bankTokenText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  bankTokenTextUsed: {
    color: Colors.midGray,
  },
});
