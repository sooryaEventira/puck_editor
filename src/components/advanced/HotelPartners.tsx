import React from 'react'

export interface HotelItem {
  id: string
  name: string | React.ReactElement
  image?: string | React.ReactElement
  priceLevel?: '1' | '2' | '3' | '4' | '5'
  distance?: string | React.ReactElement
  distanceType?: 'walk' | 'metro' | 'drive'
  features?: string[]
  badge?: string | React.ReactElement
  link?: string
}

export interface HotelPartnersProps {
  title?: string | React.ReactElement
  description?: string | React.ReactElement
  hotels?: HotelItem[]
  backgroundColor?: string
  textColor?: string
  cardBackgroundColor?: string
  cardBorderColor?: string
  badgeColor?: string
  badgeTextColor?: string
  priceBadgeColor?: string
  buttonColor?: string
  buttonTextColor?: string
  padding?: string
  gap?: string
}

const HotelPartners: React.FC<HotelPartnersProps> = ({
  title = 'Official Hotel Partners',
  description = "We've secured exclusive discounted rates for attendees. Book by Oct 1st to guarantee availability.",
  hotels = [],
  backgroundColor = '#ffffff',
  textColor = '#1f2937',
  cardBackgroundColor = '#ffffff',
  cardBorderColor = '#e5e7eb',
  badgeColor = '#3b82f6',
  badgeTextColor = '#ffffff',
  priceBadgeColor = '#fbbf24',
  buttonColor = '#3b82f6',
  buttonTextColor = '#ffffff',
  padding = '4rem 2rem',
  gap = '2rem'
}) => {
  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  const titleValue = getStringValue(title);
  const descriptionValue = getStringValue(description);

  const getPriceSymbols = (level?: string) => {
    if (!level) return '';
    const count = parseInt(level) || 0;
    return '$'.repeat(Math.min(count, 5));
  };

  const getDistanceIcon = (type?: string) => {
    switch (type) {
      case 'walk': return '🚶';
      case 'metro': return '🚇';
      case 'drive': return '🚗';
      default: return '📍';
    }
  };

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
        {(titleValue || descriptionValue) && (
          <div className="text-center mb-12">
            {titleValue && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: textColor }}
              >
                {title}
              </h2>
            )}
            {descriptionValue && (
              <p
                className="text-lg opacity-80 max-w-2xl mx-auto"
                style={{ color: textColor }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Hotel Cards Grid */}
        {hotels.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ gap }}
          >
            {hotels.map((hotel) => {
              const nameValue = getStringValue(hotel.name);
              const imageValue = getStringValue(hotel.image);
              const distanceValue = getStringValue(hotel.distance);
              const badgeValue = getStringValue(hotel.badge);

              return (
                <div
                  key={hotel.id}
                  className="rounded-xl overflow-hidden border transition-shadow hover:shadow-lg"
                  style={{
                    backgroundColor: cardBackgroundColor,
                    borderColor: cardBorderColor,
                  }}
                >
                  {/* Image */}
                  <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                    {imageValue ? (
                      <img
                        src={imageValue}
                        alt={nameValue || 'Hotel'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">🏨</span>
                      </div>
                    )}
                    
                    {/* Badge (e.g., "Most Popular") */}
                    {badgeValue && (
                      <div
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: badgeColor,
                          color: badgeTextColor,
                        }}
                      >
                        {hotel.badge}
                      </div>
                    )}

                    {/* Price Level Badge */}
                    {hotel.priceLevel && (
                      <div
                        className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: priceBadgeColor,
                          color: '#000000',
                        }}
                      >
                        {getPriceSymbols(hotel.priceLevel)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Hotel Name */}
                    {nameValue && (
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: textColor }}
                      >
                        {hotel.name}
                      </h3>
                    )}

                    {/* Distance */}
                    {distanceValue && (
                      <div className="flex items-center gap-2 text-sm mb-4 opacity-70" style={{ color: textColor }}>
                        <span>{getDistanceIcon(hotel.distanceType)}</span>
                        <span>{hotel.distance}</span>
                      </div>
                    )}

                    {/* Features */}
                    {hotel.features && hotel.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {hotel.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm" style={{ color: textColor }}>
                            <span>✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* CTA Button */}
                    {hotel.link && (
                      <a
                        href={hotel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full text-center px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: buttonColor,
                          color: buttonTextColor,
                        }}
                      >
                        Book Now
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {hotels.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: textColor, opacity: 0.5 }}>
              No hotels added yet. Add hotels in the property sidebar.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default HotelPartners

