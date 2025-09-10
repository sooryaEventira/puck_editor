// Type definitions for component props
export interface HeadingProps {
  text: string
  level?: 1 | 2 | 3 | 4
  color?: string
  align?: 'left' | 'center' | 'right' | 'justify'
}

export interface TextProps {
  text: string
  size?: string
  color?: string
  align?: 'left' | 'center' | 'right' | 'justify'
}

export interface ButtonProps {
  text: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'small' | 'medium' | 'large'
}

export interface CardProps {
  title: string
  description: string
  backgroundColor?: string
}

export interface ListProps {
  items: string
  type?: 'ul' | 'ol'
}

export interface DividerProps {
  color?: string
  thickness?: string
}

export interface SpacerProps {
  height?: string
}

export interface ContainerProps {
  children?: React.ReactNode
  backgroundColor?: string
  padding?: string
  layout?: 'vertical' | 'horizontal' | 'grid' | 'centered'
  gap?: string
}

export interface FlexContainerProps {
  children?: React.ReactNode
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'
  gap?: string
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
}

export interface GridContainerProps {
  children?: React.ReactNode
  columns?: number
  gap?: string
  rowGap?: string
}

export interface SimpleContainerProps {
  children?: React.ReactNode
  backgroundColor?: string
  padding?: string
}

export interface PositionedElementProps {
  children?: React.ReactNode
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  top?: string
  left?: string
  right?: string
  bottom?: string
  zIndex?: string
}

export interface HeroSectionProps {
  title: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundColor?: string
  textColor?: string
  backgroundImage?: string
  height?: string
  alignment?: 'left' | 'center' | 'right'
}

export interface SliderProps {
  slides: string
  autoplay?: boolean
  autoplaySpeed?: number
  showDots?: boolean
  showArrows?: boolean
  height?: string
  backgroundColor?: string
}

export interface ImageProps {
  src: string
  alt?: string
  width?: string
  height?: string
  borderRadius?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'
  alignment?: 'left' | 'center' | 'right'
  caption?: string
  showCaption?: boolean
  uploadedFile?: File | null
  uploadedImageUrl?: string
}

export interface Page {
  id: string
  name: string
  filename: string
  lastModified: string
}

export interface PageData {
  content: any[]
  root: { props: any }
  zones: any
}
