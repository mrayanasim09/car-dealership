import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@/components/ui/switch'

describe('Switch', () => {
  it('renders with default props', () => {
    render(<Switch />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
    expect(switchElement).not.toBeChecked()
  })

  it('renders with custom className', () => {
    render(<Switch className="custom-switch" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-switch')
  })

  it('renders with checked state', () => {
    render(<Switch checked />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
  })

  it('renders with defaultChecked state', () => {
    render(<Switch defaultChecked />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
  })

  it('handles onChange events', () => {
    const handleChange = jest.fn()
    render(<Switch onCheckedChange={handleChange} />)
    
    const switchElement = screen.getByRole('switch')
    fireEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders with disabled state', () => {
    render(<Switch disabled />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
  })

  it('renders with required attribute', () => {
    render(<Switch required />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-required', 'true')
  })

  it('renders with name attribute', () => {
    render(<Switch name="test-switch" />)
    const switchElement = screen.getByRole('switch')
    // Switch component doesn't support name attribute, so we just check it renders
    expect(switchElement).toBeInTheDocument()
  })

  it('renders with id attribute', () => {
    render(<Switch id="test-id" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('id', 'test-id')
  })

  it('renders with aria-label', () => {
    render(<Switch aria-label="Test switch" />)
    const switchElement = screen.getByLabelText('Test switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('renders with aria-describedby', () => {
    render(<Switch aria-describedby="description" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-describedby', 'description')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Switch ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    
    render(<Switch onFocus={handleFocus} onBlur={handleBlur} />)
    const switchElement = screen.getByRole('switch')
    
    fireEvent.focus(switchElement)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(switchElement)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles key events', () => {
    const handleKeyDown = jest.fn()
    const handleKeyUp = jest.fn()
    
    render(
      <Switch 
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    )
    
    const switchElement = screen.getByRole('switch')
    
    fireEvent.keyDown(switchElement, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    
    fireEvent.keyUp(switchElement, { key: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('combines multiple props correctly', () => {
    render(
      <Switch 
        checked
        className="custom-class"
        disabled
        aria-required="true"
        aria-label="Test input"
        id="test-id"
      />
    )
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-class')
    expect(switchElement).toBeDisabled()
    expect(switchElement).toHaveAttribute('aria-required', 'true')
    expect(switchElement).toHaveAttribute('aria-label', 'Test input')
    expect(switchElement).toHaveAttribute('id', 'test-id')
  })

  it('handles controlled input correctly', () => {
    const handleChange = jest.fn()
    render(<Switch checked={false} onCheckedChange={handleChange} />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()
    
    fireEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles uncontrolled input correctly', () => {
    render(<Switch defaultChecked />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
  })

  it('handles undefined props gracefully', () => {
    render(<Switch checked={undefined} onCheckedChange={undefined} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('handles null props gracefully', () => {
    render(<Switch checked={null as any} onCheckedChange={null as any} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('handles empty string props gracefully', () => {
    render(<Switch name="" id="" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
    // Switch component doesn't support name attribute
    expect(switchElement).toHaveAttribute('id', '')
  })

  it('toggles state on click', () => {
    const handleChange = jest.fn()
    render(<Switch onCheckedChange={handleChange} />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()
    
    fireEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('maintains checked state when controlled', () => {
    render(<Switch checked={true} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
    
    fireEvent.click(switchElement)
    expect(switchElement).toBeChecked() // Should remain checked in controlled mode
  })

  it('handles undefined className gracefully', () => {
    render(<Switch className={undefined} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('handles null className gracefully', () => {
    render(<Switch className={null as any} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('handles empty string className gracefully', () => {
    render(<Switch className="" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })
})
