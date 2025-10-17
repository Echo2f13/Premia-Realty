# Property Seeding Guide

## Overview

The `seedProperties.js` script populates your Firestore `properties` collection with 8 sample properties covering various types and use cases.

## Sample Data Included

1. **Luxury 3BR Apartment** - Seef (Rent, Featured)
2. **Spacious 4BR Villa** - Saar (Sale, Private Pool)
3. **Modern Studio** - Juffair (Rent, Furnished)
4. **Prime Commercial Office** - Diplomatic Area (Rent)
5. **Affordable 2BR Social Housing** - Mahooz (Rent)
6. **Exclusive Penthouse** - Amwaj Islands (Sale, Luxury)
7. **Spacious 3BR Townhouse** - Riffa Views (Rent, Family)
8. **Investment 2BR Apartment** - Seef (Sale)

## Prerequisites

Ensure you have:
- Firebase project configured
- `.env` file with Firebase credentials
- `dotenv` package installed

## Installation

```bash
npm install dotenv
```

## Usage

Run the script once to populate the database:

```bash
node seedProperties.js
```

When prompted, enter your admin credentials:
- **Admin Email**: Your Firebase admin account email
- **Admin Password**: Your admin account password

**Important:** The account must have the `admin` custom claim set in Firebase Authentication.

### Setting Admin Custom Claims

If you haven't set admin claims yet, use the Firebase Admin SDK or Console:

```javascript
// Using Firebase Admin SDK
const admin = require('firebase-admin');
admin.auth().setCustomUserClaims('USER_UID', { admin: true });
```

Or use the Firebase Console to set custom claims for your user.

## What It Does

- Creates 8 diverse property listings
- Populates ALL schema fields (no missing data)
- Uses `serverTimestamp()` for `createdAt` and `updatedAt`
- Includes realistic Bahrain locations (Seef, Saar, Juffair, Amwaj, etc.)
- Uses Unsplash placeholder images
- Logs each property creation with ID and details

## Schema Compliance

Each property includes:
- ✅ Core fields (title, price, type, status, etc.)
- ✅ Location (governorate, city, area, coordinates)
- ✅ Specs (bedrooms, bathrooms, area, furnishing, etc.)
- ✅ Lease terms (deposit, commission, min months)
- ✅ Agent contact info
- ✅ Timestamps (serverTimestamp)
- ✅ Soft-delete support (deletedAt: null)
- ✅ User metadata (createdBy, updatedBy)

## Idempotency

The script is safe to run multiple times. Each run creates new documents with unique IDs. To avoid duplicates, manually delete old properties first.

## Verification

After running:
1. Check Firestore Console → `properties` collection
2. View properties in your admin panel
3. Verify all fields are populated correctly

## Customization

To modify sample data:
1. Edit the `sampleProperties` array in `seedProperties.js`
2. Adjust property details, prices, locations as needed
3. Run the script again

---

**Note:** This is a one-time setup script. For ongoing property management, use the admin panel UI.
