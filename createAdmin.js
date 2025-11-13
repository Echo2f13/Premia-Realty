/**
 * Create Admin User Script
 *
 * This script creates an admin user in Firebase Authentication
 * and sets the custom admin claim.
 *
 * Usage: node createAdmin.js
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Admin credentials
const ADMIN_EMAIL = 'vv.premiarealty@gmail.com';
const ADMIN_PASSWORD = 'Securepassword.rh.dev';
const ADMIN_DISPLAY_NAME = 'Premia Realty Admin';

// Read service account from root directory
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccount.json', 'utf8')
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function createAdminUser() {
  console.log('🔐 Creating admin user...\n');

  try {
    // Check if user already exists
    let user;
    try {
      user = await auth.getUserByEmail(ADMIN_EMAIL);
      console.log('✅ User already exists with email:', ADMIN_EMAIL);
      console.log('   UID:', user.uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        console.log('📝 Creating new user...');
        user = await auth.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          displayName: ADMIN_DISPLAY_NAME,
          emailVerified: true,
        });
        console.log('✅ User created successfully!');
        console.log('   UID:', user.uid);
        console.log('   Email:', user.email);
      } else {
        throw error;
      }
    }

    // Set admin custom claim
    console.log('\n🔧 Setting admin custom claim...');
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log('✅ Admin claim set successfully!');

    // Create user profile in Firestore
    console.log('\n📝 Creating user profile in Firestore...');
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        email: ADMIN_EMAIL,
        fullName: ADMIN_DISPLAY_NAME,
        phone: '+973 33709005',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('✅ User profile created in Firestore!');
    } else {
      console.log('ℹ️  User profile already exists in Firestore');
    }

    console.log('\n🎉 Admin user setup complete!\n');
    console.log('📋 Admin Credentials:');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('   UID:', user.uid);
    console.log('\n✅ You can now sign in to the admin panel with these credentials.');
    console.log('   Visit: http://localhost:5173/admin\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

// Run the script
createAdminUser();
