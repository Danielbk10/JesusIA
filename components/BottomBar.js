import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCredits } from '../context/CreditsContext';
import { COLORS } from '../config/colorConfig';
import { FONTS } from '../config/fontConfig';

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
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.plansButton}
          onPress={onOpenPlans}
        >
          <Text style={styles.plansButtonText}>Ver Planos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsLabel: {
    color: '#aaa',
    fontSize: 12,
    marginRight: 6,
  },
  creditsValue: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.SERIF,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  plansButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  plansButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: FONTS.SERIF,
  },
});
