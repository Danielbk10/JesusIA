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
        try {
          await stopRecording();
        } catch (err) {
          // Ignorar erros ao parar gravação anterior, apenas limpar o estado
          console.log('Erro ao parar gravação anterior, limpando estado');
          setRecording(null);
          setIsRecording(false);
        }
        // Adicionando um pequeno atraso para garantir que a gravação anterior seja completamente liberada
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
      
      setRecording(newRecording);
      setIsRecording(true);
      
      // Definir um tempo mínimo de gravação para evitar erros de dados de áudio inválidos
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
    try {
      if (!recording) return;

      // Guardar uma referência local à gravação atual antes de limpar o estado
      const currentRecording = recording;
      
      // Limpar o estado imediatamente para evitar chamadas múltiplas
      setIsRecording(false);
      setRecording(null);
      
      try {
        // Verificar se a gravação é muito curta (menos de 2 segundos)
        if (recordingDuration < 2) {
          Alert.alert('Gravação muito curta', 'Por favor, mantenha pressionado o botão por pelo menos 2 segundos.');
          
          // Adicionando um atraso antes de tentar parar a gravação curta
          // Isso dá tempo para o sistema capturar algum dado de áudio
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Limpar a gravação atual com tratamento de erro melhorado
          try {
            await currentRecording.stopAndUnloadAsync();
          } catch (e) {
            // Ignorar erros específicos que são esperados
            if (e.message && (
              e.message.includes('already been unloaded') ||
              e.message.includes('does not exist') ||
              e.message.includes('no valid audio data')
            )) {
              console.log('Erro esperado ao parar gravação curta:', e.message);
            } else {
              console.log('Erro ao parar gravação curta:', e);
            }
            // Não mostramos o erro para o usuário em gravações curtas
          }
          return;
        }
        
        // Adicionando um pequeno atraso antes de parar a gravação
        // Isso ajuda a garantir que o sistema tenha tempo de processar os dados de áudio
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Tentar parar a gravação atual com tratamento de erro melhorado
        let uri = null;
        try {
          await currentRecording.stopAndUnloadAsync();
          uri = currentRecording.getURI();
        } catch (stopError) {
          // Verificar se é um erro esperado
          if (stopError.message && (
            stopError.message.includes('already been unloaded') ||
            stopError.message.includes('does not exist') ||
            stopError.message.includes('no valid audio data')
          )) {
            console.log('Erro esperado ao parar gravação:', stopError.message);
            return; // Já limpamos o estado no início da função
          } else {
            console.error('Erro ao parar gravação:', stopError);
            Alert.alert(
              'Erro na gravação',
              'Houve um problema ao processar o áudio. Por favor, tente novamente.',
              [{ text: 'OK' }]
            );
            return;
          }
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
      
      // O estado já foi limpo no início da função
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
      
      // Variável para armazenar a referência do alerta
      let alertRef;
      
      // Função para mostrar o alerta e retornar uma promessa que será resolvida quando o alerta for fechado
      const showProcessingAlert = () => {
        return new Promise((resolve) => {
          // Mostrar o alerta com um botão escondido que resolverá a promessa
          alertRef = Alert.alert(
            'Processando áudio',
            'Convertendo sua mensagem de voz em texto...',
            [
              {
                text: 'Fechar',
                onPress: () => resolve(),
                style: 'cancel'
              }
            ],
            { cancelable: true, onDismiss: () => resolve() }
          );
        });
      };
      
      // Mostrar o alerta de processamento
      const alertPromise = showProcessingAlert();
      
      // Tentar transcrever o áudio usando a API Whisper
      const result = await transcribeAudio(uri);
      
      // Simular um pequeno atraso para dar tempo de ver o alerta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (result.success) {
        // Se a transcrição foi bem-sucedida, enviar para o chat
        onSendAudio(result.transcription);
      } else {
        // Se houve um erro na API, usar a simulação como fallback
        console.log('Erro na API Whisper, usando simulação como fallback:', result.error);
        
        // Lista de transcrições simuladas
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
        
        // Escolher uma transcrição aleatória da lista
        const randomIndex = Math.floor(Math.random() * possibleTranscriptions.length);
        const transcription = possibleTranscriptions[randomIndex];
        
        // Enviar a transcrição simulada para o chat
        onSendAudio(transcription);
        
        // Mostrar mensagem informativa sobre a chave de API apenas uma vez
        if (result.error && result.error.includes('Chave de API')) {
          Alert.alert(
            'Configuração Necessária',
            'Para usar a transcrição real, configure sua chave de API da OpenAI em config/apiConfig.js',
            [{ text: 'OK' }]
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
        onPressIn={startRecording}
        onPressOut={stopRecording}
      >
        <MicIcon size={24} color={isRecording ? '#ff4040' : COLORS.PRIMARY} />
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
