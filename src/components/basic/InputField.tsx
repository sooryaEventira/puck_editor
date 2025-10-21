import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
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

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = '',
  value = '',
  type = 'text',
  required = false,
  disabled = false,
  icon,
  iconPosition = 'left',
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {icon && iconPosition === 'left' && (
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '16px',
              color: '#6b7280',
              zIndex: 1
            }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          style={{
            width: '100%',
            height,
            padding: icon && iconPosition === 'left' ? `10px 12px 10px 40px` : padding,
            border: `1px solid ${borderColor}`,
            borderRadius,
            fontSize,
            color,
            backgroundColor: disabled ? '#f9fafb' : backgroundColor,
            outline: 'none',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#8b5cf6';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = borderColor;
          }}
        />
        {icon && iconPosition === 'right' && (
          <span
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '16px',
              color: '#6b7280',
              zIndex: 1
            }}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;


