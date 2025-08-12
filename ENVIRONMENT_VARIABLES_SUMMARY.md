# 🔐 ENVIRONMENT VARIABLES FOR PRODUCTION
## AM Tycoons Inc. Car Dealership

### ✅ **GENERATED SECURE KEYS**

Copy these exact values to your **Vercel Dashboard** → Project Settings → Environment Variables:

---

## 🔑 **SECURITY KEYS (CRITICAL)**

```bash
# JWT Secret (64-byte hex)
JWT_SECRET=9924de313efedb513809af814d6b0f31d7bbee2ed41fd9640c79645e9db8a86f089b9cc14a648e5b526c98bf2f2447f2781aa128a87c4e1b38e674

# Session Secret (64-byte hex)
SESSION_SECRET=1b2353d48a7cc9a851b50e20a7b05093ab3df60ea3dd1167104e570f48c6e9ed3f02e9c825cc3355e172cdb252c9f8cc119db7af83eba7d8911206a7bd6dcc21

# Encryption Key (32-byte hex)
ENCRYPTION_KEY=556fbabda96a0aaeb7590976b37cbd03444c76a84c045402171b44dc3772ebac
```

---

## 📱 **PUSH NOTIFICATIONS (VAPID KEYS)**

```bash
# VAPID Public Key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BGA15dCG1WSq_xvDiYAWzSlxFXw85jNSzXKJBZs2HYg2MqkgH7Ql58j92ZSo1QFGGnu4GOEgWoPAU85BfrH1zic

# VAPID Private Key
VAPID_PRIVATE_KEY=4wPRc23KYJwa_pdr0LWRHbm2LVWEVuxKyC5xcCwmIF0

# VAPID Subject (your email)
VAPID_SUBJECT=mailto:admin@amtycoonsinc.com
```

---

## 🔥 **FIREBASE CONFIGURATION**

Replace with your actual Firebase project values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## ☁️ **VERCEL BLOB STORAGE**

```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

---

## 👨‍💼 **ADMIN CONFIGURATION**

```bash
SUPER_ADMIN_EMAIL=admin@amtycoonsinc.com
DEFAULT_ADMIN_PASSWORD=secure_default_password_here
ADMIN_EMAILS=admin1@amtycoonsinc.com,admin2@amtycoonsinc.com
```

---

## 🔒 **SECURITY & RATE LIMITING**

```bash
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
CORS_ORIGIN=https://your-domain.vercel.app
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://www.your-domain.vercel.app
```

---

## 📊 **FEATURE FLAGS**

```bash
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_TWO_FACTOR_AUTH=true
ENABLE_ANALYTICS=true
ENABLE_CHATBOT=true
ENABLE_REVIEWS=true
```

---

## 🚀 **DEPLOYMENT COMMAND**

After setting all environment variables in Vercel Dashboard:

```bash
vercel --prod
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] JWT_SECRET set with 64-byte hex value
- [ ] SESSION_SECRET set with 64-byte hex value  
- [ ] ENCRYPTION_KEY set with 32-byte hex value
- [ ] VAPID keys generated and set
- [ ] Firebase configuration updated
- [ ] Vercel Blob token configured
- [ ] Admin email and password set
- [ ] Feature flags enabled
- [ ] CORS origins configured for your domain

---

**🎯 Your application is now ready for production deployment!**
