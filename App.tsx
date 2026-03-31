import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useProgressStore } from './src/store/useProgressStore';

export default function App() {
  const loadFromStorage = useProgressStore((s) => s.loadFromStorage);
  const checkAndUpdateStreak = useProgressStore((s) => s.checkAndUpdateStreak);

  useEffect(() => {
    loadFromStorage().then(() => {
      checkAndUpdateStreak();
    });
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
