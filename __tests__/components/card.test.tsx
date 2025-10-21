import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default styling', () => {
      render(<Card>Card content</Card>)
      const card = screen.getByText('Card content').closest('div')
      expect(card).toHaveClass('rounded-xl', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm')
    })

    it('applies custom className', () => {
      render(<Card className="custom-card">Custom card</Card>)
      const card = screen.getByText('Custom card').closest('div')
      expect(card).toHaveClass('custom-card')
    })

    it('forwards ref correctly', () => {
      const ref = jest.fn()
      render(<Card ref={ref}>Ref card</Card>)
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('CardHeader', () => {
    it('renders with default styling', () => {
      render(<CardHeader>Header content</CardHeader>)
      const header = screen.getByText('Header content').closest('div')
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })

    it('applies custom className', () => {
      render(<CardHeader className="custom-header">Custom header</CardHeader>)
      const header = screen.getByText('Custom header').closest('div')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('renders with default styling', () => {
      render(<CardTitle>Title</CardTitle>)
      const title = screen.getByText('Title')
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
    })

    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Custom title</CardTitle>)
      const title = screen.getByText('Custom title')
      expect(title).toHaveClass('custom-title')
    })

    it('renders as div by default', () => {
      render(<CardTitle>Title</CardTitle>)
      const title = screen.getByText('Title')
      expect(title.tagName).toBe('DIV')
    })
  })

  describe('CardDescription', () => {
    it('renders with default styling', () => {
      render(<CardDescription>Description</CardDescription>)
      const description = screen.getByText('Description')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })

    it('applies custom className', () => {
      render(<CardDescription className="custom-desc">Custom description</CardDescription>)
      const description = screen.getByText('Custom description')
      expect(description).toHaveClass('custom-desc')
    })
  })

  describe('CardContent', () => {
    it('renders with default styling', () => {
      render(<CardContent>Content</CardContent>)
      const content = screen.getByText('Content').closest('div')
      expect(content).toHaveClass('p-6', 'pt-0')
    })

    it('applies custom className', () => {
      render(<CardContent className="custom-content">Custom content</CardContent>)
      const content = screen.getByText('Custom content').closest('div')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('CardFooter', () => {
    it('renders with default styling', () => {
      render(<CardFooter>Footer</CardFooter>)
      const footer = screen.getByText('Footer').closest('div')
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })

    it('applies custom className', () => {
      render(<CardFooter className="custom-footer">Custom footer</CardFooter>)
      const footer = screen.getByText('Custom footer').closest('div')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Card Composition', () => {
    it('renders complete card structure correctly', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card Description')).toBeInTheDocument()
      expect(screen.getByText('Card Content')).toBeInTheDocument()
      expect(screen.getByText('Card Footer')).toBeInTheDocument()
    })

    it('handles nested content correctly', () => {
      render(
        <Card>
          <CardContent>
            <div>Nested content</div>
            <span>More content</span>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('Nested content')).toBeInTheDocument()
      expect(screen.getByText('More content')).toBeInTheDocument()
    })

    it('applies custom classes to all components', () => {
      render(
        <Card className="custom-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
            <CardDescription className="custom-desc">Description</CardDescription>
          </CardHeader>
          <CardContent className="custom-content">Content</CardContent>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Title').closest('div')).toHaveClass('custom-title')
      expect(screen.getByText('Description')).toHaveClass('custom-desc')
      expect(screen.getByText('Content').closest('div')).toHaveClass('custom-content')
      expect(screen.getByText('Footer').closest('div')).toHaveClass('custom-footer')
    })

    it('handles empty content gracefully', () => {
      render(
        <Card>
          <CardHeader />
          <CardContent />
          <CardFooter />
        </Card>
      )

      // Check that the card structure exists even with empty content
      const card = screen.getByTestId('card-container')
      expect(card).toHaveClass('rounded-xl', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm')
    })

    it('handles undefined className gracefully', () => {
      render(
        <Card className={undefined}>
          <CardHeader className={undefined}>
            <CardTitle className={undefined}>Title</CardTitle>
          </CardHeader>
        </Card>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
    })

    it('handles null className gracefully', () => {
      render(
        <Card className={null as any}>
          <CardHeader className={null as any}>
            <CardTitle className={null as any}>Title</CardTitle>
          </CardHeader>
        </Card>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
    })

    it('handles empty string className gracefully', () => {
      render(
        <Card className="">
          <CardHeader className="">
            <CardTitle className="">Title</CardTitle>
          </CardHeader>
        </Card>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
    })
  })
})
