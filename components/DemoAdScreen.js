import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image,
  ActivityIndicator
} from 'react-native';
import { FONTS } from '../config/fontConfig';
import { COLORS } from '../config/colorConfig';

export default function DemoAdScreen({ visible, onClose, onAdCompleted }) {
  const [countdown, setCountdown] = useState(5);
  const [adState, setAdState] = useState('loading'); // loading, playing, completed
  
  // Simular carregamento do anúncio
  useEffect(() => {
    console.log('DemoAdScreen: visible =', visible, 'adState =', adState);
    if (visible && adState === 'loading') {
      console.log('DemoAdScreen: Iniciando carregamento do anúncio');
      // Simular tempo de carregamento
      const loadTimer = setTimeout(() => {
        console.log('DemoAdScreen: Anúncio carregado, iniciando exibição');
        setAdState('playing');
        // Iniciar contagem regressiva
        startCountdown();
      }, 1500);
      
      return () => {
        console.log('DemoAdScreen: Limpando timer de carregamento');
        clearTimeout(loadTimer);
      };
    }
  }, [visible, adState]);
  
  // Função para iniciar a contagem regressiva
  const startCountdown = () => {
    console.log('DemoAdScreen: Iniciando contagem regressiva de', countdown, 'segundos');
    const timer = setInterval(() => {
      setCountdown((prev) => {
        console.log('DemoAdScreen: Contagem regressiva:', prev - 1);
        if (prev <= 1) {
          console.log('DemoAdScreen: Contagem regressiva concluída, marcando anúncio como completo');
          clearInterval(timer);
          setAdState('completed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      console.log('DemoAdScreen: Limpando timer de contagem regressiva');
      clearInterval(timer);
    };
  };
  
  // Resetar estado quando o modal é fechado
  useEffect(() => {
    console.log('DemoAdScreen: Visibilidade mudou para', visible ? 'visível' : 'invisível');
    if (!visible) {
      console.log('DemoAdScreen: Resetando estado do anúncio');
      setCountdown(5);
      setAdState('loading');
    }
  }, [visible]);
  
  // Chamar callback quando o anúncio for concluído
  useEffect(() => {
    if (adState === 'completed') {
      console.log('DemoAdScreen: Anúncio marcado como concluído, preparando callback');
      // Dar um pequeno atraso antes de chamar o callback
      const completionTimer = setTimeout(() => {
        console.log('DemoAdScreen: Chamando callback onAdCompleted');
        if (onAdCompleted) {
          try {
            // Chamar o callback apenas uma vez
            onAdCompleted();
            console.log('DemoAdScreen: Callback onAdCompleted executado com sucesso');
          } catch (error) {
            console.error('DemoAdScreen: Erro ao executar callback onAdCompleted:', error);
          }
        } else {
          console.warn('DemoAdScreen: Callback onAdCompleted não fornecido');
        }
      }, 1000);
      
      return () => {
        console.log('DemoAdScreen: Limpando timer de conclusão');
        clearTimeout(completionTimer);
      };
    }
  }, [adState, onAdCompleted]);
  
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => {
        // Não permitir fechar durante a exibição
        if (adState === 'completed') {
          onClose();
        }
      }}
    >
      <View style={styles.container}>
        {adState === 'loading' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={styles.loadingText}>Carregando anúncio...</Text>
          </View>
        )}
        
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
            </View>
          </View>
        )}
        
        {adState === 'completed' && (
          <View style={styles.completedContainer}>
            <Text style={styles.completedTitle}>Obrigado por assistir!</Text>
            <Text style={styles.completedText}>Você ganhou 2 créditos</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                console.log('DemoAdScreen: Botão Continuar pressionado');
                // Apenas fechar o modal, o callback de conclusão já foi chamado pelo useEffect
                if (onClose) {
                  console.log('DemoAdScreen: Fechando modal');
                  onClose();
                } else {
                  console.warn('DemoAdScreen: Callback onClose não fornecido');
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
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    fontFamily: FONTS.SERIF,
  },
  adContainer: {
    width: '100%',
    height: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(184, 157, 76, 0.3)',
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  adLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.SERIF,
  },
  countdownText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.SERIF,
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
    marginBottom: 10,
    textAlign: 'center',
  },
  adDescription: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONTS.SERIF,
    textAlign: 'center',
    lineHeight: 26,
  },
  completedContainer: {
    alignItems: 'center',
  },
  completedTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: FONTS.SERIF,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  completedText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONTS.SERIF,
    marginBottom: 30,
  },
  closeButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.SERIF,
    fontWeight: 'bold',
  },
});
