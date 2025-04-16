import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Image, Switch } from 'react-native';
import { useUser } from '../context/UserContext';
import { useCredits } from '../context/CreditsContext';

export default function ProfileModal({ onClose, onLogout }) {
  const { user, updateUser } = useUser();
  const { credits, plan } = useCredits();
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome.');
      return;
    }

    // Atualizar dados do usuário
    updateUser({
      ...user,
      displayName: name,
      email: email,
    });

    Alert.alert(
      'Perfil Atualizado',
      'Suas informações foram atualizadas com sucesso!',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Seu Perfil</Text>
        
        {user?.photoURL ? (
          <Image 
            source={{ uri: user.photoURL }} 
            style={styles.profilePicture} 
          />
        ) : (
          <View style={styles.profilePicture}>
            <Text style={styles.profileInitial}>
              {name ? name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu.email@exemplo.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Plano atual:</Text>
          <Text style={styles.infoValue}>
            {plan === 'premium' ? 'Premium' : 'Gratuito'}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Créditos disponíveis:</Text>
          <Text style={styles.infoValue}>
            {plan === 'premium' ? 'Ilimitado' : credits}
          </Text>
        </View>
        
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Notificações</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#444', true: '#00a884' }}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Modo escuro</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#444', true: '#00a884' }}
            thumbColor={darkMode ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <Text style={styles.disclaimer}>
          Suas informações são armazenadas apenas no seu dispositivo e não são compartilhadas.
        </Text>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={onLogout}
      >
        <Text style={styles.logoutButtonText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00a884',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  disclaimer: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#00a884',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 12,
    backgroundColor: '#262626',
    borderRadius: 8,
    marginBottom: 10,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 16,
  },
  infoValue: {
    color: '#00a884',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    backgroundColor: '#262626',
    borderRadius: 8,
    marginBottom: 10,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
