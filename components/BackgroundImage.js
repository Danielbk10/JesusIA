import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

export default function BackgroundImage({ children }) {
  return (
    <ImageBackground
      source={require('../assets/images/tree_background.png')}
      style={styles.container}
      imageStyle={styles.image}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    opacity: 0.1,
    resizeMode: 'contain',
  },
});
