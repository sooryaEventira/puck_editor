import React from 'react'

export interface VenueHeaderProps {
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

const VenueHeader: React.FC<VenueHeaderProps> = ({
  venueName = 'The Moscone Center',
  address = '747 Howard St',
  city = 'San Francisco',
  state = 'CA',
  backgroundImage,
  backgroundColor = '#1e3a8a',
  overlayColor = '#000000',
  overlayOpacity = 0.4,
  textColor = '#ffffff',
  badgeColor = 'rgba(255, 255, 255, 0.2)',
  badgeTextColor = '#ffffff',
  borderRadius = '0',
  padding = '6rem 2rem'
}) => {
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

  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        ...backgroundStyle,
        borderRadius,
        minHeight: '400px',
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{ padding }}
      >
        {/* Location Badge */}
        {(cityValue || stateValue) && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 backdrop-blur-sm"
            style={{
              backgroundColor: badgeColor,
              color: badgeTextColor,
            }}
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
            style={{ color: textColor }}
          >
            {venueName}
          </h1>
        )}

        {/* Address */}
        {addressValue && (
          <p
            className="text-lg md:text-xl opacity-90"
            style={{ color: textColor }}
          >
            {address}
          </p>
        )}
      </div>
    </div>
  )
}

export default VenueHeader

