import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCredits, SUBSCRIPTION_PLANS } from '../context/CreditsContext';

export default function AdBanner({ onPressUpgrade }) {
  const { credits, plan, earnCreditsFromAd } = useCredits();

  // Se for um plano premium, não mostrar o banner
  if (plan !== SUBSCRIPTION_PLANS.FREE) {
    return null;
  }

  const handleWatchAd = async () => {
    const success = await earnCreditsFromAd();
    if (success) {
      // Anúncio assistido com sucesso, créditos já foram adicionados no contexto
      console.log('Créditos adicionados com sucesso!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.creditsText}>
          {credits === 0 
            ? 'Sem créditos restantes' 
            : `${credits} ${credits === 1 ? 'crédito' : 'créditos'} restantes`}
        </Text>
        
        <TouchableOpacity 
          style={styles.upgradeButton} 
          onPress={onPressUpgrade}
        >
          <Text style={styles.upgradeButtonText}>Fazer upgrade</Text>
        </TouchableOpacity>
      </View>
      
      {credits < 3 && (
        <TouchableOpacity 
          style={styles.adButton}
          onPress={handleWatchAd}
        >
          <Text style={styles.adButtonText}>
            Assistir anúncio para ganhar 2 créditos
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditsText: {
    color: '#fff',
    fontSize: 14,
  },
  upgradeButton: {
    backgroundColor: '#00a884',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  adButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  adButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});
