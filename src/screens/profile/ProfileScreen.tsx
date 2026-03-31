import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useProgressStore } from '../../store/useProgressStore';
import { UNITS } from '../../data/units';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  scheduleDailyStreakReminder,
  cancelStreakReminder,
  isReminderScheduled,
  requestNotificationPermission,
} from '../../engine/notifications';

const REMINDER_HOURS = [8, 12, 17, 19, 21];
const REMINDER_LABELS = ['8 AM', '12 PM', '5 PM', '7 PM', '9 PM'];

export const ProfileScreen: React.FC = () => {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const hearts = useProgressStore((s) => s.hearts);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const refillHearts = useProgressStore((s) => s.refillHearts);

  const [notificationsOn, setNotificationsOn] = useState(false);
  const [reminderHourIndex, setReminderHourIndex] = useState(3); // default 7 PM

  useEffect(() => {
    isReminderScheduled().then(setNotificationsOn);
  }, []);

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications for Patois in your device settings to receive streak reminders.'
        );
        return;
      }
      await scheduleDailyStreakReminder(REMINDER_HOURS[reminderHourIndex]);
      setNotificationsOn(true);
    } else {
      await cancelStreakReminder();
      setNotificationsOn(false);
    }
  };

  const changeReminderTime = async (index: number) => {
    setReminderHourIndex(index);
    if (notificationsOn) {
      await scheduleDailyStreakReminder(REMINDER_HOURS[index]);
    }
  };

  const totalLessons = UNITS.reduce((sum, u) => sum + u.lessons.length, 0);
  const completedCount = Object.keys(completedLessons).length;
  const totalUnits = UNITS.length;
  const completedUnits = UNITS.filter((u) =>
    u.lessons.every((l) => completedLessons[l.id])
  ).length;

  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = 100 - (xp % 100);

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will delete all your progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Done', 'Progress reset. Restart the app to see changes.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar & Level */}
        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🇯🇲</Text>
          </View>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.levelSub}>{xpToNextLevel} XP to next level</Text>

          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${((xp % 100) / 100) * 100}%` }]} />
          </View>
        </View>

        {/* Stats */}
        <Text style={styles.sectionLabel}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statValue}>{hearts}/5</Text>
            <Text style={styles.statLabel}>Hearts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Lessons Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎓</Text>
            <Text style={styles.statValue}>{completedUnits}/{totalUnits}</Text>
            <Text style={styles.statLabel}>Units Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>
              {totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}%
            </Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        {/* Unit progress */}
        <Text style={styles.sectionLabel}>Unit Progress</Text>
        {UNITS.map((unit) => {
          const done = unit.lessons.filter((l) => completedLessons[l.id]).length;
          const pct = unit.lessons.length > 0 ? done / unit.lessons.length : 0;
          return (
            <View key={unit.id} style={styles.unitRow}>
              <Text style={styles.unitEmoji}>{unit.emoji}</Text>
              <View style={styles.unitInfo}>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <View style={styles.unitBarRow}>
                  <View style={styles.unitBarTrack}>
                    <View
                      style={[
                        styles.unitBarFill,
                        { width: `${pct * 100}%`, backgroundColor: unit.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.unitCount}>
                    {done}/{unit.lessons.length}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Settings */}
        <Text style={styles.sectionLabel}>Settings</Text>

        {/* Streak notifications toggle */}
        <View style={styles.actionBtn}>
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionText}>Daily Reminder</Text>
          <Switch
            value={notificationsOn}
            onValueChange={toggleNotifications}
            trackColor={{ false: Colors.lightGray, true: Colors.green + '80' }}
            thumbColor={notificationsOn ? Colors.green : Colors.midGray}
          />
        </View>

        {/* Reminder time picker — only visible when notifications are on */}
        {notificationsOn && (
          <View style={styles.timePickerCard}>
            <Text style={styles.timePickerLabel}>Remind me at</Text>
            <View style={styles.timePickerRow}>
              {REMINDER_LABELS.map((label, i) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.timeChip,
                    i === reminderHourIndex && styles.timeChipActive,
                  ]}
                  onPress={() => changeReminderTime(i)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      i === reminderHourIndex && styles.timeChipTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {hearts < 5 && (
          <TouchableOpacity style={styles.actionBtn} onPress={refillHearts}>
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionText}>Refill Hearts</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.actionBtn, styles.dangerBtn]} onPress={handleReset}>
          <Text style={styles.actionIcon}>🗑️</Text>
          <Text style={[styles.actionText, styles.dangerText]}>Reset Progress</Text>
          <Text style={[styles.actionArrow, styles.dangerText]}>›</Text>
        </TouchableOpacity>

        {/* About */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>🇯🇲 Patois Language App</Text>
          <Text style={styles.aboutText}>
            Learn Jamaican Patois through interactive lessons inspired by the best language learning
            apps. Explore greetings, food, family, proverbs, and Rastafari culture.
          </Text>
          <Text style={styles.aboutVersion}>v1.0.0</Text>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.charcoal,
  },
  scroll: {
    padding: Spacing.lg,
  },
  avatarCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.green,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  levelText: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.charcoal,
  },
  levelSub: {
    fontSize: FontSize.sm,
    color: Colors.midGray,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  xpBar: {
    width: '100%',
    height: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 5,
  },
  sectionLabel: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    width: '30%',
    flexGrow: 1,
    ...Shadow.card,
  },
  statIcon: {
    fontSize: FontSize.xl,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
    textAlign: 'center',
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.card,
  },
  unitEmoji: {
    fontSize: FontSize.xl,
  },
  unitInfo: {
    flex: 1,
  },
  unitTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 6,
  },
  unitBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  unitBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  unitBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  unitCount: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'right',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.card,
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: Colors.red + '40',
  },
  actionIcon: {
    fontSize: FontSize.xl,
  },
  actionText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  dangerText: {
    color: Colors.red,
  },
  actionArrow: {
    fontSize: 24,
    color: Colors.midGray,
  },
  timePickerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.green + '40',
  },
  timePickerLabel: {
    fontSize: FontSize.sm,
    color: Colors.midGray,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  timePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.offWhite,
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
  },
  timeChipActive: {
    backgroundColor: Colors.green + '15',
    borderColor: Colors.green,
  },
  timeChipText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.midGray,
  },
  timeChipTextActive: {
    color: Colors.green,
  },
  aboutCard: {
    backgroundColor: Colors.green + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.green + '40',
  },
  aboutTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  aboutText: {
    fontSize: FontSize.sm,
    color: Colors.darkGray,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  aboutVersion: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
  },
});
