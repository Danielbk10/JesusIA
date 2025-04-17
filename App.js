import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, SafeAreaView, ImageBackground, Text, TouchableOpacity, Alert, Platform, StatusBar as RNStatusBar, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './context/UserContext';
import { CreditsProvider } from './context/CreditsContext';
import ChatScreen from './components/ChatScreen';
import SubscriptionPlans from './components/SubscriptionPlans';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import MenuDrawer from './components/MenuDrawer';
import LoginScreen from './components/LoginScreen';
import SideMenu from './components/SideMenu';
import BottomBar from './components/BottomBar';
import BackgroundImage from './components/BackgroundImage';

export default function App() {
  const [plansModalVisible, setPlansModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  
  // Imagem de fundo da árvore
  const treeBackground = require('./assets/images/icon.png');

  const handleLogin = () => {
    setIsLoggedIn(true);
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
          onPress: () => {
            setIsLoggedIn(false);
            setProfileModalVisible(false);
          }
        }
      ]
    );
  };
  
  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
    // Aqui você poderia carregar o histórico de mensagens do chat selecionado
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

  // Banner removido conforme solicitado

  return (
    <UserProvider>
      <CreditsProvider>
        <View style={styles.container}>
          <View style={styles.statusBarSpace} />
          <StatusBar style="light" />
          
          {!isLoggedIn ? (
            <LoginScreen onLoginSuccess={handleLogin} />
          ) : (
            <>
              {/* Banner removido */}
              
              <BackgroundImage>
                <Header 
                  onPressProfile={() => setProfileModalVisible(true)} 
                  onPressMenu={() => setSideMenuVisible(true)}
                />
                
                <ChatScreen 
                  currentChat={currentChat}
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
                    <TouchableOpacity 
                      style={styles.sideMenuBackdrop}
                      activeOpacity={1}
                      onPress={() => setSideMenuVisible(false)}
                    />
                    <Animated.View style={[styles.sideMenuWrapper, {
                      transform: [{ translateX: slideAnim }]
                    }]}>
                      <SideMenu 
                        onClose={() => setSideMenuVisible(false)}
                        onSelectChat={handleSelectChat}
                        onOpenPlans={() => {
                          setSideMenuVisible(false);
                          setPlansModalVisible(true);
                        }}
                      />
                    </Animated.View>
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
              </BackgroundImage>
            </>
          )}
        </View>
      </CreditsProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  statusBarSpace: {
    height: Platform.OS === 'ios' ? 50 : RNStatusBar.currentHeight + 10,
    backgroundColor: '#000',
  },
  // Estilos do banner removidos
  backgroundImage: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImageStyle: {
    opacity: 0.1,
    resizeMode: 'contain',
  },
  sideMenuOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideMenuWrapper: {
    width: '80%',
    backgroundColor: '#121212',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});
