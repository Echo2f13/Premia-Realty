# Firebase Security Rules for Admin Dashboard

This document contains the required Firebase Security Rules for the Admin Dashboard to function properly.

## Firestore Rules

Add these rules to your **Firestore Rules** in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Properties collection - Admin only for write, public for read
    match /properties/{propertyId} {
      // Anyone can read non-deleted properties
      allow read: if resource == null || resource.data.deletedAt == null;

      // Only admins can create, update, or delete properties
      allow create, update, delete: if isAdmin();
    }

    // Contacts collection - Anyone can create, admin can read
    match /contacts/{contactId} {
      allow create: if isAuthenticated();
      allow read, update, delete: if isAdmin();
    }

    // Users collection - User can read/write their own data
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;

      // Subcollections
      match /savedProperties/{propertyId} {
        allow read, write: if isAuthenticated() && request.auth.uid == userId;
      }

      match /contactRequests/{requestId} {
        allow read, write: if isAuthenticated() && request.auth.uid == userId;
      }
    }
  }
}
```

## Storage Rules

Add these rules to your **Storage Rules** in Firebase Console:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    // Properties folder - Admin only
    match /properties/{propertyId}/{imageFile} {
      // Anyone can read property images
      allow read: if true;

      // Only admins can upload, update, or delete property images
      allow write, delete: if isAdmin();
    }

    // Catch-all rule for other files (optional)
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Setting Admin Custom Claims

To set a user as admin, you need to use the Firebase Admin SDK (Node.js):

### Method 1: Using Firebase Admin SDK (Recommended)

```javascript
// admin-setup.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Set admin claim for a user
async function setAdminClaim(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`✅ Admin claim set for user: ${uid}`);

    // Force token refresh by signing out user
    console.log('⚠️ User must sign out and sign back in for changes to take effect');
  } catch (error) {
    console.error('Error setting admin claim:', error);
  }
}

// Replace with your user's UID
const USER_UID = 'your-user-uid-here';
setAdminClaim(USER_UID);
```

### Method 2: Using Firebase CLI

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login
firebase login

# Create a script to set admin claim
firebase functions:shell

# In the shell, run:
admin.auth().setCustomUserClaims('YOUR_USER_UID', { admin: true })
```

### Method 3: Cloud Function (For production)

Create a Cloud Function that admins can call to promote users:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall(async (data, context) => {
  // Check if request is made by an admin
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can add other admins.'
    );
  }

  // Get user and add admin custom claim
  try {
    await admin.auth().setCustomUserClaims(data.uid, { admin: true });
    return { message: `Success! ${data.uid} is now an admin.` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

## Verifying Admin Status

To verify a user's admin status in the browser console:

```javascript
// Get current user's token
firebase.auth().currentUser.getIdTokenResult()
  .then((idTokenResult) => {
    console.log('Admin claim:', idTokenResult.claims.admin);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

## Troubleshooting

### Issue: "Permission Denied" when creating/editing properties

**Solution:**
1. Check Firestore Rules - ensure admin check is correct
2. Verify user has `admin: true` custom claim
3. User must sign out and sign back in after admin claim is set

### Issue: "Unauthorized" when uploading images

**Solution:**
1. Check Storage Rules - ensure admin check is correct
2. Verify the storage path matches: `properties/{propertyId}/{imageFile}`
3. Check that Storage bucket is configured in Firebase config

### Issue: "Cannot read properties of null" errors

**Solution:**
1. Ensure user is signed in before accessing admin pages
2. Check that RequireAdmin component is properly wrapping routes
3. Verify Firebase is initialized before auth checks

## Testing

After setting up rules and admin claims:

1. ✅ Sign in with admin user
2. ✅ Try creating a new property with images
3. ✅ Try editing an existing property
4. ✅ Try deleting a property (soft delete)
5. ✅ Try permanently deleting from trash
6. ✅ Sign in with non-admin user and verify access is denied

---

**Note:** Always test rules in Firebase Console's Rules Playground before deploying to production!
