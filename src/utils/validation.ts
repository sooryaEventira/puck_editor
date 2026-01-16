/**
 * Validation utilities for form inputs
 */

/**
 * Validates email format
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  // Check email length
  if (email.trim().length > 254) {
    return { isValid: false, error: 'Email address is too long' }
  }

  return { isValid: true }
}

/**
 * Validates password
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || !password.trim()) {
    return { isValid: false, error: 'Password is required' }
  }

  return { isValid: true }
}

/**
 * Validates OTP code (6 digits)
 */
export const validateOtp = (otp: string): { isValid: boolean; error?: string } => {
  if (!otp || !otp.trim()) {
    return { isValid: false, error: 'OTP code is required' }
  }

  const trimmedOtp = otp.trim()

  // Check if OTP is exactly 6 digits
  if (!/^\d{6}$/.test(trimmedOtp)) {
    return { isValid: false, error: 'OTP must be exactly 6 digits' }
  }

  return { isValid: true }
}

/**
 * Validates organization/eventspace name
 */
export const validateOrganizationName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Organization name is required' }
  }

  const trimmedName = name.trim()

  // Minimum length check
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Organization name must be at least 2 characters long' }
  }

  // Maximum length check
  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Organization name is too long (maximum 100 characters)' }
  }

  // Check for invalid characters
  if (!/^[a-zA-Z0-9\s\-_&.()]+$/.test(trimmedName)) {
    return { isValid: false, error: 'Organization name contains invalid characters' }
  }

  return { isValid: true }
}

