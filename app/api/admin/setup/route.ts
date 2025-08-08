import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore'
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import bcrypt from 'bcryptjs'

// Server-safe Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase for server-side
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, role = 'super_admin' } = await request.json()
    
    // Get Firestore instance
    const db = getFirestore(app)
    
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 })
    }
    
    // Check if admin already exists
    const usersRef = collection(db, 'admin_users')
    const q = query(usersRef, where('email', '==', email.toLowerCase()))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create admin user
    const adminUser = {
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

    const docRef = doc(collection(db, 'admin_users'))
    await setDoc(docRef, adminUser)

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      userId: docRef.id
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
