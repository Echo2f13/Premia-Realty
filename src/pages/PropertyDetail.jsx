import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Heart,
  Share2,
  Flag,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { savePropertyForUser, removeSavedProperty } from "../data/firebaseService";
import ScrollReveal from "../components/ScrollReveal";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("📥 Fetching property:", id);
        const propertyRef = doc(db, "properties", id);
        const propertySnap = await getDoc(propertyRef);

        if (!propertySnap.exists()) {
          setError("Property not found");
          return;
        }

        const propertyData = {
          id: propertySnap.id,
          ...propertySnap.data(),
        };

        console.log("✅ Property loaded:", propertyData);
        setProperty(propertyData);
      } catch (err) {
        console.error("❌ Error fetching property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Handle save/unsave
  const handleToggleSave = async () => {
    if (!isAuthenticated || !user) {
      navigate("/login", { state: { from: `/property/${id}` } });
      return;
    }

    try {
      if (isSaved) {
        await removeSavedProperty(user.uid, id);
        setIsSaved(false);
      } else {
        await savePropertyForUser(user.uid, property);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  // Image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (property?.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (property?.images?.length || 1) - 1 : prev - 1
    );
  };

  // Format functions
  const formatPrice = (price, priceCadence) => {
    if (!price) return "Contact for price";
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    if (isNaN(numPrice)) return "Contact for price";
    const formatted = new Intl.NumberFormat("en-US").format(numPrice);
    return priceCadence ? `${formatted} BHD/${priceCadence}` : `${formatted} BHD`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Available now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const sqftToSqm = (sqft) => {
    return (sqft * 0.092903).toFixed(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-primary/20 border-t-gold-primary rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-platinum-pearl/60">Loading property...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-10 text-center max-w-md">
          <p className="text-red-400 mb-4">{error || "Property not found"}</p>
          <button
            onClick={() => navigate("/properties")}
            className="rounded-full border border-gold-primary/40 px-6 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-gold-primary transition hover:border-gold-primary hover:bg-gold-primary/10"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const bedrooms = property.specs?.bedrooms || property.bedrooms || 0;
  const bathrooms = property.specs?.bathrooms || property.bathrooms || 0;
  const areaSqft = property.specs?.areaSqft || property.areaSqft || null;
  const areaSqm = areaSqft ? sqftToSqm(areaSqft) : (property.specs?.areaSqm || null);

  return (
    <div className="bg-background text-platinum-pearl min-h-screen">
      {/* Header Breadcrumb */}
      <div className="border-b border-gold-primary/10 bg-luxury-black/50">
        <div className="container px-4 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-platinum-pearl/60">
            <Link to="/" className="hover:text-gold-primary transition">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-gold-primary transition">Properties</Link>
            <span>/</span>
            <span className="text-platinum-pearl">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="relative bg-black">
        <div className="container px-4 lg:px-8 py-6">
          <div className="relative">
            {/* Main Image */}
            <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden">
              <img
                src={images[currentImageIndex] || 'https://via.placeholder.com/1200x600?text=No+Image'}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
                {currentImageIndex + 1} / {images.length || 1}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  onClick={handleToggleSave}
                  className={`p-3 rounded-full backdrop-blur-sm transition ${
                    isSaved
                      ? 'bg-gold-primary text-luxury-black'
                      : 'bg-black/70 text-white hover:bg-gold-primary hover:text-luxury-black'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-gold-primary hover:text-luxury-black transition"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-red-500 transition">
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-gold-primary hover:text-luxury-black transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-gold-primary hover:text-luxury-black transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreenGallery(true)}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm hover:bg-gold-primary hover:text-luxury-black transition"
              >
                <ExternalLink className="w-4 h-4 inline mr-2" />
                View all photos
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-6 lg:grid-cols-12 gap-2">
                {images.slice(0, 12).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === idx
                        ? 'border-gold-primary'
                        : 'border-transparent hover:border-gold-primary/50'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr,400px] gap-12">
          {/* Left Column - Property Details */}
          <div className="space-y-8">
            {/* Pricing & Summary */}
            <ScrollReveal animation="fade-in-up" delay={100}>
              <div className="glass-card p-8 border border-gold-primary/20">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-4xl font-bold text-gold-primary">
                    {formatPrice(property.price, property.priceCadence)}
                  </div>
                  {property.inclusive && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-gold-primary/10 border border-gold-primary/30 rounded-full px-4 py-1.5">
                      <Shield className="w-4 h-4 text-gold-primary" />
                      <span className="text-sm font-semibold text-gold-primary">Inclusive</span>
                    </div>
                  )}
                </div>
                {property.featured && (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    HOT DEAL
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-luxury-charcoal/50 rounded-xl">
                  <Bed className="w-6 h-6 text-gold-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-platinum-pearl">{bedrooms}</div>
                  <div className="text-xs text-platinum-pearl/60">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-luxury-charcoal/50 rounded-xl">
                  <Bath className="w-6 h-6 text-gold-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-platinum-pearl">{bathrooms}</div>
                  <div className="text-xs text-platinum-pearl/60">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-luxury-charcoal/50 rounded-xl">
                  <Maximize className="w-6 h-6 text-gold-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-platinum-pearl">{areaSqft || 'N/A'}</div>
                  <div className="text-xs text-platinum-pearl/60">sqft {areaSqm && `(${areaSqm}m²)`}</div>
                </div>
                <div className="text-center p-4 bg-luxury-charcoal/50 rounded-xl">
                  <MapPin className="w-6 h-6 text-gold-primary mx-auto mb-2" />
                  <div className="text-sm font-bold text-platinum-pearl truncate">{property.location?.city || 'N/A'}</div>
                  <div className="text-xs text-platinum-pearl/60">Location</div>
                </div>
              </div>
              </div>
            </ScrollReveal>

            {/* Title & Description */}
            <ScrollReveal animation="fade-in-up" delay={200}>
              <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-platinum-pearl mb-4">
                {property.title}
              </h1>

              <div className="prose prose-invert max-w-none">
                <p className="text-platinum-pearl/80 leading-relaxed">
                  {showFullDescription
                    ? property.description
                    : `${property.description?.substring(0, 300)}${property.description?.length > 300 ? '...' : ''}`
                  }
                </p>
                {property.description?.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-4 text-gold-primary hover:text-gold-accent transition flex items-center gap-2"
                  >
                    {showFullDescription ? 'Show less' : 'See full description'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {property.availableFrom && (
                <div className="mt-4 flex items-center gap-2 text-platinum-pearl/70">
                  <Calendar className="w-5 h-5" />
                  <span>Available from: <strong className="text-platinum-pearl">{formatDate(property.availableFrom)}</strong></span>
                </div>
              )}
              </div>
            </ScrollReveal>

            {/* Property Details Table */}
            <ScrollReveal animation="fade-in-up" delay={300}>
              <div className="glass-card p-8 border border-gold-primary/20">
              <h2 className="text-2xl font-serif font-bold text-platinum-pearl mb-6">Property Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <DetailRow label="Property Type" value={property.propertyType || property.type || 'N/A'} />
                <DetailRow label="Size" value={`${areaSqft || 'N/A'} sqft ${areaSqm ? `(${areaSqm}m²)` : ''}`} />
                <DetailRow label="Bedrooms" value={bedrooms} />
                <DetailRow label="Bathrooms" value={bathrooms} />
                <DetailRow label="Furnished" value={property.furnished ? 'Yes' : 'No'} />
                <DetailRow label="Reference ID" value={property.referenceCode || property.id} />
              </div>
              </div>
            </ScrollReveal>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <ScrollReveal animation="fade-in-up" delay={400}>
                <div className="glass-card p-8 border border-gold-primary/20">
                <h2 className="text-2xl font-serif font-bold text-platinum-pearl mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(showAllAmenities ? property.amenities : property.amenities.slice(0, 12)).map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-platinum-pearl/80">
                      <div className="w-2 h-2 bg-gold-primary rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                {property.amenities.length > 12 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-4 text-gold-primary hover:text-gold-accent transition"
                  >
                    {showAllAmenities ? 'Show less' : `See all amenities (${property.amenities.length})`}
                  </button>
                )}
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Right Column - Agent & Map */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Agent Card - Placeholder for now */}
            <ScrollReveal animation="fade-in-up" delay={100}>
              <div className="glass-card p-6 border border-gold-primary/20">
              <h3 className="text-xl font-serif font-bold text-platinum-pearl mb-4">Contact Agent</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-gold rounded-full px-6 py-3 text-luxury-black font-semibold hover:shadow-luxury transition">
                  <Phone className="w-5 h-5" />
                  Call Now
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 rounded-full px-6 py-3 text-white font-semibold hover:bg-green-700 transition">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>
              </div>
            </ScrollReveal>

            {/* Map Preview - Placeholder */}
            {property.location?.lat && property.location?.lng && (
              <ScrollReveal animation="fade-in-up" delay={200}>
                <div className="glass-card p-6 border border-gold-primary/20">
                <h3 className="text-xl font-serif font-bold text-platinum-pearl mb-4">Location</h3>
                <div className="h-64 bg-luxury-charcoal rounded-xl flex items-center justify-center text-platinum-pearl/60">
                  <MapPin className="w-12 h-12" />
                </div>
                <p className="mt-4 text-sm text-platinum-pearl/70">
                  {[property.location.area, property.location.city, property.location.governorate].filter(Boolean).join(', ')}
                </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Fullscreen Gallery Modal */}
      {isFullscreenGallery && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreenGallery(false)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[currentImageIndex]}
            alt={property.title}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for detail rows
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gold-primary/10">
    <span className="text-platinum-pearl/60">{label}</span>
    <span className="text-platinum-pearl font-semibold">{value}</span>
  </div>
);

export default PropertyDetail;
