'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import AvatarControls from './AvatarControls';
import { startVoiceInteraction } from '../lib/voice';

// Dicionário de traduções
const translations = {
  pt: {
    placeholder: 'Escreve a tua mensagem...',
    send: 'Enviar',
  },
  en: {
    placeholder: 'Type your message...',
    send: 'Send',
  },
  fr: {
    placeholder: 'Écris ton message...',
    send: 'Envoyer',
  },
};

// Mensagens de boas-vindas
const welcomeMessages = {
  pt: 'Olá! Sou a Maria. É um prazer conhecer-te! Como posso ajudar-te hoje?',
  en: 'Hi! I\'m Maria. It\'s a pleasure to meet you! How can I help you today?',
  fr: 'Bonjour ! Je suis Maria. Ravie de faire ta connaissance ! Comment puis-je t\'aider ?',
};

export default function InteractiveAvatar() {
  // Flags para evitar erros de hidratação
  // IMPORTANTE: largeFont deve iniciar como false (não null) para evitar hydration errors no iOS
  const [isClient, setIsClient] = useState(false);
  const [largeFont, setLargeFont] = useState<boolean>(false);

  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'sad' | 'surprised' | 'closed_eyes'>('happy');

  // Estados para processamento de voz
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Estados para processamento de texto
  const [isProcessingText, setIsProcessingText] = useState(false);

  // Estados para acessibilidade
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');
  const [showReaderIndicator, setShowReaderIndicator] = useState(false);
  const [hasReadInitialContent, setHasReadInitialContent] = useState(false);

  // Estado de idioma
  const [language, setLanguage] = useState<'pt' | 'en' | 'fr'>('pt');

  // Estados para os botões de texto
  const [textInput, setTextInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'avatar'; message: string }[]>([]);
  const [showTextBox, setShowTextBox] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [currentSpeakingText, setCurrentSpeakingText] = useState('');

  // Referência para scroll automático
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Função para feedback sonoro suave
  const playAccessibilitySound = () => {
    if (typeof window === 'undefined') return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // --- FUNÇÃO: Envio de texto ---
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userMessage = textInput.trim();
    
    // Adiciona a mensagem do utilizador ao histórico
    setChatHistory((prev) => [...prev, { role: 'user', message: userMessage }]);
    
    setTextInput('');
    setIsProcessingText(true);

    // Anuncia que o utilizador enviou a mensagem (só se modo de acessibilidade estiver ativo)
    if (accessibilityMode) {
      handleScreenReaderAnnouncement(`Tu disseste: ${userMessage}`);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, avatarType: 'text', language })
      });
      const data = await res.json();
      setCurrentEmotion(data.emotion);
      
      // Adiciona a resposta da Maria ao histórico
      setChatHistory((prev) => [...prev, { role: 'avatar', message: data.response }]);
      
      // Define o texto atual sendo falado
      setCurrentSpeakingText(data.response);
      
      // Anuncia a resposta da Maria - espera pela mensagem anterior terminar
      if (accessibilityMode) {
        handleScreenReaderAnnouncement(`Maria respondeu: ${data.response}`, true);
      }
    } catch (err) {
      // Adiciona mensagem de erro ao histórico
      setChatHistory((prev) => [...prev, { role: 'avatar', message: '✗ Erro ao processar a mensagem.' }]);
    } finally {
      setIsProcessingText(false);
    }
  };

  // --- FUNÇÃO: Voz ---
  const handleVoiceStart = async () => {
    if (isProcessingVoice) {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      setIsProcessingVoice(false);
      return;
    }
    setIsProcessingVoice(true);
    try {
      await startVoiceInteraction(
        setCurrentEmotion,
        setIsProcessingVoice,
        setIsProcessingVoice,
        () => {},
        volume,
        language,
        setCurrentSpeakingText
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // Callbacks para os componentes
  const handleEmotionChange = (emotion: 'happy' | 'sad' | 'surprised' | 'closed_eyes') => {
    setCurrentEmotion(emotion);
  };

  const handleScreenReaderAnnouncement = useCallback((message: string, waitForCurrent = false) => {
    if (!accessibilityMode) return; // Só funciona se o modo estiver ativo
    
    const speakMessage = () => {
      const region = document.getElementById('sr-region');
      if (region) {
        region.textContent = ''; // limpa o conteúdo anterior
        setTimeout(() => {
          region.textContent = message;
          region.focus();
        }, 50);
      }
      setScreenReaderAnnouncement(message);

      // Fala também, se o modo de acessibilidade estiver ativo
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = language === 'pt' ? 'pt-PT' : language === 'en' ? 'en-US' : 'fr-FR';
        utterance.rate = 1;
        utterance.volume = volume;
        
        // Se precisar esperar pela mensagem atual a terminar
        if (waitForCurrent) {
          const checkSpeaking = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              clearInterval(checkSpeaking);
              window.speechSynthesis.speak(utterance);
            }
          }, 100);
        } else {
          // Cancela a mensagem atual e fala a nova
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    speakMessage();
  }, [accessibilityMode, language, volume]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [chatHistory]);

  // Atualiza a mensagem inicial quando a linguagem muda
  useEffect(() => {
    if (showTextBox && chatHistory.length === 1 && chatHistory[0].role === 'avatar') {
      // Se há apenas uma mensagem (da Maria) e é a mensagem inicial
      setChatHistory([
        {
          role: 'avatar',
          message: welcomeMessages[language],
        },
      ]);
    }
  }, [language, showTextBox]);

  // Lê o título e introdução quando o leitor de ecrã é ativado
  useEffect(() => {
    if (accessibilityMode && handleScreenReaderAnnouncement && !hasReadInitialContent) {
      // Detecta se é iOS para esperar o primeiro toque
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      const readInitialContent = () => {
        const titleIntro = "Avatar Interativo Challenge. Olá! Eu sou a Maria, o teu avatar interativo - criada especialmente para o FrontendChallenge. Nasci para tornar esta experiência mais dinâmica, divertida e um bocadinho futurista. Não tenhas medo de explorar, falar comigo e descobrir tudo o que posso fazer. A curiosidade é o primeiro passo - e eu adoro curiosos. Pronto para começar?";
        handleScreenReaderAnnouncement(titleIntro);
        setHasReadInitialContent(true);
      };
      
      if (isIOS) {
        // No iOS, espera o primeiro toque
        const handleFirstTap = () => {
          setTimeout(readInitialContent, 800);
          document.removeEventListener('touchstart', handleFirstTap);
        };
        document.addEventListener('touchstart', handleFirstTap);
        return () => {
          document.removeEventListener('touchstart', handleFirstTap);
        };
      } else {
        // Em outros dispositivos, lê imediatamente
        setTimeout(readInitialContent, 800);
      }
    }
  }, [accessibilityMode, handleScreenReaderAnnouncement, hasReadInitialContent]);

  // Force client-side rendering para evitar hydration errors
  useEffect(() => setIsClient(true), []);

  // Carrega a preferência de fonte do localStorage com verificação de cliente
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedFont = localStorage.getItem('largeFont') === 'true';
    setLargeFont(storedFont);
    if (storedFont) document.documentElement.classList.add('large-font');
  }, []);

  // Guarda a preferência no localStorage quando muda
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('largeFont', String(largeFont));
  }, [largeFont]);

  // Ajusta o volume em tempo real quando a Maria está a falar
  const previousVolumeRef = useRef<number>(volume);
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Só executa se o volume mudou (não quando currentSpeakingText mudou)
    if (volume !== previousVolumeRef.current && window.speechSynthesis.speaking && currentSpeakingText) {
      previousVolumeRef.current = volume;
      
      // Pausa e cancela para aplicar novo volume
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      
      // Pequeno delay para garantir que o cancel foi processado
      setTimeout(() => {
        // Reinicia a síntese com o novo volume
        const utterance = new SpeechSynthesisUtterance(currentSpeakingText);
        utterance.volume = volume;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.lang = language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'fr-FR';
        
        // Reinicia a síntese
        window.speechSynthesis.speak(utterance);
      }, 10);
    }
  }, [volume, currentSpeakingText, language]);

  // Não renderiza até que seja no cliente
  if (!isClient) return null;

  return (
    <div
      className="animated-gradient-bg"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: highContrast 
          ? 'linear-gradient(180deg, rgb(234 150 215) 0%, rgb(130 167 255) 100%)'
          : 'linear-gradient(240deg, rgb(234 150 215) 20%, rgb(255 150 200) 50%, rgb(130 167 255) 80%)',
        backgroundSize: '300% 300%',
        animation: highContrast ? 'none' : 'gradientShift 15s ease-in-out infinite',
      }}
    >
      {/* Screen Reader Announcements - Always rendered */}
      <div 
        id="sr-region"
        tabIndex={-1}
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        role="status"
        aria-live="assertive"
        aria-atomic="true"
      >
        {screenReaderAnnouncement}
      </div>

      {/* Conteúdo principal */}
      <main
        role="main"
        aria-label="Avatar Interativo Challenge - Main content"
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        {/* Glassmorphism container for title and intro */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            background: highContrast 
              ? '#ffff00' 
              : 'rgba(255, 255, 255, 0.15)',
            backdropFilter: highContrast ? 'none' : 'blur(12px)',
            WebkitBackdropFilter: highContrast ? 'none' : 'blur(12px)',
            border: highContrast ? '3px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            boxShadow: highContrast 
              ? '0 0 20px rgba(255, 255, 0, 0.8)' 
              : '0 8px 32px rgba(31, 38, 135, 0.37)',
            padding: '60px 20px 140px',
            marginBottom: '-20px',
            maxWidth: '900px',
            margin: '0 auto -20px auto',
            position: 'relative',
            zIndex: 1, 
          }}
        >
          <h1
            role="heading"
            aria-level={1}
            id="main-title"
            className="large-font-title"
            style={{
              color: highContrast ? '#000' : 'white',
              fontWeight: '700',
              marginBottom: '20px',
              textShadow: highContrast
                ? 'none'
                : '0 2px 4px rgba(0, 0, 0, 0.3)',
              ...(highContrast ? { WebkitTextStroke: '2px #000' } : { WebkitTextStroke: '0' }),
            }}
          >
            Avatar Interativo Challenge
          </h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            role="region"
            aria-label="Maria's introduction message"
            aria-describedby="main-title"
            className="large-font-text"
            style={{
              color: highContrast ? '#000' : 'white',
              lineHeight: '1.5',
              textAlign: 'center',
              textShadow: highContrast
                ? 'none'
                : '0 2px 4px rgba(0, 0, 0, 0.3)',
              ...(highContrast ? { WebkitTextStroke: '1.5px #000' } : { WebkitTextStroke: '0' }),
            }}
          >
            👋 Olá! Eu sou a Maria, o teu avatar interativo - criada especialmente para o FrontendChallenge.
            Nasci para tornar esta experiência mais dinâmica, divertida e um bocadinho futurista! 🤖{' '}
            <br />
            <br />
            Não tenhas medo de explorar, falar comigo e descobrir tudo o que posso fazer.
            A curiosidade é o primeiro passo - e eu adoro curiosos. 💡{' '}
            <br />
            <br />
            Pronto para começar? 🚀
          </motion.p>
        </motion.div>

        {/* Avatar Controls */}
        <div style={{ marginBottom: '20px' }}>
          <AvatarControls
            currentEmotion={currentEmotion}
            onEmotionChange={handleEmotionChange}
            isProcessingVoice={isProcessingVoice}
            isProcessingText={isProcessingText}
            accessibilityMode={accessibilityMode}
            highContrast={highContrast}
            onAccessibilityModeChange={setAccessibilityMode}
            onHighContrastChange={setHighContrast}
            onScreenReaderAnnouncement={handleScreenReaderAnnouncement}
            onProcessingVoiceChange={setIsProcessingVoice}
            onProcessingTextChange={setIsProcessingText}
            language={language}
            onLanguageChange={setLanguage}
            showTextBox={showTextBox}
            onToggleTextBox={setShowTextBox}
            onPlayAccessibilitySound={playAccessibilitySound}
            showReaderIndicator={showReaderIndicator}
            setShowReaderIndicator={setShowReaderIndicator}
            largeFont={largeFont}
            setLargeFont={setLargeFont}
            onClearChat={(showWelcomeMessage = true) => {
              // Reseta a emoção para happy
              setCurrentEmotion('happy');
              
              // Limpa o histórico primeiro
              setChatHistory([]);
              
              // Só mostra a mensagem inicial se pedido explicitamente
              if (showWelcomeMessage) {
                // Depois de um pequeno delay, mostra a mensagem inicial
                setTimeout(() => {
                  setChatHistory([
                    {
                      role: 'avatar',
                      message: welcomeMessages[language],
                    },
                  ]);
                }, 150); // 150ms é suficiente para o fade-out suave sem espera longa
              }
            }}
            onOpenChat={() => {
              // Mostra a mensagem inicial apenas se o histórico estiver vazio
              if (chatHistory.length === 0) {
                setChatHistory([
                  {
                    role: 'avatar',
                    message: welcomeMessages[language],
                  },
                ]);
                // Anuncia a mensagem de boas-vindas
                if (accessibilityMode) {
                  handleScreenReaderAnnouncement(welcomeMessages[language]);
                }
              }
            }}
            volume={volume}
            onVolumeChange={setVolume}
            setCurrentSpeakingText={setCurrentSpeakingText}
          />
        </div>

        {/* Histórico da conversa - Glassmorphism */}
        {chatHistory.length > 0 && (
          <motion.div
            role="log"
            aria-live="polite"
            aria-label="Conversation history"
            aria-relevant="additions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: '12px',
              maxWidth: '480px',
              margin: '-10px auto 20px auto',
              padding: '14px 20px',
              background: highContrast ? '#ffff00' : 'rgba(255, 255, 255, 0.15)',
              backdropFilter: highContrast ? 'none' : 'blur(10px)',
              WebkitBackdropFilter: highContrast ? 'none' : 'blur(10px)',
              borderRadius: '16px',
              border: highContrast ? '2px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: highContrast ? '0 0 20px rgba(255,255,0,0.8)' : '0 4px 16px rgba(31, 38, 135, 0.25)',
              // Lógica dinâmica
              overflowY: chatHistory.length > 3 ? 'auto' : 'visible',
              maxHeight: chatHistory.length > 3 ? '60vh' : 'none',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.4) transparent',
              paddingBottom: '20px',
              position: 'relative',
              zIndex: 1,
              transition: 'all 0.3s ease',
            }}
          >
            <AnimatePresence initial={false}>
              {chatHistory.map((msg, i) => (
                <motion.div
                  key={i}
                  role={msg.role === 'user' ? 'status' : 'status'}
                  aria-label={msg.role === 'user' ? 'Your message' : 'Maria response'}
                  initial={{ opacity: 0, y: msg.role === 'avatar' && i === 0 ? 30 : 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: msg.role === 'avatar' && i === 0 ? 0.2 : 0 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: highContrast
                      ? (msg.role === 'user' ? '#0000ff' : '#ffff00')
                      : (msg.role === 'user' 
                        ? 'linear-gradient(135deg, rgb(59, 130, 246), rgb(99, 102, 241))' 
                        : 'rgba(255, 255, 255, 0.25)'),
                    backdropFilter: highContrast ? 'none' : (msg.role === 'user' ? 'blur(8px)' : 'blur(8px)'),
                    WebkitBackdropFilter: highContrast ? 'none' : (msg.role === 'user' ? 'blur(8px)' : 'blur(8px)'),
                    color: highContrast ? (msg.role === 'user' ? 'white' : '#000') : (msg.role === 'user' ? 'white' : '#fff'),
                    borderRadius: msg.role === 'user' 
                      ? '16px 16px 0px 16px' 
                      : '16px 16px 16px 0px',
                    padding: '10px 14px',
                    maxWidth: '80%',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflow: 'visible',
                    border: highContrast ? '2px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: highContrast ? '0 0 10px rgba(255,255,0,0.8)' : '0 2px 8px rgba(31, 38, 135, 0.2)',
                  }}
                >
                  {msg.message}
                </motion.div>
              ))}
            </AnimatePresence>
            {/* marcador de scroll automático */}
            <div ref={chatEndRef} />
          </motion.div>
        )}

        {/* Caixa de texto */}
        {showTextBox && (
          <motion.form
            onSubmit={handleTextSubmit}
            role="form"
            aria-label="Chat input form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '420px',
              margin: '0 auto',
              marginTop: '20px',
            }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={translations[language].placeholder}
              aria-label="Message input field"
              aria-describedby="input-description"
              style={{
                flex: 1,
                maxWidth: '400px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: highContrast ? '2px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
                background: highContrast ? '#ffff00' : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: highContrast ? 'none' : 'blur(8px)',
                WebkitBackdropFilter: highContrast ? 'none' : 'blur(8px)',
                color: highContrast ? '#000' : '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: highContrast ? '0 0 10px rgba(255,255,0,0.8)' : '0 4px 16px rgba(31, 38, 135, 0.15)',
              }}
              className={!highContrast ? 'glass-input' : ''}
            />
            <button
              type="submit"
              aria-label="Send message to Maria"
              style={{
                background: highContrast 
                  ? '#0000ff' 
                  : 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                boxShadow: highContrast ? '0 0 15px rgba(0,0,255,0.8)' : '0 4px 12px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                if (!highContrast) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
                }
              }}
              onMouseLeave={(e) => {
                if (!highContrast) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #60a5fa, #3b82f6)';
                }
              }}
            >
              {translations[language].send}
            </button>
          </motion.form>
        )}
      </main>

      {/* Footer dinâmico */}
      <footer
        role="contentinfo"
        aria-label="Page footer"
        style={{
          textAlign: 'center',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '12px 12px 0 0',
          borderTop: highContrast
            ? '2px solid #ffff00'
            : '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: 'auto',
        }}
      >
        <p
          style={{
            color: highContrast ? '#ffff00' : '#fff',
            fontSize: '14px',
            margin: '0',
            WebkitTextStroke: highContrast ? '1px #000' : '0',
          }}
        >
          🚀 Interactive Avatar Challenge - Powered by Groq API | WCAG 2.1 AA
          Compliant
        </p>
        <p
          style={{
            color: highContrast ? '#ffff00' : '#fff',
            fontSize: '12px',
            margin: '8px 0 0 0',
            WebkitTextStroke: highContrast ? '1px #000' : '0',
          }}
        >
          Develop by Mariana Pereira for FrontendChallenge ✨
        </p>
      </footer>

      {/* Indicador "Leitor Ativo" */}
      {showReaderIndicator && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Screen reader is active"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            background: highContrast ? '#ffff00' : 'rgba(59, 130, 246, 0.95)',
            color: highContrast ? '#000' : '#fff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: highContrast ? '0 0 20px rgba(255,255,0,0.9)' : '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: highContrast ? '3px solid #000' : 'none',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '700',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Volume2 size={20} strokeWidth={2} color={highContrast ? '#000' : '#fff'} />
          Leitor Ativo
        </motion.div>
      )}
    </div>
  );
}