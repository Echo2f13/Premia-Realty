# SEO Implementation Guide - Premia Realty

Complete guide for implementing SEO on your Premia Realty website.

---

## 📁 Files Created

1. **`public/sitemap.xml`** - XML sitemap for search engines
2. **`public/robots.txt`** - Robots directives for crawlers
3. **`src/data/seoMetadata.js`** - SEO metadata configuration
4. **`src/components/SEO.jsx`** - Reusable SEO component

---

## 🚀 How to Implement

### Step 1: Add SEO Component to Your Pages

Import and use the SEO component in each page:

#### Home.jsx
```javascript
import SEO from '../components/SEO';

const Home = () => {
  return (
    <>
      <SEO page="home" />
      {/* Your existing homepage code */}
    </>
  );
};
```

#### Properties.jsx
```javascript
import SEO from '../components/SEO';

const Properties = () => {
  return (
    <>
      <SEO page="properties" />
      {/* Your existing properties code */}
    </>
  );
};
```

#### About.jsx
```javascript
import SEO from '../components/SEO';

const About = () => {
  return (
    <>
      <SEO page="about" />
      {/* Your existing about code */}
    </>
  );
};
```

#### Contact.jsx
```javascript
import SEO from '../components/SEO';

const Contact = () => {
  return (
    <>
      <SEO page="contact" />
      {/* Your existing contact code */}
    </>
  );
};
```

#### PropertyDetail.jsx (for individual properties)
```javascript
import SEO from '../components/SEO';

const PropertyDetail = () => {
  const property = /* your property data */;

  return (
    <>
      <SEO
        page="properties"
        customTitle={`${property.title} - Premia Realty`}
        customDescription={property.description}
        customImage={property.images[0]}
        customKeywords={`${property.propertyType}, ${property.location.city}, Bahrain real estate`}
      />
      {/* Your existing property detail code */}
    </>
  );
};
```

---

## 📝 Meta Tags Reference

### All Pages Include:

#### Basic Meta Tags
- `<title>` - Page title (50-60 characters ideal)
- `<meta name="description">` - Page description (150-160 characters ideal)
- `<meta name="keywords">` - Relevant keywords
- `<meta name="robots">` - "index, follow"
- `<meta name="author">` - "Premia Realty"

#### Open Graph Tags (Facebook, LinkedIn)
- `og:type` - "website"
- `og:site_name` - "Premia Realty"
- `og:title` - Optimized title for social sharing
- `og:description` - Optimized description for social sharing
- `og:image` - Image URL (1200x630px recommended)
- `og:url` - Canonical page URL
- `og:locale` - "en_US" with alternate "ar_BH"

#### Twitter Card Tags
- `twitter:card` - "summary_large_image"
- `twitter:site` - "@premiarealty"
- `twitter:title` - Optimized title for Twitter
- `twitter:description` - Optimized description for Twitter
- `twitter:image` - Image URL (1200x628px recommended)

#### Local SEO Tags (Bahrain)
- `geo.region` - "BH"
- `geo.placename` - "Bahrain"
- `geo.position` - "26.0667;50.5577"
- `ICBM` - "26.0667, 50.5577"

---

## 🖼️ Images for Social Sharing

You need to create the following images and place them in `public/` folder:

### Required Images:
1. **`og-image-default.jpg`** - Default OG image (1200x630px)
2. **`og-image-home.jpg`** - Homepage OG image (1200x630px)
3. **`og-image-properties.jpg`** - Properties page OG image (1200x630px)
4. **`og-image-about.jpg`** - About page OG image (1200x630px)
5. **`og-image-contact.jpg`** - Contact page OG image (1200x630px)
6. **`twitter-card-home.jpg`** - Homepage Twitter card (1200x628px)
7. **`twitter-card-properties.jpg`** - Properties Twitter card (1200x628px)
8. **`twitter-card-about.jpg`** - About Twitter card (1200x628px)
9. **`twitter-card-contact.jpg`** - Contact Twitter card (1200x628px)
10. **`logo.png`** - Company logo for structured data

### Image Best Practices:
- **OG Images**: 1200x630px (Facebook, LinkedIn)
- **Twitter Cards**: 1200x628px (Twitter)
- **Format**: JPG or PNG
- **File size**: Under 1MB
- **Content**: Include your logo, property images, and text overlay

---

## 📊 Structured Data (JSON-LD)

The SEO component automatically adds structured data to your pages:

### Organization Schema (All Pages)
- Business name, logo, contact info
- Physical address in Bahrain
- Geo-coordinates
- Opening hours

### Website Schema (Homepage)
- Site search functionality

### Breadcrumb Schema (Non-home Pages)
- Navigation breadcrumbs

---

## 🔍 SEO Metadata Details

### Homepage
- **Title**: "Premia Realty - Premium Real Estate in Bahrain | Luxury Villas & Apartments"
- **Priority**: 1.0 (highest)
- **Change Frequency**: Daily

### Properties Page
- **Title**: "Properties for Sale & Rent in Bahrain | Premia Realty"
- **Priority**: 0.9
- **Change Frequency**: Daily (updates frequently with new listings)

### About Page
- **Title**: "About Premia Realty - Your Trusted Real Estate Partner in Bahrain"
- **Priority**: 0.7
- **Change Frequency**: Monthly

### Contact Page
- **Title**: "Contact Premia Realty - Bahrain Real Estate Agency | +973 33709005"
- **Priority**: 0.8
- **Change Frequency**: Monthly

---

## 🤖 Robots.txt Configuration

### Allowed:
- `/` (homepage)
- `/properties`
- `/about`
- `/contact`

### Disallowed (protected from search engines):
- `/admin` and all admin routes
- `/account`
- `/login`
- `/signup`
- `/change-password`
- Trash pages

### Sitemap Location:
- `https://premiarealty.bh/sitemap.xml`

---

## 🗺️ Sitemap.xml

Contains 4 main pages with optimized priorities and change frequencies.

### How Search Engines Use It:
1. Google Search Console
2. Bing Webmaster Tools
3. Other search engines

---

## 📈 Next Steps for Better SEO

### 1. Submit to Search Engines
- **Google Search Console**: https://search.google.com/search-console
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
- Submit your sitemap URL: `https://premiarealty.bh/sitemap.xml`

### 2. Create Social Media Images
- Design OG images for each page (1200x630px)
- Include your logo, attractive property photos, and text
- Use tools like Canva or Figma

### 3. Set Up Google Analytics
- Track visitor behavior
- Monitor page performance
- Understand user journey

### 4. Set Up Google Tag Manager (Optional)
- Manage tracking codes
- Add conversion tracking
- Monitor button clicks and form submissions

### 5. Local SEO (Google Business Profile)
- Create Google Business Profile for "Premia Realty"
- Add your Hidd office location
- Upload photos
- Collect customer reviews

### 6. Content Strategy
- Blog posts about Bahrain real estate market
- Neighborhood guides
- Property investment tips
- Market trends and analysis

### 7. Property-Specific SEO
For each property listing, use custom SEO:
```javascript
<SEO
  page="properties"
  customTitle={`${bedrooms} Bedroom ${propertyType} in ${city} - ${price} BHD`}
  customDescription={`${description.substring(0, 150)}...`}
  customImage={primaryImage}
/>
```

### 8. Performance Optimization
- Optimize images (use WebP format)
- Implement lazy loading
- Minimize JavaScript bundles
- Use CDN for static assets

---

## 🎯 SEO Checklist

### Before Launch:
- [ ] SEO component added to all pages
- [ ] All OG images created and uploaded to `public/`
- [ ] Sitemap.xml accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Test meta tags with:
  - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
  - Twitter Card Validator: https://cards-dev.twitter.com/validator
  - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- [ ] All page titles are unique and descriptive
- [ ] All meta descriptions are unique and compelling

### After Launch:
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics
- [ ] Create Google Business Profile
- [ ] Monitor search rankings
- [ ] Track organic traffic
- [ ] Collect and respond to reviews

---

## 🔧 Customization

### Update Domain Name
Currently set to `premiarealty.bh`. If your domain is different, update in:
- `src/data/seoMetadata.js` → `siteUrl: "https://yourdomain.com"`
- `public/sitemap.xml` → All `<loc>` URLs
- `public/robots.txt` → `Sitemap:` URL

### Update Twitter Handle
If you have a Twitter account, update in:
- `src/data/seoMetadata.js` → `twitterHandle: "@youraccount"`

### Update Contact Information
Already set to your current info:
- Phone: +973 33709005, +973 34020266
- Email: vv.premiarealty@gmail.com
- Address: Office 3020, Building 2004, Road 1527 Hidd

---

## 📚 Resources

### Testing Tools:
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Schema.org Validator**: https://validator.schema.org/

### Learning Resources:
- **Google Search Central**: https://developers.google.com/search
- **Moz Beginner's Guide to SEO**: https://moz.com/beginners-guide-to-seo
- **Ahrefs SEO Guide**: https://ahrefs.com/seo

---

## ✅ Summary

You now have:
1. ✅ Complete sitemap.xml with optimized priorities
2. ✅ Robots.txt with proper directives
3. ✅ SEO metadata for all 4 main pages
4. ✅ Open Graph tags for social sharing
5. ✅ Twitter Card tags
6. ✅ Structured data (JSON-LD) for rich snippets
7. ✅ Reusable SEO component
8. ✅ Local SEO tags for Bahrain
9. ✅ Implementation guide

**Next Action**: Add the SEO component to your pages and create the social sharing images!

---

**Last Updated**: 2025-11-13
**Version**: 1.0.0
