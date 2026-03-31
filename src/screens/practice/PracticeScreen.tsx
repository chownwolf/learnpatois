import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProgressStore } from '../../store/useProgressStore';
import { UNITS } from '../../data/units';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { XPBadge } from '../../components/ui/XPBadge';
import { PracticeStackParamList } from '../../types';

interface PracticeMode {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  available: boolean;
}

const MODES: PracticeMode[] = [
  {
    id: 'review',
    title: 'Review Lessons',
    description: 'Revisit completed lessons to sharpen your skills',
    emoji: '🔄',
    color: Colors.blue,
    available: true,
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Quickly review vocabulary with flip cards',
    emoji: '🃏',
    color: Colors.purple,
    available: true,
  },
  {
    id: 'speed',
    title: 'Speed Round',
    description: 'Answer as many questions as you can in 60 seconds',
    emoji: '⚡',
    color: Colors.gold,
    available: false,
  },
  {
    id: 'stories',
    title: 'Patois Stories',
    description: 'Read short stories written in Jamaican Patois',
    emoji: '📖',
    color: Colors.orange,
    available: false,
  },
];

export const PracticeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<PracticeStackParamList>>();
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);

  const handleModePress = (id: string) => {
    if (id === 'flashcards') navigation.navigate('Flashcard');
  };

  const completedCount = Object.keys(completedLessons).length;
  const totalLessons = UNITS.reduce((sum, u) => sum + u.lessons.length, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice</Text>
        <View style={styles.headerBadges}>
          <StreakBadge streak={streak} />
          <XPBadge xp={xp} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress summary */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0}%` },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {completedCount}/{totalLessons}
            </Text>
          </View>
          <Text style={styles.progressSub}>lessons completed</Text>
        </View>

        <Text style={styles.sectionLabel}>Practice Modes</Text>

        {MODES.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.modeCard, !mode.available && styles.modeCardDisabled]}
            activeOpacity={mode.available ? 0.8 : 1}
            disabled={!mode.available}
            onPress={() => handleModePress(mode.id)}
          >
            <View style={[styles.modeIcon, { backgroundColor: mode.color + '20' }]}>
              <Text style={styles.modeEmoji}>{mode.emoji}</Text>
            </View>
            <View style={styles.modeInfo}>
              <Text style={[styles.modeTitle, !mode.available && styles.modeTitleDisabled]}>
                {mode.title}
              </Text>
              <Text style={styles.modeDesc}>{mode.description}</Text>
            </View>
            {!mode.available && (
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            )}
            {mode.available && (
              <Text style={[styles.arrow, { color: mode.color }]}>›</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Completed lessons list */}
        {completedCount > 0 && (
          <>
            <Text style={styles.sectionLabel}>Completed Lessons</Text>
            {UNITS.flatMap((unit) =>
              unit.lessons
                .filter((l) => completedLessons[l.id])
                .map((l) => {
                  const record = completedLessons[l.id];
                  return (
                    <View key={l.id} style={styles.completedRow}>
                      <Text style={styles.completedEmoji}>{unit.emoji}</Text>
                      <View style={styles.completedInfo}>
                        <Text style={styles.completedTitle}>{l.title}</Text>
                        <Text style={styles.completedUnit}>{unit.title}</Text>
                      </View>
                      <View style={styles.completedRight}>
                        <Text style={styles.completedStars}>
                          {Array.from({ length: record.stars }).map(() => '⭐').join('')}
                        </Text>
                        <Text style={styles.completedAccuracy}>{record.bestAccuracy}%</Text>
                      </View>
                    </View>
                  );
                })
            )}
          </>
        )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerBadges: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  scroll: {
    padding: Spacing.lg,
  },
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.card,
  },
  progressTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: 5,
  },
  progressLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.charcoal,
    minWidth: 40,
    textAlign: 'right',
  },
  progressSub: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.card,
  },
  modeCardDisabled: {
    opacity: 0.7,
  },
  modeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeEmoji: {
    fontSize: 26,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 2,
  },
  modeTitleDisabled: {
    color: Colors.midGray,
  },
  modeDesc: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
    lineHeight: 16,
  },
  comingSoon: {
    backgroundColor: Colors.midGray + '30',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  comingSoonText: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
    fontWeight: '700',
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  completedEmoji: {
    fontSize: FontSize.xl,
  },
  completedInfo: {
    flex: 1,
  },
  completedTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  completedUnit: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
  },
  completedRight: {
    alignItems: 'flex-end',
  },
  completedStars: {
    fontSize: FontSize.sm,
  },
  completedAccuracy: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
  },
});
