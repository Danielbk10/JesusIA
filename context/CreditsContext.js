import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  static async showRewardedAd() {
    return new Promise(async (resolve) => {
      // Simulação de exibição de anúncio
      console.log('Exibindo anúncio recompensado...');
      
      // Simulação de um atraso para representar o tempo de exibição do anúncio
      setTimeout(() => {
        console.log('Anúncio concluído!');
        resolve(true); // Anúncio exibido com sucesso
      }, 2000);
    });
  }
}

const CreditsContext = createContext();

export const CreditsProvider = ({ children }) => {
  const [credits, setCredits] = useState(5); // Padrão: 5 créditos
  const [plan, setPlan] = useState(SUBSCRIPTION_PLANS.FREE); // Padrão: plano gratuito
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

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
        }
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

  const updatePlan = async (newPlan, endDate = null) => {
    try {
      await AsyncStorage.setItem('plan', newPlan);
      setPlan(newPlan);

      // Se for um plano pago, definir os créditos conforme o plano
      if (newPlan !== SUBSCRIPTION_PLANS.FREE) {
        await AsyncStorage.setItem('credits', PLANS_INFO[newPlan].credits.toString());
        setCredits(PLANS_INFO[newPlan].credits);
        
        // Salvar a data de término da assinatura
        if (endDate) {
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
      const adResult = await AdService.showRewardedAd();
      
      if (adResult) {
        // Adicionar 2 créditos como recompensa pelo anúncio
        const newCredits = credits + 2;
        await saveCredits(newCredits);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao exibir anúncio:', error);
      return false;
    }
  };

  return (
    <CreditsContext.Provider
      value={{
        credits,
        plan,
        subscriptionEndDate,
        loading,
        useCredit,
        earnCreditsFromAd,
        updatePlan,
        loadCredits,
        PLANS_INFO,
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => useContext(CreditsContext);
