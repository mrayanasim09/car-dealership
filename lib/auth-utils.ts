import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth, ensureFirebaseInitialized } from '@/lib/firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

export interface AdminUser {
  id: string
  email: string
  role: 'admin'
  lastLogin: Date
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    if (!auth) {
      throw new Error('Firebase Auth not initialized')
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Check if user is admin (you can add additional admin email validation here)
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@amtycoons.com', 'mrayanasim09@gmail.com']
    
    if (!adminEmails.includes(user.email || '')) {
      await signOut(auth)
      return null
    }
    
    return {
      id: user.uid,
      email: user.email || '',
      role: 'admin',
      lastLogin: new Date()
    }
  } catch (error) {
    console.error('Firebase auth error:', error)
    return null
  }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    // Ensure Firebase is initialized
    await ensureFirebaseInitialized()
    
    // Ensure auth is properly initialized
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.error('Auth object is not properly initialized')
      return null
    }

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth!, (user) => {
        unsubscribe()
        
        if (!user) {
          resolve(null)
          return
        }
        
        // Check if user is admin
        const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@amtycoons.com', 'mrayanasim09@gmail.com']
        
        if (!adminEmails.includes(user.email || '')) {
          resolve(null)
          return
        }
        
        resolve({
          id: user.uid,
          email: user.email || '',
          role: 'admin',
          lastLogin: new Date()
        })
      })
    })
  } catch (error) {
    console.error('Error getting current admin:', error)
    return null
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin()
  
  if (!admin) {
    redirect('/admin/login')
  }
  
  return admin
}

export async function logoutAdmin(): Promise<void> {
  try {
    if (!auth) {
      throw new Error('Firebase Auth not initialized')
    }
    
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export function createAuthToken(user: AdminUser): string {
  // For Firebase Auth, we'll use the user's UID as the token
  const tokenData = {
    uid: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  
  return btoa(JSON.stringify(tokenData))
}

export function verifyAuthToken(token: string): AdminUser | null {
  try {
    const decoded = JSON.parse(atob(token))
    
    // Check if token is expired
    if (decoded.exp && Date.now() > decoded.exp) {
      return null
    }
    
    return {
      id: decoded.uid,
      email: decoded.email,
      role: decoded.role,
      lastLogin: new Date()
    }
  } catch {
    return null
  }
}

// Export authManager for backward compatibility
export const authManager = {
  authenticateAdmin,
  getCurrentAdmin,
  requireAdmin,
  logoutAdmin,
  createAuthToken,
  verifyAuthToken
} 