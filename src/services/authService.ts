import { API_ENDPOINTS } from '../config/env'
import { showToast } from '../utils/toast'

export interface ApiResponse<T = any> {
  message: string
  errors: string[]
  data: T
  status: 'success' | 'error'
}

export interface SendOtpRequest {
  email: string
}

export interface SendOtpResponse {
  email: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  // Empty data field based on API response
  data: string
}

export interface CreatePasswordRequest {
  email: string
  password: string
}

export interface UserData {
  email: string
  first_name: string
  last_name: string
}

export interface RegisterResponseData {
  user: UserData
  access: string
  refresh: string
}

// The API response data field directly contains RegisterResponseData
export interface CreatePasswordResponse {
  user: UserData
  access: string
  refresh: string
}

export interface CreateOrganizationRequest {
  name: string
}

export interface OrganizationData {
  uuid: string
  name: string
  registration_number?: string | null
  tax_number?: string | null
  affiliations?: any | null
  email?: string | null
  website_url?: string | null
}

/**
 * Send OTP to user's email for registration
 */
export const sendRegistrationOtp = async (email: string): Promise<ApiResponse<SendOtpResponse>> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER_SEND_OTP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      // Network error or CORS error - response might not exist
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on http://localhost:8000'
        console.error('Network error: Server is not reachable', API_ENDPOINTS.AUTH.REGISTER_SEND_OTP)
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      try {
        const errorData: ApiResponse = await response.json()
        const errorMessage = errorData.message || `Server error (${response.status})`
        const errors = errorData.errors || []
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        showToast.error(errorText)
        throw new Error(errorText)
      } catch (parseError) {
        // Failed to parse error response
        const errorMessage = `Server error: ${response.status} ${response.statusText}`
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }
    }

    // Parse successful response
    let data: ApiResponse<SendOtpResponse>
    try {
      data = await response.json()
    } catch (parseError) {
      const errorMessage = 'Invalid response from server. Please try again.'
      console.error('Failed to parse response:', parseError)
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Check if response has error status
    if (data.status === 'error') {
      const errorMessage = data.message || 'Failed to send OTP'
      const errors = data.errors || []
      const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
      showToast.error(errorText)
      throw new Error(errorText)
    }

    // Success response
    if (data.status === 'success') {
      showToast.success(data.message || 'OTP sent successfully')
      
      // Log the full response to console (OTP might be in data field for development)
      console.log('📧 [authService] OTP sent - Full API response:', JSON.stringify(data, null, 2))
      
      // Check if OTP is in the response data (for development/testing)
      // Handle different response structures
      const responseData = data.data as any // Use any to handle flexible response structure
      
      if (responseData) {
        // Check if OTP is a direct string value (4-6 digits)
        if (typeof responseData === 'string' && /^\d{4,6}$/.test(responseData)) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          console.log('   📱 YOUR OTP CODE: ' + responseData)
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        } 
        // Check if OTP is in an object property
        else if (typeof responseData === 'object') {
          // Check common OTP field names
          const otpValue = responseData.otp || responseData.code || responseData.otpCode || responseData.otp_code
          if (otpValue && /^\d{4,6}$/.test(String(otpValue))) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            console.log('   📱 YOUR OTP CODE: ' + otpValue)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          }
          
          // Log email if present
          if (responseData.email) {
            console.log('📧 [authService] OTP sent to:', responseData.email)
          }
        }
      }
      
      // Also check message field for OTP (some APIs return it there)
      if (data.message && /OTP.*\d{4,6}/i.test(data.message)) {
        const otpMatch = data.message.match(/\d{4,6}/)
        if (otpMatch) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          console.log('   📱 YOUR OTP CODE: ' + otpMatch[0])
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        }
      }
    }

    return data
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check:\n1. Backend server is running on http://localhost:8000\n2. CORS is properly configured\n3. No firewall is blocking the connection'
      console.error('Network error when sending OTP:', error)
      showToast.error('Connection error. Please check if the server is running.')
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response')
    )) {
      throw error
    }

    // Generic error fallback
    console.error('Error sending OTP:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Verify OTP for email registration
 */
export const verifyRegistrationOtp = async (email: string, otp: string): Promise<ApiResponse<VerifyOtpResponse>> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER_VERIFY_OTP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    })

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      // Network error or CORS error - response might not exist
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on http://localhost:8000'
        console.error('Network error: Server is not reachable', API_ENDPOINTS.AUTH.REGISTER_VERIFY_OTP)
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      try {
        const errorData: ApiResponse = await response.json()
        const errorMessage = errorData.message || `Server error (${response.status})`
        const errors = errorData.errors || []
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        showToast.error(errorText)
        throw new Error(errorText)
      } catch (parseError) {
        // Failed to parse error response
        const errorMessage = `Server error: ${response.status} ${response.statusText}`
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }
    }

    // Parse successful response
    let data: ApiResponse<VerifyOtpResponse>
    try {
      data = await response.json()
    } catch (parseError) {
      const errorMessage = 'Invalid response from server. Please try again.'
      console.error('Failed to parse response:', parseError)
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Check if response has error status
    if (data.status === 'error') {
      const errorMessage = data.message || 'Failed to verify OTP'
      const errors = data.errors || []
      const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
      showToast.error(errorText)
      throw new Error(errorText)
    }

    // Success response
    if (data.status === 'success') {
      showToast.success(data.message || 'OTP verified successfully')
    }

    return data
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check:\n1. Backend server is running on http://localhost:8000\n2. CORS is properly configured\n3. No firewall is blocking the connection'
      console.error('Network error when verifying OTP:', error)
      showToast.error('Connection error. Please check if the server is running.')
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response')
    )) {
      throw error
    }

    // Generic error fallback
    console.error('Error verifying OTP:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Create password and get authentication tokens
 */
export const createPassword = async (email: string, password: string): Promise<ApiResponse<CreatePasswordResponse>> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.CREATE_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies if backend uses session-based auth
      body: JSON.stringify({ email, password }),
    })

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      // Network error or CORS error - response might not exist
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on http://localhost:8000'
        console.error('Network error: Server is not reachable', API_ENDPOINTS.AUTH.CREATE_PASSWORD)
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      try {
        const errorData: any = await response.json()
        console.error('Backend error response for createPassword:', errorData)
        console.error('Request body sent:', { email, password: '***' })
        
        // Handle different error response formats
        let errorMessage = errorData.message || errorData.detail || `Server error (${response.status})`
        const errors = errorData.errors || []
        
        // Check for common Django REST framework error formats
        if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object' && !errorData.message) {
          // Try to extract error from object
          const errorKeys = Object.keys(errorData)
          if (errorKeys.length > 0) {
            const firstError = errorData[errorKeys[0]]
            errorMessage = Array.isArray(firstError) ? firstError.join(', ') : String(firstError)
          }
        }
        
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        showToast.error(errorText)
        throw new Error(errorText)
      } catch (parseError) {
        // Failed to parse error response
        const errorMessage = `Server error: ${response.status} ${response.statusText}`
        console.error('Failed to parse error response:', parseError)
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }
    }

    // Parse successful response
    let data: ApiResponse<CreatePasswordResponse>
    try {
      data = await response.json()
    } catch (parseError) {
      const errorMessage = 'Invalid response from server. Please try again.'
      console.error('Failed to parse response:', parseError)
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Check if response has error status
    if (data.status === 'error') {
      const errorMessage = data.message || 'Failed to create password'
      const errors = data.errors || []
      const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
      showToast.error(errorText)
      throw new Error(errorText)
    }

    // Success response
    if (data.status === 'success') {
      showToast.success(data.message || 'Password created successfully')
    }

    return data
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check:\n1. Backend server is running on http://localhost:8000\n2. CORS is properly configured\n3. No firewall is blocking the connection'
      console.error('Network error when creating password:', error)
      showToast.error('Connection error. Please check if the server is running.')
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response')
    )) {
      throw error
    }

    // Generic error fallback
    console.error('Error creating password:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create password. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Get user's organizations
 */
export const getUserOrganizations = async (): Promise<OrganizationData[]> => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please login again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const response = await fetch(API_ENDPOINTS.AUTH.GET_ORGANIZATIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
    })
    
    if (!response || !response.ok) {
      if (!response) {
        const errorMessage = 'Cannot connect to the server.'
        console.error('Network error: Server is not reachable', API_ENDPOINTS.AUTH.GET_ORGANIZATIONS)
        throw new Error(errorMessage)
      }

      try {
        const errorData: any = await response.json()
        const errorMessage = errorData.message || errorData.detail || `Server error (${response.status})`
        throw new Error(errorMessage)
      } catch (parseError) {
        const errorMessage = `Server error: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }
    }

    // Handle different response formats
    const responseData: any = await response.json()
    
    // Check if it's wrapped in ApiResponse format
    if (responseData.status === 'success' || responseData.status === 'error') {
      if (responseData.status === 'error') {
        const errorMessage = responseData.message || 'Failed to fetch organizations'
        throw new Error(errorMessage)
      }
      // Return data from wrapped response
      return responseData.data || []
    } else if (Array.isArray(responseData)) {
      // Direct array response
      return responseData
    } else if (responseData.results && Array.isArray(responseData.results)) {
      // Paginated response format
      return responseData.results
    } else {
      // Unknown format, try to extract data
      console.warn('⚠️ [getUserOrganizations] Unexpected response format:', responseData)
      return []
    }
  } catch (error) {
    console.error('Error fetching organizations:', error)
    throw error
  }
}

/**
 * Create organization for the authenticated user
 */
export const createOrganization = async (name: string): Promise<OrganizationData> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please login again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const requestBody = { name }
    console.log('Creating organization with request:', {
      url: API_ENDPOINTS.AUTH.CREATE_ORGANIZATION,
      method: 'POST',
      body: requestBody,
      hasAccessToken: !!accessToken
    })

    const response = await fetch(API_ENDPOINTS.AUTH.CREATE_ORGANIZATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(requestBody),
    })
    
    console.log('Organization creation response status:', response.status, response.statusText)

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      // Network error or CORS error - response might not exist
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on http://localhost:8000'
        console.error('Network error: Server is not reachable', API_ENDPOINTS.AUTH.CREATE_ORGANIZATION)
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      try {
        // Try to get response text first to see what we're dealing with
        const responseText = await response.text()
        console.error(`Backend error (${response.status}):`, responseText)
        console.error('Response headers:', Object.fromEntries(response.headers.entries()))
        
        let errorData: any
        try {
          errorData = JSON.parse(responseText)
        } catch (jsonError) {
          // Response is not JSON - might be HTML error page or plain text
          console.error('Error response is not JSON. Raw response:', responseText.substring(0, 500))
          const errorMessage = response.status === 500 
            ? 'Internal server error. The server encountered an unexpected error. Please check the backend logs or try again later.'
            : `Server error: ${response.status} ${response.statusText}`
          showToast.error(errorMessage)
          throw new Error(errorMessage)
        }
        
        console.error('Parsed backend error response:', errorData)
        
        // Handle different error response formats
        let errorMessage = errorData.message || errorData.detail || errorData.error || `Server error (${response.status})`
        const errors = errorData.errors || []
        
        // Check for common error formats
        if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object' && !errorData.message && !errorData.detail) {
          const errorKeys = Object.keys(errorData)
          if (errorKeys.length > 0) {
            const firstError = errorData[errorKeys[0]]
            errorMessage = Array.isArray(firstError) ? firstError.join(', ') : String(firstError)
          }
        }
        
        // For 500 errors, provide more context
        if (response.status === 500) {
          errorMessage = errorMessage || 'Internal server error occurred. Please check the backend server logs for details.'
          console.error('500 Internal Server Error details:', {
            message: errorData.message,
            detail: errorData.detail,
            errors: errorData.errors,
            fullResponse: errorData
          })
        }
        
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        showToast.error(errorText)
        throw new Error(errorText)
      } catch (parseError) {
        // Failed to parse error response - this shouldn't happen now since we handle non-JSON above
        const errorMessage = response.status === 500
          ? 'Internal server error. The server encountered an unexpected error. Please check the backend server logs or try again later.'
          : `Server error: ${response.status} ${response.statusText}`
        console.error('Failed to parse error response:', parseError)
        console.error('Response status:', response.status, response.statusText)
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }
    }
    let data: OrganizationData
    try {
      const apiResponse: ApiResponse<OrganizationData | string> = await response.json()
      console.log('Organization API response:', apiResponse)
      console.log('Response data type:', typeof apiResponse.data, 'Value:', apiResponse.data)
      
      // Validate response structure - check for wrapped format
      if (!apiResponse || typeof apiResponse !== 'object') {
        console.error('Response is not an object:', apiResponse, typeof apiResponse)
        throw new Error('Invalid response format from server: response is not an object')
      }
      
      // Check if response has error status
      if (apiResponse.status === 'error') {
        const errorMessage = apiResponse.message || 'Failed to create organization'
        const errors = apiResponse.errors || []
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        showToast.error(errorText)
        throw new Error(errorText)
      }
      
      // Ensure status is 'success'
      if (apiResponse.status !== 'success') {
        const errorMessage = `Unexpected response status: ${apiResponse.status}. Expected 'success'.`
        console.error('Unexpected response status:', apiResponse.status)
        showToast.error('Server error: Unexpected response status.')
        throw new Error(errorMessage)
      }
      
      // Extract organization data from the wrapped response
      // Response structure: { message: "", errors: [], data: { uuid, name }, status: "success" }
      // Note: Sometimes the response may have nested data: { data: { data: { uuid, name } } }
      let responseData: any = apiResponse.data
      
      // Check if data field is an empty string (backend issue)
      if (typeof responseData === 'string' && responseData === '') {
        const errorMessage = 'Backend returned empty organization data. The API response has status "success" but the "data" field is an empty string. Please check the backend implementation to ensure it returns the organization object in the "data" field.'
        console.error(errorMessage)
        console.error('Full API response:', JSON.stringify(apiResponse, null, 2))
        showToast.error('Server error: Organization data not returned. Please try again or contact support.')
        throw new Error(errorMessage)
      }
      
      // Validate that data field exists and is an object
      if (!responseData || typeof responseData !== 'object') {
        const errorMessage = `Invalid response format: organization data should be an object, but received ${typeof responseData}. Value: ${JSON.stringify(responseData)}`
        console.error('Organization data is missing or not an object:', responseData, 'Type:', typeof responseData)
        console.error('Full API response:', JSON.stringify(apiResponse, null, 2))
        showToast.error('Server error: Invalid organization data format.')
        throw new Error(errorMessage)
      }
      
      // Handle nested data structure: if responseData has a 'data' property with uuid, use that instead
      if (responseData.data && typeof responseData.data === 'object' && responseData.data.uuid) {
        console.log('Detected nested data structure, extracting from responseData.data')
        responseData = responseData.data
      }
      
      // Validate required fields (uuid and name)
      if (!responseData.uuid) {
        console.error('Missing uuid field in organization data:', responseData)
        throw new Error('Invalid response format from server: missing uuid in organization data')
      }
      
      if (!responseData.name) {
        console.error('Missing name field in organization data:', responseData)
        throw new Error('Invalid response format from server: missing name in organization data')
      }
      
      // Map the response to OrganizationData interface
      data = {
        uuid: String(responseData.uuid),
        name: String(responseData.name),
        registration_number: responseData.registration_number || null,
        tax_number: responseData.tax_number || null,
        affiliations: responseData.affiliations || null,
        email: responseData.email || null,
        website_url: responseData.website_url || null,
      }
      
      console.log('Parsed organization data:', data)
    } catch (parseError) {
      // Check if it's our custom validation error - re-throw it
      if (parseError instanceof Error && parseError.message.includes('Invalid response format')) {
        console.error('Validation error:', parseError.message)
        showToast.error(parseError.message)
        throw parseError
      }
      
      // JSON parsing or other error
      const errorMessage = 'Invalid response from server. Please try again.'
      console.error('Failed to parse organization response:', parseError)
      console.error('Response status:', response.status, response.statusText)
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Success - show toast notification
    showToast.success('Organization created successfully')

    return data
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check:\n1. Backend server is running on http://localhost:8000\n2. CORS is properly configured\n3. No firewall is blocking the connection'
      console.error('Network error when creating organization:', error)
      showToast.error('Connection error. Please check if the server is running.')
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response') ||
        error.message.startsWith('Authentication required')
    )) {
      throw error
    }

    // Generic error fallback
    console.error('Error creating organization:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create organization. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

export interface SigninRequest {
  email: string
  password: string
}

export interface SigninResponse {
  access: string
  refresh: string
  user?: UserData
  organization?: OrganizationData
}

/**
 * Sign in user with email and password
 */
export const signin = async (email: string, password: string): Promise<ApiResponse<SigninResponse>> => {
  try {
    const requestBody = { email, password }
    const endpoint = API_ENDPOINTS.AUTH.SIGNIN
    
    console.log('🔐 [signin] Starting signin request:', {
      endpoint,
      email: email.substring(0, 3) + '***', // Log partial email for privacy
      hasPassword: !!password,
      requestBody: { email: email.substring(0, 3) + '***', hasPassword: !!password }
    })
    
    let response: Response
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      })
      
      console.log('🔐 [signin] Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (fetchError) {
      console.error('🔐 [signin] Fetch error (network/CORS):', fetchError)
      const errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection and ensure the backend is running.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Check for network/CORS errors before parsing response
    if (!response || !response.ok) {
      // Network error or CORS error - response might not exist
      if (!response) {
        const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.'
        console.error('Network error: Server is not reachable', API_ENDPOINTS.AUTH.SIGNIN)
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }

      // HTTP error - try to parse error response
      try {
        const errorData: any = await response.json()
        console.error('Backend error response for signin:', errorData)
        
        // Handle different error response formats
        let errorMessage = errorData.message || errorData.detail || errorData.error || `Server error (${response.status})`
        const errors = errorData.errors || []
        
        // Check for common Django REST framework error formats
        if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object' && !errorData.message) {
          // Try to extract error from object
          const errorKeys = Object.keys(errorData)
          if (errorKeys.length > 0) {
            const firstError = errorData[errorKeys[0]]
            errorMessage = Array.isArray(firstError) ? firstError.join(', ') : String(firstError)
          }
        }
        
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        showToast.error(errorText)
        throw new Error(errorText)
      } catch (parseError) {
        // Failed to parse error response
        const errorMessage = `Server error: ${response.status} ${response.statusText}`
        console.error('Failed to parse error response:', parseError)
        showToast.error(errorMessage)
        throw new Error(errorMessage)
      }
    }

    // Parse successful response
    // Token endpoint may return tokens directly or wrapped in ApiResponse format
    let responseData: any
    try {
      responseData = await response.json()
      // Log the full response to see its structure
      console.log('🔐 [signin] Full API response:', JSON.stringify(responseData, null, 2))
    } catch (parseError) {
      const errorMessage = 'Invalid response from server. Please try again.'
      console.error('Failed to parse response:', parseError)
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Handle both response formats:
    // 1. Direct token format: { access: "...", refresh: "...", user?: {...}, organization?: {...} }
    // 2. Wrapped format: { status: "success", data: { access: "...", refresh: "...", organization?: {...} } }
    let tokenData: SigninResponse | null = null
    let apiResponse: ApiResponse<SigninResponse> | null = null

    console.log('🔐 [signin] Parsing response data:', {
      hasStatus: !!responseData.status,
      status: responseData.status,
      hasAccess: !!responseData.access,
      hasData: !!responseData.data,
      fullResponse: responseData
    })

    if (responseData.status === 'success' || responseData.status === 'error') {
      // Wrapped ApiResponse format
      apiResponse = responseData as ApiResponse<SigninResponse>
      
      if (apiResponse.status === 'error') {
        const errorMessage = apiResponse.message || 'Failed to sign in'
        const errors = apiResponse.errors || []
        const errorText = errors.length > 0 ? errors.join(', ') : errorMessage
        showToast.error(errorText)
        throw new Error(errorText)
      }
      
      // Extract token data from wrapped response
      tokenData = apiResponse.data
      
      // Check if organization is in the wrapped response data
      if (apiResponse.data && !tokenData.organization && (apiResponse.data as any).organization) {
        tokenData.organization = (apiResponse.data as any).organization
      }
    } else if (responseData.access) {
      // Direct token format (Django REST framework style)
      tokenData = responseData as SigninResponse
    } else {
      // Unknown format
      const errorMessage = 'Invalid response format from server'
      console.error('Unexpected response format:', responseData)
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }
    
    // Extract and store organization from response
    // Response format: { status: "success", data: { access, refresh, organizations: [] } }
    let organizationToStore: OrganizationData | null = null
    
    // 1. Check if organizations array is in responseData.data
    if ((responseData as any).data?.organizations && Array.isArray((responseData as any).data.organizations)) {
      const organizations = (responseData as any).data.organizations
      console.log('📋 [signin] Organizations array found in response:', organizations)
      
      if (organizations.length > 0) {
        // Use the first organization
        organizationToStore = organizations[0]
        console.log('✅ [signin] Organization found in organizations array:', organizationToStore)
      } else {
        console.warn('⚠️ [signin] Organizations array is empty. User may need to create an organization.')
      }
    }
    // 2. Check if organization is in tokenData (for backward compatibility)
    else if (tokenData.organization?.uuid) {
      organizationToStore = tokenData.organization
      console.log('✅ [signin] Organization found in tokenData:', organizationToStore)
    }
    // 3. Check other possible locations (for backward compatibility)
    else {
      console.log('⚠️ [signin] No organizations array found, checking other locations...')
      
      // Check top level
      if ((responseData as any).organization?.uuid) {
        organizationToStore = (responseData as any).organization
        console.log('✅ [signin] Organization found at top level of responseData:', organizationToStore)
      }
      // Check organization_uuid at top level
      else if ((responseData as any).organization_uuid) {
        organizationToStore = {
          uuid: (responseData as any).organization_uuid,
          name: (responseData as any).organization_name || (responseData as any).organization?.name || 'Organization'
        }
        console.log('✅ [signin] Organization UUID found at top level:', organizationToStore)
      }
      // Check in data field (single organization object)
      else if ((responseData as any).data?.organization?.uuid) {
        organizationToStore = (responseData as any).data.organization
        console.log('✅ [signin] Organization found in data.organization:', organizationToStore)
      }
      // Check organization_uuid in data field
      else if ((responseData as any).data?.organization_uuid) {
        organizationToStore = {
          uuid: (responseData as any).data.organization_uuid,
          name: (responseData as any).data.organization_name || 'Organization'
        }
        console.log('✅ [signin] Organization UUID found in data field:', organizationToStore)
      }
    }

    // Store tokens
    if (tokenData) {
      if (tokenData.access) {
        localStorage.setItem('accessToken', tokenData.access)
      }
      if (tokenData.refresh) {
        localStorage.setItem('refreshToken', tokenData.refresh)
      }
      if (tokenData.user) {
        localStorage.setItem('userEmail', tokenData.user.email)
      }
      
      // Store organization if found
      if (organizationToStore?.uuid) {
        localStorage.setItem('organizationUuid', organizationToStore.uuid)
        localStorage.setItem('organizationName', organizationToStore.name)
        console.log('✅ [signin] Organization stored in localStorage:', {
          uuid: organizationToStore.uuid,
          name: organizationToStore.name
        })
      } else {
        console.warn('⚠️ [signin] No organization found in signin response. Full response:', JSON.stringify(responseData, null, 2))
      }
      
      // Also set authentication state
      localStorage.setItem('isAuthenticated', 'true')
      
      showToast.success('Signed in successfully')
    }

    // Return in ApiResponse format for consistency
    return apiResponse || {
      status: 'success',
      message: 'Signed in successfully',
      errors: [],
      data: tokenData!
    }
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check:\n1. Backend server is running\n2. CORS is properly configured\n3. No firewall is blocking the connection'
      console.error('Network error when signing in:', error)
      showToast.error('Connection error. Please check if the server is running.')
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response')
    )) {
      throw error
    }

    // Generic error fallback
    console.error('Error signing in:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

