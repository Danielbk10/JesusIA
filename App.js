import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, SafeAreaView, ImageBackground, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './context/UserContext';
import { CreditsProvider } from './context/CreditsContext';
import ChatScreen from './components/ChatScreen';
import SubscriptionPlans from './components/SubscriptionPlans';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import MenuDrawer from './components/MenuDrawer';

export default function App() {
  const [plansModalVisible, setPlansModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');

  // Imagem de fundo da árvore
  const treeBackground = require('./assets/images/icon.png');

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const renderStatusBar = (
    <View style={styles.statusBar}>
      <Text style={styles.statusText}>
        Suas perguntas gratuitas acabaram
      </Text>
      <View style={styles.premiumButton}>
        <Text style={styles.premiumButtonText}>Premium por R$14,90/mês</Text>
      </View>
    </View>
  );

  return (
    <UserProvider>
      <CreditsProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="light" />
          
          {renderStatusBar}

          <ImageBackground 
            source={treeBackground} 
            style={styles.backgroundImage} 
            imageStyle={styles.backgroundImageStyle}
          >
            <Header 
              onPressProfile={() => setProfileModalVisible(true)} 
              onPressMenu={() => setMenuVisible(true)}
            />
            
            <ChatScreen />

            <Modal
              animationType="slide"
              transparent={false}
              visible={plansModalVisible}
              onRequestClose={() => setPlansModalVisible(false)}
            >
              <SubscriptionPlans onClose={() => setPlansModalVisible(false)} />
            </Modal>

            <Modal
              animationType="slide"
              transparent={false}
              visible={profileModalVisible}
              onRequestClose={() => setProfileModalVisible(false)}
            >
              <ProfileModal onClose={() => setProfileModalVisible(false)} />
            </Modal>

            <Modal
              animationType="slide"
              transparent={false}
              visible={menuVisible}
              onRequestClose={() => setMenuVisible(false)}
            >
              <MenuDrawer 
                onClose={() => setMenuVisible(false)} 
                onNavigateTo={handleNavigate}
              />
            </Modal>
          </ImageBackground>
        </SafeAreaView>
      </CreditsProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  premiumButton: {
    backgroundColor: '#00a884',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImageStyle: {
    opacity: 0.1,
    resizeMode: 'contain',
  },
});
