import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { MicIcon } from './Icon';
import { useCredits } from '../context/CreditsContext';

export default function AudioButton({ onSendAudio }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const { useCredit, credits, plan } = useCredits();

  // Limpar o gravador quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

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
      // Verificar se já existe uma gravação ativa
      if (recording) {
        console.log('Já existe uma gravação ativa, parando a anterior');
        await stopRecording();
        return;
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

      // Iniciar a gravação
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar a gravação:', error);
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
      // Limpar o estado em caso de erro
      setRecording(null);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      
      try {
        // Verificar se a gravação é muito curta (menos de 1 segundo)
        if (recordingDuration < 1) {
          Alert.alert('Gravação muito curta', 'Por favor, grave uma mensagem mais longa.');
          // Limpar a gravação atual
          try {
            await recording.stopAndUnloadAsync();
          } catch (e) {
            console.log('Erro ao parar gravação curta:', e);
          }
          setRecording(null);
          return;
        }
        
        // Tentar parar a gravação atual com tratamento de erro melhorado
        let uri = null;
        try {
          await recording.stopAndUnloadAsync();
          uri = recording.getURI();
        } catch (stopError) {
          console.error('Erro ao parar gravação:', stopError);
          Alert.alert(
            'Erro na gravação',
            'Houve um problema ao processar o áudio. Por favor, tente novamente.',
            [{ text: 'OK' }]
          );
          setRecording(null);
          return;
        }
        
        // Verificar se temos um URI válido
        if (!uri) {
          console.error('URI de áudio inválido após gravação');
          Alert.alert(
            'Erro na gravação',
            'Não foi possível obter o áudio gravado. Por favor, tente novamente.',
            [{ text: 'OK' }]
          );
          setRecording(null);
          return;
        }
        
        // Consumir um crédito
        const hasCredit = await useCredit();
        if (!hasCredit) {
          Alert.alert(
            'Sem créditos',
            'Você não tem créditos suficientes para enviar uma mensagem. Assista a um anúncio para ganhar mais créditos ou faça upgrade para um plano premium.',
            [{ text: 'OK' }]
          );
          setRecording(null);
          return;
        }
        
        // Processar o áudio
        processAudio(uri);
      } catch (innerError) {
        console.error('Erro ao processar a gravação:', innerError);
        Alert.alert(
          'Erro na gravação',
          'Ocorreu um erro inesperado. Por favor, tente novamente ou use o teclado para digitar sua mensagem.',
          [{ text: 'OK' }]
        );
      }
      
      // Limpar o estado em qualquer caso
      setRecording(null);
    } catch (error) {
      console.error('Erro ao parar a gravação:', error);
      Alert.alert('Erro', 'Não foi possível finalizar a gravação.');
      setRecording(null);
      setIsRecording(false);
    }
  };

  const processAudio = async (uri) => {
    try {
      // Verificar se o URI é válido
      if (!uri) {
        console.log('URI de áudio inválido ou não disponível');
        Alert.alert(
          'Gravação não disponível',
          'Não foi possível processar a gravação. Por favor, tente novamente ou use o teclado para digitar sua mensagem.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      console.log('URI de áudio válido:', uri);
      
      // Em um aplicativo real, você enviaria o áudio para o servidor
      // e processaria a transcrição e a resposta
      
      // Mostrar um alerta para o usuário gravar uma mensagem real
      Alert.alert(
        'Gravação de Áudio',
        'Em um aplicativo completo, seu áudio seria enviado para o servidor e processado. Por enquanto, você pode digitar sua mensagem.',
        [{ text: 'OK' }]
      );
      
      // Não enviamos uma mensagem automática
      // onSendAudio(transcription);
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
        onPressIn={startRecording}
        onPressOut={stopRecording}
      >
        <MicIcon size={24} color={isRecording ? '#ff4040' : '#fff'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: '#00a884',
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
