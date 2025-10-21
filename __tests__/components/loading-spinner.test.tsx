import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner.firstElementChild).toHaveClass('h-12', 'w-12')
  })

  it('renders with custom className', () => {
    render(<LoadingSpinner className="custom-spinner" />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('custom-spinner')
  })

  it('renders with default size when size is not specified', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner.firstElementChild).toHaveClass('h-8', 'w-8')
  })

  it('renders spinning animation', () => {
    render(<LoadingSpinner />)
    const spinnerElement = screen.getByTestId('loading-spinner').firstElementChild
    expect(spinnerElement).toHaveClass('animate-spin')
  })

  it('renders with proper border styling', () => {
    render(<LoadingSpinner />)
    const spinnerElement = screen.getByTestId('loading-spinner').firstElementChild
    expect(spinnerElement).toHaveClass('border-2', 'border-gray-300', 'border-t-red-600')
  })

  it('renders as rounded circle', () => {
    render(<LoadingSpinner />)
    const spinnerElement = screen.getByTestId('loading-spinner').firstElementChild
    expect(spinnerElement).toHaveClass('rounded-full')
  })

  it('combines multiple props correctly', () => {
    render(
      <LoadingSpinner 
        size="sm" 
        className="custom-class"
      />
    )
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('custom-class')
    expect(spinner.firstElementChild).toHaveClass('h-4', 'w-4')
  })

  it('handles undefined size gracefully', () => {
    render(<LoadingSpinner size={undefined} />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner.firstElementChild).toHaveClass('h-8', 'w-8')
  })

  it('handles empty className gracefully', () => {
    render(<LoadingSpinner className="" />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('handles null className gracefully', () => {
    render(<LoadingSpinner className={null as any} />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('handles undefined className gracefully', () => {
    render(<LoadingSpinner className={undefined} />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('flex', 'items-center', 'justify-center')
  })
})
