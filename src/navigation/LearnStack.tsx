import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LearnStackParamList } from '../types';
import { LearnHomeScreen } from '../screens/learn/LearnHomeScreen';
import { LessonScreen } from '../screens/learn/LessonScreen';
import { LessonResultScreen } from '../screens/learn/LessonResultScreen';

const Stack = createNativeStackNavigator<LearnStackParamList>();

export const LearnStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LearnHome" component={LearnHomeScreen} />
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="LessonResult"
        component={LessonResultScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
