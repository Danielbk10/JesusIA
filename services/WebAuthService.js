import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { AUTH_CONFIG } from '../config/authConfig';
import { Platform } from 'react-native';
import AuthStorageService from './AuthStorageService';

// Função auxiliar para gerar string aleatória para state
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Função para extrair parâmetros da URL
const extractParamsFromUrl = (url) => {
  const params = {};
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  let match;
  while ((match = regex.exec(url)) !== null) {
    params[match[1]] = decodeURIComponent(match[2]);
  }
  return params;
};

// Serviço de autenticação web com provedores reais
export const useWebAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Autenticação com Google usando WebBrowser diretamente
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Iniciando autenticação com Google...');
      
      // Verificar se temos credenciais de produção configuradas
      const hasProductionCredentials = AUTH_CONFIG.GOOGLE.CLIENT_ID && 
        AUTH_CONFIG.GOOGLE.CLIENT_ID !== 'SEU_CLIENT_ID_AQUI' &&
        AUTH_CONFIG.GOOGLE.CLIENT_ID.includes('.apps.googleusercontent.com');
      
      if (hasProductionCredentials) {
        console.log('Usando autenticação real com Google OAuth');
        
        const redirectUri = AUTH_CONFIG.GOOGLE.REDIRECT_URI;
        const clientId = AUTH_CONFIG.GOOGLE.CLIENT_ID;
        const scopes = AUTH_CONFIG.GOOGLE.SCOPES.join(' ');
        const state = generateRandomString();
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scopes)}&state=${state}`;
        
        const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
        
        if (result.type === 'success') {
          const { url } = result;
          const params = extractParamsFromUrl(url);
          const accessToken = params.access_token;
          
          if (!accessToken) {
            throw new Error('Token de acesso não encontrado na resposta');
          }
          
          // Obter informações do usuário
          const userInfoResponse = await fetch(
            'https://www.googleapis.com/userinfo/v2/me',
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          
          if (!userInfoResponse.ok) {
            throw new Error('Falha ao obter informações do usuário');
          }
          
          const googleUserInfo = await userInfoResponse.json();
          
          const userData = {
            id: `google-${googleUserInfo.id}`,
            email: googleUserInfo.email,
            displayName: googleUserInfo.name,
            photoURL: googleUserInfo.picture,
            provider: 'google',
            loginMethod: 'google',
            accessToken
          };
          
          await AuthStorageService.saveUser(userData);
          await AuthStorageService.saveAuthToken(userData.accessToken, 'google', 3600);
          console.log('Dados do usuário Google salvos com AuthStorageService');
          
          setUserInfo(userData);
          setLoading(false);
          return userData;
        } else {
          throw new Error('Autenticação cancelada pelo usuário');
        }
      } else {
        // Fallback para desenvolvimento
        console.log('Usando autenticação simulada para Google (desenvolvimento)');
        
        // Dados simulados do usuário
        const userData = {
          id: 'google-123456789',
          email: 'usuario.teste@gmail.com',
          displayName: 'Usuário Google',
          photoURL: 'https://ui-avatars.com/api/?name=Usuario+Google&background=DB4437&color=fff',
          provider: 'google',
          loginMethod: 'google',
          accessToken: 'token-simulado-' + Date.now()
        };
        
        // Salvar usando o serviço de armazenamento
        await AuthStorageService.saveUser(userData);
        await AuthStorageService.saveAuthToken(userData.accessToken, 'google', 3600);
        console.log('Dados do usuário Google salvos com AuthStorageService');
        
        setUserInfo(userData);
        setLoading(false);
        return userData;
      }
      
      /* Código para implementação real com Google OAuth
      const redirectUri = AUTH_CONFIG.GOOGLE.REDIRECT_URI;
      const clientId = AUTH_CONFIG.GOOGLE.CLIENT_ID;
      const scopes = AUTH_CONFIG.GOOGLE.SCOPES.join(' ');
      const state = generateRandomString();
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scopes)}&state=${state}`;
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success') {
        const { url } = result;
        // Extrair token da URL
        const accessToken = url.match(/access_token=([^&]*)/)[1];
        
        // Obter informações do usuário
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        
        const googleUserInfo = await userInfoResponse.json();
        
        const userData = {
          id: `google-${googleUserInfo.id}`,
          email: googleUserInfo.email,
          displayName: googleUserInfo.name,
          photoURL: googleUserInfo.picture,
          provider: 'google',
          accessToken
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUserInfo(userData);
        setLoading(false);
        return userData;
      }
      */
      
    } catch (e) {
      console.error('Erro na autenticação Google:', e);
      setError(`Falha na autenticação: ${e.message}`);
      setLoading(false);
      return null;
    }
  };

  // Autenticação com Facebook usando WebBrowser diretamente
  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Iniciando autenticação com Facebook...');
      
      // Verificar se temos credenciais de produção configuradas
      const hasProductionCredentials = AUTH_CONFIG.FACEBOOK.APP_ID && 
        AUTH_CONFIG.FACEBOOK.APP_ID !== '1234567890123456' &&
        AUTH_CONFIG.FACEBOOK.APP_ID.length >= 15;
      
      if (hasProductionCredentials) {
        console.log('Usando autenticação real com Facebook OAuth');
        
        const redirectUri = AUTH_CONFIG.GOOGLE.REDIRECT_URI; // Usando o mesmo redirect URI
        const appId = AUTH_CONFIG.FACEBOOK.APP_ID;
        const scopes = AUTH_CONFIG.FACEBOOK.SCOPES.join(',');
        const state = generateRandomString();
        
        const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${state}&response_type=token`;
        
        const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
        
        if (result.type === 'success') {
          const { url } = result;
          const params = extractParamsFromUrl(url);
          const accessToken = params.access_token;
          
          if (!accessToken) {
            throw new Error('Token de acesso não encontrado na resposta');
          }
          
          // Obter informações do usuário
          const userInfoResponse = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
          );
          
          if (!userInfoResponse.ok) {
            throw new Error('Falha ao obter informações do usuário');
          }
          
          const facebookUserInfo = await userInfoResponse.json();
          
          const userData = {
            id: `facebook-${facebookUserInfo.id}`,
            email: facebookUserInfo.email || `${facebookUserInfo.id}@facebook.com`,
            displayName: facebookUserInfo.name,
            photoURL: facebookUserInfo.picture?.data?.url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(facebookUserInfo.name) + '&background=4267B2&color=fff',
            provider: 'facebook',
            loginMethod: 'facebook',
            accessToken
          };
          
          await AuthStorageService.saveUser(userData);
          await AuthStorageService.saveAuthToken(userData.accessToken, 'facebook', 3600);
          console.log('Dados do usuário Facebook salvos com AuthStorageService');
          
          setUserInfo(userData);
          setLoading(false);
          return userData;
        } else {
          throw new Error('Autenticação cancelada pelo usuário');
        }
      } else {
        // Fallback para desenvolvimento
        console.log('Usando autenticação simulada para Facebook (desenvolvimento)');
        
        // Dados simulados do usuário
        const userData = {
          id: 'facebook-987654321',
          email: 'usuario.teste@facebook.com',
          displayName: 'Usuário Facebook',
          photoURL: 'https://ui-avatars.com/api/?name=Usuario+Facebook&background=4267B2&color=fff',
          provider: 'facebook',
          loginMethod: 'facebook',
          accessToken: 'token-facebook-simulado-' + Date.now()
        };
        
        // Salvar usando o serviço de armazenamento
        await AuthStorageService.saveUser(userData);
        await AuthStorageService.saveAuthToken(userData.accessToken, 'facebook', 3600);
        console.log('Dados do usuário Facebook salvos com AuthStorageService');
        
        setUserInfo(userData);
        setLoading(false);
        return userData;
      }
      
      /* Código para implementação real com Facebook OAuth
      const redirectUri = AUTH_CONFIG.GOOGLE.REDIRECT_URI; // Usando o mesmo redirect URI
      const appId = AUTH_CONFIG.FACEBOOK.APP_ID;
      const scopes = AUTH_CONFIG.FACEBOOK.SCOPES.join(',');
      const state = generateRandomString();
      
      const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${state}&response_type=token`;
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success') {
        const { url } = result;
        // Extrair token da URL
        const accessToken = url.match(/access_token=([^&]*)/)[1];
        
        // Obter informações do usuário
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
        );

        const facebookUserInfo = await userInfoResponse.json();
        
        const userData = {
          id: `facebook-${facebookUserInfo.id}`,
          email: facebookUserInfo.email || `${facebookUserInfo.id}@facebook.com`,
          displayName: facebookUserInfo.name,
          photoURL: facebookUserInfo.picture?.data?.url,
          provider: 'facebook',
          accessToken
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUserInfo(userData);
        setLoading(false);
        return userData;
      }
      */
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
      
      // Usar o serviço de armazenamento para limpar todos os dados de autenticação
      await AuthStorageService.clearAuthData();
      
      setUserInfo(null);
      console.log('WebAuthService: Logout concluído com sucesso');
      setLoading(false);
      return true;
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
      setError(`Falha ao fazer logout: ${e.message}`);
      setLoading(false);
      return false;
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
