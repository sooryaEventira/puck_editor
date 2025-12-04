import React from 'react'
import { Link01 } from '@untitled-ui/icons-react'

export type SocialProvider = 'google' | 'microsoft' | 'apple' | 'facebook' | 'github' | 'magic-link'

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: SocialProvider
  children?: React.ReactNode
  variant?: 'default' | 'icon-only'
  size?: 'sm' | 'md' | 'lg'
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const MicrosoftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#F25022" d="M0 0h11v11H0z" />
    <path fill="#00A4EF" d="M12 0h11v11H12z" />
    <path fill="#7FBA00" d="M0 12h11v11H0z" />
    <path fill="#FFB900" d="M12 12h11v11H12z" />
  </svg>
)

const MagicLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Link01 className={`${className} text-[#414651]`} />
)

const getProviderIcon = (provider: SocialProvider, className: string) => {
  switch (provider) {
    case 'google':
      return <GoogleIcon className={className} />
    case 'microsoft':
      return <MicrosoftIcon className={className} />
    case 'magic-link':
      return <MagicLinkIcon className={className} />
    default:
      return null
  }
}

const getProviderText = (provider: SocialProvider): string => {
  switch (provider) {
    case 'google':
      return 'Sign in with Google'
    case 'microsoft':
      return 'Sign in with Microsoft'
    case 'magic-link':
      return 'Sign in with Magic link'
    case 'apple':
      return 'Sign in with Apple'
    case 'facebook':
      return 'Sign in with Facebook'
    case 'github':
      return 'Sign in with GitHub'
    default:
      return 'Sign in'
  }
}

const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  (
    {
      provider,
      children,
      variant = 'default',
      size = 'md',
      className = '',
      ...rest
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-sm sm:text-base',
      lg: 'h-11 px-4 py-2.5 text-base'
    }

    const iconSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5 sm:h-6 sm:w-6',
      lg: 'h-6 w-6'
    }

    const baseClasses = 'inline-flex w-full items-center justify-center self-stretch overflow-hidden rounded-lg touch-manipulation bg-white shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] outline outline-1 outline-[#D5D7DA] -outline-offset-1 gap-3 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#D5D7DA]/20'

    const icon = getProviderIcon(provider, `${iconSizeClasses[size]} flex-shrink-0`)
    const text = children || getProviderText(provider)

    return (
      <button
        ref={ref}
        type="button"
        className={`${baseClasses} ${sizeClasses[size]} ${className}`}
        {...rest}
      >
        {variant !== 'icon-only' && icon}
        {variant !== 'icon-only' && (
          <span className="break-words font-semibold leading-5 sm:leading-6 text-[#414651]">
            {text}
          </span>
        )}
        {variant === 'icon-only' && icon}
      </button>
    )
  }
)

SocialButton.displayName = 'SocialButton'

export default SocialButton

