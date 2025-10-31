import React from 'react'
import { ArrowNarrowLeft, SearchLg, Bell01, User01 } from '@untitled-ui/icons-react'

interface EventHubNavbarProps {
  eventName?: string
  isDraft?: boolean
  onBackClick?: () => void
  onSearchClick?: () => void
  onNotificationClick?: () => void
  onProfileClick?: () => void
  userAvatarUrl?: string
}

const EventHubNavbar: React.FC<EventHubNavbarProps> = ({
  eventName = 'Highly important conference of 2025',
  isDraft = true,
  onBackClick,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  userAvatarUrl
}) => {
  return (
    <nav style={{
      height: '64px',
      backgroundColor: '#1e1b4b', // Brand/950 - Darkest purple/indigo shade
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      color: 'white' // Set default text color to white for all children
    }}>
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'white' }}>
         {/* Back Arrow */}
         <button
           onClick={onBackClick}
           style={{
             background: 'none',
             border: 'none',
             color: 'white',
             cursor: 'pointer',
             padding: '8px',
             display: 'flex',
             alignItems: 'center',
             transition: 'opacity 0.2s'
           }}
           onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
           onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
         >
           <span style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
             <ArrowNarrowLeft width={20} height={20} />
           </span>
         </button>

        {/* Vertical Divider */}
        <div style={{
          width: '1px',
          height: '28px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          marginLeft: '4px',
          marginRight: '4px'
        }} />

        {/* Event Name */}
        <span style={{
          color: 'white',
          fontSize: '16px',
          fontWeight: '500',
          WebkitTextFillColor: 'white'
        }}>
          {eventName}
        </span>

        {/* Draft Badge */}
        {isDraft && (
          <span style={{
            backgroundColor: 'white', // White background
            color: '#1f2937', // Black/dark gray text
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            Draft
          </span>
        )}
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
         {/* Search Icon */}
         <button
           onClick={onSearchClick}
           style={{
             background: 'none',
             border: 'none',
             color: 'white',
             cursor: 'pointer',
             padding: '8px',
             display: 'flex',
             alignItems: 'center',
             transition: 'opacity 0.2s'
           }}
           onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
           onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
         >
           <span style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
             <SearchLg width={20} height={20} />
           </span>
         </button>

         {/* Notification Bell */}
         <button
           onClick={onNotificationClick}
           style={{
             background: 'none',
             border: 'none',
             color: 'white',
             cursor: 'pointer',
             padding: '8px',
             display: 'flex',
             alignItems: 'center',
             transition: 'opacity 0.2s',
             position: 'relative'
           }}
           onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
           onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
         >
           <span style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
             <Bell01 width={20} height={20} />
           </span>
         </button>

        {/* User Avatar */}
        <button
          onClick={onProfileClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {userAvatarUrl ? (
            <img
              src={userAvatarUrl}
              alt="User Profile"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid white'
              }}
            />
           ) : (
             <div style={{
               width: '36px',
               height: '36px',
               borderRadius: '50%',
               backgroundColor: '#a78bfa',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               color: 'white',
               fontWeight: '600',
               border: '2px solid white'
             }}>
               <span style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                 <User01 width={18} height={18} />
               </span>
             </div>
           )}
        </button>
      </div>
    </nav>
  )
}

export default EventHubNavbar

