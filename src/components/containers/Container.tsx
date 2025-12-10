import { ContainerProps } from '../../types'

const Container = ({ children, backgroundColor = 'transparent', padding = '20px', layout = 'vertical', gap = '16px' }: ContainerProps) => {
  const layoutClasses: Record<string, string> = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row items-center',
    grid: 'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
    centered: 'flex flex-col items-center justify-center'
  }

  return (
    <div 
      style={{
        backgroundColor: backgroundColor,
        padding: padding,
        gap: gap,
        border: backgroundColor === 'transparent' ? '1px dashed #ccc' : 'none'
      }}
      className={`${layoutClasses[layout]} my-4 rounded-lg`}
    >
      {children}
    </div>
  )
}

export default Container
