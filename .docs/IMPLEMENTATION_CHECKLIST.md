# Firebase Authentication Implementation Checklist

## Current Status

✅ **Completed:**
1. Comprehensive authentication guide created (`AUTHENTICATION_GUIDE.md`)
2. Enhanced authentication service created (`src/services/authService.js`)
   - Email/Password auth
   - Google OAuth
   - Phone SMS OTP
   - Anonymous (Guest) mode
   - Account linking/unlinking
   - Guest account upgrade
   - Token management
   - Error handling

## Step-by-Step Implementation

### Step 1: Firebase Console Configuration (REQUIRED FIRST)

**You must complete this before the code will work:**

1. **Go to Firebase Console:** https://console.firebase.google.com
2. **Select your project:** `premia_realty` (or your project name)

#### Enable Authentication Providers:

Navigate to **Authentication** → **Sign-in method**

**A. Email/Password** (Already enabled)
- ✅ Status: Enabled
- No additional configuration needed

**B. Google OAuth** (NEW - REQUIRED)
- Click "Google" in the providers list
- Toggle "Enable"
- **Project support email:** Select your email from dropdown
- Click "Save"
- **Note the Web Client ID** (you'll need this later)

**C. Phone Authentication** (NEW - REQUIRED)
- Click "Phone" in the providers list
- Toggle "Enable"
- **Add test phone numbers** (for development):
  - Phone: `+1234567890`
  - Code: `123456`
- Click "Save"
- **Important:** For production, you need to:
  1. Verify your identity in Firebase Console
  2. Enable billing (free tier: 10,000 SMS/month)
  3. Request SMS quota increase if needed

**D. Anonymous (Guest Mode)** (NEW - REQUIRED)
- Click "Anonymous" in the providers list
- Toggle "Enable"
- Click "Save"

#### Configure Google OAuth Consent Screen:

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Select your Firebase project
3. Choose **"External"** (for public app)
4. Fill in required fields:
   - **App name:** Premia Realty
   - **User support email:** Your email
   - **Developer contact:** Your email
5. **Scopes:** Add these two scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
6. **Test users:** Add test Gmail accounts during development
7. **Publish app** when ready for production

#### Configure Authorized Domains:

In **Authentication** → **Settings** → **Authorized domains**:
- Add: `localhost` (for development)
- Add: your production domain (e.g., `premiaralty.com`)

---

### Step 2: Update Firestore Security Rules

Replace your current `firestore.rules` with enhanced rules:

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
      return isSignedIn() && request.auth.token.admin == true;
    }

    function isVerifiedUser() {
      return isSignedIn() &&
             request.auth.token.firebase.sign_in_provider != 'anonymous';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId) &&
                       !request.resource.data.diff(resource.data)
                         .affectedKeys().hasAny(['uid', 'createdAt']);
      allow delete: if isAdmin();

      // Saved properties subcollection
      match /savedProperties/{propertyId} {
        // Anyone can read/write their own saved properties (including guests)
        allow read, write: if isOwner(userId);
      }

      // Contact requests subcollection
      match /contactRequests/{requestId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
    }

    // Properties collection
    match /properties/{propertyId} {
      allow read: if resource.data.deletedAt == null || isAdmin();
      allow write: if isAdmin();
    }

    // Contacts collection
    match /contacts/{contactId} {
      // Anyone can create (including anonymous)
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

---

### Step 3: Install Required Dependencies

Some may already be installed, but run this to ensure:

```bash
npm install firebase react-google-button --legacy-peer-deps
```

---

### Step 4: Add reCAPTCHA Container to index.html

Add this div before the closing `</body>` tag in `index.html`:

```html
<!-- reCAPTCHA container for phone authentication -->
<div id="recaptcha-container"></div>
```

---

### Step 5: UI Components to Create

I'll provide the code for each component. Create these files:

#### A. Google Sign-In Button Component

**File:** `src/components/GoogleSignInButton.jsx`

```jsx
import { useState } from 'react';
import { signInWithGoogle } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const GoogleSignInButton = ({ onSuccess, onError, mode = 'signin' }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      if (onSuccess) {
        onSuccess(result);
      } else {
        // Default: navigate to account page
        navigate('/account');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);

      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 rounded-full border-2 border-platinum-pearl/20 bg-white hover:bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <span>Signing in...</span>
        </>
      ) : (
        <>
          {/* Google Logo SVG */}
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"/>
              <path d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" fill="#34A853"/>
              <path d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" fill="#FBBC05"/>
              <path d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" fill="#EA4335"/>
            </g>
          </svg>
          <span>
            {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
          </span>
        </>
      )}
    </button>
  );
};

export default GoogleSignInButton;
```

#### B. Phone Auth Modal Component

**File:** `src/components/PhoneAuthModal.jsx`

```jsx
import { useState, useEffect } from 'react';
import { X, Phone } from 'lucide-react';
import {
  initRecaptchaVerifier,
  sendPhoneOTP,
  verifyPhoneOTP,
  formatPhoneNumber,
} from '../services/authService';

const PhoneAuthModal = ({ isOpen, onClose, onSuccess, mode = 'signin' }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'verify'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize reCAPTCHA when modal opens
  useEffect(() => {
    if (isOpen) {
      initRecaptchaVerifier('recaptcha-container');
    }
  }, [isOpen]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const recaptchaVerifier = initRecaptchaVerifier('recaptcha-container');
      const result = await sendPhoneOTP(phoneNumber, recaptchaVerifier);

      setConfirmationResult(result);
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyPhoneOTP(confirmationResult, verificationCode);
      onSuccess(result);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhoneNumber('');
    setVerificationCode('');
    setConfirmationResult(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border-2 border-gold-primary/30 bg-luxury-black p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-platinum-pearl/10 transition"
        >
          <X className="w-5 h-5 text-platinum-pearl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-gold-primary/10 border border-gold-primary/30 mb-4">
            <Phone className="w-6 h-6 text-gold-primary" />
          </div>
          <h2 className="text-2xl font-serif text-platinum-pearl">
            {step === 'phone' ? 'Phone Verification' : 'Enter Code'}
          </h2>
          <p className="mt-2 text-sm text-platinum-pearl/60">
            {step === 'phone'
              ? 'We\'ll send you a verification code via SMS'
              : `Code sent to ${formatPhoneNumber(phoneNumber)}`}
          </p>
        </div>

        {/* Phone Number Step */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.4em] text-platinum-pearl/60 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 8900"
                required
                className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl placeholder-platinum-pearl/30 focus:border-gold-primary focus:outline-none"
              />
              <p className="mt-2 text-xs text-platinum-pearl/50">
                Include country code (e.g., +1 for US/Canada)
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !phoneNumber}
              className="w-full rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.45em] text-luxury-black shadow-gold transition hover:shadow-luxury disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}

        {/* Verification Code Step */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.4em] text-platinum-pearl/60 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                required
                className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-center text-2xl tracking-widest text-platinum-pearl focus:border-gold-primary focus:outline-none"
              />
              <p className="mt-2 text-xs text-platinum-pearl/50 text-center">
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 text-center">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="flex-1 rounded-full border border-gold-primary/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.45em] text-platinum-pearl transition hover:bg-luxury-charcoal"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.45em] text-luxury-black shadow-gold transition hover:shadow-luxury disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneAuthModal;
```

---

### Step 6: Update Existing Pages

#### A. Update Login.jsx

Add imports at the top:
```jsx
import GoogleSignInButton from "../components/GoogleSignInButton";
import PhoneAuthModal from "../components/PhoneAuthModal";
import { signInAsGuest } from "../services/authService";
```

Add state:
```jsx
const [showPhoneModal, setShowPhoneModal] = useState(false);
```

Add these sections after the existing login form:

```jsx
{/* Divider */}
<div className="flex items-center gap-4 my-6">
  <div className="flex-1 h-px bg-platinum-pearl/20"></div>
  <span className="text-xs text-platinum-pearl/50 uppercase tracking-wider">Or continue with</span>
  <div className="flex-1 h-px bg-platinum-pearl/20"></div>
</div>

{/* Google Sign-In */}
<GoogleSignInButton mode="signin" />

{/* Phone Sign-In */}
<button
  type="button"
  onClick={() => setShowPhoneModal(true)}
  className="w-full mt-3 flex items-center justify-center gap-3 rounded-full border-2 border-gold-primary/30 bg-luxury-charcoal/70 hover:bg-luxury-charcoal px-6 py-3 text-sm font-semibold text-platinum-pearl transition-all"
>
  <Phone className="w-5 h-5" />
  <span>Sign in with Phone</span>
</button>

{/* Guest Mode */}
<button
  type="button"
  onClick={async () => {
    await signInAsGuest();
    navigate('/');
  }}
  className="w-full mt-3 text-sm text-platinum-pearl/60 hover:text-gold-primary transition"
>
  Continue as Guest
</button>

{/* Phone Auth Modal */}
<PhoneAuthModal
  isOpen={showPhoneModal}
  onClose={() => setShowPhoneModal(false)}
  onSuccess={() => navigate('/account')}
  mode="signin"
/>
```

#### B. Update Signup.jsx

Similar additions as Login.jsx

---

### Step 7: Test the Implementation

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test each auth method:**
   - ✅ Email/Password signup
   - ✅ Email/Password login
   - ✅ Google OAuth
   - ✅ Phone SMS OTP
   - ✅ Guest mode

3. **Check Firestore:**
   - Verify user profiles are created in `users` collection
   - Verify `linkedProviders` array is populated

---

### Step 8: What's Next

After basic auth works, implement:
1. Account linking page (`/account-linking`)
2. Guest upgrade UI
3. Provider management (unlink)
4. Token refresh handling
5. Email verification flow
6. Error boundaries

---

## Quick Reference

### Important Files Created:
- ✅ `AUTHENTICATION_GUIDE.md` - Complete documentation
- ✅ `src/services/authService.js` - All auth logic
- ⏳ `src/components/GoogleSignInButton.jsx` - Google OAuth button
- ⏳ `src/components/PhoneAuthModal.jsx` - Phone OTP UI
- ⏳ Updated `src/pages/Login.jsx` - Enhanced login
- ⏳ Updated `src/pages/Signup.jsx` - Enhanced signup

### Firebase Console URLs:
- Authentication: https://console.firebase.google.com/project/_/authentication
- Google Cloud OAuth: https://console.cloud.google.com/apis/credentials/consent
- Firestore Rules: https://console.firebase.google.com/project/_/firestore/rules

### Support:
- Firebase Docs: https://firebase.google.com/docs
- Auth Errors: https://firebase.google.com/docs/auth/admin/errors

---

## Troubleshooting

**Google OAuth not working:**
- Check OAuth consent screen is configured
- Verify authorized domains include localhost
- Clear browser cache and cookies

**Phone OTP not sending:**
- Verify phone authentication is enabled
- Check billing is enabled for production
- Use test phone numbers for development

**reCAPTCHA issues:**
- Verify div with id `recaptcha-container` exists
- Check browser console for errors
- Try visible reCAPTCHA instead of invisible

**Account linking errors:**
- Check that email/phone doesn't exist with different account
- Verify user has permission to link
- Check Firestore rules allow linking

---

**Status:** Authentication service code is complete and ready. Next step: Configure Firebase Console, then create UI components.
