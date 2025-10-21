import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border', 'px-2.5', 'py-0.5', 'text-xs', 'font-semibold', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground', 'hover:bg-primary/80')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toHaveClass('border-transparent', 'bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/80')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('text-foreground')
  })

  it('renders with custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-badge')
  })

  it('combines variant and custom className', () => {
    render(<Badge variant="default" className="custom-class">Combined</Badge>)
    const badge = screen.getByText('Combined')
    expect(badge).toHaveClass('custom-class', 'border-transparent', 'bg-primary')
  })

  it('renders with children content', () => {
    render(<Badge>Child Content</Badge>)
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('renders with complex children', () => {
    render(
      <Badge>
        <span>Icon</span>
        <span>Text</span>
      </Badge>
    )
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('renders with different content types', () => {
    const { rerender } = render(<Badge>String Content</Badge>)
    expect(screen.getByText('String Content')).toBeInTheDocument()

    rerender(<Badge>{42}</Badge>)
    expect(screen.getByText('42')).toBeInTheDocument()

    rerender(<Badge>{null}</Badge>)
    // For null content, just check that the badge container exists
    const badgeContainer = document.querySelector('[class*="inline-flex"]')
    expect(badgeContainer).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(<Badge aria-label="Test Badge">Content</Badge>)
    const badge = screen.getByLabelText('Test Badge')
    expect(badge).toBeInTheDocument()
  })

  it('handles undefined className gracefully', () => {
    render(<Badge className={undefined}>Content</Badge>)
    const badge = screen.getByText('Content')
    expect(badge).toBeInTheDocument()
  })

  it('handles null className gracefully', () => {
    render(<Badge className={null as any}>Content</Badge>)
    const badge = screen.getByText('Content')
    expect(badge).toBeInTheDocument()
  })

  it('handles empty string variant gracefully', () => {
    render(<Badge variant={'' as any}>Content</Badge>)
    const badge = screen.getByText('Content')
    expect(badge).toBeInTheDocument()
  })

  it('handles null variant gracefully', () => {
    render(<Badge variant={null as any}>Content</Badge>)
    const badge = screen.getByText('Content')
    expect(badge).toBeInTheDocument()
  })
})
