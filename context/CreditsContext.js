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
  
  static showAd(callback) {
    console.log('AdService: showAd chamado');
    // Armazenar o callback para ser chamado quando o anúncio for concluído
    this._adCallback = callback;
    this._adVisible = true;
    console.log('AdService: Estado do anúncio definido como visível');
  }
  
  static hideAd() {
    console.log('AdService: hideAd chamado');
    this._adVisible = false;
    console.log('AdService: Estado do anúncio definido como invisível');
  }
  
  static completeAd() {
    console.log('AdService: completeAd chamado');
    this._adVisible = false;
    console.log('AdService: Estado do anúncio definido como invisível');
    
    if (this._adCallback) {
      console.log('AdService: Executando callback do anúncio');
      try {
        this._adCallback(true);
        console.log('AdService: Callback executado com sucesso');
      } catch (error) {
        console.error('AdService: Erro ao executar callback:', error);
      }
      this._adCallback = null;
    } else {
      console.warn('AdService: Nenhum callback registrado para o anúncio');
    }
  }
  
  static isAdVisible() {
    return this._adVisible;
  }
  
  static async showRewardedAd() {
    console.log('AdService: showRewardedAd chamado');
    return new Promise((resolve) => {
      this.showAd((success) => {
        console.log('AdService: Resolvendo promessa de showRewardedAd com:', success);
        resolve(success);
      });
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

      // Garantir que o usuário sempre tenha pelo menos 5 créditos
      if (storedCredits !== null) {
        const parsedCredits = parseInt(storedCredits, 10);
        if (parsedCredits <= 0) {
          // Se os créditos estiverem zerados, restaurar para 5
          console.log('Créditos zerados, restaurando para 5');
          setCredits(5);
          await AsyncStorage.setItem('credits', '5');
        } else {
          setCredits(parsedCredits);
        }
      } else {
        // Se não houver créditos armazenados, definir como 5
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
      // Garantir que o estado do anúncio esteja limpo antes de exibi-lo
      AdService.hideAd();
      
      // Pequeno atraso para garantir que o estado anterior seja limpo
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mostrar o anúncio de demonstração
      console.log('CreditsContext: Definindo adVisible como true');
      setAdVisible(true);
      
      AdService.showAd((success) => {
        // Não adicionamos créditos aqui, pois isso é feito no handleAdCompleted
        console.log('CreditsContext: Callback do anúncio chamado com sucesso:', success);
      });
      
      console.log('CreditsContext: Anúncio iniciado com sucesso');
      return true;
    } catch (error) {
      console.error('CreditsContext: Erro ao exibir anúncio:', error);
      setAdVisible(false); // Garantir que o modal seja fechado em caso de erro
      return false;
    }
  };
  
  // Função para fechar o anúncio
  const handleCloseAd = () => {
    console.log('CreditsContext: handleCloseAd chamado');
    try {
      console.log('CreditsContext: Definindo adVisible como false');
      setAdVisible(false);
      
      console.log('CreditsContext: Notificando AdService para esconder o anúncio');
      AdService.hideAd();
      
      console.log('CreditsContext: Anúncio fechado com sucesso');
    } catch (error) {
      console.error('CreditsContext: Erro ao fechar anúncio:', error);
    }
  };
  
  // Função chamada quando o anúncio é concluído
  const handleAdCompleted = () => {
    console.log('CreditsContext: handleAdCompleted chamado');
    
    try {
      // Adicionar 2 créditos como recompensa pelo anúncio
      const newCredits = credits + 2;
      console.log('CreditsContext: Salvando novos créditos:', newCredits);
      saveCredits(newCredits);
      
      // Notificar o serviço que o anúncio foi concluído
      console.log('CreditsContext: Notificando AdService que o anúncio foi concluído');
      AdService.completeAd();
      
      // Fechar o anúncio após adicionar os créditos
      console.log('CreditsContext: Definindo adVisible como false');
      setAdVisible(false);
      
      // Mostrar alerta de sucesso
      Alert.alert(
        'Créditos Adicionados',
        `Você ganhou 2 créditos por assistir ao anúncio! Agora você tem ${newCredits} créditos.`,
        [{ text: 'OK' }]
      );
      
      console.log('CreditsContext: Anúncio concluído! Créditos adicionados:', newCredits);
    } catch (error) {
      console.error('CreditsContext: Erro ao processar conclusão do anúncio:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar créditos. Por favor, tente novamente.');
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
