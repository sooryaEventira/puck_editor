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
          .about-section-text {
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            hyphens: auto;
          }
          .about-section-title {
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
          }
          @media (max-width: 768px) {
            .about-section-container {
              padding: 2rem 1rem !important;
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
      <section style={containerStyle} className="w-full min-h-[250px] about-section-container overflow-hidden">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center text-center gap-6 px-4">
          <h2 
            style={titleStyle}
            className="text-[24px] font-bold leading-tight tracking-tight about-section-title break-words"
            data-puck-field="leftTitle"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {leftTitle}
          </h2>
          
          <p 
            style={textStyle}
            className="text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed about-section-text max-w-3xl opacity-80 mx-auto break-words overflow-wrap-anywhere"
            data-puck-field="leftText"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {leftText}
          </p>
        </div>
      </section>
    </>
  )
}

export default AboutSection
