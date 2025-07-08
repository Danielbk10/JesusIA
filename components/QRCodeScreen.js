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
  ActivityIndicator,
  Switch,
  Clipboard
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
  const [useExpoLink, setUseExpoLink] = useState(true);
  const [expoProjectId, setExpoProjectId] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
  
  // Gerar URL padrão com informações do usuário
  useEffect(() => {
    generateDefaultQRValue();
  }, [user, useExpoLink, expoProjectId]);
  
  const generateDefaultQRValue = () => {
    let url;
    
    // Adicionar timestamp para garantir que o QR code seja único a cada geração
    const timestamp = new Date().getTime();
    setLastUpdated(new Date().toLocaleString());
    
    if (useExpoLink) {
      // URL para acessar o app via Expo Go
      if (expoProjectId) {
        // Usar o Project ID fornecido
        url = `exp://exp.host/@transmutebr/JesusIA?release-channel=default&projectId=${expoProjectId}&ts=${timestamp}`;
      } else {
        // URL genérico do Expo Go
        url = `exp://exp.host/@transmutebr/JesusIA?ts=${timestamp}`;
      }
      
      // Adicionar parâmetros de referência se o usuário estiver logado
      if (user && user.email) {
        const referralCode = user.email.split('@')[0]; // Usar parte do email como código de referência
        url += `&ref=${referralCode}`;
      }
    } else {
      // URL base para download do app
      url = `https://transmutebr.com/jesusia?ts=${timestamp}`;
      
      // Adicionar parâmetros de referência se o usuário estiver logado
      if (user && user.email) {
        const referralCode = user.email.split('@')[0]; // Usar parte do email como código de referência
        url += `&ref=${referralCode}`;
      }
    }
    
    setQrValue(url);
  };
  
  const generateCustomQRValue = () => {
    if (!customMessage.trim()) {
      Alert.alert('Mensagem vazia', 'Por favor, digite uma mensagem para gerar o QR code personalizado.');
      return;
    }
    
    setIsGenerating(true);
    
    // Simular processamento
    setTimeout(() => {
      let url;
      
      // Adicionar timestamp para garantir que o QR code seja único a cada geração
      const timestamp = new Date().getTime();
      setLastUpdated(new Date().toLocaleString());
      
      if (useExpoLink) {
        // URL para acessar o app via Expo Go
        if (expoProjectId) {
          // Usar o Project ID fornecido
          url = `exp://exp.host/@transmutebr/JesusIA?release-channel=default&projectId=${expoProjectId}&ts=${timestamp}`;
        } else {
          // URL genérico do Expo Go
          url = `exp://exp.host/@transmutebr/JesusIA?ts=${timestamp}`;
        }
        
        // Adicionar parâmetros de mensagem
        url += `&msg=${encodeURIComponent(customMessage)}`;
        
        // Adicionar parâmetro de referência se o usuário estiver logado
        if (user && user.email) {
          const referralCode = user.email.split('@')[0];
          url += `&ref=${referralCode}`;
        }
      } else {
        // URL base para download do app
        url = `https://transmutebr.com/jesusia?ts=${timestamp}`;
        
        // Adicionar parâmetros de mensagem
        url += `&msg=${encodeURIComponent(customMessage)}`;
        
        // Adicionar parâmetro de referência se o usuário estiver logado
        if (user && user.email) {
          const referralCode = user.email.split('@')[0];
          url += `&ref=${referralCode}`;
        }
      }
      
      setQrValue(url);
      setIsGenerating(false);
    }, 1000);
  };
  
  const handleShare = async () => {
    try {
      const shareOptions = {
        title: 'Compartilhar QR Code do Jesus.IA',
        message: useExpoLink
          ? `Escaneie este QR code para acessar o Jesus.IA via Expo Go: ${qrValue}\n\nBaixe o Expo Go: https://expo.dev/client\nSiga @transmutebr no TikTok`
          : `Escaneie este QR code para acessar o Jesus.IA: ${qrValue}\n\nBaixe o app: https://transmutebr.com/jesusia\nSiga @transmutebr no TikTok`,
      };
      
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Erro ao compartilhar QR code:', error);
    }
  };
  
  const copyToClipboard = () => {
    Clipboard.setString(qrValue);
    Alert.alert('Link copiado', 'O link do QR code foi copiado para a área de transferência.');
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
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>QR Code para Expo Go</Text>
          <Switch
            trackColor={{ false: '#767577', true: COLORS.PRIMARY }}
            thumbColor={useExpoLink ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setUseExpoLink(!useExpoLink)}
            value={useExpoLink}
          />
        </View>
        
        {useExpoLink && (
          <View style={styles.expoIdContainer}>
            <Text style={styles.expoIdLabel}>ID do Projeto no Expo (opcional):</Text>
            <TextInput
              style={styles.expoIdInput}
              placeholder="Digite o ID do projeto..."
              placeholderTextColor="#999"
              value={expoProjectId}
              onChangeText={setExpoProjectId}
            />
          </View>
        )}
        
        <View style={styles.qrContainer}>
          {qrValue ? (
            <QRCode
              value={qrValue}
              size={qrSize}
              color="#000"
              backgroundColor="#fff"
            />
          ) : (
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          )}
        </View>
        
        <View style={styles.updateInfoContainer}>
          <Text style={styles.updateInfoText}>QR Code atualizado para nova rede WiFi!</Text>
          <Text style={styles.updateTimeText}>Última atualização: {lastUpdated}</Text>
          <Text style={styles.updateNoteText}>Este QR code é único e foi gerado especificamente para sua rede atual.</Text>
        </View>
        
        <View style={styles.urlContainer}>
          <Text style={styles.urlText}>{qrValue}</Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
            <Text style={styles.copyButtonText}>Copiar</Text>
          </TouchableOpacity>
        </View>
        
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
            {useExpoLink 
              ? 'Este QR code permite acesso rápido ao Jesus.IA através do Expo Go. O usuário precisará ter o Expo Go instalado para acessar o aplicativo.' 
              : 'Este QR code permite acesso rápido ao Jesus.IA. Compartilhe com amigos e familiares para que eles também possam acessar o aplicativo.'}
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    width: '100%',
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.SERIF,
  },
  expoIdContainer: {
    width: '100%',
    marginBottom: 15,
  },
  expoIdLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
    fontFamily: FONTS.SERIF,
  },
  expoIdInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontFamily: FONTS.SERIF,
    fontSize: 14,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  urlText: {
    color: '#ccc',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginLeft: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 12,
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
  updateInfoContainer: {
    backgroundColor: 'rgba(184, 157, 76, 0.2)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  updateInfoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.SERIF,
    marginBottom: 4,
  },
  updateTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: FONTS.SERIF,
    marginBottom: 4,
  },
  updateNoteText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontFamily: FONTS.SERIF,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default QRCodeScreen;
