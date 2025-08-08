import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { initializeFirebase } from '@/lib/firebase'

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

export async function POST(request: NextRequest) {
  try {
    const { email, uid, role = 'admin' } = await request.json()

    if (!email || !uid) {
      return NextResponse.json({ error: 'Email and UID are required' }, { status: 400 })
    }

    // Initialize Firebase
    await initializeFirebase()
    
    // Get Firestore instance
    const db = getFirestore()
    
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 })
    }

    // Create admin user document with the provided UID
    const adminUser: AdminUser = {
      uid: uid,
      email: email,
      role: role as 'admin' | 'super_admin',
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

    // Check if admin already exists
    const existingAdmin = await getDoc(doc(db, 'admins', adminUser.uid))
    if (existingAdmin.exists()) {
      return NextResponse.json({ error: 'Admin user already exists' }, { status: 409 })
    }

    // Save to Firestore
    await setDoc(doc(db, 'admins', adminUser.uid), adminUser)

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully',
      admin: adminUser 
    })

  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json({ 
      error: 'Failed to create admin user' 
    }, { status: 500 })
  }
}
