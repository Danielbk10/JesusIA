// Script para resetar as configurações do Eleven Labs
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  } catch (error) {
    console.error('Erro ao resetar configurações do Eleven Labs:', error);
  }
};

// Executar o reset
resetElevenLabsSettings();
