import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearnStackParamList } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { useProgressStore } from '../../store/useProgressStore';

type Props = NativeStackScreenProps<LearnStackParamList, 'LessonResult'>;

const STREAK_MILESTONES = [3, 7, 14, 30];
const { width: SCREEN_W } = Dimensions.get('window');

export const LessonResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { result } = route.params;
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);

  const stars = result.stars;
  const starDisplay = ['⭐', '⭐', '⭐'].map((s, i) => (i < stars ? s : '☆')).join(' ');
  const accuracyColor =
    result.accuracy >= 90 ? Colors.green : result.accuracy >= 70 ? Colors.gold : Colors.red;

  const isStreakMilestone = STREAK_MILESTONES.includes(streak);
  const shouldCelebrate = stars === 3 || isStreakMilestone;

  // Trophy bounce animation
  const bounceAnim = useRef(new Animated.Value(0)).current;
  // XP counter animation
  const xpAnim = useRef(new Animated.Value(0)).current;
  // Stats fade-in
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Trophy bounces in
    Animated.spring(bounceAnim, {
      toValue: 1,
      tension: 60,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // Stats fade in after a short delay
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // XP count up animation
    Animated.timing(xpAnim, {
      toValue: result.xpEarned,
      duration: 800,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, []);

  const trophyScale = bounceAnim.interpolate({
    inputRange: [0, 0.6, 0.8, 1],
    outputRange: [0, 1.3, 0.9, 1],
  });

  const xpDisplay = xpAnim.interpolate({
    inputRange: [0, result.xpEarned],
    outputRange: [0, result.xpEarned],
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Confetti — fires on 3 stars or streak milestone */}
      {shouldCelebrate && (
        <ConfettiCannon
          count={180}
          origin={{ x: SCREEN_W / 2, y: -20 }}
          autoStart
          fadeOut
          explosionSpeed={350}
          fallSpeed={2800}
          colors={[Colors.green, Colors.gold, Colors.blue, Colors.purple, Colors.orange, '#fff']}
        />
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Trophy — bounces in */}
        <View style={styles.trophyContainer}>
          <Animated.Text
            style={[styles.trophy, { transform: [{ scale: trophyScale }] }]}
          >
            {stars === 3 ? '🏆' : stars === 2 ? '🥈' : '🥉'}
          </Animated.Text>
          <Text style={styles.congratsText}>
            {stars === 3 ? 'Perfect!' : stars === 2 ? 'Great job!' : 'Lesson complete!'}
          </Text>
          <Text style={styles.starRow}>{starDisplay}</Text>

          {/* Streak milestone banner */}
          {isStreakMilestone && (
            <View style={styles.milestoneBanner}>
              <Text style={styles.milestoneFire}>🔥</Text>
              <Text style={styles.milestoneText}>{streak}-day streak milestone!</Text>
              <Text style={styles.milestoneFire}>🔥</Text>
            </View>
          )}
        </View>

        {/* Stats — fade in */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Animated.Text style={[styles.statValue, { color: Colors.blue }]}>
                +{result.xpEarned}
              </Animated.Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={[styles.statValue, { color: accuracyColor }]}>
                {result.accuracy}%
              </Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={[styles.statValue, { color: Colors.orange }]}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          <View style={styles.totalXPCard}>
            <Text style={styles.totalXPLabel}>Total XP</Text>
            <Text style={styles.totalXPValue}>{xp} ⚡</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('LearnHome')}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  trophyContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xxl,
  },
  trophy: {
    fontSize: 90,
    marginBottom: Spacing.md,
  },
  congratsText: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  starRow: {
    fontSize: FontSize.xxl,
    letterSpacing: 4,
    marginBottom: Spacing.md,
  },
  milestoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold + '25',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.gold,
    marginTop: Spacing.sm,
  },
  milestoneFire: {
    fontSize: FontSize.xl,
  },
  milestoneText: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
  },
  statIcon: {
    fontSize: FontSize.xl,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
    textAlign: 'center',
  },
  totalXPCard: {
    backgroundColor: Colors.blue + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.blue,
    marginBottom: Spacing.lg,
  },
  totalXPLabel: {
    fontSize: FontSize.md,
    color: Colors.midGray,
    marginBottom: 4,
  },
  totalXPValue: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.blue,
  },
  actions: {
    padding: Spacing.lg,
  },
  continueBtn: {
    backgroundColor: Colors.green,
    borderRadius: BorderRadius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.greenDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  continueBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
});
