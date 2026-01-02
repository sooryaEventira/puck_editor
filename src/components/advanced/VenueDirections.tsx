import React from 'react'

export interface DirectionItem {
  id: string
  title: string | React.ReactElement
  description: string | React.ReactElement
  icon?: string
  iconColor?: string
}

export interface VenueDirectionsProps {
  title?: string | React.ReactElement
  mapEmbedUrl?: string
  mapPlaceholder?: string | React.ReactElement
  entranceTitle?: string | React.ReactElement
  entranceDescription?: string | React.ReactElement
  entranceLinkText?: string | React.ReactElement
  entranceLinkUrl?: string
  directions?: DirectionItem[]
  backgroundColor?: string
  textColor?: string
  cardBackgroundColor?: string
  cardBorderColor?: string
  iconBackgroundColor?: string
  buttonColor?: string
  buttonTextColor?: string
  padding?: string
  gap?: string
}

const VenueDirections: React.FC<VenueDirectionsProps> = ({
  title = 'How to Get Here',
  mapEmbedUrl,
  mapPlaceholder,
  entranceTitle,
  entranceDescription,
  entranceLinkText,
  entranceLinkUrl,
  directions = [],
  backgroundColor = '#f9fafb',
  textColor = '#1f2937',
  cardBackgroundColor = '#ffffff',
  cardBorderColor = '#e5e7eb',
  iconBackgroundColor = '#f3f4f6',
  buttonColor = '#3b82f6',
  buttonTextColor = '#ffffff',
  padding = '4rem 2rem',
  gap = '3rem'
}) => {
  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  const titleValue = getStringValue(title);

  const defaultDirections: DirectionItem[] = [
    {
      id: '1',
      title: 'By Air',
      description: 'Fly into SFO (San Francisco International). The venue is a 20-minute drive or 30-minute BART ride from the airport.',
      icon: '✈️',
      iconColor: '#3b82f6'
    },
    {
      id: '2',
      title: 'Public Transit (BART)',
      description: 'Take the Yellow Line to Powell Street Station. The Moscone Center is a short 5-minute walk down 4th Street.',
      icon: '🚇',
      iconColor: '#10b981'
    },
    {
      id: '3',
      title: 'Parking',
      description: 'Underground parking is available at the venue garage (Entrance on 3rd St). Daily max rate is $35. Valet available for VIPs.',
      icon: '🚗',
      iconColor: '#6b7280'
    }
  ];

  const displayDirections = directions.length > 0 ? directions : defaultDirections;

  return (
    <section
      className="w-full"
      style={{
        backgroundColor,
        padding
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          style={{ gap }}
        >
          {/* Left: Map */}
          <div className="flex flex-col gap-6">
            {/* Map */}
            <div
              className="w-full rounded-xl overflow-hidden border"
              style={{
                backgroundColor: cardBackgroundColor,
                borderColor: cardBorderColor,
                aspectRatio: '16/9',
                minHeight: '400px',
              }}
            >
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  {mapPlaceholder ? (
                    <div style={{ color: textColor, opacity: 0.6 }}>
                      {mapPlaceholder}
                    </div>
                  ) : (
                    <>
                      <span className="text-6xl mb-4">📍</span>
                      <p style={{ color: textColor, opacity: 0.6, textAlign: 'center' }}>
                        Interactive Map Component
                      </p>
                      <p className="text-sm mt-2" style={{ color: textColor, opacity: 0.4 }}>
                        Add Google Maps embed URL in properties
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Entrance Info Card */}
            {(entranceTitle || entranceDescription) && (
              <div
                className="rounded-xl p-6 border-l-4"
                style={{
                  backgroundColor: cardBackgroundColor,
                  borderLeftColor: buttonColor,
                  borderTopColor: cardBorderColor,
                  borderRightColor: cardBorderColor,
                  borderBottomColor: cardBorderColor,
                  borderTopWidth: '1px',
                  borderRightWidth: '1px',
                  borderBottomWidth: '1px',
                }}
              >
                {entranceTitle && (
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: textColor }}
                  >
                    {entranceTitle}
                  </h3>
                )}
                {entranceDescription && (
                  <p
                    className="text-sm mb-4 opacity-80"
                    style={{ color: textColor }}
                  >
                    {entranceDescription}
                  </p>
                )}
                {entranceLinkUrl && entranceLinkText && (
                  <a
                    href={entranceLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: buttonColor }}
                  >
                    {entranceLinkText}
                    <span>→</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right: Directions */}
          <div>
            {titleValue && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-8"
                style={{ color: textColor }}
              >
                {title}
              </h2>
            )}

            <div className="space-y-6">
              {displayDirections.map((direction) => {
                const titleValue = getStringValue(direction.title);
                const descriptionValue = getStringValue(direction.description);

                return (
                  <div key={direction.id} className="flex gap-4">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{
                        backgroundColor: iconBackgroundColor,
                      }}
                    >
                      {direction.icon || '📍'}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {titleValue && (
                        <h3
                          className="text-lg font-bold mb-2"
                          style={{ color: textColor }}
                        >
                          {direction.title}
                        </h3>
                      )}
                      {descriptionValue && (
                        <p
                          className="text-base leading-relaxed opacity-80"
                          style={{ color: textColor }}
                        >
                          {direction.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Link Button */}
            <div className="mt-8">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('The Moscone Center, San Francisco')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: buttonColor,
                  color: buttonTextColor,
                }}
              >
                Open in Maps
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VenueDirections

