# Quick Start: Seed Properties

Follow these steps to populate your Firestore with sample properties.

## Step 1: Set Admin Claims (One-Time Setup)

First, make sure your admin user has the `admin` custom claim:

```bash
cd db
node set-admin.js YOUR_ADMIN_EMAIL@example.com
```

Example:
```bash
node set-admin.js admin@premia.com
```

**Important:** After setting the admin claim, sign out and sign back in to your admin account in the browser.

## Step 2: Run the Seeding Script

From the project root:

```bash
node seedProperties.js
```

When prompted:
1. Enter your admin email
2. Enter your admin password

## Expected Output

```
🌱 Starting Firestore property seeding...

🔐 Admin authentication required to seed properties.

Admin Email: admin@premia.com
Admin Password: ******

✅ Authenticated as: admin@premia.com

✅ Created: "Luxury 3BR Apartment in Seef - Sea View"
   ID: abc123xyz
   Type: apartment | Intent: rent | Price: 650 BHD
   Location: Seef, Manama

✅ Created: "Spacious 4BR Villa in Saar - Private Pool"
   ...

🎉 Seeding complete!

📊 Summary: 8/8 properties created successfully.
```

## Troubleshooting

### Permission Denied Error
- Ensure you've set admin claims (Step 1)
- Sign out and sign back in after setting claims
- Verify claims in browser console:
  ```javascript
  firebase.auth().currentUser.getIdTokenResult().then(t => console.log(t.claims))
  ```

### Authentication Failed
- Double-check email and password
- Ensure the account exists in Firebase Authentication

### Module Not Found (dotenv)
```bash
npm install dotenv
```

## What Gets Created

8 properties with complete data:
1. Luxury 3BR Apartment - Seef (Rent, Featured, Sea View)
2. Spacious 4BR Villa - Saar (Sale, Private Pool)
3. Modern Studio - Juffair (Rent, Furnished)
4. Prime Commercial Office - Diplomatic Area (Rent)
5. Affordable 2BR Social Housing - Mahooz (Rent)
6. Exclusive Penthouse - Amwaj Islands (Sale, Luxury)
7. Spacious 3BR Townhouse - Riffa Views (Rent, Family)
8. Investment 2BR Apartment - Seef (Sale)

All properties include:
- Complete schema compliance
- Realistic Bahrain locations
- Unsplash placeholder images
- Full specs, lease terms, and metadata

## Verify in Firestore

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to Firestore Database
3. Open the `properties` collection
4. You should see 8 new documents

---

**Need help?** Check [SEEDING_GUIDE.md](SEEDING_GUIDE.md) for detailed documentation.
