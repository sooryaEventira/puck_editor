import { env, API_ENDPOINTS } from '../config/env'

/**
 * Check if page API is configured and available
 */
export const isPageApiAvailable = (): boolean => {
  return !!env.PAGE_API_URL && env.PAGE_API_URL.trim() !== ''
}

/**
 * Safe fetch wrapper that handles CORS and network errors gracefully
 */
export const safeFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response | null> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    return response
  } catch (error: any) {
    // Silently handle network errors (CORS, server down, timeout, etc.)
    console.debug('API request failed:', error?.message || error)
    return null
  }
}






