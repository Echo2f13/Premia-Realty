# Cloud Functions Setup Guide

This guide will help you set up Firebase Cloud Functions for automatic slug generation, storage cleanup, and scheduled backups.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project initialized
- Node.js 18+ installed

## Step 1: Initialize Functions

```bash
cd "d:\other\work\projects\others_projects\ronie\premia_realty\main"
firebase init functions
```

Choose:
- JavaScript (or TypeScript if you prefer)
- Install dependencies with npm: Yes

## Step 2: Update functions/package.json

```json
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "scripts": {
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "index.js",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0"
  },
  "devDependencies": {
    "firebase-functions-test": "^3.1.0"
  },
  "private": true
}
```

## Step 3: Create functions/index.js

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// ============================================
// FUNCTION 1: Auto-generate unique slug
// ============================================

exports.ensureUniqueSlug = functions.firestore
  .document('properties/{propertyId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const { propertyId } = context.params;

    // Generate slug from title if not present or empty
    if (!data.slug || data.slug.trim() === '') {
      const baseSlug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check for duplicates
      let slug = baseSlug;
      let suffix = 1;

      while (true) {
        const existingDocs = await db.collection('properties')
          .where('slug', '==', slug)
          .where(admin.firestore.FieldPath.documentId(), '!=', propertyId)
          .get();

        if (existingDocs.empty) break;

        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }

      // Update with unique slug
      await snap.ref.update({
        slug,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Generated unique slug for ${propertyId}: ${slug}`);
    }
  });

// ============================================
// FUNCTION 2: Set updatedAt on property write
// ============================================

exports.setUpdatedAt = functions.firestore
  .document('properties/{propertyId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();

    // Only update if updatedAt wasn't already set
    if (!after.updatedAt || after.updatedAt.toMillis() < Date.now() - 5000) {
      await change.after.ref.update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

// ============================================
// FUNCTION 3: Clean up Storage on hard delete
// ============================================

exports.cleanupStorageOnDelete = functions.firestore
  .document('properties/{propertyId}')
  .onDelete(async (snap, context) => {
    const { propertyId } = context.params;
    const bucket = storage.bucket();

    try {
      console.log(`Cleaning up storage for property: ${propertyId}`);

      // Delete all files in the property folder
      const [files] = await bucket.getFiles({
        prefix: `properties/${propertyId}/`
      });

      const deletePromises = files.map(file => file.delete());
      await Promise.all(deletePromises);

      console.log(`Deleted ${files.length} files for property: ${propertyId}`);
    } catch (error) {
      console.error(`Error deleting storage for property ${propertyId}:`, error);
      // Don't throw - log and continue
    }
  });

// ============================================
// FUNCTION 4: Scheduled Firestore Backup
// ============================================

exports.scheduledFirestoreBackup = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('UTC')
  .onRun(async (context) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const bucket = `gs://${projectId}-firestore-backups`;
    const timestamp = new Date().toISOString().split('T')[0];

    console.log(`Starting Firestore backup to ${bucket}/${timestamp}`);

    try {
      const client = new admin.firestore.v1.FirestoreAdminClient();
      const databaseName = client.databasePath(projectId, '(default)');

      await client.exportDocuments({
        name: databaseName,
        outputUriPrefix: `${bucket}/${timestamp}`,
        collectionIds: ['properties', 'users', 'contacts']
      });

      console.log('Firestore backup completed successfully');
    } catch (error) {
      console.error('Firestore backup failed:', error);
    }

    return null;
  });

// ============================================
// FUNCTION 5: HTTP endpoint to set admin claim
// ============================================

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Check if request is made by an admin
  if (!context.auth || context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set admin claims.'
    );
  }

  const { uid } = data;

  if (!uid) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a uid.'
    );
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin claim set for user: ${uid}`);

    return {
      success: true,
      message: `Admin claim set for user: ${uid}. User must sign out and sign back in.`
    };
  } catch (error) {
    console.error('Error setting admin claim:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================
// FUNCTION 6: Auto-convert area units
// ============================================

exports.autoConvertArea = functions.firestore
  .document('properties/{propertyId}')
  .onWrite(async (change, context) => {
    if (!change.after.exists) return;

    const data = change.after.data();
    const specs = data.specs || {};

    let needsUpdate = false;
    const updates = {};

    // If sqft is set but sqm is not, calculate sqm
    if (specs.areaSqft && !specs.areaSqm) {
      updates['specs.areaSqm'] = Math.round(specs.areaSqft * 0.092903);
      needsUpdate = true;
    }

    // If sqm is set but sqft is not, calculate sqft
    if (specs.areaSqm && !specs.areaSqft) {
      updates['specs.areaSqft'] = Math.round(specs.areaSqm * 10.7639);
      needsUpdate = true;
    }

    if (needsUpdate) {
      await change.after.ref.update(updates);
      console.log(`Auto-converted area for property ${context.params.propertyId}`);
    }
  });
```

## Step 4: Deploy Functions

```bash
firebase deploy --only functions
```

## Step 5: Set Up Scheduled Backups (Optional)

For the scheduled backup function to work, you need to:

1. Enable Cloud Scheduler API in Google Cloud Console
2. Create a storage bucket for backups:

```bash
gsutil mb gs://YOUR_PROJECT_ID-firestore-backups
```

3. Grant permissions:

```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com \
  --role roles/datastore.importExportAdmin
```

## Testing Functions Locally

```bash
cd functions
npm run serve
```

This will start the Firebase Emulator Suite where you can test functions locally.

## Function Costs

All functions are in the free tier except:
- **scheduledFirestoreBackup** - Uses Cloud Scheduler (first 3 jobs/month free)
- Heavy usage may incur costs

## Monitoring

View function logs:

```bash
firebase functions:log
```

Or in Firebase Console → Functions → Logs

## Troubleshooting

### Error: "Missing required permission"

Grant necessary permissions:
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com \
  --role roles/storage.admin
```

### Error: "Cloud Scheduler not enabled"

Enable it in Google Cloud Console or run:
```bash
gcloud services enable cloudscheduler.googleapis.com
```

### Error: "Function timeout"

Increase timeout in function definition:
```javascript
exports.myFunction = functions
  .runWith({ timeoutSeconds: 300 })
  .firestore.document(...)
```

---

That's it! Your Cloud Functions are now set up and will automatically:
- Generate unique slugs
- Keep updatedAt current
- Clean up storage on delete
- Backup Firestore daily
- Provide admin claim management
- Auto-convert area units
