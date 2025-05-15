import { useColorScheme as _useColorScheme } from 'react-native';

// O hook useColorScheme é apenas suportado em dispositivos com tema nativo
// Para o Jesus.IA, vamos sempre usar o tema escuro
export function useColorScheme() {
  return 'dark';
}
