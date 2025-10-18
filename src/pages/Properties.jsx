import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bath, Bed, Heart, MapPin, Maximize, Loader2 } from "lucide-react";
import {
  removeSavedProperty,
  savePropertyForUser,
  subscribeToSavedProperties,
} from "../data/firebaseService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import { useToast } from "../components/Toast";
import ScrollReveal from "../components/ScrollReveal";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

const getPropertyKey = (property, fallback) => {
  if (property?.id) return String(property.id);
  if (property?.slug) return property.slug;
  if (property?.title) {
    const normalized = property.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (normalized) {
      return normalized;
    }
  }
  return `fallback-${fallback}`;
};

const Properties = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [filters, setFilters] = useState({ location: "", propertyType: "", priceRange: "", bedrooms: "" });
  const [savedResidences, setSavedResidences] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all properties from Firestore
  useEffect(() => {
    let active = true;

    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("📥 Starting to fetch properties from Firestore...");
        const propertiesCollection = collection(db, "properties");

        // Fetch ALL documents first (simpler query, no index needed)
        const snapshot = await getDocs(propertiesCollection);

        console.log("📦 Total documents fetched:", snapshot.docs.length);

        // Filter out deleted properties in JavaScript
        let fetchedProperties = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(prop => !prop.deletedAt); // Filter non-deleted

        console.log("✅ Non-deleted properties:", fetchedProperties.length);

        // Sort by createdAt in JavaScript
        fetchedProperties = fetchedProperties.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime; // Newest first
        });

        console.log("🎯 Final properties to display:", fetchedProperties);

        if (active) {
          setAllProperties(fetchedProperties);
          setListings(fetchedProperties);
          console.log("✨ State updated with properties");
        }
      } catch (error) {
        console.error("❌ Error fetching properties:", error);
        console.error("❌ Error code:", error.code);
        console.error("❌ Error message:", error.message);

        if (active) {
          setError(`Failed to load properties: ${error.message}`);
        }
      } finally {
        if (active) {
          setLoading(false);
          console.log("🏁 Loading complete");
        }
      }
    };

    fetchProperties();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSavedResidences(new Map());
      return undefined;
    }

    const unsubscribe = subscribeToSavedProperties(user.uid, (items) => {
      const nextMap = new Map();
      items.forEach((item) => {
        const key = item.propertyId ?? item.id;
        nextMap.set(key, item);
      });
      setSavedResidences(nextMap);
    });

    return () => unsubscribe?.();
  }, [isAuthenticated, user]);

  const handleToggleSaved = async (property, fallbackKey) => {
    if (!isAuthenticated || !user) {
      navigate("/login", { state: { from: "/properties" } });
      return;
    }

    const propertyKey = getPropertyKey(property, fallbackKey);

    try {
      if (savedResidences.has(propertyKey)) {
        await removeSavedProperty(user.uid, propertyKey);
        toast.info("Property removed from saved list");
      } else {
        await savePropertyForUser(user.uid, property);
        toast.success("Property saved successfully!");
      }
    } catch (error) {
      console.error("Failed to toggle saved property", error);
      toast.error("We were unable to update your saved residences. Please try again.");
    }
  };

  const savedIdentifiers = useMemo(() => new Set(savedResidences.keys()), [savedResidences]);

  // Apply filters
  const handleSearch = useCallback(() => {
    let filtered = [...allProperties];

    // Filter by location (search in governorate, city, area, and address)
    if (filters.location.trim()) {
      const searchTerm = filters.location.toLowerCase().trim();
      filtered = filtered.filter(property => {
        // Handle nested location object
        let governorate = '';
        let city = '';
        let area = '';
        let address = '';

        if (property.location && typeof property.location === 'object') {
          governorate = (property.location.governorate || '').toLowerCase();
          city = (property.location.city || '').toLowerCase();
          area = (property.location.area || '').toLowerCase();
        } else {
          // Handle flat structure
          governorate = (property.governorate || '').toLowerCase();
          city = (property.city || '').toLowerCase();
          area = (property.area || '').toLowerCase();
        }

        address = (property.address || '').toLowerCase();

        return governorate.includes(searchTerm) ||
               city.includes(searchTerm) ||
               area.includes(searchTerm) ||
               address.includes(searchTerm);
      });
    }

    // Filter by property type
    if (filters.propertyType) {
      filtered = filtered.filter(property =>
        property.propertyType === filters.propertyType
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(property => {
        const price = parseFloat(property.price) || 0;

        switch (filters.priceRange) {
          case '0-500k':
            return price < 500000;
          case '500k-1m':
            return price >= 500000 && price < 1000000;
          case '1m+':
            return price >= 1000000;
          default:
            return true;
        }
      });
    }

    // Filter by bedrooms
    if (filters.bedrooms) {
      filtered = filtered.filter(property => {
        const beds = property.specs?.bedrooms || property.bedrooms || 0;
        const minBeds = parseInt(filters.bedrooms);
        return beds >= minBeds;
      });
    }

    setListings(filtered);
  }, [allProperties, filters.location, filters.propertyType, filters.priceRange, filters.bedrooms]);

  // Apply filters automatically whenever they change
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return t(translations.properties.contactForPrice);

    const numPrice = typeof price === 'number' ? price : parseFloat(price);

    if (isNaN(numPrice)) return t(translations.properties.contactForPrice);

    const formatted = new Intl.NumberFormat("en-US").format(numPrice);

    return `BD ${formatted}`;
  };

  // Format area for display
  const formatArea = (property) => {
    // Check for nested specs object first
    if (property.specs && typeof property.specs === 'object') {
      if (property.specs.areaSqft) return `${property.specs.areaSqft} sqft`;
      if (property.specs.areaSqm) return `${property.specs.areaSqm} sqm`;
    }
    // Check flat structure
    if (property.area && typeof property.area === 'string') return property.area;
    if (property.sqft) return `${property.sqft} sqft`;
    if (property.size) return property.size;
    return "N/A";
  };

  // Debug logging
  console.log("🎨 Rendering Properties component", {
    loading,
    error,
    listingsCount: listings.length,
    allPropertiesCount: allProperties.length
  });

  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle">
      <div className="pt-24">
        {/* Header */}
        <section className="py-20 border-b border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="text-accent text-base font-semibold tracking-[0.3em] mb-4">{t(translations.properties.subtitle)}</div>
              <h1 className="text-6xl md:text-7xl mb-6">{t(translations.properties.title)}</h1>
              <p className="text-xl text-foreground/60 font-light leading-relaxed">
                {t(translations.properties.description)}
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-12 border-b border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-4 gap-6">
              <input
                type="text"
                placeholder={t(translations.properties.filters.searchPlaceholder)}
                value={filters.location}
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                className="bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
              />
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value }))}
                className="bg-card border border-border/50 h-12 px-4 text-foreground/90 focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">{t(translations.properties.filters.propertyType)}</option>
                <option value="Villa">{t(translations.properties.filters.villa)}</option>
                <option value="Apartment">{t(translations.properties.filters.apartment)}</option>
                <option value="Penthouse">{t(translations.properties.filters.penthouse)}</option>
                <option value="Townhouse">{t(translations.properties.filters.townhouse)}</option>
              </select>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value }))}
                className="bg-card border border-border/50 h-12 px-4 text-foreground/90 focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">{t(translations.properties.filters.priceRange)}</option>
                <option value="0-500k">{t(translations.properties.filters.below500k)}</option>
                <option value="500k-1m">{t(translations.properties.filters.range500kTo1m)}</option>
                <option value="1m+">{t(translations.properties.filters.above1m)}</option>
              </select>
              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
                className="bg-card border border-border/50 h-12 px-4 text-foreground/90 focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">{t(translations.properties.filters.bedrooms)}</option>
                <option value="2">{t(translations.properties.filters.bedrooms2Plus)}</option>
                <option value="3">{t(translations.properties.filters.bedrooms3Plus)}</option>
                <option value="4">{t(translations.properties.filters.bedrooms4Plus)}</option>
                <option value="5">{t(translations.properties.filters.bedrooms5Plus)}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="py-20">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <p className="mt-4 text-foreground/60">{t(translations.properties.loading)}</p>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && !loading && (
          <section className="py-20">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="border border-destructive/30 bg-destructive/5 p-10 text-center">
                <p className="text-destructive">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 border border-accent px-6 py-2 text-sm tracking-[0.15em] text-accent transition hover:bg-accent hover:text-background"
                >
                  {t(translations.properties.tryAgain)}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && listings.length === 0 && (
          <section className="py-20">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center py-20">
                <p className="text-foreground/60 mb-6">
                  {allProperties.length === 0
                    ? t(translations.properties.noProperties)
                    : t(translations.properties.noMatch)}
                </p>
                {allProperties.length > 0 && (
                  <button
                    onClick={() => {
                      setFilters({ location: "", propertyType: "", priceRange: "", bedrooms: "" });
                      setListings(allProperties);
                    }}
                    className="border border-accent px-8 py-3 text-sm tracking-[0.15em] text-accent transition hover:bg-accent hover:text-background"
                  >
                    {t(translations.properties.clearFilters)}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Properties Grid */}
        {!loading && !error && listings.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((property, index) => {
                  const propertyKey = getPropertyKey(property, index);
                  const isSaved = savedIdentifiers.has(propertyKey);

                  return (
                    <ScrollReveal key={propertyKey} animation="fade-in-up" delay={index * 50}>
                      <div className="group hover-lift">
                      <div className="relative h-[400px] mb-6 overflow-hidden hover-zoom-image">
                        <img
                          src={property.images?.[0] || property.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                          onClick={() => navigate(`/property/${property.id}`)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-60" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSaved(property, index);
                          }}
                          className="absolute top-6 right-6 w-10 h-10 border border-foreground/20 bg-background/20 backdrop-blur-sm flex items-center justify-center hover:bg-accent hover:border-accent transition-all group/heart"
                        >
                          <Heart
                            className={`w-5 h-5 transition-all ${isSaved
                                ? 'fill-accent text-accent'
                                : 'text-foreground/60 group-hover/heart:text-background'
                              }`}
                            strokeWidth={1}
                          />
                        </button>
                      </div>

                      <div className="space-y-4 cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                        <div>
                          <div className="text-sm text-accent tracking-wider mb-2">
                            {(() => {
                              // Handle location object from nested structure
                              if (property.location && typeof property.location === 'object') {
                                return property.location.area || property.location.governorate || "Bahrain";
                              }
                              // Handle flat structure
                              return property.area || property.governorate || "Bahrain";
                            })()}
                          </div>
                          <h3 className="text-2xl mb-2">{property.title}</h3>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-foreground/60">
                          {(() => {
                            const bedrooms = property.specs?.bedrooms || property.bedrooms;
                            return bedrooms ? (
                              <div className="flex items-center gap-2">
                                <Bed className="w-4 h-4" strokeWidth={1} />
                                <span>{bedrooms}</span>
                              </div>
                            ) : null;
                          })()}
                          {(() => {
                            const bathrooms = property.specs?.bathrooms || property.bathrooms;
                            return bathrooms ? (
                              <div className="flex items-center gap-2">
                                <Bath className="w-4 h-4" strokeWidth={1} />
                                <span>{bathrooms}</span>
                              </div>
                            ) : null;
                          })()}
                          <div className="flex items-center gap-2">
                            <Maximize className="w-4 h-4" strokeWidth={1} />
                            <span>{formatArea(property)}</span>
                          </div>
                        </div>

                        <div className="text-2xl text-accent pt-2">{formatPrice(property.price)}</div>
                      </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Properties;
