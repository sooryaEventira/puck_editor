import React, { useState, useEffect } from 'react'

import { usePageManagement } from '../hooks/usePageManagement'
import { usePublish } from '../hooks/usePublish'
import { useAppHandlers } from '../hooks/useAppHandlers'
import { PageManager, PageNameDialog, PageCreationModal } from './page'
import { EventHubPage, EventHubNavbar, SchedulePage, CommunicationPage, ResourceManagementPage } from './eventhub'
import EditorView from './EditorView'
import { LoginPage, RegistrationPage, EmailVerificationPage, CreatePasswordPage, EventspaceSetupPage } from '../pages'
import { DashboardLayout } from './dashboard'
import { logger } from '../utils/logger'
import { setupPuckStyling } from '../utils/puckStyling'
import { showToast } from '../utils/toast'
import { showEmailVerifiedToast } from '../utils/toastHelpers'
import { verifyRegistrationOtp, createPassword, createOrganization } from '../services/authService'

const App: React.FC = () => {
  // Check if user is authenticated (check localStorage on mount)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  const [showRegistration, setShowRegistration] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [showEventspaceSetup, setShowEventspaceSetup] = useState(false)
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpVerificationError, setOtpVerificationError] = useState<string | null>(null)
  const [isCreatingPassword, setIsCreatingPassword] = useState(false)
  const [passwordCreationError, setPasswordCreationError] = useState<string | null>(null)
  const [isCreatingOrganization, setIsCreatingOrganization] = useState(false)
  const [organizationCreationError, setOrganizationCreationError] = useState<string | null>(null)
  
  const [showPreview, setShowPreview] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'events' | 'schedule' | 'communication' | 'resource-management'>('dashboard')
  const [puckUi, setPuckUi] = useState<any>(undefined)
  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [showPageCreationModal, setShowPageCreationModal] = useState(false)
  
  logger.debug('🔄 App component rendering, currentView:', currentView);
  
  const {
    currentData,
    setCurrentData,
    currentPage,
    setCurrentPage,
    currentPageName,
    setCurrentPageName,
    pages,
    showPageManager,
    setShowPageManager,
    showPageNameDialog,
    setShowPageNameDialog,
    loadPages,
    loadPage,
    createNewPage,
    confirmNewPage,
    createPageFromTemplate
  } = usePageManagement()

  const { handlePublish, handleDataChange } = usePublish(
    currentData,
    setCurrentData,
    currentPage,
    currentPageName,
    setCurrentPage,
    loadPages
  )

  // App event handlers
  const {
    handleCreateEvent,
    handleProfileClick,
    handlePageCreationSelect,
    handleNavigateToEditor,
    handleAddComponent,
  } = useAppHandlers({
    setCurrentView,
    setCurrentData,
    setPuckUi,
    setShowPreview,
    createNewPage,
  })

  // Handle card click from EventHubContent or sidebar
  const handleEventHubCardClick = (cardId: string) => {
    if (cardId === 'schedule-session') {
      // Navigate to schedule management view
      setCurrentView('schedule')
      logger.debug('📍 Navigating to schedule page from Event Hub card')
    } else if (cardId === 'communications') {
      // Navigate to communication page
      setCurrentView('communication')
      logger.debug('📍 Navigating to communication page from Event Hub card')
    } else if (cardId === 'resource-management') {
      // Navigate to resource management page
      setCurrentView('resource-management')
      logger.debug('📍 Navigating to resource management page from Event Hub card')
    } else {
      // Handle other card IDs (attendee-management, analytics, website-settings)
      logger.debug(`📍 Card clicked: ${cardId}`)
      // TODO: Implement navigation for other card types when their pages are created
    }
  }

  // Custom back to editor handler
  const handleBackToEditor = () => {
    setCurrentView('editor')
    logger.debug('📍 Navigating back to editor')
  }

  // Custom back to event hub handler
  const handleBackToEventHub = () => {
    setCurrentView('events')
    logger.debug('📍 Navigating back to event hub')
  }

  // Handle navigation to schedule page
  const handleNavigateToSchedule = () => {
    setCurrentView('schedule')
    logger.debug('📍 Navigating to schedule page')
  }

  // Handle login
  const handleLogin = (email: string, password: string) => {
    // TODO: Implement actual authentication logic
    console.log('Login attempt:', email, password)
    // For now, just set authenticated to true
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  // Handle registration
  const handleRegistration = (email: string) => {
    // TODO: Implement actual registration logic (send OTP email)
    console.log('Registration attempt:', email)
    // Store email and navigate to verification page
    setRegistrationEmail(email)
    setShowRegistration(false)
    setShowEmailVerification(true)
  }

  // Handle email verification
  const handleEmailVerification = async (code: string) => {
    setIsVerifyingOtp(true)
    setOtpVerificationError(null)

    try {
      // Call the verify OTP API
      const response = await verifyRegistrationOtp(registrationEmail, code)
      
      if (response.status === 'success') {
        // Show toast notification
        showEmailVerifiedToast()
        // Navigate to password creation page
        setShowEmailVerification(false)
        setShowCreatePassword(true)
      }
    } catch (error) {
      // Error is already handled in authService with toast
      // Set local error state for UI display
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.'
      setOtpVerificationError(errorMessage)
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // Handle password creation
  const handlePasswordCreation = async (password: string) => {
    setIsCreatingPassword(true)
    setPasswordCreationError(null)

    try {
      // Call the create password API with email and password
      const response = await createPassword(registrationEmail, password)
      
      console.log('Password creation response:', response)
      console.log('Response status:', response.status)
      console.log('Response data:', response.data)
      
      // Store tokens in localStorage if available
      if (response.data) {
        const { access, refresh, user } = response.data
        if (access) {
          localStorage.setItem('accessToken', access)
          console.log('Access token stored')
        }
        if (refresh) {
          localStorage.setItem('refreshToken', refresh)
          console.log('Refresh token stored')
        }
        
        // Store user data
        if (user?.email) {
          localStorage.setItem('userEmail', user.email)
          console.log('User email stored:', user.email)
        }
      }
      
      // Navigate to eventspace setup page - always navigate if API call succeeded
      console.log('Navigating to eventspace setup page...')
      
      // Update both states to navigate
      setShowCreatePassword(false)
      setShowEventspaceSetup(true)
      
      console.log('Navigation triggered - showCreatePassword set to false, showEventspaceSetup set to true')
    } catch (error) {
      // Error is already handled in authService with toast
      // Set local error state for UI display
      const errorMessage = error instanceof Error ? error.message : 'Failed to create password. Please try again.'
      setPasswordCreationError(errorMessage)
    } finally {
      setIsCreatingPassword(false)
    }
  }

  // Handle eventspace setup
  const handleEventspaceSetup = async (eventspaceName: string) => {
    setIsCreatingOrganization(true)
    setOrganizationCreationError(null)

    try {
      // Call the create organization API
      const organization = await createOrganization(eventspaceName)
      
      console.log('Organization created successfully:', organization)
      
      // Store organization data in localStorage
      if (organization.uuid) {
        localStorage.setItem('organizationUuid', organization.uuid)
        localStorage.setItem('organizationName', organization.name)
      }
      
      // Complete setup and authenticate user
      console.log('✅ Organization setup complete, navigating to dashboard...')
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      setShowEventspaceSetup(false)
      // Navigate to dashboard
      setCurrentView('dashboard')
      console.log('📍 Dashboard view set, authentication status:', true)
    } catch (error) {
      // Error is already handled in authService with toast
      // Set local error state for UI display
      const errorMessage = error instanceof Error ? error.message : 'Failed to create organization. Please try again.'
      setOrganizationCreationError(errorMessage)
    } finally {
      setIsCreatingOrganization(false)
    }
  }

  // Handle resend OTP code
  const handleResendCode = () => {
    // TODO: Implement actual resend logic
    console.log('Resending OTP code to:', registrationEmail)
  }

  // Handle logout - clear all authentication data
  const handleLogout = () => {
    // Clear authentication state
    setIsAuthenticated(false)
    
    // Clear all localStorage items related to authentication
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('organizationUuid')
    localStorage.removeItem('organizationName')
    
    // Show logout confirmation
    showToast.success('Logged out successfully')
    
    // Navigate to login page (will happen automatically via isAuthenticated state)
    console.log('✅ User logged out successfully')
  }

  // Handle social sign-in (placeholder)
  const handleGoogleSignIn = () => {
    console.log('Google sign in')
    // TODO: Implement Google OAuth
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const handleMicrosoftSignIn = () => {
    console.log('Microsoft sign in')
    // TODO: Implement Microsoft OAuth
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const handleMagicLinkSignIn = () => {
    console.log('Magic link sign in')
    // TODO: Implement magic link authentication
  }

  // Apply Puck styling when not in preview mode
  useEffect(() => {
    if (!showPreview && isAuthenticated) {
      return setupPuckStyling()
    }
  }, [showPreview, isAuthenticated])

  // Listen for navigation to schedule page
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    
    const handleNavigateToScheduleEvent = () => {
      setCurrentView('schedule')
      logger.debug('📍 Navigating to schedule page via event')
    }

    window.addEventListener('navigate-to-schedule', handleNavigateToScheduleEvent)
    
    return () => {
      window.removeEventListener('navigate-to-schedule', handleNavigateToScheduleEvent)
    }
  }, [isAuthenticated])

  // Show login, registration, email verification, password creation, or eventspace setup page if not authenticated
  if (!isAuthenticated) {
    if (showEventspaceSetup) {
      return (
        <EventspaceSetupPage
          onSubmit={handleEventspaceSetup}
          isLoading={isCreatingOrganization}
          error={organizationCreationError}
          onNameChange={() => setOrganizationCreationError(null)}
        />
      )
    }
    
    if (showCreatePassword) {
      return (
        <CreatePasswordPage
          onSubmit={handlePasswordCreation}
          isLoading={isCreatingPassword}
          error={passwordCreationError}
          onPasswordChange={() => setPasswordCreationError(null)}
        />
      )
    }
    
    if (showEmailVerification) {
      return (
        <EmailVerificationPage
          email={registrationEmail}
          onVerify={handleEmailVerification}
          onResendCode={handleResendCode}
          isLoading={isVerifyingOtp}
          error={otpVerificationError}
          onCodeChange={() => setOtpVerificationError(null)}
        />
      )
    }
    
    if (showRegistration) {
      return (
        <RegistrationPage
          onSubmit={handleRegistration}
          onTermsClick={() => console.log('Terms and Conditions clicked')}
          onAlreadyHaveAccount={() => setShowRegistration(false)}
          onClose={() => setShowRegistration(false)}
        />
      )
    }
    
    return (
      <LoginPage
        onSubmit={handleLogin}
        onGoogleSignIn={handleGoogleSignIn}
        onMicrosoftSignIn={handleMicrosoftSignIn}
        onMagicLinkSignIn={handleMagicLinkSignIn}
        onForgotPassword={() => console.log('Forgot password clicked')}
        onNavigateToRegistration={() => setShowRegistration(true)}
      />
    )
  }

  // Render Dashboard
  if (currentView === 'dashboard') {
    const organizationName = localStorage.getItem('organizationName') || 'Web Summit'
    const userEmail = localStorage.getItem('userEmail') || ''
    
    console.log('🏠 Rendering Dashboard with organization:', organizationName)
    
    return (
      <DashboardLayout
        organizationName={organizationName}
        title="Web Submit Events"
        userAvatarUrl=""
        userEmail={userEmail}
        onSidebarItemClick={(itemId) => {
          console.log('Sidebar item clicked:', itemId)
          // Handle navigation to different sections
          if (itemId === 'events') {
            setCurrentView('events')
          }
          // Add other navigation handlers as needed
        }}
        onSearchClick={() => console.log('Search clicked')}
        onNotificationClick={() => console.log('Notification clicked')}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        onNewEventClick={() => console.log('New event clicked')}
        onEditEvent={(eventId) => console.log('Edit event:', eventId)}
        onSortEvents={(column) => console.log('Sort by:', column)}
      />
    )
  }

  // Render Events Page (Event Hub)
  if (currentView === 'events') {
    logger.debug('📍 Rendering Event Hub Page');
    
    return (
      <EventHubPage
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEditor}
        userAvatarUrl="" // Add user avatar URL here if available
        onCardClick={handleEventHubCardClick}
      />
    )
  }

  // Render Schedule Page
  if (currentView === 'schedule') {
    logger.debug('📍 Rendering Schedule Page');
    
    return (
      <SchedulePage
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEventHub}
        userAvatarUrl=""
        scheduleName="Schedule 1"
        onCardClick={handleEventHubCardClick}
      />
    )
  }

  // Render Communication Page
  if (currentView === 'communication') {
    logger.debug('📍 Rendering Communication Page');
    
    return (
      <CommunicationPage
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEventHub}
        userAvatarUrl=""
        onCardClick={handleEventHubCardClick}
      />
    )
  }

  // Render Resource Management Page
  if (currentView === 'resource-management') {
    logger.debug('📍 Rendering Resource Management Page');
    
    return (
      <ResourceManagementPage
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEventHub}
        userAvatarUrl=""
        onCardClick={handleEventHubCardClick}
      />
    )
  }

  // Render Editor Page
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navbar - EventHubNavbar */}
      <EventHubNavbar
        eventName="Highly important conference of 2025"
        isDraft={true}
        onBackClick={handleBackToEditor}
        onSearchClick={() => {}}
        onNotificationClick={() => {}}
        onProfileClick={handleProfileClick}
        userAvatarUrl=""
      />

      {/* Page Manager */}
      <PageManager
        pages={pages}
        currentPage={currentPage}
        onPageSelect={loadPage}
        isVisible={showPageManager}
      />

      {/* Page Name Dialog */}
      <PageNameDialog
        isVisible={showPageNameDialog}
        pageName={currentPageName}
        onPageNameChange={setCurrentPageName}
        onConfirm={confirmNewPage}
        onCancel={() => setShowPageNameDialog(false)}
      />

      {/* Page Creation Modal */}
      <PageCreationModal
        isVisible={showPageCreationModal}
        onClose={() => setShowPageCreationModal(false)}
        onSelect={handlePageCreationSelect}
      />

      {/* Main Content - Editor View */}
      <EditorView
        currentData={currentData}
        currentPage={currentPage}
        currentPageName={currentPageName}
        pages={pages}
        puckUi={puckUi}
        showPreview={showPreview}
        showLeftSidebar={showLeftSidebar}
        showRightSidebar={showRightSidebar}
        showPageManager={showPageManager}
        onPublish={handlePublish}
        onChange={handleDataChange}
        onDataChange={setCurrentData}
        onPageSelect={loadPage}
        onAddPage={() => setShowPageCreationModal(true)}
        onManagePages={() => setShowPageManager(!showPageManager)}
        onNavigateToEditor={handleNavigateToEditor}
        onAddComponent={handleAddComponent}
        onPreviewToggle={() => setShowPreview(!showPreview)}
        onBack={handleBackToEditor}
        onCreatePageFromTemplate={createPageFromTemplate}
        onCreateNewPage={createNewPage}
      />
    </div>
  )
}

export default App
