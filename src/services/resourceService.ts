import { API_ENDPOINTS } from '../config/env'
import { showToast } from '../utils/toast'

export interface CreateFolderRequest {
  name: string
  event_uuid: string
  parent?: string // Optional parent folder UUID for nested folders
}

export interface CreateFolderResponse {
  uuid: string
  name: string
  event_uuid: string
  [key: string]: any
}

export interface FolderData {
  uuid: string
  name: string
  event_uuid: string
  parent?: string | null
  created_at?: string
  updated_at?: string
  [key: string]: any
}

export interface UploadFileRequest {
  file: File
  event_uuid: string
  parent?: string | null // Optional parent folder UUID
}

export interface UploadFileResponse {
  uuid: string
  folder: string | null
  file: string // File URL
  name: string
  size: number
  content_type: string
  created_date: string
  [key: string]: any
}

export interface FileData {
  uuid: string
  folder: string | null
  file: string // File URL
  name: string
  size: number
  content_type: string
  created_date: string
  [key: string]: any
}

/**
 * Create a new folder in resource management
 */
export const createFolder = async (request: CreateFolderRequest): Promise<CreateFolderResponse> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please log in again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Get organization UUID from localStorage
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is required. Please set up your organization first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const requestBody: { name: string; event_uuid: string; parent?: string } = {
      name: request.name,
      event_uuid: request.event_uuid,
    }
    
    // Add parent field if provided
    if (request.parent) {
      requestBody.parent = request.parent
    }
    
    console.log('Creating folder with request body:', requestBody)
    
    const response = await fetch(API_ENDPOINTS.RESOURCE.CREATE_FOLDER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      body: JSON.stringify(requestBody),
    })

    // Read response as text first
    const responseText = await response.text()
    
    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `Server error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = JSON.parse(responseText)
        
        // Extract error message from various possible fields
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error)
        } else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors.join(', ')
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors) && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object') {
          // Try to get first field error
          const fieldErrors = Object.entries(errorData)
            .filter(([_, value]) => Array.isArray(value) && value.length > 0)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ')
          }
        }
      } catch {
        // If parsing fails, use default error message
      }
      
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Parse successful response
    let responseData: any
    try {
      responseData = JSON.parse(responseText)
    } catch {
      const errorMessage = 'Invalid response format from server'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Handle different response structures
    let folderData: any
    if (responseData.status === 'success' && responseData.data) {
      folderData = responseData.data
    } else if (responseData.uuid) {
      folderData = responseData
    } else {
      const errorMessage = 'Invalid response format from server'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }
    
    console.log('✅ Folder created successfully:', folderData)
    console.log('📁 Folder parent:', folderData.parent)
    console.log('📁 Folder UUID:', folderData.uuid)
    console.log('📁 Folder name:', folderData.name)
    
    return folderData
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response') ||
        error.message.startsWith('Authentication required') ||
        error.message.startsWith('Organization UUID')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to create folder. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Delete a folder in resource management
 */
export const deleteFolder = async (folderUuid: string, eventUuid: string): Promise<void> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please log in again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Get organization UUID from localStorage
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is required. Please set up your organization first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (!eventUuid) {
      const errorMessage = 'Event UUID is required to delete folder.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Add event_uuid as query parameter
    const url = new URL(API_ENDPOINTS.RESOURCE.DELETE_FOLDER(folderUuid))
    url.searchParams.append('event_uuid', eventUuid)

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
    })

    if (!response.ok) {
      // Read response as text first
      const responseText = await response.text()
      
      // Try to parse error response
      let errorMessage = `Server error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = JSON.parse(responseText)
        
        // Extract error message from various possible fields
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error)
        } else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors.join(', ')
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors) && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object') {
          // Try to get first field error
          const fieldErrors = Object.entries(errorData)
            .filter(([_, value]) => Array.isArray(value) && value.length > 0)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ')
          }
        }
      } catch {
        // If parsing fails, use default error message
      }
      
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Success - no response body expected for DELETE
    showToast.success('Folder deleted successfully')
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Authentication required') ||
        error.message.startsWith('Organization UUID')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to delete folder. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Fetch folders for an event
 * @param eventUuid - The event UUID
 * @param parentFolderId - Optional parent folder UUID to fetch nested folders
 *   - undefined: fetch all folders recursively
 *   - null: fetch only root folders (parent is null)
 *   - string: fetch folders with specific parent
 */
export const fetchFolders = async (eventUuid: string, parentFolderId?: string | null): Promise<FolderData[]> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please log in again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Get organization UUID from localStorage
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is required. Please set up your organization first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (!eventUuid) {
      const errorMessage = 'Event UUID is required to fetch folders.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const response = await fetch(API_ENDPOINTS.RESOURCE.LIST_FOLDERS(eventUuid, parentFolderId), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
    })

    if (!response.ok) {
      // Read response as text first
      const responseText = await response.text()
      
      // Try to parse error response
      let errorMessage = `Server error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = JSON.parse(responseText)
        
        // Extract error message from various possible fields
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error)
        } else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors.join(', ')
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors) && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object') {
          // Try to get first field error
          const fieldErrors = Object.entries(errorData)
            .filter(([_, value]) => Array.isArray(value) && value.length > 0)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ')
          }
        }
      } catch {
        // If parsing fails, use default error message
      }
      
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Parse successful response
    const responseText = await response.text()
    let responseData: any
    
    try {
      responseData = JSON.parse(responseText)
    } catch {
      const errorMessage = 'Invalid response format from server'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Handle different response structures
    let folders: FolderData[]
    if (responseData.status === 'success' && responseData.data && Array.isArray(responseData.data)) {
      folders = responseData.data
    } else if (Array.isArray(responseData)) {
      folders = responseData
    } else if (responseData.results && Array.isArray(responseData.results)) {
      folders = responseData.results
    } else {
      return []
    }

    return folders
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response') ||
        error.message.startsWith('Authentication required') ||
        error.message.startsWith('Organization UUID') ||
        error.message.startsWith('Event UUID')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch folders. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Fetch all folders recursively (root and all nested folders)
 * @param eventUuid - The event UUID
 */
export const fetchAllFolders = async (eventUuid: string): Promise<FolderData[]> => {
  try {
    const allFolders: FolderData[] = []
    
    // First, fetch root folders (parent is null)
    const rootFolders = await fetchFolders(eventUuid, null)
    allFolders.push(...rootFolders)
    
    // Recursively fetch nested folders for each folder
    const fetchNestedFolders = async (parentId: string) => {
      const nestedFolders = await fetchFolders(eventUuid, parentId)
      allFolders.push(...nestedFolders)
      
      // Recursively fetch folders for each nested folder
      for (const folder of nestedFolders) {
        await fetchNestedFolders(folder.uuid)
      }
    }
    
    // Fetch nested folders for each root folder
    for (const rootFolder of rootFolders) {
      await fetchNestedFolders(rootFolder.uuid)
    }
    
    console.log('📁 Fetched all folders recursively:', {
      totalCount: allFolders.length,
      rootCount: rootFolders.length,
      folders: allFolders.map(f => ({ id: f.uuid, name: f.name, parent: f.parent }))
    })
    
    return allFolders
  } catch (error) {
    console.error('Failed to fetch all folders:', error)
    throw error
  }
}

/**
 * Upload a file to resource management
 */
export const uploadFile = async (request: UploadFileRequest): Promise<UploadFileResponse> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please log in again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Get organization UUID from localStorage
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is required. Please set up your organization first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (!request.event_uuid) {
      const errorMessage = 'Event UUID is required to upload file.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Create FormData
    const formData = new FormData()
    formData.append('file', request.file)
    formData.append('event_uuid', request.event_uuid)
    
    // Add folder (parent folder UUID) if provided (only if it's a non-null string)
    // Note: API expects 'folder' field, not 'parent'
    if (request.parent !== null && request.parent !== undefined && request.parent !== '') {
      formData.append('folder', request.parent)
    }

    // Debug: Log what we're sending (without the file content)
    console.log('📤 Uploading file:', {
      fileName: request.file.name,
      fileSize: request.file.size,
      fileType: request.file.type,
      event_uuid: request.event_uuid,
      parent: request.parent || 'none (root folder)'
    })

    const response = await fetch(API_ENDPOINTS.RESOURCE.UPLOAD_FILE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
      body: formData,
    })

    if (!response.ok) {
      // Read response as text first
      const responseText = await response.text()
      
      // Try to parse error response
      let errorMessage = `Server error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = JSON.parse(responseText)
        
        // Extract error message from various possible fields
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error)
        } else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors.join(', ')
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors) && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object') {
          // Try to get field-specific errors (common in validation errors)
          const fieldErrors = Object.entries(errorData)
            .filter(([key, value]) => {
              // Skip common metadata fields
              if (['status', 'message', 'detail', 'error', 'errors', 'non_field_errors'].includes(key)) {
                return false
              }
              // Include fields with errors
              if (Array.isArray(value)) {
                return value.length > 0
              }
              return value !== null && value !== undefined && value !== ''
            })
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(', ')}`
              }
              return `${key}: ${value}`
            })
          
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ')
          } else if (errorData.status === 'error' || errorData.message === 'Validation Error') {
            // If we have a generic validation error, try to get more details
            const allErrors = Object.entries(errorData)
              .map(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                  return `${key}: ${value.join(', ')}`
                } else if (value && typeof value === 'string') {
                  return `${key}: ${value}`
                }
                return null
              })
              .filter(Boolean)
            
            if (allErrors.length > 0) {
              errorMessage = allErrors.join('; ')
            }
          }
        }
      } catch {
        // If parsing fails, use default error message
      }
      
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Parse successful response
    const responseText = await response.text()
    let responseData: any
    
    try {
      responseData = JSON.parse(responseText)
    } catch {
      const errorMessage = 'Invalid response format from server'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Handle different response structures
    let fileData: UploadFileResponse
    if (responseData.status === 'success' && responseData.data) {
      fileData = responseData.data
    } else if (responseData.uuid) {
      fileData = responseData
    } else {
      const errorMessage = 'Invalid response format from server'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    console.log('✅ File uploaded successfully:', fileData)
    return fileData
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response') ||
        error.message.startsWith('Authentication required') ||
        error.message.startsWith('Organization UUID') ||
        error.message.startsWith('Event UUID')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Fetch files from a folder
 */
export const fetchFiles = async (folderId?: string | null): Promise<FileData[]> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please log in again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Get organization UUID from localStorage
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is required. Please set up your organization first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    const url = API_ENDPOINTS.RESOURCE.LIST_FILES(folderId)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Read response as text first
      const responseText = await response.text()
      
      // Try to parse error response
      let errorMessage = `Server error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = JSON.parse(responseText)
        
        // Extract error message from various possible fields
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error)
        } else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors.join(', ')
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors) && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        }
      } catch {
        // If parsing fails, use default error message
      }
      
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Parse successful response
    const responseText = await response.text()
    let responseData: any
    
    try {
      responseData = JSON.parse(responseText)
    } catch {
      const errorMessage = 'Invalid response format from server'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Handle different response structures
    let files: FileData[]
    if (responseData.status === 'success' && Array.isArray(responseData.data)) {
      files = responseData.data
    } else if (Array.isArray(responseData)) {
      files = responseData
    } else {
      const errorMessage = 'Invalid response format from server'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    console.log('✅ Files fetched successfully:', files.length, 'files')
    return files
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Invalid response') ||
        error.message.startsWith('Authentication required') ||
        error.message.startsWith('Organization UUID')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch files. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Delete a file in resource management
 */
export const deleteFile = async (fileUuid: string, eventUuid: string): Promise<void> => {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      const errorMessage = 'Authentication required. Please log in again.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Get organization UUID from localStorage
    const organizationUuid = localStorage.getItem('organizationUuid')
    
    if (!organizationUuid) {
      const errorMessage = 'Organization UUID is required. Please set up your organization first.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (!eventUuid) {
      const errorMessage = 'Event UUID is required to delete file.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Add event_uuid as query parameter
    const url = new URL(API_ENDPOINTS.RESOURCE.DELETE_FILE(fileUuid))
    url.searchParams.append('event_uuid', eventUuid)

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Organization': organizationUuid,
      },
    })

    if (!response.ok) {
      // Read response as text first
      const responseText = await response.text()
      
      // Try to parse error response
      let errorMessage = `Server error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = JSON.parse(responseText)
        
        // Extract error message from various possible fields
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error)
        } else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors.join(', ')
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors) && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (typeof errorData === 'object') {
          // Try to get first field error
          const fieldErrors = Object.entries(errorData)
            .filter(([_, value]) => Array.isArray(value) && value.length > 0)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ')
          }
        }
      } catch {
        // If parsing fails, use default error message
      }
      
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Success - no response body expected for DELETE
    showToast.success('File deleted successfully')
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = 'Cannot connect to the server. Please check if the server is running.'
      showToast.error(errorMessage)
      throw new Error(errorMessage)
    }

    // Re-throw if it's already our custom error
    if (error instanceof Error && (
        error.message.startsWith('Cannot connect') || 
        error.message.startsWith('Server error') ||
        error.message.startsWith('Authentication required') ||
        error.message.startsWith('Organization UUID') ||
        error.message.startsWith('Event UUID')
    )) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to delete file. Please try again.'
    showToast.error(errorMessage)
    throw new Error(errorMessage)
  }
}
