import React from 'react'
import SpeakerCard from './SpeakerCard'

interface Speaker {
  name: string
  title: string
  image: string
}

interface SpeakersSectionProps {
  speakers: Speaker[]
  backgroundColor?: string
  padding?: string
  gap?: string
}

const SpeakersSection: React.FC<SpeakersSectionProps> = ({
  speakers = [],
  backgroundColor = "#ffffff",
  padding = "2rem",
  gap = "2rem"
}) => {
  return (
    <section 
      style={{ 
        backgroundColor,
        padding,
        width: '100%'
      }}
    >

      {/* Speakers Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: gap,
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {speakers.map((speaker, index) => (
          <div key={index} style={{ width: '100%' }}>
            <SpeakerCard
              name={speaker.name}
              designation={speaker.title}
              photo={speaker.image}
              uploadedImage=""
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {speakers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280',
          fontSize: '1.125rem'
        }}>
          No speakers added yet. Add speakers using the properties panel.
        </div>
      )}
    </section>
  )
}

export default SpeakersSection
