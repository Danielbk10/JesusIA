import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Share, 
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../config/colorConfig';
import { FONTS } from '../config/fontConfig';
import { useUser } from '../context/UserContext';

const QRCodeScreen = ({ onClose }) => {
  const { user } = useUser();
  const [qrValue, setQrValue] = useState('');
  const [qrSize, setQrSize] = useState(250);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  
  // Gerar URL padrão com informações do usuário
  useEffect(() => {
    generateDefaultQRValue();
  }, [user]);
  
  const generateDefaultQRValue = () => {
    // URL base para download do app
    const baseUrl = 'https://transmutebr.com/jesusia';
    
    // Adicionar parâmetros de referência se o usuário estiver logado
    if (user && user.email) {
      const referralCode = user.email.split('@')[0]; // Usar parte do email como código de referência
      setQrValue(`${baseUrl}?ref=${referralCode}`);
    } else {
      setQrValue(baseUrl);
    }
  };
  
  const generateCustomQRValue = () => {
    if (!customMessage.trim()) {
      Alert.alert('Mensagem vazia', 'Por favor, digite uma mensagem para gerar o QR code personalizado.');
      return;
    }
    
    setIsGenerating(true);
    
    // Simular processamento
    setTimeout(() => {
      // URL base para download do app
      const baseUrl = 'https://transmutebr.com/jesusia';
      
      // Adicionar parâmetros de mensagem e referência
      let url = `${baseUrl}?msg=${encodeURIComponent(customMessage)}`;
      
      // Adicionar parâmetro de referência se o usuário estiver logado
      if (user && user.email) {
        const referralCode = user.email.split('@')[0];
        url += `&ref=${referralCode}`;
      }
      
      setQrValue(url);
      setIsGenerating(false);
    }, 1000);
  };
  
  const handleShare = async () => {
    try {
      const shareOptions = {
        title: 'Compartilhar QR Code do Jesus.IA',
        message: `Escaneie este QR code para acessar o Jesus.IA: ${qrValue}\n\nBaixe o app: https://transmutebr.com/jesusia\nSiga @transmutebr no TikTok`,
      };
      
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Erro ao compartilhar QR code:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Code de Acesso</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.qrContainer}>
          {isGenerating ? (
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          ) : (
            <QRCode
              value={qrValue}
              size={qrSize}
              color="#000000"
              backgroundColor="#ffffff"
              logo={require('../assets/images/jesus-logo.png')}
              logoSize={qrSize * 0.2}
              logoBackgroundColor="white"
              logoMargin={5}
              logoBorderRadius={10}
            />
          )}
        </View>
        
        <Text style={styles.urlText}>{qrValue}</Text>
        
        <View style={styles.customMessageContainer}>
          <Text style={styles.sectionTitle}>Personalizar QR Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite uma mensagem personalizada..."
            placeholderTextColor="#999"
            value={customMessage}
            onChangeText={setCustomMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateCustomQRValue}
          >
            <Text style={styles.generateButtonText}>Gerar QR Code Personalizado</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Este QR code permite acesso rápido ao Jesus.IA. Compartilhe com amigos e familiares para que eles também possam acessar o aplicativo.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Text style={styles.shareButtonText}>Compartilhar QR Code</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={generateDefaultQRValue}
        >
          <Text style={styles.resetButtonText}>Restaurar QR Code Padrão</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONTS.SERIF,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 290,
    width: 290,
  },
  urlText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  customMessageContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: FONTS.SERIF,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    fontFamily: FONTS.SERIF,
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.SERIF,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONTS.SERIF,
  },
  shareButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.SERIF,
  },
  resetButton: {
    backgroundColor: 'rgba(117, 100, 49, 0.3)',
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.SERIF,
  },
});

export default QRCodeScreen;
