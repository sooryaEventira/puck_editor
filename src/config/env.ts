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
   * Default: https://eventiracommon-event-api-dev-ci01-aaeddsh3hbdkcjfa.centralindia-01.azurewebsites.net
   * Override with: VITE_AUTH_API_URL environment variable
   * If USE_PROXY is true in dev, this will be ignored and relative paths will be used
   */
  AUTH_API_URL: import.meta.env.VITE_AUTH_API_URL || 'https://eventiracommon-event-api-dev-ci01-aaeddsh3hbdkcjfa.centralindia-01.azurewebsites.net',

  /**
   * Page Management API Base URL (for page editor endpoints)
   * Default: https://eventiracommon-event-api-dev-ci01-aaeddsh3hbdkcjfa.centralindia-01.azurewebsites.net
   * Override with: VITE_PAGE_API_URL environment variable
   */
  PAGE_API_URL: import.meta.env.VITE_PAGE_API_URL || 'https://eventiracommon-event-api-dev-ci01-aaeddsh3hbdkcjfa.centralindia-01.azurewebsites.net',

  /**
   * Legacy API URL (for backward compatibility)
   * Default: same as PAGE_API_URL
   */
  API_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_PAGE_API_URL || 'https://eventiracommon-event-api-dev-ci01-aaeddsh3hbdkcjfa.centralindia-01.azurewebsites.net',

  /**
   * Is Development Mode
   */
  IS_DEV: import.meta.env.DEV,

  /**
   * Is Production Mode
   */
  IS_PROD: import.meta.env.PROD,
}

/**
 * API Endpoints
 * All endpoints use full URLs to the Azure backend
 */
export const API_ENDPOINTS = {
  // Page Management endpoints (for editor)
  // SAVE_PAGE: env.PAGE_API_URL ? `${env.PAGE_API_URL}/api/save-page` : '',
  // GET_PAGES: env.PAGE_API_URL ? `${env.PAGE_API_URL}/api/pages` : '',
  // GET_PAGE: (filename: string) => env.PAGE_API_URL ? `${env.PAGE_API_URL}/api/pages/${filename}` : '',
  // Auth endpoints (authentication backend)
  AUTH: {
    REGISTER_SEND_OTP: `${env.AUTH_API_URL}/api/v1/auth/register/send-otp/`,
    REGISTER_VERIFY_OTP: `${env.AUTH_API_URL}/api/v1/auth/register/verify-otp/`,
    CREATE_PASSWORD: `${env.AUTH_API_URL}/api/v1/register/`,
    CREATE_ORGANIZATION: `${env.AUTH_API_URL}/api/v1/organizations/`,
    SIGNIN: `${env.AUTH_API_URL}/api/v1/token/`,
  },
  // Event endpoints
  EVENT: {
    CREATE: `${env.AUTH_API_URL}/api/v1/admin/event/`,
    LIST: `${env.AUTH_API_URL}/api/v1/admin/event/`,
  },
  // Timezone endpoints
  TIMEZONE: {
    LIST: `${env.AUTH_API_URL}/api/v1/admin/timezones/`,
  },
}

