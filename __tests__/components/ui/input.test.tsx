import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('flex', 'min-h-[44px]', 'w-full', 'rounded-md', 'border')
  })

  it('renders with custom value', () => {
    render(<Input value="test value" onChange={() => {}} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test value')
  })

  it('handles onChange events', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('renders with different types', () => {
    const { rerender } = render(<Input type="text" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')

    rerender(<Input type="password" />)
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" />)
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'number')
  })

  it('renders with custom className', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('renders with disabled state', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('renders with readOnly state', () => {
    render(<Input readOnly />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
  })

  it('renders with required attribute', () => {
    render(<Input required />)
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('renders with name attribute', () => {
    render(<Input name="test-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'test-input')
  })

  it('renders with id attribute', () => {
    render(<Input id="test-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('renders with aria-label', () => {
    render(<Input aria-label="Test input" />)
    const input = screen.getByLabelText('Test input')
    expect(input).toBeInTheDocument()
  })

  it('renders with aria-describedby', () => {
    render(<Input aria-describedby="description" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', 'description')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
    const input = screen.getByRole('textbox')
    
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles key events', () => {
    const handleKeyPress = jest.fn()
    const handleKeyDown = jest.fn()
    const handleKeyUp = jest.fn()
    
    render(
      <Input 
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    )
    
    const input = screen.getByRole('textbox')
    
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    
    fireEvent.keyUp(input, { key: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('combines multiple props correctly', () => {
    render(
      <Input
        value="test"
        placeholder="Enter text"
        className="custom-class"
        disabled
        required
        name="test-input"
        id="test-id"
        aria-label="Test input"
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test')
    expect(input).toHaveAttribute('placeholder', 'Enter text')
    expect(input).toHaveClass('custom-class')
    expect(input).toBeDisabled()
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('name', 'test-input')
    expect(input).toHaveAttribute('id', 'test-id')
    expect(input).toHaveAttribute('aria-label', 'Test input')
  })

  it('handles controlled input correctly', () => {
    const handleChange = jest.fn()
    render(<Input value="initial" onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('initial')
    
    fireEvent.change(input, { target: { value: 'updated' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles uncontrolled input correctly', () => {
    render(<Input defaultValue="default" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('default')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Input size="sm" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveClass('min-h-[44px]')
    
    rerender(<Input size="md" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveClass('min-h-[44px]')
    
    rerender(<Input size="lg" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveClass('min-h-[44px]')
  })

  it('renders with error state', () => {
    render(<Input className="border-red-500" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
  })

  it('renders with success state', () => {
    render(<Input className="border-green-500" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-green-500')
  })

  it('handles undefined props gracefully', () => {
    render(<Input value={undefined} onChange={undefined} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('handles null props gracefully', () => {
    render(<Input value={null as any} onChange={null as any} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('handles empty string props gracefully', () => {
    render(<Input value="" placeholder="" />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })
})
