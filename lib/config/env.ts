// Environment configuration with validation
const env = {
  // Firebase Configuration
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
  },

  // Cloudinary Configuration
  cloudinary: {
    url: process.env.CLOUDINARY_URL!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!
  },

  // NextAuth Configuration
  auth: {
    secret: process.env.NEXTAUTH_SECRET!,
    url: process.env.NEXTAUTH_URL!
  },

  // Admin Configuration
  admin: {
    emails: (process.env.ADMIN_EMAILS || '').split(','),
    publicEmails: (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',')
  },

  // Analytics Configuration
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID
  },

  // Environment Type
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  // Validation function
  validate() {
    const requiredVars = [
      // Firebase
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
      'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
      
      // Cloudinary
      'CLOUDINARY_URL',
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
      'NEXT_PUBLIC_CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
      
      // NextAuth
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      
      // Admin
      'ADMIN_EMAILS',
      'NEXT_PUBLIC_ADMIN_EMAILS'
    ];

    const missing = requiredVars.filter(
      (key) => !process.env[key]
    );

    if (missing.length > 0) {
      console.warn(`Missing environment variables: ${missing.join(', ')}`);
    }

    return true;
  },

  // Get specific admin status
  isAdminEmail(email: string): boolean {
    return this.admin.emails.includes(email);
  },

  // Get Firebase config for client
  getFirebaseConfig() {
    return this.firebase;
  },

  // Get Cloudinary config
  getCloudinaryConfig() {
    return {
      cloudName: this.cloudinary.cloudName,
      apiKey: this.cloudinary.apiKey
    };
  }
};

// Validate environment variables
env.validate();

export default env;
