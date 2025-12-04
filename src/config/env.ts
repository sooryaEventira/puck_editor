/**
 * Environment configuration
 * Centralizes all environment variables and provides defaults
 */

export const env = {
  /**
   * Use Vite proxy for API requests in development (avoids CORS issues)
   * When true, uses relative paths that go through Vite proxy
   * Override with: VITE_USE_PROXY environment variable
   */
  USE_PROXY: import.meta.env.VITE_USE_PROXY === 'true' || (import.meta.env.DEV && import.meta.env.VITE_USE_PROXY !== 'false'),

  /**
   * Auth API Base URL (for authentication endpoints)
   * Default: http://localhost:8000
   * Override with: VITE_AUTH_API_URL environment variable
   * If USE_PROXY is true in dev, this will be ignored and relative paths will be used
   */
  AUTH_API_URL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000',

  /**
   * Page Management API Base URL (for page editor endpoints)
   * Set to empty string to disable page API calls
   * Override with: VITE_PAGE_API_URL environment variable
   */
  PAGE_API_URL: import.meta.env.VITE_PAGE_API_URL || '',

  /**
   * Legacy API URL (for backward compatibility)
   * Default: same as PAGE_API_URL
   */
  API_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_PAGE_API_URL || 'http://localhost:3001',

  /**
   * Is Development Mode
   */
  IS_DEV: import.meta.env.DEV,

  /**
   * Is Production Mode
   */
  IS_PROD: import.meta.env.PROD,

  /**
   * Log Level
   * Default: 'debug' in dev, 'error' in production
   */
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || (import.meta.env.DEV ? 'debug' : 'error'),
}

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Page Management endpoints (for editor) - only available if PAGE_API_URL is set
  SAVE_PAGE: env.PAGE_API_URL ? `${env.PAGE_API_URL}/api/save-page` : '',
  GET_PAGES: env.PAGE_API_URL ? `${env.PAGE_API_URL}/api/pages` : '',
  GET_PAGE: (filename: string) => env.PAGE_API_URL ? `${env.PAGE_API_URL}/api/pages/${filename}` : '',
  // Auth endpoints (authentication backend)
  // Use proxy path in development if USE_PROXY is enabled, otherwise use full URL
  AUTH: {
    REGISTER_SEND_OTP: env.USE_PROXY && env.IS_DEV
      ? '/api/v1/auth/register/send-otp/'
      : `${env.AUTH_API_URL}/api/v1/auth/register/send-otp/`,
    REGISTER_VERIFY_OTP: env.USE_PROXY && env.IS_DEV
      ? '/api/v1/auth/register/verify-otp/'
      : `${env.AUTH_API_URL}/api/v1/auth/register/verify-otp/`,
    CREATE_PASSWORD: env.USE_PROXY && env.IS_DEV
      ? '/api/v1/register/'
      : `${env.AUTH_API_URL}/api/v1/register/`,
    CREATE_ORGANIZATION: env.USE_PROXY && env.IS_DEV
      ? '/api/v1/organizations/'
      : `${env.AUTH_API_URL}/api/v1/organizations/`,
  },
}

