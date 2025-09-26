import React from 'react'

export interface TwoColumnContentProps {
  leftTitle: string
  leftContent: string
  rightTitle: string
  rightContent: string
  showRightIcon?: boolean
  backgroundColor?: string
  textColor?: string
  titleColor?: string
  padding?: string
  gap?: string
  borderRadius?: string
  borderColor?: string
  borderWidth?: string
}

const TwoColumnContent = ({
  leftTitle = 'About the event',
  leftContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  rightTitle = 'Sponsor',
  rightContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  showRightIcon = true,
  backgroundColor = '#ffffff',
  textColor = '#000000',
  titleColor = '#000000',
  padding = '24px',
  gap = '32px',
  borderRadius = '8px',
  borderColor = '#e3f2fd',
  borderWidth = '1px'
}: TwoColumnContentProps) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding,
    borderRadius,
    border: `${borderWidth} solid ${borderColor}`,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap,
    margin: '16px 0',
    maxWidth: '100%'
  }

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: titleColor,
    margin: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  const contentStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: textColor,
    margin: '0'
  }

  const iconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    backgroundColor: '#2196f3',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }

  const iconInnerStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    backgroundColor: 'white',
    borderRadius: '2px',
    position: 'relative'
  }

  return (
    <div style={containerStyle}>
      {/* Left Section */}
      <div style={sectionStyle}>
        <h3 style={titleStyle}>
          {leftTitle}
        </h3>
        <p style={contentStyle}>
          {leftContent}
        </p>
      </div>

      {/* Right Section */}
      <div style={sectionStyle}>
        <h3 style={titleStyle}>
          {rightTitle}
          {showRightIcon && (
            <div style={iconStyle}>
              <div style={iconInnerStyle}></div>
            </div>
          )}
        </h3>
        <p style={contentStyle}>
          {rightContent}
        </p>
      </div>
    </div>
  )
}

export default TwoColumnContent
