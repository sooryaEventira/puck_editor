import React from 'react'

interface RegistrationCTAProps {
  title?: string
  subtitle?: string
  buttonText?: string
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
  buttonBorderColor?: string
  onButtonClick?: () => void
}

const RegistrationCTA: React.FC<RegistrationCTAProps> = ({
  title = "Register now to enjoy exclusive benefits!",
  subtitle = "Don't miss out on this opportunity, join us today!",
  buttonText = "Register Now",
  backgroundColor = "#6938EF",
  textColor = "#ffffff",
  buttonColor = "#6938EF",
  buttonBorderColor = "#8b5cf6",
  onButtonClick
}) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: buttonColor,
    borderColor: buttonBorderColor
  }

  return (
    <section style={containerStyle} className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3" style={{ color: textColor }}>
          {title}
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90" style={{ color: textColor }}>
          {subtitle}
        </p>
        <button
          onClick={onButtonClick}
          style={buttonStyle}
          className="px-8 py-3 rounded-lg text-white font-semibold border-2 transition-colors hover:opacity-90"
        >
          {buttonText}
        </button>
      </div>
    </section>
  )
}

export default RegistrationCTA

