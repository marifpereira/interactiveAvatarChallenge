'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Smile, Accessibility, Contrast, Volume2, Type } from 'lucide-react';
import AvatarImage from './AvatarImage';
import { startVoiceInteraction } from '../lib/voice';

interface AvatarControlsProps {
  currentEmotion: 'happy' | 'sad' | 'surprised' | 'closed_eyes';
  onEmotionChange: (emotion: 'happy' | 'sad' | 'surprised' | 'closed_eyes') => void;
  isProcessingVoice: boolean;
  isProcessingText?: boolean;
  accessibilityMode?: boolean;
  highContrast?: boolean;
  onAccessibilityModeChange?: (mode: boolean) => void;
  onHighContrastChange?: (contrast: boolean) => void;
  onScreenReaderAnnouncement?: (message: string) => void;
  onProcessingVoiceChange?: (processing: boolean) => void;
  onProcessingTextChange?: (processing: boolean) => void;
  language: 'pt' | 'en' | 'fr';
  onLanguageChange: (language: 'pt' | 'en' | 'fr') => void;
  showTextBox?: boolean;
  onToggleTextBox?: (show: boolean) => void;
  onClearChat?: (showWelcomeMessage?: boolean) => void;
  onOpenChat?: () => void;
  onPlayAccessibilitySound?: () => void;
  showReaderIndicator?: boolean;
  setShowReaderIndicator?: (show: boolean) => void;
  largeFont?: boolean;
  setLargeFont?: (value: boolean) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  setCurrentSpeakingText?: (text: string) => void;
}

export default function AvatarControls({
  currentEmotion,
  onEmotionChange,
  isProcessingVoice,
  isProcessingText,
  accessibilityMode,
  highContrast,
  onAccessibilityModeChange,
  onHighContrastChange,
  onScreenReaderAnnouncement,
  onProcessingVoiceChange,
  onProcessingTextChange,
  language,
  onLanguageChange,
  showTextBox,
  onToggleTextBox,
  onClearChat,
  onOpenChat,
  onPlayAccessibilitySound,
  showReaderIndicator,
  setShowReaderIndicator,
  largeFont,
  setLargeFont,
  volume,
  onVolumeChange,
  setCurrentSpeakingText,
}: AvatarControlsProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showEmotionMenu, setShowEmotionMenu] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  const _isProcessingText = isProcessingText ?? false;
  const _accessibilityMode = accessibilityMode ?? false;
  const _highContrast = highContrast ?? false;
  const _showTextBox = showTextBox ?? false;

  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const hasVoiceSupport = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const volumeRef = useRef<HTMLDivElement | null>(null);
  const emotionRef = useRef<HTMLDivElement | null>(null);
  const accessibilityRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false);
      }
    };

    if (showVolumeSlider) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVolumeSlider]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emotionRef.current && !emotionRef.current.contains(event.target as Node)) {
        setShowEmotionMenu(false);
      }
    };

    if (showEmotionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmotionMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accessibilityRef.current && !accessibilityRef.current.contains(event.target as Node)) {
        setShowAccessibilityMenu(false);
      }
    };

    if (showAccessibilityMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccessibilityMenu]);

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2, // Avatar está acima da glass box
    }}>

      {/* Conteúdo Principal */}
      <div style={{
        padding: '0 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        
        {/* Avatar Container - Clean with pop-out effect */}
        <div style={{ 
          position: 'relative', 
          marginBottom: '64px', 
          width: '100%', 
          height: '260px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginTop: '-70px', // Metade do avatar sobreposto ao glass box
        }}>
            <AvatarImage 
              emotion={currentEmotion} 
              isAnimating={isProcessingVoice || _isProcessingText} 
              highContrast={_highContrast}
            />
          
          {/* Botões circulares à esquerda do avatar */}
          {              [
                ...(hasVoiceSupport ? [
                  { angle: 210, type: 'volume', label: 'Volume', action: () => setShowVolumeSlider(!showVolumeSlider), showSlider: showVolumeSlider, volume: volume, onVolumeChange: (val: number) => onVolumeChange(val) },
                  { angle: 240, type: 'stop', label: 'Stop', action: () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); } },
                ] : []),
                { angle: 270, type: 'menu', label: 'Opções', action: () => setShowLanguageMenu(!showLanguageMenu) },
                { angle: 300, type: 'emotion', label: 'Emoções', action: () => setShowEmotionMenu(!showEmotionMenu), showSlider: showEmotionMenu },
                {
                  angle: 330,
                  type: 'newChat',
                  label: 'Nova Conversa',
                  action: () => {
                    onClearChat?.(); // limpa histórico
                    onToggleTextBox?.(true); // ativa caixa de texto
                    onOpenChat?.(); // mostra mensagem inicial da Maria
                  }
                }
              ].map((item, index) => {
              const angleRad = (item.angle * Math.PI) / 180;
              const radius = 150; // aumenta distância do centro
              const x = Math.round(Math.cos(angleRad) * radius * 100) / 100;
              const y = Math.round(Math.sin(angleRad) * radius * 100) / 100;
              
              const renderIcon = () => {
                const strokeColor = highContrast ? '#000' : '#94A3B8';
                const iconStyle = { width: '20px', height: '20px' };
                
                switch(item.type) {
                  case 'newChat':
                    return <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" style={iconStyle}><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>;
                  case 'volume':
                    return <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" style={iconStyle}><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>;
                  case 'stop':
                    return <svg viewBox="0 0 24 24" fill={strokeColor} style={iconStyle}><rect x="6" y="6" width="12" height="12" rx="2"/></svg>;
                  case 'menu':
                    return <Globe size={20} strokeWidth={2} color={strokeColor} style={iconStyle} />;
                  case 'emotion':
                    return <Smile size={22} strokeWidth={2} color={strokeColor} style={iconStyle} />;
                  default: return null;
                }
              };
              
              if (item.type === 'menu') {
                return (
                  <motion.div
                    ref={menuRef}
                    key={`icon-${index}`}
                    initial={{ width: 44 }}
                    animate={{
                      width: showLanguageMenu ? 240 : 44,
                      backgroundColor: highContrast ? '#ffff00' : (showLanguageMenu ? '#fff' : '#fff')
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      height: '44px',
                      borderRadius: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: showLanguageMenu ? 'space-around' : 'center',
                      boxShadow: highContrast ? '0 0 10px rgba(255,255,0,0.8)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                      cursor: 'pointer',
                      padding: showLanguageMenu ? '0 10px' : '0',
                      overflow: 'hidden',
                      zIndex: showLanguageMenu ? 20 : 6,
                      background: highContrast ? '#ffff00' : '#fff',
                      backdropFilter: 'blur(10px)',
                      border: highContrast ? '2px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                    onClick={(e) => { e.stopPropagation(); setShowLanguageMenu(!showLanguageMenu); }}
                  >
                    {!showLanguageMenu ? (
                      <Globe 
                        size={20} 
                        strokeWidth={2} 
                        color={highContrast ? '#000' : '#94A3B8'} 
                      />
                    ) : (
                      <>
                          {[
                            { code: 'pt' as const, flag: '🇧🇷' },
                            { code: 'en' as const, flag: '🇺🇸' },
                            { code: 'fr' as const, flag: '🇫🇷' }
                          ].map((lang) => (
                          <motion.button
                            key={lang.code}
                            onClick={(ev) => { ev.stopPropagation(); onLanguageChange(lang.code); setShowLanguageMenu(false); }}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              fontSize: '20px',
                              background: language === lang.code ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            {lang.flag}
                          </motion.button>
                        ))}
                      </>
                    )}
                  </motion.div>
                );
              }

              if (item.type === 'volume') {
                return (
                    <motion.div
                      ref={volumeRef}
                      key={`volume-button`}
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%,-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        background: highContrast ? '#ffff00' : '#fff',
                        backdropFilter: 'blur(10px)',
                        border: highContrast ? '2px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '24px',
                        boxShadow: highContrast ? '0 0 10px rgba(255,255,0,0.8)' : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        zIndex: 6,
                      }}
                      initial={{ height: 44 }}
                      animate={{
                        height: item.showSlider ? 180 : 44,
                        boxShadow: item.showSlider
                          ? '0 0 12px rgba(59,130,246,0.4)'
                          : '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: { duration: 0.35, ease: 'easeInOut' },
                      }}
                      onClick={(e) => { e.stopPropagation(); item.action(); }}
                      whileHover={{ background: '#f3f4f6' }}
                    >
                      {/* Ícone do volume */}
                      <div style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {renderIcon()}
                      </div>
                      
                      {/* Slider vertical aparece dentro do botão */}
                      {item.showSlider && (
                        <motion.div
                          key="slider"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingBottom: '10px',
                            gap: '6px',
                            transformOrigin: 'top center',
                          }}
                        >
                          <span style={{ fontSize: '12px', color: '#111827', fontWeight: 600 }}>
                            {Math.round((item.volume || 0.9) * 100)}%
                          </span>
                          {/* Barra vertical */}
                          <div
                            style={{
                              position: 'relative',
                              height: '80px',
                              width: '8px',
                              borderRadius: '8px',
                              background: '#E5E7EB',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'flex-end',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              const newVolume = 1 - (e.clientY - rect.top) / rect.height;
                              const clamped = Math.max(0, Math.min(1, newVolume));
                              item.onVolumeChange?.(clamped);
                            }}
                          >
                            <motion.div
                              style={{
                                width: '100%',
                                background: '#3B82F6',
                                borderRadius: '8px 8px 0 0',
                              }}
                              animate={{
                                height: `${(item.volume || 0.9) * 100}%`,
                              }}
                              transition={{ duration: 0.25 }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                );
              }

              if (item.type === 'emotion') {
                const emotions = [
                  { emoji: '😊', emotion: 'happy' as const },
                  { emoji: '😔', emotion: 'sad' as const },
                  { emoji: '😮', emotion: 'surprised' as const },
                  { emoji: '😴', emotion: 'closed_eyes' as const }
                ];

                return (
                  <motion.div
                    ref={emotionRef}
                    key={`emotion-button-${index}`}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      background: highContrast ? '#ffff00' : '#fff',
                      backdropFilter: 'blur(10px)',
                      border: highContrast ? '2px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '24px',
                      boxShadow: highContrast ? '0 0 10px rgba(255,255,0,0.8)' : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      zIndex: 6,
                    }}
                    initial={{ height: 44 }}
                    animate={{
                      height: item.showSlider ? 180 : 44,
                      boxShadow: item.showSlider
                        ? '0 0 12px rgba(59,130,246,0.4)'
                        : '0 4px 12px rgba(0, 0, 0, 0.15)',
                      transition: { duration: 0.35, ease: 'easeInOut' },
                    }}
                    onClick={(e) => { e.stopPropagation(); item.action(); }}
                    whileHover={{ background: '#f3f4f6' }}
                  >
                    {/* Ícone de carinha principal - só aparece quando está colapsado */}
                    {!item.showSlider && (
                      <div style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {renderIcon()}
                      </div>
                    )}
                    
                    {/* Emojis aparecem dentro do botão - só aparece quando está expandido */}
                    {item.showSlider && (
                      <AnimatePresence>
                        <motion.div
                          key="emotions"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleY: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingBottom: '10px',
                            gap: '10px',
                            transformOrigin: 'top center',
                          }}
                        >
                          {emotions.map(({ emoji, emotion }) => (
                            <motion.button
                              key={emoji}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEmotionChange(emotion);
                                setShowEmotionMenu(false);
                              }}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.95 }}
                              style={{
                                fontSize: '22px',
                                background: currentEmotion === emotion ? 'rgba(59,130,246,0.15)' : 'transparent',
                                border: 'none',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                padding: '8px',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </motion.div>
                );
              }
              
              return (
                <motion.div
                  key={`icon-${index}`}
                  className="icon-button"
                  style={{ 
                    position: 'absolute', 
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%', 
                    background: highContrast ? '#ffff00' : '#fff',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 6,
                    boxShadow: highContrast ? '0 0 10px rgba(255, 255, 0, 0.8)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                    border: highContrast ? '2px solid #000' : 'none',
                  }}
                  onClick={(e) => { e.stopPropagation(); item.action(); }}
                  whileHover={{ background: highContrast ? '#ffff00' : '#f3f4f6' }}
                >
                  {renderIcon()}
                </motion.div>
              );
            })}

          {/* Botões de microfone e texto lado a lado */}
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '20px',
            }}
          >
            {/* Botão de microfone - só aparece se houver suporte à voz */}
            {hasVoiceSupport && (
            <motion.button
              onClick={async () => {
                onToggleTextBox?.(false); // fecha o chat de texto quando começa o modo voz
                onClearChat?.(false); // limpa o histórico quando inicia voz, sem mostrar mensagem inicial
                if (!isProcessingVoice) {
                  onProcessingVoiceChange?.(true);
                  
                  try {
                    await startVoiceInteraction(
                      onEmotionChange,
                      (val) => onProcessingVoiceChange?.(val),
                      (val) => {},
                      () => {},
                      volume,
                      language,
                      setCurrentSpeakingText
                    );
                  } catch (error) {
                    console.error('Erro no microfone:', error);
                  } finally {
                    onProcessingVoiceChange?.(false);
                  }
                } else {
                  if ('speechSynthesis' in window) {
                    speechSynthesis.cancel();
                  }
                  onProcessingVoiceChange?.(false);
                }
              }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: highContrast ? (isProcessingVoice ? '#EF4444' : '#ffff00') : (isProcessingVoice ? '#EF4444' : '#fff'),
                backdropFilter: isProcessingVoice ? 'none' : 'blur(10px)',
                border: highContrast ? '3px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: highContrast ? '0 0 15px rgba(255,255,0,0.9)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={isProcessingVoice ? "white" : (highContrast ? "#000" : "#94A3B8")}
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </motion.button>
            )}

            {/* Botão de texto */}
            <motion.button
              onClick={() => {
                if (!isProcessingVoice) {
                  onToggleTextBox?.(true); // abre a caixa de texto
                  onOpenChat?.(); // mostra logo a mensagem inicial
                }
              }}
              disabled={isProcessingVoice}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: _highContrast 
                  ? (isProcessingVoice ? '#E5E7EB' : (_showTextBox ? '#ffff00' : '#ffff00'))
                  : (isProcessingVoice ? '#E5E7EB' : (_showTextBox ? '#BFDBFE' : '#fff')),
                backdropFilter: isProcessingVoice ? 'none' : (_showTextBox ? 'none' : 'blur(10px)'),
                border: _highContrast ? '3px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: _highContrast ? '0 0 15px rgba(255,255,0,0.9)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                cursor: isProcessingVoice ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={_showTextBox ? "white" : (highContrast ? "#000" : "#94A3B8")}
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </motion.button>

          </div>
        </div>

      </div>

      {/* Botão de Acessibilidade ♿ fixo no canto inferior esquerdo */}
      <motion.div
        ref={accessibilityRef}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: highContrast ? '#ffff00' : '#fff',
          backdropFilter: 'blur(10px)',
          border: highContrast ? '3px solid #000' : '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '24px',
          boxShadow: highContrast ? '0 0 20px rgba(255,255,0,0.8)' : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          overflow: 'hidden',
          cursor: 'pointer',
          zIndex: 50,
        }}
        initial={{ height: 44 }}
        animate={{
          height: showAccessibilityMenu ? 260 : 44,
          width: showAccessibilityMenu ? 180 : 44,
          boxShadow: showAccessibilityMenu ? '0 0 20px rgba(59,130,246,0.4)' : '0 4px 12px rgba(0,0,0,0.4)',
          transition: { duration: 0.35, ease: 'easeInOut' },
        }}
        onClick={(e) => { e.stopPropagation(); setShowAccessibilityMenu(!showAccessibilityMenu); }}
        whileHover={{ background: highContrast ? '#ffff66' : '#f3f4f6' }}
        role="button"
        aria-label="Opções de acessibilidade"
      >
        {/* Ícone de acessibilidade principal */}
        <div style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Accessibility
            size={22}
            strokeWidth={2}
            color={highContrast ? '#000' : '#94A3B8'}
          />
        </div>
        
        {/* Menu de opções */}
        {showAccessibilityMenu && (
          <AnimatePresence>
            <motion.div
              key="accessibility-menu"
              data-accessibility-menu="true"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: '14px',
              gap: '10px',
              transformOrigin: 'top center',
            }}
            >
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onHighContrastChange?.(!_highContrast);
                  onScreenReaderAnnouncement?.(!_highContrast ? 'Alto contraste ativado' : 'Alto contraste desativado');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: highContrast ? '#000' : '#111827',
                  background: highContrast ? '#ffff00' : '#F3F4F6',
                  border: highContrast ? '2px solid #000' : 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  width: '140px',
                  textAlign: 'center',
                  boxShadow: highContrast ? '0 0 10px rgba(255,255,0,0.8)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Contrast size={18} strokeWidth={2.2} color={highContrast ? '#000' : '#111827'} />
                Alto Contraste
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  const newMode = !_accessibilityMode;
                  onAccessibilityModeChange?.(newMode);
                  setShowReaderIndicator?.(newMode);
                  if (onPlayAccessibilitySound) {
                    onPlayAccessibilitySound();
                  }
                  onScreenReaderAnnouncement?.(newMode ? 'Leitor de ecrã ativado' : 'Leitor de ecrã desligado');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: accessibilityMode ? '#FFF' : (highContrast ? '#000' : '#111827'),
                  background: accessibilityMode 
                    ? '#10B981' 
                    : (highContrast ? '#ffff00' : '#F3F4F6'),
                  border: highContrast ? '2px solid #000' : 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  width: '140px',
                  textAlign: 'center',
                  boxShadow: highContrast ? '0 0 10px rgba(255,255,0,0.8)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Volume2 size={18} strokeWidth={2.2} color={accessibilityMode ? '#FFF' : (highContrast ? '#000' : '#111827')} />
                Leitor de Ecrã
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  const newValue = !(largeFont || false);
                  setLargeFont?.(newValue);

                  const root = document.documentElement;
                  if (newValue) {
                    root.classList.add('large-font');
                    onScreenReaderAnnouncement?.('Fonte ampliada ativada');
                  } else {
                    root.classList.remove('large-font');
                    onScreenReaderAnnouncement?.('Fonte normal ativada');
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: largeFont ? '#FFF' : (highContrast ? '#000' : '#111827'),
                  background: largeFont 
                    ? '#10B981' 
                    : (highContrast ? '#ffff00' : '#F3F4F6'),
                  border: highContrast ? '2px solid #000' : 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  width: '140px',
                  textAlign: 'center',
                  boxShadow: highContrast ? '0 0 10px rgba(255,255,0,0.8)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Type size={18} strokeWidth={2.2} color={largeFont ? '#FFF' : (highContrast ? '#000' : '#111827')} />
                Fonte Maior
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
