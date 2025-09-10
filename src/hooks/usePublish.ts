import { PageData } from '../types'

export const usePublish = (
  currentData: PageData,
  setCurrentData: (data: PageData) => void,
  currentPage: string,
  currentPageName: string,
  setCurrentPage: (page: string) => void,
  loadPages: () => Promise<void>
) => {
  // Function to handle publish and save JSON data directly to project
  const handlePublish = async (data: PageData) => {
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      
      // Create a unique filename based on page name
      let filename: string
      if (currentPage === 'new-page') {
        // For new pages, create filename from page name
        const sanitizedName = currentPageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
        filename = `${sanitizedName}-${timestamp}.json`
      } else {
        // For existing pages, keep the same filename
        filename = `${currentPage}.json`
      }
      
      // Save to localStorage for backup
      localStorage.setItem('puck-page-data', JSON.stringify(data, null, 2))
      localStorage.setItem('puck-page-timestamp', timestamp)
      
      // Try to save directly to project directory via API
      try {
        const response = await fetch('http://localhost:3001/api/save-page', {
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
          // Reload pages list after saving
          await loadPages()
          
          // Update current page ID after saving
          if (currentPage === 'new-page') {
            const newPageId = filename.replace('.json', '')
            setCurrentPage(newPageId)
          }
          
          alert(`✅ Page "${currentPageName}" saved successfully!
          
📁 File saved to: ${result.path}
📊 Components: ${result.components}
📝 Filename: ${result.filename}

The data has been saved directly to your project directory!`)
          
          console.log('=== PUCK PAGE DATA SAVED ===')
          console.log('✅ Saved directly to project directory')
          console.log('📁 Path:', result.path)
          console.log('📊 Components:', result.components)
          console.log('============================')
        } else {
          throw new Error(result.message || 'Failed to save via API')
        }
        
      } catch (apiError) {
        console.warn('API save failed, falling back to download method:', apiError)
        
        // Fallback: Create downloadable file
        const jsonData = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const link = document.createElement('a')
        link.download = filename
        link.href = window.URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        alert(`⚠️ API server not running - File downloaded instead
        
📁 Please start the server: npm run server
📄 File downloaded: ${filename}
📂 Move to: src/data/pages/${filename}`)
      }
      
    } catch (error) {
      console.error('Error saving page data:', error)
      alert('Error saving page data. Please try again.')
    }
  }

  // Function to handle data changes
  const handleDataChange = (data: PageData) => {
    setCurrentData(data)
  }

  return {
    handlePublish,
    handleDataChange
  }
}
