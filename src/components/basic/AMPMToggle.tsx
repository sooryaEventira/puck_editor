import React from 'react';

interface AMPMToggleProps {
  value?: 'AM' | 'PM';
  onChange?: (value: 'AM' | 'PM') => void;
  width?: string;
  height?: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
}

const AMPMToggle: React.FC<AMPMToggleProps> = ({
  value = 'AM',
  onChange,
  width = '60px',
  height = '40px',
  fontSize = '14px',
  color = '#333333',
  backgroundColor = '#ffffff',
  borderColor = '#d1d5db',
  borderRadius = '6px',
  padding = '10px 12px',
  margin = '0'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value as 'AM' | 'PM');
    }
  };

  return (
    <div style={{ margin, width }}>
      <select
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          height,
          padding: `10px 20px 10px 12px`,
          border: `1px solid ${borderColor}`,
          borderRadius,
          fontSize,
          color,
          backgroundColor,
          outline: 'none',
          transition: 'border-color 0.2s ease',
          boxSizing: 'border-box',
          appearance: 'none',
          cursor: 'pointer'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#8b5cf6';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = borderColor;
        }}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default AMPMToggle;


