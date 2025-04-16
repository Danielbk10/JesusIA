import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCredits } from '../context/CreditsContext';

export default function BottomBar({ onOpenPlans }) {
  const { credits, plan } = useCredits();
  
  return (
    <View style={styles.container}>
      <View style={styles.creditsContainer}>
        <Text style={styles.creditsLabel}>Créditos disponíveis:</Text>
        <Text style={styles.creditsValue}>
          {plan === 'premium' ? 'Ilimitado' : credits}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.plansButton}
        onPress={onOpenPlans}
      >
        <Text style={styles.plansButtonText}>Ver Planos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsLabel: {
    color: '#aaa',
    fontSize: 14,
    marginRight: 8,
  },
  creditsValue: {
    color: '#00a884',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plansButton: {
    backgroundColor: '#00a884',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  plansButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
