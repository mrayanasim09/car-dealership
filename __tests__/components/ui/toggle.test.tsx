import { render, screen, fireEvent } from '@testing-library/react'
import { Toggle } from '@/components/ui/toggle'

describe('Toggle', () => {
  it('renders with default props', () => {
    render(<Toggle>Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveTextContent('Toggle')
  })

  it('renders with custom className', () => {
    render(<Toggle className="custom-toggle">Custom Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('custom-toggle')
  })

  it('renders with pressed state', () => {
    render(<Toggle pressed>Pressed Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders with defaultPressed state', () => {
    render(<Toggle defaultPressed>Default Pressed Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('handles onPressedChange events', () => {
    const handleChange = jest.fn()
    render(<Toggle onPressedChange={handleChange}>Change Toggle</Toggle>)
    
    const toggle = screen.getByRole('button')
    fireEvent.click(toggle)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders with disabled state', () => {
    render(<Toggle disabled>Disabled Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeDisabled()
  })

  it('renders with size variants', () => {
    const { rerender } = render(<Toggle size="default">Default Size</Toggle>)
    let toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('h-10', 'px-3', 'min-w-10')

    rerender(<Toggle size="sm">Small Size</Toggle>)
    toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('h-9', 'px-2.5', 'min-w-9')

    rerender(<Toggle size="lg">Large Size</Toggle>)
    toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('h-11', 'px-5', 'min-w-11')
  })

  it('renders with variant styles', () => {
    const { rerender } = render(<Toggle variant="default">Default Variant</Toggle>)
    let toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('bg-transparent')

    rerender(<Toggle variant="outline">Outline Variant</Toggle>)
    toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('border', 'border-input', 'bg-transparent')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Toggle ref={ref}>Ref Toggle</Toggle>)
    expect(ref).toHaveBeenCalled()
  })

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    
    render(<Toggle onFocus={handleFocus} onBlur={handleBlur}>Focus Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    
    fireEvent.focus(toggle)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(toggle)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles key events', () => {
    const handleKeyDown = jest.fn()
    const handleKeyUp = jest.fn()
    
    render(
      <Toggle 
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        Key Toggle
      </Toggle>
    )
    
    const toggle = screen.getByRole('button')
    
    fireEvent.keyDown(toggle, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    
    fireEvent.keyUp(toggle, { key: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('combines multiple props correctly', () => {
    render(
      <Toggle 
        size="lg" 
        variant="outline" 
        className="custom-class"
        disabled
        aria-label="Test toggle"
      >
        Combined
      </Toggle>
    )
    
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('custom-class')
    expect(toggle).toBeDisabled()
    expect(toggle).toHaveClass('h-11', 'px-5', 'min-w-11')
    expect(toggle).toHaveClass('border', 'border-input', 'bg-transparent')
    expect(toggle).toHaveAttribute('aria-label', 'Test toggle')
  })

  it('handles controlled input correctly', () => {
    const handleChange = jest.fn()
    render(<Toggle pressed={false} onPressedChange={handleChange}>Controlled Toggle</Toggle>)
    
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    
    fireEvent.click(toggle)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles uncontrolled input correctly', () => {
    render(<Toggle defaultPressed>Uncontrolled Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('handles undefined props gracefully', () => {
    render(<Toggle pressed={undefined} onPressedChange={undefined}>Undefined Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeInTheDocument()
  })

  it('handles null props gracefully', () => {
    render(<Toggle pressed={null as any} onPressedChange={null as any}>Null Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeInTheDocument()
  })

  it('handles empty string props gracefully', () => {
    render(<Toggle className="" aria-label="">Empty Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeInTheDocument()
  })

  it('toggles state on click', () => {
    const handleChange = jest.fn()
    render(<Toggle onPressedChange={handleChange}>Click Toggle</Toggle>)
    
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    
    fireEvent.click(toggle)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('maintains pressed state when controlled', () => {
    render(<Toggle pressed={true}>Maintained Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true') // Should remain pressed in controlled mode
  })

  it('handles undefined className gracefully', () => {
    render(<Toggle className={undefined}>No Class Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeInTheDocument()
  })

  it('handles null className gracefully', () => {
    render(<Toggle className={null as any}>Null Class Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeInTheDocument()
  })

  it('handles empty string className gracefully', () => {
    render(<Toggle className="">Empty Class Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeInTheDocument()
  })

  it('handles undefined size gracefully', () => {
    render(<Toggle size={undefined}>No Size Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeInTheDocument()
  })

  it('handles undefined variant gracefully', () => {
    render(<Toggle variant={undefined}>No Variant Toggle</Toggle>)
    const toggle = screen.getByRole('button')
    expect(toggle).toBeInTheDocument()
  })
})
