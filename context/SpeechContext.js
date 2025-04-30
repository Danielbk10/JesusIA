import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85); // Velocidade mais lenta para voz de idoso
  const [speechPitch, setSpeechPitch] = useState(0.8); // Tom mais grave para voz de idoso
  
  // Carregar configurações de voz do AsyncStorage
  useEffect(() => {
    const loadSpeechSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('speech_settings');
        if (savedSettings) {
          const { enabled, rate, pitch } = JSON.parse(savedSettings);
          setIsSpeechEnabled(enabled);
          setSpeechRate(rate);
          setSpeechPitch(pitch);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de voz:', error);
      }
    };
    
    loadSpeechSettings();
  }, []);
  
  // Salvar configurações de voz no AsyncStorage
  const saveSpeechSettings = async () => {
    try {
      const settings = {
        enabled: isSpeechEnabled,
        rate: speechRate,
        pitch: speechPitch
      };
      await AsyncStorage.setItem('speech_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações de voz:', error);
    }
  };
  
  // Atualizar o AsyncStorage quando as configurações mudarem
  useEffect(() => {
    saveSpeechSettings();
  }, [isSpeechEnabled, speechRate, speechPitch]);
  
  // Função para alternar o estado de narração
  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
    }
    setIsSpeechEnabled(!isSpeechEnabled);
  };
  
  // Função para falar o texto
  const speak = async (text) => {
    if (!isSpeechEnabled || !text) return;
    
    try {
      // Parar qualquer fala em andamento
      if (isSpeaking) {
        await Speech.stop();
      }
      
      setIsSpeaking(true);
      
      // Configurar a voz para soar como um homem idoso com voz forte e calma
      const options = {
        language: 'pt-BR',
        pitch: speechPitch,
        rate: speechRate,
        voice: 'com.apple.voice.enhanced.pt-BR.Luciana', // Isso será ignorado em Android, mas funciona em iOS
        onDone: () => setIsSpeaking(false),
        onError: (error) => {
          console.error('Erro na síntese de voz:', error);
          setIsSpeaking(false);
        }
      };
      
      await Speech.speak(text, options);
    } catch (error) {
      console.error('Erro ao iniciar a síntese de voz:', error);
      setIsSpeaking(false);
    }
  };
  
  // Função para parar a narração
  const stopSpeaking = async () => {
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
    }
  };
  
  return (
    <SpeechContext.Provider
      value={{
        isSpeechEnabled,
        isSpeaking,
        toggleSpeech,
        speak,
        stopSpeaking,
        speechRate,
        speechPitch,
        setSpeechRate,
        setSpeechPitch
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
