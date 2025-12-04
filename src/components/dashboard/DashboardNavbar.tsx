import React, { useState, useRef, useEffect } from 'react'
import { SearchLg, Bell01, User01 } from '@untitled-ui/icons-react'

interface DashboardNavbarProps {
  title?: string
  onSearchClick?: () => void
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onLogout?: () => void
  onNewEventClick?: () => void
  userAvatarUrl?: string
  userEmail?: string
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  title,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onLogout,
  onNewEventClick,
  userAvatarUrl,
  userEmail
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
    onProfileClick?.()
  }

  const handleLogout = () => {
    setIsProfileMenuOpen(false)
    onLogout?.()
  }

  return (
    <nav
      className="fixed top-0 left-[250px] right-0 z-50 h-16 bg-white border-b border-[#E9EAEB] flex items-center shadow-md"
    >
      <div className="w-full h-full max-w-[1280px] px-8 flex items-center justify-end mx-auto">
        <div className="flex items-center gap-3">
          {/* Icons Container */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button
              type="button"
              onClick={onSearchClick}
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <SearchLg 
                className="h-5 w-5" 
                style={{ color: '#A4A7AE', stroke: '#A4A7AE', fill: 'none' }}
              />
            </button>

            {/* Notification Icon */}
            <button
              type="button"
              onClick={onNotificationClick}
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell01 
                className="h-5 w-5" 
                style={{ color: '#A4A7AE', stroke: '#A4A7AE', fill: 'none' }}
              />
            </button>
          </div>

          {/* Profile Avatar with Dropdown */}
          <div className="relative flex flex-col items-start" ref={profileMenuRef}>
            <button
              type="button"
              onClick={handleProfileClick}
              className="w-10 h-10 rounded-full overflow-hidden border border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.12)] transition-colors"
              aria-label="Profile"
            >
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <User01 className="h-5 w-5 text-slate-500" />
                </div>
              )}
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-50">
                {/* User Info */}
                {userEmail && (
                  <div className="px-4 py-2 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900">{userEmail}</p>
                  </div>
                )}

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                      onProfileClick?.()
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User01 className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="border-t border-slate-200 py-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
