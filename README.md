# 🏢 Premia Realty - Premium Real Estate Platform

A production-ready real estate platform built with React 19, Firebase, and Tailwind CSS. Features bilingual support (English/Arabic), property management, user authentication with Google OAuth, admin dashboard, and interactive property listings with map integration.

---

## 📚 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Firebase Configuration](#firebase-configuration)
- [Authentication System](#authentication-system)
- [Admin Setup](#admin-setup)
- [Deployment Guide](#deployment-guide)
- [Environment Variables](#environment-variables)
- [Key Features](#key-features)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Contact Information](#contact-information)
- [For Future Developers](#for-future-developers)

---

## Overview

Premia Realty is a full-featured real estate platform designed for property listings in Bahrain. The platform provides a seamless experience for users to browse properties, save favorites, contact agents, and manage their accounts. Administrators can manage properties, view contact submissions, and perform CRUD operations through a secure admin dashboard.

**Key Features:**
- 🌐 Bilingual support (English/Arabic) with RTL layout support
- 🔐 Dual authentication: Email/Password + Google OAuth with password linking
- 🏠 Advanced property search and filtering
- 🗺️ Interactive map with property markers using Leaflet
- 💾 User-specific saved properties and contact history
- 👨‍💼 Secure admin dashboard with custom claims
- 📱 Fully responsive design with glassmorphism UI
- 🖼️ Image compression and optimization with ImgCoo integration
- 📊 Excel export functionality for contacts

---

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Latest React with functional components and hooks
- **React Router DOM 7.9.3** - Client-side routing with protected routes
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4.18** - Utility-first CSS framework with custom configuration
- **GSAP 3.13.0** - Animation library for smooth transitions
- **Lucide React 0.544.0** - Icon library

### Backend & Services
- **Firebase 12.3.0** - Authentication, Firestore database, and hosting
- **Firebase Admin 13.5.0** - Admin SDK for custom claims and user management
- **Leaflet 1.9.4** + **React Leaflet 5.0.0** - Interactive maps
- **React Leaflet Cluster 3.1.1** - Marker clustering for map

### Utilities
- **browser-image-compression 2.0.2** - Client-side image compression
- **XLSX 0.18.5** - Excel file generation for exports
- **js-cookie 3.0.5** - Cookie management for language preferences
- **dotenv 17.2.3** - Environment variable management

### Development Tools
- **ESLint 9.36.0** - Code linting with React hooks plugin
- **PostCSS 8.5.6** + **Autoprefixer 10.4.21** - CSS processing
- **TypeScript types** for React (@types/react, @types/react-dom)

---

## 📁 Project Structure

```
premia_realty/
├── functions/                      # Firebase Cloud Functions (template only - Spark plan)
│   ├── index.js                   # Entry point for cloud functions
│   └── package.json               # Functions dependencies
│
├── public/                        # Static assets
│   └── ...                       # Favicon, images, etc.
│
├── src/
│   ├── components/               # Reusable React components
│   │   ├── Navbar.jsx           # Navigation with translucent effect on hero
│   │   ├── Footer.jsx           # Site footer with contact info
│   │   ├── BackToTop.jsx        # Scroll-to-top button
│   │   ├── Breadcrumbs.jsx      # Navigation breadcrumbs
│   │   ├── LoadingScreen.jsx    # Initial loading animation
│   │   ├── ScrollToTop.jsx      # Route change scroll handler
│   │   ├── Toast.jsx            # Toast notification system
│   │   ├── RequireAdmin.jsx     # Admin route protection
│   │   ├── SetPasswordModal.jsx # Password setup for Google OAuth users
│   │   ├── ImageUploadWithImgcoo.jsx  # Image upload with compression
│   │   └── ...                  # Other UI components
│   │
│   ├── contexts/                # React Context providers
│   │   └── LanguageContext.jsx # i18n language management (EN/AR)
│   │
│   ├── data/                    # Data services and utilities
│   │   ├── firebaseService.js  # Centralized Firebase operations
│   │   └── properties.json     # Fallback property data
│   │
│   ├── pages/                   # Route-level components
│   │   ├── Home.jsx            # Landing page with hero section
│   │   ├── Properties.jsx      # Property listings with filters
│   │   ├── PropertyDetail.jsx  # Individual property details
│   │   ├── About.jsx           # About us page
│   │   ├── Contact.jsx         # Contact form with dual-write pattern
│   │   ├── Login.jsx           # Login with email/Google OAuth
│   │   ├── Signup.jsx          # User registration
│   │   ├── Account.jsx         # User dashboard
│   │   ├── ChangePassword.jsx  # Password change functionality
│   │   ├── Admin.jsx           # Admin dashboard
│   │   ├── AdminPropertyPageAdd.jsx    # Add new property
│   │   ├── AdminPropertyPageEdit.jsx   # Edit existing property
│   │   ├── AdminPropertiesTrash.jsx    # Soft-deleted properties
│   │   ├── AdminContacts.jsx           # Contact submissions
│   │   └── AdminContactsTrash.jsx      # Soft-deleted contacts
│   │
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # React entry point
│   ├── firebase.js             # Firebase initialization
│   └── index.css               # Global styles and Tailwind directives
│
├── .env                        # Environment variables (NEVER commit!)
├── .firebaserc                 # Firebase project configuration
├── firebase.json               # Firebase hosting and rules config
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore composite indexes
├── storage.rules               # Firebase Storage security rules
├── createAdmin.js              # Script to create admin user
├── cleanupAdmins.js            # Script to remove non-admin users
├── package.json                # Project dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm 9+** or yarn
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Firebase project** with Authentication, Firestore, Storage, and Hosting enabled
- **Firebase service account JSON** (for admin scripts)

### Installation

1. **Clone the repository:**
   ```bash
   cd premia_realty/main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the project root (see [Environment Variables](#environment-variables) section)

4. **Firebase login:**
   ```bash
   firebase login
   ```

5. **Verify Firebase project:**
   ```bash
   firebase projects:list
   ```

### Local Development

```bash
npm run dev
```

The Vite dev server will start at **http://localhost:5173** with hot module replacement (HMR).

### Production Build

```bash
npm run build
```

This creates optimized static assets in the `dist/` folder. To preview the production build locally:

```bash
npm run preview
```

---

## 🔥 Firebase Configuration

### Project Details
- **Project ID:** `premia-goldclass-estate-e0b55`
- **Region:** Europe (eur3)
- **Firebase Plan:** Spark (Free tier)

### Enabled Services
- ✅ **Authentication** - Email/Password + Google OAuth
- ✅ **Firestore Database** - NoSQL database with security rules
- ✅ **Storage** - Image uploads with compression
- ✅ **Hosting** - Static site hosting at Firebase
- ❌ **Cloud Functions** - NOT available on Spark plan

### Firestore Collections

```
/properties/{propertyId}          # All property listings
/contacts/{contactId}             # ALL contact form submissions (primary)
/users/{userId}                   # User profiles
/users/{userId}/savedProperties/{propertyId}  # User's saved properties
/users/{userId}/contactRequests/{contactId}   # User's contact history (authenticated only)
```

### Security Rules

- **Firestore rules:** Defined in `firestore.rules`
  - Admin access verified via custom claims: `request.auth.token.admin == true`
  - Users can only read/write their own data
  - Public read access for properties

- **Storage rules:** Defined in `storage.rules`
  - Admin upload access only
  - Public read access for property images

### Custom Claims

Admin users are identified using Firebase custom claims (NOT Firestore documents):

```javascript
// Set in createAdmin.js
admin.auth().setCustomUserClaims(uid, { admin: true });

// Checked in firestore.rules
function isAdmin() {
  return request.auth != null && request.auth.token.admin == true;
}
```

---

## 🔐 Authentication System

### Dual Authentication

The platform supports two authentication methods:

1. **Email/Password Authentication**
   - Standard email/password registration
   - Password must be at least 6 characters
   - Email verification optional (can be enabled)

2. **Google OAuth**
   - One-click sign-in with Google
   - First-time Google users MUST set a password
   - Password is linked to the Google account using `linkWithCredential`

### Google OAuth Password Setup Flow

**Why?** To ensure all users have both authentication methods available.

**Implementation in [src/pages/Login.jsx](src/pages/Login.jsx):**

```javascript
const handleGoogleSignIn = async () => {
  const result = await signInWithGoogle();

  if (result.isNewUser) {
    // First-time Google user - show password setup modal
    setGoogleUserEmail(result.user.email);
    setShowPasswordModal(true);
  } else {
    // Existing user - proceed to dashboard
    navigate(redirectTo, { replace: true });
  }
};

const handleSetPassword = async (password) => {
  await linkPasswordToGoogleAccount(password);
  setShowPasswordModal(false);
  navigate(redirectTo, { replace: true });
};
```

**Key Functions in [src/data/firebaseService.js](src/data/firebaseService.js):**

- `signInWithGoogle()` - Returns `{ user, isNewUser }`
- `linkPasswordToGoogleAccount(password)` - Links password credential to Google account

**Modal Component:** [src/components/SetPasswordModal.jsx](src/components/SetPasswordModal.jsx)

### Authentication Flow Diagram

```
User clicks "Sign in with Google"
         ↓
   Google OAuth popup
         ↓
   First time user? → YES → Show password setup modal → Link password → Dashboard
         ↓
        NO
         ↓
   Redirect to dashboard
```

---

## 👨‍💼 Admin Setup

### Admin Credentials

- **Email:** `vv.premiarealty@gmail.com`
- **Password:** `Securepassword.rh.dev`
- **Custom Claim:** `{ admin: true }`

### Creating Admin User

**Important:** Place your Firebase service account JSON file in the project root as `serviceAccount.json` before running this script.

```bash
node createAdmin.js
```

**What it does:**
1. Creates user in Firebase Authentication
2. Sets custom claim `admin: true` on the user
3. Creates user profile in Firestore `/users/{uid}`
4. Verifies admin claim was set correctly

**Service Account Setup:**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save as `serviceAccount.json` in project root
4. **NEVER commit this file to git!** (already in .gitignore)

### Cleaning Up Admin Users

To remove all users EXCEPT the admin:

```bash
node cleanupAdmins.js
```

**⚠️ WARNING:** This is a DESTRUCTIVE operation!
- Requires double confirmation (type "DELETE ALL USERS")
- Keeps only `vv.premiarealty@gmail.com`
- Deletes all other users from Firebase Auth
- Cannot be undone!

### Admin Routes

Protected admin routes (all require `admin: true` custom claim):

- `/admin` - Admin dashboard with property management
- `/admin/properties/add` - Add new property
- `/admin/properties/edit/:propertyId` - Edit existing property
- `/admin/trash` - View soft-deleted properties (restore/permanent delete)
- `/admin/contacts` - View contact submissions with Excel export
- `/admin/contacts/trash` - View soft-deleted contacts

---

## 🚢 Deployment Guide

### Pre-Deployment Checklist

- [ ] Run production build: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Verify all environment variables are set in Firebase
- [ ] Create admin user: `node createAdmin.js`
- [ ] Test admin login at `/login`
- [ ] Verify Firestore security rules are deployed
- [ ] Verify Storage security rules are deployed
- [ ] Test contact form submission
- [ ] Test property creation/editing
- [ ] Test Google OAuth login
- [ ] Test password setup for Google users
- [ ] Verify image uploads work
- [ ] Test all admin features
- [ ] Check mobile responsiveness
- [ ] Test both English and Arabic languages

### Build the Project

```bash
npm run build
```

Expected output:
```
vite v7.1.7 building for production...
✓ built in 3.59s
```

### Deploy to Firebase

```bash
firebase deploy
```

Or deploy specific services:

```bash
# Deploy hosting only
firebase deploy --only hosting

# Deploy Firestore rules only
firebase deploy --only firestore:rules

# Deploy Storage rules only
firebase deploy --only storage
```

### Post-Deployment Verification

1. **Visit your site:** `https://premia-goldclass-estate-e0b55.web.app`
2. **Test authentication:**
   - Sign up new user
   - Login with email/password
   - Login with Google (verify password setup modal shows for new users)
3. **Test property browsing:**
   - View properties list
   - Filter properties
   - View property details
   - Save a property (requires login)
4. **Test contact form:**
   - Submit contact form (both authenticated and unauthenticated)
   - Verify submission appears in admin dashboard
5. **Test admin features:**
   - Login as admin
   - Create new property
   - Edit existing property
   - Soft delete property
   - Restore from trash
   - Export contacts to Excel

### Firebase Hosting URL

- **Primary URL:** `https://premia-goldclass-estate-e0b55.web.app`
- **Custom domain:** Can be configured in Firebase Console → Hosting

---

## 🌍 Environment Variables

Create a `.env` file in the project root with the following variables:

```ini
# Firebase Configuration (VITE_ prefix required for Vite)
VITE_FIREBASE_API_KEY="AIzaSyDOdAC-sp63ilj0z4BiAsC1Juh48yr_5hc"
VITE_FIREBASE_AUTH_DOMAIN="premia-goldclass-estate-e0b55.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="premia-goldclass-estate-e0b55"
VITE_FIREBASE_STORAGE_BUCKET="premia-goldclass-estate-e0b55.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="466129133173"
VITE_FIREBASE_APP_ID="1:466129133173:web:a29e8c516452c0e002e23c"
```

**⚠️ Security Notes:**
- `.env` file is in `.gitignore` - NEVER commit it!
- These are client-side variables (public in browser)
- Security is enforced by Firebase Security Rules, not environment variables
- For production, set environment variables in Firebase Console if needed

---

## 📖 Key Features Documentation

### 1. Translucent Navbar on Hero Section

**Location:** [src/components/Navbar.jsx](src/components/Navbar.jsx)

**Behavior:**
- On homepage (`/`) before scrolling: Translucent with `bg-background/30`
- After scrolling 50px: Solid with `bg-background/95`
- On all other pages: Always solid with `bg-background/95`

**Implementation:**
```javascript
const [isScrolled, setIsScrolled] = useState(false);
const location = useLocation();

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  if (location.pathname === "/") {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
  } else {
    setIsScrolled(true);
  }

  return () => window.removeEventListener("scroll", handleScroll);
}, [location.pathname]);
```

### 2. Bilingual Support (i18n)

**Location:** [src/contexts/LanguageContext.jsx](src/contexts/LanguageContext.jsx)

**Features:**
- Toggle between English and Arabic
- Automatic RTL layout for Arabic (`dir="rtl"`)
- Language preference saved in cookies
- All UI text stored in context translations

**Usage:**
```javascript
const { t, language, toggleLanguage } = useLanguage();

// In component:
<h1>{t('welcome')}</h1>
<button onClick={toggleLanguage}>
  {language === 'en' ? 'عربي' : 'English'}
</button>
```

### 3. Property Management

**User Features:**
- Browse all properties with filters (type, price, bedrooms, location)
- View detailed property information with image gallery
- Save favorite properties (requires authentication)
- Interactive map view with property markers
- Marker clustering for better performance

**Admin Features:**
- Add new properties with multiple images
- Edit existing properties
- Soft delete properties (moved to trash)
- Restore properties from trash
- Permanent delete from trash
- Image upload with compression

**Property Fields:**
- Title (English + Arabic)
- Description (English + Arabic)
- Price, size (sqm), bedrooms, bathrooms
- Property type (apartment, villa, land, etc.)
- Location (address, city, country, coordinates)
- Features list
- Multiple images with primary image selection
- Status (active, pending, sold, rented)

### 4. Contact Form System

**Location:** [src/pages/Contact.jsx](src/pages/Contact.jsx)

**Dual-Write Pattern:**

All contact submissions are written to TWO locations:

1. **Primary Collection:** `/contacts/{contactId}` - ALL submissions
   - Used by admin dashboard
   - Single source of truth for all contacts
   - Contains: name, email, phone, message, timestamp, userId (if authenticated)

2. **Secondary Collection:** `/users/{userId}/contactRequests/{contactId}` - Authenticated users only
   - User's personal contact history
   - Displayed in user's account dashboard
   - Same data structure as primary collection

**Why Dual-Write?**
- Centralized admin view of ALL contacts
- User-specific contact history for authenticated users
- Single submission appears in both places for logged-in users

**Implementation in [src/data/firebaseService.js](src/data/firebaseService.js:265-296):**
```javascript
export const addContactForm = async (formData, userId = null) => {
  const contactData = {
    name: formData.name,
    email: formData.email || null,
    phone: formData.phone || null,
    message: formData.message,
    timestamp: serverTimestamp(),
    userId: userId,
  };

  // Write to global contacts collection (ALL submissions)
  const contactRef = await addDoc(collection(db, "contacts"), contactData);

  // If authenticated, ALSO write to user's personal collection
  if (userId) {
    const userContactRef = doc(db, `users/${userId}/contactRequests`, contactRef.id);
    await setDoc(userContactRef, contactData);
  }

  return contactRef.id;
};
```

### 5. Image Upload System

**Component:** [src/components/ImageUploadWithImgcoo.jsx](src/components/ImageUploadWithImgcoo.jsx)

**Features:**
- Client-side image compression using `browser-image-compression`
- Upload to Firebase Storage at `/properties/{propertyId}/{filename}`
- Automatic file naming with timestamps
- Multiple image support with preview
- Primary image selection
- Drag-and-drop support (if enabled)
- Progress indicators

**Compression Settings:**
```javascript
const options = {
  maxSizeMB: 1,              // Max file size 1MB
  maxWidthOrHeight: 1920,    // Max dimension
  useWebWorker: true,        // Use web worker for performance
  fileType: 'image/jpeg'     // Convert to JPEG
};
```

### 6. Interactive Maps

**Libraries:** Leaflet + React Leaflet + React Leaflet Cluster

**Features:**
- Property markers with clustering
- Custom marker icons
- Popup with property details
- Click to view property details
- Automatic bounds adjustment to fit all markers

**Map View:** Available on Properties page with toggle button

### 7. Saved Properties

**Location:** User account dashboard

**Features:**
- Save/unsave properties with heart icon (requires login)
- Real-time sync with Firestore
- Displayed in user's account page
- Persisted across sessions

**Storage:** `/users/{userId}/savedProperties/{propertyId}`

### 8. Toast Notifications

**Component:** [src/components/Toast.jsx](src/components/Toast.jsx)

**Usage:**
```javascript
const { showToast } = useToast();

showToast("Property saved successfully!", "success");
showToast("Error saving property", "error");
```

**Types:** success, error, info

---

## 🗄️ Database Schema

### Firestore Collections

#### `/properties/{propertyId}`

```javascript
{
  title: "Luxury Villa in Amwaj Islands",
  titleAr: "فيلا فاخرة في جزر أمواج",
  description: "Beautiful modern villa...",
  descriptionAr: "فيلا عصرية جميلة...",
  price: 500000,
  size: 350,                    // Square meters
  bedrooms: 4,
  bathrooms: 3,
  propertyType: "villa",        // apartment, villa, land, commercial, etc.
  status: "active",             // active, pending, sold, rented
  location: {
    address: "Building 123, Road 456",
    city: "Muharraq",
    country: "Bahrain",
    latitude: 26.2235,
    longitude: 50.5876
  },
  features: [
    "Swimming Pool",
    "Garden",
    "Parking",
    "Security"
  ],
  images: [
    "https://storage.googleapis.com/.../image1.jpg",
    "https://storage.googleapis.com/.../image2.jpg"
  ],
  primaryImage: 0,              // Index of primary image
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isDeleted: false,
  deletedAt: null
}
```

#### `/contacts/{contactId}`

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+97333709005",
  message: "I'm interested in...",
  timestamp: Timestamp,
  userId: "abc123xyz",          // null if not authenticated
  isDeleted: false,
  deletedAt: null
}
```

#### `/users/{userId}`

```javascript
{
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+97333709005",
  contactType: "email",         // "email" or "phone"
  photoURL: "https://...",      // From Google OAuth
  createdAt: Timestamp,
  updatedAt: Timestamp,
  needsPasswordSetup: false     // true for new Google OAuth users
}
```

#### `/users/{userId}/savedProperties/{propertyId}`

```javascript
{
  savedAt: Timestamp,
  propertyId: "xyz789"          // Reference to property
}
```

#### `/users/{userId}/contactRequests/{contactId}`

Same structure as `/contacts/{contactId}` - mirrors the contact submission for the authenticated user.

### Firebase Authentication

**Providers Enabled:**
- Email/Password
- Google OAuth

**Custom Claims:**
```javascript
{
  admin: true                   // Set only for admin users
}
```

**User UID Format:**
- Email users: Firebase-generated UID
- Google OAuth users: Firebase-generated UID

### Firebase Storage Structure

```
/properties/{propertyId}/
  ├── image1_timestamp.jpg
  ├── image2_timestamp.jpg
  └── ...
```

**Storage Rules:** Admin write access only, public read access

---

## 🔌 API Reference

All Firebase operations are centralized in [src/data/firebaseService.js](src/data/firebaseService.js)

### Authentication Functions

```javascript
// Sign up with email/password
createUserWithEmailPassword(fullName, email, password, phone = null)
  → Returns: User object

// Sign in with email/password
signInWithEmailPassword(email, password)
  → Returns: User object

// Sign in with Google
signInWithGoogle()
  → Returns: { user, isNewUser }

// Link password to Google account
linkPasswordToGoogleAccount(password)
  → Returns: User object

// Change password
changePassword(newPassword)
  → Returns: void

// Sign out
signOutUser()
  → Returns: void

// Get current user profile
getUserProfile(userId)
  → Returns: User profile document

// Update user profile
updateUserProfile(userId, updates)
  → Returns: void
```

### Property Functions

```javascript
// Get all properties (non-deleted)
getAllProperties()
  → Returns: Array of property objects

// Get single property by ID
getPropertyById(propertyId)
  → Returns: Property object

// Add new property (admin only)
addProperty(propertyData)
  → Returns: Property ID

// Update property (admin only)
updateProperty(propertyId, updates)
  → Returns: void

// Soft delete property (admin only)
softDeleteProperty(propertyId)
  → Returns: void

// Restore property from trash (admin only)
restoreProperty(propertyId)
  → Returns: void

// Permanently delete property (admin only)
permanentlyDeleteProperty(propertyId)
  → Returns: void

// Get deleted properties (admin only)
getDeletedProperties()
  → Returns: Array of deleted property objects
```

### Contact Functions

```javascript
// Add contact form submission
addContactForm(formData, userId = null)
  → Returns: Contact ID
  → Writes to:
    - /contacts/{contactId}
    - /users/{userId}/contactRequests/{contactId} (if userId provided)

// Get all contacts (admin only)
getAllContacts()
  → Returns: Array of contact objects

// Get deleted contacts (admin only)
getDeletedContacts()
  → Returns: Array of deleted contact objects

// Soft delete contact (admin only)
softDeleteContact(contactId)
  → Returns: void

// Restore contact from trash (admin only)
restoreContact(contactId)
  → Returns: void

// Permanently delete contact (admin only)
permanentlyDeleteContact(contactId)
  → Returns: void

// Export contacts to Excel (admin only)
exportContactsToExcel(contacts, filename)
  → Returns: void
  → Downloads Excel file
```

### Saved Properties Functions

```javascript
// Save property for user
saveProperty(userId, propertyId)
  → Returns: void

// Unsave property for user
unsaveProperty(userId, propertyId)
  → Returns: void

// Check if property is saved by user
isPropertySaved(userId, propertyId)
  → Returns: Boolean

// Subscribe to user's saved properties
subscribeToSavedProperties(userId, callback)
  → Returns: Unsubscribe function
  → Callback receives: Array of property IDs
```

### Real-time Subscriptions

```javascript
// Subscribe to user's contact requests
subscribeToUserContactRequests(userId, callback)
  → Returns: Unsubscribe function
  → Callback receives: Array of contact objects

// Subscribe to user's saved properties
subscribeToSavedProperties(userId, callback)
  → Returns: Unsubscribe function
  → Callback receives: Array of property IDs
```

**Example Usage:**
```javascript
import { subscribeToSavedProperties, unsaveProperty } from '../data/firebaseService';

useEffect(() => {
  if (!user) return;

  const unsubscribe = subscribeToSavedProperties(user.uid, (propertyIds) => {
    setSavedPropertyIds(propertyIds);
  });

  return () => unsubscribe();
}, [user]);
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Firebase Authentication Error: "auth/invalid-api-key"

**Cause:** Missing or incorrect Firebase configuration in `.env`

**Solution:**
1. Verify `.env` file exists in project root
2. Check all `VITE_FIREBASE_*` variables are set correctly
3. Restart Vite dev server: `npm run dev`

#### 2. Firestore Permission Denied

**Cause:** Security rules blocking access OR user not authenticated

**Solution:**
1. Check if user is logged in
2. For admin operations, verify user has `admin: true` custom claim
3. Run: `firebase deploy --only firestore:rules`

#### 3. Admin Login Shows "Not Authorized"

**Cause:** Admin custom claim not set on user

**Solution:**
1. Verify admin user exists: Check Firebase Console → Authentication
2. Re-run admin creation script: `node createAdmin.js`
3. Verify custom claim in Firebase Console → Authentication → User → Custom Claims

#### 4. Images Not Uploading

**Cause:** Storage rules or Firebase Storage not configured

**Solution:**
1. Check Firebase Console → Storage → Rules
2. Deploy storage rules: `firebase deploy --only storage`
3. Verify user is logged in as admin

#### 5. Google OAuth Password Modal Not Showing

**Cause:** User is not a new Google OAuth user

**Solution:**
- Modal only shows for FIRST-TIME Google sign-ins
- If user already has password linked, modal won't show
- This is expected behavior

#### 6. Build Fails with Import Error

**Cause:** Missing component or incorrect import path

**Solution:**
1. Check error message for missing file
2. Verify file exists at the path
3. Check for typos in import statement
4. If component was deleted, restore from git: `git checkout src/components/ComponentName.jsx`

#### 7. Map Not Displaying

**Cause:** Leaflet CSS not loaded OR coordinates invalid

**Solution:**
1. Verify Leaflet CSS import in component
2. Check property coordinates are valid (latitude/longitude)
3. Check browser console for errors

#### 8. Contact Form Not Submitting

**Cause:** Firestore rules OR missing required fields

**Solution:**
1. Check browser console for errors
2. Verify all required fields are filled
3. Check Firestore rules allow write to `/contacts`
4. Test with authenticated and unauthenticated user

#### 9. "File has not been read yet" Error

**Cause:** Attempting to write/edit file without reading it first

**Solution:**
1. Always use Read tool before Write/Edit
2. This is a safety feature to prevent accidental overwrites

#### 10. Functions Deployment Error (Cloud Functions)

**Cause:** Cloud Functions require Blaze (paid) plan

**Solution:**
- Project is on Spark (free) plan - Cloud Functions NOT supported
- Cloud Functions code is template only - do not deploy
- For future: Upgrade to Blaze plan if Cloud Functions needed

---

## 📞 Contact Information

### Company Details

**Premia Realty**
- **Phone 1:** +973 33709005
- **Phone 2:** +973 34020266
- **Email:** vv.premiarealty@gmail.com
- **Address:** Office 3020, Building 2004, Road 1527 Hidd, Bahrain

**Admin Account:**
- **Email:** vv.premiarealty@gmail.com
- **Password:** Securepassword.rh.dev

### Firebase Project

- **Project ID:** premia-goldclass-estate-e0b55
- **Console:** https://console.firebase.google.com/project/premia-goldclass-estate-e0b55
- **Hosting URL:** https://premia-goldclass-estate-e0b55.web.app

---

## 👥 For Future Developers

### Important Notes

1. **Service Account Security:**
   - `serviceAccount.json` contains sensitive credentials
   - NEVER commit this file to version control
   - Store securely and share only via secure channels
   - Used only for admin scripts (`createAdmin.js`, `cleanupAdmins.js`)

2. **Custom Claims vs Firestore:**
   - Admin access uses Firebase Custom Claims (`admin: true`)
   - Do NOT store admin flag in Firestore user document
   - Custom claims are checked in Firestore security rules
   - More secure than Firestore-based role checks

3. **Contact Form Dual-Write:**
   - ALL submissions go to `/contacts/{contactId}`
   - Authenticated users ALSO get copy in `/users/{userId}/contactRequests/{contactId}`
   - DO NOT modify this pattern - admin dashboard depends on primary collection

4. **Image Upload Component:**
   - `ImageUploadWithImgcoo.jsx` is REQUIRED for admin property management
   - Do NOT delete this component
   - Used by both Add and Edit property pages

5. **Unused Components:**
   - Some components may appear unused but are kept for future features
   - Always verify usage with grep/search before deleting
   - Test build after any cleanup: `npm run build`

6. **Firebase Spark Plan Limitations:**
   - Cloud Functions NOT available
   - `functions/index.js` is template only - do not attempt to deploy
   - Upgrade to Blaze plan if Cloud Functions needed

7. **Google OAuth Password Linking:**
   - First-time Google users MUST set password via modal
   - Uses `linkWithCredential` to add password provider
   - DO NOT skip this step - ensures all users have email/password fallback

8. **Translucent Navbar:**
   - Navbar transparency changes based on page and scroll position
   - Homepage before scroll: `bg-background/30`
   - After scroll OR other pages: `bg-background/95`
   - Implemented in Navbar component with useLocation + scroll listener

9. **Firestore Indexes:**
   - Composite indexes defined in `firestore.indexes.json`
   - Deploy with: `firebase deploy --only firestore:indexes`
   - Firebase will suggest new indexes if queries fail

10. **Environment Variables:**
    - All Firebase config uses `VITE_` prefix (required by Vite)
    - These are public (exposed to client)
    - Security enforced by Firebase Security Rules, not env vars

### Development Workflow

1. **Starting Development:**
   ```bash
   git pull
   npm install
   npm run dev
   ```

2. **Making Changes:**
   - Work on feature branch
   - Test locally with `npm run dev`
   - Run build test: `npm run build`
   - Test production build: `npm run preview`

3. **Deploying Changes:**
   ```bash
   npm run build
   firebase deploy
   ```

4. **Database Changes:**
   - Update `firestore.rules` if security rules change
   - Update `firestore.indexes.json` if query indexes needed
   - Deploy rules: `firebase deploy --only firestore:rules`
   - Deploy indexes: `firebase deploy --only firestore:indexes`

### Code Style Guidelines

- **React:** Functional components with hooks (no class components)
- **State Management:** useState, useEffect, useContext
- **Styling:** Tailwind utility classes (avoid custom CSS when possible)
- **File Names:** PascalCase for components, camelCase for utilities
- **Imports:** Absolute imports from `src/`, relative for same directory
- **Comments:** Document complex logic and business rules

### Testing Checklist

Before deploying any changes:

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices (iOS and Android)
- [ ] Test all authentication flows
- [ ] Test admin dashboard features
- [ ] Test contact form submission
- [ ] Test property search and filters
- [ ] Test image uploads
- [ ] Test both English and Arabic languages
- [ ] Verify no console errors
- [ ] Run production build successfully
- [ ] Test production build locally

### Resources

- **React 19 Docs:** https://react.dev
- **Vite Docs:** https://vite.dev
- **Firebase Docs:** https://firebase.google.com/docs
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **React Router Docs:** https://reactrouter.com
- **Leaflet Docs:** https://leafletjs.com/reference.html

### Getting Help

- **Firebase Console:** https://console.firebase.google.com
- **React DevTools:** Install browser extension for debugging
- **Firebase Local Emulator:** For testing without affecting production
  ```bash
  firebase emulators:start
  ```

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server with HMR
npm run build        # Build for production (output: dist/)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint

# Firebase
firebase login       # Login to Firebase CLI
firebase deploy      # Deploy all Firebase services
firebase deploy --only hosting          # Deploy hosting only
firebase deploy --only firestore:rules  # Deploy Firestore rules only
firebase deploy --only storage          # Deploy Storage rules only

# Admin Scripts (requires serviceAccount.json)
node createAdmin.js      # Create admin user
node cleanupAdmins.js    # Remove all non-admin users
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved by Premia Realty.

---

**Last Updated:** 2025-11-13

**Version:** 1.0.0 (Production Ready)

---

**Deployment Status:** ✅ Ready for production deployment

**Known Limitations:**
- Firebase Spark plan (free tier) - Cloud Functions not available
- Image compression happens client-side (no server-side processing)
- No email verification for sign-ups (can be added if needed)

**Future Enhancements:**
- Email verification for new users
- Password reset via email
- Property inquiry tracking
- User messaging system
- Advanced property search with more filters
- Property comparison feature
- Virtual tour integration
- Mortgage calculator
