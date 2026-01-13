import React, { useState, useRef } from 'react'
import { HeroSplitScreenProps } from '../../types'

const HeroSplitScreen: React.FC<HeroSplitScreenProps> = ({
  imageSrc,
  imageAlt = 'Event hero image',
  dateLabel,
  locationLabel,
  title,
  highlightedText,
  description,
  primaryButtonText,
  primaryButtonAction,
  primaryButtonColor = '#007bff',
  primaryButtonTextColor = '#ffffff',
  secondaryButtonText,
  secondaryButtonAction,
  secondaryButtonColor = '#ffffff',
  secondaryButtonTextColor = '#000000',
  backgroundColor = '#ffffff',
  textColor = '#000000',
  height = '600px'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImageUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  // Extract string values from React elements
  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  const imageSrcValue = getStringValue(imageSrc);
  const dateLabelValue = getStringValue(dateLabel);
  const locationLabelValue = getStringValue(locationLabel);
  const titleValue = getStringValue(title);
  const highlightedTextValue = getStringValue(highlightedText);
  const descriptionValue = getStringValue(description);
  const primaryButtonTextValue = getStringValue(primaryButtonText);
  const primaryButtonActionValue = getStringValue(primaryButtonAction);
  const secondaryButtonTextValue = getStringValue(secondaryButtonText);
  const secondaryButtonActionValue = getStringValue(secondaryButtonAction);

  // Get the current image (uploaded or prop)
  const currentImageSrc = uploadedImageUrl || imageSrcValue;

  // Split title to insert highlighted text
  const renderTitle = () => {
    if (!highlightedTextValue) {
      return <span>{title}</span>;
    }
    
    const titleStr = titleValue;
    const highlightStr = highlightedTextValue;
    const parts = titleStr.split(highlightStr);
    
    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
            {highlightedText}
          </span>
          {parts[1]}
        </>
      );
    }
    
    return <span>{title}</span>;
  };

  return (
    <div 
      className="w-full overflow-hidden"
      style={{
        backgroundColor,
        minHeight: height
      }}
    >
      <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
        {/* Left Side - Image */}
        <div 
          className="w-full lg:w-1/2 h-[400px] lg:h-auto relative overflow-hidden"
        >
          {/* Hidden file input for image upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          {/* Clickable overlay for image upload */}
          <div
            className="absolute inset-0 cursor-pointer z-10"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleImageClick(e as any)
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleImageClick(e)
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.95'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            title="Click to upload image"
            style={{
              backgroundColor: 'transparent',
            }}
          />
          {currentImageSrc ? (
            <img
              src={currentImageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover pointer-events-none"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 0
              }}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
              <span className="text-gray-400">Click to upload image</span>
            </div>
          )}
        </div>

        {/* Right Side - Content */}
        <div 
          className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12"
          style={{ color: textColor }}
        >
          <div className="max-w-lg w-full space-y-6">
            {/* Event Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium" style={{ color: textColor }}>
              {dateLabelValue && (
                <span className="text-blue-600">{dateLabel}</span>
              )}
              {locationLabelValue && (
                <span>{locationLabel}</span>
              )}
            </div>

            {/* Title */}
            <h1 
              className="text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: textColor }}
            >
              {renderTitle()}
            </h1>

            {/* Description */}
            <p 
              className="text-lg leading-relaxed opacity-90"
              style={{ color: textColor }}
            >
              {description}
            </p>

            {/* CTAs */}
            {(primaryButtonTextValue || secondaryButtonTextValue) && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Primary Button */}
                {primaryButtonTextValue && (
                  <a
                    href={primaryButtonActionValue || '#'}
                    className="inline-block px-8 py-3 rounded-md font-semibold text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      backgroundColor: primaryButtonColor,
                      color: primaryButtonTextColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {primaryButtonText}
                  </a>
                )}

                {/* Secondary Button */}
                {secondaryButtonTextValue && (
                  <a
                    href={secondaryButtonActionValue || '#'}
                    className="inline-block px-8 py-3 rounded-md font-semibold text-center border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      backgroundColor: secondaryButtonColor,
                      color: secondaryButtonTextColor,
                      borderColor: textColor
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {secondaryButtonText}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSplitScreen

