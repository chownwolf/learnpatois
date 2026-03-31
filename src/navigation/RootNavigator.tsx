import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { LearnStack } from './LearnStack';
import { PracticeScreen } from '../screens/practice/PracticeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Colors, FontSize } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ fontSize: FontSize.xxl, opacity: focused ? 1 : 0.5 }}>{label}</Text>
);

export const RootNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.lightGray,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '700',
          marginBottom: 4,
        },
        tabBarIcon: ({ focused }) => {
          const icons: Record<string, string> = {
            Learn: '📖',
            Practice: '🏋️',
            Profile: '👤',
          };
          return <TabIcon label={icons[route.name] ?? '●'} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="Learn" component={LearnStack} />
      <Tab.Screen name="Practice" component={PracticeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
