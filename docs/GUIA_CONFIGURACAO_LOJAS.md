# 🏪 Guia de Configuração das Lojas - JesusIA

Este guia explica como configurar os deep links para as lojas de aplicativos (Google Play Store e Apple App Store) para que os compartilhamentos direcionem os usuários corretamente.

## 📱 Como Funciona Atualmente

O sistema de deep links inteligentes detecta automaticamente a plataforma do usuário e direciona para:

- **Android**: Google Play Store
- **iOS**: Apple App Store  
- **Web/Desktop**: Site oficial

## ⚙️ Configuração Necessária

### 1. 🤖 Google Play Store (Android)

1. **Publique o app na Google Play Console**
2. **Obtenha o Package Name** (ex: `com.transmutebr.jesusia`)
3. **Atualize o arquivo de configuração**:

```javascript
// services/DeepLinkService.js
const STORE_CONFIG = {
  ANDROID: {
    PACKAGE_NAME: 'com.transmutebr.jesusia', // ← SEU PACKAGE NAME REAL
    STORE_URL: 'https://play.google.com/store/apps/details?id=com.transmutebr.jesusia',
    // ...
  }
};
```

### 2. 🍎 Apple App Store (iOS)

1. **Publique o app na App Store Connect**
2. **Obtenha o App ID** (número fornecido pela Apple)
3. **Atualize o arquivo de configuração**:

```javascript
// services/DeepLinkService.js
const STORE_CONFIG = {
  IOS: {
    APP_ID: '1234567890', // ← SEU APP ID REAL DA APPLE
    STORE_URL: 'https://apps.apple.com/app/id1234567890',
    // ...
  }
};
```

## 🔧 Passos para Configuração

### Passo 1: Publicar nas Lojas

1. **Google Play Store**:
   - Acesse [Google Play Console](https://play.google.com/console)
   - Crie um novo app ou use existente
   - Complete o processo de publicação
   - Anote o **Package Name** (ex: `com.transmutebr.jesusia`)

2. **Apple App Store**:
   - Acesse [App Store Connect](https://appstoreconnect.apple.com)
   - Crie um novo app ou use existente
   - Complete o processo de publicação
   - Anote o **App ID** (número de 10 dígitos)

### Passo 2: Atualizar Configuração

Edite o arquivo `services/DeepLinkService.js`:

```javascript
const STORE_CONFIG = {
  // Google Play Store
  ANDROID: {
    PACKAGE_NAME: 'SEU_PACKAGE_NAME_AQUI', // ← Substitua
    STORE_URL: 'https://play.google.com/store/apps/details?id=SEU_PACKAGE_NAME_AQUI',
    FALLBACK_URL: 'https://play.google.com/store/search?q=jesus.ia&c=apps'
  },
  
  // Apple App Store
  IOS: {
    APP_ID: 'SEU_APP_ID_AQUI', // ← Substitua
    STORE_URL: 'https://apps.apple.com/app/idSEU_APP_ID_AQUI',
    FALLBACK_URL: 'https://apps.apple.com/search?term=jesus.ia'
  },
  
  // Site oficial (já configurado)
  WEB: {
    MAIN_URL: 'https://transmutebr.com/jesusia',
    DOWNLOAD_URL: 'https://transmutebr.com/jesusia/download'
  }
};
```

### Passo 3: Testar Configuração

Execute o comando de validação:

```javascript
import { validateStoreConfig } from '../services/DeepLinkService';

const validation = validateStoreConfig();
console.log('Configuração válida:', validation.isValid);
if (!validation.isValid) {
  console.log('Problemas encontrados:', validation.issues);
}
```

## 🎯 Resultado Final

Após a configuração, quando os usuários compartilharem:

### 📱 **Mensagens/Devocionais**
```
"Jesus disse: 'Eu sou o caminho...'

💬 Compartilhado via Jesus.IA
Baixe na Google Play Store: https://play.google.com/store/apps/details?id=com.transmutebr.jesusia

📱 Disponível também em:
• Android: https://play.google.com/store/apps/details?id=com.transmutebr.jesusia
• iOS: https://apps.apple.com/app/id1234567890
• Web: https://transmutebr.com/jesusia

✨ Siga @transmutebr no TikTok"
```

### 🤖 **App Completo**
```
"🤖 Conheça o Jesus.IA!
Inteligência Artificial cristã para suas dúvidas bíblicas

Baixe na Google Play Store: https://play.google.com/store/apps/details?id=com.transmutebr.jesusia

📱 Disponível em todas as plataformas:
• Android: https://play.google.com/store/apps/details?id=com.transmutebr.jesusia
• iOS: https://apps.apple.com/app/id1234567890
• Web: https://transmutebr.com/jesusia

✨ Siga @transmutebr no TikTok"
```

## 🚀 Vantagens do Sistema

1. **Detecção Automática**: Identifica a plataforma do usuário
2. **Links Universais**: Funciona em qualquer dispositivo
3. **Fallbacks Inteligentes**: Se não encontrar o app, vai para busca
4. **Mensagens Personalizadas**: Diferentes formatos para cada tipo de conteúdo
5. **Fácil Manutenção**: Configuração centralizada em um arquivo

## ⚠️ Importante

- **Durante desenvolvimento**: Os links apontam para valores padrão
- **Em produção**: Substitua pelos valores reais das lojas
- **Teste sempre**: Verifique os links antes de publicar
- **Monitore**: Acompanhe se os usuários conseguem baixar o app

## 📊 Status Atual

| Plataforma | Status | Ação Necessária |
|------------|--------|-----------------|
| 🤖 Android | ⏳ Aguardando | Configurar Package Name real |
| 🍎 iOS | ⏳ Aguardando | Configurar App ID real |
| 🌐 Web | ✅ Configurado | Nenhuma |

---

**📝 Nota**: Este sistema está pronto para uso imediato. Basta atualizar as configurações quando o app estiver publicado nas lojas!
