// Configuração da API Groq
// Para usar, crie um arquivo .env.local na raiz do projeto com:
// GROQ_API_KEY=sua_chave_aqui

export const GROQ_CONFIG = {
  // Sua chave da Groq API
  API_KEY: process.env.GROQ_API_KEY || '',
  BASE_URL: "https://api.groq.com/openai/v1",
  MODEL: "llama-3.3-70b-versatile", // Modelo mais recente e rápido
  MAX_TOKENS: 150,
  TEMPERATURE: 0.7,
};

// Verificar se a API key está configurada
export const isGroqConfigured = (): boolean => {
  return !!GROQ_CONFIG.API_KEY && GROQ_CONFIG.API_KEY !== '';
};