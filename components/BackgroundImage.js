import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export default function BackgroundImage() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/tree_background.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.1,
    zIndex: -1,
  },
  image: {
    width: '80%',
    height: '80%',
  },
});
