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
        padding
      }}
      className="w-full"
    >

      {/* Speakers Grid */}
      <div 
        style={{ gap }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[1200px] mx-auto"
      >
        {speakers.map((speaker, index) => (
          <div key={index} className="w-full">
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
        <div className="text-center py-12 text-gray-500 text-lg">
          No speakers added yet. Add speakers using the properties panel.
        </div>
      )}
    </section>
  )
}

export default SpeakersSection
