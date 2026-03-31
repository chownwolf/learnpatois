import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';

interface Props {
  hearts: number;
  max?: number;
}

export const HeartBar: React.FC<Props> = ({ hearts, max = 5 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: max }).map((_, i) => (
        <Text key={i} style={[styles.heart, i >= hearts && styles.empty]}>
          {i < hearts ? '❤️' : '🖤'}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 2,
  },
  heart: {
    fontSize: FontSize.md,
  },
  empty: {
    opacity: 0.4,
  },
});
