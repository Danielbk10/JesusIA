import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { ELEVEN_LABS_CONFIG, DEFAULT_VOICE_ID } from '../config/elevenLabsConfig';

// Classe para gerenciar a interação com a API do Eleven Labs
class ElevenLabsService {
  constructor() {
    this.apiKey = ELEVEN_LABS_CONFIG.API_KEY;
    this.apiUrl = ELEVEN_LABS_CONFIG.API_URL;
    this.defaultVoiceId = DEFAULT_VOICE_ID;
    this.sound = null;
    this.isSpeaking = false;
  }

  // Método para definir a chave API
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Método para obter a lista de vozes disponíveis
  async getVoices() {
    try {
      console.log('Obtendo vozes do Eleven Labs com chave API:', this.apiKey.substring(0, 10) + '...');
      console.log('URL da API:', `${this.apiUrl}/voices`);
      
      const response = await axios.get(`${this.apiUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Accept': 'application/json',
        },
      });
      
      console.log('Vozes obtidas com sucesso:', response.data.voices.length);
      return response.data.voices;
    } catch (error) {
      console.error('Erro ao obter vozes do Eleven Labs:');
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error('Resposta:', error.response.data);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  // Método para converter texto em fala e reproduzir
  async textToSpeech(text, voiceId = this.defaultVoiceId) {
    if (!text || text.trim() === '') return;
    
    try {
      // Verificar se a chave API está definida
      if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
        console.error('Chave API do Eleven Labs não definida');
        throw new Error('Chave API do Eleven Labs não definida');
      }
      
      console.log('Usando Eleven Labs com chave API:', this.apiKey.substring(0, 10) + '...');
      
      // Parar qualquer áudio em reprodução
      await this.stopSpeaking();
      
      this.isSpeaking = true;
      
      // Gerar um nome de arquivo temporário único
      const fileName = `eleven_labs_audio_${Date.now()}.mp3`;
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;
      
      console.log('Iniciando requisição para Eleven Labs com voz:', voiceId);
      console.log('Usando chave API:', this.apiKey.substring(0, 5) + '...');
      
      // Configurações para a requisição
      const options = {
        method: 'POST',
        url: `${this.apiUrl}/text-to-speech/${voiceId}`,
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        data: {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: ELEVEN_LABS_CONFIG.VOICE_SETTINGS,
        },
        responseType: 'arraybuffer',
        timeout: 30000, // Timeout de 30 segundos
      };
      
      console.log('Enviando requisição para Eleven Labs:', {
        url: options.url,
        voiceId,
        text: text.substring(0, 20) + '...',
      });
      
      // Fazer a requisição para a API
      console.log('Enviando requisição para Eleven Labs com chave API:', this.apiKey);
      
      const response = await axios(options);
      console.log('Resposta recebida do Eleven Labs com sucesso, tamanho:', response.data.byteLength);
      
      // Salvar o áudio recebido em um arquivo temporário
      await FileSystem.writeAsStringAsync(filePath, arrayBufferToBase64(response.data), {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('Arquivo de áudio salvo com sucesso em:', filePath);
      
      // Carregar e reproduzir o áudio
      this.sound = new Audio.Sound();
      await this.sound.loadAsync({ uri: filePath });
      
      // Configurar o callback para quando o áudio terminar
      this.sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          this.isSpeaking = false;
          this.sound = null;
        }
      });
      
      // Reproduzir o áudio
      await this.sound.playAsync();
      
      return true;
    } catch (error) {
      console.error('Erro ao converter texto em fala com Eleven Labs:', error);
      this.isSpeaking = false;
      throw error;
    }
  }
  
  // Método para parar a reprodução do áudio
  async stopSpeaking() {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      } catch (error) {
        console.error('Erro ao parar a reprodução:', error);
      }
    }
    this.isSpeaking = false;
  }
  
  // Método para verificar se está falando
  isCurrentlySpeaking() {
    return this.isSpeaking;
  }
}

// Função auxiliar para converter ArrayBuffer para Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Exportar uma instância única do serviço
export const elevenLabsService = new ElevenLabsService();
