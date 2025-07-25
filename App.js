import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert, Platform, StatusBar as RNStatusBar, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProvider, useUser } from './context/UserContext';
import { CreditsProvider } from './context/CreditsContext';
import { DevotionalsProvider } from './context/DevotionalsContext';
import { SpeechProvider } from './context/SpeechContext';
import ChatScreen from './components/ChatScreen';
import SubscriptionPlans from './components/SubscriptionPlans';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import MenuDrawer from './components/MenuDrawer';
import LoginScreen from './components/LoginScreen';
import SideMenu from './components/SideMenu';
import BottomBar from './components/BottomBar';
import QRCodeScreen from './components/QRCodeScreen';
import OnboardingScreen from './components/OnboardingScreen';

// Componente interno que usa o contexto de usuário
function AppContent() {
  const [plansModalVisible, setPlansModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [qrCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedDevotional, setSelectedDevotional] = useState(null);
  const [devotionalModalVisible, setDevotionalModalVisible] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(null); // null = carregando, true = mostrar, false = não mostrar
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  
  // Usar o contexto de usuário
  const { user, signOut } = useUser();
  const isLoggedIn = !!user;
  
  // Verificar se o onboarding já foi completado
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
        setShowOnboarding(onboardingCompleted !== 'true');
        setIsCheckingOnboarding(false);
      } catch (error) {
        console.error('Erro ao verificar status do onboarding:', error);
        setShowOnboarding(true); // Em caso de erro, mostrar onboarding
        setIsCheckingOnboarding(false);
      }
    };
    
    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Iniciando processo de logout...');
              await signOut();
              console.log('Logout realizado com sucesso, fechando modal de perfil');
              setProfileModalVisible(false);
              
              // Forçar uma atualização do estado para garantir a navegação para a tela de login
              console.log('Estado do usuário após logout:', user ? 'ainda logado' : 'deslogado');
            } catch (error) {
              console.error('Erro durante o processo de logout:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao sair da conta. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
  };
  
  const handleViewDevotional = (devotional) => {
    setSelectedDevotional(devotional);
    setDevotionalModalVisible(true);
  };
  
  // Função para animar a abertura do menu lateral
  useEffect(() => {
    if (sideMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [sideMenuVisible]);

  // Se ainda está verificando o status do onboarding, não renderiza nada
  if (isCheckingOnboarding) {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarSpace} />
        <StatusBar style="light" />
      </View>
    );
  }
  
  // Se deve mostrar onboarding, renderiza o OnboardingScreen
  if (showOnboarding) {
    return (
      <View style={styles.container}>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusBarSpace} />
      <StatusBar style="light" />
      
      {!isLoggedIn ? (
        <LoginScreen 
          onLoginSuccess={() => {
            console.log('Login bem-sucedido! Navegando para a tela de chat...');
            // Não precisamos fazer nada aqui, pois o estado do usuário no UserContext
            // vai acionar a renderização condicional automaticamente
          }} 
        />
      ) : (
        <>
          <View style={styles.mainContainer}>
            <Header 
              onPressProfile={() => setProfileModalVisible(true)} 
              onPressMenu={() => setSideMenuVisible(true)}
            />
            
            <ChatScreen 
              currentChat={currentChat}
              onOpenPlans={() => setPlansModalVisible(true)}
            />
            
            <BottomBar 
              onOpenPlans={() => setPlansModalVisible(true)}
            />
            
            {/* Modal de planos de assinatura */}
            <Modal
              animationType="slide"
              transparent={false}
              visible={plansModalVisible}
              onRequestClose={() => setPlansModalVisible(false)}
            >
              <SubscriptionPlans onClose={() => setPlansModalVisible(false)} />
            </Modal>
            
            {/* Modal de perfil do usuário */}
            <Modal
              animationType="slide"
              transparent={false}
              visible={profileModalVisible}
              onRequestClose={() => setProfileModalVisible(false)}
            >
              <ProfileModal 
                onClose={() => setProfileModalVisible(false)} 
                onLogout={handleLogout}
              />
            </Modal>
            
            {/* Menu lateral (drawer) */}
            <Modal
              animationType="none"
              transparent={true}
              visible={sideMenuVisible}
              onRequestClose={() => setSideMenuVisible(false)}
            >
              <View style={styles.sideMenuOverlay}>
                <Animated.View style={[styles.sideMenuWrapper, {
                  transform: [{ translateX: slideAnim }]
                }]}>
                  <SideMenu 
                    onClose={() => setSideMenuVisible(false)}
                    onSelectChat={handleSelectChat}
                    onViewDevotional={handleViewDevotional}
                    onOpenPlans={() => {
                      setSideMenuVisible(false);
                      setPlansModalVisible(true);
                    }}
                  />
                </Animated.View>
                <TouchableOpacity 
                  style={styles.sideMenuBackdrop}
                  activeOpacity={1}
                  onPress={() => setSideMenuVisible(false)}
                />
              </View>
            </Modal>
            
            {/* Menu de opções */}
            <Modal
              animationType="slide"
              transparent={false}
              visible={menuVisible}
              onRequestClose={() => setMenuVisible(false)}
            >
              <MenuDrawer 
                onClose={() => setMenuVisible(false)}
              />
            </Modal>
            
            {/* Modal para QR Code */}
            <Modal
              animationType="slide"
              transparent={false}
              visible={qrCodeModalVisible}
              onRequestClose={() => setQRCodeModalVisible(false)}
            >
              <QRCodeScreen 
                onClose={() => setQRCodeModalVisible(false)} 
              />
            </Modal>
            
            {/* Modal para visualizar devocional */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={devotionalModalVisible}
              onRequestClose={() => setDevotionalModalVisible(false)}
            >
              <View style={styles.devotionalModalContainer}>
                {/* Conteúdo do devocional aqui */}
              </View>
            </Modal>
          </View>
        </>
      )}
    </View>
  );
}

// Componente principal que fornece os contextos
export default function App() {
  return (
    <UserProvider>
      <CreditsProvider>
        <DevotionalsProvider>
          <SpeechProvider>
            <AppContent />
          </SpeechProvider>
        </DevotionalsProvider>
      </CreditsProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)', // Borda dourada com opacidade 0.3
  },
  statusBarSpace: {
    height: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  sideMenuOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenuWrapper: {
    width: 300,
    height: '100%',
    backgroundColor: '#121212',
    zIndex: 2,
  },
  sideMenuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  devotionalModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
