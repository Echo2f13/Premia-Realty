/**
 * Cleanup Admin Users Script
 *
 * This script removes all users from Firebase Authentication
 * EXCEPT for vv.premiarealty@gmail.com
 *
 * Usage: node cleanupAdmins.js
 *
 * WARNING: This will permanently delete users!
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import * as readline from 'readline';

// The admin email to keep
const KEEP_ADMIN_EMAIL = 'vv.premiarealty@gmail.com';

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

// Helper to prompt for confirmation
function promptConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function cleanupAdmins() {
  console.log('🧹 Admin Cleanup Script\n');
  console.log('⚠️  WARNING: This will delete all users EXCEPT:', KEEP_ADMIN_EMAIL);
  console.log('   This action cannot be undone!\n');

  // Ask for confirmation
  const confirmed = await promptConfirmation('Are you sure you want to continue? (yes/no): ');

  if (!confirmed) {
    console.log('\n❌ Operation cancelled by user.');
    process.exit(0);
  }

  console.log('\n🔍 Fetching all users...\n');

  try {
    const listUsersResult = await auth.listUsers(1000);
    const allUsers = listUsersResult.users;

    console.log(`📊 Found ${allUsers.length} total users\n`);

    // Filter users to delete (all except the one to keep)
    const usersToDelete = allUsers.filter(user => user.email !== KEEP_ADMIN_EMAIL);
    const keepUser = allUsers.find(user => user.email === KEEP_ADMIN_EMAIL);

    if (keepUser) {
      console.log('✅ Keeping admin user:');
      console.log(`   Email: ${keepUser.email}`);
      console.log(`   UID: ${keepUser.uid}\n`);
    } else {
      console.log('⚠️  Warning: Admin user', KEEP_ADMIN_EMAIL, 'not found!\n');
    }

    if (usersToDelete.length === 0) {
      console.log('✅ No users to delete. Only the admin user exists.\n');
      process.exit(0);
    }

    console.log(`🗑️  Will delete ${usersToDelete.length} user(s):\n`);
    usersToDelete.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email || 'No email'} (UID: ${user.uid})`);
    });

    console.log('');
    const finalConfirm = await promptConfirmation(`Delete these ${usersToDelete.length} users? (yes/no): `);

    if (!finalConfirm) {
      console.log('\n❌ Operation cancelled by user.');
      process.exit(0);
    }

    console.log('\n🗑️  Deleting users...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersToDelete) {
      try {
        // Delete from Firebase Authentication
        await auth.deleteUser(user.uid);

        // Delete user document from Firestore if it exists
        try {
          await db.collection('users').doc(user.uid).delete();
        } catch (firestoreError) {
          // Ignore if document doesn't exist
        }

        console.log(`✅ Deleted: ${user.email || 'No email'} (${user.uid})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error deleting ${user.email || user.uid}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n🎉 Cleanup complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   ✅ Successfully deleted: ${successCount}`);
    console.log(`   ❌ Failed to delete: ${errorCount}`);
    console.log(`   ✅ Kept admin: ${KEEP_ADMIN_EMAIL}\n`);

    // Verify the admin user has the admin claim
    if (keepUser) {
      const userRecord = await auth.getUser(keepUser.uid);
      const hasAdminClaim = userRecord.customClaims?.admin === true;

      if (!hasAdminClaim) {
        console.log('⚠️  Warning: The kept user does NOT have admin claim!');
        console.log('   Run: node createAdmin.js to set the admin claim\n');
      } else {
        console.log('✅ Confirmed: Admin user has admin claim\n');
      }
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

// Run the script
cleanupAdmins();
