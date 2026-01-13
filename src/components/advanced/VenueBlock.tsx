import React, { useState, useRef } from 'react'

export interface VenueBlockProps {
  venueName?: string | React.ReactElement
  address?: string | React.ReactElement
  city?: string | React.ReactElement
  state?: string | React.ReactElement
  backgroundImage?: string
  backgroundColor?: string
  overlayColor?: string
  overlayOpacity?: number
  textColor?: string
  badgeColor?: string
  badgeTextColor?: string
  borderRadius?: string
  padding?: string
}

const VenueBlock: React.FC<VenueBlockProps> = ({
  venueName = 'The Moscone Center',
  address = '747 Howard St',
  city = 'San Francisco',
  state = 'CA',
  backgroundImage,
  backgroundColor = '#1e3a8a',
  textColor = '#ffffff',
  badgeColor = 'rgba(255, 255, 255, 0.2)',
  badgeTextColor = '#ffffff'
}) => {
  // Hardcoded default values for removed properties
  const overlayColor = '#000000'
  const overlayOpacity = 0.4
  const borderRadius = '0'
  const padding = '6rem 2rem'
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
    // Prevent default and stop propagation to avoid conflicts with Puck
    e.preventDefault()
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  const venueNameValue = getStringValue(venueName);
  const addressValue = getStringValue(address);
  const cityValue = getStringValue(city);
  const stateValue = getStringValue(state);

  // Get the current background image (uploaded or prop)
  const currentBackgroundImage = uploadedImageUrl || backgroundImage

  const backgroundStyle = currentBackgroundImage
    ? { backgroundImage: `url(${currentBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor };

  return (
    <div
      className="relative w-full overflow-hidden cursor-pointer"
      style={{
        backgroundColor: backgroundColor,
        borderRadius,
        minHeight: '400px',
      }}
    >
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
      {/* Background Image Layer */}
      {currentBackgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${currentBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />
      )}
      
      {/* Overlay - Clickable for upload */}
      <div
        className="absolute inset-0 cursor-pointer transition-opacity duration-200"
        onMouseDown={(e) => {
          // Use onMouseDown with capture to ensure it fires before other handlers
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
          // Slightly reduce overlay opacity on hover to show image better
          e.currentTarget.style.opacity = String(overlayOpacity * 0.7)
        }}
        onMouseLeave={(e) => {
          // Restore original overlay opacity
          e.currentTarget.style.opacity = String(overlayOpacity)
        }}
        title="Click to upload background image"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{ padding, pointerEvents: 'none' }}
      >
        {/* Location Badge */}
        {(cityValue || stateValue) && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 backdrop-blur-sm"
            style={{
              backgroundColor: badgeColor,
              color: badgeTextColor,
              pointerEvents: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span>📍</span>
            <span className="text-sm font-semibold">
              {cityValue && stateValue ? `${cityValue}, ${stateValue}` : cityValue || stateValue}
            </span>
          </div>
        )}

        {/* Venue Name */}
        {venueNameValue && (
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ color: textColor, pointerEvents: 'auto' }}
            data-puck-field="venueName"
            contentEditable
            suppressContentEditableWarning={true}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {venueName}
          </h1>
        )}

        {/* Address */}
        {addressValue && (
          <p
            className="text-lg md:text-xl opacity-90"
            style={{ color: textColor, pointerEvents: 'auto' }}
            data-puck-field="address"
            contentEditable
            suppressContentEditableWarning={true}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {address}
          </p>
        )}
      </div>
    </div>
  )
}

export default VenueBlock

