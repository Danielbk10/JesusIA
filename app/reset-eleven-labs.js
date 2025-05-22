import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { useSpeech } from '../context/SpeechContext';

export default function ResetElevenLabsScreen() {
  const { setUseElevenLabs, setElevenLabsApiKey } = useSpeech();

  // Função para resetar as configurações do Eleven Labs
  const resetElevenLabsSettings = async () => {
    try {
      console.log('Iniciando reset das configurações do Eleven Labs...');
      
      // Obter as configurações atuais
      const savedSettings = await AsyncStorage.getItem('speech_settings');
      let settings = {};
      
      if (savedSettings) {
        settings = JSON.parse(savedSettings);
        console.log('Configurações atuais:', settings);
      }
      
      // Atualizar as configurações para usar o Eleven Labs
      const updatedSettings = {
        ...settings,
        useEleven: true,
        voiceId: 'pNInz6obpgDQGcFmaJgB', // Raphael
        elevenKey: 'sk_3a953e02f6965c00a95cdad552305b05c4a83bbce277edbd'
      };
      
      // Salvar as configurações atualizadas
      await AsyncStorage.setItem('speech_settings', JSON.stringify(updatedSettings));
      console.log('Configurações do Eleven Labs atualizadas com sucesso!');
      console.log('Novas configurações:', updatedSettings);
      
      // Atualizar o contexto diretamente
      setUseElevenLabs(true);
      setElevenLabsApiKey('sk_3a953e02f6965c00a95cdad552305b05c4a83bbce277edbd');
      
      alert('Configurações do Eleven Labs resetadas com sucesso! Reinicie o aplicativo para aplicar as alterações.');
    } catch (error) {
      console.error('Erro ao resetar configurações do Eleven Labs:', error);
      alert('Erro ao resetar configurações: ' + error.message);
    }
  };

  // Executar o reset automaticamente ao abrir a tela
  useEffect(() => {
    resetElevenLabsSettings();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Resetar Eleven Labs' }} />
      
      <Text style={styles.title}>Resetar Configurações do Eleven Labs</Text>
      <Text style={styles.description}>
        Esta tela redefine as configurações do Eleven Labs para usar a voz Raphael com a nova chave API.
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={resetElevenLabsSettings}
      >
        <Text style={styles.buttonText}>Resetar Novamente</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
