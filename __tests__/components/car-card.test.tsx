import { render, screen, fireEvent } from '@testing-library/react'
import { CarCard } from '@/components/car-card'
import { ComparisonProvider } from '@/lib/comparison-context'
import { mockCar } from '@/lib/mock-data'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ComparisonProvider>
      {component}
    </ComparisonProvider>
  )
}

describe('CarCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('renders car information correctly', () => {
    renderWithProvider(<CarCard car={mockCar} />)
    
    expect(screen.getByText(mockCar.title)).toBeInTheDocument()
    expect(screen.getByText(`${mockCar.year} ${mockCar.make} ${mockCar.model}`)).toBeInTheDocument()
    expect(screen.getByText(`$${mockCar.price.toLocaleString()}`)).toBeInTheDocument()
  })

  it('renders car image with proper alt text', () => {
    renderWithProvider(<CarCard car={mockCar} />)
    
    const image = screen.getByAltText(`${mockCar.title} - ${mockCar.year} ${mockCar.make} ${mockCar.model}`)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src')
  })

  it('renders mileage with proper formatting', () => {
    renderWithProvider(<CarCard car={mockCar} />)
    
    expect(screen.getByText(`${mockCar.mileage.toLocaleString()} mi`)).toBeInTheDocument()
  })

  it('renders year and location', () => {
    renderWithProvider(<CarCard car={mockCar} />)
    
    // Use getAllByText for year since it appears multiple times
    const yearElements = screen.getAllByText(mockCar.year.toString())
    expect(yearElements.length).toBeGreaterThan(0)
    expect(screen.getByText(mockCar.location)).toBeInTheDocument()
  })

  it('renders make and model', () => {
    renderWithProvider(<CarCard car={mockCar} />)
    
    expect(screen.getByText(`${mockCar.make} ${mockCar.model}`)).toBeInTheDocument()
  })

  it('handles missing optional fields gracefully', () => {
    const carWithMissingFields = {
      ...mockCar,
      title: undefined
    }
    
    renderWithProvider(<CarCard car={carWithMissingFields} />)
    
    expect(screen.getByText('Untitled Vehicle')).toBeInTheDocument()
  })

  it('renders with different price ranges', () => {
    const expensiveCar = { ...mockCar, price: 75000 }
    
    renderWithProvider(<CarCard car={expensiveCar} />)
    expect(screen.getByText('$75,000')).toBeInTheDocument()
  })

  it('renders with different mileage ranges', () => {
    const lowMileageCar = { ...mockCar, mileage: 5000 }
    
    renderWithProvider(<CarCard car={lowMileageCar} />)
    expect(screen.getByText('5,000 mi')).toBeInTheDocument()
  })

  it('handles comparison toggle correctly', () => {
    renderWithProvider(<CarCard car={mockCar} showCompareButton={true} />)
    
    const compareButton = screen.getByRole('button', { name: /add.*comparison/i })
    expect(compareButton).toBeInTheDocument()
    
    fireEvent.click(compareButton)
    // The button should change to "Remove from comparison"
    expect(screen.getByRole('button', { name: /remove.*comparison/i })).toBeInTheDocument()
  })

  it('handles invalid car data gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    renderWithProvider(<CarCard car={null as any} />)
    
    expect(consoleSpy).toHaveBeenCalledWith('CarCard: Invalid car data received:', null)
    consoleSpy.mockRestore()
  })

  it('handles missing car ID gracefully', () => {
    const carWithoutId = { ...mockCar, id: undefined }
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    renderWithProvider(<CarCard car={carWithoutId} />)
    
    expect(consoleSpy).toHaveBeenCalledWith('CarCard: Invalid car data received:', carWithoutId)
    consoleSpy.mockRestore()
  })

  it('renders with different car makes and models', () => {
    const bmwCar = { ...mockCar, make: 'BMW', model: '3 Series', title: '2021 BMW 3 Series' }
    
    renderWithProvider(<CarCard car={bmwCar} />)
    expect(screen.getByText('2021 BMW 3 Series')).toBeInTheDocument()
  })

  it('renders with different years', () => {
    const oldCar = { ...mockCar, year: 2015, title: '2015 Honda Civic' }
    
    renderWithProvider(<CarCard car={oldCar} />)
    expect(screen.getByText('2015 Honda Civic')).toBeInTheDocument()
  })
})
