import React from 'react'

interface AboutSectionProps {
  leftTitle?: string
  leftText?: string
  rightTitle?: string
  rightText?: string
  backgroundColor?: string
  textColor?: string
  padding?: string
}

const AboutSection: React.FC<AboutSectionProps> = ({
  leftTitle = "About Event",
  leftText = "We are dedicated to providing innovative solutions that help our clients achieve their goals and drive success in their respective industries.",
  rightTitle,
  rightText,
  backgroundColor = "#ffffff",
  textColor = "#333333",
  padding = "3rem 2rem"
}) => {
  // Only keep dynamic styles that can't be expressed in Tailwind
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding
  }

  const titleStyle: React.CSSProperties = {
    color: textColor
  }

  const textStyle: React.CSSProperties = {
    color: textColor
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .about-section-container {
              padding: 2rem 1rem !important;
            }
            .about-section-column {
              gap: 1rem !important;
            }
          }
          @media (max-width: 480px) {
            .about-section-container {
              padding: 1.5rem 1rem !important;
            }
            .about-section-title {
              font-size: 1.125rem !important;
              margin-bottom: 0.75rem !important;
            }
            .about-section-text {
              font-size: 0.9rem !important;
              line-height: 1.6 !important;
            }
          }
        `}
      </style>
      <section style={containerStyle} className="w-full min-h-[250px] about-section-container">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-6 about-section-column">
            <h2 
              style={titleStyle}
              className="text-[24px] text-center font-bold mb-4 leading-tight tracking-tight about-section-title"
              data-puck-field="leftTitle"
              contentEditable
              suppressContentEditableWarning={true}
            >
              {leftTitle}
            </h2>
            
            <p 
              style={textStyle}
              className="text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed about-section-text max-w-3xl opacity-80"
              data-puck-field="leftText"
              contentEditable
              suppressContentEditableWarning={true}
            >
              {leftText}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutSection
