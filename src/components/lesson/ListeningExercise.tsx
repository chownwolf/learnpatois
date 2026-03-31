import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ListeningExercise as LExercise } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { useSpeech } from '../../hooks/useSpeech';

interface Props {
  exercise: LExercise;
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

export const ListeningExercise: React.FC<Props> = ({
  exercise,
  selectedAnswer,
  onSelect,
  showFeedback,
}) => {
  const { speak } = useSpeech();
  const options = useMemo(
    () => shuffle([exercise.correctAnswer, ...exercise.distractors]),
    [exercise.id]
  );

  // Pulse animation for the speaker button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const playAudio = () => {
    speak(exercise.patois);
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Auto-play when exercise loads
  useEffect(() => {
    const timer = setTimeout(playAudio, 400);
    return () => clearTimeout(timer);
  }, [exercise.id]);

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
      <Text style={styles.prompt}>What did you hear?</Text>

      {/* Speaker button — big and centred */}
      <Animated.View style={[styles.speakerWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity style={styles.speakerBtn} onPress={playAudio} activeOpacity={0.8}>
          <Text style={styles.speakerIcon}>🔊</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.tapHint}>Tap the speaker to listen again</Text>

      {/* Phonetic hint — shown after first play or always */}
      <View style={styles.phoneticHint}>
        <Text style={styles.phoneticLabel}>Phonetic:</Text>
        <Text style={styles.phoneticText}>/{exercise.phonetic}/</Text>
      </View>

      {/* Answer tiles */}
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
    alignItems: 'center',
  },
  prompt: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  speakerWrapper: {
    marginBottom: Spacing.md,
  },
  speakerBtn: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  speakerIcon: {
    fontSize: 52,
  },
  tapHint: {
    fontSize: FontSize.sm,
    color: Colors.midGray,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  phoneticHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xl,
  },
  phoneticLabel: {
    fontSize: FontSize.sm,
    color: Colors.midGray,
    fontWeight: '600',
  },
  phoneticText: {
    fontSize: FontSize.sm,
    color: Colors.charcoal,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  grid: {
    gap: Spacing.sm,
    width: '100%',
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
