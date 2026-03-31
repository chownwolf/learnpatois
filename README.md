# 🇯🇲 Patois — Learn Jamaican Patois

A mobile language learning app for Jamaican Patois, built with React Native and Expo. Inspired by Duolingo's gamified approach, Patois teaches vocabulary, phrases, and culture through interactive bite-sized lessons.

---

## Features

- **6 Units, 24 Lessons, 300+ Exercises** — greetings, numbers, family, food, everyday phrases, and Rastafari culture
- **5 Exercise Types** — multiple choice, word bank translation, fill-in-the-blank, pronunciation cards, and listening comprehension
- **Audio Pronunciation** — every word spoken aloud via text-to-speech with Jamaican English accent
- **Gamification** — XP, day streaks, hearts/lives, 1–3 stars per lesson, level system, and progressive unit unlocking
- **Flashcard Mode** — full deck of 250+ vocabulary cards with flip animation and Got it / Still learning sorting
- **Animations** — confetti on 3-star lessons, trophy bounce, shake on wrong answers, milestone banners for streak achievements
- **Daily Reminders** — configurable streak notifications (8 AM – 9 PM) with rotating Patois-flavoured messages
- **Offline First** — all content bundled, progress saved locally via AsyncStorage

---

## Screenshots

> Coming soon

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Navigation | React Navigation (bottom tabs + native stack) |
| State | Zustand + AsyncStorage |
| Audio | expo-speech (TTS) |
| Notifications | expo-notifications |
| Animations | React Native Animated API + react-native-confetti-cannon |
| Build & Deploy | EAS Build + EAS Submit |
| Language | TypeScript |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/client) on your iOS or Android device

### Installation

```bash
git clone https://github.com/cmwolford/patois.git
cd patois
npm install
```

### Run

```bash
npx expo start --tunnel
```

Scan the QR code with Expo Go on your phone.

### Regenerate app icon & splash screen

```bash
node scripts/generate-assets.mjs
```

---

## Project Structure

```
src/
├── components/
│   ├── lesson/        # Exercise components (MC, translation, fill-blank, pronunciation, listening)
│   ├── ui/            # Badges, hearts, streak, unit bubbles
│   └── common/        # Typography, buttons
├── constants/         # Theme (colors, spacing, typography)
├── data/
│   └── lessons/       # All Patois content (6 units × 4 lessons)
├── engine/            # Lesson runner, XP calculator, streak logic, notifications
├── hooks/             # useLesson, useSpeech
├── navigation/        # Tab navigator, learn stack, practice stack
├── screens/
│   ├── learn/         # Home path, lesson screen, result screen
│   ├── practice/      # Practice menu, flashcards
│   └── profile/       # Stats, streaks, settings
├── store/             # Zustand progress store
└── types/             # Shared TypeScript interfaces
```

---

## Content Overview

| Unit | Topic | Lessons |
|---|---|---|
| 1 | Greetings & Basics | Say Hello, Farewells, How Are You?, Basic Phrases |
| 2 | Numbers & Time | Numbers 1–10, Telling Time, Days of the Week, Time Expressions |
| 3 | Family & People | Family Members, Friends & Community, Describing People, Feelings |
| 4 | Food & Drink | Jamaican Dishes, Drinks & Fruits, At the Market, Cooking & Eating |
| 5 | Everyday Phrases | Street Talk, Expressions of Approval, Everyday Life, Reactions |
| 6 | Culture & Proverbs | Wisdom Sayings, Rastafari Culture, Music & Riddim, Deep Culture |

---

## Building for Production

```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android
```

---

## About Jamaican Patois

Jamaican Patois (also called Jamaican Creole or *Patwa*) is an English-based creole language with West African influences, spoken by approximately 3 million people in Jamaica and the Jamaican diaspora worldwide. It is distinct from Standard Jamaican English and is the primary language of informal communication across Jamaica.

---

## License

MIT
