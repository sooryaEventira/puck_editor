import React, { useEffect, useRef } from 'react'

interface CustomButtonFieldProps {
  name: string
  value?: string
  onChange?: (value: string) => void
  field?: any
  link?: string
  buttonText?: string
}

const CustomButtonField: React.FC<CustomButtonFieldProps> = ({
  link,
  buttonText = 'Navigate',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const enforceWhiteText = () => {
      if (buttonRef.current) {
        buttonRef.current.style.setProperty('color', '#FFFFFF', 'important')
        ;(buttonRef.current.style as any).setProperty('-webkit-text-fill-color', '#FFFFFF', 'important')
      }
      if (spanRef.current) {
        spanRef.current.style.setProperty('color', '#FFFFFF', 'important')
        ;(spanRef.current.style as any).setProperty('-webkit-text-fill-color', '#FFFFFF', 'important')
      }
    }
    
    enforceWhiteText()
    
    // Continuously enforce white text color in case Puck overrides it
    const interval = setInterval(enforceWhiteText, 100)
    
    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    if (link) {
      // Navigate to the link
      if (link.startsWith('http://') || link.startsWith('https://')) {
        // External link - open in new tab
        window.open(link, '_blank')
      } else {
        // Internal link - navigate in same window
        window.location.href = link
      }
    }
  }

  return (
    <>
      <style>{`
        button[data-custom-schedule-button],
        button[data-custom-schedule-button] *,
        button[data-custom-schedule-button] span {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
        }
      `}</style>
      <div className="w-full" style={{ display: 'inline-block' }}>
        <button
          ref={buttonRef}
          data-custom-schedule-button="true"
          type="button"
          onClick={handleClick}
          style={{
            width: '139px',
            height: '36px',
            paddingTop: '12px',
            paddingRight: '16px',
            paddingBottom: '12px',
            paddingLeft: '16px',
            backgroundColor: '#6938EF',
            color: '#FFFFFF',
            border: '2px solid #6938EF',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            opacity: 1,
            transition: 'background-color 0.2s, border-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.setProperty('background-color', '#5a2dd4', 'important')
            e.currentTarget.style.setProperty('border-color', '#5a2dd4', 'important')
            e.currentTarget.style.setProperty('color', '#FFFFFF', 'important')
            ;(e.currentTarget.style as any).setProperty('-webkit-text-fill-color', '#FFFFFF', 'important')
            if (spanRef.current) {
              spanRef.current.style.setProperty('color', '#FFFFFF', 'important')
              ;(spanRef.current.style as any).setProperty('-webkit-text-fill-color', '#FFFFFF', 'important')
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty('background-color', '#6938EF', 'important')
            e.currentTarget.style.setProperty('border-color', '#6938EF', 'important')
            e.currentTarget.style.setProperty('color', '#FFFFFF', 'important')
            ;(e.currentTarget.style as any).setProperty('-webkit-text-fill-color', '#FFFFFF', 'important')
            if (spanRef.current) {
              spanRef.current.style.setProperty('color', '#FFFFFF', 'important')
              ;(spanRef.current.style as any).setProperty('-webkit-text-fill-color', '#FFFFFF', 'important')
            }
          }}
        >
          <span 
            ref={spanRef}
            style={{ 
              color: '#FFFFFF',
              WebkitTextFillColor: '#FFFFFF' as any
            }}
          >
            {buttonText}
          </span>
        </button>
      </div>
    </>
  )
}

export default CustomButtonField
