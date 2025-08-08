import { simpleAuth } from '@/lib/simple-auth'
import { getFirestore, collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore'
import { app } from '@/lib/firebase'

jest.mock('firebase/firestore')
jest.mock('@/lib/firebase')

describe('SimpleAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('login', () => {
    it('should successfully log in with correct credentials', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        role: 'admin',
        isActive: true,
        lastLogin: new Date(),
        loginAttempts: 0,
        rememberMe: false,
        password: simpleAuth['simpleHash']('password123'),
      }

      const mockQuerySnapshot = {
        empty: false,
        docs: [{
          id: 'test-id',
          data: () => mockUser,
        }],
      }

      ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)
      ;(setDoc as jest.Mock).mockResolvedValueOnce(undefined)

      const result = await simpleAuth.login('test@example.com', 'password123')

      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.message).toBe('Login successful')
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('should fail login with incorrect password', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password: simpleAuth['simpleHash']('password123'),
        loginAttempts: 0,
      }

      const mockQuerySnapshot = {
        empty: false,
        docs: [{
          id: 'test-id',
          data: () => mockUser,
        }],
      }

      ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)
      ;(setDoc as jest.Mock).mockResolvedValueOnce(undefined)

      const result = await simpleAuth.login('test@example.com', 'wrongpassword')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid email or password')
      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ loginAttempts: 1 }),
        expect.any(Object)
      )
    })

    it('should lock account after max login attempts', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password: simpleAuth['simpleHash']('password123'),
        loginAttempts: 4,
      }

      const mockQuerySnapshot = {
        empty: false,
        docs: [{
          id: 'test-id',
          data: () => mockUser,
        }],
      }

      ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)
      ;(setDoc as jest.Mock).mockResolvedValueOnce(undefined)

      const result = await simpleAuth.login('test@example.com', 'wrongpassword')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Too many failed attempts. Account locked for 15 minutes')
      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          loginAttempts: 5,
          lockoutUntil: expect.any(Date),
        }),
        expect.any(Object)
      )
    })
  })

  describe('createAdmin', () => {
    it('should create a new admin user with valid data', async () => {
      const mockQuerySnapshot = { empty: true }
      ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)
      ;(setDoc as jest.Mock).mockResolvedValueOnce(undefined)

      const email = 'newadmin@example.com'
      const password = 'StrongPass123!'
      const role = 'admin'

      const result = await simpleAuth.createAdmin(email, password, role)

      expect(result).toBe(true)
      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          email: email.toLowerCase(),
          role,
          isActive: true,
          password: expect.any(String),
        })
      )
    })

    it('should throw error if admin already exists', async () => {
      const mockQuerySnapshot = { empty: false }
      ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)

      await expect(simpleAuth.createAdmin('existing@example.com', 'StrongPass123!', 'admin'))
        .rejects
        .toThrow('Admin user already exists')
    })

    it('should throw error if password is weak', async () => {
      const mockQuerySnapshot = { empty: true }
      ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)

      await expect(simpleAuth.createAdmin('newadmin@example.com', 'weak', 'admin'))
        .rejects
        .toThrow('Password must be at least 8 characters with uppercase, lowercase, number, and special character')
    })
  })

  describe('session management', () => {
    it('should maintain session after successful login', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        role: 'admin',
        isActive: true,
        lastLogin: new Date(),
        loginAttempts: 0,
        rememberMe: true,
        password: simpleAuth['simpleHash']('password123'),
      }

      const mockQuerySnapshot = {
        empty: false,
        docs: [{
          id: 'test-id',
          data: () => mockUser,
        }],
      }

      ;(getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot)
      ;(setDoc as jest.Mock).mockResolvedValueOnce(undefined)

      await simpleAuth.login('test@example.com', 'password123', true)
      const currentUser = await simpleAuth.getCurrentUser()

      expect(currentUser).toBeDefined()
      expect(currentUser?.email).toBe('test@example.com')
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('should clear session on logout', async () => {
      await simpleAuth.logout()
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('admin_session')
      const currentUser = await simpleAuth.getCurrentUser()
      expect(currentUser).toBeNull()
    })
  })

  describe('authorization checks', () => {
    it('should throw error if not authenticated', async () => {
      await expect(simpleAuth.requireAuth())
        .rejects
        .toThrow('Authentication required')
    })

    it('should throw error if not super admin', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        role: 'admin',
        isActive: true,
      }

      jest.spyOn(simpleAuth as any, 'getCurrentUser').mockResolvedValueOnce(mockUser)

      await expect(simpleAuth.requireSuperAdmin())
        .rejects
        .toThrow('Super admin privileges required')
    })
  })
})
