import React, { useState } from 'react';
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
  ImageBackground
} from 'react-native';
import { useUser } from '../context/UserContext';
import { FONTS } from '../config/fontConfig';

export default function LoginScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { updateUser } = useUser();

  const handleAuth = () => {
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

    // Simulação de autenticação
    // Em um app real, você conectaria com Firebase, Auth0, etc.
    setTimeout(() => {
      const userData = {
        id: '123456',
        email: email,
        displayName: isLogin ? 'Usuário' : name,
        photoURL: null,
      };
      
      updateUser(userData);
      onLoginSuccess();
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // Simulação de login com Google
    setTimeout(() => {
      const userData = {
        id: 'google-123456',
        email: 'usuario@gmail.com',
        displayName: 'Usuário Google',
        photoURL: 'https://ui-avatars.com/api/?name=Usuario+Google&background=random',
      };
      
      updateUser(userData);
      onLoginSuccess();
    }, 1000);
  };

  const handleMetaLogin = () => {
    // Simulação de login com Meta
    setTimeout(() => {
      const userData = {
        id: 'meta-123456',
        email: 'usuario@facebook.com',
        displayName: 'Usuário Facebook',
        photoURL: 'https://ui-avatars.com/api/?name=Usuario+Facebook&background=random',
      };
      
      updateUser(userData);
      onLoginSuccess();
    }, 1000);
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
            style={styles.authButton}
            onPress={handleAuth}
          >
            <Text style={styles.authButtonText}>
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </Text>
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
              style={styles.socialButton}
              onPress={handleGoogleLogin}
            >
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleMetaLogin}
            >
              <Text style={styles.socialButtonText}>Meta</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#00a884',
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
    color: '#00a884',
    fontSize: 14,
    fontFamily: FONTS.SERIF,
  },
  socialContainer: {
    alignItems: 'center',
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
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
    width: '45%',
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.SERIF,
  },
});
