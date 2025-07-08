import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import DemoAdScreen from '../components/DemoAdScreen';

// Definição dos planos de assinatura
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
};

// Informações detalhadas sobre cada plano
export const PLANS_INFO = {
  [SUBSCRIPTION_PLANS.FREE]: {
    name: 'Gratuito',
    price: 0,
    credits: 5,
    features: [
      'Acesso a 5 mensagens por dia',
      'Ganhe créditos assistindo anúncios',
      'Respostas baseadas na Bíblia',
    ],
  },
  [SUBSCRIPTION_PLANS.BASIC]: {
    name: 'Básico',
    price: 9.90,
    credits: 50,
    features: [
      'Acesso a 50 mensagens por dia',
      'Sem anúncios',
      'Respostas baseadas na Bíblia',
      'Suporte por e-mail',
    ],
  },
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    name: 'Premium',
    price: 19.90,
    credits: -1, // Ilimitado
    features: [
      'Mensagens ilimitadas',
      'Sem anúncios',
      'Respostas baseadas na Bíblia',
      'Suporte prioritário',
      'Acesso a recursos exclusivos',
    ],
  },
};

// Classe de serviço para gerenciar anúncios
class AdService {
  static _adVisible = false;
  static _adCallback = null;
  static _callbackExecuted = false;
  static _lastAdTime = 0;
  
  static showAd(callback) {
    console.log('AdService: showAd chamado');
    
    // Verificar se já existe um anúncio sendo exibido
    if (this._adVisible) {
      console.warn('AdService: Tentativa de mostrar anúncio enquanto outro já está visível');
      return false;
    }
    
    // Verificar se o último anúncio foi exibido há menos de 3 segundos
    const now = Date.now();
    if (now - this._lastAdTime < 3000) {
      console.warn('AdService: Tentativa de mostrar anúncio muito rápido após o último');
      return false;
    }
    
    // Armazenar o callback para ser chamado quando o anúncio for concluído
    this._adCallback = callback;
    this._adVisible = true;
    this._callbackExecuted = false;
    this._lastAdTime = now;
    
    console.log('AdService: Estado do anúncio definido como visível');
    return true;
  }
  
  static hideAd() {
    console.log('AdService: hideAd chamado');
    
    // Verificar se o anúncio está visível antes de tentar escondê-lo
    if (!this._adVisible) {
      console.log('AdService: Anúncio já está escondido');
      return;
    }
    
    this._adVisible = false;
    console.log('AdService: Estado do anúncio definido como invisível');
  }
  
  static completeAd() {
    console.log('AdService: completeAd chamado');
    
    // Verificar se o anúncio está visível antes de tentar completá-lo
    if (!this._adVisible) {
      console.warn('AdService: Tentativa de completar anúncio que não está visível');
      return false;
    }
    
    // Verificar se o callback já foi executado
    if (this._callbackExecuted) {
      console.warn('AdService: Callback já foi executado para este anúncio');
      return false;
    }
    
    this._adVisible = false;
    this._callbackExecuted = true;
    console.log('AdService: Estado do anúncio definido como invisível e concluído');
    
    if (this._adCallback) {
      console.log('AdService: Executando callback do anúncio');
      try {
        this._adCallback(true);
        console.log('AdService: Callback executado com sucesso');
      } catch (error) {
        console.error('AdService: Erro ao executar callback:', error);
      }
      this._adCallback = null;
      return true;
    } else {
      console.warn('AdService: Nenhum callback registrado para o anúncio');
      return false;
    }
  }
  
  static isAdVisible() {
    return this._adVisible;
  }
  
  static isCallbackExecuted() {
    return this._callbackExecuted;
  }
  
  static resetState() {
    console.log('AdService: Resetando estado');
    this._adVisible = false;
    this._adCallback = null;
    this._callbackExecuted = false;
  }
  
  static async showRewardedAd() {
    console.log('AdService: showRewardedAd chamado');
    return new Promise((resolve) => {
      const success = this.showAd((result) => {
        console.log('AdService: Resolvendo promessa de showRewardedAd com:', result);
        resolve(result);
      });
      
      if (!success) {
        console.warn('AdService: Não foi possível mostrar o anúncio recompensado');
        resolve(false);
      }
    });
  }
}

const CreditsContext = createContext();

export const CreditsProvider = ({ children }) => {
  const [credits, setCredits] = useState(5); // Padrão: 5 créditos
  const [plan, setPlan] = useState(SUBSCRIPTION_PLANS.FREE); // Padrão: plano gratuito
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' ou 'annual'
  const [loading, setLoading] = useState(true);
  const [adVisible, setAdVisible] = useState(false);
  const [isProcessingAd, setIsProcessingAd] = useState(false); // Estado para controlar o processamento do anúncio

  // Carregar créditos e plano do armazenamento local
  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      setLoading(true);
      const storedCredits = await AsyncStorage.getItem('credits');
      const storedPlan = await AsyncStorage.getItem('plan');
      const storedEndDate = await AsyncStorage.getItem('subscriptionEndDate');
      const storedBillingCycle = await AsyncStorage.getItem('billingCycle');

      console.log('CreditsContext: Carregando créditos do armazenamento:', storedCredits);
      
      // Garantir que o usuário sempre tenha pelo menos 5 créditos
      if (storedCredits !== null) {
        const parsedCredits = parseInt(storedCredits, 10);
        if (isNaN(parsedCredits) || parsedCredits <= 0) {
          // Se os créditos estiverem zerados ou inválidos, restaurar para 5
          console.log('CreditsContext: Créditos zerados ou inválidos, restaurando para 5');
          setCredits(5);
          await AsyncStorage.setItem('credits', '5');
        } else {
          console.log('CreditsContext: Definindo créditos para', parsedCredits);
          setCredits(parsedCredits);
        }
      } else {
        // Se não houver créditos armazenados, definir como 5
        console.log('CreditsContext: Nenhum crédito armazenado, definindo como 5');
        setCredits(5);
        await AsyncStorage.setItem('credits', '5');
      }

      if (storedPlan !== null) {
        setPlan(storedPlan);
      }

      if (storedEndDate !== null) {
        setSubscriptionEndDate(new Date(storedEndDate));
        
        // Verificar se a assinatura expirou
        const now = new Date();
        const endDate = new Date(storedEndDate);
        
        if (now > endDate && storedPlan !== SUBSCRIPTION_PLANS.FREE) {
          // Assinatura expirou, voltar para o plano gratuito
          setPlan(SUBSCRIPTION_PLANS.FREE);
          setCredits(PLANS_INFO[SUBSCRIPTION_PLANS.FREE].credits);
          await AsyncStorage.setItem('plan', SUBSCRIPTION_PLANS.FREE);
          await AsyncStorage.setItem('credits', PLANS_INFO[SUBSCRIPTION_PLANS.FREE].credits.toString());
          await AsyncStorage.removeItem('subscriptionEndDate');
          await AsyncStorage.removeItem('billingCycle');
        }
      }
      
      // Carregar o ciclo de cobrança
      if (storedBillingCycle !== null) {
        setBillingCycle(storedBillingCycle);
      }
    } catch (error) {
      console.error('Erro ao carregar créditos:', error);
      // Em caso de erro, garantir que o usuário tenha créditos
      setCredits(5);
      await AsyncStorage.setItem('credits', '5');
    } finally {
      setLoading(false);
    }
  };

  const saveCredits = async (newCredits) => {
    try {
      await AsyncStorage.setItem('credits', newCredits.toString());
      setCredits(newCredits);
    } catch (error) {
      console.error('Erro ao salvar créditos:', error);
    }
  };

  const updatePlan = async (newPlan, endDate = null, cycle = 'monthly') => {
    try {
      await AsyncStorage.setItem('plan', newPlan);
      setPlan(newPlan);

      // Atualizar o ciclo de cobrança
      await AsyncStorage.setItem('billingCycle', cycle);
      setBillingCycle(cycle);

      // Se for um plano pago, definir os créditos conforme o plano
      if (newPlan !== SUBSCRIPTION_PLANS.FREE) {
        await AsyncStorage.setItem('credits', PLANS_INFO[newPlan].credits.toString());
        setCredits(PLANS_INFO[newPlan].credits);
        
        // Salvar a data de término da assinatura
        if (endDate) {
          // Se for plano anual, adicionar 12 meses em vez de 1
          if (cycle === 'annual') {
            endDate.setMonth(endDate.getMonth() + 12);
          }
          
          await AsyncStorage.setItem('subscriptionEndDate', endDate.toISOString());
          setSubscriptionEndDate(endDate);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
    }
  };

  const useCredit = async () => {
    // Se for plano premium, não consumir créditos (ilimitado)
    if (plan === SUBSCRIPTION_PLANS.PREMIUM) {
      return true;
    }

    // Verificar se há créditos disponíveis
    if (credits <= 0) {
      return false;
    }

    // Consumir um crédito
    const newCredits = credits - 1;
    await saveCredits(newCredits);
    return true;
  };

  const earnCreditsFromAd = async () => {
    try {
      console.log('CreditsContext: Iniciando exibição do anúncio');
      
      // Adicionar créditos imediatamente para garantir que o usuário possa continuar
      const newCredits = 2; // Adicionar 2 créditos como recompensa
      await AsyncStorage.setItem('credits', newCredits.toString());
      setCredits(newCredits);
      console.log('CreditsContext: Créditos adicionados imediatamente:', newCredits);
      
      // Mostrar alerta de sucesso
      Alert.alert(
        'Créditos Adicionados',
        `Você ganhou 2 créditos por assistir ao anúncio! Agora você tem ${newCredits} créditos.`,
        [{ text: 'OK' }]
      );
      
      // Tentar mostrar o anúncio apenas para fins de demonstração (não crítico)
      try {
        // Forçar a limpeza de qualquer estado anterior
        console.log('CreditsContext: Limpando estado anterior');
        setAdVisible(false);
        setIsProcessingAd(false);
        AdService.resetState();
        
        // Pequeno atraso para garantir que o estado anterior seja limpo
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mostrar o anúncio de demonstração
        console.log('CreditsContext: Definindo adVisible como true');
        setAdVisible(true);
        
        // Registrar o callback para quando o anúncio for concluído
        AdService.showAd((result) => {
          console.log('CreditsContext: Callback do anúncio chamado com sucesso:', result);
          // Não precisamos fazer nada aqui, os créditos já foram adicionados
        });
        
        // Fechar o anúncio após um tempo para garantir que o usuário possa continuar
        setTimeout(() => {
          console.log('CreditsContext: Fechando anúncio automaticamente após timeout');
          setAdVisible(false);
          setIsProcessingAd(false);
        }, 7000); // Fechar após 7 segundos (tempo suficiente para ver o anúncio)
      } catch (adError) {
        console.error('CreditsContext: Erro ao tentar mostrar anúncio:', adError);
        // Não fazer nada, os créditos já foram adicionados
      }
      
      return true;
    } catch (error) {
      console.error('CreditsContext: Erro ao processar anúncio:', error);
      
      // Garantir que os créditos sejam adicionados mesmo em caso de erro
      try {
        const newCredits = 2;
        await AsyncStorage.setItem('credits', newCredits.toString());
        setCredits(newCredits);
        console.log('CreditsContext: Créditos adicionados após erro:', newCredits);
        
        Alert.alert('Aviso', 'Houve um problema ao exibir o anúncio, mas você recebeu 2 créditos mesmo assim.');
      } catch (storageError) {
        console.error('CreditsContext: Erro ao salvar créditos:', storageError);
        Alert.alert('Erro', 'Ocorreu um erro ao adicionar créditos. Por favor, reinicie o aplicativo.');
      }
      
      setAdVisible(false); // Garantir que o modal seja fechado em caso de erro
      setIsProcessingAd(false); // Resetar o estado de processamento
      return true; // Retornar true para não interromper o fluxo
    }
  };
  
  // Função para fechar o anúncio
  const handleCloseAd = () => {
    console.log('CreditsContext: handleCloseAd chamado');
    try {
      // Verificar se o anúncio está visível antes de tentar fechá-lo
      if (!AdService.isAdVisible()) {
        console.log('CreditsContext: Anúncio já está fechado');
        return;
      }
      
      console.log('CreditsContext: Definindo adVisible como false');
      setAdVisible(false);
      
      console.log('CreditsContext: Notificando AdService para esconder o anúncio');
      AdService.hideAd();
      
      console.log('CreditsContext: Anúncio fechado com sucesso');
    } catch (error) {
      console.error('CreditsContext: Erro ao fechar anúncio:', error);
      // Garantir que o estado seja atualizado mesmo em caso de erro
      setAdVisible(false);
    }
  };
  
  // Função chamada quando o anúncio é concluído
  const handleAdCompleted = async () => {
    console.log('CreditsContext: handleAdCompleted chamado');
    
    try {
      // Verificar se já está processando
      if (isProcessingAd) {
        console.log('CreditsContext: Já está processando a conclusão do anúncio');
        return;
      }
      
      // Marcar como processando
      setIsProcessingAd(true);
      console.log('CreditsContext: Iniciando processamento da conclusão do anúncio');
      
      // Notificar o serviço que o anúncio foi concluído
      console.log('CreditsContext: Notificando AdService que o anúncio foi concluído');
      AdService.completeAd();
      
      // Fechar o anúncio
      console.log('CreditsContext: Definindo adVisible como false');
      setAdVisible(false);
      
      // Resetar o estado de processamento
      setIsProcessingAd(false);
      console.log('CreditsContext: Anúncio concluído com sucesso');
    } catch (error) {
      console.error('CreditsContext: Erro ao processar conclusão do anúncio:', error);
      
      // Garantir que o modal seja fechado em caso de erro
      setAdVisible(false);
      setIsProcessingAd(false);
    }
  };

  return (
    <CreditsContext.Provider
      value={{
        credits,
        plan,
        subscriptionEndDate,
        billingCycle,
        loading,
        useCredit,
        earnCreditsFromAd,
        updatePlan,
        loadCredits,
        saveCredits,
        PLANS_INFO,
      }}
    >
      {children}
      
      {/* Componente de anúncio de demonstração */}
      <DemoAdScreen
        visible={adVisible}
        onClose={handleCloseAd}
        onAdCompleted={handleAdCompleted}
      />
    </CreditsContext.Provider>
  );
};

export const useCredits = () => useContext(CreditsContext);
