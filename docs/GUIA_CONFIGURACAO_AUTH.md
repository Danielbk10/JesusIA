# 🔐 Guia de Configuração de Autenticação - JesusIA

## 📋 VISÃO GERAL

Este guia te ajudará a configurar a autenticação real com Google e Facebook para o aplicativo JesusIA. Siga os passos na ordem apresentada.

## 🎯 ORDEM DE IMPLEMENTAÇÃO

1. **Configure Google Cloud Console** (30-45 min)
2. **Configure Meta for Developers** (20-30 min)
3. **Atualize as credenciais no código** (5 min)
4. **Teste a autenticação** (10 min)

---

## 🔵 PARTE 1: CONFIGURAÇÃO DO GOOGLE CLOUD CONSOLE

### Passo 1: Acesse o Console
- Vá para: https://console.cloud.google.com/
- Faça login com sua conta Google

### Passo 2: Crie/Selecione Projeto
- Clique em "Selecionar projeto" no topo
- Clique em "NOVO PROJETO"
- Nome: `JesusIA`
- Clique em "CRIAR"

### Passo 3: Ative as APIs Necessárias
- No menu lateral, vá para "APIs e Serviços" > "Biblioteca"
- Procure e ative:
  - **Google+ API** (se disponível)
  - **People API** (recomendado)
  - **Google OAuth2 API**

### Passo 4: Configure a Tela de Consentimento OAuth
- Vá para "APIs e Serviços" > "Tela de consentimento OAuth"
- Selecione **"Externo"** como tipo de usuário
- Clique em "CRIAR"

**Preencha as informações:**
- **Nome do aplicativo**: `JesusIA`
- **Email de suporte do usuário**: seu email
- **Logo do aplicativo**: (opcional, pode adicionar depois)
- **Domínio do aplicativo**: deixe em branco por enquanto
- **Domínios autorizados**: deixe em branco
- **Email do desenvolvedor**: seu email

**Na seção "Escopos":**
- Clique em "ADICIONAR OU REMOVER ESCOPOS"
- Adicione:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
- Clique em "ATUALIZAR"

**Na seção "Usuários de teste":**
- Adicione seu email para poder testar
- Clique em "ADICIONAR USUÁRIOS"

### Passo 5: Crie Credenciais OAuth 2.0
- Vá para "APIs e Serviços" > "Credenciais"
- Clique em "+ CRIAR CREDENCIAIS"
- Selecione "ID do cliente OAuth 2.0"

**Configure:**
- **Tipo de aplicativo**: `Aplicativo da Web`
- **Nome**: `JesusIA Web Client`

**URIs de redirecionamento autorizados:**
```
https://auth.expo.io/@danielbk10/jesusia
```

**⚠️ IMPORTANTE:** Substitua `danielbk10` pelo seu username do Expo!

- Clique em "CRIAR"
- **COPIE O CLIENT ID** que aparece (formato: `123456-abc.apps.googleusercontent.com`)

---

## 🔵 PARTE 2: CONFIGURAÇÃO DO META FOR DEVELOPERS

### Passo 1: Acesse o Console
- Vá para: https://developers.facebook.com/
- Faça login com sua conta Facebook/Meta

### Passo 2: Crie um Novo App
- Clique em "Meus Apps" > "Criar App"
- Selecione **"Consumidor"**
- Clique em "Avançar"

**Preencha:**
- **Nome do app**: `JesusIA`
- **Email de contato**: seu email
- Clique em "Criar App"

### Passo 3: Configure Facebook Login
- No painel do app, encontre "Facebook Login"
- Clique em "Configurar"

**Configurações básicas:**
- **URIs de redirecionamento OAuth válidos:**
```
https://auth.expo.io/@danielbk10/jesusia
```

**⚠️ IMPORTANTE:** Substitua `danielbk10` pelo seu username do Expo!

- **Domínios válidos do OAuth:**
```
auth.expo.io
```

- Salve as alterações

### Passo 4: Obtenha o App ID
- Vá para "Configurações" > "Básico"
- **COPIE O APP ID** (número de 15-16 dígitos)

---

## 🔧 PARTE 3: ATUALIZE AS CREDENCIAIS NO CÓDIGO

Edite o arquivo `config/authConfig.js`:

```javascript
export const AUTH_CONFIG = {
  GOOGLE: {
    // Cole seu CLIENT ID do Google aqui:
    CLIENT_ID: 'SEU_CLIENT_ID_GOOGLE_AQUI.apps.googleusercontent.com',
    
    // Substitua 'danielbk10' pelo seu username do Expo:
    REDIRECT_URI: 'https://auth.expo.io/@SEU_USERNAME_EXPO/jesusia',
    
    // Mantenha estes valores:
    WEB_CLIENT_ID: 'SEU_CLIENT_ID_GOOGLE_AQUI.apps.googleusercontent.com',
    SCOPES: ['profile', 'email']
  },
  
  FACEBOOK: {
    // Cole seu APP ID do Facebook aqui:
    APP_ID: 'SEU_APP_ID_FACEBOOK_AQUI',
    
    // Mantenha estes valores:
    SCOPES: ['public_profile', 'email']
  },
};
```

---

## 🧪 PARTE 4: TESTE A AUTENTICAÇÃO

### Teste Local
1. Execute o app: `npx expo start`
2. Teste o login com Google
3. Teste o login com Facebook
4. Verifique se os dados do usuário são salvos corretamente

### Logs para Verificar
- `"Usando autenticação real com Google OAuth"` (em vez de simulada)
- `"Usando autenticação real com Facebook OAuth"` (em vez de simulada)
- Dados reais do usuário nos logs

---

## 🚀 PARTE 5: PREPARAÇÃO PARA PRODUÇÃO

### Para Google Play Store:
1. **Gere keystore de produção**
2. **Obtenha SHA-1 fingerprint**
3. **Adicione fingerprint no Google Cloud Console**
4. **Configure credenciais Android específicas**

### Para App Store:
1. **Configure Bundle ID no Expo**
2. **Adicione iOS Client ID no Google Cloud Console**
3. **Configure URL Schemes no iOS**

---

## 📝 CHECKLIST FINAL

### Google:
- [ ] Projeto criado no Google Cloud Console
- [ ] APIs ativadas (People API, OAuth2)
- [ ] Tela de consentimento configurada
- [ ] Credenciais OAuth 2.0 criadas
- [ ] URI de redirecionamento adicionado
- [ ] CLIENT_ID copiado e colado no código

### Facebook:
- [ ] App criado no Meta for Developers
- [ ] Facebook Login configurado
- [ ] URI de redirecionamento adicionado
- [ ] Domínio OAuth válido adicionado
- [ ] APP_ID copiado e colado no código

### Código:
- [ ] `authConfig.js` atualizado com credenciais reais
- [ ] REDIRECT_URI atualizado com seu username do Expo
- [ ] Testado localmente com sucesso

---

## 🆘 TROUBLESHOOTING

### Erro: "redirect_uri_mismatch"
- Verifique se o URI no console é exatamente igual ao do código
- Certifique-se de usar seu username correto do Expo

### Erro: "invalid_client"
- Verifique se o CLIENT_ID está correto
- Certifique-se de que as APIs estão ativadas

### Erro: "access_denied"
- Adicione seu email como usuário de teste no Google
- Verifique se o app Facebook está em modo de desenvolvimento

### Autenticação ainda simulada:
- Verifique se as credenciais não são os valores padrão
- Confirme que o CLIENT_ID termina com `.apps.googleusercontent.com`
- Confirme que o APP_ID tem pelo menos 15 dígitos

---

## 📞 PRÓXIMOS PASSOS

Após configurar tudo:
1. Teste extensivamente em desenvolvimento
2. Configure credenciais específicas para produção (Android/iOS)
3. Submeta para revisão nos consoles (se necessário)
4. Faça deploy para as lojas

**Tempo estimado total: 1-2 horas**
