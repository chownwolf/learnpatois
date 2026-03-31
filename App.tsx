import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useProgressStore } from './src/store/useProgressStore';
import { isReminderScheduled, scheduleDailyStreakReminder } from './src/engine/notifications';

export default function App() {
  const loadFromStorage = useProgressStore((s) => s.loadFromStorage);
  const checkAndUpdateStreak = useProgressStore((s) => s.checkAndUpdateStreak);

  useEffect(() => {
    loadFromStorage().then(() => {
      checkAndUpdateStreak();
      // If the user had reminders enabled, reschedule on launch to rotate the message
      isReminderScheduled().then((on) => {
        if (on) scheduleDailyStreakReminder();
      });
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
