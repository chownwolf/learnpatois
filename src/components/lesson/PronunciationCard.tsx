import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PronunciationExercise } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { useSpeech } from '../../hooks/useSpeech';

interface Props {
  exercise: PronunciationExercise;
  onReady: () => void;
}

export const PronunciationCard: React.FC<Props> = ({ exercise, onReady }) => {
  const [revealed, setRevealed] = useState(false);
  const { speak } = useSpeech();

  const handleReveal = () => {
    setRevealed(true);
    speak(exercise.patois);
    onReady();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Learn this word</Text>

      <View style={styles.card}>
        <View style={styles.patoisRow}>
          <Text style={styles.patois}>{exercise.patois}</Text>
          <TouchableOpacity
            style={styles.speakBtn}
            onPress={() => speak(exercise.patois)}
            activeOpacity={0.7}
          >
            <Text style={styles.speakIcon}>🔊</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.phonetic}>/{exercise.phonetic}/</Text>

        <View style={styles.divider} />

        <Text style={styles.english}>{exercise.english}</Text>

        {exercise.notes && (
          <View style={styles.noteBox}>
            <Text style={styles.noteIcon}>💡</Text>
            <Text style={styles.noteText}>{exercise.notes}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.gotItBtn, revealed && styles.gotItBtnActive]}
        onPress={handleReveal}
        activeOpacity={0.8}
      >
        <Text style={styles.gotItText}>{revealed ? '✓ Got it!' : 'Tap to learn'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    ...Shadow.button,
  },
  patoisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: 8,
  },
  patois: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.charcoal,
    textAlign: 'center',
  },
  speakBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.blue + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.blue + '40',
  },
  speakIcon: {
    fontSize: FontSize.xl,
  },
  phonetic: {
    fontSize: FontSize.lg,
    color: Colors.midGray,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    width: '80%',
    marginVertical: Spacing.md,
  },
  english: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: Colors.gold + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  noteIcon: {
    fontSize: FontSize.md,
  },
  noteText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.darkGray,
    lineHeight: 20,
  },
  gotItBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.lightGray,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xl,
  },
  gotItBtnActive: {
    backgroundColor: Colors.green,
  },
  gotItText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
  },
});
