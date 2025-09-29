import React from 'react'

interface GlobalNavbarProps {
  onCreateEvent?: () => void
  onProfileClick?: () => void
}

const GlobalNavbar = ({ 
  onCreateEvent = () => console.log('Create Event clicked'),
  onProfileClick = () => console.log('Profile clicked')
}: GlobalNavbarProps) => {
  const navbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    zIndex: 1000,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  }

  const logoStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  }

  const createEventButtonStyle: React.CSSProperties = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  }

  const profileIconStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    border: '2px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '18px'
  }

  return (
    <nav style={navbarStyle}>
      {/* Left: Website Logo */}
      <div style={logoStyle}>
        <span style={{ fontSize: '30px', fontWeight: 'bold' }}>←</span> Eventira
      </div>

      {/* Right: Create Event Button + Profile Icon */}
      <div style={rightSectionStyle}>
        <button
          style={createEventButtonStyle}
          onClick={onCreateEvent}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ➕ Create Event
        </button>
        
        <div
          style={profileIconStyle}
          onClick={onProfileClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}
        >
          👤
        </div>
      </div>
    </nav>
  )
}

export default GlobalNavbar
