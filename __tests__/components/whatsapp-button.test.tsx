import { render, screen, fireEvent } from '@testing-library/react'
import { WhatsAppButton } from '@/components/whatsapp-button'

// Mock window.open
const mockOpen = jest.fn()
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
})

describe('WhatsAppButton', () => {
  beforeEach(() => {
    mockOpen.mockClear()
  })

  it('renders with default props', () => {
    render(<WhatsAppButton phoneNumber="+1234567890" />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('WhatsApp')
    expect(button).toHaveClass('bg-green-600', 'hover:bg-green-700')
  })

  it('renders with custom phone number', () => {
    render(<WhatsAppButton phoneNumber="+9876543210" />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<WhatsAppButton phoneNumber="+1234567890" className="custom-class" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<WhatsAppButton phoneNumber="+1234567890" variant="default" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-green-600', 'hover:bg-green-700')

    rerender(<WhatsAppButton phoneNumber="+1234567890" variant="outline" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-transparent', 'hover:bg-green-50', 'text-green-700')

    rerender(<WhatsAppButton phoneNumber="+1234567890" variant="ghost" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-transparent', 'hover:bg-green-50', 'text-green-700')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<WhatsAppButton phoneNumber="+1234567890" size="sm" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-9', 'px-3', 'text-sm')

    rerender(<WhatsAppButton phoneNumber="+1234567890" size="md" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-11', 'px-4', 'text-base')

    rerender(<WhatsAppButton phoneNumber="+1234567890" size="lg" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-14', 'px-6', 'text-lg')
  })

  it('handles click events and opens WhatsApp', () => {
    render(<WhatsAppButton phoneNumber="+1234567890" />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOpen).toHaveBeenCalledWith(
      'https://wa.me/+1234567890?text=Hi!%20I\'m%20interested%20in%20learning%20more%20about%20your%20vehicles.',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('has proper accessibility attributes', () => {
    render(<WhatsAppButton phoneNumber="+1234567890" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Contact via WhatsApp at +1234567890')
  })

  it('renders with phone icon', () => {
    render(<WhatsAppButton phoneNumber="+1234567890" />)
    
    const icon = screen.getByTestId('phone-icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('mr-2', 'h-4', 'w-4')
  })

  it('combines multiple props correctly', () => {
    render(
      <WhatsAppButton 
        phoneNumber="+1234567890" 
        variant="outline" 
        size="lg" 
        className="custom-class"
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('bg-transparent', 'hover:bg-green-50', 'text-green-700')
    expect(button).toHaveClass('h-14', 'px-6', 'text-lg')
  })

  it('handles different phone number formats', () => {
    const { rerender } = render(<WhatsAppButton phoneNumber="1234567890" />)
    let button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockOpen).toHaveBeenCalledWith(
      'https://wa.me/1234567890?text=Hi!%20I\'m%20interested%20in%20learning%20more%20about%20your%20vehicles.',
      '_blank',
      'noopener,noreferrer'
    )

    mockOpen.mockClear()
    rerender(<WhatsAppButton phoneNumber="+1-234-567-8900" />)
    button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockOpen).toHaveBeenCalledWith(
      'https://wa.me/+1-234-567-8900?text=Hi!%20I\'m%20interested%20in%20learning%20more%20about%20your%20vehicles.',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('applies hover and active states', () => {
    render(<WhatsAppButton phoneNumber="+1234567890" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-green-700', 'active:scale-95')
  })

  it('handles undefined and null props gracefully', () => {
    const { rerender } = render(<WhatsAppButton phoneNumber="+1234567890" className={undefined} />)
    let button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    rerender(<WhatsAppButton phoneNumber="+1234567890" className={null} />)
    button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})
