// Configurações para autenticação com provedores externos

export const AUTH_CONFIG = {
  // Credenciais do Google OAuth
  // Obtenha em: https://console.cloud.google.com/
  GOOGLE: {
    // Cole seu ID de cliente OAuth do Google Cloud Console abaixo
    // Formato: 123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
    CLIENT_ID: '322074024672-op9ihh8l3f99b0qdk869gg462f0j562p.apps.googleusercontent.com',
    
    // Para desenvolvimento com Expo, configure estes valores quando estiver pronto para produção
    IOS_CLIENT_ID: '', 
    ANDROID_CLIENT_ID: '',
    
    // Mesmo valor que CLIENT_ID
    WEB_CLIENT_ID: '322074024672-op9ihh8l3f99b0qdk869gg462f0j562p.apps.googleusercontent.com',
    
    // URI de redirecionamento que deve ser configurado no Google Cloud Console
    REDIRECT_URI: 'https://auth.expo.io/@danielbk10/jesusia',
    
    // Escopos de permissão necessários
    SCOPES: ['profile', 'email']
  },
  
  // Credenciais do Facebook OAuth
  // Obtenha em: https://developers.facebook.com/
  FACEBOOK: {
    APP_ID: '1234567890123456', // Substitua pelo seu App ID real quando estiver pronto
    
    // Escopos de permissão necessários
    SCOPES: ['public_profile', 'email']
  },
};

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
