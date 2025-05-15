import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { FONTS } from '../config/fontConfig';
import { COLORS } from '../config/colorConfig';

export function ThemedText({ children, style, type = 'body', ...props }) {
  const textStyle = [
    styles.default,
    type === 'title' && styles.title,
    type === 'subtitle' && styles.subtitle,
    type === 'body' && styles.body,
    type === 'small' && styles.small,
    type === 'link' && styles.link,
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONTS.SERIF,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
  link: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
});
