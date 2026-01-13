import React, { useState, useRef } from 'react'

export interface SpeakerItem {
  id: string
  name: string | React.ReactElement
  title: string | React.ReactElement
  company?: string | React.ReactElement
  quote?: string | React.ReactElement
  photo: string | React.ReactElement
  accentColor?: string
}

export interface SpeakerHighlightProps {
  heading?: string | React.ReactElement
  subtitle?: string | React.ReactElement
  speakers?: SpeakerItem[]
  backgroundColor?: string
  textColor?: string
  headingColor?: string
  subtitleColor?: string
  accentColor?: string
  padding?: string
  imageShape?: 'circle' | 'rectangle'
}

const SpeakerHighlight: React.FC<SpeakerHighlightProps> = ({
  heading = 'Headlining Speakers',
  subtitle = 'Learn from the pioneers shaping the industry.',
  speakers = [],
  backgroundColor = '#ffffff',
  textColor = '#000000',
  headingColor,
  subtitleColor,
  accentColor = '#3b82f6',
  padding = '4rem 2rem',
  imageShape = 'circle'
}) => {
  // Store uploaded images per speaker ID
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Handle file upload for a specific speaker
  const handleFileUpload = (speakerId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImages(prev => ({
          ...prev,
          [speakerId]: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = (speakerId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    fileInputRefs.current[speakerId]?.click()
  }
  // Extract string values from React elements
  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  const headingValue = getStringValue(heading);
  const subtitleValue = getStringValue(subtitle);
  const finalHeadingColor = headingColor || textColor;
  const finalSubtitleColor = subtitleColor || '#6b7280';

  return (
    <section
      className="w-full"
      style={{
        backgroundColor,
        padding
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(headingValue || subtitleValue) && (
          <div className="text-center mb-12">
            {headingValue && (
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                style={{ color: finalHeadingColor }}
              >
                {heading}
              </h2>
            )}
            {subtitleValue && (
              <p
                className="text-lg md:text-xl opacity-80"
                style={{ color: finalSubtitleColor }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Speakers Grid */}
        {speakers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {speakers.map((speaker) => {
              const nameValue = getStringValue(speaker.name);
              const titleValue = getStringValue(speaker.title);
              const companyValue = getStringValue(speaker.company);
              const quoteValue = getStringValue(speaker.quote);
              const photoValue = getStringValue(speaker.photo);
              const speakerAccentColor = speaker.accentColor || accentColor;

              return (
                <div
                  key={speaker.id}
                  className="flex flex-col items-center text-center"
                >
                  {/* Photo with accent border */}
                  <div className="relative mb-6">
                    {/* Hidden file input for image upload */}
                    <input
                      ref={(el) => {
                        fileInputRefs.current[speaker.id] = el
                      }}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload(speaker.id)}
                      style={{ display: 'none' }}
                    />
                    <div
                      className={`w-32 h-32 md:w-40 md:h-40 overflow-hidden border-4 cursor-pointer transition-opacity duration-200 ${
                        imageShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                      }`}
                      style={{
                        borderColor: speakerAccentColor,
                        boxShadow: `0 4px 20px ${speakerAccentColor}40`
                      }}
                      onClick={handleImageClick(speaker.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                      title="Click to upload photo"
                    >
                      {(uploadedImages[speaker.id] || photoValue) ? (
                        <img
                          src={uploadedImages[speaker.id] || photoValue}
                          alt={nameValue || 'Speaker'}
                          className="w-full h-full object-cover pointer-events-none"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-gray-400 text-sm">No photo</span></div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center pointer-events-none">
                          <span className="text-gray-400 text-sm">Click to upload</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  {nameValue && (
                    <h3
                      className="text-xl md:text-2xl font-bold mb-2"
                      style={{ color: textColor }}
                    >
                      {speaker.name}
                    </h3>
                  )}

                  {/* Title/Company */}
                  {(titleValue || companyValue) && (
                    <p
                      className="text-base md:text-lg mb-3 font-medium"
                      style={{ color: accentColor }}
                    >
                      {titleValue && companyValue ? (
                        <>
                          {speaker.title}, {speaker.company}
                        </>
                      ) : (
                        speaker.title || speaker.company
                      )}
                    </p>
                  )}

                  {/* Quote */}
                  {quoteValue && (
                    <p
                      className="text-sm md:text-base italic opacity-75 max-w-xs"
                      style={{ color: textColor }}
                    >
                      "{speaker.quote}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {speakers.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: textColor, opacity: 0.5 }}>
              No speakers added yet. Add speakers in the property sidebar.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default SpeakerHighlight

