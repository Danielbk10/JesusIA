import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useCredits, SUBSCRIPTION_PLANS, PLANS_INFO } from '../context/CreditsContext';
import { COLORS } from '../config/colorConfig';

export default function SubscriptionPlans({ onClose }) {
  const { plan, updatePlan, billingCycle: contextBillingCycle } = useCredits();
  const [billingCycle, setBillingCycle] = useState(contextBillingCycle || 'annual'); // 'annual' ou 'monthly'
  const [toggleAnimation] = useState(new Animated.Value(billingCycle === 'annual' ? 1 : 0));
  
  // Função para alternar entre planos anuais e mensais
  const toggleBillingCycle = () => {
    const newBillingCycle = billingCycle === 'annual' ? 'monthly' : 'annual';
    setBillingCycle(newBillingCycle);
    
    // Animar o toggle
    Animated.timing(toggleAnimation, {
      toValue: newBillingCycle === 'annual' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  // Calcular o preço com base no ciclo de cobrança
  const calculatePrice = (basePrice) => {
    if (billingCycle === 'annual') {
      // Desconto de 20% para planos anuais
      const annualPrice = basePrice * 12 * 0.8;
      return (annualPrice / 12).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  const handleSubscribe = (selectedPlan) => {
    // Simulação de compra - em um app real, aqui você integraria com um gateway de pagamento
    const planPrice = calculatePrice(PLANS_INFO[selectedPlan].price);
    const cycleText = billingCycle === 'annual' ? 'anual (cobrado mensalmente)' : 'mensal';
    
    Alert.alert(
      'Confirmar Assinatura',
      `Você deseja assinar o plano ${PLANS_INFO[selectedPlan].name} por R$${planPrice}/mês com faturamento ${cycleText}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            // Simular uma data de término da assinatura (1 mês a partir de agora para mensal, 12 meses para anual)
            const endDate = new Date();
            // A lógica para adicionar meses está no método updatePlan
            
            updatePlan(selectedPlan, endDate, billingCycle);
            
            // Calcular a data de exibição com base no ciclo de cobrança
            const displayDate = new Date(endDate);
            if (billingCycle === 'annual') {
              displayDate.setMonth(displayDate.getMonth() + 12);
            } else {
              displayDate.setMonth(displayDate.getMonth() + 1);
            }
            
            Alert.alert(
              'Assinatura Confirmada',
              `Você agora é um assinante ${PLANS_INFO[selectedPlan].name} com faturamento ${billingCycle === 'annual' ? 'anual' : 'mensal'}! Sua assinatura é válida até ${displayDate.toLocaleDateString()}.`,
              [{ text: 'OK', onPress: onClose }]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planos de Assinatura</Text>
      <Text style={styles.subtitle}>Escolha o plano que melhor se adapta às suas necessidades</Text>
      
      {/* Toggle para alternar entre planos anuais e mensais */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleOption, billingCycle === 'monthly' && styles.toggleOptionActive]} 
          onPress={() => toggleBillingCycle()}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, billingCycle === 'monthly' && styles.toggleTextActive]}>Mensal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleOption, billingCycle === 'annual' && styles.toggleOptionActive]} 
          onPress={() => toggleBillingCycle()}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, billingCycle === 'annual' && styles.toggleTextActive]}>Anual</Text>
          <View style={styles.bestValueBadge}>
            <Text style={styles.bestValueText}>Melhor</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.plansContainer}>
        {Object.keys(PLANS_INFO).map((planKey) => {
          const planInfo = PLANS_INFO[planKey];
          const isCurrentPlan = plan === planKey;
          
          return (
            <View 
              key={planKey}
              style={[
                styles.planCard,
                isCurrentPlan && styles.currentPlanCard
              ]}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{planInfo.name}</Text>
                {planKey !== SUBSCRIPTION_PLANS.FREE && (
                  <View>
                    <Text style={styles.planPrice}>
                      R${calculatePrice(planInfo.price)}/mês
                    </Text>
                    {billingCycle === 'annual' && (
                      <Text style={styles.discountText}>Economia de 20%</Text>
                    )}
                  </View>
                )}
              </View>
              
              <View style={styles.featuresContainer}>
                {planInfo.features.map((feature, index) => (
                  <Text key={index} style={styles.featureText}>
                    • {feature}
                  </Text>
                ))}
              </View>
              
              {!isCurrentPlan && planKey !== SUBSCRIPTION_PLANS.FREE && (
                <TouchableOpacity 
                  style={styles.subscribeButton}
                  onPress={() => handleSubscribe(planKey)}
                >
                  <Text style={styles.subscribeButtonText}>Assinar</Text>
                </TouchableOpacity>
              )}
              
              {isCurrentPlan && (
                <View style={styles.currentPlanBadge}>
                  <Text style={styles.currentPlanText}>Plano Atual</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    marginBottom: 30,
    alignSelf: 'center',
    padding: 4,
  },
  toggleOption: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  toggleOptionActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  toggleText: {
    fontSize: 16,
    color: '#ddd',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bestValueText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  plansContainer: {
    flex: 1,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currentPlanCard: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  planPrice: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  discountText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 8,
  },
  subscribeButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentPlanBadge: {
    backgroundColor: 'rgba(117, 100, 49, 0.2)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  currentPlanText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
