import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const CHANNEL_ID = 'streak-reminders';
const NOTIFICATION_ID = 'daily-streak';

const MESSAGES = [
  {
    title: "🔥 Keep your streak alive!",
    body: "You haven't practiced Patois today. Mi deh yah — don't break the chain!",
  },
  {
    title: "Wah gwaan? 👋",
    body: "Your Patois is waiting. Jump in for a quick lesson and keep that streak going!",
  },
  {
    title: "🇯🇲 Irie vibes await!",
    body: "A few minutes of Patois a day keeps the forgotten words away. Likkle more!",
  },
  {
    title: "🔥 Streak at risk!",
    body: "Nuh mek di streak brok! Practice Patois now to stay on track.",
  },
  {
    title: "One love, one lesson 💚",
    body: "Your daily Patois practice is waiting. Walk good — but study first!",
  },
];

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function ensureAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Streak Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#58CC02',
    });
  }
}

export async function scheduleDailyStreakReminder(hourOfDay: number = 19): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await ensureAndroidChannel();

  // Cancel any existing reminder first
  await cancelStreakReminder();

  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: msg.title,
      body: msg.body,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hourOfDay,
      minute: 0,
    },
  });

  return true;
}

export async function cancelStreakReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
}

export async function isReminderScheduled(): Promise<boolean> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((n) => n.identifier === NOTIFICATION_ID);
}
