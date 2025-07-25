// Script para resetar o onboarding - execute no console do navegador
// ou adicione temporariamente no App.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem('onboarding_completed');
    console.log('Onboarding resetado com sucesso!');
  } catch (error) {
    console.error('Erro ao resetar onboarding:', error);
  }
};

// Para usar no console do navegador (se AsyncStorage estiver disponível):
// resetOnboarding();

export default resetOnboarding;
