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
 * Common API base paths
 */
const ADMIN_API_BASE = '/api/v1/admin/'
const AUTH_API_BASE = '/api/v1/auth/'
const API_V1_BASE = '/api/v1/'

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
    REGISTER_SEND_OTP: `${env.AUTH_API_URL}${AUTH_API_BASE}register/send-otp/`,
    REGISTER_VERIFY_OTP: `${env.AUTH_API_URL}${AUTH_API_BASE}register/verify-otp/`,
    CREATE_PASSWORD: `${env.AUTH_API_URL}${API_V1_BASE}register/`,
    CREATE_ORGANIZATION: `${env.AUTH_API_URL}${ADMIN_API_BASE}organizations/`,
    SIGNIN: `${env.AUTH_API_URL}${API_V1_BASE}token/`,
  },
  // Event endpoints
  EVENT: {
    CREATE: `${env.AUTH_API_URL}${ADMIN_API_BASE}event/`,
    LIST: `${env.AUTH_API_URL}${ADMIN_API_BASE}event/`,
    GET: (eventUuid: string) => `${env.AUTH_API_URL}${ADMIN_API_BASE}event/${eventUuid}/`,
  },
  // Timezone endpoints
  TIMEZONE: {
    LIST: `${env.AUTH_API_URL}${ADMIN_API_BASE}timezones/`,
  },
  // Webpage endpoints
  WEBPAGE: {
    CREATE: `${env.AUTH_API_URL}${ADMIN_API_BASE}webpages/`,
    LIST: (eventUuid: string) => `${env.AUTH_API_URL}${ADMIN_API_BASE}webpages/?event_uuid=${eventUuid}`,
    GET: (webpageUuid: string, eventUuid: string) => `${env.AUTH_API_URL}${ADMIN_API_BASE}webpages/${webpageUuid}/?event_uuid=${eventUuid}`,
  },
  // User Management endpoints
  USER_MANAGEMENT: {
    UPLOAD_USER: `${env.AUTH_API_URL}${ADMIN_API_BASE}attendees/upload-excel/`,
    LIST: (eventUuid: string) => `${env.AUTH_API_URL}${ADMIN_API_BASE}attendees/?event_uuid=${eventUuid}`,
  },
  // Speaker Management endpoints
  SPEAKER_MANAGEMENT: {
    UPLOAD_SPEAKER: `${env.AUTH_API_URL}${ADMIN_API_BASE}speakers/import/`,
    LIST: (eventUuid: string) => `${env.AUTH_API_URL}${ADMIN_API_BASE}speakers/?event=${eventUuid}`,
  },
  // Resource Management endpoints
  RESOURCE: {
    CREATE_FOLDER: `${env.AUTH_API_URL}${ADMIN_API_BASE}resources/folders/`,
    DELETE_FOLDER: (uuid: string) => `${env.AUTH_API_URL}${ADMIN_API_BASE}resources/folders/${uuid}/`,
    LIST_FOLDERS: (eventUuid: string, parentFolderId?: string | null) => {
      let url = `${env.AUTH_API_URL}${ADMIN_API_BASE}resources/folders/?event_uuid=${eventUuid}`
      // Only add parent parameter if it's explicitly provided (not null/undefined)
      // When undefined, fetch all folders; when null, fetch root folders; when string, fetch nested folders
      if (parentFolderId !== undefined && parentFolderId !== null) {
        url += `&parent=${parentFolderId}`
      }
      return url
    },
    UPLOAD_FILE: `${env.AUTH_API_URL}${ADMIN_API_BASE}resources/files/`,
    DELETE_FILE: (uuid: string) => `${env.AUTH_API_URL}${ADMIN_API_BASE}resources/files/${uuid}/`,
    LIST_FILES: (folderId?: string | null) => {
      let url = `${env.AUTH_API_URL}${ADMIN_API_BASE}resources/files/`
      if (folderId !== undefined && folderId !== null) {
        url += `?folder=${folderId}`
      }
      return url
    },
  },
}

