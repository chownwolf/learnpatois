import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearnStackParamList } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { useProgressStore } from '../../store/useProgressStore';

type Props = NativeStackScreenProps<LearnStackParamList, 'LessonResult'>;

export const LessonResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { result } = route.params;
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);

  const stars = result.stars;
  const starDisplay = ['⭐', '⭐', '⭐'].map((s, i) => (i < stars ? s : '☆')).join(' ');

  const accuracyColor =
    result.accuracy >= 90 ? Colors.green : result.accuracy >= 70 ? Colors.gold : Colors.red;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Trophy */}
        <View style={styles.trophyContainer}>
          <Text style={styles.trophy}>
            {stars === 3 ? '🏆' : stars === 2 ? '🥈' : '🥉'}
          </Text>
          <Text style={styles.congratsText}>
            {stars === 3 ? 'Perfect!' : stars === 2 ? 'Great job!' : 'Lesson complete!'}
          </Text>
          <Text style={styles.starRow}>{starDisplay}</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={[styles.statValue, { color: Colors.blue }]}>+{result.xpEarned}</Text>
            <Text style={styles.statLabel}>XP Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={[styles.statValue, { color: accuracyColor }]}>{result.accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={[styles.statValue, { color: Colors.orange }]}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Total XP */}
        <View style={styles.totalXPCard}>
          <Text style={styles.totalXPLabel}>Total XP</Text>
          <Text style={styles.totalXPValue}>{xp} ⚡</Text>
        </View>
      </ScrollView>

      {/* Actions */}
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
    fontSize: 80,
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
