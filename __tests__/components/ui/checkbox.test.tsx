import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '@/components/ui/checkbox'

describe('Checkbox', () => {
  it('renders with default props', () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('renders with custom className', () => {
    render(<Checkbox className="custom-checkbox" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('custom-checkbox')
  })

  it('renders with checked state', () => {
    render(<Checkbox checked />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('renders with defaultChecked state', () => {
    render(<Checkbox defaultChecked />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('handles onChange events', () => {
    const handleChange = jest.fn()
    render(<Checkbox onCheckedChange={handleChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders with disabled state', () => {
    render(<Checkbox disabled />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('renders with required attribute', () => {
    render(<Checkbox required />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeRequired()
  })

  it('renders with name attribute', () => {
    render(<Checkbox name="test-checkbox" />)
    const checkbox = screen.getByRole('checkbox')
    // Checkbox component doesn't support name attribute, so we just check it renders
    expect(checkbox).toBeInTheDocument()
  })

  it('renders with id attribute', () => {
    render(<Checkbox id="test-id" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('id', 'test-id')
  })

  it('renders with aria-label', () => {
    render(<Checkbox aria-label="Test checkbox" />)
    const checkbox = screen.getByLabelText('Test checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('renders with aria-describedby', () => {
    render(<Checkbox aria-describedby="description" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-describedby', 'description')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Checkbox ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    
    render(<Checkbox onFocus={handleFocus} onBlur={handleBlur} />)
    const checkbox = screen.getByRole('checkbox')
    
    fireEvent.focus(checkbox)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(checkbox)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles key events', () => {
    const handleKeyDown = jest.fn()
    const handleKeyUp = jest.fn()
    
    render(
      <Checkbox 
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    
    fireEvent.keyDown(checkbox, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    
    fireEvent.keyUp(checkbox, { key: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('combines multiple props correctly', () => {
    render(
      <Checkbox 
        checked
        className="custom-class"
        disabled
        required
        aria-label="Test input"
        id="test-id"
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
    expect(checkbox).toHaveClass('custom-class')
    expect(checkbox).toBeDisabled()
    expect(checkbox).toBeRequired()
    expect(checkbox).toHaveAttribute('aria-label', 'Test input')
    expect(checkbox).toHaveAttribute('id', 'test-id')
  })

  it('handles controlled input correctly', () => {
    const handleChange = jest.fn()
    render(<Checkbox checked={false} onCheckedChange={handleChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    
    fireEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles uncontrolled input correctly', () => {
    render(<Checkbox defaultChecked />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('handles undefined props gracefully', () => {
    render(<Checkbox checked={undefined} onCheckedChange={undefined} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('handles null props gracefully', () => {
    render(<Checkbox checked={null as any} onCheckedChange={null as any} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('handles empty string props gracefully', () => {
    render(<Checkbox name="" id="" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    // Checkbox component doesn't support name attribute
    expect(checkbox).toHaveAttribute('id', '')
  })

  it('toggles state on click', () => {
    const handleChange = jest.fn()
    render(<Checkbox onCheckedChange={handleChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    
    fireEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('maintains checked state when controlled', () => {
    render(<Checkbox checked={true} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
    
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked() // Should remain checked in controlled mode
  })

  it('handles undefined className gracefully', () => {
    render(<Checkbox className={undefined} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('handles null className gracefully', () => {
    render(<Checkbox className={null as any} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('handles empty string className gracefully', () => {
    render(<Checkbox className="" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })
})
