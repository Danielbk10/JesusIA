import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento
const STORAGE_KEYS = {
  USER: 'user',
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  AUTH_EXPIRY: 'auth_expiry',
  LAST_LOGIN_PROVIDER: 'last_login_provider',
  AD_WATCH_TIMESTAMP: 'ad_watch_timestamp'
};

/**
 * Serviço para gerenciar o armazenamento de dados de autenticação
 */
export const AuthStorageService = {
  /**
   * Salva os dados do usuário no armazenamento local
   * @param {Object} userData - Dados do usuário
   */
  saveUser: async (userData) => {
    try {
      if (!userData) {
        console.error('AuthStorageService: Tentativa de salvar dados de usuário nulos');
        return;
      }
      
      console.log('AuthStorageService: Salvando dados do usuário', userData.displayName);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } catch (error) {
      console.error('AuthStorageService: Erro ao salvar dados do usuário', error);
      throw error;
    }
  },
  
  /**
   * Carrega os dados do usuário do armazenamento local
   * @returns {Object|null} Dados do usuário ou null se não existir
   */
  loadUser: async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('AuthStorageService: Erro ao carregar dados do usuário', error);
      return null;
    }
  },
  
  /**
   * Salva o token de autenticação
   * @param {string} token - Token de autenticação
   * @param {string} provider - Provedor de autenticação (google, facebook, email)
   * @param {number} expiryInSeconds - Tempo de expiração em segundos
   */
  saveAuthToken: async (token, provider, expiryInSeconds = 3600) => {
    try {
      if (!token) {
        console.error('AuthStorageService: Tentativa de salvar token nulo');
        return;
      }
      
      const expiryDate = new Date();
      expiryDate.setSeconds(expiryDate.getSeconds() + expiryInSeconds);
      
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_EXPIRY, expiryDate.toISOString());
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN_PROVIDER, provider);
      
      console.log(`AuthStorageService: Token salvo para ${provider}, expira em ${expiryInSeconds}s`);
    } catch (error) {
      console.error('AuthStorageService: Erro ao salvar token', error);
      throw error;
    }
  },
  
  /**
   * Verifica se o token de autenticação é válido (não expirado)
   * @returns {boolean} true se o token for válido, false caso contrário
   */
  isAuthTokenValid: async () => {
    try {
      const expiryStr = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_EXPIRY);
      if (!expiryStr) return false;
      
      const expiry = new Date(expiryStr);
      const now = new Date();
      
      return expiry > now;
    } catch (error) {
      console.error('AuthStorageService: Erro ao verificar validade do token', error);
      return false;
    }
  },
  
  /**
   * Salva o timestamp da última vez que o usuário assistiu a um anúncio
   * @returns {Promise<void>}
   */
  saveAdWatchTimestamp: async () => {
    try {
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEYS.AD_WATCH_TIMESTAMP, timestamp);
      console.log('AuthStorageService: Timestamp de anúncio salvo', timestamp);
    } catch (error) {
      console.error('AuthStorageService: Erro ao salvar timestamp de anúncio', error);
      throw error;
    }
  },
  
  /**
   * Verifica se o usuário pode assistir a um novo anúncio
   * @returns {Promise<boolean>} true - sempre permite assistir anúncios
   */
  canWatchAd: async () => {
    // Sempre permitir assistir anúncios para ganhar créditos
    return true;
  },
  
  /**
   * Limpa todos os dados de autenticação
   * @returns {Promise<void>}
   */
  clearAuthData: async () => {
    try {
      const keys = [
        STORAGE_KEYS.USER,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.AUTH_EXPIRY,
        STORAGE_KEYS.LAST_LOGIN_PROVIDER
      ];
      
      await AsyncStorage.multiRemove(keys);
      console.log('AuthStorageService: Dados de autenticação removidos');
    } catch (error) {
      console.error('AuthStorageService: Erro ao limpar dados de autenticação', error);
      throw error;
    }
  }
};

export default AuthStorageService;
