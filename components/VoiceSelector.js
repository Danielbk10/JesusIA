import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useSpeech } from '../context/SpeechContext';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const VoiceSelector = () => {
  const { 
    availableVoices, 
    selectedVoice, 
    selectVoice, 
    speak,
    speechRate,
    speechPitch
  } = useSpeech();
  
  const [ptBRVoices, setPtBRVoices] = useState([]);
  const [showAllVoices, setShowAllVoices] = useState(false);
  
  // Filtrar vozes em português brasileiro
  useEffect(() => {
    if (availableVoices && availableVoices.length > 0) {
      const filtered = availableVoices.filter(voice => 
        voice.language.includes('pt-BR') || 
        voice.language.includes('pt_BR') ||
        voice.language.includes('por_BRA')
      );
      
      setPtBRVoices(filtered);
      console.log(`Encontradas ${filtered.length} vozes em português`);
    }
  }, [availableVoices]);
  
  // Função para testar uma voz
  const testVoice = (voice) => {
    const testText = "Olá, esta é uma amostra da minha voz.";
    speak(testText);
  };
  
  // Renderizar cada item da lista de vozes
  const renderVoiceItem = ({ item }) => {
    const isSelected = selectedVoice === item.identifier;
    
    return (
      <TouchableOpacity
        style={[styles.voiceItem, isSelected && styles.selectedVoice]}
        onPress={() => selectVoice(item.identifier)}
      >
        <View style={styles.voiceInfo}>
          <Text style={styles.voiceName}>
            {item.name || `Voz ${item.identifier.split('.').pop()}`}
          </Text>
          <Text style={styles.voiceLanguage}>
            {item.language} {item.quality && `(${item.quality})`}
          </Text>
        </View>
        
        <View style={styles.voiceActions}>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => testVoice(item)}
          >
            <Ionicons name="volume-high" size={20} color="#fff" />
          </TouchableOpacity>
          
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Exibir mensagem se não houver vozes disponíveis
  if (!availableVoices || availableVoices.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noVoicesText}>
          Carregando vozes disponíveis...
        </Text>
      </View>
    );
  }
  
  // Exibir mensagem se não houver vozes em português
  if (ptBRVoices.length === 0 && !showAllVoices) {
    return (
      <View style={styles.container}>
        <Text style={styles.noVoicesText}>
          Não foram encontradas vozes em português brasileiro.
        </Text>
        <TouchableOpacity 
          style={styles.showAllButton}
          onPress={() => setShowAllVoices(true)}
        >
          <Text style={styles.showAllButtonText}>
            Mostrar todas as vozes disponíveis
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione uma voz</Text>
      
      {ptBRVoices.length > 0 && !showAllVoices ? (
        <>
          <Text style={styles.subtitle}>Vozes em Português ({ptBRVoices.length})</Text>
          <FlatList
            data={ptBRVoices}
            renderItem={renderVoiceItem}
            keyExtractor={(item) => item.identifier}
            style={styles.list}
          />
          {availableVoices.length > ptBRVoices.length && (
            <TouchableOpacity 
              style={styles.showAllButton}
              onPress={() => setShowAllVoices(true)}
            >
              <Text style={styles.showAllButtonText}>
                Mostrar todas as vozes ({availableVoices.length})
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Todas as Vozes ({availableVoices.length})</Text>
          <FlatList
            data={availableVoices}
            renderItem={renderVoiceItem}
            keyExtractor={(item) => item.identifier}
            style={styles.list}
          />
          {ptBRVoices.length > 0 && (
            <TouchableOpacity 
              style={styles.showAllButton}
              onPress={() => setShowAllVoices(false)}
            >
              <Text style={styles.showAllButtonText}>
                Mostrar apenas vozes em português ({ptBRVoices.length})
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Velocidade: {speechRate.toFixed(2)}
        </Text>
        <Text style={styles.infoText}>
          Tom: {speechPitch.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  list: {
    flex: 1,
  },
  voiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selectedVoice: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  voiceLanguage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  voiceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#2196F3',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVoicesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  showAllButton: {
    backgroundColor: '#673AB7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  showAllButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});

export default VoiceSelector;
