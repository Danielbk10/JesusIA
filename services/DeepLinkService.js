import { Platform } from 'react-native';

/**
 * 🔗 Serviço de Deep Links Inteligentes - JesusIA
 * 
 * Gera links que direcionam automaticamente para:
 * - Google Play Store (Android)
 * - Apple App Store (iOS)
 * - Site oficial (Web/Desktop)
 */

// 📱 CONFIGURAÇÕES DAS LOJAS
const STORE_CONFIG = {
  // Google Play Store
  ANDROID: {
    // Substitua pelo seu package name real quando publicar
    PACKAGE_NAME: 'com.transmutebr.jesusia',
    STORE_URL: 'https://play.google.com/store/apps/details?id=com.transmutebr.jesusia',
    FALLBACK_URL: 'https://play.google.com/store/search?q=jesus.ia&c=apps'
  },
  
  // Apple App Store
  IOS: {
    // Substitua pelo seu App ID real quando publicar na App Store
    APP_ID: '123456789', // Exemplo: 123456789
    STORE_URL: 'https://apps.apple.com/app/id123456789',
    FALLBACK_URL: 'https://apps.apple.com/search?term=jesus.ia'
  },
  
  // Site oficial (fallback para web/desktop)
  WEB: {
    MAIN_URL: 'https://transmutebr.com/jesusia',
    DOWNLOAD_URL: 'https://transmutebr.com/jesusia/download'
  }
};

/**
 * 🎯 Gera o link inteligente baseado na plataforma
 * @param {string} content - Conteúdo sendo compartilhado (opcional)
 * @param {string} type - Tipo de compartilhamento ('message', 'devotional', 'app')
 * @returns {object} - Objeto com URLs e mensagem formatada
 */
export const generateSmartLink = (content = '', type = 'app') => {
  const isAndroid = Platform.OS === 'android';
  const isIOS = Platform.OS === 'ios';
  
  // 📱 Determinar URL principal baseada na plataforma
  let primaryUrl;
  let storeText;
  
  if (isAndroid) {
    primaryUrl = STORE_CONFIG.ANDROID.STORE_URL;
    storeText = 'Baixe na Google Play Store';
  } else if (isIOS) {
    primaryUrl = STORE_CONFIG.IOS.STORE_URL;
    storeText = 'Baixe na App Store';
  } else {
    primaryUrl = STORE_CONFIG.WEB.MAIN_URL;
    storeText = 'Acesse o site oficial';
  }
  
  // 🔗 Gerar URLs universais (funcionam em qualquer dispositivo)
  const universalLinks = {
    android: STORE_CONFIG.ANDROID.STORE_URL,
    ios: STORE_CONFIG.IOS.STORE_URL,
    web: STORE_CONFIG.WEB.MAIN_URL
  };
  
  // 📝 Gerar mensagem formatada baseada no tipo
  let shareMessage;
  
  switch (type) {
    case 'message':
      shareMessage = `${content}

💬 Compartilhado via Jesus.IA
${storeText}: ${primaryUrl}

📱 Disponível também em:
• Android: ${universalLinks.android}
• iOS: ${universalLinks.ios}
• Web: ${universalLinks.web}

✨ Siga @transmutebr no TikTok`;
      break;
      
    case 'devotional':
      shareMessage = `🙏 ${content}

📖 Devocional compartilhado via Jesus.IA
${storeText}: ${primaryUrl}

📱 Baixe o app completo:
• Android: ${universalLinks.android}
• iOS: ${universalLinks.ios}
• Web: ${universalLinks.web}

✨ Siga @transmutebr no TikTok`;
      break;
      
    case 'app':
    default:
      shareMessage = `🤖 Conheça o Jesus.IA!
Inteligência Artificial cristã para suas dúvidas bíblicas

${storeText}: ${primaryUrl}

📱 Disponível em todas as plataformas:
• Android: ${universalLinks.android}
• iOS: ${universalLinks.ios}
• Web: ${universalLinks.web}

✨ Siga @transmutebr no TikTok`;
      break;
  }
  
  return {
    primaryUrl,
    universalLinks,
    shareMessage,
    storeText,
    platform: Platform.OS
  };
};

/**
 * 🔄 Gera link universal que funciona em qualquer dispositivo
 * Detecta automaticamente a plataforma do usuário que clica
 */
export const generateUniversalLink = () => {
  // Este seria um serviço web que detecta o user-agent e redireciona
  // Por enquanto, retornamos o link do site que pode ter JavaScript para detectar
  return STORE_CONFIG.WEB.DOWNLOAD_URL;
};

/**
 * 📊 Obter configurações das lojas (para uso em configurações)
 */
export const getStoreConfig = () => STORE_CONFIG;

/**
 * ✅ Validar se as configurações das lojas estão corretas
 */
export const validateStoreConfig = () => {
  const issues = [];
  
  // Verificar Android
  if (STORE_CONFIG.ANDROID.PACKAGE_NAME === 'com.transmutebr.jesusia') {
    issues.push('⚠️ Android: Package name ainda é o padrão - atualize com o real');
  }
  
  // Verificar iOS
  if (STORE_CONFIG.IOS.APP_ID === '123456789') {
    issues.push('⚠️ iOS: App ID ainda é o padrão - atualize com o real da App Store');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// 🚀 EXEMPLO DE USO:
/*
import { generateSmartLink } from '../services/DeepLinkService';

// Para compartilhar uma mensagem
const messageLink = generateSmartLink('Jesus disse: "Eu sou o caminho..."', 'message');

// Para compartilhar um devocional
const devotionalLink = generateSmartLink('Reflexão sobre o amor de Deus...', 'devotional');

// Para compartilhar o app
const appLink = generateSmartLink('', 'app');

// Usar no Share.share()
await Share.share({
  message: messageLink.shareMessage,
  title: 'Jesus.IA',
  url: messageLink.primaryUrl // iOS usa este campo
});
*/
