# Firebase Setup Guide

## Current Issue
Your application is experiencing Firebase authentication errors (`Firebase: Error (auth/argument-error)`) because the Firebase configuration is missing or invalid.

## Quick Fix
The application has been updated to handle missing Firebase configuration gracefully and will run in demo mode. However, to enable full Firebase functionality, you need to set up proper environment variables.

## Steps to Fix

### 1. Create Environment File
Create a `.env.local` file in your project root with the following content:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@amtycoons.com,mrayanasim09@gmail.com
ADMIN_EMAILS=admin@amtycoons.com,mrayanasim09@gmail.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Security
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 2. Get Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app (or create one)
6. Copy the configuration values

### 3. Restart Development Server
After creating the `.env.local` file, restart your development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Current Status
- ✅ Firebase configuration now has fallback values
- ✅ Auth initialization is more robust
- ✅ Error handling improved
- ✅ Debug panel shows Firebase status
- ✅ Application runs in demo mode without Firebase

## Debug Panel
Click the "Debug" button in the top-left corner to see:
- Firebase initialization status
- Environment variable status
- Error details
- Checkpoint progress

## Next Steps
1. Set up Firebase project and get configuration
2. Add configuration to `.env.local`
3. Test authentication functionality
4. Deploy with proper environment variables

The application will continue to work in demo mode until you provide valid Firebase credentials. 