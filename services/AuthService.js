import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_CONFIG } from '../config/authConfig';

// Configuração para redirecionamento de autenticação
WebBrowser.maybeCompleteAuthSession();

// Usando as credenciais do arquivo de configuração
const { CLIENT_ID, IOS_CLIENT_ID, ANDROID_CLIENT_ID, WEB_CLIENT_ID } = AUTH_CONFIG.GOOGLE;
const FACEBOOK_APP_ID = AUTH_CONFIG.FACEBOOK.APP_ID;

export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: CLIENT_ID,
    iosClientId: IOS_CLIENT_ID || undefined,
    androidClientId: ANDROID_CLIENT_ID || undefined,
    webClientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  const handleGoogleResponse = async () => {
    if (response?.type === 'success') {
      setLoading(true);
      const { authentication } = response;
      
      try {
        // Obter informações do usuário usando o token de acesso
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          }
        );

        const googleUserInfo = await userInfoResponse.json();
        
        // Transformar dados para o formato esperado pelo app
        const userData = {
          id: `google-${googleUserInfo.id}`,
          email: googleUserInfo.email,
          displayName: googleUserInfo.name,
          photoURL: googleUserInfo.picture,
          provider: 'google',
          accessToken: authentication.accessToken,
        };

        // Salvar no AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        setUserInfo(userData);
        setLoading(false);
        return userData;
      } catch (e) {
        console.error('Erro ao obter informações do Google:', e);
        setError('Falha ao obter informações do usuário');
        setLoading(false);
        return null;
      }
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await promptAsync();
    } catch (e) {
      console.error('Erro ao iniciar autenticação Google:', e);
      setError('Falha ao iniciar login com Google');
    }
  };

  const signOutFromGoogle = async () => {
    try {
      // Limpar dados do usuário
      setUserInfo(null);
      await AsyncStorage.removeItem('user');
      return true;
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
      return false;
    }
  };

  return {
    userInfo,
    loading,
    error,
    signInWithGoogle,
    signOutFromGoogle,
  };
};

export const useFacebookAuth = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID,
    // Permissões que você deseja solicitar
    scopes: ['public_profile', 'email'],
  });

  useEffect(() => {
    handleFacebookResponse();
  }, [response]);

  const handleFacebookResponse = async () => {
    if (response?.type === 'success') {
      setLoading(true);
      const { authentication } = response;
      
      try {
        // Obter informações do usuário usando o token de acesso
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${authentication.accessToken}`
        );

        const facebookUserInfo = await userInfoResponse.json();
        
        // Transformar dados para o formato esperado pelo app
        const userData = {
          id: `facebook-${facebookUserInfo.id}`,
          email: facebookUserInfo.email || `${facebookUserInfo.id}@facebook.com`,
          displayName: facebookUserInfo.name,
          photoURL: facebookUserInfo.picture?.data?.url,
          provider: 'facebook',
          accessToken: authentication.accessToken,
        };

        // Salvar no AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        setUserInfo(userData);
        setLoading(false);
        return userData;
      } catch (e) {
        console.error('Erro ao obter informações do Facebook:', e);
        setError('Falha ao obter informações do usuário');
        setLoading(false);
        return null;
      }
    }
  };

  const signInWithFacebook = async () => {
    setError(null);
    try {
      await promptAsync();
    } catch (e) {
      console.error('Erro ao iniciar autenticação Facebook:', e);
      setError('Falha ao iniciar login com Facebook');
    }
  };

  const signOutFromFacebook = async () => {
    try {
      // Limpar dados do usuário
      setUserInfo(null);
      await AsyncStorage.removeItem('user');
      return true;
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
      return false;
    }
  };

  return {
    userInfo,
    loading,
    error,
    signInWithFacebook,
    signOutFromFacebook,
  };
};
