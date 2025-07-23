import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { COLORS } from '../config/colorConfig';
import { FONTS } from '../config/fontConfig';
import AuthStorageService from '../services/AuthStorageService';
import { useCredits } from '../context/CreditsContext';

/**
 * Modal de aviso de créditos insuficientes com opções para assistir anúncio ou ver planos
 * @param {boolean} visible - Controla a visibilidade do modal
 * @param {function} onClose - Função chamada ao fechar o modal
 * @param {function} onOpenPlans - Função chamada ao clicar em "Ver Planos"
 * @param {function} onCreditAdded - Função chamada após adicionar créditos com sucesso
 */
const CreditWarningModal = ({ visible, onClose, onOpenPlans, onCreditAdded }) => {
  const [adLoading, setAdLoading] = useState(false);
  const { earnCreditsFromAd } = useCredits();

  // Simular assistir um anúncio e ganhar créditos
  const handleWatchAd = async () => {
    try {
      setAdLoading(true);
      
      // Simular carregamento do anúncio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular visualização do anúncio
      console.log('Simulando visualização de anúncio...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Registrar timestamp de visualização
      await AuthStorageService.saveAdWatchTimestamp();
      
      // Adicionar créditos ao usuário
      await earnCreditsFromAd();
      
      // Fechar modal
      onClose();
      
      // Chamar callback se existir
      if (onCreditAdded) {
        onCreditAdded();
      }
      
      setAdLoading(false);
    } catch (error) {
      console.error('Erro ao processar anúncio:', error);
      setAdLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Créditos Insuficientes</Text>
          <Text style={styles.modalText}>
            Você não tem créditos suficientes para realizar esta ação.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button, 
                styles.watchButton,
                adLoading && styles.disabledButton
              ]}
              onPress={handleWatchAd}
              disabled={adLoading}
            >
              {adLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>ASSISTIR ANÚNCIO</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.plansButton]}
              onPress={() => {
                onClose();
                onOpenPlans();
              }}
            >
              <Text style={styles.buttonText}>VER PLANOS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    fontFamily: FONTS.SERIF,
  },
  modalText: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: FONTS.SERIF,
  },
  cooldownText: {
    fontSize: 14,
    color: '#ff9800',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: FONTS.SERIF,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    borderRadius: 5,
    padding: 12,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  watchButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  plansButton: {
    backgroundColor: COLORS.SECONDARY || '#4caf50',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#555',
  },
  disabledButton: {
    backgroundColor: '#555',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: FONTS.SERIF,
  },
  cancelText: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: FONTS.SERIF,
  },
});

export default CreditWarningModal;
