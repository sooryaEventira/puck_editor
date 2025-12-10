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
  // Dynamic styles that need to remain inline
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding,
    borderRadius,
    border: `${borderWidth} solid ${borderColor}`,
    gap
  }

  return (
    <div style={containerStyle} className="grid grid-cols-1 md:grid-cols-2 my-4 max-w-full">
      {/* Left Section */}
      <div className="flex flex-col gap-3">
        <h3 style={{ color: titleColor }} className="text-lg font-bold m-0 flex items-center gap-2">
          {leftTitle}
        </h3>
        <p style={{ color: textColor }} className="text-sm leading-relaxed m-0">
          {leftContent}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-col gap-3">
        <h3 style={{ color: titleColor }} className="text-lg font-bold m-0 flex items-center gap-2">
          {rightTitle}
          {showRightIcon && (
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 bg-white rounded-sm relative"></div>
            </div>
          )}
        </h3>
        <p style={{ color: textColor }} className="text-sm leading-relaxed m-0">
          {rightContent}
        </p>
      </div>
    </div>
  )
}

export default TwoColumnContent
