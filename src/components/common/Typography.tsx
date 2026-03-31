import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';

interface Props {
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
  numberOfLines?: number;
}

export const Title: React.FC<Props> = ({ style, children, numberOfLines }) => (
  <Text style={[styles.title, style]} numberOfLines={numberOfLines}>{children}</Text>
);

export const Heading: React.FC<Props> = ({ style, children, numberOfLines }) => (
  <Text style={[styles.heading, style]} numberOfLines={numberOfLines}>{children}</Text>
);

export const Body: React.FC<Props> = ({ style, children, numberOfLines }) => (
  <Text style={[styles.body, style]} numberOfLines={numberOfLines}>{children}</Text>
);

export const Caption: React.FC<Props> = ({ style, children, numberOfLines }) => (
  <Text style={[styles.caption, style]} numberOfLines={numberOfLines}>{children}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  heading: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  body: {
    fontSize: FontSize.md,
    fontWeight: '400',
    color: Colors.darkGray,
  },
  caption: {
    fontSize: FontSize.sm,
    fontWeight: '400',
    color: Colors.midGray,
  },
});
