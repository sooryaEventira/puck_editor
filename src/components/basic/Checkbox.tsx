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
      className="p-2 cursor-pointer"
    >
      <label className="flex items-center cursor-pointer py-1 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          style={{ accentColor: "#3b82f6" }}
          className="mr-2 w-[18px] h-[18px] cursor-pointer"
        />
        {label}
      </label>

    </div>
  );
};

export default Checkbox;
