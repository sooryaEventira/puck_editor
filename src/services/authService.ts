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
      
      // Extract organization data from the wrapped response
      const responseData = apiResponse.data
      
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

