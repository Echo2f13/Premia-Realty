/**
 * Firestore Property Seeder
 *
 * Seeds the Firestore 'properties' collection with sample property data
 * for the Premia Realty platform.
 *
 * Usage: node seedProperties.js
 *
 * Prerequisites:
 * - Firebase credentials configured in .env
 * - Firebase project initialized
 * - Run once to populate the database
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Helper to prompt for admin credentials
function promptCredentials() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Admin Email: ', (email) => {
      rl.question('Admin Password: ', (password) => {
        rl.close();
        resolve({ email, password });
      });
    });
  });
}

// Helper function to create slug from title
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper to remove null values from objects (for Firestore rules compliance)
const removeNullValues = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj;

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue; // Skip null/undefined values
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      cleaned[key] = removeNullValues(value); // Recursively clean nested objects
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

// Sample property data
const sampleProperties = [
  {
    // Core fields
    title: "Luxury 3BR Apartment in Seef - Sea View",
    slug: slugify("Luxury 3BR Apartment in Seef - Sea View"),
    intent: "rent",
    type: "apartment",
    price: 650,
    priceCadence: "/month",
    currency: "BHD",
    ewaIncluded: true,
    priceInclusive: true,
    ewaLimit: 50,
    featured: true,
    socialHousing: false,
    description: "Stunning 3-bedroom apartment with panoramic sea views in the heart of Seef. This modern residence features floor-to-ceiling windows, contemporary finishes, and access to premium building amenities including a gym, swimming pool, and 24/7 security. Perfect for professionals and families seeking luxury living.",
    tags: ["sea-view", "gym", "swimming-pool", "parking", "security"],
    priority: 1,
    status: "published",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop",
    ],
    amenities: ["Gym", "Swimming Pool", "24/7 Security", "Covered Parking", "Children's Play Area", "Concierge"],
    availableFrom: null,
    referenceCode: "PR-SEF-001",
    deletedAt: null,
    createdBy: null,
    updatedBy: null,

    // Location
    location: {
      governorate: "Capital",
      city: "Manama",
      area: "Seef",
      lat: "26.2361",
      lng: "50.5354",
    },

    // Specs
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      furnishing: "furnished",
      ac: "centralized",
      areaSqm: 180,
      areaSqft: 1937,
      floor: "12",
      parking: "2",
      view: "sea",
      viewDetail: "Full sea view facing north",
      yearBuilt: 2020,
      classification: "RA",
    },

    // Lease terms
    leaseTerms: {
      minMonths: 12,
      depositMonths: 1,
      commission: "tenant",
      commissionNote: "Half month rent payable by tenant",
    },

    // Agent info
    agentId: null,
    agentContact: {
      phone: "+973 3333 1111",
      whatsapp: "+973 3333 1111",
    },
    source: {
      name: "Direct Owner",
      url: null,
    },
  },

  {
    title: "Spacious 4BR Villa in Saar - Private Pool",
    slug: slugify("Spacious 4BR Villa in Saar - Private Pool"),
    intent: "sale",
    type: "villa",
    price: 285000,
    priceCadence: null,
    currency: "BHD",
    ewaIncluded: false,
    priceInclusive: false,
    ewaLimit: null,
    featured: true,
    socialHousing: false,
    description: "Beautiful standalone villa in the prestigious Saar district. Features 4 spacious bedrooms, modern kitchen, private swimming pool, and landscaped garden. Perfect for families seeking a peaceful residential area with excellent schools nearby.",
    tags: ["private-pool", "garden", "garage", "maid-room", "family"],
    priority: 2,
    status: "published",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop",
    ],
    amenities: ["Private Pool", "Garden", "Maid's Room", "Garage", "BBQ Area", "Storage Room"],
    availableFrom: null,
    referenceCode: "PR-SAR-002",
    deletedAt: null,
    createdBy: null,
    updatedBy: null,

    location: {
      governorate: "Capital",
      city: "Saar",
      area: "Saar",
      lat: "26.1741",
      lng: "50.4819",
    },

    specs: {
      bedrooms: 4,
      bathrooms: 5,
      furnishing: "unfurnished",
      ac: "split",
      areaSqm: 420,
      areaSqft: 4520,
      floor: "0",
      parking: "3",
      view: "garden",
      viewDetail: "Private garden and pool area",
      yearBuilt: 2018,
      classification: "RB",
    },

    leaseTerms: {
      minMonths: null,
      depositMonths: null,
      commission: "split",
      commissionNote: "Standard 2.5% split between buyer and seller",
    },

    agentId: null,
    agentContact: {
      phone: "+973 3333 2222",
      whatsapp: "+973 3333 2222",
    },
    source: {
      name: "Premia Realty Exclusive",
      url: null,
    },
  },

  {
    title: "Modern Studio in Juffair - Fully Furnished",
    slug: slugify("Modern Studio in Juffair - Fully Furnished"),
    intent: "rent",
    type: "studio",
    price: 280,
    priceCadence: "/month",
    currency: "BHD",
    ewaIncluded: true,
    priceInclusive: true,
    ewaLimit: 30,
    featured: false,
    socialHousing: false,
    description: "Cozy and modern studio apartment in the vibrant Juffair area. Fully furnished with contemporary furniture, equipped kitchen, and access to building amenities. Walking distance to restaurants, cafes, and shopping centers. Ideal for young professionals and expats.",
    tags: ["furnished", "wifi-ready", "gym", "central-location"],
    priority: 5,
    status: "published",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop",
    ],
    amenities: ["Gym", "Shared Pool", "Security", "Parking", "Internet Ready"],
    availableFrom: null,
    referenceCode: "PR-JUF-003",
    deletedAt: null,
    createdBy: null,
    updatedBy: null,

    location: {
      governorate: "Capital",
      city: "Manama",
      area: "Juffair",
      lat: "26.2172",
      lng: "50.6058",
    },

    specs: {
      bedrooms: 0,
      bathrooms: 1,
      furnishing: "furnished",
      ac: "split",
      areaSqm: 45,
      areaSqft: 484,
      floor: "5",
      parking: "1",
      view: "city",
      viewDetail: null,
      yearBuilt: 2019,
      classification: "RA",
    },

    leaseTerms: {
      minMonths: 6,
      depositMonths: 1,
      commission: "landlord",
      commissionNote: null,
    },

    agentId: null,
    agentContact: {
      phone: "+973 3333 3333",
      whatsapp: "+973 3333 3333",
    },
    source: {
      name: "Property Portal",
      url: "https://example.com",
    },
  },

  {
    title: "Prime Commercial Office in Diplomatic Area",
    slug: slugify("Prime Commercial Office in Diplomatic Area"),
    intent: "rent",
    type: "office",
    price: 1200,
    priceCadence: "/month",
    currency: "BHD",
    ewaIncluded: false,
    priceInclusive: false,
    ewaLimit: null,
    featured: true,
    socialHousing: false,
    description: "Premium office space in the prestigious Diplomatic Area. Features modern fit-out, panoramic windows, dedicated parking, and 24/7 access. Perfect for corporate offices, consulting firms, and professional services. Walking distance to government ministries and embassies.",
    tags: ["office", "commercial", "parking", "central-location", "fitted"],
    priority: 3,
    status: "published",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop",
    ],
    amenities: ["Reception Area", "Meeting Rooms", "Pantry", "Server Room", "Parking", "Security"],
    availableFrom: null,
    referenceCode: "PR-DIP-004",
    deletedAt: null,
    createdBy: null,
    updatedBy: null,

    location: {
      governorate: "Capital",
      city: "Manama",
      area: "Diplomatic Area",
      lat: "26.2285",
      lng: "50.5860",
    },

    specs: {
      bedrooms: 0,
      bathrooms: 2,
      furnishing: "semi",
      ac: "centralized",
      areaSqm: 220,
      areaSqft: 2368,
      floor: "8",
      parking: "6",
      view: "city",
      viewDetail: "City skyline and sea glimpse",
      yearBuilt: 2021,
      classification: "COMM",
    },

    leaseTerms: {
      minMonths: 24,
      depositMonths: 2,
      commission: "tenant",
      commissionNote: "One month commission",
    },

    agentId: null,
    agentContact: {
      phone: "+973 3333 4444",
      whatsapp: "+973 3333 4444",
    },
    source: {
      name: "Premia Realty Commercial",
      url: null,
    },
  },

  {
    title: "Affordable 2BR Social Housing - Mahooz",
    slug: slugify("Affordable 2BR Social Housing - Mahooz"),
    intent: "rent",
    type: "apartment",
    price: 220,
    priceCadence: "/month",
    currency: "BHD",
    ewaIncluded: true,
    priceInclusive: true,
    ewaLimit: 40,
    featured: false,
    socialHousing: true,
    description: "Clean and well-maintained 2-bedroom apartment in Mahooz, suitable for families under the social housing program. Features spacious rooms, family-friendly layout, and convenient access to schools and local markets. Reserved for eligible Bahraini families.",
    tags: ["social-housing", "family", "affordable", "schools-nearby"],
    priority: 10,
    status: "published",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop",
    ],
    amenities: ["Parking", "Playground", "Security"],
    availableFrom: null,
    referenceCode: "PR-MAH-005",
    deletedAt: null,
    createdBy: null,
    updatedBy: null,

    location: {
      governorate: "Capital",
      city: "Manama",
      area: "Mahooz",
      lat: "26.2253",
      lng: "50.6147",
    },

    specs: {
      bedrooms: 2,
      bathrooms: 2,
      furnishing: "unfurnished",
      ac: "split",
      areaSqm: 110,
      areaSqft: 1184,
      floor: "3",
      parking: "1",
      view: "street",
      viewDetail: null,
      yearBuilt: 2015,
      classification: "SP",
    },

    leaseTerms: {
      minMonths: 12,
      depositMonths: 1,
      commission: "none",
      commissionNote: "Social housing - no commission",
    },

    agentId: null,
    agentContact: {
      phone: "+973 3333 5555",
      whatsapp: "+973 3333 5555",
    },
    source: {
      name: "Social Housing Authority",
      url: null,
    },
  },

  {
    title: "Exclusive Penthouse in Amwaj Islands",
    slug: slugify("Exclusive Penthouse in Amwaj Islands"),
    intent: "sale",
    type: "penthouse",
    price: 425000,
    priceCadence: null,
    currency: "BHD",
    ewaIncluded: false,
    priceInclusive: false,
    ewaLimit: null,
    featured: true,
    socialHousing: false,
    description: "Ultra-luxurious penthouse with breathtaking panoramic sea views in Amwaj Islands. This masterpiece features 4 bedrooms with en-suite bathrooms, private rooftop terrace with infinity pool, state-of-the-art kitchen, and premium finishes throughout. Exclusive island living at its finest.",
    tags: ["penthouse", "sea-view", "private-pool", "luxury", "waterfront"],
    priority: 1,
    status: "published",
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&auto=format&fit=crop",
    ],
    amenities: ["Private Rooftop Pool", "Gym", "Spa", "Beach Access", "Marina", "Concierge", "Valet Parking"],
    availableFrom: null,
    referenceCode: "PR-AMW-006",
    deletedAt: null,
    createdBy: null,
    updatedBy: null,

    location: {
      governorate: "Muharraq",
      city: "Amwaj Islands",
      area: "Amwaj",
      lat: "26.2800",
      lng: "50.6600",
    },

    specs: {
      bedrooms: 4,
      bathrooms: 5,
      furnishing: "furnished",
      ac: "vrf",
      areaSqm: 450,
      areaSqft: 4843,
      floor: "20",
      parking: "4",
      view: "sea",
      viewDetail: "360-degree panoramic sea and island views",
      yearBuilt: 2022,
      classification: "RHA",
    },

    leaseTerms: {
      minMonths: null,
      depositMonths: null,
      commission: "split",
      commissionNote: "2% commission split",
    },

    agentId: null,
    agentContact: {
      phone: "+973 3333 6666",
      whatsapp: "+973 3333 6666",
    },
    source: {
      name: "Premia Luxury Collection",
      url: null,
    },
  },

  {
    title: "Spacious 3BR Townhouse in Riffa Views",
    slug: slugify("Spacious 3BR Townhouse in Riffa Views"),
    intent: "rent",
    type: "townhouse",
    price: 550,
    priceCadence: "/month",
    currency: "BHD",
    ewaIncluded: false,
    priceInclusive: false,
    ewaLimit: null,
    featured: false,
    socialHousing: false,
    description: "Modern townhouse in the family-friendly gated community of Riffa Views. Features 3 bedrooms, maid's room, private garden, and access to community facilities including pool, gym, and children's play areas. Ideal for families seeking a secure and green environment.",
    tags: ["townhouse", "gated-community", "garden", "family", "schools-nearby"],
    priority: 4,
    status: "published",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1623874106797-3470c049d6f3?w=1200&auto=format&fit=crop",
    ],
    amenities: ["Community Pool", "Gym", "Playground", "Garden", "Maid's Room", "Parking"],
    availableFrom: null,
    referenceCode: "PR-RIF-007",
    deletedAt: null,
    createdBy: null,
    updatedBy: null,

    location: {
      governorate: "Southern",
      city: "Riffa",
      area: "Riffa Views",
      lat: "26.1300",
      lng: "50.5550",
    },

    specs: {
      bedrooms: 3,
      bathrooms: 4,
      furnishing: "semi",
      ac: "split",
      areaSqm: 280,
      areaSqft: 3013,
      floor: "0",
      parking: "2",
      view: "garden",
      viewDetail: "Private garden and community green areas",
      yearBuilt: 2017,
      classification: "RB",
    },

    leaseTerms: {
      minMonths: 12,
      depositMonths: 2,
      commission: "tenant",
      commissionNote: "Half month commission",
    },

    agentId: null,
    agentContact: {
      phone: "+973 3333 7777",
      whatsapp: "+973 3333 7777",
    },
    source: {
      name: "Community Management",
      url: null,
    },
  },

  {
    title: "Investment Opportunity - 2BR Apartment Seef",
    slug: slugify("Investment Opportunity - 2BR Apartment Seef"),
    intent: "sale",
    type: "apartment",
    price: 95000,
    priceCadence: null,
    currency: "BHD",
    ewaIncluded: false,
    priceInclusive: false,
    ewaLimit: null,
    featured: false,
    socialHousing: false,
    description: "Excellent investment opportunity in Seef district. This 2-bedroom apartment offers strong rental yields in a prime location. Currently rented with good tenants. Perfect for investors looking to expand their property portfolio in a high-demand area.",
    tags: ["investment", "rented", "high-yield", "central-location"],
    priority: 6,
    status: "published",
    images: [
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop",
    ],
    amenities: ["Gym", "Pool", "Security", "Parking"],
    availableFrom: null,
    referenceCode: "PR-SEF-008",
    deletedAt: null,
    createdBy: null,
    updatedBy: null,

    location: {
      governorate: "Capital",
      city: "Manama",
      area: "Seef",
      lat: "26.2345",
      lng: "50.5370",
    },

    specs: {
      bedrooms: 2,
      bathrooms: 2,
      furnishing: "semi",
      ac: "centralized",
      areaSqm: 120,
      areaSqft: 1291,
      floor: "6",
      parking: "1",
      view: "city",
      viewDetail: null,
      yearBuilt: 2016,
      classification: "RA",
    },

    leaseTerms: {
      minMonths: null,
      depositMonths: null,
      commission: "tenant",
      commissionNote: "2.5% buyer commission",
    },

    agentId: null,
    agentContact: {
      phone: "+973 3333 8888",
      whatsapp: "+973 3333 8888",
    },
    source: {
      name: "Premia Investment Team",
      url: null,
    },
  },
];

// Main seeding function
async function seedProperties() {
  console.log('🌱 Starting Firestore property seeding...\n');

  // Authenticate as admin
  console.log('🔐 Admin authentication required to seed properties.\n');
  const { email, password } = await promptCredentials();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(`✅ Authenticated as: ${userCredential.user.email}`);

    // Force token refresh to get latest custom claims
    console.log('🔄 Refreshing authentication token...');
    await userCredential.user.getIdToken(true);
    const idTokenResult = await userCredential.user.getIdTokenResult();

    // Verify admin claim
    if (!idTokenResult.claims.admin) {
      console.error('\n❌ User does not have admin privileges.');
      console.error('\nTo set admin claim, run:');
      console.error('  cd db && node set-admin.js ' + email);
      console.error('\nThen run this script again.');
      process.exit(1);
    }

    console.log('✅ Admin privileges verified\n');
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.error('\nPlease ensure:');
    console.error('1. You are using admin credentials');
    console.error('2. The account has admin custom claims set in Firebase');
    process.exit(1);
  }

  const propertiesCollection = collection(db, 'properties');
  const results = [];

  for (const property of sampleProperties) {
    try {
      // Clean null values from nested objects for Firestore rules compliance
      const cleanedProperty = removeNullValues(property);

      // Add serverTimestamp for createdAt and updatedAt
      const propertyWithTimestamps = {
        ...cleanedProperty,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(propertiesCollection, propertyWithTimestamps);

      console.log(`✅ Created: "${property.title}"`);
      console.log(`   ID: ${docRef.id}`);
      console.log(`   Type: ${property.type} | Intent: ${property.intent} | Price: ${property.price} ${property.currency}`);
      console.log(`   Location: ${property.location.area}, ${property.location.city}\n`);

      results.push({
        id: docRef.id,
        title: property.title,
        slug: property.slug,
      });
    } catch (error) {
      console.error(`❌ Error creating "${property.title}":`, error.message);
    }
  }

  console.log('\n🎉 Seeding complete!');
  console.log(`\n📊 Summary: ${results.length}/${sampleProperties.length} properties created successfully.\n`);

  if (results.length > 0) {
    console.log('Created properties:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.title} (${result.id})`);
    });
  }

  console.log('\n✅ You can now view these properties in your Firestore console and application.');

  // Exit the process
  process.exit(0);
}

// Run the seeder
seedProperties().catch((error) => {
  console.error('\n❌ Fatal error during seeding:', error);
  process.exit(1);
});
