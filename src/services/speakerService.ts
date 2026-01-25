import { API_ENDPOINTS } from '../config/env'
import { showToast } from '../utils/toast'
import { handleApiError, handleNetworkError, handleParseError } from '../utils/errorHandler'
import type { ApiResponse } from './authService'

export interface UploadedSpeakerItem {
  id: number
  event: number
  profile: number
  role: string
  is_active: boolean
  user_email: string
}

export interface UploadSpeakerResponseData {
  message?: string
  data?: UploadedSpeakerItem[]
  [key: string]: any
}

export interface SpeakerData {
  id?: string
  uuid?: string
  name?: string
  first_name?: string
  last_name?: string
  email: string
  avatar_url?: string
  // banner_url?: string
  // status?: string
  // bio?: string
  organization?: string
  title?: string
  // groups?: Array<{
  //   id: string
  //   name: string
  //   variant?: 'primary' | 'info' | 'muted'
  // }>
  // sessions?: string[]
  // social_links?: {
  //   linkedin?: string
  //   twitter?: string
  //   website?: string
  // }
  [key: string]: any
}

/**
 * Upload speaker file (XLSX) for speaker management
 */
export const uploadSpeakerFile = async (file: File, eventUuid?: string): Promise<ApiResponse<UploadSpeakerResponseData>> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = handleApiError('Authentication required. Please login again.', undefined, 'Authentication required. Please login again.')
      throw new Error(errorMessage)
    }

    // Get organization UUID from localStorage
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = handleApiError('Organization UUID is missing. Please create or select an organization first.', undefined, 'Organization UUID is missing. Please create or select an organization first.')
      throw new Error(errorMessage)
    }

    // Get event UUID - try from parameter, then from localStorage, then from created event
    let event_uuid = eventUuid
    if (!event_uuid) {
      // Try to get from localStorage (stored created event)
      const storedEvent = localStorage.getItem('created-event')
      if (storedEvent) {
        try {
          const parsedEvent = JSON.parse(storedEvent)
          event_uuid = parsedEvent.uuid
        } catch {
          // Ignore parse errors
        }
      }
    }

    if (!event_uuid) {
      const errorMessage = handleApiError('Event UUID is required. Please select an event first.', undefined, 'Event UUID is required. Please select an event first.')
      throw new Error(errorMessage)
    }

    // Prepare FormData for file upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('event', event_uuid)

    const response = await fetch(API_ENDPOINTS.SPEAKER_MANAGEMENT.UPLOAD_SPEAKER, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      credentials: 'include',
      body: formData,
    })

    console.log('📤 uploadSpeakerFile: Response status:', response.status, response.statusText)
    console.log('📤 uploadSpeakerFile: Response headers:', Object.fromEntries(response.headers.entries()))

    // Get response text first (can only read once)
    const responseText = await response.text()
    console.log('📥 uploadSpeakerFile: Raw response text:', responseText)

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      if (!response) {
        const errorMessage = handleNetworkError(null)
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      try {
        let errorData: any = null
        
        // Try to parse as JSON
        try {
          errorData = responseText ? JSON.parse(responseText) : null
          console.error('❌ uploadSpeakerFile: Error response data:', errorData)
        } catch (jsonError) {
          // Response is not JSON, use text as error message if available
          console.error('❌ uploadSpeakerFile: Error response text (not JSON):', responseText)
          if (responseText && responseText.trim()) {
            const errorMessage = handleApiError(responseText.trim(), response, 'Failed to upload speakers. Please try again.')
            throw new Error(errorMessage)
          }
        }
        
        if (errorData) {
          const errorMessage = handleApiError(errorData, response, 'Failed to upload speakers. Please try again.')
          throw new Error(errorMessage)
        }
        
        // If we couldn't parse or extract error, show generic message only as last resort
        const errorMessage = handleApiError(null, response, 'Failed to upload speakers. Please try again.')
        throw new Error(errorMessage)
      } catch (parseError) {
        // If it's already our custom error, re-throw it
        if (parseError instanceof Error && (
            parseError.message.includes('Failed to upload') ||
            parseError.message.includes('Cannot connect')
        )) {
          throw parseError
        }
        // Last resort: only show generic message if we truly can't extract anything
        const errorMessage = handleApiError(null, response, 'Failed to upload speakers. Please try again.')
        throw new Error(errorMessage)
      }
    }

    // Parse successful response
    let data: ApiResponse<UploadSpeakerResponseData>
    try {
      // Parse JSON from text
      data = JSON.parse(responseText)
      console.log('✅ uploadSpeakerFile: Parsed response data:', JSON.stringify(data, null, 2))
    } catch (parseError) {
      console.error('❌ uploadSpeakerFile: Failed to parse response:', parseError)
      const errorMessage = handleParseError('Invalid response from server. Please try again.')
      throw new Error(errorMessage)
    }

    // Check if response has error status
    if (data.status === 'error') {
      console.error('❌ uploadSpeakerFile: Error response:', data)
      const errorMessage = handleApiError(data, undefined, 'Failed to upload speakers. Please try again.')
      throw new Error(errorMessage)
    }

    // Success response
    if (data.status === 'success') {
      console.log('✅ uploadSpeakerFile: Success response:', data)

      // Speaker Excel import: "create" response (what backend created)
      console.log('🧾 Speaker Excel Import (create) response:', {
        message: (data as any).message,
        count: Array.isArray((data as any).data) ? (data as any).data.length : undefined,
        data: (data as any).data
      })
      
      // Log uploaded speakers details
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        console.log(`✅ uploadSpeakerFile: Successfully uploaded ${data.data.length} speaker(s):`)
        data.data.forEach((speaker, index) => {
          console.log(`  ${index + 1}. ${speaker.user_email} - Role: ${speaker.role} (ID: ${speaker.id}, Profile: ${speaker.profile}, Active: ${speaker.is_active})`)
        })
      } else {
        console.log('⚠️ uploadSpeakerFile: Success response but no speaker data in response')
      }
      
      const successMessage = data.message || (data.data && data.data.length > 0 
        ? `Successfully uploaded ${data.data.length} speaker(s)` 
        : 'Speakers uploaded successfully')
      showToast.success(successMessage)
    }

    return data
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      if (!error.message.includes('Cannot connect')) {
        handleNetworkError(error)
      }
      throw new Error(error.message || 'Network error occurred')
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.includes('Cannot connect') || 
        error.message.includes('Invalid response') ||
        error.message.includes('Authentication required') ||
        error.message.includes('Organization UUID') ||
        error.message.includes('Event UUID') ||
        error.message.includes('Failed to upload')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to upload speakers. Please try again.'
    handleApiError(errorMessage, undefined, 'Failed to upload speakers. Please try again.')
    throw new Error(errorMessage)
  }
}

/**
 * Fetch speakers for an event
 */
export const fetchSpeakers = async (eventUuid: string): Promise<SpeakerData[]> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = handleApiError('Authentication required. Please login again.', undefined, 'Authentication required. Please login again.')
      throw new Error(errorMessage)
    }

    // Get organization UUID from localStorage
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = handleApiError('Organization UUID is missing. Please create or select an organization first.', undefined, 'Organization UUID is missing. Please create or select an organization first.')
      throw new Error(errorMessage)
    }

    if (!eventUuid) {
      const errorMessage = handleApiError('Event UUID is required.', undefined, 'Event UUID is required.')
      throw new Error(errorMessage)
    }

    const url = API_ENDPOINTS.SPEAKER_MANAGEMENT.LIST(eventUuid)
    console.log('📡 fetchSpeakers: Fetching from URL:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      credentials: 'include',
    })
    
    console.log('📡 fetchSpeakers: Response status:', response.status, response.statusText)

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      if (!response) {
        const errorMessage = handleNetworkError(null)
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      try {
        const responseText = await response.text()
        let errorData: any = null
        
        // Try to parse as JSON
        try {
          errorData = responseText ? JSON.parse(responseText) : null
        } catch (jsonError) {
          // Response is not JSON, use text as error message if available
          if (responseText && responseText.trim()) {
            const errorMessage = handleApiError(responseText.trim(), response, 'Failed to fetch speakers. Please try again.')
            throw new Error(errorMessage)
          }
        }
        
        if (errorData) {
          const errorMessage = handleApiError(errorData, response, 'Failed to fetch speakers. Please try again.')
          throw new Error(errorMessage)
        }
        
        // If we couldn't parse or extract error, try to get response status text
        const errorMessage = handleApiError(null, response, 'Failed to fetch speakers. Please try again.')
        console.error('Speaker fetch error - Status:', response.status, 'Response:', responseText?.substring(0, 200))
        throw new Error(errorMessage)
      } catch (parseError) {
        // If it's already our custom error, re-throw it
        if (parseError instanceof Error && (
            parseError.message.includes('Failed to fetch') ||
            parseError.message.includes('Cannot connect')
        )) {
          throw parseError
        }
        // Last resort: show status-based error message
        const errorMessage = handleApiError(null, response, 'Failed to fetch speakers. Please try again.')
        console.error('Speaker fetch parse error:', parseError)
        throw new Error(errorMessage)
      }
    }

    // Parse successful response
    let responseData: any
    try {
      responseData = await response.json()
    } catch (parseError) {
      const errorMessage = handleParseError('Invalid response from server. Please try again.')
      throw new Error(errorMessage)
    }

    // Handle different response formats
    // Check if response has error status (ApiResponse format)
    if (responseData.status === 'error') {
      const errorMessage = handleApiError(responseData, undefined, 'Failed to fetch speakers. Please try again.')
      throw new Error(errorMessage)
    }

    // Extract speakers from response - handle multiple formats
    let speakers: SpeakerData[]
    
    console.log('📡 fetchSpeakers: Raw response data:', responseData)
    
    // Format 1: Direct array
    if (Array.isArray(responseData)) {
      speakers = responseData
      console.log('✅ fetchSpeakers: Found direct array format with', speakers.length, 'speakers')
    }
    // Format 2: Wrapped in data field (ApiResponse format)
    else if (responseData.data && Array.isArray(responseData.data)) {
      speakers = responseData.data
      console.log('✅ fetchSpeakers: Found data array format with', speakers.length, 'speakers')
    }
    // Format 3: Wrapped in results field (Django REST Framework pagination)
    else if (responseData.results && Array.isArray(responseData.results)) {
      speakers = responseData.results
      console.log('✅ fetchSpeakers: Found results array format with', speakers.length, 'speakers')
    }
    // Format 4: Direct object with data
    else if (responseData.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
      // Single object - wrap in array
      speakers = [responseData.data]
      console.log('✅ fetchSpeakers: Found single object format, wrapped in array')
    }
    // Format 5: Empty or unexpected format
    else {
      console.warn('⚠️ fetchSpeakers: Unexpected response format:', responseData)
      return []
    }

    console.log('📡 fetchSpeakers: Extracted speakers:', speakers)
    // Speaker Excel import: "list" response (raw speaker records returned by backend)
    console.log('🧾 Speaker Excel Import (list) response:', {
      count: Array.isArray(speakers) ? speakers.length : 0,
      speakers
    })
    // Note: Profile data should ideally be included in the API response
    // If profile is just an ID, the mapping in SpeakerManagementPage will handle it
    return speakers || []
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      if (!error.message.includes('Cannot connect')) {
        handleNetworkError(error)
      }
      throw new Error(error.message || 'Network error occurred')
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.includes('Cannot connect') || 
        error.message.includes('Invalid response') ||
        error.message.includes('Authentication required') ||
        error.message.includes('Organization UUID') ||
        error.message.includes('Event UUID') ||
        error.message.includes('Failed to fetch')
    )) {
      throw error
    }

    // For any other errors, show the actual error message if available
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch speakers. Please try again.'
    handleApiError(errorMessage, undefined, 'Failed to fetch speakers. Please try again.')
    throw new Error(errorMessage)
  }
}
