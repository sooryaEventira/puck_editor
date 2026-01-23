import React, { useEffect, useState } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import { createOrUpdateWebpage, type CreateWebpageRequest } from '../../services/webpageService'
import { showToast } from '../../utils/toast'

interface PuckPropertySidebarSaveButtonProps {
  currentData: any
  currentPage: string
  currentPageName: string
  onSaveSuccess?: () => void
}

const PuckPropertySidebarSaveButton: React.FC<PuckPropertySidebarSaveButtonProps> = ({
  currentData,
  currentPage,
  currentPageName,
  onSaveSuccess
}) => {
  const { createdEvent } = useEventForm()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  useEffect(() => {
    let isUpdating = false
    let lastUpdateTime = 0
    const UPDATE_THROTTLE = 200 // ms

    const findAndInjectSaveButton = () => {
      const now = Date.now()
      if (isUpdating || (now - lastUpdateTime < UPDATE_THROTTLE)) {
        return
      }

      isUpdating = true
      lastUpdateTime = now

      // Find the property sidebar (right sidebar)
      // Try multiple strategies to find the right sidebar
      let propertySidebar: HTMLElement | null = null
      
      // Strategy 1: Look for Puck's property panel class
      propertySidebar = document.querySelector('[class*="puck__property-panel"]') as HTMLElement ||
                        document.querySelector('[class*="PropertyPanel"]') as HTMLElement ||
                        document.querySelector('[class*="property-panel"]') as HTMLElement ||
                        null

      // Strategy 2: Find all Puck sidebars and identify the right one
      if (!propertySidebar) {
        const allSidebars = document.querySelectorAll('[class*="puck__sidebar"], aside[class*="puck"], [class*="Sidebar"]')
        for (const sidebar of Array.from(allSidebars)) {
          const el = sidebar as HTMLElement
          const className = el.className || ''
          const isLeft = className.includes('left') || className.includes('Left')
          const isRight = className.includes('right') || className.includes('Right')
          
          // If it's explicitly right, or not left and has property-related content
          if (isRight || (!isLeft && (el.querySelector('[class*="Property"]') || el.querySelector('[class*="property"]') || el.textContent?.includes('Page Title')))) {
            propertySidebar = el
            break
          }
        }
      }

      // Strategy 3: Find by looking for "Page Title" label or input field (most reliable)
      if (!propertySidebar) {
        // Look for label containing "Page Title"
        const pageTitleLabel = Array.from(document.querySelectorAll('label, span, div')).find(el => {
          const text = (el.textContent || '').trim().toLowerCase()
          return text === 'page title' || text === 'page' || (text.includes('page') && text.includes('title'))
        })
        
        if (pageTitleLabel) {
          // Walk up the DOM tree to find the sidebar container
          let parent = pageTitleLabel.parentElement
          let depth = 0
          while (parent && depth < 15) {
            const parentClass = (parent.className || '').toLowerCase()
            const tagName = parent.tagName.toLowerCase()
            
            // Check if this looks like a sidebar/panel container
            if (parentClass.includes('puck') || 
                parentClass.includes('sidebar') || 
                parentClass.includes('panel') ||
                parentClass.includes('property') ||
                tagName === 'aside' ||
                (parent.style && (parent.style.width || parent.style.minWidth))) {
              propertySidebar = parent as HTMLElement
              break
            }
            parent = parent.parentElement
            depth++
          }
        }
        
        // Also try finding input fields that might be in the property panel
        if (!propertySidebar) {
          const inputs = document.querySelectorAll('input[type="text"], input[placeholder*="Page"], input[placeholder*="page"]')
          for (const input of Array.from(inputs)) {
            let parent = input.parentElement
            let depth = 0
            while (parent && depth < 10) {
              const parentClass = (parent.className || '').toLowerCase()
              if (parentClass.includes('puck') && (parentClass.includes('sidebar') || parentClass.includes('panel'))) {
                propertySidebar = parent as HTMLElement
                break
              }
              parent = parent.parentElement
              depth++
            }
            if (propertySidebar) break
          }
        }
      }

      // Strategy 4: Find the rightmost aside or section in Puck
      if (!propertySidebar) {
        const puckContainer = document.querySelector('[class*="puck"], [class*="Puck"]')
        if (puckContainer) {
          const allAsides = Array.from(puckContainer.querySelectorAll('aside, section, div[class*="sidebar"], div[class*="Sidebar"]'))
          // Get the rightmost one (last in DOM order, or has highest right position)
          if (allAsides.length > 1) {
            propertySidebar = allAsides[allAsides.length - 1] as HTMLElement
          }
        }
      }

      if (!propertySidebar) {
        isUpdating = false
        return
      }

      // Check if sidebar is visible
      const style = window.getComputedStyle(propertySidebar)
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        isUpdating = false
        return
      }

      console.log('[PuckPropertySidebarSaveButton] Found property sidebar:', propertySidebar)

      // Check if button already exists
      const existingSaveButton = propertySidebar.querySelector('[data-puck-save-button]')
      if (existingSaveButton && existingSaveButton.isConnected) {
        // Update button state if needed
        const button = existingSaveButton as HTMLElement
        if (isSaving) {
          button.setAttribute('disabled', 'true')
          button.style.opacity = '0.6'
          button.style.cursor = 'not-allowed'
        } else {
          button.removeAttribute('disabled')
          button.style.opacity = '1'
          button.style.cursor = 'pointer'
        }
        isUpdating = false
        return
      }

      // Remove old button if disconnected
      if (existingSaveButton && !existingSaveButton.isConnected) {
        existingSaveButton.parentNode?.removeChild(existingSaveButton)
      }

      // Create save button container
      const saveButtonContainer = document.createElement('div')
      saveButtonContainer.setAttribute('data-puck-save-button-container', 'true')
      saveButtonContainer.style.cssText = `
        position: relative !important;
        z-index: 1000 !important;
        background: white !important;
        border-bottom: 1px solid #e5e7eb !important;
        padding: 8px 12px !important;
        margin: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
        display: flex !important;
        justify-content: center !important;
        visibility: visible !important;
        opacity: 1 !important;
      `

      // Create save button
      const saveButton = document.createElement('button')
      saveButton.setAttribute('data-puck-save-button', 'true')
      saveButton.setAttribute('type', 'button')
      saveButton.setAttribute('aria-label', 'Save page')
      saveButton.style.cssText = `
        width: auto !important;
        min-width: 80px !important;
        max-width: 120px !important;
        padding: 6px 12px !important;
        background:rgb(124, 140, 165) !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2) !important;
        visibility: visible !important;
        opacity: 1 !important;
      `

      // Add hover styles
      saveButton.addEventListener('mouseenter', () => {
        if (!isSaving) {
          saveButton.style.background = '#2563eb'
        }
      })
      saveButton.addEventListener('mouseleave', () => {
        if (!isSaving) {
          saveButton.style.background = '#3b82f6'
        }
      })

      // Create button text
      const buttonText = document.createElement('span')
      buttonText.textContent = isSaving ? 'Saving...' : 'Save'
      buttonText.style.cssText = 'flex: 1; text-align: center;'

      // Create loading spinner (hidden initially)
      const spinner = document.createElement('div')
      spinner.setAttribute('data-puck-save-spinner', 'true')
      spinner.style.cssText = `
        width: 12px;
        height: 12px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        display: ${isSaving ? 'block' : 'none'};
      `

      // Add spinner animation
      if (!document.getElementById('puck-save-spinner-styles')) {
        const style = document.createElement('style')
        style.id = 'puck-save-spinner-styles'
        style.textContent = `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `
        document.head.appendChild(style)
      }

      saveButton.appendChild(buttonText)
      saveButton.appendChild(spinner)
      saveButtonContainer.appendChild(saveButton)

      // Find the "Page" heading to insert above it
      const pageHeading = Array.from(propertySidebar.querySelectorAll('*')).find(el => {
        const text = (el.textContent || '').trim()
        return text === 'Page' || text.toLowerCase() === 'page'
      })
      
      let insertTarget: HTMLElement | null = null
      let insertParent: HTMLElement | null = null
      
      if (pageHeading) {
        // Insert before the Page heading
        insertParent = pageHeading.parentElement as HTMLElement
        insertTarget = pageHeading as HTMLElement
      } else {
        // Fallback: Insert at the very top of the sidebar
        insertParent = propertySidebar
        insertTarget = propertySidebar.firstChild as HTMLElement
      }
      
      // Check if button container already exists
      const existingContainer = propertySidebar.querySelector('[data-puck-save-button-container]')
      if (existingContainer) {
        // Move it to the correct position if needed
        if (pageHeading && existingContainer.nextSibling !== pageHeading && existingContainer.parentElement === insertParent) {
          // Remove and re-insert before Page heading
          existingContainer.remove()
          if (insertTarget) {
            insertParent.insertBefore(existingContainer, insertTarget)
          } else {
            insertParent.insertBefore(existingContainer, insertParent.firstChild)
          }
        }
        isUpdating = false
        return
      }
      
      // Insert the button container
      if (insertTarget && insertParent) {
        insertParent.insertBefore(saveButtonContainer, insertTarget)
      } else if (insertParent) {
        insertParent.insertBefore(saveButtonContainer, insertParent.firstChild)
      } else {
        propertySidebar.insertBefore(saveButtonContainer, propertySidebar.firstChild)
      }
      
      console.log('[PuckPropertySidebarSaveButton] Save button injected successfully')

      // Handle save click
      saveButton.addEventListener('click', async (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (isSaving) return

        await handleSave()
      })

      isUpdating = false
    }

    // Initial injection with multiple retries
    let retryCount = 0
    const maxRetries = 20 // Try for up to 10 seconds (20 * 500ms)
    const timeoutIds: NodeJS.Timeout[] = []
    
    const tryInject = () => {
      findAndInjectSaveButton()
      retryCount++
      if (retryCount < maxRetries) {
        const timeoutId = setTimeout(tryInject, 500)
        timeoutIds.push(timeoutId)
      }
    }
    
    // Start trying immediately and then retry
    timeoutIds.push(setTimeout(tryInject, 100))
    timeoutIds.push(setTimeout(tryInject, 500))
    timeoutIds.push(setTimeout(tryInject, 1000))
    timeoutIds.push(setTimeout(tryInject, 2000))

    // Watch for sidebar changes
    const observer = new MutationObserver(() => {
      findAndInjectSaveButton()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Periodic check (less frequent to avoid performance issues)
    const intervalId = setInterval(findAndInjectSaveButton, 1000)

    return () => {
      // Clear all timeouts
      timeoutIds.forEach(id => clearTimeout(id))
      clearInterval(intervalId)
      observer.disconnect()
    }
  }, [currentData, currentPage, currentPageName, isSaving])

  const handleSave = async () => {
    if (!createdEvent?.uuid) {
      showToast.error('Event UUID is required. Please select an event first.')
      return
    }

    if (!currentPageName || currentPageName.trim() === '') {
      showToast.error('Page name is required.')
      return
    }

    setIsSaving(true)
    setSaveStatus('saving')

    try {
      // Serialize current Puck data
      const puckData = {
        content: currentData?.content || [],
        root: currentData?.root || { props: {} },
        zones: currentData?.zones || {}
      }

      // Format data for backend API
      const slug = currentPageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const pageId = currentPage.startsWith('new-page') ? slug : currentPage

      // Check if currentPage is a UUID (existing webpage from API)
      // UUIDs typically have dashes and are longer than 20 characters
      const isWebpageUuid = currentPage.includes('-') && currentPage.length > 20
      const webpageUuid = isWebpageUuid ? currentPage : null

      const request: CreateWebpageRequest = {
        event_uuid: createdEvent.uuid,
        name: currentPageName,
        content: {
          [pageId]: {
            title: currentPageName,
            slug: slug,
            data: {
              [slug]: puckData
            }
          }
        }
      }

      // Call API to save (create or update)
      // Scenario 1: If webpageUuid exists, use PATCH method to update existing page
      // Scenario 2: Otherwise, use POST method to create new page
      if (webpageUuid) {
        console.log('[PuckPropertySidebarSaveButton] Updating existing webpage with PATCH:', webpageUuid)
      } else {
        console.log('[PuckPropertySidebarSaveButton] Creating new webpage with POST')
      }
      
      await createOrUpdateWebpage(webpageUuid, createdEvent.uuid, request)

      setSaveStatus('success')
      showToast.success(`Page "${currentPageName}" saved successfully!`)
      
      if (onSaveSuccess) {
        onSaveSuccess()
      }

      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 2000)

    } catch (error) {
      setSaveStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'Failed to save page. Please try again.'
      showToast.error(errorMessage)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    } finally {
      setIsSaving(false)
    }
  }

  // Update button text and spinner based on state
  useEffect(() => {
    const saveButton = document.querySelector('[data-puck-save-button]') as HTMLElement
    const buttonText = saveButton?.querySelector('span')
    const spinner = saveButton?.querySelector('[data-puck-save-spinner]') as HTMLElement

    if (saveButton && buttonText && spinner) {
      if (isSaving) {
        buttonText.textContent = 'Saving...'
        spinner.style.display = 'block'
        saveButton.setAttribute('disabled', 'true')
        saveButton.style.opacity = '0.6'
        saveButton.style.cursor = 'not-allowed'
        saveButton.style.background = '#3b82f6'
      } else {
        if (saveStatus === 'success') {
          buttonText.textContent = 'Saved!'
          saveButton.style.background = '#10b981'
        } else if (saveStatus === 'error') {
          buttonText.textContent = 'Error - Try Again'
          saveButton.style.background = '#ef4444'
        } else {
          buttonText.textContent = 'Save'
          saveButton.style.background = '#3b82f6'
        }
        spinner.style.display = 'none'
        saveButton.removeAttribute('disabled')
        saveButton.style.opacity = '1'
        saveButton.style.cursor = 'pointer'
      }
    }
  }, [isSaving, saveStatus])

  return null // This component doesn't render anything directly
}

export default PuckPropertySidebarSaveButton
