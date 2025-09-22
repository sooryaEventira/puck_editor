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
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding,
    width: '100%',
    minHeight: '250px'
  }

  const contentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    alignItems: 'start'
  }

  const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    fontWeight: '600',
    marginBottom: '1rem',
    color: textColor,
    lineHeight: '1.2',
    letterSpacing: '-0.01em'
  }

  const textStyle: React.CSSProperties = {
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    lineHeight: '1.7',
    color: textColor,
    opacity: 0.8
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
      <section style={containerStyle} className="about-section-container">
        <div style={contentStyle} className="about-section-content">
        <div style={columnStyle} className="about-section-column">
          <h4 
            style={titleStyle}
            className="about-section-title"
            data-puck-field="leftTitle"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {leftTitle}
          </h4>
          
          <p 
            style={textStyle}
            className="about-section-text"
            data-puck-field="leftText"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {leftText}
          </p>
        </div>
        
        <div style={columnStyle} className="about-section-column">
          <h2 
            style={titleStyle}
            className="about-section-title"
            data-puck-field="rightTitle"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {rightTitle}
          </h2>
          
          <p 
            style={textStyle}
            className="about-section-text"
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
