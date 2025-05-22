// Script para testar a conexão com a API do Eleven Labs
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuração do Eleven Labs (mesma do seu aplicativo)
const ELEVEN_LABS_CONFIG = {
  API_KEY: '43096fc8b313451732a10bb8fe652749e3a70e5ded7847ed',
  API_URL: 'https://api.elevenlabs.io/v1',
  VOICE_ID: 'pNInz6obpgDQGcFmaJgB', // Raphael - voz masculina em português
};

// Função para testar a obtenção das vozes disponíveis
async function testGetVoices() {
  try {
    console.log('Testando obtenção de vozes...');
    console.log('Usando chave API:', ELEVEN_LABS_CONFIG.API_KEY);
    
    const response = await axios.get(`${ELEVEN_LABS_CONFIG.API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVEN_LABS_CONFIG.API_KEY,
        'Accept': 'application/json',
      },
    });
    
    console.log('Vozes obtidas com sucesso!');
    console.log(`Total de vozes: ${response.data.voices.length}`);
    
    // Listar vozes em português
    const ptVoices = response.data.voices.filter(voice => 
      voice.name.toLowerCase().includes('portuguese') || 
      voice.labels?.language?.toLowerCase().includes('portuguese')
    );
    
    console.log('Vozes em português:');
    ptVoices.forEach(voice => {
      console.log(`- ${voice.name} (ID: ${voice.voice_id})`);
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao obter vozes:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Resposta:', error.response.data);
    } else {
      console.error(error.message);
    }
    return false;
  }
}

// Função para testar a conversão de texto em fala
async function testTextToSpeech() {
  try {
    console.log('\nTestando conversão de texto em fala...');
    console.log('Usando voz ID:', ELEVEN_LABS_CONFIG.VOICE_ID);
    
    const text = 'Olá, este é um teste da API do Eleven Labs. Espero que esteja funcionando corretamente.';
    
    const options = {
      method: 'POST',
      url: `${ELEVEN_LABS_CONFIG.API_URL}/text-to-speech/${ELEVEN_LABS_CONFIG.VOICE_ID}`,
      headers: {
        'xi-api-key': ELEVEN_LABS_CONFIG.API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      data: {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        },
      },
      responseType: 'arraybuffer',
    };
    
    console.log('Enviando requisição para Eleven Labs...');
    const response = await axios(options);
    
    console.log('Resposta recebida com sucesso!');
    console.log(`Tamanho do áudio: ${response.data.byteLength} bytes`);
    
    // Salvar o áudio em um arquivo
    const outputPath = path.join(__dirname, 'test-audio.mp3');
    fs.writeFileSync(outputPath, response.data);
    
    console.log(`Áudio salvo em: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Erro ao converter texto em fala:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      if (error.response.data) {
        // Tentar converter o buffer para texto se possível
        try {
          const errorData = Buffer.from(error.response.data).toString('utf8');
          console.error('Resposta:', errorData);
        } catch (e) {
          console.error('Não foi possível ler os dados da resposta');
        }
      }
    } else {
      console.error(error.message);
    }
    return false;
  }
}

// Função principal para executar os testes
async function runTests() {
  console.log('=== TESTE DA API DO ELEVEN LABS ===');
  
  // Testar obtenção de vozes
  const voicesSuccess = await testGetVoices();
  
  // Testar conversão de texto em fala
  if (voicesSuccess) {
    await testTextToSpeech();
  }
  
  console.log('\n=== TESTE CONCLUÍDO ===');
}

// Executar os testes
runTests();
