import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      icon,
      iconPosition = 'left',
      className = '',
      type = 'text',
      ...rest
    },
    ref
  ) => {
    return (
      <label className="flex w-full flex-col gap-1">
        {label && <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>}
        <div className="relative">
          {icon && (
            <span
              className={`absolute top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 ${
                iconPosition === 'left' ? 'left-3' : 'right-3'
              }`}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              icon ? (iconPosition === 'left' ? 'pl-9' : 'pr-9') : ''
            } ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''} ${className}`}
            {...rest}
          />
        </div>
        {description && !error && <span className="text-xs text-slate-400">{description}</span>}
        {error && <span className="text-xs text-rose-500">{error}</span>}
      </label>
    )
  }
)

Input.displayName = 'Input'

export default Input


