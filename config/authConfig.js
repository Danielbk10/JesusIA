// 🔐 Configurações de Autenticação - JesusIA
// Para configurar para produção, siga o guia em: docs/GUIA_CONFIGURACAO_AUTH.md

export const AUTH_CONFIG = {
  // 🔵 GOOGLE OAUTH CONFIGURATION
  // Obtenha as credenciais em: https://console.cloud.google.com/
  GOOGLE: {
    // ⚠️ SUBSTITUA PELA SUA CREDENCIAL REAL DO GOOGLE CLOUD CONSOLE
    // Formato: 123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
    CLIENT_ID: 'SEU_CLIENT_ID_GOOGLE_AQUI.apps.googleusercontent.com',
    
    // Para apps nativos (configure quando for fazer build para produção)
    IOS_CLIENT_ID: '', 
    ANDROID_CLIENT_ID: '',
    
    // Mesmo valor que CLIENT_ID
    WEB_CLIENT_ID: 'SEU_CLIENT_ID_GOOGLE_AQUI.apps.googleusercontent.com',
    
    // ⚠️ SUBSTITUA 'danielbk10' PELO SEU USERNAME DO EXPO
    REDIRECT_URI: 'https://auth.expo.io/@SEU_USERNAME_EXPO/jesusia',
    
    // Permissões solicitadas (não altere)
    SCOPES: ['profile', 'email']
  },
  
  // 🔵 FACEBOOK OAUTH CONFIGURATION  
  // Obtenha as credenciais em: https://developers.facebook.com/
  FACEBOOK: {
    // ⚠️ SUBSTITUA PELO SEU APP ID REAL DO META FOR DEVELOPERS
    // Formato: 1234567890123456 (15-16 dígitos)
    APP_ID: 'SEU_APP_ID_FACEBOOK_AQUI',
    
    // Permissões solicitadas (não altere)
    SCOPES: ['public_profile', 'email']
  },
};

// 📝 STATUS ATUAL:
// ✅ Código implementado com fallback para desenvolvimento
// ❌ Credenciais de produção não configuradas
// 
// 🚀 PARA ATIVAR AUTENTICAÇÃO REAL:
// 1. Siga o guia completo em: docs/GUIA_CONFIGURACAO_AUTH.md
// 2. Substitua 'SEU_CLIENT_ID_GOOGLE_AQUI' pela credencial real
// 3. Substitua 'SEU_APP_ID_FACEBOOK_AQUI' pela credencial real  
// 4. Substitua 'SEU_USERNAME_EXPO' pelo seu username real
// 5. Teste a autenticação no app

// Instruções para configurar as credenciais:

/* 
CONFIGURAÇÃO DO GOOGLE (PASSO A PASSO DETALHADO):

1. Acesse https://console.cloud.google.com/

2. Crie um novo projeto (ou use o que você já criou)

3. Configure a tela de consentimento OAuth:
   - Vá para "APIs e Serviços" > "Tela de consentimento OAuth"
   - Selecione "Externo" como tipo de usuário
   - Preencha as informações básicas (nome do app, email, etc.)
   - Adicione os escopos ".../auth/userinfo.email" e ".../auth/userinfo.profile"
   - Na seção "Usuários de teste", adicione seu email para poder testar o app

4. Crie as credenciais OAuth:
   - Vá para "APIs e Serviços" > "Credenciais"
   - Clique em "Criar Credenciais" > "ID do cliente OAuth"
   - Selecione "Aplicativo Web"
   - Dê um nome como "JesusIA Web Client"
   - Em "URIs de redirecionamento autorizados", adicione EXATAMENTE:
     https://auth.expo.io/@danielbk10/jesusia

5. Copie o ID do cliente que será exibido e cole nos campos CLIENT_ID e WEB_CLIENT_ID acima

6. IMPORTANTE: Enquanto o app estiver em modo de teste, apenas usuários adicionados como "Usuários de teste" 
   na tela de consentimento OAuth poderão fazer login. Certifique-se de adicionar seu email lá.

6. Para testar no Expo Go:
   - Certifique-se de que o esquema do app está configurado como "jesusia" no app.json
   - Execute o app com "npx expo start" usando CMD (não PowerShell)
   - Escaneie o QR code com o Expo Go no seu dispositivo

CONFIGURAÇÃO DO FACEBOOK:
1. Acesse https://developers.facebook.com/
2. Crie um novo aplicativo
3. Adicione o produto "Login do Facebook" ao seu aplicativo
4. Configure as plataformas (Android, iOS, Web)
5. Adicione os URIs de redirecionamento apropriados
6. Copie o App ID e substitua no campo acima
*/
