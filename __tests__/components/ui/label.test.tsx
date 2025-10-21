import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label', () => {
  it('renders with default props', () => {
    render(<Label>Test Label</Label>)
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
  })

  it('renders with custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>)
    const label = screen.getByText('Custom Label')
    expect(label).toHaveClass('custom-label')
  })

  it('renders with htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Input Label</Label>)
    const label = screen.getByText('Input Label')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('renders with different content types', () => {
    const { rerender } = render(<Label>String Content</Label>)
    expect(screen.getByText('String Content')).toBeInTheDocument()

    rerender(<Label>{42}</Label>)
    expect(screen.getByText('42')).toBeInTheDocument()

    rerender(<Label>{null}</Label>)
    // For null content, just check that the label container exists
    const labelContainer = document.querySelector('label')
    expect(labelContainer).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Label ref={ref}>Ref Test</Label>)
    expect(ref).toHaveBeenCalled()
  })

  it('handles undefined htmlFor gracefully', () => {
    render(<Label htmlFor={undefined}>No For</Label>)
    const label = screen.getByText('No For')
    expect(label).not.toHaveAttribute('for')
  })

  it('handles empty className gracefully', () => {
    render(<Label className="">Empty Class</Label>)
    const label = screen.getByText('Empty Class')
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
  })

  it('applies custom className', () => {
    render(<Label className="custom-class">Custom</Label>)
    
    const label = screen.getByText('Custom')
    expect(label).toHaveClass('custom-class')
  })

  it('combines custom className with default classes', () => {
    render(<Label className="text-lg font-bold">Combined</Label>)
    const label = screen.getByText('Combined')
    expect(label).toHaveClass('text-lg', 'font-bold')
    // twMerge intelligently handles conflicts, so we check what actually remains
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
    // text-sm should be overridden by text-lg
    expect(label).not.toHaveClass('text-sm')
    // font-medium might be overridden by font-bold
    expect(label).not.toHaveClass('font-medium')
  })

  it('renders as label element by default', () => {
    render(<Label>Default</Label>)
    
    const label = screen.getByText('Default')
    expect(label.tagName).toBe('LABEL')
  })

  it('maintains accessibility attributes', () => {
    render(<Label htmlFor="test-input" aria-label="Test Label">Accessible</Label>)
    
    const label = screen.getByText('Accessible')
    expect(label).toHaveAttribute('for', 'test-input')
    expect(label).toHaveAttribute('aria-label', 'Test Label')
  })

  it('handles complex children', () => {
    render(
      <Label>
        <span>Complex</span> <strong>Content</strong>
      </Label>
    )
    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies peer-disabled styles correctly', () => {
    render(<Label>Peer Disabled</Label>)
    const label = screen.getByText('Peer Disabled')
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
  })

  it('renders with different text sizes when className overrides', () => {
    render(<Label className="text-lg">Large Text</Label>)
    const label = screen.getByText('Large Text')
    expect(label).toHaveClass('text-lg')
    // Check what classes actually remain after twMerge
    expect(label).toHaveClass('font-medium', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
    // text-sm should be overridden by text-lg
    expect(label).not.toHaveClass('text-sm')
  })

  it('handles multiple custom classes', () => {
    render(<Label className="text-lg font-bold text-blue-500">Multiple Classes</Label>)
    const label = screen.getByText('Multiple Classes')
    expect(label).toHaveClass('text-lg', 'font-bold', 'text-blue-500')
  })

  it('handles undefined className gracefully', () => {
    render(<Label className={undefined}>Undefined Class</Label>)
    const label = screen.getByText('Undefined Class')
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
  })

  it('handles null className gracefully', () => {
    render(<Label className={null as any}>Null Class</Label>)
    const label = screen.getByText('Null Class')
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70')
  })

  it('handles empty string htmlFor gracefully', () => {
    render(<Label htmlFor="">Empty For</Label>)
    const label = screen.getByText('Empty For')
    expect(label).toHaveAttribute('for', '')
  })

  it('handles null htmlFor gracefully', () => {
    render(<Label htmlFor={null as any}>Null For</Label>)
    const label = screen.getByText('Null For')
    expect(label).not.toHaveAttribute('for')
  })
})
