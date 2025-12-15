import React from 'react'
import SpeakerCard from './SpeakerCard'

interface Speaker {
  name: string
  title: string
  image: string
}

interface SpeakersSectionProps {
  speakers?: Speaker[]
  title?: string
  showTitle?: boolean
  backgroundColor?: string
  padding?: string
  gap?: string
  containerMaxWidth?: string
  containerPadding?: string
}

const SpeakersSection: React.FC<SpeakersSectionProps> = ({
  speakers = [],
  title = "Speakers",
  showTitle = true,
  backgroundColor = "#ffffff",
  padding = "0 2rem",
  gap = "2rem",
  containerMaxWidth = "max-w-7xl",
  containerPadding = "px-4 sm:px-6 lg:px-8 py-8"
}) => {
  return (
    <div className={`${containerMaxWidth} mx-auto ${containerPadding}`}>
      {showTitle && title && (
        <div className="mb-6">
          <h2 className="text-[24px] text-center font-bold text-slate-900">{title}</h2>
        </div>
      )}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[900px] mx-auto"
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
    </div>
  )
}

export default SpeakersSection
