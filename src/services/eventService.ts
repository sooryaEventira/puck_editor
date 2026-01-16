import { API_ENDPOINTS } from '../config/env'
import { showToast } from '../utils/toast'
import type { ApiResponse } from './authService'

// Helper function to get auth headers
const getAuthHeaders = (requireAuth: boolean = true): HeadersInit => {
  const accessToken = localStorage.getItem('accessToken')
  const organizationUuid = localStorage.getItem('organizationUuid')
  
  if (requireAuth) {
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please login again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is missing. Please create or select an organization first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  if (organizationUuid) headers['X-Organization'] = organizationUuid
  return headers
}

// Helper function to handle HTTP errors
const handleHttpError = async (response: Response, showErrorToast: boolean = true): Promise<never> => {
  if (!response) {
    const errorMessage = 'Cannot connect to the server. Please make sure the backend server is running.'
    if (showErrorToast) showToast.error(errorMessage)
    throw new Error(errorMessage)
  }

  // Handle specific status codes
  if (response.status === 502) {
    const errorMessage = 'Bad Gateway (502): The server is temporarily unavailable. Please try again later.'
    if (showErrorToast) showToast.error(errorMessage)
    throw new Error(errorMessage)
  }

  try {
    const responseText = await response.text()
    const errorData = JSON.parse(responseText)
    const errorMessage = errorData.message || errorData.detail || errorData.error || `Server error (${response.status})`
    const errorText = errorData.errors?.join(', ') || errorData.non_field_errors?.join(', ') || errorMessage
    if (showErrorToast) showToast.error(errorText)
    throw new Error(errorText)
  } catch {
    const errorMessage = response.status === 500
      ? 'Internal server error. Please check the backend logs or try again later.'
      : `Server error: ${response.status} ${response.statusText}`
    if (showErrorToast) showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

// Helper function to parse API response
const parseApiResponse = <T>(apiResponse: ApiResponse<T>, defaultErrorMessage: string): T => {
  if (!apiResponse || typeof apiResponse !== 'object') {
    throw new Error('Invalid response format from server')
  }
  
  if (apiResponse.status === 'error') {
    const errorMessage = apiResponse.message || defaultErrorMessage
    const errorText = apiResponse.errors?.join(', ') || errorMessage
    showToast.error(errorText)
    throw new Error(errorText)
  }
  
  if (apiResponse.status !== 'success') {
    throw new Error(`Unexpected response status: ${apiResponse.status}`)
  }
  
  return apiResponse.data
}

export interface CreateEventRequest {
  eventName: string
  startDate: string
  startDateTimeISO: string
  startTime: string
  endDate: string
  endDateTimeISO: string
  endTime: string
  timezoneId: string
  location: string
  attendees: number
  eventExperience: 'in-person' | 'virtual' | 'hybrid'
  logo: File | null
  banner: File | null
  fixTimezoneForAttendees: boolean
}

export interface CreateEventResponseData {
  uuid: string
  eventName: string
  startDate?: string
  endDate?: string
  location?: string
  attendees?: number
  eventExperience?: 'in-person' | 'virtual' | 'hybrid'
  [key: string]: any // Allow additional fields
}

export interface EventData {
  uuid: string
  eventName: string
  startDate?: string
  endDate?: string
  location?: string
  attendees?: number
  eventExperience?: 'in-person' | 'virtual' | 'hybrid'
  logo?: string
  banner?: string
  bannerUrl?: string
  banner_url?: string
  bannerImage?: string
  banner_image?: string
  [key: string]: any // Allow additional fields
}

export interface TimezoneData {
  uuid: string
  label: string
  name: string
  utc_offset: string
}

/**
 * Create a new event
 */
export const createEvent = async (request: CreateEventRequest): Promise<CreateEventResponseData> => {
  try {
    const headers = getAuthHeaders(true)
    const formData = new FormData()
    
    formData.append('eventName', request.eventName)
    formData.append('startDate', request.startDate)
    formData.append('startDateTimeISO', request.startDateTimeISO)
    formData.append('startTime', request.startTime)
    formData.append('endDate', request.endDate)
    formData.append('endDateTimeISO', request.endDateTimeISO)
    formData.append('endTime', request.endTime)
    formData.append('timezoneId', request.timezoneId)
    formData.append('location', request.location)
    formData.append('attendees', request.attendees.toString())
    formData.append('eventExperience', request.eventExperience)
    formData.append('fixTimezoneForAttendees', request.fixTimezoneForAttendees.toString())
    if (request.logo) formData.append('logo', request.logo)
    if (request.banner) formData.append('banner', request.banner)

    let response: Response
    try {
      response = await fetch(API_ENDPOINTS.EVENT.CREATE, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': undefined } as any, // Remove Content-Type for FormData
        credentials: 'include',
        body: formData,
      })
    } catch (fetchError) {
      // Handle CORS and network errors during fetch
      if (fetchError instanceof TypeError) {
        const errorMessage = 'CORS error: Cannot connect to the server. This may be due to:\n1. Backend server is not running\n2. CORS is not properly configured on the backend\n3. Network connectivity issues'
        showToast.error('Connection error. Please check if the server is running and CORS is configured.')
        throw new Error(errorMessage)
      }
      throw fetchError
    }

    if (!response.ok) {
      await handleHttpError(response)
    }

    const apiResponse: ApiResponse<CreateEventResponseData> = await response.json()
    let responseData: any = parseApiResponse(apiResponse, 'Failed to create event')
    
    if (typeof responseData === 'string' && responseData === '') {
      throw new Error('Backend returned empty event data')
    }
    
    if (responseData.data?.uuid) {
      responseData = responseData.data
    }
    
    if (!responseData.uuid || !responseData.eventName) {
      throw new Error('Invalid response format: missing required fields')
    }

    showToast.success('Event created successfully')
    return {
      uuid: String(responseData.uuid),
      eventName: String(responseData.eventName),
      startDate: responseData.startDate || undefined,
      endDate: responseData.endDate || undefined,
      location: responseData.location || undefined,
      attendees: responseData.attendees || undefined,
      eventExperience: responseData.eventExperience || undefined,
      ...responseData,
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      showToast.error('Connection error. Please check if the server is running.')
      throw new Error('Cannot connect to the server')
    }
    throw error
  }
}

/**
 * Fetch list of available timezones
 */
export const fetchTimezones = async (): Promise<TimezoneData[]> => {
  try {
    const headers = getAuthHeaders(false)
    let response: Response
    try {
      response = await fetch(API_ENDPOINTS.TIMEZONE.LIST, {
        method: 'GET',
        headers,
        credentials: 'include',
      })
    } catch (fetchError) {
      if (fetchError instanceof TypeError) {
        throw new Error('CORS error: Cannot connect to the server. Please check if the server is running and CORS is configured.')
      }
      throw fetchError
    }

    if (!response.ok) {
      await handleHttpError(response, false)
    }

    const apiResponse: ApiResponse<TimezoneData[]> = await response.json()
    let responseData: any = parseApiResponse(apiResponse, 'Failed to fetch timezones')
    
    if (!responseData) return []
    
    const mapTimezone = (tz: any): TimezoneData => ({
      uuid: String(tz.uuid),
      label: String(tz.label || tz.name || ''),
      name: String(tz.name || ''),
      utc_offset: String(tz.utc_offset || '+00:00'),
    })

    if (Array.isArray(responseData)) {
      return responseData.map(mapTimezone).filter((tz: TimezoneData) => tz.uuid && tz.name)
    }
    
    if (responseData.data && Array.isArray(responseData.data)) {
      return responseData.data.map(mapTimezone).filter((tz: TimezoneData) => tz.uuid && tz.name)
    }
    
    return responseData.uuid ? [mapTimezone(responseData)] : []
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to the server')
    }
    throw error
  }
}

/**
 * Fetch all events
 */
export const fetchEvents = async (): Promise<EventData[]> => {
  try {
    const headers = getAuthHeaders(true)
    let response: Response
    try {
      response = await fetch(API_ENDPOINTS.EVENT.LIST, {
        method: 'GET',
        headers,
        credentials: 'include',
      })
    } catch (fetchError) {
      if (fetchError instanceof TypeError) {
        const errorMessage = 'CORS error: Cannot connect to the server. This may be due to:\n1. Backend server is not running\n2. CORS is not properly configured on the backend\n3. Network connectivity issues'
        showToast.error('Connection error. Please check if the server is running and CORS is configured.')
        throw new Error(errorMessage)
      }
      throw fetchError
    }

    if (!response.ok) {
      await handleHttpError(response)
    }

    const apiResponse: ApiResponse<EventData[]> = await response.json()
    let responseData: any = parseApiResponse(apiResponse, 'Failed to fetch events')
    
    if (!responseData) return []
    
    const mapEvent = (event: any): EventData => ({
      uuid: String(event.uuid),
      eventName: String(event.eventName),
      startDate: event.startDate || undefined,
      endDate: event.endDate || undefined,
      location: event.location || undefined,
      attendees: event.attendees || undefined,
      eventExperience: event.eventExperience || undefined,
      logo: event.logo || undefined,
      banner: event.banner || undefined,
      bannerUrl: event.bannerUrl || event.banner_url || undefined,
      bannerImage: event.bannerImage || event.banner_image || undefined,
      ...event,
    })

    if (Array.isArray(responseData)) {
      return responseData.map(mapEvent).filter((event: EventData) => event.uuid && event.eventName)
    }
    
    if (responseData.data && Array.isArray(responseData.data)) {
      return responseData.data.map(mapEvent).filter((event: EventData) => event.uuid && event.eventName)
    }
    
    return responseData.uuid ? [mapEvent(responseData)] : []
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      showToast.error('Connection error. Please check if the server is running.')
      throw new Error('Cannot connect to the server')
    }
    throw error
  }
}
