import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';

interface Props {
  visible: boolean;
  correct: boolean;
  correctAnswer?: string;
  note?: string | null;
  onContinue: () => void;
}

export const FeedbackOverlay: React.FC<Props> = ({
  visible,
  correct,
  correctAnswer,
  note,
  onContinue,
}) => {
  const translateY = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 200,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const bg = correct ? Colors.greenBg : Colors.redBg;
  const accent = correct ? Colors.green : Colors.red;
  const btnColors = correct ? [Colors.green, Colors.greenDark] : [Colors.red, '#CC0000'];

  return (
    <Animated.View style={[styles.container, { backgroundColor: bg, transform: [{ translateY }] }]}>
      <View style={styles.topRow}>
        <Text style={[styles.icon]}>{correct ? '✅' : '❌'}</Text>
        <Text style={[styles.status, { color: accent }]}>
          {correct ? 'Correct!' : 'Incorrect'}
        </Text>
      </View>

      {!correct && correctAnswer && (
        <View style={styles.answerRow}>
          <Text style={styles.answerLabel}>Correct answer:</Text>
          <Text style={[styles.answerText, { color: accent }]}>{correctAnswer}</Text>
        </View>
      )}

      {note && (
        <Text style={styles.note}>{note}</Text>
      )}

      <TouchableOpacity
        style={[styles.continueBtn, { backgroundColor: accent }]}
        onPress={onContinue}
        activeOpacity={0.85}
      >
        <Text style={styles.continueBtnText}>CONTINUE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: FontSize.xl,
  },
  status: {
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  answerRow: {
    marginBottom: Spacing.sm,
  },
  answerLabel: {
    fontSize: FontSize.sm,
    color: Colors.midGray,
    marginBottom: 2,
  },
  answerText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  note: {
    fontSize: FontSize.sm,
    color: Colors.darkGray,
    marginBottom: Spacing.md,
    fontStyle: 'italic',
  },
  continueBtn: {
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  continueBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
});
