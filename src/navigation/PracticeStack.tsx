import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PracticeStackParamList } from '../types';
import { PracticeScreen } from '../screens/practice/PracticeScreen';
import { FlashcardScreen } from '../screens/practice/FlashcardScreen';

const Stack = createNativeStackNavigator<PracticeStackParamList>();

export const PracticeStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PracticeHome" component={PracticeScreen} />
      <Stack.Screen name="Flashcard" component={FlashcardScreen} />
    </Stack.Navigator>
  );
};
