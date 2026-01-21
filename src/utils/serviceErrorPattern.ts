/**
 * Common error handling patterns for service functions
 * This file provides reusable error handling utilities
 */

import { handleApiError, handleNetworkError, handleParseError } from './errorHandler'

/**
 * Standard error handling for API responses
 * Use this pattern in all service functions
 */
export const handleServiceError = async (
  response: Response | null,
  defaultMessage: string = 'An error occurred. Please try again.'
): Promise<never> => {
  if (!response) {
    const errorMessage = handleNetworkError(null)
    throw new Error(errorMessage)
  }

  try {
    const responseText = await response.text()
    let errorData: any = null
    
    try {
      errorData = responseText ? JSON.parse(responseText) : null
    } catch {
      if (responseText && responseText.trim()) {
        const errorMessage = handleApiError(responseText.trim(), response, defaultMessage)
        throw new Error(errorMessage)
      }
    }
    
    if (errorData) {
      const errorMessage = handleApiError(errorData, response, defaultMessage)
      throw new Error(errorMessage)
    }
    
    const errorMessage = handleApiError(null, response, defaultMessage)
    throw new Error(errorMessage)
  } catch (parseError) {
    if (parseError instanceof Error && (
        parseError.message.includes('Failed to') ||
        parseError.message.includes('Cannot connect')
    )) {
      throw parseError
    }
    const errorMessage = handleApiError(null, response, defaultMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Standard catch block error handling
 */
export const handleServiceCatch = (
  error: any,
  defaultMessage: string = 'An error occurred. Please try again.'
): never => {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    if (!error.message.includes('Cannot connect')) {
      handleNetworkError(error)
    }
    throw new Error(error.message || 'Network error occurred')
  }

  if (error instanceof Error && (
      error.message.includes('Cannot connect') || 
      error.message.includes('Invalid response') ||
      error.message.includes('Authentication required') ||
      error.message.includes('Organization UUID') ||
      error.message.includes('Event UUID') ||
      error.message.includes('Failed to')
  )) {
    throw error
  }

  const errorMessage = error instanceof Error ? error.message : defaultMessage
  handleApiError(errorMessage, undefined, defaultMessage)
  throw new Error(errorMessage)
}
