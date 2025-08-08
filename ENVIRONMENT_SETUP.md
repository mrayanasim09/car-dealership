# 🔐 ENVIRONMENT SETUP GUIDE

## 🚨 CRITICAL SECURITY ALERT

**Your credentials have been exposed!** You must immediately:

1. **Revoke all exposed credentials**
2. **Generate new API keys and secrets**
3. **Update your environment variables**
4. **Never share credentials in plain text**

---

## 📋 ENVIRONMENT VARIABLES SETUP

### **1. Create `.env.local` File**

Create a `.env.local` file in your project root with the following structure:

```bash
# =========================
# 🔥 Firebase Configuration
# =========================
NEXT_PUBLIC_FIREBASE_API_KEY=your_new_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# =========================
# 🌥️ Cloudinary Configuration
# =========================
CLOUDINARY_URL=cloudinary://your_new_api_key:your_new_api_secret@your_cloud_name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_new_api_key
CLOUDINARY_API_SECRET=your_new_api_secret

# =========================
# 🔐 NextAuth Config
# =========================
NEXTAUTH_SECRET=your_new_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# =========================
# 👑 Admin Emails
# =========================
NEXT_PUBLIC_ADMIN_EMAILS=admin@amtycoons.com,your_email@gmail.com
ADMIN_EMAILS=admin@amtycoons.com,your_email@gmail.com

# =========================
# 📊 Google Analytics (GA4)
# =========================
NEXT_PUBLIC_GA_ID=your_ga_id
```

---

## 🔒 SECURITY STEPS TO TAKE IMMEDIATELY

### **1. Firebase Security**

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com
   - Select your project: `am-tycoon`

2. **Revoke Old API Key:**
   - Go to Project Settings → General
   - Find the exposed API key: `AIzaSyAENFM7XawnBq0XARvkIHW5jJKIZ9vvtec`
   - Click "Regenerate" to create a new key

3. **Update Environment Variables:**
   - Copy the new API key
   - Update your `.env.local` file

### **2. Cloudinary Security**

1. **Go to Cloudinary Dashboard:**
   - Visit: https://cloudinary.com/console
   - Login to your account

2. **Generate New Credentials:**
   - Go to Settings → Access Keys
   - Click "Generate new API key"
   - Save the new key and secret

3. **Update Environment Variables:**
   - Update `CLOUDINARY_API_SECRET` with new secret
   - Update `NEXT_PUBLIC_CLOUDINARY_API_KEY` with new key

### **3. NextAuth Security**

1. **Generate New Secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Update NEXTAUTH_SECRET:**
   - Replace the old secret with the new one
   - Use different secrets for development and production

---

## 🚀 DEPLOYMENT ENVIRONMENT SETUP

### **For Vercel Deployment:**

1. **Add Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add each variable from your `.env.local` file

2. **Production vs Development:**
   - Use different credentials for production
   - Never use development credentials in production

### **For Other Platforms:**

1. **Heroku:**
   ```bash
   heroku config:set NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   heroku config:set CLOUDINARY_API_SECRET=your_secret
   ```

2. **Netlify:**
   - Go to Site Settings → Environment Variables
   - Add each variable

---

## 🔍 VERIFICATION STEPS

### **1. Test Firebase Connection:**
```bash
npm run dev
# Check browser console for Firebase initialization
```

### **2. Test Cloudinary Upload:**
- Go to admin portal
- Try uploading an image
- Verify it appears in Cloudinary dashboard

### **3. Test Admin Authentication:**
- Try logging into admin portal
- Verify admin access works

---

## 🛡️ SECURITY BEST PRACTICES

### **1. Credential Management:**
- ✅ Never commit `.env.local` to version control
- ✅ Use different credentials for dev/prod
- ✅ Regularly rotate API keys
- ✅ Use environment-specific configuration

### **2. Access Control:**
- ✅ Limit admin email access
- ✅ Use strong passwords
- ✅ Enable 2FA where possible
- ✅ Monitor access logs

### **3. Monitoring:**
- ✅ Set up Firebase usage alerts
- ✅ Monitor Cloudinary usage
- ✅ Check for unauthorized access
- ✅ Regular security audits

---

## 🆘 EMERGENCY CONTACTS

### **If Credentials Are Compromised:**

1. **Firebase Support:**
   - https://firebase.google.com/support

2. **Cloudinary Support:**
   - https://support.cloudinary.com

3. **NextAuth Support:**
   - https://next-auth.js.org/getting-started/introduction

---

## ✅ CHECKLIST

- [ ] Revoke old Firebase API key
- [ ] Generate new Cloudinary credentials
- [ ] Create new NextAuth secret
- [ ] Update `.env.local` file
- [ ] Test all integrations
- [ ] Deploy with new credentials
- [ ] Monitor for unauthorized access
- [ ] Set up security alerts

---

## 📞 SUPPORT

If you need help with any of these steps, please:
1. Follow the security steps immediately
2. Contact the respective service support
3. Never share new credentials in plain text
4. Use secure channels for credential sharing

**Remember: Security is everyone's responsibility!**
