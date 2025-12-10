import React from 'react';

interface TimeInputWithAMPMProps {
  label?: string;
  timeValue?: string;
  ampmValue?: 'AM' | 'PM';
  required?: boolean;
  disabled?: boolean;
  width?: string;
  height?: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  onTimeChange?: (value: string) => void;
  onAMPMChange?: (value: 'AM' | 'PM') => void;
}

const TimeInputWithAMPM: React.FC<TimeInputWithAMPMProps> = ({
  label = '',
  timeValue = '12:00',
  ampmValue = 'AM',
  required = false,
  disabled = false,
  width = '100%',
  height = '40px',
  fontSize = '14px',
  color = '#333333',
  backgroundColor = '#ffffff',
  borderColor = '#d1d5db',
  borderRadius = '6px',
  padding: _padding = '10px 12px',
  margin = '0',
  onTimeChange: _onTimeChange,
  onAMPMChange: _onAMPMChange
}) => {
  return (
    <div style={{ margin, width }}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        style={{
          height,
          border: `1px solid ${borderColor}`,
          borderRadius,
          fontSize,
          color,
          backgroundColor: disabled ? '#f9fafb' : backgroundColor
        }}
        className="w-full flex items-center box-border overflow-hidden disabled:cursor-not-allowed cursor-text"
      >
        {/* Time Section */}
        <div
          style={{
            color,
            fontSize
          }}
          className="flex-1 h-full flex items-center justify-center font-medium"
        >
          {timeValue}
        </div>

        {/* Vertical Separator Line */}
        <div
          style={{
            backgroundColor: borderColor
          }}
          className="w-px h-[70%] flex-shrink-0"
        />
        
        {/* AM/PM Section */}
        <div
          style={{
            color,
            fontSize
          }}
          className="flex-none w-[50px] h-full flex items-center justify-center font-medium"
        >
          {ampmValue}
        </div>
      </div>
    </div>
  );
};

export default TimeInputWithAMPM;

