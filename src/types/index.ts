import React from 'react'

// Type definitions for component props
export interface HeadingProps {
  text: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'XXXL' | 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS'
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
  textColor?: string
}

export interface CardProps {
  title: string
  description: string
  backgroundColor?: string
  titleColor?: string
  textColor?: string
}

export interface ListProps {
  items: string
  type?: 'ul' | 'ol'
  textColor?: string
}

export interface DividerProps {
  color?: string
  thickness?: string
}

export interface SpacerProps {
  height?: string
}

export interface CheckboxProps {
  label: string
  checked?: boolean | string
  onChange?: (checked: boolean) => void
  disabled?: boolean | string
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'primary' | 'success'
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

export interface HeroButton {
  text: string
  link: string
  color: string
  textColor: string
  size: 'small' | 'medium' | 'large'
}

export interface HeroSectionProps {
  title: string
  subtitle?: string
  buttons?: HeroButton[]
  backgroundColor?: string
  textColor?: string
  backgroundImage?: string
  height?: string
  alignment?: 'left' | 'center' | 'right'
  overlayOpacity?: number
  titleSize?: string
  subtitleSize?: string
  buttonSpacing?: string
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

export interface TwoColumnContentProps {
  leftTitle: string
  leftContent: string
  rightTitle: string
  rightContent: string
  showRightIcon?: boolean
  backgroundColor?: string
  textColor?: string
  titleColor?: string
  padding?: string
  gap?: string
  borderRadius?: string
  borderColor?: string
  borderWidth?: string
}

export interface SpeakerCardProps {
  photo: string | React.ReactElement
  uploadedImage: string | React.ReactElement
  name: string | React.ReactElement
  designation: string | React.ReactElement
}

export interface NavigationProps {
  logo: string | React.ReactElement
  logoText: string | React.ReactElement
  menuItems: string | React.ReactElement
  backgroundColor?: string
  textColor?: string
  logoColor?: string
  linkColor?: string
  hoverColor?: string
  padding?: string
  alignment?: 'left' | 'center' | 'right'
}

export interface HeroVideoProps {
  videoUrl: string | React.ReactElement
  title: string | React.ReactElement
  subtitle: string | React.ReactElement
  buttonText: string | React.ReactElement
  buttonLink: string | React.ReactElement
  backgroundColor?: string
  textColor?: string
  titleSize?: 'XXXL' | 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS'
  subtitleSize?: 'XL' | 'L' | 'M' | 'S' | 'XS'
  buttonColor?: string
  buttonTextColor?: string
  buttonSize?: 'small' | 'medium' | 'large'
  overlayOpacity?: number
  alignment?: 'left' | 'center' | 'right'
  height?: string
}

export interface CountdownTimerProps {
  heading: string | React.ReactElement
  targetDate: string | React.ReactElement
}

export interface ProgressItem {
  value: number
  color: string
  caption: string | React.ReactElement
}

export interface ProgressCircleStatsProps {
  items: ProgressItem[]
}

export interface Page {
  id: string
  name: string
  filename: string
  lastModified: string
}

export interface PageData {
  content: any[]
  root: { 
    [x: string]: any
    readOnly?: { [x: string]: boolean | undefined; [x: number]: boolean | undefined } | undefined
    props?: { [x: string]: any; [x: number]: any } | undefined
    title?: string | undefined
  }
  zones: any
}
