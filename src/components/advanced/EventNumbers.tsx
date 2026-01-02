import React from 'react'

export interface EventNumberItem {
  id: string
  value: string | React.ReactElement
  label: string | React.ReactElement
}

export interface EventNumbersProps {
  items?: EventNumberItem[]
  backgroundColor?: string
  textColor?: string
  valueColor?: string
  labelColor?: string
  padding?: string
}

const EventNumbers: React.FC<EventNumbersProps> = ({
  items = [],
  backgroundColor = '#1e3a8a',
  textColor = '#ffffff',
  valueColor,
  labelColor,
  padding = '3rem 2rem'
}) => {
  // Extract string values from React elements
  const getStringValue = (prop: any): string => {
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  // Use provided colors or fall back to textColor
  const finalValueColor = valueColor || textColor;
  const finalLabelColor = labelColor || textColor;

  return (
    <div
      className="w-full"
      style={{
        backgroundColor,
        padding,
        position: 'relative'
      }}
    >
      {/* Decorative dotted border at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 16px)'
        }}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {items.map((item) => {
            const valueStr = getStringValue(item.value);
            const labelStr = getStringValue(item.label);
            
            return (
              <div
                key={item.id}
                className="flex flex-col items-center text-center"
              >
                {/* Value */}
                <div
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight"
                  style={{ color: finalValueColor }}
                >
                  {item.value}
                </div>
                
                {/* Label */}
                <div
                  className="text-sm md:text-base font-medium uppercase tracking-wider"
                  style={{ color: finalLabelColor }}
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default EventNumbers

