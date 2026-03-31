import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface Props {
  value: number;
  children: React.ReactNode;
}

export const AnimatedBadge: React.FC<Props> = ({ value, children }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      prevValue.current = value;
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.35, tension: 200, friction: 5, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 200, friction: 6, useNativeDriver: true }),
      ]).start();
    }
  }, [value]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children}
    </Animated.View>
  );
};
