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
  leftTitle = "About the Event",
  leftText = "We are dedicated to providing innovative solutions that help our clients achieve their goals and drive success in their respective industries.",
  rightTitle = "Sponsers",
  rightText = "To be the leading provider of cutting-edge technology solutions, empowering businesses to thrive in the digital age.",
  backgroundColor = "#ffffff",
  textColor = "#333333",
  padding = "3rem 2rem"
}) => {
  // Dynamic styles that need to remain inline
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .about-section-content {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
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
          @media (min-width: 1200px) {
            .about-section-content {
              gap: 4rem !important;
            }
          }
        `}
      </style>
      <section style={containerStyle} className="w-full min-h-[250px] about-section-container">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start about-section-content">
        <div className="flex flex-col gap-6 about-section-column">
          <h4 
            style={{ color: textColor }}
            className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold mb-4 leading-tight tracking-tight about-section-title"
            data-puck-field="leftTitle"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {leftTitle}
          </h4>
          
          <p 
            style={{ color: textColor, opacity: 0.8 }}
            className="text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed about-section-text"
            data-puck-field="leftText"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {leftText}
          </p>
        </div>
        
        <div className="flex flex-col gap-6 about-section-column">
          <h2 
            style={{ color: textColor }}
            className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold mb-4 leading-tight tracking-tight about-section-title"
            data-puck-field="rightTitle"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {rightTitle}
          </h2>
          
          <p 
            style={{ color: textColor, opacity: 0.8 }}
            className="text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed about-section-text"
            data-puck-field="rightText"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {rightText}
          </p>
        </div>
        </div>
      </section>
    </>
  )
}

export default AboutSection
