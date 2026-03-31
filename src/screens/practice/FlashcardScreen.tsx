import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PracticeStackParamList } from '../../types';
import { UNITS } from '../../data/units';
import { Exercise } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants/theme';
import { useSpeech } from '../../hooks/useSpeech';

type Props = NativeStackScreenProps<PracticeStackParamList, 'Flashcard'>;

interface Flashcard {
  id: string;
  patois: string;
  english: string;
  phonetic: string;
  notes: string | null;
  unitEmoji: string;
  unitColor: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Flashcard[] {
  const seen = new Set<string>();
  const cards: Flashcard[] = [];

  for (const unit of UNITS) {
    for (const lesson of unit.lessons) {
      for (const ex of lesson.exercises) {
        const key = ex.patois.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          cards.push({
            id: ex.id,
            patois: ex.patois,
            english: ex.english,
            phonetic: ex.phonetic,
            notes: ex.notes,
            unitEmoji: unit.emoji,
            unitColor: unit.color,
          });
        }
      }
    }
  }

  return shuffle(cards);
}

const { width: SCREEN_W } = Dimensions.get('window');

export const FlashcardScreen: React.FC<Props> = ({ navigation }) => {
  const deck = useMemo(() => buildDeck(), []);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [learning, setLearning] = useState(0);
  const [done, setDone] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const { speak } = useSpeech();

  const card = deck[index];

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    if (!flipped) {
      speak(card.patois);
    }
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const next = (wasKnown: boolean) => {
    if (wasKnown) setKnown((k) => k + 1);
    else setLearning((l) => l + 1);

    // Reset flip
    flipAnim.setValue(0);
    setFlipped(false);

    if (index + 1 >= deck.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneContainer}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <Text style={styles.doneTitle}>Deck Complete!</Text>
          <Text style={styles.doneSub}>{deck.length} cards reviewed</Text>

          <View style={styles.doneStats}>
            <View style={[styles.doneStat, { backgroundColor: Colors.greenBg }]}>
              <Text style={styles.doneStatValue}>{known}</Text>
              <Text style={[styles.doneStatLabel, { color: Colors.green }]}>Got it ✓</Text>
            </View>
            <View style={[styles.doneStat, { backgroundColor: Colors.redBg }]}>
              <Text style={styles.doneStatValue}>{learning}</Text>
              <Text style={[styles.doneStatLabel, { color: Colors.red }]}>Still learning</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.restartBtn}
            onPress={() => {
              setIndex(0);
              setFlipped(false);
              setKnown(0);
              setLearning(0);
              setDone(false);
              flipAnim.setValue(0);
            }}
          >
            <Text style={styles.restartBtnText}>Study Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Back to Practice</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <Text style={styles.counter}>
          {index + 1} / {deck.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${((index) / deck.length) * 100}%` }]}
        />
      </View>

      {/* Card */}
      <View style={styles.cardArea}>
        <TouchableOpacity onPress={flipCard} activeOpacity={0.95} style={styles.cardTouchable}>
          {/* Front */}
          <Animated.View
            style={[
              styles.card,
              { borderTopColor: card.unitColor },
              { transform: [{ rotateY: frontInterpolate }] },
              flipped && styles.cardHidden,
            ]}
          >
            <Text style={styles.unitBadge}>{card.unitEmoji}</Text>
            <Text style={styles.frontPatois}>{card.patois}</Text>
            <Text style={styles.frontPhonetic}>/{card.phonetic}/</Text>
            <View style={styles.tapHint}>
              <Text style={styles.tapHintText}>Tap to reveal</Text>
            </View>
            <TouchableOpacity
              style={styles.speakBtnCard}
              onPress={(e) => {
                e.stopPropagation?.();
                speak(card.patois);
              }}
            >
              <Text style={styles.speakBtnText}>🔊 Hear it</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Back */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { borderTopColor: card.unitColor },
              { transform: [{ rotateY: backInterpolate }] },
              !flipped && styles.cardHidden,
            ]}
          >
            <Text style={styles.unitBadge}>{card.unitEmoji}</Text>
            <Text style={styles.backPatois}>{card.patois}</Text>
            <View style={styles.divider} />
            <Text style={styles.backEnglish}>{card.english}</Text>
            {card.notes && (
              <View style={styles.noteBox}>
                <Text style={styles.noteIcon}>💡</Text>
                <Text style={styles.noteText}>{card.notes}</Text>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Action buttons — only visible after flip */}
      <View style={styles.actions}>
        {flipped ? (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, styles.learningBtn]}
              onPress={() => next(false)}
            >
              <Text style={styles.actionBtnIcon}>🔁</Text>
              <Text style={[styles.actionBtnText, { color: Colors.red }]}>Still learning</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.knownBtn]}
              onPress={() => next(true)}
            >
              <Text style={styles.actionBtnIcon}>✓</Text>
              <Text style={[styles.actionBtnText, { color: Colors.green }]}>Got it!</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.flipPrompt}>Tap the card to flip it</Text>
        )}
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <Text style={[styles.statChip, { color: Colors.green }]}>✓ {known}</Text>
        <Text style={[styles.statChip, { color: Colors.red }]}>🔁 {learning}</Text>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: FontSize.md,
    color: Colors.darkGray,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  counter: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.midGray,
    minWidth: 50,
    textAlign: 'right',
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.lightGray,
    marginHorizontal: Spacing.lg,
    borderRadius: 3,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 3,
  },
  cardArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTouchable: {
    width: '100%',
    aspectRatio: 0.75,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 6,
    backfaceVisibility: 'hidden',
    ...Shadow.button,
  },
  cardBack: {
    backgroundColor: Colors.charcoal,
  },
  cardHidden: {
    // backfaceVisibility handles this; this is a fallback
    pointerEvents: 'none',
  },
  unitBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    fontSize: FontSize.xl,
  },
  frontPatois: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  frontPhonetic: {
    fontSize: FontSize.lg,
    color: Colors.midGray,
    fontStyle: 'italic',
    marginBottom: Spacing.xl,
  },
  tapHint: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  tapHintText: {
    fontSize: FontSize.xs,
    color: Colors.midGray,
    fontWeight: '600',
  },
  speakBtnCard: {
    backgroundColor: Colors.blue + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.blue + '40',
  },
  speakBtnText: {
    fontSize: FontSize.sm,
    color: Colors.blue,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.white + '30',
    width: '80%',
    marginVertical: Spacing.md,
  },
  backPatois: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.white + 'AA',
    textAlign: 'center',
    marginBottom: 4,
  },
  backEnglish: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: Colors.white + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  noteIcon: {
    fontSize: FontSize.md,
  },
  noteText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.white + 'CC',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  learningBtn: {
    backgroundColor: Colors.redBg,
    borderColor: Colors.red,
  },
  knownBtn: {
    backgroundColor: Colors.greenBg,
    borderColor: Colors.green,
  },
  actionBtnIcon: {
    fontSize: FontSize.lg,
  },
  actionBtnText: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  flipPrompt: {
    fontSize: FontSize.md,
    color: Colors.midGray,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  statChip: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  // Done screen
  doneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  doneEmoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  doneTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  doneSub: {
    fontSize: FontSize.md,
    color: Colors.midGray,
    marginBottom: Spacing.xl,
  },
  doneStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  doneStat: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  doneStatValue: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.charcoal,
  },
  doneStatLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginTop: 4,
  },
  restartBtn: {
    backgroundColor: Colors.green,
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  restartBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.white,
  },
  backBtn: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.midGray,
  },
});
