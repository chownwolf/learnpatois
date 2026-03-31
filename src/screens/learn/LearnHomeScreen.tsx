import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UNITS } from '../../data/units';
import { Unit, Lesson, LearnStackParamList } from '../../types';
import { useProgressStore } from '../../store/useProgressStore';
import { UnitBubble } from '../../components/ui/UnitBubble';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { XPBadge } from '../../components/ui/XPBadge';
import { AnimatedBadge } from '../../components/ui/AnimatedBadge';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';

type Props = NativeStackScreenProps<LearnStackParamList, 'LearnHome'>;

export const LearnHomeScreen: React.FC<Props> = ({ navigation }) => {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const isUnitUnlocked = useProgressStore((s) => s.isUnitUnlocked);

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const handleUnitPress = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const handleLessonPress = (lesson: Lesson, unit: Unit) => {
    setSelectedUnit(null);
    navigation.navigate('Lesson', { lessonId: lesson.id, unitId: unit.id });
  };

  const getLessonStars = (lessonId: string): number => {
    return completedLessons[lessonId]?.stars ?? 0;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🇯🇲 Patois</Text>
        <View style={styles.headerBadges}>
          <AnimatedBadge value={streak}>
            <StreakBadge streak={streak} />
          </AnimatedBadge>
          <AnimatedBadge value={xp}>
            <XPBadge xp={xp} />
          </AnimatedBadge>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pathLabel}>Learning Path</Text>

        {UNITS.map((unit, index) => {
          const unlocked = isUnitUnlocked(unit.prerequisiteUnitId);
          const completedCount = unit.lessons.filter((l) => completedLessons[l.id]).length;

          return (
            <View key={unit.id} style={styles.unitRow}>
              {/* Connector line */}
              {index > 0 && <View style={styles.connector} />}

              <View style={styles.unitContainer}>
                <UnitBubble unit={unit} onPress={handleUnitPress} />

                <View style={[styles.unitInfo, !unlocked && styles.unitInfoLocked]}>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitDesc} numberOfLines={2}>{unit.description}</Text>
                  <Text style={styles.unitProgress}>
                    {unlocked
                      ? `${completedCount}/${unit.lessons.length} lessons`
                      : '🔒 Complete previous unit'}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* Unit Detail Modal */}
      <Modal
        visible={selectedUnit !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedUnit(null)}
      >
        {selectedUnit && (
          <View style={styles.modalBg}>
            <View style={styles.modalSheet}>
              <View style={[styles.modalHeader, { backgroundColor: selectedUnit.color }]}>
                <Text style={styles.modalEmoji}>{selectedUnit.emoji}</Text>
                <View style={styles.modalTitleArea}>
                  <Text style={styles.modalTitle}>{selectedUnit.title}</Text>
                  <Text style={styles.modalDesc}>{selectedUnit.description}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedUnit(null)} style={styles.modalClose}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={selectedUnit.lessons}
                keyExtractor={(l) => l.id}
                renderItem={({ item: lesson, index }) => {
                  const stars = getLessonStars(lesson.id);
                  const isComplete = stars > 0;
                  return (
                    <TouchableOpacity
                      style={styles.lessonRow}
                      onPress={() => handleLessonPress(lesson, selectedUnit)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.lessonNum, { backgroundColor: selectedUnit.color + '25' }]}>
                        <Text style={[styles.lessonNumText, { color: selectedUnit.color }]}>
                          {index + 1}
                        </Text>
                      </View>
                      <View style={styles.lessonInfo}>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                        <Text style={styles.lessonXP}>+{lesson.xpReward} XP</Text>
                      </View>
                      <Text style={styles.lessonStars}>
                        {Array.from({ length: 3 }).map((_, i) =>
                          i < stars ? '⭐' : '☆'
                        ).join('')}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={{ paddingBottom: Spacing.xxl }}
              />
            </View>
          </View>
        )}
      </Modal>
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
    alignItems: 'center',
  },
  pathLabel: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.midGray,
    marginBottom: Spacing.xl,
    alignSelf: 'flex-start',
  },
  connector: {
    width: 3,
    height: 40,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginLeft: 40,
  },
  unitRow: {
    width: '100%',
    alignItems: 'flex-start',
  },
  unitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    width: '100%',
  },
  unitInfo: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  unitInfoLocked: {
    opacity: 0.6,
  },
  unitTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.charcoal,
    marginBottom: 4,
  },
  unitDesc: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
    marginBottom: 6,
  },
  unitProgress: {
    fontSize: FontSize.xs,
    color: Colors.green,
    fontWeight: '700',
  },
  // Modal
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  modalEmoji: {
    fontSize: 36,
  },
  modalTitleArea: {
    flex: 1,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.white,
  },
  modalDesc: {
    fontSize: FontSize.sm,
    color: Colors.white + 'CC',
    marginTop: 2,
  },
  modalClose: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: FontSize.md,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    gap: Spacing.md,
  },
  lessonNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumText: {
    fontWeight: '800',
    fontSize: FontSize.md,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  lessonXP: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
    marginTop: 2,
  },
  lessonStars: {
    fontSize: FontSize.sm,
    letterSpacing: 1,
  },
});
