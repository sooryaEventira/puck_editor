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
import { verifyRegistrationOtp, createPassword, createOrganization, signin, getUserOrganizations } from '../services/authService'

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
    const authState = localStorage.getItem('isAuthenticated') === 'true'
    const accessToken = localStorage.getItem('accessToken')
    
    // Log authentication state on app mount
    console.log('🚀 [App] Application starting - Authentication check:', {
      isAuthenticated: authState,
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length || 0,
      hasRefreshToken: !!localStorage.getItem('refreshToken'),
      hasOrganization: !!localStorage.getItem('organizationUuid'),
      userEmail: localStorage.getItem('userEmail') || 'not set'
    })
    
    if (authState && !accessToken) {
      console.warn('⚠️ [App] WARNING: isAuthenticated is true but no accessToken found! This is an invalid state.')
    } else if (authState && accessToken) {
      console.log('✅ [App] User is authenticated and ready to use the app')
    } else {
      console.log('ℹ️ [App] User is not authenticated - login required')
    }
    
    return authState
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


  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('🔐 [App] Starting login process...')
      
      // Call the signin API
      const response = await signin(email, password)
      
      console.log('🔐 [App] Signin response received:', response)
      
      // Check if signin was successful
      if (response.status === 'success' && response.data) {
        // Store tokens and user data (already done in authService, but ensure state is updated)
        const { access, refresh, user, organization } = response.data
        
        if (access) {
          localStorage.setItem('accessToken', access)
          console.log('✅ [App] Access token stored')
        }
        if (refresh) {
          localStorage.setItem('refreshToken', refresh)
          console.log('✅ [App] Refresh token stored')
        }
        if (user?.email) {
          localStorage.setItem('userEmail', user.email)
          console.log('✅ [App] User email stored:', user.email)
        }
        
        // Check if organization is already in localStorage (from signin function)
        let storedOrgUuid = localStorage.getItem('organizationUuid')
        
        // Check if organization is in signin response
        if (organization?.uuid) {
          localStorage.setItem('organizationUuid', organization.uuid)
          localStorage.setItem('organizationName', organization.name)
          storedOrgUuid = organization.uuid
          console.log('✅ [App] Organization from signin response:', {
            uuid: organization.uuid,
            name: organization.name
          })
        }
        
        // If still no organization, try to fetch user's organizations
        if (!storedOrgUuid) {
          try {
            console.log('🔍 [App] No organization found, fetching user organizations...')
            const organizations = await getUserOrganizations()
            console.log('📋 [App] Organizations fetched:', organizations)
            if (organizations && organizations.length > 0) {
              const userOrg = organizations[0] // Use first organization
              localStorage.setItem('organizationUuid', userOrg.uuid)
              localStorage.setItem('organizationName', userOrg.name)
              storedOrgUuid = userOrg.uuid
              console.log('✅ [App] Organization fetched and stored:', {
                uuid: userOrg.uuid,
                name: userOrg.name
              })
            } else {
              console.warn('⚠️ [App] User has no organizations. They may need to create one.')
            }
          } catch (orgError) {
            console.error('❌ [App] Could not fetch organizations:', orgError)
            // Continue without organization - user might need to create one
          }
        }
        
        // Log final organization state
        console.log('🏢 [App] Final organization state:', {
          hasOrganizationUuid: !!localStorage.getItem('organizationUuid'),
          organizationUuid: localStorage.getItem('organizationUuid') || 'not set',
          organizationName: localStorage.getItem('organizationName') || 'not set'
        })
        
        // Set authenticated state
        localStorage.setItem('isAuthenticated', 'true')
        setIsAuthenticated(true)
        
        // Navigate to dashboard
        setCurrentView('dashboard')
        window.history.pushState({}, '', '/dashboard')
        console.log('✅ [App] Login successful, navigating to dashboard')
      } else {
        // Signin failed - error already shown by authService
        console.error('❌ [App] Login failed:', response)
      }
    } catch (error) {
      // Error is already handled in authService with toast
      console.error('❌ [App] Login error:', error)
      // Don't set authenticated state on error
    }
  }

  // Handle registration
  const handleRegistration = (email: string) => {
    // TODO: Implement actual registration logic (send OTP email)
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
      console.log('🔐 [App] Password created successfully, storing tokens...')
      if (response.data) {
        const { access, refresh, user } = response.data
        if (access) {
          localStorage.setItem('accessToken', access)
          console.log('✅ [App] Access token stored:', {
            length: access.length,
            preview: `${access.substring(0, 20)}...`
          })
        } else {
          console.warn('⚠️ [App] No access token in response')
        }
        if (refresh) {
          localStorage.setItem('refreshToken', refresh)
          console.log('✅ [App] Refresh token stored')
        }
        
        // Store user data
        if (user?.email) {
          localStorage.setItem('userEmail', user.email)
          console.log('✅ [App] User email stored:', user.email)
        }
      } else {
        console.warn('⚠️ [App] No data in response')
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
      console.log('🏢 [App] Organization created, storing data...')
      if (organization.uuid) {
        localStorage.setItem('organizationUuid', organization.uuid)
        localStorage.setItem('organizationName', organization.name)
        console.log('✅ [App] Organization data stored:', {
          uuid: organization.uuid,
          name: organization.name
        })
      }
      
      // Complete setup and authenticate user
      // Set authentication state first
      console.log('✅ [App] Authentication complete! Setting authenticated state...')
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      
      // Verify authentication state
      const accessToken = localStorage.getItem('accessToken')
      console.log('🔍 [App] Final authentication check:', {
        isAuthenticated: true,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!localStorage.getItem('refreshToken'),
        hasOrganization: !!organization.uuid,
        userEmail: localStorage.getItem('userEmail')
      })
      
      // Hide eventspace setup page
      setShowEventspaceSetup(false)
      
      // Navigate to dashboard
      setCurrentView('dashboard')
      
      // Show success message
      showToast.success('Organization created successfully!')
      
      logger.debug('✅ Organization created, navigating to dashboard')
      console.log('🎉 [App] User fully authenticated and ready to use the app!')
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
    
    // Redirect to login page
    window.history.pushState({}, '', '/login')
    console.log('🚪 [App] User logged out, redirected to /login')
    
    // Show logout confirmation
    showToast.success('Logged out successfully')
  }

  // Handle social sign-in (placeholder)
  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.warn('⚠️ [App] Google sign-in is not yet implemented. Please use email registration/login.')
    showToast.error('Google sign-in is not yet implemented. Please use email registration.')
    // Don't set authenticated state without a token
  }

  const handleMicrosoftSignIn = () => {
    // TODO: Implement Microsoft OAuth
    console.warn('⚠️ [App] Microsoft sign-in is not yet implemented. Please use email registration/login.')
    showToast.error('Microsoft sign-in is not yet implemented. Please use email registration.')
    // Don't set authenticated state without a token
  }

  const handleMagicLinkSignIn = () => {
    // TODO: Implement magic link authentication
  }

  // Apply Puck styling when not in preview mode
  useEffect(() => {
    if (!showPreview && isAuthenticated) {
      return setupPuckStyling()
    }
  }, [showPreview, isAuthenticated])

  // Log when authentication state changes
  useEffect(() => {
    console.log('🔐 [App] Authentication state changed:', {
      isAuthenticated,
      hasAccessToken: !!localStorage.getItem('accessToken'),
      currentView
    })
  }, [isAuthenticated, currentView])

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

  // Fetch organization on mount if authenticated but missing
  useEffect(() => {
    const fetchOrgIfNeeded = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const organizationUuid = localStorage.getItem('organizationUuid')
      
      if (isAuthenticated && accessToken && !organizationUuid) {
        try {
          console.log('🔍 [App] Fetching organization on mount...')
          const organizations = await getUserOrganizations()
          console.log('📋 [App] Organizations fetched on mount:', organizations)
          if (organizations && organizations.length > 0) {
            const userOrg = organizations[0]
            localStorage.setItem('organizationUuid', userOrg.uuid)
            localStorage.setItem('organizationName', userOrg.name)
            console.log('✅ [App] Organization fetched and stored on mount:', {
              uuid: userOrg.uuid,
              name: userOrg.name
            })
          } else {
            console.warn('⚠️ [App] User has no organizations on mount.')
          }
        } catch (error) {
          console.error('❌ [App] Could not fetch organization on mount:', error)
        }
      }
    }
    
    fetchOrgIfNeeded()
  }, [isAuthenticated])

  // Handle URL routing - check pathname and update URL accordingly
  useEffect(() => {
    const path = window.location.pathname
    const hasAccessToken = !!localStorage.getItem('accessToken')
    
    // Check if authentication state is valid (must have token if authenticated)
    const isValidAuth = isAuthenticated && hasAccessToken
    
    // If user is not authenticated or doesn't have a token
    if (!isValidAuth) {
      // Clear invalid authentication state
      if (isAuthenticated && !hasAccessToken) {
        console.warn('⚠️ [App] Invalid auth state detected - isAuthenticated is true but no token. Clearing state.')
        setIsAuthenticated(false)
        localStorage.removeItem('isAuthenticated')
        // Reset view to dashboard (will be overridden by login page)
        setCurrentView('dashboard')
      }
      
      // If showing registration or other auth flows, update URL accordingly
      if (showRegistration && path !== '/register') {
        window.history.pushState({}, '', '/register')
        console.log('📍 [App] Updated URL to /register')
      } else if (!showRegistration && !showEmailVerification && !showCreatePassword && !showEventspaceSetup) {
        // Not showing any auth flow, ensure we're on /login
        if (path !== '/login') {
          window.history.pushState({}, '', '/login')
          console.log('📍 [App] Redirecting to /login - user not authenticated or missing token')
        }
      }
    } else {
      // User is authenticated and has token
      // If on /login or /register, redirect to dashboard
      if (path === '/login' || path === '/register') {
        window.history.pushState({}, '', '/dashboard')
        setCurrentView('dashboard')
        console.log('📍 [App] Redirecting authenticated user from /login to /dashboard')
      }
    }
  }, [isAuthenticated, showRegistration, showEmailVerification, showCreatePassword, showEventspaceSetup])

  // Show login, registration, email verification, password creation, or eventspace setup page if not authenticated
  if (!isAuthenticated) {
    if (showEventspaceSetup) {
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
            onAlreadyHaveAccount={() => {
              setShowRegistration(false)
              window.history.pushState({}, '', '/login')
              console.log('📍 [App] Navigating back to login page')
            }}
            onClose={() => {
              setShowRegistration(false)
              window.history.pushState({}, '', '/login')
            }}
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
          onNavigateToRegistration={() => {
            setShowRegistration(true)
            window.history.pushState({}, '', '/register')
            console.log('📍 [App] Navigating to registration page')
          }}
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
          onBackClick={handleBackToEditor}
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
