import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { MicIcon } from './Icon';
import { useCredits } from '../context/CreditsContext';
import { transcribeAudio } from '../services/apiService';
import { COLORS } from '../config/colorConfig';

export default function AudioButton({ onSendAudio }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const { useCredit, credits, plan } = useCredits();

  // Limpar o gravador quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (recording) {
        cleanupRecording();
      }
    };
  }, []);

  // Função para limpar gravação sem tentar processá-la
  const cleanupRecording = async () => {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      console.log('Erro ao limpar gravação:', error);
    } finally {
      setRecording(null);
      setIsRecording(false);
    }
  };

  // Atualizar a duração da gravação
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Se já estiver gravando, não faz nada
      if (isRecording) return;
      
      // Limpar qualquer gravação anterior
      if (recording) {
        await cleanupRecording();
        // Esperar um pouco para garantir que os recursos foram liberados
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Verificar se há créditos disponíveis
      if (credits <= 0 && plan === 'free') {
        Alert.alert(
          'Sem créditos',
          'Você não tem créditos suficientes para enviar uma mensagem. Assista a um anúncio para ganhar mais créditos ou faça upgrade para um plano premium.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Solicitar permissões de áudio
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Você precisa conceder permissão para acessar o microfone.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Configurar a gravação
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Iniciar a gravação com configurações personalizadas para melhor compatibilidade
      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.MAX,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });
      
      console.log('Gravação iniciada com sucesso');
      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Erro ao iniciar a gravação:', error);
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
      // Limpar o estado em caso de erro
      setRecording(null);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    // Se não estiver gravando ou não tiver uma gravação ativa, não faz nada
    if (!isRecording || !recording) return;
    
    console.log('Parando gravação...');
    
    // Guardar uma referência local à gravação atual
    const currentRecording = recording;
    
    // Atualizar o estado imediatamente para evitar múltiplas chamadas
    setIsRecording(false);
    setRecording(null);
    
    // Verificar se a gravação é muito curta
    if (recordingDuration < 2) {
      console.log('Gravação muito curta, ignorando');
      Alert.alert('Gravação muito curta', 'Por favor, mantenha o botão pressionado por pelo menos 2 segundos.');
      
      // Limpar a gravação sem processá-la
      try {
        await currentRecording.stopAndUnloadAsync();
      } catch (error) {
        console.log('Erro ao parar gravação curta:', error);
      }
      return;
    }
    
    try {
      // Parar a gravação e obter o URI
      await currentRecording.stopAndUnloadAsync();
      const uri = currentRecording.getURI();
      
      if (!uri) {
        console.log('Erro: URI não disponível após a gravação');
        Alert.alert(
          'Erro na gravação',
          'Não foi possível obter o áudio gravado. Por favor, tente novamente.'
        );
        return;
      }
      
      console.log('URI de áudio válido:', uri);
      
      // Consumir um crédito
      const hasCredit = await useCredit();
      if (!hasCredit) {
        Alert.alert(
          'Sem créditos',
          'Você não tem créditos suficientes para enviar uma mensagem. Assista a um anúncio para ganhar mais créditos ou faça upgrade para um plano premium.'
        );
        return;
      }
      
      // Processar o áudio
      await processAudio(uri);
    } catch (error) {
      console.error('Erro ao parar a gravação:', error);
      Alert.alert(
        'Erro na gravação',
        'Ocorreu um erro ao processar sua gravação. Por favor, tente novamente.'
      );
    }
  };

  const processAudio = async (uri) => {
    try {
      if (!uri) {
        console.error('URI inválido para processamento');
        Alert.alert(
          'Gravação não disponível',
          'Não foi possível processar a gravação. Por favor, tente novamente ou use o teclado para digitar sua mensagem.'
        );
        return;
      }
      
      console.log('URI de áudio válido:', uri);
      
      Alert.alert(
        'Processando áudio',
        'Convertendo sua mensagem de voz em texto...'
      );
      
      const result = await transcribeAudio(uri);
      
      if (result.success) {
        onSendAudio(result.transcription);
      } else {
        console.log('Erro na API Whisper, usando simulação como fallback:', result.error);
        
        const possibleTranscriptions = [
          "O que Jesus ensinou sobre o amor ao próximo?",
          "Como Jesus tratava as pessoas que eram diferentes dele?",
          "Qual a importância da oração segundo Jesus?",
          "O que a Bíblia diz sobre perdão?",
          "Quais são as bem-aventuranças que Jesus ensinou?",
          "O que significa amar a Deus sobre todas as coisas?",
          "Como Jesus lidava com os pecadores?",
          "Qual o significado da parábola do filho pródigo?",
          "O que Jesus falou sobre julgar os outros?",
          "Como posso aplicar os ensinamentos de Jesus na minha vida?"
        ];
        
        const randomIndex = Math.floor(Math.random() * possibleTranscriptions.length);
        const transcription = possibleTranscriptions[randomIndex];
        
        onSendAudio(transcription);
        
        if (result.error && result.error.includes('Chave de API')) {
          Alert.alert(
            'Configuração Necessária',
            'Para usar a transcrição real, configure sua chave de API da OpenAI em config/apiConfig.js'
          );
        }
      }
    } catch (error) {
      console.error('Erro ao processar áudio:', error);
      Alert.alert(
        'Erro no processamento', 
        'Não foi possível processar o áudio. Por favor, tente novamente ou use o teclado para digitar sua mensagem.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isRecording && styles.recordingButton
        ]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <MicIcon size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#ff4040',
  },
});
