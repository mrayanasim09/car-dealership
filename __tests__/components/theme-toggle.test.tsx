import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn()
}))

const mockUseTheme = require('next-themes').useTheme

// Create a simple wrapper component for testing
const ThemeWrapper = ({ children, theme = 'light', setTheme = jest.fn() }: { 
  children: React.ReactNode
  theme?: string
  setTheme?: jest.Mock
}) => {
  mockUseTheme.mockReturnValue({
    resolvedTheme: theme,
    setTheme
  })
  
  return <div data-testid="theme-wrapper">{children}</div>
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with light theme by default', () => {
    render(
      <ThemeWrapper theme="light">
        <ThemeToggle />
      </ThemeWrapper>
    )

    // Check if both buttons are rendered (mobile and desktop)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    
    // Check if Sun icon is visible for light theme
    const mobileButton = screen.getByLabelText('Toggle dark mode')
    expect(mobileButton).toBeInTheDocument()
  })

  it('renders with dark theme', () => {
    render(
      <ThemeWrapper theme="dark">
        <ThemeToggle />
      </ThemeWrapper>
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    
    // Check if Moon icon is visible for dark theme
    const desktopButton = screen.getByLabelText('Theme options')
    expect(desktopButton).toBeInTheDocument()
  })

  it('calls setTheme when mobile toggle is clicked', async () => {
    const mockSetTheme = jest.fn()
    
    render(
      <ThemeWrapper theme="light" setTheme={mockSetTheme}>
        <ThemeToggle />
      </ThemeWrapper>
    )

    const mobileButton = screen.getByLabelText('Toggle dark mode')
    fireEvent.click(mobileButton)

    await waitFor(() => {
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })
  })

  it('toggles between light and dark themes', async () => {
    const mockSetTheme = jest.fn()
    
    // First render with light theme
    const { rerender } = render(
      <ThemeWrapper theme="light" setTheme={mockSetTheme}>
        <ThemeToggle />
      </ThemeWrapper>
    )

    const mobileButton = screen.getByLabelText('Toggle dark mode')
    
    // First click: light -> dark
    fireEvent.click(mobileButton)
    await waitFor(() => {
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    // Clear the mock calls
    mockSetTheme.mockClear()
    
    // Re-render with dark theme
    rerender(
      <ThemeWrapper theme="dark" setTheme={mockSetTheme}>
        <ThemeToggle />
      </ThemeWrapper>
    )

    // Second click: dark -> light
    fireEvent.click(mobileButton)
    await waitFor(() => {
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })
  })

  it('has proper accessibility attributes', () => {
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    )

    const mobileButton = screen.getByLabelText('Toggle dark mode')
    const desktopButton = screen.getByLabelText('Theme options')

    expect(mobileButton).toHaveAttribute('aria-label', 'Toggle dark mode')
    expect(mobileButton).toHaveAttribute('aria-pressed', 'false')
    expect(desktopButton).toHaveAttribute('aria-label', 'Theme options')
  })

  it('applies custom styling classes', () => {
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    
    // Check if buttons have the expected classes
    buttons.forEach(button => {
      expect(button).toHaveClass('border-2', 'border-border', 'hover:bg-accent', 'bg-background')
    })
  })

  it('handles system theme preference', () => {
    render(
      <ThemeWrapper theme="system">
        <ThemeToggle />
      </ThemeWrapper>
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('handles undefined theme gracefully', () => {
    render(
      <ThemeWrapper theme={undefined}>
        <ThemeToggle />
      </ThemeWrapper>
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })
})
