import { API_ENDPOINTS, env } from '../config/env'
import { showToast } from '../utils/toast'

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message: string
  errors: string[]
  data: T
}

export interface TimezoneData {
  uuid: string
  name: string
  label: string
  utc_offset: string
}

export interface CreateEventRequest {
  eventName: string
  startDate: string // YYYY-MM-DD format
  startDateTimeISO: string // ISO format with time
  startTime: string // HH:mm format
  endDate: string // YYYY-MM-DD format
  endDateTimeISO: string // ISO format with time
  endTime: string // HH:mm format
  timezoneId: string // Timezone identifier (IANA or UUID)
  location: string
  attendees: number
  eventExperience: 'in-person' | 'virtual' | 'hybrid'
  logo?: File | null
  banner?: File | null
  fixTimezoneForAttendees?: boolean
}

export interface CreateEventResponseData {
  uuid: string
  eventName: string
  attendees: number
  location: string
  startDateTimeISO: string
  endDateTimeISO: string
  eventExperience: 'in-person' | 'virtual' | 'hybrid'
  font: string
  colorScheme: string
  timezone: TimezoneData
  logo: string | null
  banner: string | null
  fixTimezoneForAttendees: boolean
}

/**
 * Fetch all timezones from the backend
 */
export const fetchTimezones = async (): Promise<TimezoneData[]> => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      console.warn('⚠️ [eventService] No access token for timezone fetch')
      return []
    }

    const endpoint = API_ENDPOINTS.TIMEZONE.LIST
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    console.log('🔍 [eventService] Fetching timezones from API:', {
      endpoint,
      hasAccessToken: !!accessToken,
      hasOrganizationUuid: !!organizationUuid,
      tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'none',
      organizationUuid: organizationUuid || 'not set'
    })
    
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is required. Please complete organization setup first.'
      console.error('❌ [eventService] No organization UUID found. API requires X-Organization header.')
      throw new Error(errorMessage)
    }
    
    let response: Response
    try {
      const headers: HeadersInit = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Organization': organizationUuid, // Required header
      }
      
      response = await fetch(endpoint, {
        method: 'GET',
        headers,
        // Removed credentials: 'include' - not needed for Bearer token auth and causes CORS issues
      })
    } catch (fetchError) {
      // Catch network errors (CORS, connection refused, etc.)
      const isNetworkError = fetchError instanceof TypeError && 
        (fetchError.message.includes('fetch') || 
         fetchError.message.includes('Failed to fetch') ||
         fetchError.message.includes('NetworkError') ||
         fetchError.message.includes('Network request failed'))
      
      if (isNetworkError) {
        console.error('❌ [eventService] Network error fetching timezones:', {
          error: fetchError,
          endpoint,
          message: fetchError instanceof Error ? fetchError.message : String(fetchError)
        })
      }
      throw fetchError
    }

    console.log('📥 [eventService] Timezone API response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    })

    if (!response.ok) {
      // Try to read error response
      let errorText = ''
      try {
        errorText = await response.clone().text()
        console.error('❌ [eventService] Error response body:', errorText || '<empty string>')
      } catch (e) {
        console.error('❌ [eventService] Could not read error response')
      }
      
      // Handle specific error codes
      let errorMessage = ''
      if (response.status === 503) {
        errorMessage = 'Service Unavailable (503): The backend server is temporarily unavailable. The Azure backend may be down or restarting. Please try again in a few moments.'
        console.error('❌ [eventService] 503 Service Unavailable - Backend server issue:', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          isHtmlError: errorText.includes('<html') || errorText.includes('Application Error'),
          possibleCauses: [
            'Azure backend service is down or restarting',
            'Backend application crashed',
            'Backend is under maintenance',
            'Network connectivity issue to Azure',
            'Backend server is overloaded'
          ],
          troubleshooting: [
            'Wait a few moments and try again',
            'Check Azure portal for service status',
            'Verify backend application is running',
            'Check backend logs for errors'
          ]
        })
      } else if (response.status === 502) {
        errorMessage = 'Bad Gateway (502): The backend server is not responding. Please check if the backend is running.'
      } else if (response.status === 504) {
        errorMessage = 'Gateway Timeout (504): The backend server took too long to respond.'
      } else {
        errorMessage = `Server error (${response.status}): ${response.statusText}`
      }
      
      console.error('❌ [eventService] Failed to fetch timezones:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText.substring(0, 500), // Limit error body length in logs
        errorMessage
      })
      
      // Don't show toast for timezone fetch errors - just return empty array
      // The UI will show "No timezones available" message
      return []
    }

    // Try to parse response
    let responseData: any
    try {
      const responseText = await response.text()
      console.log('📄 [eventService] Raw response text (first 1000 chars):', responseText.substring(0, 1000))
      console.log('📄 [eventService] Full response length:', responseText.length)
      
      if (!responseText || responseText.trim() === '') {
        console.error('❌ [eventService] Empty response from timezone API')
        return []
      }
      
      responseData = JSON.parse(responseText)
      console.log('📋 [eventService] Parsed response structure:', {
        isArray: Array.isArray(responseData),
        hasStatus: 'status' in responseData,
        hasData: 'data' in responseData,
        hasResults: 'results' in responseData,
        keys: Object.keys(responseData),
        fullResponse: JSON.stringify(responseData, null, 2).substring(0, 1000)
      })
    } catch (parseError) {
      console.error('❌ [eventService] Failed to parse timezone response:', parseError)
      return []
    }
    
    // Handle response format: { status: 'success', message: '', data: [...] }
    let timezones: TimezoneData[] = []
    
    // Case 1: Direct array response (unlikely but handle it)
    if (Array.isArray(responseData)) {
      console.log('✅ [eventService] Received timezone array directly:', responseData.length)
      timezones = responseData
    }
    // Case 2: Standard ApiResponse format { status: 'success', data: [...] }
    else if (responseData && typeof responseData === 'object') {
      // Check for standard format: { status: 'success', data: [...] }
      if ('data' in responseData && Array.isArray(responseData.data)) {
        console.log('✅ [eventService] Found timezones in data array:', responseData.data.length)
        timezones = responseData.data
      }
      // Check for nested structures (fallback)
      else if ('data' in responseData && responseData.data && typeof responseData.data === 'object') {
        if (Array.isArray(responseData.data.results)) {
          console.log('✅ [eventService] Found timezones in data.results:', responseData.data.results.length)
          timezones = responseData.data.results
        } else if (Array.isArray(responseData.data.items)) {
          console.log('✅ [eventService] Found timezones in data.items:', responseData.data.items.length)
          timezones = responseData.data.items
        } else {
          console.warn('⚠️ [eventService] data field exists but is not an array:', {
            dataType: typeof responseData.data,
            dataKeys: responseData.data ? Object.keys(responseData.data) : 'null',
            dataValue: JSON.stringify(responseData.data).substring(0, 200)
          })
        }
      }
      // Check for top-level results
      else if ('results' in responseData && Array.isArray(responseData.results)) {
        console.log('✅ [eventService] Found timezones in results array:', responseData.results.length)
        timezones = responseData.results
      }
      else {
        console.warn('⚠️ [eventService] Unexpected response format. Keys:', Object.keys(responseData))
        console.warn('⚠️ [eventService] Full response:', JSON.stringify(responseData, null, 2).substring(0, 500))
      }
    }
    
    // Validate timezone data structure
    if (timezones.length > 0) {
      // Check if first item has required fields
      const firstTz = timezones[0] as any
      if (!firstTz.uuid || !firstTz.name) {
        console.warn('⚠️ [eventService] Timezone items missing required fields. First item:', firstTz)
        // Try to map if structure is different (e.g., id instead of uuid)
        if (firstTz.id && !firstTz.uuid) {
          console.log('🔄 [eventService] Mapping id to uuid...')
          timezones = timezones.map(tz => {
            const tzAny = tz as any
            return {
              uuid: tzAny.id || tzAny.uuid,
              name: tzAny.name,
              label: tzAny.label || tzAny.name,
              utc_offset: tzAny.utc_offset || tzAny.utcOffset || '+00:00'
            } as TimezoneData
          })
        }
      }
      console.log('✅ [eventService] Successfully processed timezones:', timezones.length)
      console.log('📋 [eventService] Sample timezone:', timezones[0])
      return timezones
    } else {
      console.warn('⚠️ [eventService] No timezones found in response. Response structure:', {
        isArray: Array.isArray(responseData),
        keys: responseData ? Object.keys(responseData) : 'null',
        responsePreview: JSON.stringify(responseData, null, 2).substring(0, 500)
      })
      return []
    }
  } catch (error) {
    console.error('❌ [eventService] Error fetching timezones:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return []
  }
}

/**
 * Create a new event
 */
export const createEvent = async (eventData: CreateEventRequest): Promise<CreateEventResponseData> => {
  console.log('🎬 [eventService] createEvent called')
  
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    // Debug: Log authentication state
    console.log('🔐 [eventService] Authentication check:', {
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length || 0,
      tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'none',
      authRelatedKeys: Object.keys(localStorage).filter(key => 
        key.toLowerCase().includes('token') || key.toLowerCase().includes('auth')
      )
    })
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please login again.'
      console.error('No access token found in localStorage. Available keys:', Object.keys(localStorage))
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Create FormData to handle file uploads
    const formData = new FormData()
    
    // Add required fields matching API format exactly (only fields from form, no extra data)
    formData.append('eventName', eventData.eventName)
    formData.append('startDate', eventData.startDate)
    formData.append('startDateTimeISO', eventData.startDateTimeISO)
    formData.append('startTime', eventData.startTime)
    formData.append('endDate', eventData.endDate)
    formData.append('endDateTimeISO', eventData.endDateTimeISO)
    formData.append('endTime', eventData.endTime)
    formData.append('timezoneId', eventData.timezoneId)
    formData.append('location', eventData.location)
    formData.append('attendees', eventData.attendees.toString())
    formData.append('eventExperience', eventData.eventExperience)
    formData.append('fixTimezoneForAttendees', (eventData.fixTimezoneForAttendees ?? true).toString())
    
    // Add files if provided
    if (eventData.logo) {
      formData.append('logo', eventData.logo)
    }
    if (eventData.banner) {
      formData.append('banner', eventData.banner)
    }

    const isProduction = import.meta.env.PROD
    const isUsingProxy = API_ENDPOINTS.EVENT.CREATE.startsWith('/api')
    const frontendUrl = window.location.origin
    
    console.log('📡 [eventService] Sending request to API:', {
      url: API_ENDPOINTS.EVENT.CREATE,
      method: 'POST',
      environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
      frontendUrl,
      isUsingProxy,
      hasAccessToken: !!accessToken,
      hasLogo: !!eventData.logo,
      hasBanner: !!eventData.banner,
      formDataFields: {
        eventName: eventData.eventName,
        startDate: eventData.startDate,
        startDateTimeISO: eventData.startDateTimeISO,
        startTime: eventData.startTime,
        endDate: eventData.endDate,
        endDateTimeISO: eventData.endDateTimeISO,
        endTime: eventData.endTime,
        timezoneId: eventData.timezoneId,
        location: eventData.location,
        attendees: eventData.attendees,
        eventExperience: eventData.eventExperience,
        fixTimezoneForAttendees: eventData.fixTimezoneForAttendees
      },
      proxyInfo: {
        isUsingProxy,
        target: isUsingProxy 
          ? (import.meta.env.VITE_PROXY_TARGET || env.AUTH_API_URL)
          : 'Direct URL (no proxy)',
        note: isProduction 
          ? 'Production: Using direct backend URL (proxy not available in production)'
          : 'Development: Using Vite proxy to avoid CORS issues'
      }
    })
    
    // Log FormData contents for debugging
    console.log('📦 [eventService] FormData contents:')
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }

    // Get organization UUID for X-Organization header
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is required. Please complete organization setup first.'
      console.error('❌ [eventService] No organization UUID found. API requires X-Organization header.')
      throw new Error(errorMessage)
    }

    let response: Response
    try {
      const headers: HeadersInit = {
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid, // Required header
        // Don't set Content-Type for FormData - browser will set it with boundary
      }
      
      response = await fetch(API_ENDPOINTS.EVENT.CREATE, {
        method: 'POST',
        headers,
        // Removed credentials: 'include' - not needed for Bearer token auth and causes CORS issues
        body: formData,
      })
    } catch (fetchError) {
      // Catch network errors (CORS, connection refused, etc.)
      const isNetworkError = fetchError instanceof TypeError && 
        (fetchError.message.includes('fetch') || 
         fetchError.message.includes('Failed to fetch') ||
         fetchError.message.includes('NetworkError') ||
         fetchError.message.includes('Network request failed'))
      
      if (isNetworkError) {
        const isProduction = import.meta.env.PROD
        const frontendUrl = isProduction 
          ? window.location.origin 
          : 'http://localhost:3000'
        const backendUrl = API_ENDPOINTS.EVENT.CREATE
        const isDirectUrl = backendUrl.startsWith('http')
        
        console.error('❌ [eventService] Network/CORS Error:', {
          error: fetchError,
          errorMessage: fetchError instanceof Error ? fetchError.message : String(fetchError),
          frontendUrl,
          backendUrl,
          isDirectUrl,
          isProduction,
          troubleshooting: isDirectUrl && isProduction ? [
            'This is likely a CORS (Cross-Origin Resource Sharing) error.',
            `The backend at ${backendUrl} needs to allow requests from ${frontendUrl}`,
            'Backend must include the following CORS headers:',
            `  Access-Control-Allow-Origin: ${frontendUrl} (or *)`,
            '  Access-Control-Allow-Methods: POST, OPTIONS',
            '  Access-Control-Allow-Headers: Authorization, Content-Type',
            '  Access-Control-Allow-Credentials: true',
            'Contact backend team to configure CORS for your frontend domain.'
          ] : [
            'Network connectivity issue detected.',
            `Frontend: ${frontendUrl}`,
            `Backend: ${backendUrl}`,
            'Check if backend server is running and accessible.',
            'Verify network connectivity and firewall settings.'
          ]
        })
        
        const errorMessage = isDirectUrl && isProduction
          ? `CORS Error: The backend server is not allowing requests from ${frontendUrl}. Please contact the backend team to configure CORS.`
          : 'Network Error: Cannot connect to the server. Please check your connection and ensure the backend is running.'
        
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }
      
      // Re-throw if not a network error
      throw fetchError
    }
    
    console.log('📥 [eventService] Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    })

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      // Network error or CORS error - response might not exist
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please check your connection.'
        console.error('❌ [eventService] Network error: Server is not reachable', API_ENDPOINTS.EVENT.CREATE)
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      let responseText = ''
      try {
        // Try to read response as text first to see what we got
        responseText = await response.clone().text()
        console.error('❌ [eventService] Error response body:', responseText || '<empty string>')
        
        // If response is empty, it's likely a proxy/connectivity issue
        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response body')
        }
        
        // Try to parse as JSON
        const errorData: ApiResponse = JSON.parse(responseText)
        const errorMessage = errorData.message || `Server error (${response.status})`
        const errors = errorData.errors || []
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        
        console.error('❌ [eventService] Parsed error data:', errorData)
        showToast.error(errorText)
        throw new Error(errorText)
      } catch (parseError) {
        // Failed to parse error response - might be HTML, plain text, or empty
        console.error('❌ [eventService] Failed to parse error response:', parseError)
        console.error('❌ [eventService] Raw response text:', responseText || '<empty - no response body>')
        
        // Provide more specific error messages based on status code
        let errorMessage = ''
        const isUsingProxy = API_ENDPOINTS.EVENT.CREATE.startsWith('/api')
        
        if (response.status === 502) {
          if (!responseText || responseText.trim() === '') {
            errorMessage = 'Bad Gateway (502): The backend server is not responding or is unreachable. The proxy received no response from the backend.'
          } else {
            errorMessage = 'Bad Gateway (502): The backend server returned an invalid response.'
          }
          
          const actualBackendUrl = isUsingProxy 
            ? (import.meta.env.VITE_PROXY_TARGET || env.AUTH_API_URL)
            : API_ENDPOINTS.EVENT.CREATE
          
          console.error('❌ [eventService] 502 Bad Gateway - Backend server issue:', {
            endpoint: API_ENDPOINTS.EVENT.CREATE,
            isUsingProxy,
            proxyTarget: actualBackendUrl,
            fullBackendUrl: isUsingProxy ? `${actualBackendUrl}${API_ENDPOINTS.EVENT.CREATE}` : API_ENDPOINTS.EVENT.CREATE,
            responseBody: responseText || '<empty>',
            possibleCauses: [
              'Backend server is down or not running',
              'Backend server URL is incorrect',
              'Network connectivity issue between proxy and backend',
              'Backend server is blocking the request',
              'CORS or firewall blocking the connection',
              'The /api/v1/event/ endpoint may not exist on the backend'
            ],
            troubleshooting: [
              `Verify backend is accessible: ${actualBackendUrl}`,
              'Check if backend server is running',
              'Verify the endpoint /api/v1/event/ exists',
              'Check network connectivity',
              'Check proxy configuration in vite.config.ts',
              'Try accessing backend health endpoint (if available)'
            ]
          })
        } else if (response.status === 503) {
          errorMessage = 'Service Unavailable (503): The backend server is temporarily unavailable.'
        } else if (response.status === 504) {
          errorMessage = 'Gateway Timeout (504): The backend server took too long to respond.'
        } else {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }
    }

    // Parse successful response
    console.log('📄 [eventService] Parsing response JSON...')
    const responseData: ApiResponse<CreateEventResponseData> = await response.json()
    
    console.log('📋 [eventService] Response data:', {
      status: responseData.status,
      message: responseData.message,
      hasData: !!responseData.data,
      errors: responseData.errors,
      eventUuid: responseData.data?.uuid,
      eventName: responseData.data?.eventName
    })

    // Check if response indicates success
    if (responseData.status === 'success' && responseData.data) {
      console.log('✅ [eventService] Event created successfully!', responseData.data)
      showToast.success('Event created successfully!')
      return responseData.data
    } else {
      // API returned error status
      const errorMessage = responseData.message || 'Failed to create event'
      const errors = responseData.errors || []
      const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
      showToast.error(errorText)
      throw new Error(errorText)
    }
  } catch (error) {
    // Re-throw if it's already an Error with message
    if (error instanceof Error) {
      throw error
    }

    // Generic error fallback
    console.error('Error creating event:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create event. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

