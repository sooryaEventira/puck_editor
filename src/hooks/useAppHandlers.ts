/**
 * App event handlers hook
 * Centralizes all event handler logic for the main App component
 */

import { logger } from '../utils/logger'
import { showToast } from '../utils/toast'

interface UseAppHandlersProps {
  setCurrentView: (view: 'editor' | 'events') => void
  setCurrentData: (data: any) => void
  setPuckUi: (ui: any) => void
  setShowPreview: (show: boolean) => void
  createNewPage: () => void
}

export const useAppHandlers = ({
  setCurrentView,
  setCurrentData,
  setPuckUi,
  setShowPreview,
  createNewPage,
}: UseAppHandlersProps) => {
  
  /**
   * Handle create event button click
   */
  const handleCreateEvent = () => {
    setCurrentView('events')
  }

  /**
   * Handle profile button click
   */
  const handleProfileClick = () => {
    showToast.info('Profile clicked - This would typically open a profile menu or navigate to profile page')
  }

  /**
   * Handle back to editor button click
   */
  const handleBackToEditor = () => {
    setCurrentView('editor')
  }

  /**
   * Handle page creation mode selection
   */
  const handlePageCreationSelect = (mode: 'scratch' | 'template' | 'html') => {
    logger.debug('Page creation mode selected:', mode)
    // For now, all modes will create a new page from scratch
    // You can implement different logic for each mode later
    createNewPage()
  }

  /**
   * Handle navigation to editor from EventHub
   * Loads custom session data from localStorage
   */
  const handleNavigateToEditor = () => {
    logger.debug('🚀 handleNavigateToEditor called - loading custom session data from localStorage');
    
    // Load the custom session data from localStorage
    const storedData = localStorage.getItem('custom-session-data');
    logger.debug('📦 Checking localStorage for custom-session-data:', storedData ? 'FOUND' : 'NOT FOUND');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        logger.debug('✅ Loading custom session with', data.content?.length || 0, 'components');
        logger.debug('📋 Component types:', data.content?.map((c: any) => c.type).join(', '));
        
        // Get the SessionForm ID
        const sessionFormId = data.content?.[0]?.id || 'session-form-editor';
        
        logger.debug('🎯 Auto-selecting SessionForm in canvas with ID:', sessionFormId);
        
        // Update current data with the custom session data
        setCurrentData(data);
        
        // Set UI state to auto-select the SessionForm component
        setPuckUi({
          itemSelector: {
            id: sessionFormId
          }
        });
        
        // Switch to editor view in EDIT MODE (not preview)
        setCurrentView('editor');
        setShowPreview(false); // Ensure we're in edit mode, not preview
        
        logger.debug('✨ Custom session data loaded and switched to EDIT mode with auto-selection!');
        
        // Clear localStorage after loading
        localStorage.removeItem('custom-session-data');
      } catch (error) {
        logger.error('❌ Error loading custom session data:', error);
        // Still switch to editor even if data load fails
        setCurrentView('editor');
        setShowPreview(false);
        setPuckUi(undefined);
      }
    } else {
      logger.warn('⚠️ No custom session data found in localStorage - switching to editor anyway');
      setCurrentView('editor');
      setShowPreview(false);
      setPuckUi(undefined);
    }
  }

  /**
   * Handle adding a component to the editor
   */
  const handleAddComponent = (componentType: string, props: any = {}) => {
    logger.debug('🚀 =============================================');
    logger.debug('🚀 handleAddComponent CALLED from App.tsx!');
    logger.debug('🚀 Component Type:', componentType);
    logger.debug('🚀 Props:', props);
    logger.debug('🚀 =============================================');
    
    // Generate a unique ID for the new component
    const newComponentId = `${componentType.toLowerCase()}-${Date.now()}`;
    logger.debug('🆔 Generated ID:', newComponentId);
    
    // Create the new component object
    const newComponent = {
      type: componentType,
      props: props,
      id: newComponentId
    };
    logger.debug('📦 New Component Object:', newComponent);
    
    // Replace the content with only the new component (don't keep the SchedulePage)
    const updatedData = (currentData: any) => ({
      ...currentData,
      content: [newComponent], // Replace with only the new component
      zones: {} // Clear zones as well
    });
    logger.debug('📝 Updated Data will be set');
    
    // Update the data
    setCurrentData(updatedData as any);
    logger.debug('✅ setCurrentData called');
    
    // Select the newly added component in the UI
    setPuckUi({
      itemSelector: {
        id: newComponentId
      }
    });
    logger.debug('✅ setPuckUi called to select:', newComponentId);
    
    // Switch to editor mode if not already there
    setCurrentView('editor');
    setShowPreview(false);
    logger.debug('✅ Switched to editor mode (showPreview = false)');
    
    logger.debug('🎉 =============================================');
    logger.debug('🎉 Component added successfully!');
    logger.debug('🎉 =============================================');
  }

  return {
    handleCreateEvent,
    handleProfileClick,
    handleBackToEditor,
    handlePageCreationSelect,
    handleNavigateToEditor,
    handleAddComponent,
  }
}

