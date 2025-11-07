import { PageData } from '../types'
import { logger } from '../utils/logger'
import { showToast } from '../utils/toast'
import { API_ENDPOINTS } from '../config/env'

export const usePublish = (
  currentData: any,
  setCurrentData: (data: any) => void,
  currentPage: string,
  currentPageName: string,
  setCurrentPage: (page: string) => void,
  loadPages: () => Promise<void>
) => {
  // Function to handle publish and save JSON data directly to project
  const handlePublish = async (data: any) => {
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      
      // Create a unique filename based on page name
      let filename: string
      if (currentPage.startsWith('new-page')) {
        // For new pages, create filename from page name (no date suffix)
        const sanitizedName = currentPageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
        filename = `${sanitizedName}.json`
      } else {
        // For existing pages, keep the same filename
        filename = `${currentPage}.json`
      }
      
      // Save to localStorage for backup
      localStorage.setItem('puck-page-data', JSON.stringify(data, null, 2))
      localStorage.setItem('puck-page-timestamp', timestamp)
      
      // Try to save directly to project directory via API
      try {
        const response = await fetch(API_ENDPOINTS.SAVE_PAGE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: data,
            filename: filename
          })
        })
        
        const result = await response.json()
        
        if (result.success) {
          // Cache the saved data in localStorage
          const finalPageId = currentPage.startsWith('new-page') ? filename.replace('.json', '') : currentPage
          const cacheKey = `puck-page-${finalPageId}`
          localStorage.setItem(cacheKey, JSON.stringify(data))
          logger.debug('Saved page data cached in localStorage:', finalPageId)
          
          // Reload pages list after saving
          await loadPages()
          
          // Update current page ID after saving
          if (currentPage.startsWith('new-page')) {
            const newPageId = filename.replace('.json', '')
            setCurrentPage(newPageId)
          }
          
          showToast.success(`Page "${currentPageName}" saved successfully!\n\n📁 File: ${result.filename}\n📊 Components: ${result.components}`)
          

        } else {
          throw new Error(result.message || 'Failed to save via API')
        }
        
      } catch (apiError) {
        logger.warn('API save failed, falling back to download method:', apiError)
        
        // Fallback: Create downloadable file
        const jsonData = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const link = document.createElement('a')
        link.download = filename
        link.href = window.URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        showToast.warning(`API server not running - File downloaded instead\n\n📁 Start server: npm run server\n📄 Move ${filename} to: src/data/pages/`)
      }
      
    } catch (error) {
      logger.error('Error saving page data:', error)
      showToast.error('Error saving page data. Please try again.')
    }
  }

  // Function to handle data changes - auto-save to localStorage
  const handleDataChange = (data: any) => {
    setCurrentData(data)
    
    // Auto-save to localStorage for persistence
    // This ensures data is saved even if server is down
    if (currentPage) {
      const cacheKey = `puck-page-${currentPage}`
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data))
        logger.debug('Auto-saved page data to localStorage:', currentPage)
      } catch (error) {
        logger.warn('Failed to save to localStorage:', error)
      }
    }
  }

  return {
    handlePublish,
    handleDataChange
  }
}
