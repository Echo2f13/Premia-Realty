import { useEffect } from 'react';
import { seoMetadata, structuredData } from '../data/seoMetadata';

/**
 * SEO Component - Manages document head metadata for SEO optimization
 *
 * Usage:
 * import SEO from '../components/SEO';
 *
 * In your page component:
 * <SEO page="home" />
 * <SEO page="properties" />
 * <SEO page="about" />
 * <SEO page="contact" />
 *
 * For property detail pages with custom data:
 * <SEO
 *   page="properties"
 *   customTitle="Luxury Villa in Amwaj Islands - Premia Realty"
 *   customDescription="4 bedroom luxury villa..."
 *   customImage="https://..."
 * />
 */

const SEO = ({
  page = 'home',
  customTitle = null,
  customDescription = null,
  customImage = null,
  customKeywords = null,
}) => {
  useEffect(() => {
    const meta = seoMetadata[page];
    if (!meta) return;

    // Set document title
    document.title = customTitle || meta.title;

    // Helper function to set or update meta tag
    const setMetaTag = (selector, attribute, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (attribute === 'property') {
          element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
        } else {
          element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic Meta Tags
    setMetaTag('meta[name="description"]', 'name', customDescription || meta.description);
    setMetaTag('meta[name="keywords"]', 'name', customKeywords || meta.keywords);
    setMetaTag('meta[name="robots"]', 'name', 'index, follow');
    setMetaTag('meta[name="author"]', 'name', 'Premia Realty');

    // Open Graph Tags
    setMetaTag('meta[property="og:type"]', 'property', 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', seoMetadata.siteName);
    setMetaTag('meta[property="og:title"]', 'property', customTitle || meta.ogTitle);
    setMetaTag('meta[property="og:description"]', 'property', customDescription || meta.ogDescription);
    setMetaTag('meta[property="og:image"]', 'property', customImage || meta.ogImage);
    setMetaTag('meta[property="og:url"]', 'property', `${seoMetadata.siteUrl}${page === 'home' ? '' : `/${page}`}`);
    setMetaTag('meta[property="og:locale"]', 'property', 'en_US');
    setMetaTag('meta[property="og:locale:alternate"]', 'property', 'ar_BH');

    // Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'summary_large_image');
    setMetaTag('meta[name="twitter:site"]', 'name', seoMetadata.twitterHandle);
    setMetaTag('meta[name="twitter:title"]', 'name', customTitle || meta.twitterTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', customDescription || meta.twitterDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', customImage || meta.twitterImage);

    // Geo Tags for Local SEO
    setMetaTag('meta[name="geo.region"]', 'name', 'BH');
    setMetaTag('meta[name="geo.placename"]', 'name', 'Bahrain');
    setMetaTag('meta[name="geo.position"]', 'name', '26.0667;50.5577');
    setMetaTag('meta[name="ICBM"]', 'name', '26.0667, 50.5577');

    // Add Structured Data (JSON-LD)
    const addStructuredData = (data, id) => {
      let script = document.getElementById(id);
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    // Add organization schema to all pages
    addStructuredData(structuredData.organization, 'structured-data-organization');

    // Add website schema to homepage
    if (page === 'home') {
      addStructuredData(structuredData.website, 'structured-data-website');
    }

    // Add breadcrumb schema to non-home pages
    if (page !== 'home') {
      const pageName = page.charAt(0).toUpperCase() + page.slice(1);
      addStructuredData(structuredData.breadcrumb(pageName), 'structured-data-breadcrumb');
    }

    // Cleanup function
    return () => {
      // Optional: Clean up structured data when component unmounts
      // This prevents duplicate schemas when navigating between pages
      const breadcrumbScript = document.getElementById('structured-data-breadcrumb');
      if (breadcrumbScript && page === 'home') {
        breadcrumbScript.remove();
      }
    };
  }, [page, customTitle, customDescription, customImage, customKeywords]);

  return null; // This component doesn't render anything
};

export default SEO;
