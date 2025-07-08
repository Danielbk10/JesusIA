import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { FONTS } from '../config/fontConfig';
import { COLORS } from '../config/colorConfig';

export default function DemoAdScreen({ visible, onClose, onAdCompleted }) {
  const [countdown, setCountdown] = useState(5);
  const [adState, setAdState] = useState('loading'); // loading, playing, completed
  const [callbackExecuted, setCallbackExecuted] = useState(false);
  
  // Forçar a atualização do estado quando a visibilidade muda
  useEffect(() => {
    console.log('DemoAdScreen: Visibilidade mudou para', visible ? 'visível' : 'invisível');
    
    // Resetar o estado quando o modal é fechado
    if (!visible) {
      setCallbackExecuted(false);
      setAdState('loading');
      setCountdown(5);
    }
  }, [visible]);
  
  // Efeito separado para lidar com a lógica do anúncio quando visível
  useEffect(() => {
    let loadTimer = null;
    let countdownTimer = null;
    
    if (visible) {
      // Quando o modal é aberto, iniciamos o anúncio
      console.log('DemoAdScreen: Modal aberto, iniciando anúncio');
      
      // Simular carregamento do anúncio
      loadTimer = setTimeout(() => {
        console.log('DemoAdScreen: Anúncio carregado, iniciando exibição');
        if (visible) { // Verificar se ainda está visível
          setAdState('playing');
          
          // Iniciar contagem regressiva
          countdownTimer = setInterval(() => {
            setCountdown((prev) => {
              const newValue = prev - 1;
              console.log('DemoAdScreen: Contagem regressiva:', newValue);
              
              if (newValue <= 0) {
                console.log('DemoAdScreen: Contagem regressiva concluída');
                clearInterval(countdownTimer);
                
                if (visible) { // Verificar se ainda está visível
                  setAdState('completed');
                  
                  // Chamar o callback de conclusão imediatamente
                  if (!callbackExecuted && onAdCompleted) {
                    try {
                      console.log('DemoAdScreen: Executando callback de conclusão');
                      setCallbackExecuted(true);
                      onAdCompleted();
                    } catch (error) {
                      console.error('DemoAdScreen: Erro ao executar callback:', error);
                      Alert.alert('Erro', 'Ocorreu um erro ao processar o anúncio. Tente novamente.');
                    }
                  }
                }
              }
              return newValue;
            });
          }, 1000);
        }
      }, 1500);
    }
    
    // Limpar os timers quando o componente for desmontado ou o modal for fechado
    return () => {
      console.log('DemoAdScreen: Limpando timers');
      if (loadTimer) clearTimeout(loadTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [visible, onAdCompleted, callbackExecuted]);
  
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => {
        // Só permitir fechar pelo botão de voltar do dispositivo quando o anúncio estiver concluído
        if (adState === 'completed') {
          console.log('DemoAdScreen: Fechando modal pelo botão de voltar');
          onClose();
        } else {
          console.log('DemoAdScreen: Tentativa de fechar modal bloqueada - anúncio em andamento');
        }
      }}
    >
      <View style={styles.container}>
        {/* Área de carregamento */}
        {adState === 'loading' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={styles.loadingText}>Carregando anúncio...</Text>
            <Text style={styles.loadingSubtext}>Aguarde um momento</Text>
          </View>
        )}
        
        {/* Área de exibição do anúncio */}
        {adState === 'playing' && (
          <View style={styles.adContainer}>
            <View style={styles.adHeader}>
              <Text style={styles.adLabel}>Anúncio</Text>
              <Text style={styles.countdownText}>{countdown}s</Text>
            </View>
            
            <View style={styles.adContent}>
              <Image 
                source={require('../assets/images/icon.png')} 
                style={styles.adImage}
                resizeMode="contain"
              />
              <Text style={styles.adTitle}>Jesus.IA Premium</Text>
              <Text style={styles.adDescription}>
                Assine o plano premium e tenha acesso ilimitado a todas as funcionalidades!
              </Text>
              <Text style={styles.adNote}>
                Aguarde a contagem regressiva para ganhar seus créditos
              </Text>
            </View>
          </View>
        )}
        
        {/* Área de conclusão */}
        {adState === 'completed' && (
          <View style={styles.completedContainer}>
            <Image 
              source={require('../assets/images/icon.png')} 
              style={styles.completedImage}
              resizeMode="contain"
            />
            <Text style={styles.completedTitle}>Obrigado por assistir!</Text>
            <Text style={styles.completedText}>Você ganhou 2 créditos</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                console.log('DemoAdScreen: Botão Continuar pressionado');
                if (onClose) {
                  console.log('DemoAdScreen: Fechando modal pelo botão Continuar');
                  onClose();
                } else {
                  console.warn('DemoAdScreen: Callback onClose não fornecido');
                  Alert.alert('Erro', 'Não foi possível fechar o anúncio. Tente novamente.');
                }
              }}
            >
              <Text style={styles.closeButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Estilos para o estado de carregamento
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 200,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 18,
    fontFamily: FONTS.SERIF,
    fontWeight: 'bold',
  },
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    fontSize: 14,
    fontFamily: FONTS.SERIF,
  },
  // Estilos para o container do anúncio
  adContainer: {
    width: '100%',
    height: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(184, 157, 76, 0.3)',
    elevation: 5,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184, 157, 76, 0.3)',
  },
  adLabel: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.SERIF,
    fontWeight: 'bold',
  },
  countdownText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontFamily: FONTS.SERIF,
    fontWeight: 'bold',
  },
  adContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  adImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  adTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: FONTS.SERIF,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  adDescription: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONTS.SERIF,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
  },
  adNote: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: FONTS.SERIF,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 15,
  },
  // Estilos para o estado de conclusão
  completedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  completedImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  completedTitle: {
    color: '#fff',
    fontSize: 26,
    fontFamily: FONTS.SERIF,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  completedText: {
    color: COLORS.PRIMARY,
    fontSize: 20,
    fontFamily: FONTS.SERIF,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONTS.SERIF,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
