import React, { useState, useEffect } from "react";

export interface CheckboxProps {
  label: string;
  checked: boolean | string;
  onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  // Convert string values to boolean (Puck passes strings)
  const getBooleanValue = (value: boolean | string): boolean => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  };

  const [isChecked, setIsChecked] = useState(() => getBooleanValue(checked));

  // Keep local state in sync if Puck updates props
  useEffect(() => {
    const booleanValue = getBooleanValue(checked);
    console.log('Checkbox props updated:', { label, checked, booleanValue, currentState: isChecked });
    setIsChecked(booleanValue);
  }, [checked, label]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    console.log('Input handleChange:', { label, newValue, previous: isChecked });
    setIsChecked(newValue);
    if (onChange) {
      console.log('Calling onChange with:', newValue);
      onChange(newValue);
    } else {
      console.log('No onChange prop provided - using internal state only');
    }
  };

  return (
    <div 
      key={`checkbox-${label}-${isChecked}`}
      onClick={() => {
        const newValue = !isChecked;
        console.log('Container clicked:', { label, newValue, previous: isChecked });
        setIsChecked(newValue);
        if (onChange) {
          console.log('Container calling onChange with:', newValue);
          onChange(newValue);
        } else {
          console.log('Container: No onChange prop provided - using internal state only');
        }
      }}
      style={{ 
        padding: "8px", 
        // border: "1px solid #e5e7eb", 
        // borderRadius: "4px", 
        // backgroundColor: "#f9fafb",
        cursor: "pointer"
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "4px 0",
          fontSize: "14px",
          color: "#374151",
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          style={{
            marginRight: "8px",
            width: "18px",
            height: "18px",
            cursor: "pointer",
            accentColor: "#3b82f6"
          }}
        />
        {label}
      </label>

    </div>
  );
};

export default Checkbox;
