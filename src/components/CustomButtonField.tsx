import React, { useEffect, useRef } from 'react'

const BUTTON_CLASSES =
  'inline-flex items-center justify-center gap-1 overflow-hidden rounded-lg border-2 border-transparent bg-primary px-3 py-2 text-sm font-semibold text-white leading-5 shadow-[0px_1px_2px_rgba(10,13,18,0.05),inset_0px_-2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 transition-colors duration-200 hover:bg-[#5a2dd4] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'

interface CustomButtonFieldProps {
  name?: string
  value?: string
  onChange?: (value: string) => void
  field?: any
  link?: string
  buttonText?: string
  onClick?: () => void
}

const CustomButtonField: React.FC<CustomButtonFieldProps> = ({
  link,
  buttonText = 'Navigate',
  onClick,
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
    if (onClick) {
      onClick()
    } else if (link) {
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
      <div className="inline-block w-full">
        <button
          ref={buttonRef}
          data-custom-schedule-button="true"
          type="button"
          onClick={handleClick}
          className={BUTTON_CLASSES}
        >
          <span
            ref={spanRef}
            className="font-['Inter'] text-sm font-semibold leading-5 text-white"
          >
            {buttonText}
          </span>
        </button>
      </div>
    </>
  )
}

export default CustomButtonField
