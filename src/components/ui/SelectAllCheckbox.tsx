import React from 'react'

interface SelectAllCheckboxProps {
  checked: boolean
  indeterminate: boolean
  onChange: (checked: boolean) => void
  ariaLabel: string
}

export const SelectAllCheckbox: React.FC<SelectAllCheckboxProps> = ({
  checked,
  indeterminate,
  onChange,
  ariaLabel
}) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
      aria-label={ariaLabel}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  )
}

