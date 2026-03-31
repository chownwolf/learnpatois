import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '../../constants/theme';

interface Props {
  streak: number;
}

export const StreakBadge: React.FC<Props> = ({ streak }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold + '22',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    gap: 4,
  },
  fire: {
    fontSize: FontSize.md,
  },
  count: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.charcoal,
  },
});
