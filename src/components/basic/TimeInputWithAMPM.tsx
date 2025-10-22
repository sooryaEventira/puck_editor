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
  padding = '10px 12px',
  margin = '0',
  onTimeChange,
  onAMPMChange
}) => {
  // Convert time and AM/PM to display format with space
  const displayValue = `${timeValue} ${ampmValue}`;

  return (
    <div style={{ margin, width }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <div
        style={{
          width: '100%',
          height,
          padding,
          border: `1px solid ${borderColor}`,
          borderRadius,
          fontSize,
          color,
          backgroundColor: disabled ? '#f9fafb' : backgroundColor,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'text',
          gap: '4px'
        }}
      >
        <span>{timeValue}</span>
        <span>{ampmValue}</span>
      </div>
    </div>
  );
};

export default TimeInputWithAMPM;

