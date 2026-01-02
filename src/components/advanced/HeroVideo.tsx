import React, { useState, useEffect } from 'react'
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
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedMediaType, setUploadedMediaType] = useState<'image' | 'video' | null>(null);
  const [pexelsDirectUrl, setPexelsDirectUrl] = useState<string | null>(null);

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

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');
        
        if (isVideo || isImage) {
          setUploadedVideoUrl(url);
          setUploadedMediaType(isVideo ? 'video' : 'image');
          setVideoError(false);
          setIsVideoLoaded(false);
        }
      }
    };
    input.click();
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

  // Detect video URL type and convert if needed
  const detectVideoType = (url: string): { type: 'direct' | 'pexels' | 'youtube' | 'vimeo' | 'unsupported', embedUrl?: string } => {
    if (!url) return { type: 'unsupported' };

    // Check if it's a direct video file
    if (url.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i)) {
      return { type: 'direct' };
    }

    // Check for Pexels video page URL
    // Handles formats like: pexels.com/video/123456/ or pexels.com/video/slug-123456/
    const pexelsMatch = url.match(/pexels\.com\/video\/(?:[^\/\s?]*-)?(\d+)/i);
    if (pexelsMatch) {
      const videoId = pexelsMatch[1];
      // Pexels doesn't support direct iframe embeds, so we'll show instructions
      return { 
        type: 'pexels', 
        embedUrl: `https://www.pexels.com/video/${videoId}/` 
      };
    }

    // Check for YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (youtubeMatch) {
      return { 
        type: 'youtube', 
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}` 
      };
    }

    // Check for Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/i);
    if (vimeoMatch) {
      return { 
        type: 'vimeo', 
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` 
      };
    }

    return { type: 'unsupported' };
  };

  const videoInfo = videoUrlValue ? detectVideoType(videoUrlValue) : { type: 'unsupported' as const };
  const isEmbeddedVideo = videoInfo.type === 'pexels' || videoInfo.type === 'youtube' || videoInfo.type === 'vimeo';
  const isDirectVideo = videoInfo.type === 'direct';
  const isUnsupported = videoInfo.type === 'unsupported';

  // Try to get direct video URL from Pexels page URL
  useEffect(() => {
    if (videoInfo.type === 'pexels' && videoUrlValue && !pexelsDirectUrl && !videoError) {
      // Extract video ID from URL
      const pexelsMatch = videoUrlValue.match(/pexels\.com\/video\/(?:[^\/\s?]*-)?(\d+)/i);
      if (pexelsMatch) {
        const videoId = pexelsMatch[1];
        // Try to fetch the Pexels page and extract video URL
        // Note: This may fail due to CORS, but we'll try
        const tryFetchDirectUrl = async () => {
          try {
            // Try common Pexels direct video URL patterns
            const possibleUrls = [
              `https://videos.pexels.com/video-files/${videoId}/pexels-video-${videoId}.mp4`,
              `https://videos.pexels.com/video-files/${videoId}/pexels-${videoId}.mp4`,
            ];
            
            // Test each URL pattern
            for (const testUrl of possibleUrls) {
              try {
                const response = await fetch(testUrl, { method: 'HEAD' });
                if (response.ok) {
                  setPexelsDirectUrl(testUrl);
                  setVideoError(false);
                  return;
                }
              } catch (e) {
                // Continue to next URL
              }
            }
            
            // If all patterns fail, show instructions (pexelsDirectUrl stays null)
            setVideoError(false); // Don't show error, just show instructions
          } catch (error) {
            // If fetch fails, show instructions
            setVideoError(false);
          }
        };
        
        tryFetchDirectUrl();
      }
    }
  }, [videoInfo.type, videoUrlValue, pexelsDirectUrl, videoError]);

  return (
    <>
      <style>
        {`
          .hero-video-container:hover .upload-hint {
            opacity: 1 !important;
          }
        `}
      </style>
      <div 
        className="hero-video-container relative min-h-[400px] overflow-hidden flex items-center"
        style={{
          height: height || '500px',
          backgroundColor: backgroundColor || '#000000',
          justifyContent: getAlignment(alignment)
        }}
      >
      {/* Media Background (Image or Video) */}
      {(uploadedVideoUrl || videoUrlValue) && !videoError ? (
        // Prioritize uploaded media over URL-based media
        uploadedVideoUrl && uploadedMediaType === 'image' ? (
          <img
            src={uploadedVideoUrl}
            alt="Hero background"
            className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
            onLoad={() => {
              setIsVideoLoaded(true);
              setVideoError(false);
            }}
            onError={() => {
              setVideoError(true);
            }}
          />
        ) : uploadedVideoUrl && uploadedMediaType === 'video' ? (
          // Uploaded video file - render as direct video
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
            onLoadedData={() => {
              setIsVideoLoaded(true);
              setVideoError(false);
            }}
            onCanPlay={() => {
              setIsVideoLoaded(true);
            }}
            onError={() => {
              setVideoError(true);
            }}
          >
            <source src={uploadedVideoUrl} type="video/mp4" />
            <source src={uploadedVideoUrl} type="video/webm" />
            <source src={uploadedVideoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        ) : !uploadedVideoUrl && videoUrlValue && uploadedMediaType === 'image' ? (
          // URL-based image (fallback)
          <img
            src={videoUrlValue}
            alt="Hero background"
            className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
            onLoad={() => {
              setIsVideoLoaded(true);
              setVideoError(false);
            }}
            onError={() => {
              setVideoError(true);
            }}
          />
        ) : isEmbeddedVideo && videoInfo.embedUrl && !uploadedVideoUrl ? (
          // Embedded video (Pexels, YouTube, Vimeo)
          videoInfo.type === 'pexels' ? (
            // Try to use direct video URL if found, otherwise show instructions
            pexelsDirectUrl ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
                onLoadedData={() => {
                  setIsVideoLoaded(true);
                  setVideoError(false);
                }}
                onError={() => {
                  setVideoError(true);
                  setPexelsDirectUrl(null);
                }}
              >
                <source src={pexelsDirectUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              // Show instructions if direct URL not available - as a banner at top
              <div 
                className="absolute top-0 left-0 w-full z-[4] bg-yellow-600/95 text-white p-4 shadow-lg"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📹</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-2">Pexels Video Detected - Direct URL Required</p>
                      <p className="text-sm mb-2 opacity-90">
                        To use this video as a background, you need the direct video file URL:
                      </p>
                      <ol className="text-sm space-y-1 mb-2 ml-4 list-decimal">
                        <li>Visit the Pexels video page</li>
                        <li>Click the "Download" button</li>
                        <li>Right-click the download link and "Copy link address" (or get the .mp4 URL)</li>
                        <li>Paste the direct video URL (.mp4) in the Video URL field</li>
                      </ol>
                      <p className="text-xs opacity-75 italic">
                        Or click the background to upload a video file directly from your computer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            // YouTube and Vimeo embeds
            <iframe
              src={videoInfo.embedUrl + (videoInfo.type === 'youtube' ? '?autoplay=1&mute=1&loop=1&playlist=' + (videoInfo.embedUrl.match(/embed\/([^?]+)/)?.[1] || '') : videoInfo.type === 'vimeo' ? '?autoplay=1&muted=1&loop=1' : '')}
              className="absolute top-0 left-0 w-full h-full object-cover z-[1] border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => {
                setIsVideoLoaded(true);
                setVideoError(false);
              }}
              onError={() => {
                setVideoError(true);
              }}
              style={{
                pointerEvents: 'none' // Prevent interaction with iframe
              }}
            />
          )
        ) : isDirectVideo && !uploadedVideoUrl ? (
          // Direct video file from URL (only if no uploaded video)
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
            onLoadedData={() => {
              setIsVideoLoaded(true);
              setVideoError(false);
            }}
            onError={() => {
              setVideoError(true);
            }}
          >
            <source src={videoUrlValue} type="video/mp4" />
            <source src={videoUrlValue} type="video/webm" />
            <source src={videoUrlValue} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        ) : isUnsupported && videoUrlValue && !uploadedVideoUrl ? (
          // Unsupported URL - show error
          <div 
            className="absolute top-0 left-0 w-full h-full z-[1] flex items-center justify-center bg-gray-800"
            onClick={handleFileUpload}
          >
            <div className="text-white text-center p-4">
              <p className="text-lg mb-2">⚠️ Unsupported video URL format</p>
              <p className="text-sm opacity-75">
                Please use a direct video file URL (.mp4, .webm) or a Pexels/YouTube/Vimeo video page URL
              </p>
            </div>
          </div>
        ) : null
      ) : (
        <div 
          style={{
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
          }}
          className="absolute top-0 left-0 w-full h-full z-[1] cursor-pointer"
          onClick={handleFileUpload}
        />
      )}

      {/* Overlay - Clickable for upload */}
      <div 
        style={{
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity || 0.4})`
        }}
        className="absolute top-0 left-0 w-full h-full z-[2] cursor-pointer"
        onClick={handleFileUpload}
      />

      {/* Content */}
      <div 
        style={{
          color: textColor || '#ffffff'
        }}
        className={`relative z-[3] max-w-[800px] p-8 w-full ${alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'}`}
      >
        {/* Title */}
        <h1 
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field="title"
          style={{
            fontSize: getTitleSize(titleSize),
            color: textColor || '#ffffff'
          }}
          className="font-bold m-0 mb-4 leading-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] cursor-text outline-none min-h-[60px]"
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
            color: textColor || '#ffffff'
          }}
          className="m-0 mb-8 leading-relaxed drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] cursor-text outline-none min-h-[40px]"
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
            backgroundColor: buttonColor || '#007bff',
            color: buttonTextColor || '#ffffff',
            ...getButtonSize(buttonSize)
          }}
          className="inline-block no-underline rounded-md font-semibold transition-all duration-300 shadow-lg cursor-text outline-none hover:-translate-y-0.5"
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
          }}
        >
          {buttonText}
        </a>

        {/* Loading Indicator */}
        {videoUrlValue && !isVideoLoaded && !videoError && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl z-[4]">
            Loading video...
          </div>
        )}

        {/* Upload Hint - Show on hover */}
        <div 
          className="upload-hint absolute top-5 right-5 bg-black/70 text-white px-3 py-2 rounded text-xs z-10 opacity-0 transition-opacity duration-300 pointer-events-none"
        >
          🎬 Click background to upload image or video
        </div>

        {/* Media Error Message */}
        {videoError && (
          <div className="absolute top-2.5 left-2.5 bg-red-600/90 text-white px-3 py-2 rounded text-xs z-10 max-w-[200px]">
            ❌ Media failed to load
          </div>
        )}
      </div>
      </div>
    </>
  )
}

export default HeroVideo
