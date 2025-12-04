/**
 * Toast notification utility
 * Wrapper around react-hot-toast for consistent notifications
 */

import toast from 'react-hot-toast'

export const showToast = {
  /**
   * Success notification (green)
   */
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    })
  },

  /**
   * Error notification (red)
   */
  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    })
  },

  /**
   * Warning notification (yellow)
   */
  warning: (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    })
  },

  /**
   * Info notification (blue)
   */
  info: (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    })
  },

  /**
   * Loading notification
   */
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
    })
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string) => {
    toast.dismiss(toastId)
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss()
  },

  /**
   * Custom email verified notification (purple with checkmark)
   * This is handled by toastHelpers.tsx to allow JSX
   */
  emailVerified: () => {
    import('./toastHelpers').then(({ showEmailVerifiedToast }) => {
      showEmailVerifiedToast()
    })
  },
}

