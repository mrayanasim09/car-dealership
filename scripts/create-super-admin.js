const crypto = require('crypto');
const bcrypt = require('bcryptjs');

console.log('🔧 Setting up AM Tycoons Admin Portal...\n');

// Generate secure secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const sessionSecret = crypto.randomBytes(32).toString('hex');
const cookieSecret = crypto.randomBytes(32).toString('hex');
const totpSecret = crypto.randomBytes(20).toString('base64').replace(/[^A-Z2-7]/g, '').substring(0, 32);

// Default admin credentials
const defaultEmail = 'admin@amtycoons.com';
const defaultPassword = 'Admin@123456';

// Hash the password
bcrypt.hash(defaultPassword, 12).then(hash => {
  console.log('✅ Generated secure admin credentials:\n');
  
  console.log('📧 Admin Email:', defaultEmail);
  console.log('🔑 Admin Password:', defaultPassword);
  console.log('🔒 Password Hash:', hash);
  console.log('');
  
  console.log('🔐 Environment Variables to add to Vercel:\n');
  console.log('Firebase Configuration:');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
  console.log('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id');
  console.log('');
  console.log('Firebase Admin SDK:');
  console.log('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
  console.log('FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com');
  console.log('');
  console.log('Security Configuration:');
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log('JWT_EXPIRES_IN=30m');
  console.log('BCRYPT_ROUNDS=12');
  console.log(`ADMIN_EMAIL=${defaultEmail}`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log(`SESSION_SECRET=${sessionSecret}`);
  console.log(`COOKIE_SECRET=${cookieSecret}`);
  console.log('RATE_LIMIT_WINDOW_MS=900000');
  console.log('RATE_LIMIT_MAX_REQUESTS=5');
  console.log('ENABLE_2FA=false');
  console.log(`TOTP_SECRET=${totpSecret}`);
  console.log('');
  
  console.log('⚠️  IMPORTANT SECURITY NOTES:');
  console.log('1. Change the default password immediately after first login');
  console.log('2. Store these secrets securely in Vercel environment variables');
  console.log('3. Enable 2FA for additional security');
  console.log('4. Use HTTPS in production');
  console.log('5. Regularly rotate JWT secrets');
  console.log('6. Set up Firebase Admin SDK properly');
  console.log('');
  
  console.log('🚀 Your secure admin portal is ready!');
  console.log('   Login at: https://your-domain.vercel.app/admin/login');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Add all environment variables to Vercel dashboard');
  console.log('2. Deploy the application');
  console.log('3. Access admin portal and change default password');
  console.log('4. Set up Firebase Admin SDK in Firebase console');
  console.log('5. Test all admin functionality');
});
