/**
 * Property Seeder using Firebase Admin SDK
 * This bypasses Firestore security rules for easier seeding
 *
 * Usage: node seedWithAdmin.js
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Read service account from db folder
const serviceAccount = JSON.parse(
  readFileSync('./db/serviceAccount.json', 'utf8')
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper function to create slug from title
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Sample property data
const sampleProperties = [
  {
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
    location: {
      governorate: "Capital",
      city: "Manama",
      area: "Seef",
      lat: "26.2361",
      lng: "50.5354",
    },
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
    leaseTerms: {
      minMonths: 12,
      depositMonths: 1,
      commission: "tenant",
      commissionNote: "Half month rent payable by tenant",
    },
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
  console.log('🌱 Starting Firestore property seeding (using Admin SDK)...\n');
  console.log('✅ Bypassing security rules with Admin SDK\n');

  const propertiesCollection = db.collection('properties');
  const results = [];

  console.log('📝 Creating properties...\n');

  for (const property of sampleProperties) {
    try {
      const propertyWithTimestamps = {
        ...property,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await propertiesCollection.add(propertyWithTimestamps);

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

  process.exit(0);
}

// Run the seeder
seedProperties().catch((error) => {
  console.error('\n❌ Fatal error during seeding:', error);
  console.error(error.stack);
  process.exit(1);
});
