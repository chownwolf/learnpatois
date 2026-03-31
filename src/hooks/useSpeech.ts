import * as Speech from 'expo-speech';

export function useSpeech() {
  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: 'en-JM', // Jamaican English — falls back to en if unavailable
      rate: 0.85,
      pitch: 1.0,
    });
  };

  const stop = () => Speech.stop();

  return { speak, stop };
}
