import React from 'react'

interface Sponsor {
  id: string
  name: string
  logo?: string
  logoUrl?: string
}

interface SponsorsProps {
  title?: string
  sponsors?: Sponsor[]
  backgroundColor?: string
  textColor?: string
  padding?: string
}

const Sponsors: React.FC<SponsorsProps> = ({
  title = "Our Sponsors",
  sponsors = [
    { id: '1', name: 'Sponsor 1', logoUrl: '' },
    { id: '2', name: 'Sponsor 2', logoUrl: '' },
    { id: '3', name: 'Sponsor 3', logoUrl: '' },
    { id: '4', name: 'Sponsor 4', logoUrl: '' }
  ],
  backgroundColor = "#ffffff",
  textColor = "#1f2937",
  padding = "3rem 2rem"
}) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding
  }

  // Default placeholder logos (matching the image description)
  const getDefaultLogo = (index: number) => {
    const logos = [
      // Gray hexagon with O
      <div key="1" className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-400 rounded-full"></div>
      </div>,
      // Red square with E
      <div key="2" className="w-32 h-32 bg-red-600 rounded-lg flex items-center justify-center">
        <div className="text-white text-4xl font-bold">E</div>
      </div>,
      // Blue square with FR
      <div key="3" className="w-32 h-32 bg-blue-600 rounded-lg flex items-center justify-center">
        <div className="text-white text-2xl font-bold">FR</div>
      </div>,
      // Green square with Z
      <div key="4" className="w-32 h-32 bg-green-600 rounded-lg flex items-center justify-center">
        <div className="text-white text-4xl font-bold">Z</div>
      </div>
    ]
    return logos[index % logos.length]
  }

  return (
    <section style={containerStyle} className="w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[24px] md:text-[24px] font-bold mb-8 text-center" style={{ color: textColor }}>
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {sponsors.map((sponsor, index) => (
            <div key={sponsor.id} className="flex items-center justify-center">
              {sponsor.logoUrl || sponsor.logo ? (
                <img
                  src={sponsor.logoUrl || sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-32 object-contain"
                  onError={(e) => {
                    // Hide image and show placeholder instead
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : null}
              {(!sponsor.logoUrl && !sponsor.logo) && getDefaultLogo(index)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Sponsors

