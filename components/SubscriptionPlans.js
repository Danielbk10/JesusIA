import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useCredits, SUBSCRIPTION_PLANS, PLANS_INFO } from '../context/CreditsContext';

export default function SubscriptionPlans({ onClose }) {
  const { plan, updatePlan } = useCredits();

  const handleSubscribe = (selectedPlan) => {
    // Simulação de compra - em um app real, aqui você integraria com um gateway de pagamento
    Alert.alert(
      'Confirmar Assinatura',
      `Você deseja assinar o plano ${PLANS_INFO[selectedPlan].name} por R$${PLANS_INFO[selectedPlan].price}/mês?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            // Simular uma data de término da assinatura (1 mês a partir de agora)
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            
            updatePlan(selectedPlan, endDate);
            Alert.alert(
              'Assinatura Confirmada',
              `Você agora é um assinante ${PLANS_INFO[selectedPlan].name}! Sua assinatura é válida até ${endDate.toLocaleDateString()}.`,
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
                  <Text style={styles.planPrice}>
                    R${planInfo.price}/mês
                  </Text>
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
    marginBottom: 30,
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
    borderColor: '#00a884',
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
    color: '#00a884',
    fontWeight: 'bold',
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
    backgroundColor: '#00a884',
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
    backgroundColor: 'rgba(0, 168, 132, 0.2)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  currentPlanText: {
    color: '#00a884',
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
