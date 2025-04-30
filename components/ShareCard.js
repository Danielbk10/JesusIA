import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share, Platform } from 'react-native';
import { COLORS } from '../config/colorConfig';
import { FONTS } from '../config/fontConfig';

const ShareCard = ({ content, onSave, onClose }) => {
  // Função para compartilhar o conteúdo
  const handleShare = async () => {
    try {
      const shareOptions = {
        message: `${content}\n\nCompartilhado via Jesus.IA\nBaixe o app: https://transmutebr.com/jesusia\nSiga @transmutebr no TikTok`,
        title: 'Compartilhar via Jesus.IA',
      };
      
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/jesus-logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.appName}>Jesus.IA</Text>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{content}</Text>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleShare}
          >
            <Text style={styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={onSave}
          >
            <Text style={styles.buttonText}>Salvar Devocional</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
  },
  appName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: FONTS.SERIF,
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  content: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONTS.SERIF,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'rgba(117, 100, 49, 0.5)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.SERIF,
  },
});

export default ShareCard;
