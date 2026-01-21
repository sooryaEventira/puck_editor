import { API_ENDPOINTS } from '../config/env'
import { showToast } from '../utils/toast'
import { handleApiError, handleNetworkError, handleParseError } from '../utils/errorHandler'
import type { ApiResponse } from './authService'

export interface CreateWebpageRequest {
  event_uuid: string
  name: string
  content: {
    [key: string]: {
      title: string
      slug: string
      data: {
        [slug: string]: {
          root: {
            props: any
          }
          content: any[]
          zones: any
        }
      }
    }
  }
}

export interface CreateWebpageResponseData {
  uuid: string
  event: string
  name: string
  slug: string
  content: any
  created_by: number
  updated_by: number
  created_date: string
  updated_date: string
}

export interface WebpageData {
  uuid: string
  event: string
  name: string
  slug: string
  content: any
  created_by: number
  updated_by: number
  created_date: string
  updated_date: string
}

export const createWebpage = async (request: CreateWebpageRequest): Promise<CreateWebpageResponseData> => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      const errorMessage = handleApiError('Authentication required. Please login again.', undefined, 'Authentication required. Please login again.')
      throw new Error(errorMessage)
    }

    const organizationUuid = localStorage.getItem('organizationUuid')
    if (!organizationUuid) {
      const errorMessage = handleApiError('Organization UUID is missing. Please create or select an organization first.', undefined, 'Organization UUID is missing. Please create or select an organization first.')
      throw new Error(errorMessage)
    }

    const response = await fetch(API_ENDPOINTS.WEBPAGE.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      credentials: 'include',
      body: JSON.stringify(request),
    })

    if (!response || !response.ok) {
      if (!response) {
        const errorMessage = handleNetworkError(null)
        throw new Error(errorMessage)
      }

      try {
        const responseText = await response.text()
        let errorData: any = null
        
        try {
          errorData = responseText ? JSON.parse(responseText) : null
        } catch (jsonError) {
          if (responseText && responseText.trim()) {
            const errorMessage = handleApiError(responseText.trim(), response, 'An error occurred. Please try again.')
            throw new Error(errorMessage)
          }
        }
        
        if (errorData) {
          const errorMessage = handleApiError(errorData, response, 'An error occurred. Please try again.')
          throw new Error(errorMessage)
        }
        
        const errorMessage = handleApiError(null, response, 'An error occurred. Please try again.')
        throw new Error(errorMessage)
      } catch (parseError) {
        if (parseError instanceof Error && (
            parseError.message.includes('An error occurred') ||
            parseError.message.includes('Cannot connect') ||
            parseError.message.includes('Failed to')
        )) {
          throw parseError
        }
        const errorMessage = handleApiError(null, response, 'An error occurred. Please try again.')
        throw new Error(errorMessage)
      }
    }

    let data: ApiResponse<CreateWebpageResponseData>
    try {
      data = await response.json()
    } catch (parseError) {
      const errorMessage = handleParseError('Invalid response from server. Please try again.')
      throw new Error(errorMessage)
    }

    if (data.status === 'error') {
      const errorMessage = handleApiError(data, undefined, 'Failed to create webpage. Please try again.')
      throw new Error(errorMessage)
    }

    if (data.status === 'success') {
      showToast.success(data.message || 'Webpage created successfully')
    }

    if (!data.data) {
      throw new Error('No data returned from server')
    }

    return data.data
  } catch (error) {
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
        error.message.includes('No data returned') ||
        error.message.includes('Failed to')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to create webpage. Please try again.'
    handleApiError(errorMessage, undefined, 'Failed to create webpage. Please try again.')
    throw new Error(errorMessage)
  }
}

export const fetchWebpages = async (eventUuid: string): Promise<WebpageData[]> => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      const errorMessage = handleApiError('Authentication required. Please login again.', undefined, 'Authentication required. Please login again.')
      throw new Error(errorMessage)
    }

    const organizationUuid = localStorage.getItem('organizationUuid')
    if (!organizationUuid) {
      const errorMessage = handleApiError('Organization UUID is missing. Please create or select an organization first.', undefined, 'Organization UUID is missing. Please create or select an organization first.')
      throw new Error(errorMessage)
    }

    if (!eventUuid) {
      const errorMessage = handleApiError('Event UUID is required.', undefined, 'Event UUID is required.')
      throw new Error(errorMessage)
    }

    const url = API_ENDPOINTS.WEBPAGE.LIST(eventUuid)
    console.log('📡 fetchWebpages: Fetching from URL:', url)
    console.log('📡 fetchWebpages: Event UUID:', eventUuid)
    console.log('📡 fetchWebpages: Organization UUID:', organizationUuid)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      credentials: 'include',
    })
    
    console.log('📡 fetchWebpages: Response status:', response.status, response.statusText)

    if (!response || !response.ok) {
      if (!response) {
        const errorMessage = handleNetworkError(null)
        throw new Error(errorMessage)
      }

      try {
        const responseText = await response.text()
        let errorData: any = null
        
        try {
          errorData = responseText ? JSON.parse(responseText) : null
        } catch (jsonError) {
          if (responseText && responseText.trim()) {
            const errorMessage = handleApiError(responseText.trim(), response, 'An error occurred. Please try again.')
            throw new Error(errorMessage)
          }
        }
        
        if (errorData) {
          const errorMessage = handleApiError(errorData, response, 'An error occurred. Please try again.')
          throw new Error(errorMessage)
        }
        
        const errorMessage = handleApiError(null, response, 'An error occurred. Please try again.')
        throw new Error(errorMessage)
      } catch (parseError) {
        if (parseError instanceof Error && (
            parseError.message.includes('An error occurred') ||
            parseError.message.includes('Cannot connect') ||
            parseError.message.includes('Failed to')
        )) {
          throw parseError
        }
        const errorMessage = handleApiError(null, response, 'An error occurred. Please try again.')
        throw new Error(errorMessage)
      }
    }

    let data: any
    try {
      const responseText = await response.text()
      console.log('📡 fetchWebpages: Raw response text:', responseText.substring(0, 500))
      
      if (!responseText || responseText.trim() === '') {
        console.log('⚠️ fetchWebpages: Empty response, returning empty array')
        return []
      }
      
      data = JSON.parse(responseText)
      console.log('📡 fetchWebpages: Parsed response data:', data)
    } catch (parseError) {
      console.error('❌ fetchWebpages: Failed to parse response:', parseError)
      const errorMessage = handleParseError('Invalid response from server. Please try again.')
      throw new Error(errorMessage)
    }

    // Handle ApiResponse format (with status field)
    if (data.status === 'error') {
      const errorMessage = handleApiError(data, undefined, 'Failed to fetch webpages. Please try again.')
      throw new Error(errorMessage)
    }

    // Extract data from various possible response structures
    let responseData: any = null
    
    // Case 1: ApiResponse format with data field
    if (data.status === 'success' && data.data) {
      responseData = data.data
      console.log('✅ fetchWebpages: Found data in ApiResponse format')
    }
    // Case 2: Direct array response
    else if (Array.isArray(data)) {
      responseData = data
      console.log('✅ fetchWebpages: Found direct array response')
    }
    // Case 3: Object with data field (no status)
    else if (data.data && Array.isArray(data.data)) {
      responseData = data.data
      console.log('✅ fetchWebpages: Found data in data field')
    }
    // Case 4: Object with results field
    else if (data.results && Array.isArray(data.results)) {
      responseData = data.results
      console.log('✅ fetchWebpages: Found data in results field')
    }
    // Case 5: Direct data field (no status, might be object)
    else if (data.data) {
      responseData = data.data
      console.log('✅ fetchWebpages: Found data field (non-array)')
    }
    // Case 6: Empty or null
    else {
      console.log('⚠️ fetchWebpages: No data found in response, returning empty array')
      return []
    }

    // Ensure responseData is an array
    let webpages: WebpageData[]
    if (Array.isArray(responseData)) {
      webpages = responseData
      console.log('✅ fetchWebpages: Returning', webpages.length, 'webpages')
    } else {
      console.log('⚠️ fetchWebpages: Response data is not an array, returning empty array')
      return []
    }

    return webpages
  } catch (error) {
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

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch webpages. Please try again.'
    handleApiError(errorMessage, undefined, 'Failed to fetch webpages. Please try again.')
    throw new Error(errorMessage)
  }
}

export const fetchWebpage = async (webpageUuid: string, eventUuid: string): Promise<WebpageData> => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      const errorMessage = handleApiError('Authentication required. Please login again.', undefined, 'Authentication required. Please login again.')
      throw new Error(errorMessage)
    }

    const organizationUuid = localStorage.getItem('organizationUuid')
    if (!organizationUuid) {
      const errorMessage = handleApiError('Organization UUID is missing. Please create or select an organization first.', undefined, 'Organization UUID is missing. Please create or select an organization first.')
      throw new Error(errorMessage)
    }

    if (!webpageUuid) {
      const errorMessage = handleApiError('Webpage UUID is required.', undefined, 'Webpage UUID is required.')
      throw new Error(errorMessage)
    }

    if (!eventUuid) {
      const errorMessage = handleApiError('Event UUID is required.', undefined, 'Event UUID is required.')
      throw new Error(errorMessage)
    }

    const url = API_ENDPOINTS.WEBPAGE.GET(webpageUuid, eventUuid)
    console.log('📡 fetchWebpage: Fetching from URL:', url)
    console.log('📡 fetchWebpage: Webpage UUID:', webpageUuid)
    console.log('📡 fetchWebpage: Event UUID:', eventUuid)
    console.log('📡 fetchWebpage: Organization UUID:', organizationUuid)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      credentials: 'include',
    })
    
    console.log('📡 fetchWebpage: Response status:', response.status, response.statusText)

    if (!response || !response.ok) {
      if (!response) {
        const errorMessage = handleNetworkError(null)
        throw new Error(errorMessage)
      }

      try {
        const responseText = await response.text()
        let errorData: any = null
        
        try {
          errorData = responseText ? JSON.parse(responseText) : null
        } catch (jsonError) {
          if (responseText && responseText.trim()) {
            const errorMessage = handleApiError(responseText.trim(), response, 'An error occurred. Please try again.')
            throw new Error(errorMessage)
          }
        }
        
        if (errorData) {
          const errorMessage = handleApiError(errorData, response, 'An error occurred. Please try again.')
          throw new Error(errorMessage)
        }
        
        const errorMessage = handleApiError(null, response, 'An error occurred. Please try again.')
        throw new Error(errorMessage)
      } catch (parseError) {
        if (parseError instanceof Error && (
            parseError.message.includes('An error occurred') ||
            parseError.message.includes('Cannot connect') ||
            parseError.message.includes('Failed to')
        )) {
          throw parseError
        }
        const errorMessage = handleApiError(null, response, 'An error occurred. Please try again.')
        throw new Error(errorMessage)
      }
    }

    let data: any
    try {
      const responseText = await response.text()
      console.log('📡 fetchWebpage: Raw response text:', responseText.substring(0, 500))
      
      if (!responseText || responseText.trim() === '') {
        const errorMessage = handleParseError('Empty response from server. Please try again.')
        throw new Error(errorMessage)
      }
      
      data = JSON.parse(responseText)
      console.log('📡 fetchWebpage: Parsed response data:', data)
    } catch (parseError) {
      console.error('❌ fetchWebpage: Failed to parse response:', parseError)
      const errorMessage = handleParseError('Invalid response from server. Please try again.')
      throw new Error(errorMessage)
    }

    // Handle ApiResponse format (with status field)
    if (data.status === 'error') {
      const errorMessage = handleApiError(data, undefined, 'Failed to fetch webpage. Please try again.')
      throw new Error(errorMessage)
    }

    // Extract data from various possible response structures
    let webpageData: WebpageData | null = null
    
    // Case 1: ApiResponse format with data field
    if (data.status === 'success' && data.data) {
      webpageData = data.data
      console.log('✅ fetchWebpage: Found data in ApiResponse format')
    }
    // Case 2: Direct object response
    else if (data && typeof data === 'object' && data.uuid) {
      webpageData = data
      console.log('✅ fetchWebpage: Found direct object response')
    }
    // Case 3: Object with data field (no status)
    else if (data.data && typeof data.data === 'object' && data.data.uuid) {
      webpageData = data.data
      console.log('✅ fetchWebpage: Found data in data field')
    }
    // Case 4: Empty or null
    else {
      const errorMessage = handleParseError('No webpage data found in response. Please try again.')
      throw new Error(errorMessage)
    }

    if (!webpageData) {
      const errorMessage = handleParseError('Invalid webpage data received from server. Please try again.')
      throw new Error(errorMessage)
    }

    console.log('✅ fetchWebpage: Returning webpage data')
    return webpageData
  } catch (error) {
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
        error.message.includes('Webpage UUID') ||
        error.message.includes('No webpage data') ||
        error.message.includes('Invalid webpage data') ||
        error.message.includes('Empty response') ||
        error.message.includes('Failed to')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch webpage. Please try again.'
    handleApiError(errorMessage, undefined, 'Failed to fetch webpage. Please try again.')
    throw new Error(errorMessage)
  }
}
