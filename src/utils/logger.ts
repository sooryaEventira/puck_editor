/**
 * Logger utility for conditional logging based on environment
 * Only logs in development mode to keep production clean
 */

const IS_DEV = import.meta.env.DEV

export const logger = {
  /**
   * Log general information (dev only)
   */
  log: (...args: any[]) => {
    if (IS_DEV) {
      console.log(...args)
    }
  },

  /**
   * Log errors (always shown)
   */
  error: (...args: any[]) => {
    console.error(...args)
  },

  /**
   * Log warnings (dev only)
   */
  warn: (...args: any[]) => {
    if (IS_DEV) {
      console.warn(...args)
    }
  },

  /**
   * Log debug information (dev only)
   */
  debug: (...args: any[]) => {
    if (IS_DEV) {
      console.debug(...args)
    }
  },

  /**
   * Log information (always shown)
   */
  info: (...args: any[]) => {
    console.info(...args)
  }
}

