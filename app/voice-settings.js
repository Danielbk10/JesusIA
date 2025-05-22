import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Slider, ScrollView, TouchableOpacity } from 'react-native';
import { useSpeech } from '../context/SpeechContext';
import { Ionicons } from '@expo/vector-icons';
import VoiceSelector from '../components/VoiceSelector';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function VoiceSettingsScreen() {
  const router = useRouter();
  const { 
    isSpeechEnabled, 
    toggleSpeech, 
    speechRate, 
    setSpeechRate, 
    speechPitch, 
    setSpeechPitch,
    speak
  } = useSpeech();
  
  // Função para testar as configurações atuais
  const testCurrentSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    speak("Olá, esta é uma amostra da narração com as configurações atuais. Jesus te ama e está contigo em todos os momentos.");
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Configurações de Voz</Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Narração</Text>
            <Text style={styles.settingDescription}>
              Ativar narração de textos
            </Text>
          </View>
          <Switch
            value={isSpeechEnabled}
            onValueChange={toggleSpeech}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor={isSpeechEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderTitle}>
            Velocidade: {speechRate.toFixed(2)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={1.0}
            step={0.05}
            value={speechRate}
            onValueChange={setSpeechRate}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#2196F3"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Lenta</Text>
            <Text style={styles.sliderLabel}>Normal</Text>
          </View>
        </View>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderTitle}>
            Tom: {speechPitch.toFixed(2)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={1.5}
            step={0.05}
            value={speechPitch}
            onValueChange={setSpeechPitch}
            minimumTrackTintColor="#673AB7"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#673AB7"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Grave</Text>
            <Text style={styles.sliderLabel}>Agudo</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={testCurrentSettings}
        >
          <Ionicons name="volume-high" size={20} color="#fff" />
          <Text style={styles.testButtonText}>Testar configurações atuais</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
      
      {/* Componente seletor de vozes */}
      <VoiceSelector />
      
      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={24} color="#2196F3" style={styles.infoIcon} />
        <Text style={styles.infoText}>
          Selecione uma voz que seja clara e agradável para você. Ajuste a velocidade e o tom para uma experiência personalizada.
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          As configurações são salvas automaticamente
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
  },
  testButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
