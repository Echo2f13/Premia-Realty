import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bath, Bed, Heart, MapPin, Maximize, Search } from "lucide-react";
import staticData from "../data/properties.json";
import {
  getAllProperties,
  removeSavedProperty,
  savePropertyForUser,
  subscribeToSavedProperties,
} from "../data/firebaseService";
import useAuth from "../hooks/useAuth";

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
  const [listings, setListings] = useState(staticData.listings);
  const [savedResidences, setSavedResidences] = useState(new Map());

  useEffect(() => {
    let active = true;

    const fetchProperties = async () => {
      try {
        const fetchedProperties = await getAllProperties();
        if (active && fetchedProperties.length) {
          setListings(fetchedProperties);
        }
      } catch (error) {
        console.error("Failed to load properties from Firestore", error);
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

  return (
    <div className="bg-background text-platinum-pearl">
      <section className="relative isolate overflow-hidden py-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/70 to-luxury-black/40" />
          <div className="absolute right-0 top-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gold-primary/20 blur-[160px]" />
          <div className="absolute left-0 top-0 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gold-primary/15 blur-[200px] md:block" />
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('/assets/hero-skyline-B9OuM1TT.jpg')] bg-cover bg-center opacity-15 lg:block" />
        </div>
        <div className="relative container px-4 lg:px-8">
          <span className="text-xs font-medium uppercase tracking-[0.45em] text-gold-primary/75">Curated Portfolio</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-serif font-bold text-platinum-pearl md:text-5xl">
            Reserve access to the world&apos;s finest residences
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-platinum-pearl/70">
            Each listing is handpicked for architectural merit, location prominence, and bespoke lifestyle privileges. Experience sky penthouses, landscaped villas, and duplex sanctuaries guided by our concierge collective.
          </p>

          <div className="glass-card mt-14 grid grid-cols-1 gap-4 p-6 md:grid-cols-4 animate-slide-up">
            <input
              type="text"
              placeholder="Location"
              className="rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/50 focus:border-gold-primary focus:outline-none"
            />
            <select className="rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none">
              <option value="" hidden>
                Property Type
              </option>
              <option value="apartment">Apartment</option>
              <option value="penthouse">Penthouse</option>
              <option value="villa">Villa</option>
            </select>
            <select className="rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none">
              <option value="" hidden>
                Price Range
              </option>
              <option value="5000">Up to $5,000</option>
              <option value="10000">$5,000 - $10,000</option>
              <option value="15000">$10,000+</option>
            </select>
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-gold text-xs font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="container px-4 pb-24 lg:px-8">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr,0.85fr]">
          <div className="glass-card space-y-6 p-10">
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-gold-primary/75">Collector&apos;s Brief</p>
            <h2 className="text-3xl font-serif font-bold text-platinum-pearl">Private preview protocol</h2>
            <p className="text-sm leading-relaxed text-platinum-pearl/70">
              Submit your intent and a concierge will choreograph a twilight walkthrough suited to your schedule. Expect chauffeured arrivals, sommelier pairings, and spatial technology demonstrations personalised to your preferences.
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
              <li>Gurgaon&apos;s biophilic villas in Golf Course micro-markets see increased NRI demand.</li>
              <li>Goan beachfront villas experience 2x booking velocity for hospitality co-ownership models.</li>
            </ul>
            <span className="inline-flex w-fit items-center rounded-full border border-gold-primary/20 px-5 py-2 text-xs uppercase tracking-[0.4em] text-gold-primary">
              Concierge insight desk
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((property, index) => {
            const propertyKey = getPropertyKey(property, index);
            const isSaved = savedIdentifiers.has(propertyKey);

            return (
              <article
                key={propertyKey}
                className="group glass-card overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      handleToggleSaved(property, index);
                    }}
                    className={`absolute top-4 right-4 rounded-full p-2 transition ${
                      isSaved
                        ? "bg-gold-primary text-luxury-black shadow-gold"
                        : "bg-luxury-black/80 text-gold-primary"
                    }`}
                    aria-label={isSaved ? "Remove from saved" : "Save residence"}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                  </button>
                  <div className="absolute bottom-4 left-4 rounded-full bg-gradient-gold px-4 py-1 text-sm font-bold text-luxury-black">
                    {property.price}
                  </div>
                </div>
                <div className="space-y-6 p-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-platinum-pearl transition-colors duration-300 group-hover:text-gold-primary">
                      {property.title}
                    </h3>
                    <div className="mt-2 flex items-center text-sm text-platinum-pearl/70">
                      <MapPin className="mr-1.5 h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-platinum-pearl/75">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.baths} Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" />
                      <span>{property.area}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/contact")}
                    className="w-full rounded-full border border-gold-primary/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold-primary transition hover:border-gold-primary hover:bg-gold-primary/10"
                  >
                    View Residence
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Properties;


