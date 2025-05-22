import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import { elevenLabsService } from '../services/elevenLabsService';
import { ELEVEN_LABS_CONFIG } from '../config/elevenLabsConfig';

const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85); // Velocidade moderada para melhor compreensão
  const [speechPitch, setSpeechPitch] = useState(0.7); // Tom mais grave para voz masculina
  // Sempre usar o Eleven Labs com a nova chave API
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('sk_3a953e02f6965c00a95cdad552305b05c4a83bbce277edbd');
  const [selectedVoiceId, setSelectedVoiceId] = useState('pNInz6obpgDQGcFmaJgB'); // ID da voz Raphael
  
  // Carregar configurações de voz do AsyncStorage
  useEffect(() => {
    const loadSpeechSettings = async () => {
      try {
        console.log('Carregando configurações de voz...');
        
        // Carregar configurações salvas
        const savedSettings = await AsyncStorage.getItem('speech_settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          console.log('Configurações carregadas:', settings);
          
          const { enabled, rate, pitch, useEleven, elevenKey, voiceId } = settings;
          setIsSpeechEnabled(enabled);
          setSpeechRate(rate);
          setSpeechPitch(pitch);
          
          // Carregar outras configurações, mas manter as configurações do Eleven Labs definidas no código
          // Não sobrescrever as configurações do Eleven Labs para garantir que ele sempre seja usado
          console.log('Mantendo configurações do Eleven Labs definidas no código');
          
          // Configurar a chave API do Eleven Labs no serviço
          elevenLabsService.setApiKey('sk_3a953e02f6965c00a95cdad552305b05c4a83bbce277edbd');
        } else {
          console.log('Nenhuma configuração salva encontrada, usando valores padrão');
          // Configurar valores padrão otimizados para voz masculina
          setSpeechRate(0.85);
          setSpeechPitch(0.7);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de voz:', error);
      }
    };
    
    loadSpeechSettings();
  }, []);
  
  // Configurar a chave API do Eleven Labs
  useEffect(() => {
    if (elevenLabsApiKey && elevenLabsApiKey !== 'YOUR_API_KEY_HERE') {
      elevenLabsService.setApiKey(elevenLabsApiKey);
    }
  }, [elevenLabsApiKey]);
  
  // Salvar configurações de voz no AsyncStorage
  const saveSpeechSettings = async () => {
    try {
      const settings = {
        enabled: isSpeechEnabled,
        rate: speechRate,
        pitch: speechPitch,
        useEleven: useElevenLabs,
        elevenKey: elevenLabsApiKey,
        voiceId: selectedVoiceId
      };
      await AsyncStorage.setItem('speech_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações de voz:', error);
    }
  };
  
  // Atualizar o AsyncStorage quando as configurações mudarem
  useEffect(() => {
    saveSpeechSettings();
  }, [isSpeechEnabled, speechRate, speechPitch, useElevenLabs, elevenLabsApiKey, selectedVoiceId]);
  
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
        if (useElevenLabs) {
          await elevenLabsService.stopSpeaking();
        } else {
          await Speech.stop();
        }
      }
      
      setIsSpeaking(true);
      
      // Sempre usar o Eleven Labs com a nova chave API
      console.log('Usando Eleven Labs para narração');
      
      // Configurar a chave API do Eleven Labs no serviço
      elevenLabsService.setApiKey('sk_3a953e02f6965c00a95cdad552305b05c4a83bbce277edbd');
      
      // Sempre tentar usar o Eleven Labs primeiro
      try {
        // Forçar o uso da voz Raphael do Eleven Labs
        const voiceId = 'pNInz6obpgDQGcFmaJgB'; // ID da voz Raphael
        console.log('Tentando usar voz Raphael do Eleven Labs com ID:', voiceId);
        
        // Usar o Eleven Labs para TTS
        await elevenLabsService.textToSpeech(text, voiceId);
        
        // Configurar um listener para quando a fala terminar
        const checkSpeakingInterval = setInterval(() => {
          if (!elevenLabsService.isCurrentlySpeaking()) {
            clearInterval(checkSpeakingInterval);
            setIsSpeaking(false);
          }
        }, 500);
        
        return;
      } catch (error) {
        console.error('Erro ao usar Eleven Labs, voltando para TTS nativo:', error);
        // Se falhar, voltar para o TTS nativo
      }
      
      // Se não usar Eleven Labs ou se falhar, usar o TTS nativo
      // Configurar opções de voz para soar como uma voz masculina forte
      const options = {
        language: 'pt-BR',
        pitch: speechPitch,
        rate: speechRate,
        onDone: () => setIsSpeaking(false),
        onError: (error) => {
          console.error('Erro na síntese de voz:', error);
          setIsSpeaking(false);
        }
      };
      
      // Tentar obter vozes disponíveis e selecionar uma voz masculina
      try {
        const availableVoices = await Speech.getAvailableVoicesAsync();
        
        // Filtrar vozes masculinas em português
        const malePtVoices = availableVoices.filter(voice => 
          (voice.language.includes('pt-BR') || 
           voice.language.includes('pt_BR') || 
           voice.language.includes('por_BRA') || 
           voice.language.includes('pt-PT')) && 
          (voice.name?.toLowerCase().includes('male') || 
           voice.name?.toLowerCase().includes('homem') || 
           voice.name?.toLowerCase().includes('daniel') || 
           voice.name?.toLowerCase().includes('joaquim') || 
           voice.identifier?.toLowerCase().includes('male') ||
           voice.identifier?.toLowerCase().includes('daniel'))
        );
        
        if (malePtVoices.length > 0) {
          // Usar a primeira voz masculina em português encontrada
          options.voice = malePtVoices[0].identifier;
        } else {
          // Se não encontrar vozes masculinas em português, usar abordagem específica da plataforma
          if (Platform.OS === 'ios') {
            // Vozes masculinas em português para iOS (em ordem de preferência)
            const maleVoices = [
              'com.apple.voice.premium.pt-BR.Daniel',
              'com.apple.voice.enhanced.pt-BR.Daniel',
              'pt-BR-Daniel',
              'com.apple.ttsbundle.Daniel-compact',
              'com.apple.voice.premium.pt-PT.Joaquim',
              'com.apple.voice.enhanced.pt-PT.Joaquim'
            ];
            
            // Tentar usar uma das vozes masculinas
            for (const voice of maleVoices) {
              options.voice = voice;
              try {
                await Speech.speak('', { ...options, volume: 0 }); // Teste silencioso
                break;
              } catch (e) {
                continue; // Tentar a próxima voz
              }
            }
          } else if (Platform.OS === 'android') {
            // Em Android, tentar várias opções de vozes masculinas
            const androidMaleVoices = [
              'pt-br-x-afm-local', // Voz masculina local
              'pt-br-x-afs#male_1-local',
              'pt-br-x-afs#male_2-local',
              'pt-br-x-afs#male_3-local',
              'pt-br-x-afm#male-local',
              'Brazilian-Portuguese-Male',
              'pt_BR_male'
            ];
            
            // Tentar cada uma das vozes masculinas para Android
            for (const voice of androidMaleVoices) {
              options.voice = voice;
              try {
                console.log('Tentando voz Android:', voice);
                break;
              } catch (e) {
                continue; // Tentar a próxima voz
              }
            }
            
            // Configurar parâmetros adicionais para Android
            options.pitch = 0.5; // Pitch ainda mais baixo para Android
          }
        }
      } catch (error) {
        console.error('Erro ao obter vozes disponíveis:', error);
        
        // Fallback para configurações específicas da plataforma
        if (Platform.OS === 'ios') {
          options.voice = 'com.apple.voice.premium.pt-BR.Daniel';
        } else if (Platform.OS === 'android') {
          options.language = 'pt-BR';
          options.pitch = 0.5; // Pitch ainda mais baixo para Android
        }
      }
      
      // Usar o TTS nativo
      await Speech.speak(text, options);
    } catch (error) {
      console.error('Erro ao iniciar a síntese de voz:', error);
      setIsSpeaking(false);
    }
  };
  
  // Função para parar a narração
  const stopSpeaking = async () => {
    if (isSpeaking) {
      if (useElevenLabs) {
        await elevenLabsService.stopSpeaking();
      } else {
        await Speech.stop();
      }
      setIsSpeaking(false);
    }
  };
  
  // Função para configurar a chave API do Eleven Labs
  const setElevenLabsKey = (apiKey) => {
    if (apiKey && apiKey.trim() !== '') {
      setElevenLabsApiKey(apiKey);
      elevenLabsService.setApiKey(apiKey);
      setUseElevenLabs(true);
      Alert.alert('Sucesso', 'Chave API do Eleven Labs configurada com sucesso!');
    }
  };
  
  // Função para alternar entre usar Eleven Labs ou TTS nativo
  const toggleElevenLabs = () => {
    setUseElevenLabs(!useElevenLabs);
  };
  
  // Função para selecionar uma voz do Eleven Labs
  const selectElevenLabsVoice = (voiceId) => {
    setSelectedVoiceId(voiceId);
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
        setSpeechPitch,
        useElevenLabs,
        toggleElevenLabs,
        elevenLabsApiKey,
        setElevenLabsKey,
        selectedVoiceId,
        selectElevenLabsVoice
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
