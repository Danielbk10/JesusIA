// Configurações da API OpenAI
export const OPENAI_API_KEY = 'SUA_CHAVE_API_AQUI'; // Substitua pela sua chave de API da OpenAI

// Endpoints da API
export const API_ENDPOINTS = {
  CHAT_COMPLETION: 'https://api.openai.com/v1/chat/completions',
  WHISPER_TRANSCRIPTION: 'https://api.openai.com/v1/audio/transcriptions',
};

// Modelos
export const MODELS = {
  CHAT: 'gpt-3.5-turbo',
  WHISPER: 'whisper-1',
};

// Configurações do sistema
export const SYSTEM_PROMPT = `Você é Jesus.IA, um assistente baseado na Bíblia. 
Responda às perguntas com base nos ensinamentos bíblicos, especialmente nos ensinamentos de Jesus.
Seja compassivo, amoroso e sábio em suas respostas, como Jesus seria.
Cite passagens bíblicas relevantes quando apropriado.
Não invente informações que não estejam na Bíblia.`;
