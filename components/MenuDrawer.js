import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';
import { useCredits } from '../context/CreditsContext';

export default function MenuDrawer({ onClose, onNavigateTo }) {
  const { user } = useUser();
  const { credits, plan } = useCredits();

  const menuItems = [
    { id: 'home', title: 'Início', onPress: () => handleNavigate('home') },
    { id: 'plans', title: 'Planos de Assinatura', onPress: () => handleNavigate('plans') },
    { id: 'about', title: 'Sobre Jesus.IA', onPress: () => handleNavigate('about') },
    { id: 'terms', title: 'Termos de Uso', onPress: () => handleNavigate('terms') },
    { id: 'privacy', title: 'Política de Privacidade', onPress: () => handleNavigate('privacy') },
  ];

  const handleNavigate = (screen) => {
    onNavigateTo(screen);
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>JESUS.IA</Text>
        <Text style={styles.subtitle}>Representação consciência de jesus segundo a bíblia</Text>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user?.displayName || 'Usuário'}</Text>
          <Text style={styles.userPlan}>
            Plano: {plan === 'premium' ? 'Premium' : plan === 'basic' ? 'Básico' : 'Gratuito'}
          </Text>
          {plan === 'free' && (
            <Text style={styles.userCredits}>Créditos: {credits}</Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.menuItems}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Fechar Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00a884',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInitial: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userPlan: {
    color: '#aaa',
    fontSize: 14,
  },
  userCredits: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 2,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
