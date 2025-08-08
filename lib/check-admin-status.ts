import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { app } from './firebase'

export async function checkAdminStatus(email: string, password: string) {
  try {
    if (!app) {
      throw new Error('Firebase app not initialized')
    }
    
    const auth = getAuth(app)
    const db = getFirestore(app)

    // Step 1: Try to sign in with Firebase Auth
    console.log('🔍 Step 1: Attempting Firebase Auth sign in...')
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    console.log('✅ Firebase Auth successful!')
    console.log('User UID:', user.uid)
    console.log('User Email:', user.email)

    // Step 2: Check if user exists in Firestore admins collection
    console.log('🔍 Step 2: Checking Firestore admins collection...')
    const adminDoc = await getDoc(doc(db, 'admins', user.uid))
    
    if (adminDoc.exists()) {
      const adminData = adminDoc.data()
      console.log('✅ Admin document found!')
      console.log('Admin data:', adminData)
      console.log('Is Active:', adminData.isActive)
      console.log('Role:', adminData.role)
      console.log('Permissions:', adminData.permissions)
      
      return {
        success: true,
        firebaseAuth: true,
        firestoreAdmin: true,
        adminData: {
          role: adminData.role,
          isActive: adminData.isActive,
          permissions: adminData.permissions || []
        },
        message: 'User is properly configured as admin'
      }
    } else {
      console.log('❌ No admin document found in Firestore')
      console.log('This means the user exists in Firebase Auth but not in the admins collection')
      
      return {
        success: false,
        firebaseAuth: true,
        firestoreAdmin: false,
        message: 'User exists in Firebase Auth but not in admins collection. Use /admin/add-admin to fix this.'
      }
    }

  } catch (error) {
    console.error('❌ Error checking admin status:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('user-not-found')) {
        return {
          success: false,
          firebaseAuth: false,
          firestoreAdmin: false,
          message: 'User not found in Firebase Auth'
        }
      } else if (error.message.includes('wrong-password')) {
        return {
          success: false,
          firebaseAuth: false,
          firestoreAdmin: false,
          message: 'Incorrect password'
        }
      } else {
        return {
          success: false,
          firebaseAuth: false,
          firestoreAdmin: false,
          message: error.message
        }
      }
    }
    
    return {
      success: false,
      firebaseAuth: false,
      firestoreAdmin: false,
      message: 'Unknown error occurred'
    }
  }
}
