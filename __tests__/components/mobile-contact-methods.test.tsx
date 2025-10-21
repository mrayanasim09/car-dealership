import { render, screen, fireEvent } from '@testing-library/react'
import { MobileContactMethods } from '@/components/mobile-contact-methods'

// Mock window.open for external links
const mockOpen = jest.fn()
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
})

describe('MobileContactMethods', () => {
  beforeEach(() => {
    mockOpen.mockClear()
  })

  it('renders with default props', () => {
    render(<MobileContactMethods />)
    
    expect(screen.getByText('Call Now')).toBeInTheDocument()
    expect(screen.getByText('SMS')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Directions')).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<MobileContactMethods className="custom-class" />)
    
    const container = screen.getByText('Call Now').closest('div')
    expect(container).toHaveClass('custom-class')
  })

  it('renders with showLabels=false', () => {
    render(<MobileContactMethods showLabels={false} />)
    
    expect(screen.queryByText('Call Now')).not.toBeInTheDocument()
    expect(screen.queryByText('SMS')).not.toBeInTheDocument()
    expect(screen.queryByText('WhatsApp')).not.toBeInTheDocument()
    expect(screen.queryByText('Email')).not.toBeInTheDocument()
    expect(screen.queryByText('Directions')).not.toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<MobileContactMethods variant="default" />)
    let container = screen.getByText('Call Now').closest('div')
    expect(container).toHaveClass('grid', 'grid-cols-2', 'gap-3', 'p-4')

    rerender(<MobileContactMethods variant="compact" />)
    container = screen.getByText('Call Now').closest('div')
    expect(container).toHaveClass('flex', 'flex-wrap', 'gap-2', 'p-2')

    rerender(<MobileContactMethods variant="expanded" />)
    container = screen.getByText('Call Now').closest('div')
    expect(container).toHaveClass('grid', 'grid-cols-1', 'gap-4', 'p-6')
  })

  it('handles phone call correctly', () => {
    render(<MobileContactMethods />)
    
    const callButton = screen.getByLabelText(/Call.*/)
    fireEvent.click(callButton)
    
    // Should open tel: link
    expect(mockOpen).toHaveBeenCalledWith('tel:+14243030386', '_self')
  })

  it('handles SMS correctly', () => {
    render(<MobileContactMethods />)
    
    const smsButton = screen.getByLabelText(/Send SMS.*/)
    fireEvent.click(smsButton)
    
    // Should open sms: link
    expect(mockOpen).toHaveBeenCalledWith('sms:+14243030386', '_self')
  })

  it('handles WhatsApp correctly', () => {
    render(<MobileContactMethods />)
    
    const whatsappButton = screen.getByLabelText(/Send WhatsApp.*/)
    fireEvent.click(whatsappButton)
    
    // Should open WhatsApp link
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/+14243030386'),
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('handles email correctly', () => {
    render(<MobileContactMethods />)
    
    const emailButton = screen.getByLabelText(/Send email.*/)
    fireEvent.click(emailButton)
    
    // Should open mailto: link
    expect(mockOpen).toHaveBeenCalledWith('mailto:info@amtycoonsinc.com', '_self')
  })

  it('handles directions correctly', () => {
    render(<MobileContactMethods />)
    
    const directionsButton = screen.getByLabelText(/Get directions.*/)
    fireEvent.click(directionsButton)
    
    // Should open Google Maps
    expect(mockOpen).toHaveBeenCalledWith(
      'https://maps.google.com/?q=AM+Tycoons+Inc+Los+Angeles+CA',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('applies correct button sizes for different variants', () => {
    const { rerender } = render(<MobileContactMethods variant="default" />)
    let callButton = screen.getByLabelText(/Call.*/)
    expect(callButton).toHaveClass('h-12', 'px-4', 'text-sm')

    rerender(<MobileContactMethods variant="compact" />)
    callButton = screen.getByLabelText(/Call.*/)
    expect(callButton).toHaveClass('h-10', 'px-3', 'text-xs')

    rerender(<MobileContactMethods variant="expanded" />)
    callButton = screen.getByLabelText(/Call.*/)
    expect(callButton).toHaveClass('h-16', 'px-6', 'text-base')
  })

  it('has proper accessibility attributes', () => {
    render(<MobileContactMethods />)
    
    const callButton = screen.getByLabelText(/Call.*/)
    expect(callButton).toHaveAttribute('aria-label')
    
    const smsButton = screen.getByLabelText(/Send SMS.*/)
    expect(smsButton).toHaveAttribute('aria-label')
    
    const whatsappButton = screen.getByLabelText(/Send WhatsApp.*/)
    expect(whatsappButton).toHaveAttribute('aria-label')
    
    const emailButton = screen.getByLabelText(/Send email.*/)
    expect(emailButton).toHaveAttribute('aria-label')
    
    const directionsButton = screen.getByLabelText(/Get directions.*/)
    expect(directionsButton).toHaveAttribute('aria-label')
  })

  it('applies correct styling classes', () => {
    render(<MobileContactMethods />)
    
    const container = screen.getByText('Call Now').closest('div')
    expect(container).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg', 'border')
    
    const callButton = screen.getByLabelText(/Call.*/)
    expect(callButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white')
  })

  it('handles undefined and null props gracefully', () => {
    const { rerender } = render(<MobileContactMethods className={undefined} />)
    let container = screen.getByText('Call Now').closest('div')
    expect(container).toBeInTheDocument()

    rerender(<MobileContactMethods className={null} />)
    container = screen.getByText('Call Now').closest('div')
    expect(container).toBeInTheDocument()
  })

  it('maintains proper spacing between buttons', () => {
    render(<MobileContactMethods />)
    
    const container = screen.getByText('Call Now').closest('div')
    expect(container).toHaveClass('grid', 'grid-cols-2', 'gap-3')
  })
})
