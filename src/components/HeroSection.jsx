import { useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, Home, MapPin, Search } from "lucide-react";
import LuxurySelect from "./LuxurySelect";
import { priceRangeOptions, propertyTypeOptions } from "../data/filterOptions";
import Prism from "./Prism";

const stats = [
  { label: "Exclusive Properties", value: "500+" },
  { label: "Prime Locations", value: "50+" },
  { label: "Satisfaction Rate", value: "98%" },
];

const HeroSection = () => {
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
  });

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Prism Background */}
      <div className="absolute inset-0">
        <Prism
          animationType="rotate"
          timeScale={0.4}
          height={3.5}
          baseWidth={5.5}
          scale={4}
          hueShift={0}
          colorFrequency={0.8}
          noise={0.3}
          glow={0.7}
          bloom={0.8}
          suspendWhenOffscreen={true}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-luxury-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-luxury-black/55" />
      <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/8 via-transparent to-gold-primary/15" />

      <div className="relative z-20 container px-4 text-center lg:px-8">
        <div className="mx-auto max-w-4xl animate-fade-in">
          <div className="mb-12">
            <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.2em] text-gold-primary/70">
              Premia Realty
            </span>
            
          </div>

          <div className="glass-card relative z-20 mx-auto max-w-5xl overflow-visible animate-slide-up p-8">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-serif text-platinum-pearl">Find your sanctuary</h3>
              <p className="mt-2 text-sm text-platinum-pearl/60">Search through our curated collection</p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
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
                icon={Home}
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
                className="flex min-h-[54px] w-full items-center justify-center rounded-[1.7rem] bg-gradient-gold px-8 text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 border-t border-gold-primary/10 pt-6 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-light text-gold-primary">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-platinum-pearl/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:justify-center animate-scale-in">
            <Link
              to="/properties"
              className="rounded-full bg-gradient-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
            >
              Explore Collection
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-gold-primary/40 px-8 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-gold-primary transition hover:border-gold-primary hover:bg-gold-primary/10"
            >
              Private Consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce md:block">
        <div className="flex h-10 w-6 items-center justify-center rounded-full border border-gold-primary/50">
          <div className="h-2 w-0.5 animate-pulse rounded-full bg-gold-primary/80" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
