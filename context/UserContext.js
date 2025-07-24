import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
// Importando os serviços de autenticação
import { useWebAuth } from '../services/WebAuthService';
import AuthStorageService from '../services/AuthStorageService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Integração com serviço de autenticação web
  const { 
    userInfo, 
    loading: authLoading, 
    error: authError,
    signInWithGoogle, 
    signInWithFacebook,
    signOut: authSignOut
  } = useWebAuth();

  // Monitorar mudanças nos dados de autenticação
  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (authError) {
      Alert.alert('Erro de Autenticação', authError);
    }
  }, [authError]);

  // Carregar usuário do armazenamento local ao iniciar
  useEffect(() => {
    loadUser();
  }, []);

  const updateUser = async (userData) => {
    try {
      setLoading(true);
      console.log('UserContext: Atualizando dados do usuário', userData?.displayName);
      await AuthStorageService.saveUser(userData);
      
      // Se houver um token de acesso, salvá-lo também
      if (userData?.accessToken) {
        await AuthStorageService.saveAuthToken(
          userData.accessToken,
          userData.provider || 'email',
          3600 // 1 hora de expiração padrão
        );
      }
      
      setUser(userData);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      setLoading(false);
      return false;
    }
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      console.log('UserContext: Carregando dados do usuário');
      
      // Verificar se o token de autenticação é válido
      const isTokenValid = await AuthStorageService.isAuthTokenValid();
      
      if (!isTokenValid) {
        console.log('UserContext: Token expirado ou não encontrado');
        await AuthStorageService.clearAuthData();
        setUser(null);
        setLoading(false);
        return null;
      }
      
      // Carregar dados do usuário
      const userData = await AuthStorageService.loadUser();
      
      if (userData) {
        // Carregar foto de perfil salva localmente (apenas para usuários não-OAuth)
        if (userData.loginMethod !== 'google' && userData.loginMethod !== 'facebook') {
          try {
            const savedProfileImage = await AsyncStorage.getItem(`profileImage_${userData.id}`);
            if (savedProfileImage && !userData.photoURL) {
              userData.photoURL = savedProfileImage;
            }
          } catch (error) {
            console.log('UserContext: Erro ao carregar foto de perfil local:', error);
          }
        }
        
        console.log('UserContext: Usuário carregado com sucesso', userData.displayName);
        setUser(userData);
        setLoading(false);
        return userData;
      } else {
        console.log('UserContext: Nenhum usuário encontrado');
        setUser(null);
        setLoading(false);
        return null;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setUser(null);
      setLoading(false);
      return null;
    }
  };

  // Funções de login
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      console.log('UserContext: Iniciando login com Google...');
      const result = await signInWithGoogle();
      console.log('UserContext: Resultado do login com Google:', result ? 'Sucesso' : 'Falha');
      
      if (result) {
        // Login bem-sucedido, atualizar o estado do usuário diretamente
        console.log('UserContext: Atualizando estado do usuário após login com Google');
        setUser(result);
        await AsyncStorage.setItem('user', JSON.stringify(result));
        console.log('UserContext: Usuário salvo no AsyncStorage');
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      Alert.alert('Erro', 'Falha ao fazer login com Google: ' + (error.message || 'Erro desconhecido'));
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setLoading(true);
    try {
      const result = await signInWithFacebook();
      if (result) {
        // Login bem-sucedido, userInfo será atualizado via useEffect
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao fazer login com Facebook:', error);
      Alert.alert('Erro', 'Falha ao fazer login com Facebook');
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setLoading(true);
    try {
      console.log('UserContext: Iniciando processo de logout');
      
      // Chamar o logout do serviço de autenticação
      const authSignOutResult = await authSignOut();
      console.log('UserContext: authSignOut concluído com resultado:', authSignOutResult);
      
      // Usar o AuthStorageService para limpar todos os dados de autenticação
      await AuthStorageService.clearAuthData();
      console.log('UserContext: Dados de autenticação limpos');
      
      // Definir o estado do usuário como null para acionar a renderização condicional
      setUser(null);
      console.log('UserContext: Estado do usuário definido como null');
      
      // Limpar outros dados relacionados ao usuário
      await AsyncStorage.multiRemove(['current_chat_id', 'chat_history']);
      console.log('UserContext: Dados de chat limpos');
      
      setLoading(false);
      return true; // Indicar que o logout foi bem-sucedido
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Falha ao fazer logout');
      setLoading(false);
      return false; // Indicar que o logout falhou
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        updateUser, 
        loadUser, 
        signOut: logout,
        loginWithGoogle,
        loginWithFacebook,
        loading: loading || authLoading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
