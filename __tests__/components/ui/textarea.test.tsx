import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea', () => {
  it('renders with default props', () => {
    render(<Textarea />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('flex', 'min-h-[80px]', 'w-full', 'rounded-md', 'border')
  })

  it('renders with custom value', () => {
    render(<Textarea value="test value" onChange={() => {}} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('test value')
  })

  it('handles onChange events', () => {
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders with placeholder', () => {
    render(<Textarea placeholder="Enter text" />)
    const textarea = screen.getByPlaceholderText('Enter text')
    expect(textarea).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<Textarea className="custom-textarea" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('custom-textarea')
  })

  it('renders with disabled state', () => {
    render(<Textarea disabled />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('renders with readOnly state', () => {
    render(<Textarea readOnly />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('readonly')
  })

  it('renders with required attribute', () => {
    render(<Textarea required />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeRequired()
  })

  it('renders with name attribute', () => {
    render(<Textarea name="test-textarea" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('name', 'test-textarea')
  })

  it('renders with id attribute', () => {
    render(<Textarea id="test-id" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('id', 'test-id')
  })

  it('renders with aria-label', () => {
    render(<Textarea aria-label="Test textarea" />)
    const textarea = screen.getByLabelText('Test textarea')
    expect(textarea).toBeInTheDocument()
  })

  it('renders with aria-describedby', () => {
    render(<Textarea aria-describedby="description" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('aria-describedby', 'description')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Textarea ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    
    render(<Textarea onFocus={handleFocus} onBlur={handleBlur} />)
    const textarea = screen.getByRole('textbox')
    
    fireEvent.focus(textarea)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(textarea)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('handles key events', () => {
    const handleKeyDown = jest.fn()
    const handleKeyUp = jest.fn()
    
    render(
      <Textarea 
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    )
    
    const textarea = screen.getByRole('textbox')
    
    fireEvent.keyDown(textarea, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
    
    fireEvent.keyUp(textarea, { key: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('combines multiple props correctly', () => {
    render(
      <Textarea
        value="test"
        placeholder="Enter text"
        className="custom-class"
        disabled
        required
        name="test-textarea"
        id="test-id"
        aria-label="Test textarea"
      />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('test')
    expect(textarea).toHaveAttribute('placeholder', 'Enter text')
    expect(textarea).toHaveClass('custom-class')
    expect(textarea).toBeDisabled()
    expect(textarea).toBeRequired()
    expect(textarea).toHaveAttribute('name', 'test-textarea')
    expect(textarea).toHaveAttribute('id', 'test-id')
    expect(textarea).toHaveAttribute('aria-label', 'Test textarea')
  })

  it('handles controlled input correctly', () => {
    const handleChange = jest.fn()
    render(<Textarea value="initial" onChange={handleChange} />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('initial')
    
    fireEvent.change(textarea, { target: { value: 'updated' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles uncontrolled input correctly', () => {
    render(<Textarea defaultValue="default" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('default')
  })

  it('renders with different rows', () => {
    render(<Textarea rows={5} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '5')
  })

  it('renders with different cols', () => {
    render(<Textarea cols={50} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('cols', '50')
  })

  it('renders with maxLength', () => {
    render(<Textarea maxLength={100} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('maxLength', '100')
  })

  it('renders with minLength', () => {
    render(<Textarea minLength={10} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('minLength', '10')
  })

  it('renders with wrap attribute', () => {
    render(<Textarea wrap="hard" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('wrap', 'hard')
  })

  it('handles undefined props gracefully', () => {
    render(<Textarea value={undefined} onChange={undefined} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  it('handles null props gracefully', () => {
    render(<Textarea value={null as any} onChange={null as any} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  it('handles empty string props gracefully', () => {
    render(<Textarea value="" placeholder="" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue('')
  })

  it('handles resize attribute', () => {
    render(<Textarea style={{ resize: 'none' }} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveStyle({ resize: 'none' })
  })

  it('handles spellCheck attribute', () => {
    render(<Textarea spellCheck={false} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('spellCheck', 'false')
  })

  it('handles autoComplete attribute', () => {
    render(<Textarea autoComplete="off" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('autoComplete', 'off')
  })
})
