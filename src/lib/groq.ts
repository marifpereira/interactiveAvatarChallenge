import OpenAI from 'openai';
import { GROQ_CONFIG } from './config';

// Configuração da API Groq seguindo o Quickstart Guide
const client = new OpenAI({
  apiKey: GROQ_CONFIG.API_KEY,
  baseURL: GROQ_CONFIG.BASE_URL,
});

// Função para detectar emoção baseada na resposta
export const detectEmotion = (response: string): 'happy' | 'sad' | 'surprised' | 'closed_eyes' => {
  const text = response.toLowerCase();
  
  // Palavras positivas -> Happy
  const positiveWords = ['feliz', 'alegre', 'ótimo', 'excelente', 'perfeito', 'bom', 'legal', 'incrível', 'maravilhoso', 'fantástico', 'yes', 'great', 'awesome', 'wonderful', 'amazing'];
  
  // Palavras negativas -> Sad
  const negativeWords = ['triste', 'problema', 'erro', 'difícil', 'complicado', 'ruim', 'péssimo', 'terrível', 'no', 'bad', 'terrible', 'awful', 'sorry', 'unfortunately'];
  
  // Palavras de surpresa -> Surprised
  const surpriseWords = ['uau', 'incrível', 'surpresa', 'não sabia', 'wow', 'really', 'seriously', 'unbelievable', 'incredible', 'surprising'];
  
  // Palavras de sono/cansaço -> Closed Eyes
  const sleepyWords = ['sono', 'cansado', 'dormir', 'descansar', 'tired', 'sleep', 'rest', 'exhausted'];
  
  // Contar ocorrências
  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;
  const surpriseCount = surpriseWords.filter(word => text.includes(word)).length;
  const sleepyCount = sleepyWords.filter(word => text.includes(word)).length;
  
  // Retornar emoção com maior score
  const scores = {
    happy: positiveCount,
    sad: negativeCount,
    surprised: surpriseCount,
    closed_eyes: sleepyCount
  };
  
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'happy'; // Default
  
  return Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) as 'happy' | 'sad' | 'surprised' | 'closed_eyes';
};

// Função principal para chat
export const chatWithGroq = async (message: string, avatarType: 'voice' | 'text' | 'accessibility'): Promise<{
  response: string;
  emotion: 'happy' | 'sad' | 'surprised' | 'closed_eyes';
}> => {
  try {
    // Prompt personalizado baseado no tipo de avatar
    const systemPrompt = getSystemPrompt(avatarType);
    
    const completion = await client.chat.completions.create({
      model: GROQ_CONFIG.MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: GROQ_CONFIG.MAX_TOKENS,
      temperature: GROQ_CONFIG.TEMPERATURE,
    });
    
    const response = completion.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";
    const emotion = detectEmotion(response);
    
    return { response, emotion };
  } catch (error) {
    console.error('Erro na API Groq:', error);
    return {
      response: "Desculpe, ocorreu um erro. Tente novamente.",
      emotion: 'sad'
    };
  }
};

// Prompts personalizados para cada avatar
const getSystemPrompt = (avatarType: 'voice' | 'text' | 'accessibility'): string => {
  switch (avatarType) {
    case 'voice':
      return `Você é Maria, uma assistente de voz amigável e empática. Responda de forma natural e conversacional, como se estivesse falando diretamente com a pessoa. Use linguagem simples e seja calorosa. Mantenha as respostas curtas (máximo 2 frases) para facilitar a conversa por voz.`;
    
    case 'text':
      return `Você é Maria, uma assistente de texto inteligente e prestativa. Responda de forma clara e detalhada, fornecendo informações úteis. Seja profissional mas amigável. Pode dar respostas mais longas e detalhadas já que é comunicação por texto.`;
    
    case 'accessibility':
      return `Você é Maria, uma assistente especializada em acessibilidade e inclusão. Sempre considere diferentes necessidades e capacidades nas suas respostas. Seja especialmente atenta a questões de inclusão digital e acessibilidade. Responda de forma clara e estruturada.`;
    
    default:
      return `Você é Maria, uma assistente amigável e prestativa.`;
  }
};

// Função para Speech-to-Text (usando Web Speech API)
export const speechToText = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Speech recognition não suportado neste navegador'));
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };
    
    recognition.onerror = (event: any) => {
      reject(new Error(`Erro no reconhecimento: ${event.error}`));
    };
    
    recognition.start();
  });
};

// Função para Text-to-Speech
export const textToSpeech = (text: string): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Tentar usar voz feminina em português
    const voices = speechSynthesis.getVoices();
    const portugueseVoice = voices.find(voice => 
      voice.lang.startsWith('pt') && voice.name.includes('Female')
    );
    
    if (portugueseVoice) {
      utterance.voice = portugueseVoice;
    }
    
    speechSynthesis.speak(utterance);
  }
};
