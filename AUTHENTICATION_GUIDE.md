# Production-Ready Firebase Authentication System

## Overview

This guide documents the complete authentication system for Premia Realty, built on Firebase Authentication with support for multiple sign-in methods, account linking, and guest mode.

## Tech Stack

**Frontend:**
- React 19
- React Router v6
- Firebase SDK v10+
- js-cookie for token management

**Backend:**
- Firebase Authentication (Google's production-grade auth service)
- Cloud Firestore (NoSQL database)
- Firebase Cloud Functions (optional, for custom logic)

**Why Firebase?**
- Production-grade infrastructure with 99.95% SLA
- Automatic scaling and security updates
- Built-in OAuth providers (Google, Facebook, etc.)
- SMS OTP with global carrier support
- JWT token management handled automatically
- GDPR compliant and SOC 2 certified
- No need to manage password hashing, token rotation, or session storage

---

## Authentication Methods

### 1. Email + Password
- Traditional signup/login
- Password requirements: minimum 6 characters (Firebase default)
- Email verification available
- Password reset via email

### 2. Google OAuth
- One-click sign-in with Google account
- Automatically extracts:
  - Email address
  - Given name (first name)
  - Family name (last name)
  - Profile picture URL
- No password required

### 3. Phone Number + SMS OTP
- Enter phone number with country code
- Receive 6-digit verification code via SMS
- Enter code to verify and sign in
- reCAPTCHA protection against abuse
- Global SMS delivery through Firebase

### 4. Guest Mode (Anonymous)
- Continue without account creation
- Limited functionality (can browse, save preferences locally)
- Can upgrade to permanent account later
- All data preserved during upgrade

---

## Database Schema (Firestore)

### Collection: `users`
```javascript
{
  uid: string,                    // Firebase Auth UID (primary key)
  email: string | null,           // Email address (if provided)
  phone: string | null,           // Phone number (if provided)
  fullName: string,               // User's full name
  firstName: string | null,       // From Google OAuth or manual entry
  lastName: string | null,        // From Google OAuth or manual entry
  photoURL: string | null,        // Profile picture URL
  isAnonymous: boolean,           // True if guest account
  linkedProviders: [              // Array of linked auth methods
    {
      providerId: string,         // "password", "google.com", "phone"
      providerData: object,       // Provider-specific data
      linkedAt: timestamp
    }
  ],
  contactType: string,            // "email" or "phone" or "google"
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLoginAt: timestamp
}
```

### Collection: `users/{uid}/savedProperties`
```javascript
{
  propertyId: string,
  title: string,
  location: string,
  price: string,
  image: string,
  savedAt: timestamp
}
```

### Collection: `users/{uid}/contactRequests`
```javascript
{
  contactId: string,
  message: string,
  propertyId: string | null,
  propertyTitle: string | null,
  createdAt: timestamp
}
```

---

## Security Architecture

### Token Management
- **Access Tokens**: Firebase ID tokens (JWT), 1-hour expiry
- **Refresh Tokens**: Stored in HTTP-only cookies (optional) or localStorage
- **Token Refresh**: Automatic via Firebase SDK
- **Secure Storage**:
  - Access tokens: Memory (not localStorage for XSS protection)
  - Refresh tokens: HTTP-only cookies (recommended) or secure localStorage

### Session Management
```javascript
// Firebase handles token refresh automatically
firebase.auth().onIdTokenChanged(async (user) => {
  if (user) {
    const token = await user.getIdToken();
    // Use token for API requests
  }
});
```

### Security Best Practices Implemented
✅ **HTTPS Only**: All Firebase connections use HTTPS
✅ **CSRF Protection**: Firebase SDK handles CSRF tokens
✅ **Rate Limiting**: Firebase has built-in rate limiting for auth endpoints
✅ **Password Hashing**: Automatically uses scrypt (stronger than bcrypt)
✅ **Input Validation**: Client and server-side validation
✅ **Email Verification**: Available for email/password accounts
✅ **reCAPTCHA**: Automatic bot protection for phone auth
✅ **Security Rules**: Firestore rules restrict unauthorized access

---

## Implementation Guide

### Step 1: Firebase Console Setup

#### Enable Authentication Providers

1. **Go to Firebase Console** → Authentication → Sign-in method

2. **Enable Email/Password**
   - ✅ Email/Password
   - ✅ Email link (passwordless sign-in) - optional

3. **Enable Google OAuth**
   - ✅ Google
   - Set project support email
   - Configure OAuth consent screen
   - Note: Web client ID and secret auto-configured

4. **Enable Phone Authentication**
   - ✅ Phone
   - Add test phone numbers for development (optional)
   - Verify your identity (required for production)
   - SMS quota: 10,000/month free, then pay-as-you-go

5. **Enable Anonymous (Guest Mode)**
   - ✅ Anonymous

#### Configure OAuth Consent Screen (Google Cloud Console)

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Choose "External" (for public app) or "Internal" (for organization only)
3. Fill in:
   - App name: "Premia Realty"
   - User support email: your email
   - App logo: upload logo
   - Developer contact: your email
4. Scopes: Add `.../auth/userinfo.email` and `.../auth/userinfo.profile`
5. Add test users during development
6. Submit for verification before production launch

#### Firebase Configuration
```javascript
// src/firebase.js (already exists, may need OAuth config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

### Step 2: Firestore Security Rules

Update your Firestore rules to handle all auth methods:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() &&
             request.auth.token.admin == true;
    }

    function isNotAnonymous() {
      return isSignedIn() &&
             !request.auth.token.firebase.sign_in_provider == 'anonymous';
    }

    // Users collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isOwner(userId) || isAdmin();

      // Users can create their own profile on first login
      allow create: if isSignedIn() && request.auth.uid == userId;

      // Users can update their own profile (but not isAnonymous flag manually)
      allow update: if isOwner(userId) &&
                       (!request.resource.data.diff(resource.data).affectedKeys()
                         .hasAny(['uid', 'createdAt']));

      // Only admins can delete users
      allow delete: if isAdmin();

      // Subcollections
      match /savedProperties/{propertyId} {
        allow read, write: if isOwner(userId);
      }

      match /contactRequests/{requestId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
    }

    // Properties collection
    match /properties/{propertyId} {
      // Anyone can read non-deleted properties
      allow read: if resource.data.deletedAt == null || isAdmin();

      // Only admins can write
      allow write: if isAdmin();
    }

    // Contacts collection
    match /contacts/{contactId} {
      // Anyone can create contact requests
      allow create: if isSignedIn() || true; // Allow anonymous contacts

      // Only admins can read/update/delete
      allow read, update, delete: if isAdmin();
    }
  }
}
```

---

### Step 3: Environment Variables

Create `.env.local` (never commit this):

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# OAuth Configuration (if needed for custom flows)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Phone Authentication (test numbers for dev)
VITE_TEST_PHONE_NUMBER=+1234567890
VITE_TEST_PHONE_CODE=123456

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api

# reCAPTCHA (for phone auth)
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

---

## Code Implementation

### Core Files Structure
```
src/
├── services/
│   ├── authService.js          # All auth operations
│   └── accountLinkingService.js # Account linking logic
├── context/
│   └── AuthContext.jsx         # Auth state management
├── components/
│   ├── GoogleSignInButton.jsx  # Google OAuth button
│   ├── PhoneAuthModal.jsx      # Phone OTP UI
│   └── GuestUpgradeModal.jsx   # Guest to permanent account
├── pages/
│   ├── Login.jsx               # Enhanced login page
│   ├── Signup.jsx              # Enhanced signup page
│   └── AccountLinking.jsx      # Link/unlink providers
└── hooks/
    ├── useAuth.js              # Auth hook
    └── useAuthProviders.js     # Provider management hook
```

---

## API Endpoints (Firebase Client SDK)

All authentication happens client-side through Firebase SDK. No custom backend endpoints needed for basic auth.

### Email/Password Auth
```javascript
// Signup
await createUserWithEmailAndPassword(auth, email, password);

// Login
await signInWithEmailAndPassword(auth, email, password);

// Password reset
await sendPasswordResetEmail(auth, email);
```

### Google OAuth
```javascript
const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

// Sign in with popup
const result = await signInWithPopup(auth, provider);

// Sign in with redirect (mobile-friendly)
await signInWithRedirect(auth, provider);
const result = await getRedirectResult(auth);
```

### Phone Authentication
```javascript
// Setup reCAPTCHA verifier
const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: () => {} // resolved
}, auth);

// Send OTP
const confirmationResult = await signInWithPhoneNumber(
  auth,
  phoneNumber,
  recaptchaVerifier
);

// Verify OTP
await confirmationResult.confirm(verificationCode);
```

### Anonymous (Guest) Auth
```javascript
await signInAnonymously(auth);
```

### Account Linking
```javascript
// Link email/password
const credential = EmailAuthProvider.credential(email, password);
await linkWithCredential(currentUser, credential);

// Link Google
const googleProvider = new GoogleAuthProvider();
await linkWithPopup(currentUser, googleProvider);

// Link phone
const phoneCredential = PhoneAuthProvider.credential(verificationId, code);
await linkWithCredential(currentUser, phoneCredential);

// Convert anonymous to permanent
const credential = EmailAuthProvider.credential(email, password);
await linkWithCredential(anonymousUser, credential);
```

---

## Testing Strategy

### Unit Tests
```javascript
// Test auth functions
describe('Authentication Service', () => {
  test('should signup with email/password', async () => {
    // Mock Firebase auth
  });

  test('should handle Google OAuth flow', async () => {
    // Mock Google provider
  });

  test('should link phone to existing account', async () => {
    // Test account linking
  });
});
```

### Integration Tests
- Test complete signup → login → logout flow
- Test account linking across providers
- Test guest upgrade flow
- Test token refresh mechanism

### Security Tests
- Attempt unauthorized access to user data
- Test rate limiting on auth endpoints
- Verify token expiration handling
- Test CSRF protection

---

## Deployment Checklist

### Pre-Production
- [ ] Enable email verification for production
- [ ] Configure custom email templates (Firebase Console)
- [ ] Set up SMS quota increase (if needed)
- [ ] Complete Google OAuth verification
- [ ] Test all auth flows in staging
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure Firebase App Check (bot protection)
- [ ] Set up backup and recovery procedures

### Production Configuration
- [ ] Use HTTPS everywhere (Firebase requires it)
- [ ] Set proper CORS origins in Firebase Console
- [ ] Enable audit logging in Firebase
- [ ] Set up monitoring and alerts
- [ ] Configure session duration limits
- [ ] Enable multi-factor authentication (optional)
- [ ] Document account recovery procedures
- [ ] Set up customer support channels

### Environment Variables (Production)
- Use Firebase Console for production config
- Store secrets in Firebase Functions config (if using Cloud Functions)
- Never commit `.env` files
- Use different Firebase projects for dev/staging/prod

---

## Monitoring & Analytics

### Firebase Authentication Dashboard
Monitor:
- Daily active users (DAU)
- Sign-in methods distribution
- Failed auth attempts
- Token refresh rate
- SMS usage and costs

### Custom Analytics
Track:
- Signup completion rate by method
- Account linking adoption rate
- Guest → permanent conversion rate
- Time to first successful auth
- Auth errors by type

---

## Cost Estimates (Firebase Free Tier)

**Authentication:**
- ✅ Unlimited email/password auth
- ✅ Unlimited Google OAuth
- ✅ Unlimited anonymous auth
- ✅ 10,000 phone auth verifications/month (then $0.06/verification)

**Firestore:**
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day
- ✅ 1 GB storage

**Cloud Functions (if needed):**
- ✅ 2 million invocations/month
- ✅ 400,000 GB-seconds
- ✅ 200,000 GHz-seconds

**Estimated Cost for 10,000 Users:**
- Auth: ~$50-100/month (mostly SMS)
- Firestore: $25-50/month
- Total: ~$75-150/month

---

## Support & Resources

**Firebase Documentation:**
- Auth: https://firebase.google.com/docs/auth
- Firestore: https://firebase.google.com/docs/firestore
- Security Rules: https://firebase.google.com/docs/rules

**Community:**
- Stack Overflow: [firebase] tag
- Firebase Discord: https://discord.gg/firebase
- GitHub Issues: https://github.com/firebase/

**Support:**
- Firebase Support: https://firebase.google.com/support
- Pricing Calculator: https://firebase.google.com/pricing

---

## Next Steps

1. ✅ Read this guide
2. ⏳ Configure Firebase Console (enable providers)
3. ⏳ Implement Google OAuth sign-in
4. ⏳ Implement Phone SMS OTP
5. ⏳ Add account linking UI
6. ⏳ Implement guest mode
7. ⏳ Test all flows
8. ⏳ Deploy to production

---

*Last Updated: 2025-10-17*
*Version: 1.0.0*
