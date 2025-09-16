import React, { useState } from 'react'
import { HeroVideoProps } from '../../types'

const HeroVideo = ({ 
  videoUrl, 
  title, 
  subtitle, 
  buttonText, 
  buttonLink, 
  backgroundColor, 
  textColor, 
  titleSize, 
  subtitleSize, 
  buttonColor, 
  buttonTextColor, 
  buttonSize,
  overlayOpacity,
  alignment,
  height
}: HeroVideoProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Simple prop handling - use props directly for contentEditable, extract for display
  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  const videoUrlValue = getStringValue(videoUrl);
  const titleValue = getStringValue(title);
  const subtitleValue = getStringValue(subtitle);
  const buttonTextValue = getStringValue(buttonText);
  const buttonLinkValue = getStringValue(buttonLink);

  // Debug logging
  console.log('HeroVideo props:', { videoUrl, title, subtitle, buttonText, buttonLink });
  console.log('Extracted values:', { videoUrlValue, titleValue, subtitleValue, buttonTextValue, buttonLinkValue });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (buttonLinkValue && buttonLinkValue !== '#') {
      console.log('Navigate to:', buttonLinkValue);
      // In a real app, you would use React Router or similar
      // navigate(buttonLinkValue);
    }
  };

  const getTitleSize = (size?: string) => {
    switch (size) {
      case 'XXXL': return '4rem';
      case 'XXL': return '3.5rem';
      case 'XL': return '3rem';
      case 'L': return '2.5rem';
      case 'M': return '2rem';
      case 'S': return '1.5rem';
      case 'XS': return '1.25rem';
      default: return '2.5rem';
    }
  };

  const getSubtitleSize = (size?: string) => {
    switch (size) {
      case 'XL': return '1.5rem';
      case 'L': return '1.25rem';
      case 'M': return '1.125rem';
      case 'S': return '1rem';
      case 'XS': return '0.875rem';
      default: return '1.25rem';
    }
  };

  const getButtonSize = (size?: string) => {
    switch (size) {
      case 'large': return { padding: '12px 32px', fontSize: '1.125rem' };
      case 'medium': return { padding: '10px 24px', fontSize: '1rem' };
      case 'small': return { padding: '8px 16px', fontSize: '0.875rem' };
      default: return { padding: '10px 24px', fontSize: '1rem' };
    }
  };

  const getAlignment = (align?: string) => {
    switch (align) {
      case 'left': return 'flex-start';
      case 'right': return 'flex-end';
      case 'center': 
      default: return 'center';
    }
  };

  return (
    <div style={{
      position: 'relative',
      height: height || '500px',
      minHeight: '400px',
      backgroundColor: backgroundColor || '#000000',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: getAlignment(alignment)
    }}>
      {/* Video Background */}
      {(videoUrlValue || videoUrl) && !videoError ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1
          }}
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => {
            console.log('Video failed to load:', videoUrlValue);
            setVideoError(true);
          }}
        >
          <source src={videoUrlValue} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
          zIndex: 1
        }} />
      )}

      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: `rgba(0, 0, 0, ${overlayOpacity || 0.4})`,
        zIndex: 2
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        textAlign: alignment || 'center',
        color: textColor || '#ffffff',
        maxWidth: '800px',
        padding: '2rem',
        width: '100%'
      }}>
        {/* Title */}
        <h1 
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="title"
          style={{
            fontSize: getTitleSize(titleSize),
            fontWeight: 'bold',
            margin: '0 0 1rem 0',
            lineHeight: '1.2',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            cursor: 'text',
            outline: 'none',
            color: textColor || '#ffffff',
            minHeight: '60px'
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p 
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="subtitle"
          style={{
            fontSize: getSubtitleSize(subtitleSize),
            margin: '0 0 2rem 0',
            lineHeight: '1.6',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            cursor: 'text',
            outline: 'none',
            minHeight: '40px',
            color: textColor || '#ffffff'
          }}
        >
          {subtitle}
        </p>

        {/* Button */}
        <a
          href={buttonLinkValue || '#'}
          onClick={handleButtonClick}
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="buttonText"
          style={{
            display: 'inline-block',
            backgroundColor: buttonColor || '#007bff',
            color: buttonTextColor || '#ffffff',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            cursor: 'text',
            outline: 'none',
            ...getButtonSize(buttonSize)
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
          }}
        >
          {buttonText}
        </a>

        {/* Video URL Editor Overlay */}
        <div
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="videoUrl"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            fontSize: '11px',
            padding: '6px 10px',
            borderRadius: '6px',
            opacity: 0,
            transition: 'opacity 0.3s',
            cursor: 'pointer',
            zIndex: 10,
            maxWidth: '300px',
            wordBreak: 'break-all'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
        >
          🎥 Edit Video URL: {videoUrl}
        </div>

        {/* Loading Indicator */}
        {videoUrlValue && !isVideoLoaded && !videoError && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '1.2rem',
            zIndex: 4
          }}>
            Loading video...
          </div>
        )}

        {/* Video Error Message */}
        {videoError && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(220, 53, 69, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 10
          }}>
            ❌ Video failed to load
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroVideo
