import React, { useState, useRef } from 'react'

export interface SplitVenueBlockProps {
  heading?: string | React.ReactElement
  imagePosition?: 'left' | 'right'
  imageSrc?: string
  venueName?: string | React.ReactElement
  address?: string | React.ReactElement
  city?: string | React.ReactElement
  state?: string | React.ReactElement
  description?: string | React.ReactElement
  backgroundColor?: string
  textColor?: string
  headingColor?: string
  padding?: string
}

const SplitVenueBlock: React.FC<SplitVenueBlockProps> = ({
  heading = 'Venue Information',
  imagePosition = 'left',
  imageSrc,
  venueName = 'The Moscone Center',
  address = '747 Howard St',
  city = 'San Francisco',
  state = 'CA',
  description = 'A premier event venue in the heart of the city.',
  backgroundColor = '#ffffff',
  textColor = '#000000',
  headingColor,
  padding = '4rem 2rem'
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
    fileInputRef.current?.click()
  }

  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  const headingValue = getStringValue(heading);
  const venueNameValue = getStringValue(venueName);
  const addressValue = getStringValue(address);
  const cityValue = getStringValue(city);
  const stateValue = getStringValue(state);
  const descriptionValue = getStringValue(description);

  // Get the current image (uploaded or prop)
  const currentImageSrc = uploadedImageUrl || imageSrc;
  const finalHeadingColor = headingColor || textColor;

  // Image component
  const ImageSection = () => (
    <div 
      className="w-full h-[300px] lg:h-auto relative overflow-hidden"
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
          alt={venueNameValue || 'Venue'}
          className="w-full h-full object-cover pointer-events-none"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
          <span className="text-gray-400">Click to upload image</span>
        </div>
      )}
    </div>
  );

  // Content section
  const ContentSection = () => (
    <div 
      className="w-full flex items-center justify-center p-8 lg:p-12"
      style={{ color: textColor }}
    >
      <div className="max-w-lg w-full space-y-6">
        {/* Venue Name */}
        {venueNameValue && (
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{ color: textColor }}
            data-puck-field="venueName"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {venueName}
          </h2>
        )}

        {/* Address */}
        {addressValue && (
          <div className="flex items-start gap-2">
            <span className="text-xl mt-1">📍</span>
            <p
              className="text-lg md:text-xl"
              style={{ color: textColor }}
              data-puck-field="address"
              contentEditable
              suppressContentEditableWarning={true}
            >
              {address}
            </p>
          </div>
        )}

        {/* City, State */}
        {(cityValue || stateValue) && (
          <p
            className="text-base md:text-lg opacity-80"
            style={{ color: textColor }}
            data-puck-field="city"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {cityValue && stateValue ? `${cityValue}, ${stateValue}` : cityValue || stateValue}
          </p>
        )}

        {/* Description */}
        {descriptionValue && (
          <p
            className="text-base md:text-lg leading-relaxed opacity-90"
            style={{ color: textColor }}
            data-puck-field="description"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <section
      className="w-full"
      style={{
        backgroundColor,
        padding
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        {headingValue && (
          <div className="text-center mb-8 lg:mb-12">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{ color: finalHeadingColor }}
              data-puck-field="heading"
              contentEditable
              suppressContentEditableWarning={true}
            >
              {heading}
            </h1>
          </div>
        )}

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row h-full min-h-[350px]">
          {imagePosition === 'left' ? (
            <>
              <div className="w-full lg:w-1/2">
                <ImageSection />
              </div>
              <div className="w-full lg:w-1/2">
                <ContentSection />
              </div>
            </>
          ) : (
            <>
              <div className="w-full lg:w-1/2 order-2 lg:order-1">
                <ContentSection />
              </div>
              <div className="w-full lg:w-1/2 order-1 lg:order-2">
                <ImageSection />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default SplitVenueBlock

