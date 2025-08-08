import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from './firebase-config'
import bcrypt from 'bcryptjs'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
  lastLogin: Date;
  loginAttempts: number;
  rememberMe: boolean;
}

interface LoginResult {
  success: boolean;
  user?: AdminUser;
  message: string;
}

class SimpleAuth {
  private maxLoginAttempts = 5;
  private lockoutDuration = 15 * 60 * 1000; // 15 minutes

  async login(email: string, password: string, rememberMe: boolean = false): Promise<LoginResult> {
    try {
      // Check if user exists
      const usersRef = collection(db, 'admin_users')
      const q = query(usersRef, where('email', '==', email.toLowerCase()))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data()

      // Check if account is locked
      const lockoutUntil = userData.lockoutUntil?.toDate ? userData.lockoutUntil.toDate() : new Date(userData.lockoutUntil)
      if (userData.lockoutUntil && new Date() < lockoutUntil) {
        const remainingTime = Math.ceil((lockoutUntil.getTime() - Date.now()) / 1000 / 60)
        return {
          success: false,
          message: `Account locked. Try again in ${remainingTime} minutes`
        }
      }

      // Verify password with bcrypt
      const isValidPassword = await bcrypt.compare(password, userData.password)
      if (!isValidPassword) {
        // Increment login attempts
        const newAttempts = (userData.loginAttempts || 0) + 1
        await setDoc(doc(db, 'admin_users', userDoc.id), {
          ...userData,
          loginAttempts: newAttempts,
          lockoutUntil: newAttempts >= this.maxLoginAttempts ? new Date(Date.now() + this.lockoutDuration) : null
        }, { merge: true })

        if (newAttempts >= this.maxLoginAttempts) {
          return {
            success: false,
            message: 'Too many failed attempts. Account locked for 15 minutes'
          }
        }

        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      // Reset failed login attempts and update last login
      await setDoc(doc(db, 'admin_users', userDoc.id), {
        ...userData,
        loginAttempts: 0,
        lockoutUntil: null,
        lastLogin: new Date(),
        rememberMe
      }, { merge: true })

      // Store user in localStorage for session management
      const user: AdminUser = {
        id: userDoc.id,
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive,
        lastLogin: new Date(),
        loginAttempts: 0,
        rememberMe
      }

      if (rememberMe) {
        localStorage.setItem('admin_user', JSON.stringify(user))
      } else {
        sessionStorage.setItem('admin_user', JSON.stringify(user))
      }

      return {
        success: true,
        user,
        message: 'Login successful'
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Login failed. Please try again.'
      }
    }
  }

  async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const user = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user')
      if (!user) return null

      const userData = JSON.parse(user)
      
      // Verify user still exists in database
      const usersRef = collection(db, 'admin_users')
      const q = query(usersRef, where('email', '==', userData.email))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        this.logout()
        return null
      }

      const dbUser = querySnapshot.docs[0].data()
      if (!dbUser.isActive) {
        this.logout()
        return null
      }

      return userData
    } catch (error) {
      console.error('Get current user error:', error)
      this.logout()
      return null
    }
  }

  async requireAuth(): Promise<AdminUser> {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }
    return user
  }

  async requireSuperAdmin(): Promise<AdminUser> {
    const user = await this.requireAuth()
    if (user.role !== 'super_admin') {
      throw new Error('Super admin access required')
    }
    return user
  }

  async logout(): Promise<void> {
    localStorage.removeItem('admin_user')
    sessionStorage.removeItem('admin_user')
  }

  async createAdmin(email: string, password: string, role: 'admin' | 'super_admin' = 'admin'): Promise<boolean> {
    try {
      // Check if user already exists
      const usersRef = collection(db, 'admin_users')
      const q = query(usersRef, where('email', '==', email.toLowerCase()))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        throw new Error('Admin user already exists')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      const newAdmin = {
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        isActive: true,
        lastLogin: new Date(),
        loginAttempts: 0,
        lockoutUntil: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await setDoc(doc(collection(db, 'admin_users')), newAdmin)
      return true

    } catch (error) {
      console.error('Create admin error:', error)
      throw error
    }
  }
}

export const simpleAuth = new SimpleAuth()
