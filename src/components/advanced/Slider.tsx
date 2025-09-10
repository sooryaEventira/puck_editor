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

  const sliderStyle: React.CSSProperties = {
    position: 'relative',
    height: height,
    backgroundColor: backgroundColor,
    margin: '16px 0',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const slideStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    background: `linear-gradient(135deg, ${backgroundColor} 0%, #e9ecef 100%)`
  }

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  }

  const dotsStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 2
  }

  const dotStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }

  const activeDotStyle: React.CSSProperties = {
    ...dotStyle,
    backgroundColor: 'white'
  }

  if (slideList.length === 0) {
    return (
      <div style={sliderStyle}>
        <div style={slideStyle}>
          Add slide content (one per line)
        </div>
      </div>
    )
  }

  return (
    <div style={sliderStyle}>
      {/* Current Slide */}
      <div style={slideStyle}>
        {slideList[currentSlide] || 'No slides available'}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slideList.length > 1 && (
        <>
          <button 
            style={{ ...arrowStyle, left: '20px' }}
            onClick={prevSlide}
          >
            ‹
          </button>
          <button 
            style={{ ...arrowStyle, right: '20px' }}
            onClick={nextSlide}
          >
            ›
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slideList.length > 1 && (
        <div style={dotsStyle}>
          {slideList.map((_, index) => (
            <button
              key={index}
              style={index === currentSlide ? activeDotStyle : dotStyle}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Slider
