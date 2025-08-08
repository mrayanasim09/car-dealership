import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from './firebase'

interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  lastLogin: Date;
  isActive: boolean;
  twoFactorEnabled: boolean;
  failedLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function addExistingUserAsAdmin(email: string, password: string, role: 'admin' | 'super_admin' = 'admin'): Promise<AdminUser> {
  try {
    if (!app) {
      throw new Error('Firebase app not initialized')
    }
    
    const auth = getAuth(app)
    const db = getFirestore(app)

    // Sign in with existing Firebase Auth user
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Check if admin already exists
    const existingAdmin = await getDoc(doc(db, 'admins', user.uid))
    if (existingAdmin.exists()) {
      throw new Error('Admin user already exists')
    }

    // Create admin user document
    const adminUser: AdminUser = {
      uid: user.uid,
      email: user.email!,
      role,
      permissions: role === 'super_admin' 
        ? ['read', 'write', 'delete', 'manage_users', 'manage_settings']
        : ['read', 'write'],
      lastLogin: new Date(),
      isActive: true,
      twoFactorEnabled: false,
      failedLoginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Save to Firestore
    await setDoc(doc(db, 'admins', user.uid), adminUser)

    return adminUser
  } catch (error) {
    console.error('Error adding existing user as admin:', error)
    throw error
  }
}

export async function checkIfUserIsAdmin(uid: string): Promise<boolean> {
  try {
    if (!app) {
      throw new Error('Firebase app not initialized')
    }
    
    const db = getFirestore(app)
    const adminDoc = await getDoc(doc(db, 'admins', uid))
    return adminDoc.exists()
  } catch (error) {
    console.error('Error checking if user is admin:', error)
    return false
  }
}
