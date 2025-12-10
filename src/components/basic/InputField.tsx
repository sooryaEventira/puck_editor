import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  disabled?: boolean;
  icon?: string | React.ReactNode;
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
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-gray-500 z-[1] flex items-center justify-center">
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
            height,
            padding: icon && iconPosition === 'left' ? `10px 12px 10px 40px` : padding,
            border: `1px solid ${borderColor}`,
            borderRadius,
            fontSize,
            color,
            backgroundColor: disabled ? '#f9fafb' : backgroundColor
          }}
          className="w-full outline-none transition-colors duration-200 box-border focus:border-purple-500"
          onBlur={(e) => {
            e.currentTarget.style.borderColor = borderColor;
          }}
        />
        {icon && iconPosition === 'right' && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-gray-500 z-[1] flex items-center justify-center">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;


