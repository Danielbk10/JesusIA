import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { useUser } from '../context/UserContext';
import { FONTS } from '../config/fontConfig';
import { COLORS } from '../config/colorConfig';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

export default function LoginScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const { 
    user, 
    loginWithGoogle, 
    loginWithFacebook, 
    loading: userContextLoading,
    updateUser
  } = useUser();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      console.log('LoginScreen: Usuário detectado, redirecionando...', user.displayName);
      // Pequeno delay para garantir que a animação de carregamento seja visível
      const timer = setTimeout(() => {
        onLoginSuccess();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, onLoginSuccess]);

  const handleAuth = async () => {
    try {
      // Validação básica
      if (!email.trim()) {
        Alert.alert('Erro', 'Por favor, insira seu email');
        return;
      }
      
      if (!password.trim() || password.length < 6) {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
        return;
      }
      
      if (!isLogin && !name.trim()) {
        Alert.alert('Erro', 'Por favor, insira seu nome');
        return;
      }

      // Iniciar carregamento
      setAuthLoading(true);
      
      // Simulação de autenticação com email/senha
      // Em um app real, você conectaria com Firebase, Auth0, etc.
      console.log(`LoginScreen: Iniciando login com email para: ${email}`);
      
      // Simular tempo de resposta da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: `email-${Date.now()}`,
        email: email,
        displayName: isLogin ? email.split('@')[0] : name,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(isLogin ? email.split('@')[0] : name)}&background=random&color=fff`,
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      
      console.log('LoginScreen: Login com email bem-sucedido, atualizando usuário');
      await updateUser(userData);
      onLoginSuccess();
    } catch (error) {
      console.error('LoginScreen: Erro ao fazer login com email:', error);
      Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      console.log('LoginScreen: Iniciando login com Google...');
      await loginWithGoogle();
      console.log('LoginScreen: Login com Google concluído com sucesso');
      // O redirecionamento para a tela principal é tratado no useEffect que monitora o usuário
    } catch (error) {
      console.error('LoginScreen: Erro ao fazer login com Google:', error);
      Alert.alert('Erro', 'Não foi possível fazer login com Google. Tente novamente.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleMetaLogin = async () => {
    try {
      setFacebookLoading(true);
      console.log('LoginScreen: Iniciando login com Facebook...');
      await loginWithFacebook();
      console.log('LoginScreen: Login com Facebook concluído com sucesso');
      // O redirecionamento para a tela principal é tratado no useEffect que monitora o usuário
    } catch (error) {
      console.error('LoginScreen: Erro ao fazer login com Facebook:', error);
      Alert.alert('Erro', 'Não foi possível fazer login com Facebook. Tente novamente.');
    } finally {
      setFacebookLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/tree_background.png')}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/jesus-logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Representação consciência de jesus segundo a bíblia</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>{isLogin ? 'Login' : 'Criar Conta'}</Text>
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity 
            style={[styles.authButton, authLoading && styles.authButtonDisabled]}
            onPress={handleAuth}
            disabled={authLoading}
          >
            {authLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.authButtonText}>
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setIsLogin(!isLogin)}
            style={styles.switchButton}
          >
            <Text style={styles.switchButtonText}>
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Ou continue com</Text>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
              onPress={handleGoogleLogin}
              disabled={googleLoading || userContextLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.socialButtonContent}>
                  <AntDesign name="google" size={20} color="#fff" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#4267B2' }]}
              onPress={handleMetaLogin}
              disabled={facebookLoading || userContextLoading}
            >
              {facebookLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.socialButtonContent}>
                  <FontAwesome name="facebook" size={20} color="#fff" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  authButtonDisabled: {
    backgroundColor: COLORS.PRIMARY_DARK || '#444',
    opacity: 0.7,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 0.1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 200,
    height: 80,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: FONTS.SERIF,
  },
  formContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: FONTS.SERIF,
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.SERIF,
  },
  authButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.SERIF,
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontFamily: FONTS.SERIF,
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  socialText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
    fontFamily: FONTS.SERIF,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  socialButton: {
    borderRadius: 8,
    padding: 12,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.SERIF,
    marginLeft: 8,
  },
});
