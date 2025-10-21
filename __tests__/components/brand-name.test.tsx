import { render, screen } from '@testing-library/react'
import { BrandName } from '@/components/brand-name'

describe('BrandName', () => {
  it('renders with default styling', () => {
    render(<BrandName />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toBeInTheDocument()
    expect(brandElement).toHaveClass('font-bold', 'tracking-tight')
  })

  it('renders with custom className', () => {
    render(<BrandName className="custom-class" />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toHaveClass('custom-class', 'font-bold', 'tracking-tight')
  })

  it('renders with additional props', () => {
    render(<BrandName data-testid="brand-name" />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toBeInTheDocument()
    expect(brandElement).toHaveTextContent('AM Tycoons Inc.')
  })

  it('combines custom and default classes correctly', () => {
    render(<BrandName className="text-blue-600" />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toHaveClass('text-blue-600', 'font-bold', 'tracking-tight')
  })

  it('renders without breaking with empty className', () => {
    render(<BrandName className="" />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toBeInTheDocument()
    expect(brandElement).toHaveClass('font-bold', 'tracking-tight')
  })

  it('renders with undefined className', () => {
    render(<BrandName className={undefined} />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toBeInTheDocument()
    expect(brandElement).toHaveClass('font-bold', 'tracking-tight')
  })

  it('trims whitespace from className', () => {
    render(<BrandName className="  custom-class  " />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toHaveClass('custom-class', 'font-bold', 'tracking-tight')
  })

  it('handles null className gracefully', () => {
    render(<BrandName className={null as any} />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toBeInTheDocument()
    expect(brandElement).toHaveClass('font-bold', 'tracking-tight')
  })

  it('handles multiple custom classes', () => {
    render(<BrandName className="text-xl text-blue-600 underline" />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toHaveClass('text-xl', 'text-blue-600', 'underline', 'font-bold', 'tracking-tight')
  })

  it('maintains brand text content', () => {
    render(<BrandName className="any-class" />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement).toHaveTextContent('AM Tycoons Inc.')
  })

  it('renders as span element by default', () => {
    render(<BrandName />)
    const brandElement = screen.getByText('AM Tycoons Inc.')
    expect(brandElement.tagName).toBe('SPAN')
  })
})
