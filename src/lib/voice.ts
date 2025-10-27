'use client';

const languageMap: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  fr: 'fr-FR'
};

export const startVoiceInteraction = async (
  onEmotionChange: (emotion: 'happy' | 'sad' | 'surprised' | 'closed_eyes') => void,
  onProcessingChange: (processing: boolean) => void,
  setIsListening: (listening: boolean) => void,
  setVoiceResponse: (response: string) => void,
  volume: number,
  language: 'pt' | 'en' | 'fr' = 'pt',
  setCurrentSpeakingText?: (text: string) => void
) => {
  setIsListening(true);
  onProcessingChange(true);
  
  try {
    // Speech-to-Text usando Web Speech API
    const speechToText = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          reject(new Error('Speech recognition não suportado'));
          return;
        }
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = languageMap[language] || 'pt-BR';
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

    const userMessage = await speechToText();
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, avatarType: 'voice', language })
    });
    
    const data = await response.json();
    
    onEmotionChange(data.emotion);
    setVoiceResponse(data.response);
    
    // Define o texto atual sendo falado
    if (setCurrentSpeakingText) {
      setCurrentSpeakingText(data.response);
    }
    
    // Text-to-Speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(data.response);
      utterance.lang = languageMap[language] || 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      // Ensure volume is a valid number between 0 and 1
      utterance.volume = Number.isFinite(volume) && volume >= 0 && volume <= 1 ? volume : 0.9;
      
      const voices = speechSynthesis.getVoices();
      const voiceMatch = voices.find(voice => 
        voice.lang.startsWith(languageMap[language].split('-')[0])
      );
      
      if (voiceMatch) utterance.voice = voiceMatch;
      
      speechSynthesis.speak(utterance);
    }
  } catch (error) {
    setVoiceResponse('Desculpe, ocorreu um erro ao processar a mensagem.');
  } finally {
    setIsListening(false);
    onProcessingChange(false);
  }
};