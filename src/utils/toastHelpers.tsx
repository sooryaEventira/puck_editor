import React from 'react'
import toast from 'react-hot-toast'
import { EmailVerifiedToast } from '../components/ui/EmailVerifiedToast'

export const showEmailVerifiedToast = () => {
  toast.custom((t) => <EmailVerifiedToast t={t} />, {
    duration: 4000,
    position: 'top-right',
  })
}

