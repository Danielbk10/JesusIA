import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext';
import { useCredits } from '../context/CreditsContext';
import { COLORS } from '../config/colorConfig';
import { FONTS } from '../config/fontConfig';

export default function ProfileModal({ onClose, onLogout }) {
  const { user, updateUser } = useUser();
  const { credits, plan } = useCredits();
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState(user?.photoURL || null);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

  // Função para selecionar foto de perfil
  const handleSelectProfilePhoto = async () => {
    try {
      // Verificar se o usuário logou via OAuth (Google/Facebook)
      const isOAuthUser = user?.loginMethod === 'google' || user?.loginMethod === 'facebook';
      
      if (isOAuthUser) {
        Alert.alert(
          'Foto do Perfil',
          'Sua foto de perfil é sincronizada automaticamente com sua conta do Google/Facebook. Para alterá-la, atualize em sua conta original.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Solicitar permissões
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      // Mostrar opções
      Alert.alert(
        'Foto de Perfil',
        'Como você gostaria de adicionar sua foto?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Câmera', onPress: () => openImagePicker('camera') },
          { text: 'Galeria', onPress: () => openImagePicker('library') },
        ]
      );
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Não foi possível acessar as fotos.');
    }
  };

  const openImagePicker = async (source) => {
    try {
      setIsUpdatingPhoto(true);
      
      let result;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Erro', 'Precisamos de permissão para usar a câmera.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        
        // Salvar a imagem localmente
        await AsyncStorage.setItem(`profileImage_${user.id}`, imageUri);
        
        console.log('ProfileModal: Foto de perfil atualizada:', imageUri);
      }
    } catch (error) {
      console.error('Erro ao abrir seletor de imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome.');
      return;
    }

    try {
      // Atualizar dados do usuário incluindo a foto
      const updatedUser = {
        ...user,
        displayName: name,
        email: email,
        photoURL: profileImage,
      };
      
      updateUser(updatedUser);

      Alert.alert(
        'Perfil Atualizado',
        'Suas informações foram atualizadas com sucesso!',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Seu Perfil</Text>
        
        <TouchableOpacity 
          style={styles.profilePictureContainer}
          onPress={handleSelectProfilePhoto}
          disabled={isUpdatingPhoto}
        >
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              style={styles.profilePicture} 
            />
          ) : (
            <View style={styles.profilePicture}>
              <Text style={styles.profileInitial}>
                {name ? name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
          )}
          
          <View style={styles.cameraIconContainer}>
            {isUpdatingPhoto ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>...</Text>
              </View>
            ) : (
              <Ionicons name="camera" size={20} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
        
        <Text style={styles.photoHint}>
          {user?.loginMethod === 'google' || user?.loginMethod === 'facebook' 
            ? 'Foto sincronizada com sua conta'
            : 'Toque para alterar sua foto'
          }
        </Text>
        
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
            trackColor={{ false: '#444', true: COLORS.PRIMARY }}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Backup automático</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#444', true: COLORS.PRIMARY }}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
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
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  photoHint: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
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
    backgroundColor: COLORS.PRIMARY,
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
    color: COLORS.PRIMARY,
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
