import React from 'react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  value?: string;
  placeholder?: string;
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
  onChange?: (value: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options = [],
  value = '',
  placeholder = 'Select an option',
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
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div style={{ margin, width }}>
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
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          style={{
            width: '100%',
            height,
            padding: `10px 40px 10px 12px`,
            border: `1px solid ${borderColor}`,
            borderRadius,
            fontSize,
            color,
            backgroundColor: disabled ? '#f9fafb' : backgroundColor,
            outline: 'none',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box',
            appearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#8b5cf6';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = borderColor;
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#6b7280',
            fontSize: '12px'
          }}
        >
          ▼
        </div>
      </div>
    </div>
  );
};

export default SelectField;


