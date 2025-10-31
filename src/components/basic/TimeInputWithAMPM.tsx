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
          border: `1px solid ${borderColor}`,
          borderRadius,
          fontSize,
          color,
          backgroundColor: disabled ? '#f9fafb' : backgroundColor,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'text',
          overflow: 'hidden'
        }}
      >
             {/* Time Section */}
             <div
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            fontSize,
            fontWeight: '500'
          }}
        >
          {timeValue}
        </div>

               {/* Vertical Separator Line */}
               <div
          style={{
            width: '1px',
            height: '70%',
            backgroundColor: borderColor,
            flexShrink: 0
          }}
        />
        {/* AM/PM Section */}
        <div
          style={{
            flex: '0 0 auto',
            width: '50px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            
            color,
            fontSize,
            fontWeight: '500'
          }}
        >
          {ampmValue}
        </div>
        
 
        
   
      </div>
    </div>
  );
};

export default TimeInputWithAMPM;

