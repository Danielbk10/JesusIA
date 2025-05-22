// Configuração para a API do Eleven Labs
export const ELEVEN_LABS_CONFIG = {
  API_KEY: 'sk_3a953e02f6965c00a95cdad552305b05c4a83bbce277edbd', // Chave API do Eleven Labs (sem prefixo)
  API_URL: 'https://api.elevenlabs.io/v1',
  DEFAULT_VOICE_ID: 'pNInz6obpgDQGcFmaJgB', // Raphael - voz masculina em português
  // Vozes em português disponíveis (você pode escolher uma dessas)
  PT_VOICES: {
    MALE: {
      RAPHAEL: 'pNInz6obpgDQGcFmaJgB', // Raphael - voz masculina em português
      MATHEUS: 'XrExE9yKIg1WjnnlVkGX', // Matheus - voz masculina em português
      DANIEL: 'TxGEqnHWrfWFTfGW9XjX', // Daniel - voz masculina em português
    },
    FEMALE: {
      CLARA: 'EXAVITQu4vr4xnSDxMaL', // Clara - voz feminina em português
    }
  },
  // Configurações de voz
  VOICE_SETTINGS: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true
  }
};

// Escolha a voz padrão (masculina em português)
export const DEFAULT_VOICE_ID = ELEVEN_LABS_CONFIG.PT_VOICES.MALE.RAPHAEL;
