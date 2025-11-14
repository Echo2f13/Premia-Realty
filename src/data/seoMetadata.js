// SEO Metadata Configuration for Premia Realty
// Import this file in your pages and use the metadata for each route

export const seoMetadata = {
  // Global/Default Metadata
  siteName: "Premia Realty",
  siteUrl: "https://premiarealty.bh",
  defaultImage: "https://premiarealty.bh/og-image-default.jpg", // Add your default OG image
  twitterHandle: "@premiarealty", // Update with your actual Twitter handle if you have one

  // Homepage
  home: {
    title: "Premia Realty - Premium Real Estate in Bahrain | Luxury Villas & Apartments",
    description: "Discover premium properties in Bahrain with Premia Realty. Browse luxury villas, modern apartments, and commercial spaces in Muharraq, Amwaj Islands, and across Bahrain. Your trusted real estate partner since 2024.",
    keywords: "Bahrain real estate, luxury properties Bahrain, villas for sale Bahrain, apartments Bahrain, Muharraq properties, Amwaj Islands real estate, commercial properties Bahrain, Premia Realty",
    ogTitle: "Premia Realty - Premium Real Estate in Bahrain",
    ogDescription: "Find your dream property in Bahrain. Luxury villas, modern apartments, and prime commercial spaces. Expert guidance, premium service.",
    ogImage: "https://premiarealty.bh/og-image-home.jpg",
    twitterTitle: "Premia Realty - Premium Real Estate in Bahrain",
    twitterDescription: "Discover luxury properties in Bahrain. Villas, apartments, and commercial spaces with expert guidance.",
    twitterImage: "https://premiarealty.bh/twitter-card-home.jpg",
  },

  // Properties Page
  properties: {
    title: "Properties for Sale & Rent in Bahrain | Premia Realty",
    description: "Browse our exclusive collection of properties in Bahrain. Filter by location, price, bedrooms, and property type. Find villas, apartments, land, and commercial spaces across Muharraq, Manama, and Amwaj Islands.",
    keywords: "properties for sale Bahrain, properties for rent Bahrain, real estate listings Bahrain, villas Bahrain, apartments for sale, land for sale Bahrain, commercial properties",
    ogTitle: "Premium Properties in Bahrain - Premia Realty",
    ogDescription: "Explore our exclusive portfolio of premium properties across Bahrain. Villas, apartments, land, and commercial spaces in prime locations.",
    ogImage: "https://premiarealty.bh/og-image-properties.jpg",
    twitterTitle: "Premium Properties in Bahrain - Premia Realty",
    twitterDescription: "Browse luxury villas, modern apartments, and prime real estate across Bahrain.",
    twitterImage: "https://premiarealty.bh/twitter-card-properties.jpg",
  },

  // About Page
  about: {
    title: "About Premia Realty - Your Trusted Real Estate Partner in Bahrain",
    description: "Learn about Premia Realty, Bahrain's premier real estate agency. We specialize in luxury properties, offering expert guidance and personalized service. Located in Hidd, Bahrain. Contact us at +973 33709005.",
    keywords: "about Premia Realty, real estate agency Bahrain, property consultants Bahrain, Hidd real estate, Bahrain property experts",
    ogTitle: "About Premia Realty - Premium Real Estate in Bahrain",
    ogDescription: "Your trusted partner in finding premium properties across Bahrain. Expert guidance, personalized service, and exclusive listings.",
    ogImage: "https://premiarealty.bh/og-image-about.jpg",
    twitterTitle: "About Premia Realty - Real Estate Experts in Bahrain",
    twitterDescription: "Discover why we're Bahrain's trusted real estate partner. Premium properties, expert service.",
    twitterImage: "https://premiarealty.bh/twitter-card-about.jpg",
  },

  // Contact Page
  contact: {
    title: "Contact Premia Realty - Bahrain Real Estate Agency | +973 33709005",
    description: "Get in touch with Premia Realty. Visit our office at Office 3020, Building 2004, Road 1527 Hidd, Bahrain. Call +973 33709005 or +973 34020266. Email: vv.premiarealty@gmail.com. We're here to help you find your dream property.",
    keywords: "contact Premia Realty, Bahrain real estate contact, property inquiry Bahrain, Hidd office, real estate consultation Bahrain",
    ogTitle: "Contact Premia Realty - Get Expert Real Estate Advice",
    ogDescription: "Speak with our real estate experts. Office in Hidd, Bahrain. Call +973 33709005 or email vv.premiarealty@gmail.com",
    ogImage: "https://premiarealty.bh/og-image-contact.jpg",
    twitterTitle: "Contact Premia Realty - Real Estate Experts in Bahrain",
    twitterDescription: "Get in touch with Bahrain's premium real estate agency. Expert consultation available.",
    twitterImage: "https://premiarealty.bh/twitter-card-contact.jpg",
  },
};

// Helper function to generate meta tags for React Helmet or similar
export const generateMetaTags = (page) => {
  const meta = seoMetadata[page];
  if (!meta) return null;

  return {
    // Basic Meta Tags
    title: meta.title,
    meta: [
      { name: "description", content: meta.description },
      { name: "keywords", content: meta.keywords },

      // Open Graph Tags (Facebook, LinkedIn, etc.)
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: seoMetadata.siteName },
      { property: "og:title", content: meta.ogTitle },
      { property: "og:description", content: meta.ogDescription },
      { property: "og:image", content: meta.ogImage },
      { property: "og:url", content: `${seoMetadata.siteUrl}${page === 'home' ? '' : `/${page}`}` },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "ar_BH" },

      // Twitter Card Tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: seoMetadata.twitterHandle },
      { name: "twitter:title", content: meta.twitterTitle },
      { name: "twitter:description", content: meta.twitterDescription },
      { name: "twitter:image", content: meta.twitterImage },

      // Additional SEO Tags
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Premia Realty" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { httpEquiv: "Content-Language", content: "en, ar" },

      // Geo Tags for Local SEO (Bahrain)
      { name: "geo.region", content: "BH" },
      { name: "geo.placename", content: "Bahrain" },
      { name: "geo.position", content: "26.0667;50.5577" },
      { name: "ICBM", content: "26.0667, 50.5577" },
    ],
  };
};

// Structured Data (JSON-LD) for each page
export const structuredData = {
  // Organization Schema (use on all pages)
  organization: {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Premia Realty",
    "image": "https://premiarealty.bh/logo.png",
    "url": "https://premiarealty.bh",
    "telephone": ["+97333709005", "+97334020266"],
    "email": "vv.premiarealty@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office 3020, Building 2004, Road 1527",
      "addressLocality": "Hidd",
      "addressRegion": "Muharraq",
      "addressCountry": "BH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.0667,
      "longitude": 50.5577
    },
    "areaServed": {
      "@type": "Country",
      "name": "Bahrain"
    },
    "priceRange": "$$-$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  },

  // Website Schema
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Premia Realty",
    "url": "https://premiarealty.bh",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://premiarealty.bh/properties?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  // Breadcrumb Schema (example for properties page)
  breadcrumb: (pageName) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://premiarealty.bh/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": pageName,
        "item": `https://premiarealty.bh/${pageName.toLowerCase()}`
      }
    ]
  }),
};

export default seoMetadata;
