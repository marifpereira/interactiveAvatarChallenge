import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GROQ_CONFIG } from '@/lib/config';

// Configuração da API Groq no servidor
const client = new OpenAI({
  apiKey: GROQ_CONFIG.API_KEY,
  baseURL: GROQ_CONFIG.BASE_URL,
});

// Função para detectar emoção baseada na resposta
function detectEmotion(response: string): 'happy' | 'sad' | 'surprised' | 'closed_eyes' {
  const text = response.toLowerCase();
  
  // Palavras muito positivas -> Happy (aumentar especificidade)
  const positiveWords = ['feliz', 'alegre', 'ótimo', 'excelente', 'perfeito', 'maravilhoso', 'fantástico', 'yes', 'great', 'awesome', 'wonderful', 'amazing', 'happy', 'glad', 'joy', 'delighted', 'joyeux', 'heureux', 'ravi', 'super'];
  
  // Palavras MUITO específicas de tristeza -> Sad
  const negativeWords = ['triste', 'deprimido', 'chorar', 'choro', 'lágrimas', 'melancolia', 'desesperado', 'infeliz', 'misérable', 'sad', 'unhappy', 'crying', 'tears', 'melancholy', 'depressed'];
  
  // Palavras de surpresa -> Surprised
  const surpriseWords = ['uau', 'wow', 'surpresa', 'surpreso', 'incrédulo', 'chocado', 'really', 'seriously', 'unbelievable', 'incredible', 'surprising', 'surprise', 'surpris', 'étonnant', 'surprenant', 'oh mon dieu', 'oh my god'];
  
  // Palavras de sono/cansaço -> Closed Eyes
  const sleepyWords = ['sono', 'cansado', 'dormir', 'descansar', 'sonolento', 'tired', 'sleep', 'rest', 'exhausted', 'dormir', 'fatigué', 'sommeil', 'sleepy'];
  
  // Procurar palavras completas (não substrings)
  const textWords = text.split(/\s+/);
  
  const positiveCount = textWords.some(word => positiveWords.includes(word)) ? 1 : 0;
  const negativeCount = textWords.some(word => negativeWords.includes(word)) ? 1 : 0;
  const surpriseCount = textWords.some(word => surpriseWords.includes(word)) ? 1 : 0;
  const sleepyCount = textWords.some(word => sleepyWords.includes(word)) ? 1 : 0;
  
  // Retornar emoção com maior score
  const scores = {
    happy: positiveCount,
    sad: negativeCount,
    surprised: surpriseCount,
    closed_eyes: sleepyCount
  };
  
  const maxScore = Math.max(...Object.values(scores));
  
  // Se não há palavras emocionais detectadas, manter happy por padrão
  if (maxScore === 0) return 'happy';
  
  return Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) as 'happy' | 'sad' | 'surprised' | 'closed_eyes';
}

// Prompts personalizados para cada avatar
function getSystemPrompt(avatarType: 'voice' | 'text' | 'accessibility'): string {
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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, avatarType, language } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Mapear idioma para nome completo
    const languageLabel: Record<string, string> = {
      pt: 'Portuguese',
      en: 'English',
      fr: 'French'
    };

    // Prompt personalizado baseado no tipo de avatar e idioma
    const basePrompt = getSystemPrompt(avatarType || 'text');
    const systemPrompt = `${basePrompt} Always respond in ${languageLabel[language || 'pt']}.`;
    
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
    
    // Detectar emoção baseada tanto na mensagem do usuário quanto na resposta
    const userEmotion = detectEmotion(message);
    const responseEmotion = detectEmotion(response);
    
    // Priorizar a emoção do utilizador se for negativa/surpresa, senão usar a emoção da resposta
    const emotion = (userEmotion === 'sad' || userEmotion === 'surprised') ? userEmotion : responseEmotion;
    
    return NextResponse.json({ response, emotion });
  } catch (error) {
    console.error('Erro na API Groq:', error);
    return NextResponse.json(
      { error: 'Failed to get response', response: "Desculpe, ocorreu um erro. Tente novamente.", emotion: 'sad' },
      { status: 500 }
    );
  }
}

