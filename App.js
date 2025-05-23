import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, SafeAreaView, ImageBackground, Text, TouchableOpacity, Alert, Platform, StatusBar as RNStatusBar, Animated, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './context/UserContext';
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
// BackgroundImage removido
import QRCodeScreen from './components/QRCodeScreen';

export default function App() {
  const [plansModalVisible, setPlansModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [qrCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedDevotional, setSelectedDevotional] = useState(null);
  const [devotionalModalVisible, setDevotionalModalVisible] = useState(false);
  
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

  // Banner removido conforme solicitado

  return (
    <UserProvider>
      <CreditsProvider>
        <DevotionalsProvider>
          <SpeechProvider>
        <View style={styles.container}>
          <View style={styles.statusBarSpace} />
          <StatusBar style="light" />
          
          {!isLoggedIn ? (
            <LoginScreen onLoginSuccess={handleLogin} />
          ) : (
            <>
              {/* Banner removido */}
              
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
                    <View style={styles.devotionalModalContent}>
                      <View style={styles.devotionalHeader}>
                        <Text style={styles.devotionalTitle}>
                          Devocional {selectedDevotional && new Date(selectedDevotional.timestamp).toLocaleDateString()}
                        </Text>
                        <TouchableOpacity 
                          style={styles.closeButton}
                          onPress={() => setDevotionalModalVisible(false)}
                        >
                          <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.devotionalContent}>
                        <Text style={styles.devotionalText}>
                          {selectedDevotional?.content}
                        </Text>
                      </View>
                      
                      <View style={styles.devotionalFooter}>
                        <TouchableOpacity 
                          style={styles.shareButton}
                          onPress={() => {
                            if (selectedDevotional) {
                              Share.share({
                                message: `${selectedDevotional.content}\n\nCompartilhado via Jesus.IA\nBaixe o app: https://transmutebr.com/jesusia\nSiga @transmutebr no TikTok`,
                                title: 'Compartilhar via Jesus.IA',
                              });
                            }
                          }}
                        >
                          <Text style={styles.shareButtonText}>Compartilhar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </>
          )}
        </View>
          </SpeechProvider>
        </DevotionalsProvider>
      </CreditsProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(184, 157, 76, 0.3)',
    margin: 5,
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
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 5,
  },
  sideMenuWrapper: {
    width: '80%',
    backgroundColor: '#121212',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  devotionalModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  devotionalModalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(184, 157, 76, 0.8)',
  },
  devotionalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184, 157, 76, 0.5)',
    paddingBottom: 10,
  },
  devotionalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  devotionalContent: {
    flex: 1,
    marginBottom: 16,
  },
  devotionalText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'serif',
  },
  devotionalFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(184, 157, 76, 0.5)',
    paddingTop: 10,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: 'rgba(184, 157, 76, 0.8)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
});
