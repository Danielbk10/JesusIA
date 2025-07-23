import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Serviço de autenticação web simplificado com autenticação simulada
export const useWebAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Autenticação com Google (simulada)
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Usando autenticação simulada para fins de teste');
      
      // Dados simulados do usuário
      const userData = {
        id: 'google-123456789',
        email: 'usuario.teste@gmail.com',
        displayName: 'Usuário de Teste',
        photoURL: 'https://ui-avatars.com/api/?name=Usuario+Teste&background=random',
        provider: 'google',
        accessToken: 'token-simulado-' + Date.now()
      };
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      setUserInfo(userData);
      setLoading(false);
      return userData;
    } catch (e) {
      console.error('Erro na autenticação Google:', e);
      setError(`Falha na autenticação: ${e.message}`);
      setLoading(false);
      return null;
    }
  };

  // Autenticação com Facebook (simulada)
  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Usando autenticação simulada do Facebook para fins de teste');
      
      // Dados simulados do usuário
      const userData = {
        id: 'facebook-987654321',
        email: 'usuario.teste@facebook.com',
        displayName: 'Usuário Facebook',
        photoURL: 'https://ui-avatars.com/api/?name=Usuario+Facebook&background=4267B2',
        provider: 'facebook',
        accessToken: 'token-facebook-simulado-' + Date.now()
      };
      
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      setUserInfo(userData);
      setLoading(false);
      return userData;
    } catch (e) {
      console.error('Erro na autenticação Facebook:', e);
      setError(`Falha na autenticação: ${e.message}`);
      setLoading(false);
      return null;
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setLoading(true);
      console.log('WebAuthService: Realizando logout...');
      await AsyncStorage.removeItem('user');
      setUserInfo(null);
      console.log('WebAuthService: Logout concluído com sucesso');
      setLoading(false);
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
      setError(`Falha ao fazer logout: ${e.message}`);
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    userInfo,
    signInWithGoogle,
    signInWithFacebook,
    signOut
  };
};
