/**
 * Environment configuration
 * Centralizes all environment variables and provides defaults
 */

export const env = {
  /**
   * API Base URL
   * Default: http://localhost:3001
   * Override with: VITE_API_URL environment variable
   */
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',

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
  SAVE_PAGE: `${env.API_URL}/api/save-page`,
  GET_PAGES: `${env.API_URL}/api/pages`,
  GET_PAGE: (filename: string) => `${env.API_URL}/api/pages/${filename}`,
}

