import React from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  description?: string
  error?: string
  options: SelectOption[]
  showCaret?: boolean
  optionClassName?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, description, error, options, className = '', showCaret = true, optionClassName = '', ...rest }, ref) => {
    return (
      <label className="flex w-full flex-col gap-1">
        {label && <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''
            } ${className}`}
            {...rest}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className={optionClassName}
              >
                {option.label}
              </option>
            ))}
          </select>
          {showCaret && (
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </div>
        {description && !error && <span className="text-xs text-slate-400">{description}</span>}
        {error && <span className="text-xs text-rose-500">{error}</span>}
      </label>
    )
  }
)

Select.displayName = 'Select'

export default Select


