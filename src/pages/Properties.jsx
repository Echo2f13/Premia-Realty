import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bath, Bed, Building, DollarSign, Heart, MapPin, Maximize, Search, Loader2 } from "lucide-react";
import {
  removeSavedProperty,
  savePropertyForUser,
  subscribeToSavedProperties,
} from "../data/firebaseService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import LuxurySelect from "../components/LuxurySelect";
import { priceRangeOptions, propertyTypeOptions } from "../data/filterOptions";

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
  const [listings, setListings] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [filters, setFilters] = useState({ location: "", propertyType: "", priceRange: "" });
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
      } else {
        await savePropertyForUser(user.uid, property);
      }
    } catch (error) {
      console.error("Failed to toggle saved property", error);
      alert("We were unable to update your saved residences. Please try again.");
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
          case '500k-1m':
            return price >= 500000 && price < 1000000;
          case '1m-2m':
            return price >= 1000000 && price < 2000000;
          case '2m-5m':
            return price >= 2000000 && price < 5000000;
          case '5m+':
            return price >= 5000000;
          default:
            return true;
        }
      });
    }

    setListings(filtered);
  }, [allProperties, filters.location, filters.propertyType, filters.priceRange]);

  // Apply filters automatically whenever they change
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Format price for display
  const formatPrice = (price, priceCadence) => {
    if (!price) return "Contact for price";

    const numPrice = typeof price === 'number' ? price : parseFloat(price);

    if (isNaN(numPrice)) return "Contact for price";

    const formatted = new Intl.NumberFormat("en-US").format(numPrice);

    return priceCadence ? `${formatted} BHD/${priceCadence}` : `${formatted} BHD`;
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
    <div className="bg-background text-platinum-pearl">
      <section className="relative isolate overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/70 to-luxury-black/40" />
          <div className="absolute right-0 top-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gold-primary/20 blur-[160px]" />
          <div className="absolute left-0 top-0 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gold-primary/15 blur-[200px] md:block" />
        </div>
        <div className="relative container px-4 lg:px-8">
          <div className="text-center animate-fade-in">
            <span className="text-xs font-medium uppercase tracking-[0.45em] text-gold-primary/75">
              Curated Portfolio
            </span>
            <h1 className="mt-6 text-4xl font-serif font-bold text-platinum-pearl md:text-5xl">
              Reserve access to the world's finest residences
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-base leading-relaxed text-platinum-pearl/70">
              Each listing is handpicked for architectural merit, location prominence, and bespoke lifestyle privileges.
            </p>
          </div>

          <div className="glass-card relative z-20 mt-14 grid grid-cols-1 gap-4 overflow-visible p-6 md:grid-cols-4 animate-slide-up">
            <div className="group relative flex items-center">
              <MapPin className="luxury-field-icon h-5 w-5" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
                className="luxury-input pl-12"
              />
            </div>
            <LuxurySelect
              className="h-full"
              icon={Building}
              placeholder="Property Type"
              options={propertyTypeOptions}
              value={filters.propertyType}
              onChange={(next) => setFilters((prev) => ({ ...prev, propertyType: next }))}
            />
            <LuxurySelect
              className="h-full"
              icon={DollarSign}
              placeholder="Price Range"
              options={priceRangeOptions}
              value={filters.priceRange}
              onChange={(next) => setFilters((prev) => ({ ...prev, priceRange: next }))}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="flex min-h-[54px] w-full items-center justify-center rounded-[1.7rem] bg-gradient-gold px-8 text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="container px-4 pb-24 lg:px-8">
        {/* Results Header */}
        <div className="mb-8">
          <p className="text-sm text-platinum-pearl/60">
            {loading ? (
              <span>Loading properties...</span>
            ) : (
              <span>
                Showing <span className="text-gold-primary font-semibold">{listings.length}</span> {listings.length === 1 ? 'property' : 'properties'}
                {allProperties.length !== listings.length && (
                  <span> of {allProperties.length} total</span>
                )}
              </span>
            )}
          </p>
        </div>

        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr,0.85fr]">
          <div className="glass-card space-y-6 p-10">
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-gold-primary/75">Collector's Brief</p>
            <h2 className="text-3xl font-serif font-bold text-platinum-pearl">Private preview protocol</h2>
            <p className="text-sm leading-relaxed text-platinum-pearl/70">
              Submit your intent and a concierge will choreograph a twilight walkthrough suited to your schedule. Expect
              chauffeured arrivals, sommelier pairings, and spatial technology demonstrations personalised to your preferences.
            </p>
            <div className="grid gap-3 text-xs uppercase tracking-[0.35em] text-platinum-pearl/60 sm:grid-cols-2">
              <div className="rounded-full border border-gold-primary/20 bg-luxury-black/40 px-4 py-3">Bespoke interior curation</div>
              <div className="rounded-full border border-gold-primary/20 bg-luxury-black/40 px-4 py-3">Metaverse digital twin tour</div>
              <div className="rounded-full border border-gold-primary/20 bg-luxury-black/40 px-4 py-3">Private chef tasting</div>
              <div className="rounded-full border border-gold-primary/20 bg-luxury-black/40 px-4 py-3">Financial structuring assistance</div>
            </div>
          </div>

          <div className="glass-card space-y-6 bg-luxury-black/55 p-10">
            <p className="text-xs font-medium uppercase tracking-[0.42em] text-gold-primary/75">Market Insights</p>
            <h3 className="text-2xl font-serif text-platinum-pearl">Residency trends 2025</h3>
            <ul className="space-y-4 text-sm leading-relaxed text-platinum-pearl/70">
              <li>Mumbai coastal penthouses observe 18% YoY appreciation with limited inventory.</li>
              <li>Gurgaon's biophilic villas in Golf Course micro-markets see increased NRI demand.</li>
              <li>Goan beachfront villas experience 2x booking velocity for hospitality co-ownership models.</li>
            </ul>
            <span className="inline-flex w-fit items-center rounded-full border border-gold-primary/20 px-5 py-2 text-xs uppercase tracking-[0.4em] text-gold-primary">
              Concierge insight desk
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-gold-primary animate-spin" />
            <p className="mt-4 text-platinum-pearl/60">Loading properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="glass-card border-red-500/30 bg-red-500/5 p-10 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border border-gold-primary/40 px-6 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-gold-primary transition hover:border-gold-primary hover:bg-gold-primary/10"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && listings.length === 0 && (
          <div className="glass-card p-10 text-center">
            <p className="text-platinum-pearl/60">
              {allProperties.length === 0
                ? "No properties available at this time."
                : "No properties match your search criteria. Try adjusting your filters."}
            </p>
            {allProperties.length > 0 && (
              <button
                onClick={() => {
                  setFilters({ location: "", propertyType: "", priceRange: "" });
                  setListings(allProperties);
                }}
                className="mt-4 rounded-full border border-gold-primary/40 px-6 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-gold-primary transition hover:border-gold-primary hover:bg-gold-primary/10"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((property, index) => {
            const propertyKey = getPropertyKey(property, index);
            const isSaved = savedIdentifiers.has(propertyKey);

              return (
                <article
                  key={propertyKey}
                  className="group overflow-hidden rounded-[1.75rem] border border-gold-primary/20 bg-black/30 shadow-glass backdrop-blur-glass transition-all duration-500 hover:border-gold-primary/40 hover:shadow-luxury animate-scale-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.images?.[0] || property.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        handleToggleSaved(property, index);
                      }}
                      className={`absolute top-4 right-4 rounded-full p-2 transition ${
                        isSaved ? "bg-gold-primary text-luxury-black shadow-gold" : "bg-luxury-black/80 text-gold-primary"
                      }`}
                      aria-label={isSaved ? "Remove from saved" : "Save residence"}
                    >
                      <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                    </button>

                    {/* Inclusive Badge */}
                    {property.inclusive && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-primary to-[#f5d37f] text-background px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Inclusive
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="rounded-xl border border-gold-primary/30 bg-luxury-black/85 px-5 py-3 text-left text-lg font-bold text-gold-primary">
                        {formatPrice(property.price, property.priceCadence)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 p-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-platinum-pearl transition-colors duration-300 group-hover:text-gold-primary">
                        {property.title}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-platinum-pearl/70">
                        <MapPin className="mr-1.5 h-4 w-4" />
                        <span>
                          {(() => {
                            // Handle location object from nested structure
                            if (property.location && typeof property.location === 'object') {
                              const parts = [
                                property.location.area,
                                property.location.city,
                                property.location.governorate
                              ].filter(Boolean);
                              return parts.length > 0 ? parts.join(", ") : "Location not specified";
                            }
                            // Handle flat structure
                            const parts = [property.area, property.city, property.governorate]
                              .filter(Boolean);
                            return parts.length > 0 ? parts.join(", ") : "Location not specified";
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gold-primary/10 pt-4 text-sm text-platinum-pearl/75">
                      {(() => {
                        const bedrooms = property.specs?.bedrooms || property.bedrooms;
                        return bedrooms ? (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{bedrooms} Bed{bedrooms !== 1 ? 's' : ''}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 opacity-50">
                            <Bed className="h-4 w-4" />
                            <span>N/A</span>
                          </div>
                        );
                      })()}
                      {(() => {
                        const bathrooms = property.specs?.bathrooms || property.bathrooms;
                        return bathrooms ? (
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{bathrooms} Bath{bathrooms !== 1 ? 's' : ''}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 opacity-50">
                            <Bath className="h-4 w-4" />
                            <span>N/A</span>
                          </div>
                        );
                      })()}
                      <div className="flex items-center gap-1">
                        <Maximize className="h-4 w-4" />
                        <span>{formatArea(property)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/property/${property.id}`);
                      }}
                      className="w-full rounded-full border border-gold-primary/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold-primary transition hover:border-gold-primary hover:bg-gold-primary/10"
                    >
                      View Residence
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Properties;
