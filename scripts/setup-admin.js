const crypto = require('crypto');
const bcrypt = require('bcryptjs');

console.log('🔧 AM Tycoons Admin Portal Setup\n');

// Default admin credentials
const defaultEmail = 'admin@amtycoons.com';
const defaultPassword = 'Admin@123456';

// Hash the password
bcrypt.hash(defaultPassword, 12).then(hash => {
  console.log('✅ Admin credentials ready:\n');
  
  console.log('📧 Admin Email:', defaultEmail);
  console.log('🔑 Admin Password:', defaultPassword);
  console.log('🔒 Password Hash:', hash);
  console.log('');
  
  console.log('🚀 Next Steps:');
  console.log('1. Deploy to Vercel with the updated configuration');
  console.log('2. Add all environment variables to Vercel dashboard');
  console.log('3. Access admin setup at: https://your-domain.vercel.app/admin/setup');
  console.log('4. Create admin account with the credentials above');
  console.log('5. Login at: https://your-domain.vercel.app/admin/login');
  console.log('');
  
  console.log('📋 Environment Variables to add to Vercel:');
  console.log('Firebase Configuration:');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app');
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
  console.log('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id');
  console.log('');
  console.log('Cloudinary Configuration:');
  console.log('CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name');
  console.log('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.log('NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key');
  console.log('CLOUDINARY_API_SECRET=your_api_secret');
  console.log('');
  console.log('NextAuth Configuration:');
  console.log('NEXTAUTH_SECRET=your_nextauth_secret_here');
  console.log('NEXTAUTH_URL=https://your-domain.vercel.app');
  console.log('');
  console.log('Admin Configuration:');
  console.log('NEXT_PUBLIC_ADMIN_EMAILS=admin@amtycoons.com,your_email@gmail.com');
  console.log('ADMIN_EMAILS=admin@amtycoons.com,your_email@gmail.com');
  console.log('');
  console.log('Analytics:');
  console.log('NEXT_PUBLIC_GA_ID=your_ga_id');
  console.log('');
  
  console.log('⚠️  IMPORTANT:');
  console.log('1. Change the default password after first login');
  console.log('2. Update NEXTAUTH_URL to your actual domain');
  console.log('3. Keep these credentials secure');
  console.log('4. Never commit real credentials to version control');
  console.log('');
  
  console.log('🎉 Your admin portal is ready to deploy!');
});
