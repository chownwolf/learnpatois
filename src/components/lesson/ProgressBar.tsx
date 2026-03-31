import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, BorderRadius } from '../../constants/theme';

interface Props {
  progress: number; // 0 to 1
}

export const ProgressBar: React.FC<Props> = ({ progress }) => {
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthPercent = animWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: widthPercent }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    flex: 1,
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: BorderRadius.full,
  },
});
