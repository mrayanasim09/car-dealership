import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SetupSimplePage from '@/app/admin/setup-simple/page'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { simpleAuth } from '@/lib/simple-auth'
import { useRouter } from 'next/navigation'

jest.mock('firebase/firestore')
jest.mock('@/lib/simple-auth')
jest.mock('next/navigation')

describe('SetupSimplePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRouter.push.mockClear()
  })

  it('should show loading state initially', () => {
    render(<SetupSimplePage />)
    expect(screen.getByText('Checking setup...')).toBeInTheDocument()
  })

  it('should redirect if admin already exists', async () => {
    const mockQuerySnapshot = { empty: false }
    ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)

    render(<SetupSimplePage />)

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/admin')
    })
  })

  it('should show setup form if no admin exists', async () => {
    const mockQuerySnapshot = { empty: true }
    ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)

    render(<SetupSimplePage />)

    await waitFor(() => {
      expect(screen.getByText('Setup Super Admin')).toBeInTheDocument()
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    })
  })

  it('should validate password match', async () => {
    const mockQuerySnapshot = { empty: true }
    ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)

    render(<SetupSimplePage />)

    await waitFor(() => {
      const emailInput = screen.getByLabelText('Email address')
      const passwordInput = screen.getByLabelText('Password')
      const confirmInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByText('Create Super Admin')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } })
      fireEvent.change(confirmInput, { target: { value: 'DifferentPass123!' } })
      fireEvent.click(submitButton)
    })

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    expect(simpleAuth.createAdmin).not.toHaveBeenCalled()
  })

  it('should validate password strength', async () => {
    const mockQuerySnapshot = { empty: true }
    ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)

    render(<SetupSimplePage />)

    await waitFor(() => {
      const emailInput = screen.getByLabelText('Email address')
      const passwordInput = screen.getByLabelText('Password')
      const confirmInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByText('Create Super Admin')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'weak' } })
      fireEvent.change(confirmInput, { target: { value: 'weak' } })
      fireEvent.click(submitButton)
    })

    expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
    expect(simpleAuth.createAdmin).not.toHaveBeenCalled()
  })

  it('should create super admin with valid data', async () => {
    const mockQuerySnapshot = { empty: true }
    ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)
    ;(simpleAuth.createAdmin as jest.Mock).mockResolvedValueOnce(true)

    render(<SetupSimplePage />)

    await waitFor(() => {
      const emailInput = screen.getByLabelText('Email address')
      const passwordInput = screen.getByLabelText('Password')
      const confirmInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByText('Create Super Admin')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } })
      fireEvent.change(confirmInput, { target: { value: 'StrongPass123!' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(simpleAuth.createAdmin).toHaveBeenCalledWith(
        'test@example.com',
        'StrongPass123!',
        'super_admin'
      )
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/login')
    })
  })

  it('should handle creation errors', async () => {
    const mockQuerySnapshot = { empty: true }
    ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)
    ;(simpleAuth.createAdmin as jest.Mock).mockRejectedValueOnce(new Error('Creation failed'))

    render(<SetupSimplePage />)

    await waitFor(() => {
      const emailInput = screen.getByLabelText('Email address')
      const passwordInput = screen.getByLabelText('Password')
      const confirmInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByText('Create Super Admin')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } })
      fireEvent.change(confirmInput, { target: { value: 'StrongPass123!' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Creation failed')).toBeInTheDocument()
      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })
})
