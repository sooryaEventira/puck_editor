import React from 'react'
import { SliderProps } from '../../types'

const Slider = ({ 
  slides, 
  autoplay = true, 
  autoplaySpeed = 3000, 
  showDots = true, 
  showArrows = true,
  height = '400px',
  backgroundColor = '#f8f9fa'
}: SliderProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const slideList = slides.split('\n').filter(slide => slide.trim())
  
  React.useEffect(() => {
    if (autoplay && slideList.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideList.length)
      }, autoplaySpeed)
      return () => clearInterval(interval)
    }
  }, [autoplay, autoplaySpeed, slideList.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideList.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideList.length) % slideList.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Dynamic styles that need to remain inline
  const sliderStyle: React.CSSProperties = {
    height: height,
    backgroundColor: backgroundColor
  }

  const slideStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${backgroundColor} 0%, #e9ecef 100%)`
  }

  if (slideList.length === 0) {
    return (
      <div style={sliderStyle} className="relative my-4 rounded-lg overflow-hidden flex items-center justify-center">
        <div style={slideStyle} className="w-full h-full flex items-center justify-center p-10 text-center text-2xl font-bold text-gray-800">
          Add slide content (one per line)
        </div>
      </div>
    )
  }

  return (
    <div style={sliderStyle} className="relative my-4 rounded-lg overflow-hidden flex items-center justify-center">
      {/* Current Slide */}
      <div style={slideStyle} className="w-full h-full flex items-center justify-center p-10 text-center text-2xl font-bold text-gray-800">
        {slideList[currentSlide] || 'No slides available'}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slideList.length > 1 && (
        <>
          <button 
            className="absolute top-1/2 -translate-y-1/2 left-5 bg-black/50 text-white border-none rounded-full w-10 h-10 cursor-pointer text-lg flex items-center justify-center z-[2] hover:bg-black/70 transition-colors"
            onClick={prevSlide}
          >
            ‹
          </button>
          <button 
            className="absolute top-1/2 -translate-y-1/2 right-5 bg-black/50 text-white border-none rounded-full w-10 h-10 cursor-pointer text-lg flex items-center justify-center z-[2] hover:bg-black/70 transition-colors"
            onClick={nextSlide}
          >
            ›
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slideList.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-[2]">
          {slideList.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Slider
