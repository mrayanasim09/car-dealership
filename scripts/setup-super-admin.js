#!/usr/bin/env node

/**
 * Setup Super Admin Script
 * This script creates the initial super admin user for the car dealership
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, doc, setDoc } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

// Firebase configuration - you'll need to add your actual Firebase config here
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('🔧 Setting up AM Tycoons Super Admin Account...\n');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Super admin credentials
const superAdminEmail = 'mrayanasim09@gmail.com';
const superAdminPassword = 'SuperAdmin@123456';

async function setupSuperAdmin() {
  try {
    console.log('📧 Super Admin Email:', superAdminEmail);
    console.log('🔑 Super Admin Password:', superAdminPassword);
    console.log('');

    // Check if super admin already exists
    const usersRef = collection(db, 'admin_users');
    const q = query(usersRef, where('email', '==', superAdminEmail.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('⚠️  Super admin account already exists!');
      console.log('   You can use the existing credentials to login.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(superAdminPassword, 12);
    console.log('✅ Generated secure password hash');

    // Create super admin user
    const superAdmin = {
      email: superAdminEmail.toLowerCase(),
      password: hashedPassword,
      role: 'super_admin',
      permissions: [
        'view_dashboard',
        'manage_cars',
        'manage_reviews',
        'manage_admins',
        'view_analytics',
        'manage_settings',
        'view_sessions',
        'view_debug'
      ],
      isActive: true,
      lastLogin: new Date(),
      loginAttempts: 0,
      lockoutUntil: null,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to Firestore
    await setDoc(doc(collection(db, 'admin_users')), superAdmin);
    
    console.log('✅ Super admin account created successfully!');
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('   Email:', superAdminEmail);
    console.log('   Password:', superAdminPassword);
    console.log('');
    console.log('🚀 You can now login to the admin portal at:');
    console.log('   /admin/login');
    console.log('');
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('1. Change the default password immediately after first login');
    console.log('2. Keep these credentials secure');
    console.log('3. The system will send verification codes to your email');
    console.log('4. Check the console logs for verification codes during testing');

  } catch (error) {
    console.error('❌ Error setting up super admin:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure Firebase is properly configured');
    console.log('2. Check that all environment variables are set');
    console.log('3. Ensure Firebase Admin SDK has proper permissions');
  }
}

// Run the setup
setupSuperAdmin();
