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
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();

      // Icon pops in
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }).start();

      if (correct) {
        // Pulse bounce on correct
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 120, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 60, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
        ]).start();
      } else {
        // Shake on wrong
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start();
      }
    } else {
      Animated.timing(translateY, {
        toValue: 200,
        duration: 150,
        useNativeDriver: true,
      }).start();
      iconScale.setValue(0);
      shakeAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [visible]);

  if (!visible) return null;

  const bg = correct ? Colors.greenBg : Colors.redBg;
  const accent = correct ? Colors.green : Colors.red;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          transform: [
            { translateY },
            { translateX: correct ? new Animated.Value(0) : shakeAnim },
          ],
        },
      ]}
    >
      <View style={styles.topRow}>
        <Animated.Text
          style={[
            styles.icon,
            {
              transform: [
                { scale: correct ? pulseAnim : iconScale },
              ],
            },
          ]}
        >
          {correct ? '✅' : '❌'}
        </Animated.Text>
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

      {note && <Text style={styles.note}>{note}</Text>}

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
