import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '../../constants/theme';

interface Props {
  xp: number;
}

export const XPBadge: React.FC<Props> = ({ xp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.lightning}>⚡</Text>
      <Text style={styles.count}>{xp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blue + '22',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.blue,
    gap: 4,
  },
  lightning: {
    fontSize: FontSize.md,
  },
  count: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.charcoal,
  },
});
