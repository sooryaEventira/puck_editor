import React, { useState, useEffect, useMemo } from 'react';

export interface ProgressItem {
  value: number;
  color: string;
  caption: string | React.ReactElement;
}

export interface ProgressCircleStatsProps {
  // Props are defined for Puck compatibility but using static data for reliability
  item1Value?: number | React.ReactElement;
  item1Color?: string | React.ReactElement;
  item1Caption?: string | React.ReactElement;
  item2Value?: number | React.ReactElement;
  item2Color?: string | React.ReactElement;
  item2Caption?: string | React.ReactElement;
  item3Value?: number | React.ReactElement;
  item3Color?: string | React.ReactElement;
  item3Caption?: string | React.ReactElement;
}

const ProgressCircleStats: React.FC<ProgressCircleStatsProps> = ({ 
  item1Value, item1Color, item1Caption,
  item2Value, item2Color, item2Caption,
  item3Value, item3Color, item3Caption
}) => {
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);

  // Helper function to extract string value from props
  const getStringValue = (prop: string | React.ReactElement): string => {
    if (typeof prop === 'string') {
      return prop;
    }
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return prop.props.value || '';
    }
    return '';
  };

  // Helper function to extract number value from props
  const getNumberValue = (prop: number | React.ReactElement): number => {
    if (typeof prop === 'number') {
      return prop;
    }
    if (prop && typeof prop === 'object' && 'props' in prop && prop.props && 'value' in prop.props) {
      return parseFloat(prop.props.value) || 0;
    }
    return 0;
  };

  // Create items array from individual props with proper value extraction - memoized to prevent re-creation
  const items = useMemo(() => [
    {
      value: getNumberValue(item1Value || 0) || 96.5,
      color: getStringValue(item1Color || '') || '#3b82f6', // Blue
      caption: item1Caption || 'Found the event useful for their professional career development.'
    },
    {
      value: getNumberValue(item2Value || 0) || 97.4,
      color: getStringValue(item2Color || '') || '#10b981', // Green
      caption: item2Caption || 'Reported that the congress met their educational goals and learning expectations.'
    },
    {
      value: getNumberValue(item3Value || 0) || 99.3,
      color: getStringValue(item3Color || '') || '#f59e0b', // Orange
      caption: item3Caption || 'Agreed that the information presented was well-balanced and supported by scientific evidence.'
    }
  ], [item1Value, item1Color, item1Caption, item2Value, item2Color, item2Caption, item3Value, item3Color, item3Caption]);


  // Animate values on mount
  useEffect(() => {
    const targetValues = items.map(item => item.value);
    
    // Initialize with 0 values
    setAnimatedValues(new Array(items.length).fill(0));

    const duration = 2000; // 2 seconds
    const steps = 100; // More steps for smoother animation
    const stepDuration = duration / steps;
    let currentStep = 0;
    let animationId: number;

    const animate = () => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      
      // Use easing function for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      const newValues = targetValues.map(targetValue => {
        return Math.round(targetValue * easedProgress * 10) / 10; // Keep one decimal place
      });
      
      setAnimatedValues(newValues);

      if (currentStep < steps) {
        animationId = setTimeout(animate, stepDuration);
      } else {
        // Ensure final values are exact
        setAnimatedValues(targetValues);
      }
    };

    // Start animation immediately
    animationId = setTimeout(animate, 50);

    // Cleanup function to prevent memory leaks
    return () => {
      if (animationId) {
        clearTimeout(animationId);
      }
    };
  }, [items]);

  const CircleProgress: React.FC<{ 
    value: number; 
    color: string; 
    caption: string | React.ReactElement;
    index: number;
  }> = ({ value: _value, color, caption, index }) => {
    const radius = 60;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    // Use animatedValues for smooth animation, value is the target value
    const currentValue = animatedValues[index] || 0;
    const strokeDashoffset = circumference - currentValue / 100 * circumference;
    
    

    return (
      <div className="flex flex-col items-center gap-4 min-w-[200px] max-w-[200px] bg-transparent">
        {/* SVG Circle */}
        <div className="relative w-32 h-32">
          <svg
            width="128"
            height="128"
            className="-rotate-90"
          >
            {/* Background circle */}
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference + ' ' + circumference}
              style={{
                strokeDashoffset: strokeDashoffset,
                transition: 'stroke-dashoffset 0.3s ease-in-out'
              }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          
          {/* Percentage text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-900 text-center">
            {animatedValues[index] || 0}%
          </div>
        </div>

        {/* Caption */}
        <div 
          contentEditable
          suppressContentEditableWarning={true}
          data-puck-field={`item${index + 1}Caption`}
          className="text-sm text-gray-700 text-center leading-snug cursor-text outline-none min-h-[40px]"
        >
          {caption}
        </div>
      </div>
    );
  };

  // Ensure we have valid data
  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 px-4 text-gray-500 text-base">
        Loading progress circles...
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-8 py-8 px-4 max-w-[1200px] mx-auto">
      {items.map((item, index) => (
        <CircleProgress
          key={index}
          value={item.value}
          color={item.color}
          caption={item.caption}
          index={index}
        />
      ))}
    </div>
  );
};

export default ProgressCircleStats;
