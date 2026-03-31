import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Unit } from '../../types';
import { Colors, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { useProgressStore } from '../../store/useProgressStore';

interface Props {
  unit: Unit;
  onPress: (unit: Unit) => void;
}

export const UnitBubble: React.FC<Props> = ({ unit, onPress }) => {
  const isUnitUnlocked = useProgressStore((s) => s.isUnitUnlocked);
  const completedLessons = useProgressStore((s) => s.completedLessons);

  const unlocked = isUnitUnlocked(unit.prerequisiteUnitId);
  const completedCount = unit.lessons.filter((l) => completedLessons[l.id]).length;
  const allComplete = completedCount === unit.lessons.length;

  return (
    <TouchableOpacity
      style={[
        styles.bubble,
        { backgroundColor: unlocked ? unit.color : Colors.midGray },
        allComplete && styles.completedBubble,
      ]}
      onPress={() => unlocked && onPress(unit)}
      activeOpacity={unlocked ? 0.8 : 1}
      disabled={!unlocked}
    >
      <Text style={styles.emoji}>{allComplete ? '✅' : unit.emoji}</Text>
      {!unlocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.button,
  },
  completedBubble: {
    borderWidth: 3,
    borderColor: Colors.white,
  },
  emoji: {
    fontSize: 32,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 12,
  },
});
