const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, query, where, getDocs } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

// Firebase configuration (you'll need to add your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('🔧 Setting up Initial Super Admin for AM Tycoons Inc...\n');

async function setupSuperAdmin() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Default super admin credentials
    const defaultEmail = 'superadmin@amtycoonsinc.com';
    const defaultPassword = 'SuperAdmin@2024!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    // Check if super admin already exists
    const usersRef = collection(db, 'admin_users');
    const q = query(usersRef, where('email', '==', defaultEmail.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('⚠️  Super admin already exists!');
      console.log('📧 Email:', defaultEmail);
      console.log('🔑 If you need to reset the password, please do it manually.');
      return;
    }

    // Create super admin user
    const superAdmin = {
      email: defaultEmail.toLowerCase(),
      password: hashedPassword,
      role: 'super_admin',
      permissions: [
        'view_dashboard',
        'manage_cars',
        'manage_reviews',
        'manage_admins',
        'view_analytics',
        'manage_settings'
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

    console.log('✅ Super Admin created successfully!\n');
    console.log('📧 Email:', defaultEmail);
    console.log('🔑 Password:', defaultPassword);
    console.log('👑 Role: Super Admin');
    console.log('🔐 Permissions: Full system access');
    console.log('');
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('1. Change the default password immediately after first login');
    console.log('2. The email verification system is mandatory for all logins');
    console.log('3. You will receive a 6-digit code via email for verification');
    console.log('4. Store these credentials securely');
    console.log('');
    console.log('🚀 Your super admin account is ready!');
    console.log('   Login at: https://your-domain.vercel.app/admin/login');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Deploy the application to Vercel');
    console.log('2. Access admin portal with the credentials above');
    console.log('3. Complete email verification process');
    console.log('4. Change the default password');
    console.log('5. Create additional admin users as needed');

  } catch (error) {
    console.error('❌ Error setting up super admin:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure Firebase is properly configured');
    console.log('2. Check that all environment variables are set');
    console.log('3. Ensure Firestore database is created');
    console.log('4. Verify Firebase project permissions');
  }
}

// Run the setup
setupSuperAdmin();
