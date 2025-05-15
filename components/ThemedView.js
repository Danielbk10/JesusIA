import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../config/colorConfig';

export function ThemedView({ children, style, ...props }) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
  },
});
