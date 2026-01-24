import React, { useEffect, useState, useRef } from 'react'
import { useEventForm } from '../../contexts/EventFormContext'
import { createOrUpdateWebpage, type CreateWebpageRequest } from '../../services/webpageService'
import { showToast } from '../../utils/toast'

interface PuckPropertySidebarSaveButtonProps {
  getCurrentData: () => any // Function to get latest data from Puck
  currentPage: string
  currentPageName: string
  onSaveSuccess?: () => void
}

const PuckPropertySidebarSaveButton: React.FC<PuckPropertySidebarSaveButtonProps> = ({
  getCurrentData,
  currentPage,
  currentPageName,
  onSaveSuccess
}) => {
  const { createdEvent } = useEventForm()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const buttonInjectedRef = useRef(false) // Track if button has been successfully injected

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

      // Check if button already exists - do this early to avoid unnecessary work
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
        buttonInjectedRef.current = true // Mark as injected
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
        background: #F5F5DC !important;
        color: #333 !important;
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
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
        visibility: visible !important;
        opacity: 1 !important;
      `

      // Add hover styles
      saveButton.addEventListener('mouseenter', () => {
        if (!isSaving) {
          saveButton.style.background = '#E8E8D3' // Darker beige on hover
        }
      })
      saveButton.addEventListener('mouseleave', () => {
        if (!isSaving) {
          saveButton.style.background = '#F5F5DC' // Back to beige
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
      
      // Only log when button is actually injected (not on every check)
      console.log('[PuckPropertySidebarSaveButton] Save button injected successfully')
      buttonInjectedRef.current = true // Mark as successfully injected

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

    // Watch for sidebar changes (only if button not yet injected, or watch more selectively)
    const observer = new MutationObserver((mutations) => {
      // Only check if button not injected, or if mutations might affect the sidebar
      if (!buttonInjectedRef.current) {
        findAndInjectSaveButton()
      } else {
        // If button is injected, only check if mutations are in the sidebar area
        const hasRelevantMutation = mutations.some(mutation => {
          const target = mutation.target as HTMLElement
          return target.closest('[class*="Sidebar"], [class*="puck__property-panel"]') !== null
        })
        if (hasRelevantMutation) {
          findAndInjectSaveButton()
        }
      }
    })

    // Observe only the document body, but we'll filter mutations
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Periodic check (less frequent once button is injected)
    // Use a dynamic interval that adjusts based on button state
    let intervalDelay = 1000 // Start with 1 second
    const intervalId = setInterval(() => {
      // If button already injected, check less frequently (every 5 seconds)
      if (buttonInjectedRef.current) {
        intervalDelay = 5000 // Update delay for next iteration
        // Only check periodically to ensure button is still there
        const existingButton = document.querySelector('[data-puck-save-button]')
        if (!existingButton || !existingButton.isConnected) {
          buttonInjectedRef.current = false // Reset flag if button was removed
          intervalDelay = 1000 // Reset to 1 second
          findAndInjectSaveButton()
        }
      } else {
        intervalDelay = 1000
        findAndInjectSaveButton()
      }
    }, 1000) // Always check every 1 second, but logic inside adjusts behavior

    return () => {
      // Clear all timeouts
      timeoutIds.forEach(id => clearTimeout(id))
      clearInterval(intervalId)
      observer.disconnect()
    }
  }, [currentPage, currentPageName, isSaving, getCurrentData])

  const handleSave = async () => {
    console.log('💾 [Website Page Save] ==========================================')
    console.log('💾 [Website Page Save] Save button clicked')
    console.log('💾 [Website Page Save] Current page:', currentPage)
    console.log('💾 [Website Page Save] Current page name:', currentPageName)
    console.log('💾 [Website Page Save] Event UUID:', createdEvent?.uuid)

    if (!createdEvent?.uuid) {
      console.error('❌ [Website Page Save] Event UUID is missing')
      showToast.error('Event UUID is required. Please select an event first.')
      return
    }

    if (!currentPageName || currentPageName.trim() === '') {
      console.error('❌ [Website Page Save] Page name is missing')
      showToast.error('Page name is required.')
      return
    }

    setIsSaving(true)
    setSaveStatus('saving')
    console.log('💾 [Website Page Save] Saving state set to true')

    try {
      // Get the latest data from Puck (includes inline edits)
      const currentData = getCurrentData()
      console.log('💾 [Website Page Save] Retrieved current data from Puck')
      console.log('💾 [Website Page Save] Data content items:', currentData?.content?.length || 0)
      console.log('💾 [Website Page Save] Root props:', currentData?.root?.props)
      
      // Serialize current Puck data
      const puckData = {
        content: currentData?.content || [],
        root: currentData?.root || { props: {} },
        zones: currentData?.zones || {}
      }
      console.log('💾 [Website Page Save] Serialized Puck data:', {
        contentCount: puckData.content.length,
        hasRoot: !!puckData.root,
        hasZones: !!puckData.zones,
        rootProps: puckData.root?.props
      })

      // Format data for backend API
      const slug = currentPageName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      
      // Check if currentPage is a real UUID from the server (existing webpage from API)
      // Real UUIDs have the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars, all hex)
      // Locally generated IDs have patterns like: page-page-2-1769232008926 (contains page name, not all hex)
      const isRealUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentPage)
      
      // Determine if this is a new page (not saved to server yet)
      // New pages can have:
      // 1. Prefix "new-page" (explicit new page marker)
      // 2. Pattern "page-page-X-timestamp" (locally generated by createNewPage)
      // 3. Pattern "page1", "page2", etc. (simple page IDs)
      // 4. Pattern "page-X" (simple page IDs)
      // If it's NOT a real UUID, it's a locally generated ID (new page)
      const isNewPage = currentPage.startsWith('new-page') || 
                        currentPage.startsWith('page-page-') ||
                        /^page\d+$/.test(currentPage) ||
                        /^page-\d+$/.test(currentPage) ||
                        (!isRealUuid && currentPage.includes('-'))
      
      // For new pages, use the slug as the page ID in the request
      // For existing pages (real UUIDs), use the current page ID
      const pageId = isNewPage ? slug : currentPage
      console.log('💾 [Website Page Save] Generated slug:', slug)
      console.log('💾 [Website Page Save] Current page:', currentPage)
      console.log('💾 [Website Page Save] Is real UUID format:', isRealUuid)
      console.log('💾 [Website Page Save] Is new page (not saved yet):', isNewPage)
      console.log('💾 [Website Page Save] Page ID to use in request:', pageId)

      // Only treat as existing webpage UUID if it's a real UUID format
      // Locally generated IDs should trigger POST (create), not PATCH (update)
      const webpageUuid = isRealUuid ? currentPage : null
      console.log('💾 [Website Page Save] Is existing webpage (UUID):', !!webpageUuid)
      console.log('💾 [Website Page Save] Webpage UUID:', webpageUuid)

      // Get the actual page name from root.props.pageTitle if available, otherwise use currentPageName
      const actualPageName = currentData?.root?.props?.pageTitle?.trim() || currentPageName.trim() || 'Untitled Page'
      
      const request: CreateWebpageRequest = {
        event_uuid: createdEvent.uuid,
        name: actualPageName,
        content: {
          [pageId]: {
            title: actualPageName,
            slug: slug,
            data: {
              [slug]: puckData
            }
          }
        }
      }
      console.log('💾 [Website Page Save] Using page name:', actualPageName)
      console.log('💾 [Website Page Save] Source:', currentData?.root?.props?.pageTitle ? 'root.props.pageTitle' : 'currentPageName')
      console.log('💾 [Website Page Save] Request payload:', {
        event_uuid: request.event_uuid,
        name: request.name,
        contentKeys: Object.keys(request.content),
        pageData: {
          title: request.content[pageId]?.title,
          slug: request.content[pageId]?.slug,
          dataKeys: Object.keys(request.content[pageId]?.data || {})
        }
      })

      // Call API to save (create or update)
      // Scenario 1: If webpageUuid exists, use PATCH method to update existing page
      // Scenario 2: Otherwise, use POST method to create new page
      if (webpageUuid) {
        console.log('🔄 [Website Page Save] Updating existing webpage with PATCH')
        console.log('🔄 [Website Page Save] Webpage UUID:', webpageUuid)
      } else {
        console.log('➕ [Website Page Save] Creating new webpage with POST')
      }
      
      console.log('📤 [Website Page Save] Sending request to API...')
      const startTime = Date.now()
      const response =       await createOrUpdateWebpage(webpageUuid, createdEvent.uuid, request)
      const duration = Date.now() - startTime
      console.log('✅ [Website Page Save] API call completed successfully')
      console.log('✅ [Website Page Save] Response:', response)
      console.log('✅ [Website Page Save] Duration:', duration + 'ms')
      console.log('✅ [Website Page Save] Saved webpage UUID:', response?.uuid || webpageUuid)
      console.log('✅ [Website Page Save] Saved webpage name:', response?.name || actualPageName)

      setSaveStatus('success')
      console.log('✅ [Website Page Save] Save status set to success')
      showToast.success(`Page "${actualPageName}" saved successfully!`)
      console.log('✅ [Website Page Save] Success toast shown')
      
      // Refresh the webpage list by triggering a page reload or context update
      // Dispatch a custom event that EventWebsitePage can listen to
      window.dispatchEvent(new CustomEvent('webpage-saved', { 
        detail: { 
          uuid: response?.uuid || webpageUuid,
          name: actualPageName,
          eventUuid: createdEvent.uuid
        } 
      }))
      console.log('✅ [Website Page Save] Dispatched webpage-saved event to refresh listing')
      
      if (onSaveSuccess) {
        console.log('✅ [Website Page Save] Calling onSaveSuccess callback')
        onSaveSuccess()
      }

      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle')
        console.log('💾 [Website Page Save] Save status reset to idle')
      }, 2000)

      console.log('✅ [Website Page Save] ==========================================')
      console.log('✅ [Website Page Save] Save completed successfully!')

    } catch (error) {
      console.error('❌ [Website Page Save] ==========================================')
      console.error('❌ [Website Page Save] Error occurred during save')
      console.error('❌ [Website Page Save] Error:', error)
      console.error('❌ [Website Page Save] Error type:', error instanceof Error ? error.constructor.name : typeof error)
      console.error('❌ [Website Page Save] Error message:', error instanceof Error ? error.message : String(error))
      if (error instanceof Error && error.stack) {
        console.error('❌ [Website Page Save] Error stack:', error.stack)
      }
      
      setSaveStatus('error')
      console.error('❌ [Website Page Save] Save status set to error')
      const errorMessage = error instanceof Error ? error.message : 'Failed to save page. Please try again.'
      showToast.error(errorMessage)
      console.error('❌ [Website Page Save] Error toast shown:', errorMessage)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
        console.log('💾 [Website Page Save] Save status reset to idle after error')
      }, 3000)
      
      console.error('❌ [Website Page Save] ==========================================')
    } finally {
      setIsSaving(false)
      console.log('💾 [Website Page Save] Saving state set to false')
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
        saveButton.style.background = '#E8E8D3' // Darker beige when saving
      } else {
        if (saveStatus === 'success') {
          buttonText.textContent = 'Saved!'
          saveButton.style.background = '#10b981' // Keep green for success
        } else if (saveStatus === 'error') {
          buttonText.textContent = 'Error - Try Again'
          saveButton.style.background = '#ef4444' // Keep red for error
        } else {
          buttonText.textContent = 'Save'
          saveButton.style.background = '#F5F5DC' // Beige for normal state
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
