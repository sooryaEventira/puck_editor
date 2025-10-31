/**
 * Puck Editor Styling Utilities
 * Functions to apply custom styling to Puck editor elements
 */

/**
 * Style the Publish button with purple background
 */
export const stylePublishButton = () => {
  // Multiple selectors to find the publish button
  const buttonSelectors = [
    'button',
    'button[type="submit"]',
    '.puck__button',
    '[data-puck-button]',
    'button[data-testid="publish"]',
    'button[aria-label*="Publish"]',
    'button[title*="Publish"]',
    '.puck__toolbar button',
    '.puck__header button',
    '.puck__actions button',
    '.puck__footer button',
    '[role="button"]',
    '[type="button"]',
    '[type="submit"]',
    '*[class*="button"]',
    '*[class*="Button"]',
    '*[class*="btn"]',
    '*[class*="Btn"]'
  ]
  
  let publishButtonsStyled = 0
  
  buttonSelectors.forEach(selector => {
    try {
      const buttons = document.querySelectorAll(selector)
      
      buttons.forEach(button => {
        if (button instanceof HTMLElement) {
          const buttonText = button.textContent?.trim().toLowerCase() || ''

          // Check if this button contains "publish" text specifically
          if (buttonText.includes('publish') || 
              button.getAttribute('data-testid') === 'publish' ||
              button.getAttribute('aria-label')?.toLowerCase().includes('publish') ||
              button.getAttribute('title')?.toLowerCase().includes('publish')) {
            
            // Apply purple background and white text
            button.style.backgroundColor = '#6f42c1'
            button.style.setProperty('background-color', '#6f42c1', 'important')
            button.style.color = 'white'
            button.style.setProperty('color', 'white', 'important')
            button.style.borderColor = '#6f42c1'
            button.style.setProperty('border-color', '#6f42c1', 'important')
            
            // Force override any existing styles
            button.setAttribute('style', button.getAttribute('style') + '; background-color: #6f42c1 !important; color: white !important; border-color: #6f42c1 !important;')
            
            // Style any child elements
            const childElements = button.querySelectorAll('*')
            childElements.forEach(child => {
              if (child instanceof HTMLElement) {
                child.style.color = 'white'
                child.style.setProperty('color', 'white', 'important')
                child.style.backgroundColor = 'transparent'
                child.style.setProperty('background-color', 'transparent', 'important')
              }
            })
            
            publishButtonsStyled++
          }
        }
      })
    } catch (e) {
      // Silently catch errors
    }
  })
}

/**
 * Force black text color on all Puck elements
 */
export const forcePurpleText = () => {
  const stylePurpleText = (element: HTMLElement) => {
    element.style.color = '#000000'
    element.style.setProperty('color', '#000000', 'important')
    // Also try setting the computed style
    element.style.cssText += 'color: #000000 !important;'
  }
  
  // Try different selectors to find Puck elements
  const possibleSelectors = [
    '.puck',
    '[class*="puck"]',
    '[class*="Puck"]',
    '[class*="editor"]',
    '[class*="Editor"]',
    'div[class*="puck"]',
    'div[class*="Puck"]'
  ]
  
  let foundElements = 0
  possibleSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector)
    if (elements.length > 0) {
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          stylePurpleText(element)
          foundElements++
        }
      })
    }
  })

  // Find all text elements in any container that might be Puck
  const allElements = document.querySelectorAll('*')
  let textElementsStyled = 0
  
  allElements.forEach(element => {
    if (element instanceof HTMLElement && 
        element.textContent && 
        element.textContent.trim().length > 0 &&
        element.textContent.length < 100) { // Only short text elements (likely UI text)
      stylePurpleText(element)
      textElementsStyled++
    }
  })

  // Style Publish Button specifically
  stylePublishButton()
}

/**
 * Setup styling observer and intervals
 * Returns cleanup function
 */
export const setupPuckStyling = () => {
  // Apply immediately
  forcePurpleText()
  
  // Apply multiple times with different delays to ensure Puck has loaded
  const timeouts = [
    setTimeout(forcePurpleText, 1000),
    setTimeout(forcePurpleText, 2000),
    setTimeout(forcePurpleText, 3000),
    setTimeout(forcePurpleText, 5000),
    setTimeout(forcePurpleText, 10000)
  ]
  
  // Apply when DOM changes (Puck loads new content)
  const observer = new MutationObserver(() => {
    forcePurpleText()
  })
  
  observer.observe(document.body, { childList: true, subtree: true })
  
  // Also apply every 2 seconds to catch any missed elements
  const interval = setInterval(forcePurpleText, 2000)
  
  // Cleanup function
  return () => {
    timeouts.forEach(timeout => clearTimeout(timeout))
    observer.disconnect()
    clearInterval(interval)
  }
}

