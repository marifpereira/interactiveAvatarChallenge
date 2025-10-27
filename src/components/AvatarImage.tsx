'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function MagicRing({ highContrast }: { highContrast?: boolean }) {
  const strokeColor = highContrast ? '#000' : '#fff'; // Preto no alto contraste, branco normal
  
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
      <motion.svg
        width="230"
        height="230"
        viewBox="0 0 230 230"
        style={{ position: 'absolute' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
      >
        <circle
          cx="115"
          cy="115"
          r="100"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="10 25"
          style={{ 
            filter: highContrast ? 'drop-shadow(0 0 6px rgba(0,0,0,0.8))' : 'drop-shadow(0 0 6px rgba(255,255,255,0.3))', 
            animation: 'dash-subtle 3s linear infinite' 
          }}
        />
      </motion.svg>

      <style>{`
        @keyframes dash-subtle {
          to {
            stroke-dashoffset: -35;
          }
        }
      `}</style>
    </div>
  );
}

function getImagePathForEmotion(emotion: string) {
  switch (emotion) {
    case 'happy':
      return '/maria_avatar.png';
    case 'sad':
      return '/maria_avatar_sad.png';
    case 'surprised':
      return '/maria_avatar_surprised.png';
    case 'closed_eyes':
      return '/maria_avatar_closed_eyes.png';
    default:
      return '/maria_avatar.png';
  }
}

function AvatarImageInternal({ emotion, isAnimating, highContrast }: { emotion: string; isAnimating: boolean; highContrast?: boolean }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [imagePath, setImagePath] = useState(() => {
    return getImagePathForEmotion(emotion);
  });

  useEffect(() => {
    const initialPath = getImagePathForEmotion(emotion);
    setImagePath(initialPath);
    setImageLoaded(false);
    setImageError(false);
    
    const timer = setTimeout(() => {
      if (!imageLoaded && !imageError) {
        setImageLoaded(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const newPath = getImagePathForEmotion(emotion);
    setImagePath(newPath);
    setImageLoaded(false);
    setImageError(false);
  }, [emotion]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const retryLoad = () => {
    setImageLoaded(false);
    setImageError(false);
    const newPath = getImagePathForEmotion(emotion);
    setImagePath(newPath);
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
    }}>

      {/* Avatar Image - Versão com Retry */}
      <div style={{ position: 'relative', width: '230px', height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Anel dourado animado */}
        <MagicRing highContrast={highContrast} />
        
        {imagePath && (
          <>
            <img
              key={imagePath}
              src={imagePath}
              alt={`Maria Avatar - ${emotion}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(30, 41, 59, 0.6)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                transition: 'all 0.6s ease',
                transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
                filter: isAnimating ? 'brightness(1.1)' : 'brightness(1)',
                opacity: imageLoaded ? 1 : 0.3,
                position: 'relative',
                zIndex: 0
              }}
            />
                
            {/* Loading State */}
            {!imageLoaded && !imageError && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '14px',
                background: 'rgba(0,0,0,0.8)',
                padding: '8px 16px',
                borderRadius: '8px',
                zIndex: 5
              }}>
                Carregando imagem...
              </div>
            )}
            
            {/* Error State with Retry */}
            {imageError && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'red',
                fontSize: '14px',
                background: 'rgba(0,0,0,0.8)',
                padding: '8px 16px',
                borderRadius: '8px',
                zIndex: 5,
                textAlign: 'center'
              }}>
                ❌ Erro ao carregar
                <br />
                <button 
                  onClick={retryLoad}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    background: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Tentar Novamente
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default function AvatarImage({
  emotion,
  isAnimating,
  highContrast
}: {
  emotion: string;
  isAnimating: boolean;
  highContrast?: boolean;
}) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AvatarImageInternal emotion={emotion} isAnimating={isAnimating} highContrast={highContrast} />
    </div>
  );
}