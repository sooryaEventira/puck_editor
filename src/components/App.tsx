import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'

import { usePageManagement } from '../hooks/usePageManagement'
import { usePublish } from '../hooks/usePublish'
import { useAppHandlers } from '../hooks/useAppHandlers'
import { PageManager, PageNameDialog, PageCreationModal } from './page'
import { EventHubNavbar } from './eventhub'
import { EventFormProvider, useEventForm } from '../contexts/EventFormContext'
import { logger } from '../utils/logger'
import { setupPuckStyling } from '../utils/puckStyling'
import { showToast } from '../utils/toast'
import { verifyRegistrationOtp, createPassword, createOrganization, signIn } from '../services/authService'

// Lazy load heavy components for code splitting
const EventHubPage = lazy(() => import('./eventhub').then(module => ({ default: module.EventHubPage })))
const SchedulePage = lazy(() => import('./eventhub/schedulesession/SchedulePage'))
const CommunicationPage = lazy(() => import('./eventhub/communication/CommunicationPage'))
const ResourceManagementPage = lazy(() => import('./eventhub/resourcemanagement/ResourceManagementPage'))
const EditorView = lazy(() => import('./shared/EditorView'))
const LoginPage = lazy(() => import('../pages').then(module => ({ default: module.LoginPage })))
const RegistrationPage = lazy(() => import('../pages').then(module => ({ default: module.RegistrationPage })))
const EmailVerificationPage = lazy(() => import('../pages').then(module => ({ default: module.EmailVerificationPage })))
const CreatePasswordPage = lazy(() => import('../pages').then(module => ({ default: module.CreatePasswordPage })))
const EventspaceSetupPage = lazy(() => import('../pages').then(module => ({ default: module.EventspaceSetupPage })))
const DashboardLayout = lazy(() => import('./dashboard').then(module => ({ default: module.DashboardLayout })))

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

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
  const [showPageCreationModal, setShowPageCreationModal] = useState(false)
  const [showLeftSidebar] = useState(true)
  const [showRightSidebar] = useState(true)
  
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

  // Custom back to dashboard handler
  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    window.history.pushState({}, '', '/dashboard')
    logger.debug('📍 Navigating back to dashboard')
  }

  // Helper function to check if user has an organization
  const hasOrganization = (): boolean => {
    const orgUuid = localStorage.getItem('organizationUuid')
    const orgName = localStorage.getItem('organizationName')
    return !!(orgUuid && orgName)
  }

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      // Call the sign in API
      const response = await signIn(email, password)
      
      // Store tokens in localStorage if available
      if (response.data) {
        const { access, refresh, organizations } = response.data
        if (access) {
          localStorage.setItem('accessToken', access)
        }
        if (refresh) {
          localStorage.setItem('refreshToken', refresh)
        }
        
        // Store email for reference
        localStorage.setItem('userEmail', email)
        
        // Store organization if available, otherwise clear any existing organization data
        if (organizations && organizations.length > 0) {
          const firstOrg = organizations[0]
          if (firstOrg.uuid) {
            localStorage.setItem('organizationUuid', firstOrg.uuid)
          }
          if (firstOrg.name) {
            localStorage.setItem('organizationName', firstOrg.name)
          }
        } else {
          // Clear organization data if no organizations in response
          localStorage.removeItem('organizationUuid')
          localStorage.removeItem('organizationName')
        }
      }
      
      // Set authentication state
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      
      // Check if user has organization
      const hasOrg = hasOrganization()
      
      if (hasOrg) {
        // User has organization - navigate to dashboard
        setCurrentView('dashboard')
      } else {
        // User doesn't have organization - redirect to eventspace setup
        setShowEventspaceSetup(true)
        logger.debug('⚠️ User logged in without organization, redirecting to eventspace setup')
      }
    } catch (error) {
      // Error is already handled in authService with toast
      // Authentication failed, user remains on login page
    }
  }

  // Handle registration
  // Note: OTP is already sent in RegistrationPage.tsx, this function only handles navigation
  const handleRegistration = (email: string) => {
    // Store email and navigate to verification page
    // The OTP API call and toast notification are already handled in RegistrationPage.tsx
    setRegistrationEmail(email)
    setShowRegistration(false)
    setShowEmailVerification(true)
  }

  // Handle email verification
  const handleEmailVerification = async (code: string) => {
    setIsVerifyingOtp(true)
    setOtpVerificationError(null)

    // Log OTP for debugging
    console.log('🔐 [OTP Verification] OTP entered:', {
      email: registrationEmail,
      otp: code,
      otpLength: code.length
    })

    try {
      // Call the verify OTP API
      const response = await verifyRegistrationOtp(registrationEmail, code)
      
      if (response.status === 'success') {
        // Toast notification is already shown by authService
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
      
      // Store tokens in localStorage if available
      if (response.data) {
        const { access, refresh, user } = response.data
        if (access) {
          localStorage.setItem('accessToken', access)
        }
        if (refresh) {
          localStorage.setItem('refreshToken', refresh)
        }
        
        // Store user data
        if (user?.email) {
          localStorage.setItem('userEmail', user.email)
        }
      }
      
      // Navigate to eventspace setup page - always navigate if API call succeeded
      setShowCreatePassword(false)
      setShowEventspaceSetup(true)
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
      
      // Store organization data in localStorage
      if (organization.uuid) {
        localStorage.setItem('organizationUuid', organization.uuid)
        localStorage.setItem('organizationName', organization.name)
      }
      
      // Ensure user is authenticated (in case they skipped password creation)
      if (!isAuthenticated) {
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
      }
      
      // Hide eventspace setup page
      setShowEventspaceSetup(false)
      
      // Navigate to dashboard
      setCurrentView('dashboard')
      
      // Show success message
      showToast.success('Organization created successfully!')
      
      logger.debug('✅ Organization created, navigating to dashboard')
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
  }

  // Handle social sign-in (placeholder)
  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const handleMicrosoftSignIn = () => {
    // TODO: Implement Microsoft OAuth
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const handleMagicLinkSignIn = () => {
    // TODO: Implement magic link authentication
  }

  // Check organization status on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      const hasOrg = hasOrganization()
      
      // If authenticated but no organization, show eventspace setup
      if (!hasOrg && !showEventspaceSetup && !showCreatePassword && !showEmailVerification && !showRegistration) {
        setShowEventspaceSetup(true)
        logger.debug('⚠️ Authenticated user without organization detected, showing eventspace setup')
      }
    }
  }, [isAuthenticated, showEventspaceSetup, showCreatePassword, showEmailVerification, showRegistration])

  // Apply Puck styling when not in preview mode
  useEffect(() => {
    if (!showPreview && isAuthenticated) {
      return setupPuckStyling()
    }
  }, [showPreview, isAuthenticated])

  // Store loadPage in a ref to avoid re-running effect when function reference changes
  const loadPageRef = useRef(loadPage)
  const currentViewRef = useRef(currentView)
  
  useEffect(() => {
    loadPageRef.current = loadPage
  }, [loadPage])
  
  useEffect(() => {
    currentViewRef.current = currentView
  }, [currentView])

  // Detect editor route from WebsitePreviewPage and handle route changes
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let lastCheckedPath = ''

    const checkRoute = () => {
      const path = window.location.pathname
      
      // Skip if path hasn't changed
      if (path === lastCheckedPath) {
        return
      }
      
      lastCheckedPath = path
      
      if (path.startsWith('/event/website/editor/')) {
        // Extract pageId from path: /event/website/editor/:pageId
        // Remove query params if present
        const pathWithoutQuery = path.split('?')[0]
        const pageIdMatch = pathWithoutQuery.match(/\/event\/website\/editor\/(.+)/)
        const pageId = pageIdMatch ? pageIdMatch[1] : 'welcome'
        
        logger.debug('📍 Editor route detected:', pageId)
        
        // Only switch to editor view if not already in editor view
        if (currentViewRef.current !== 'editor') {
          setCurrentView('editor')
        }
        setShowPreview(false)
        
        // Load the page data - ensure it loads even if page is not in pages array
        const pageFilename = pageId.endsWith('.json') ? pageId : `${pageId}.json`
        loadPageRef.current(pageFilename)
          .catch((error) => {
            logger.debug('Failed to load page from editor route:', error)
          })
      } else if (path.startsWith('/event/hub')) {
        // Navigate to Event Hub page
        logger.debug('📍 Event Hub route detected, switching to events view')
        if (currentViewRef.current !== 'events') {
          setCurrentView('events')
        }
      } else if (path.startsWith('/event/website/preview/') || path.startsWith('/event/website')) {
        // If navigating to preview or website management, switch to dashboard view
        // DashboardLayout will handle showing the correct page
        logger.debug('📍 Preview/Website route detected, switching to dashboard view')
        if (currentViewRef.current !== 'dashboard') {
          setCurrentView('dashboard')
        }
      }
    }

    // Check on mount
    checkRoute()

    // Listen for navigation events
    const handleLocationChange = () => {
      checkRoute()
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [isAuthenticated])

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

  // Show eventspace setup if authenticated but no organization (or if explicitly shown during registration)
  if (showEventspaceSetup && (!isAuthenticated || !hasOrganization())) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <EventspaceSetupPage
          onSubmit={handleEventspaceSetup}
          isLoading={isCreatingOrganization}
          error={organizationCreationError}
          onNameChange={() => setOrganizationCreationError(null)}
        />
      </Suspense>
    )
  }

  // Show login, registration, email verification, password creation pages if not authenticated
  if (!isAuthenticated) {
    
    if (showCreatePassword) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <CreatePasswordPage
            onSubmit={handlePasswordCreation}
            isLoading={isCreatingPassword}
            error={passwordCreationError}
            onPasswordChange={() => setPasswordCreationError(null)}
          />
        </Suspense>
      )
    }
    
    if (showEmailVerification) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <EmailVerificationPage
            email={registrationEmail}
            onVerify={handleEmailVerification}
            onResendCode={handleResendCode}
            isLoading={isVerifyingOtp}
            error={otpVerificationError}
            onCodeChange={() => setOtpVerificationError(null)}
          />
        </Suspense>
      )
    }
    
    if (showRegistration) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <RegistrationPage
            onSubmit={handleRegistration}
            onTermsClick={() => {}}
            onAlreadyHaveAccount={() => setShowRegistration(false)}
            onClose={() => setShowRegistration(false)}
          />
        </Suspense>
      )
    }
    
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage
          onSubmit={handleLogin}
          onGoogleSignIn={handleGoogleSignIn}
          onMicrosoftSignIn={handleMicrosoftSignIn}
          onMagicLinkSignIn={handleMagicLinkSignIn}
          onForgotPassword={() => {}}
          onNavigateToRegistration={() => setShowRegistration(true)}
        />
      </Suspense>
    )
  }

  // Route protection: Check if user has organization before accessing protected routes
  if (isAuthenticated && !hasOrganization()) {
    // User is authenticated but doesn't have organization - show eventspace setup
    return (
      <Suspense fallback={<LoadingFallback />}>
        <EventspaceSetupPage
          onSubmit={handleEventspaceSetup}
          isLoading={isCreatingOrganization}
          error={organizationCreationError}
          onNameChange={() => setOrganizationCreationError(null)}
        />
      </Suspense>
    )
  }

  // Render Dashboard
  if (currentView === 'dashboard') {
    const organizationName = localStorage.getItem('organizationName') || 'Web Summit'
    const userEmail = localStorage.getItem('userEmail') || ''
    
    return (
      <EventFormProvider>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardLayout
            organizationName={organizationName}
            title="Web Submit Events"
            userAvatarUrl=""
            userEmail={userEmail}
            onSidebarItemClick={(itemId) => {
              // Handle navigation to different sections
              if (itemId === 'events') {
                setCurrentView('events')
              }
              // Add other navigation handlers as needed
            }}
            onSearchClick={() => {}}
            onNotificationClick={() => {}}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
            onNewEventClick={() => {}}
            onEditEvent={(_eventId) => {}}
            onSortEvents={(_column) => {}}
          />
        </Suspense>
      </EventFormProvider>
    )
  }

  // Render Events Page (Event Hub)
  if (currentView === 'events') {
    logger.debug('📍 Rendering Event Hub Page');
    
    return (
      <Suspense fallback={<LoadingFallback />}>
        <EventHubPage
          eventName="Highly important conference of 2025"
          isDraft={true}
          onBackClick={handleBackToDashboard}
          userAvatarUrl="" // Add user avatar URL here if available
          onCardClick={handleEventHubCardClick}
        />
      </Suspense>
    )
  }

  // Render Schedule Page
  if (currentView === 'schedule') {
    logger.debug('📍 Rendering Schedule Page');
    
    return (
      <Suspense fallback={<LoadingFallback />}>
        <SchedulePage
          eventName="Highly important conference of 2025"
          isDraft={true}
          onBackClick={handleBackToEventHub}
          userAvatarUrl=""
          scheduleName="Schedule 1"
          onCardClick={handleEventHubCardClick}
        />
      </Suspense>
    )
  }

  // Render Communication Page
  if (currentView === 'communication') {
    logger.debug('📍 Rendering Communication Page');
    
    return (
      <Suspense fallback={<LoadingFallback />}>
        <CommunicationPage
          eventName="Highly important conference of 2025"
          isDraft={true}
          onBackClick={handleBackToEventHub}
          userAvatarUrl=""
          onCardClick={handleEventHubCardClick}
        />
      </Suspense>
    )
  }

  // Render Resource Management Page
  if (currentView === 'resource-management') {
    logger.debug('📍 Rendering Resource Management Page');
    
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ResourceManagementPage
          eventName="Highly important conference of 2025"
          isDraft={true}
          onBackClick={handleBackToEventHub}
          userAvatarUrl=""
          onCardClick={handleEventHubCardClick}
        />
      </Suspense>
    )
  }

  // Render Editor Page
  return (
    <EditorViewWithNavbar
      currentData={currentData}
      currentPage={currentPage}
      currentPageName={currentPageName}
      pages={pages}
      puckUi={puckUi}
      showPreview={showPreview}
      showLeftSidebar={showLeftSidebar}
      showRightSidebar={showRightSidebar}
      showPageManager={showPageManager}
      showPageNameDialog={showPageNameDialog}
      showPageCreationModal={showPageCreationModal}
      onPublish={handlePublish}
      onDataChange={handleDataChange}
      setCurrentData={setCurrentData}
      loadPage={loadPage}
      setShowPageManager={setShowPageManager}
      setShowPageNameDialog={setShowPageNameDialog}
      setCurrentPageName={setCurrentPageName}
      confirmNewPage={confirmNewPage}
      setShowPageCreationModal={setShowPageCreationModal}
      handlePageCreationSelect={handlePageCreationSelect}
      handleNavigateToEditor={handleNavigateToEditor}
      handleAddComponent={handleAddComponent}
      setShowPreview={setShowPreview}
      handleBackToEditor={handleBackToEditor}
      createPageFromTemplate={createPageFromTemplate}
      createNewPage={createNewPage}
      handleProfileClick={handleProfileClick}
    />
  )
}

// Wrapper component to access EventFormContext
const EditorViewWithNavbar: React.FC<{
  currentData: any
  currentPage: string
  currentPageName: string
  pages: any[]
  puckUi: any
  showPreview: boolean
  showLeftSidebar: boolean
  showRightSidebar: boolean
  showPageManager: boolean
  showPageNameDialog: boolean
  showPageCreationModal: boolean
  onPublish: (data: any) => void
  onDataChange: (data: any) => void
  setCurrentData: (data: any) => void
  loadPage: (filename: string) => Promise<any>
  setShowPageManager: (show: boolean) => void
  setShowPageNameDialog: (show: boolean) => void
  setCurrentPageName: (name: string) => void
  confirmNewPage: (pageName: string) => void
  setShowPageCreationModal: (show: boolean) => void
  handlePageCreationSelect: (pageType: any) => void
  handleNavigateToEditor: () => void
  handleAddComponent: (componentType: string, props?: any) => void
  setShowPreview: (show: boolean) => void
  handleBackToEditor: () => void
  createPageFromTemplate: (templateType: string) => Promise<any>
  createNewPage: () => void
  handleProfileClick: () => void
}> = (props) => {
  const { eventData } = useEventForm()
  const userAvatarUrl = localStorage.getItem('userAvatarUrl') || ''
  
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navbar - EventHubNavbar */}
      <EventHubNavbar
        eventName={eventData?.eventName || 'Highly important conference of 2025'}
        isDraft={true}
        onBackClick={props.handleBackToEditor}
        onSearchClick={() => {}}
        onNotificationClick={() => {}}
        onProfileClick={props.handleProfileClick}
        userAvatarUrl={userAvatarUrl}
      />

      {/* Page Manager */}
      <PageManager
        pages={props.pages}
        currentPage={props.currentPage}
        onPageSelect={props.loadPage}
        isVisible={props.showPageManager}
      />

      {/* Page Name Dialog */}
      <PageNameDialog
        isVisible={props.showPageNameDialog}
        pageName={props.currentPageName}
        onPageNameChange={props.setCurrentPageName}
        onConfirm={props.confirmNewPage}
        onCancel={() => props.setShowPageNameDialog(false)}
      />

      {/* Page Creation Modal */}
      <PageCreationModal
        isVisible={props.showPageCreationModal}
        onClose={() => props.setShowPageCreationModal(false)}
        onSelect={props.handlePageCreationSelect}
      />

      {/* Main Content - Editor View */}
      <Suspense fallback={<LoadingFallback />}>
        <EditorView
        currentData={props.currentData}
        currentPage={props.currentPage}
        currentPageName={props.currentPageName}
        pages={props.pages}
        puckUi={props.puckUi}
        showPreview={props.showPreview}
        showLeftSidebar={props.showLeftSidebar}
        showRightSidebar={props.showRightSidebar}
        showPageManager={props.showPageManager}
        onPublish={props.onPublish}
        onChange={props.onDataChange}
        onDataChange={props.setCurrentData}
        onPageSelect={props.loadPage}
        onAddPage={() => props.setShowPageCreationModal(true)}
        onManagePages={() => props.setShowPageManager(!props.showPageManager)}
        onNavigateToEditor={props.handleNavigateToEditor}
        onAddComponent={props.handleAddComponent}
        onPreviewToggle={() => props.setShowPreview(!props.showPreview)}
        onBack={props.handleBackToEditor}
        onCreatePageFromTemplate={props.createPageFromTemplate}
        onCreateNewPage={props.createNewPage}
      />
      </Suspense>
    </div>
  )
}

export default App
