import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSpeech } from '../context/SpeechContext';
import { COLORS } from '../config/colorConfig';

const SpeechToggleButton = () => {
  const { isSpeechEnabled, toggleSpeech, isSpeaking } = useSpeech();
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isSpeechEnabled ? styles.enabled : styles.disabled
      ]}
      onPress={toggleSpeech}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {isSpeaking ? (
          <Ionicons name="volume-high" size={18} color="#fff" />
        ) : (
          <Ionicons name={isSpeechEnabled ? "volume-medium" : "volume-mute"} size={18} color="#fff" />
        )}
      </View>
      <Text style={styles.text}>
        {isSpeechEnabled ? "Narração Ativada" : "Narração Desativada"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  enabled: {
    backgroundColor: 'rgba(184, 157, 76, 0.9)',
  },
  disabled: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
  },
  iconContainer: {
    marginRight: 6,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SpeechToggleButton;
