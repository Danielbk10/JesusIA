import { OPENAI_API_KEY, API_ENDPOINTS, MODELS, SYSTEM_PROMPT } from '../config/apiConfig';
import * as FileSystem from 'expo-file-system';

// Função para transcrever áudio usando a API Whisper da OpenAI
export const transcribeAudio = async (audioUri) => {
  try {
    // Verificar se a chave de API foi configurada
    if (OPENAI_API_KEY === 'SUA_CHAVE_API_AQUI') {
      console.log('Chave de API da OpenAI não configurada');
      return {
        success: false,
        error: 'Chave de API da OpenAI não configurada. Por favor, configure sua chave em config/apiConfig.js',
      };
    }

    // Preparar o arquivo de áudio para upload
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) {
      console.log('Arquivo de áudio não encontrado:', audioUri);
      return {
        success: false,
        error: 'Arquivo de áudio não encontrado',
      };
    }

    // Criar um FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });
    formData.append('model', MODELS.WHISPER);
    formData.append('language', 'pt'); // Português

    // Fazer a requisição para a API Whisper
    const response = await fetch(API_ENDPOINTS.WHISPER_TRANSCRIPTION, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    // Processar a resposta
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        transcription: data.text,
      };
    } else {
      console.error('Erro na API Whisper:', data);
      return {
        success: false,
        error: data.error?.message || 'Erro ao transcrever áudio',
      };
    }
  } catch (error) {
    console.error('Erro ao transcrever áudio:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao transcrever áudio',
    };
  }
};

// Função para obter resposta do ChatGPT
export const getChatResponse = async (message) => {
  try {
    // Verificar se a chave de API foi configurada
    if (OPENAI_API_KEY === 'SUA_CHAVE_API_AQUI') {
      console.log('Chave de API da OpenAI não configurada');
      return {
        success: false,
        error: 'Chave de API da OpenAI não configurada. Por favor, configure sua chave em config/apiConfig.js',
      };
    }

    // Preparar os dados para a API
    const payload = {
      model: MODELS.CHAT,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    };

    // Fazer a requisição para a API do ChatGPT
    const response = await fetch(API_ENDPOINTS.CHAT_COMPLETION, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Processar a resposta
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        response: data.choices[0].message.content,
      };
    } else {
      console.error('Erro na API ChatGPT:', data);
      return {
        success: false,
        error: data.error?.message || 'Erro ao obter resposta',
      };
    }
  } catch (error) {
    console.error('Erro ao obter resposta do ChatGPT:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao obter resposta',
    };
  }
};
