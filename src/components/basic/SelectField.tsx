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
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          style={{
            height,
            padding: `10px 40px 10px 12px`,
            border: `1px solid ${borderColor}`,
            borderRadius,
            fontSize,
            color,
            backgroundColor: disabled ? '#f9fafb' : backgroundColor
          }}
          className="w-full outline-none transition-colors duration-200 box-border appearance-none focus:border-purple-500 disabled:cursor-not-allowed cursor-pointer"
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
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
          ▼
        </div>
      </div>
    </div>
  );
};

export default SelectField;


