import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bath, Bed, DollarSign, House, MapPin, Maximize, Search } from 'lucide-react';

const heroBackground = '/assets/hero-skyline-B9OuM1TT.jpg';

const stats = [
  { label: 'Exclusive Properties', value: '500+' },
  { label: 'Prime Locations', value: '50+' },
  { label: 'Satisfaction Rate', value: '98%' },
];

const highlights = [
  { icon: Bed, value: '5,000+', label: 'Luxury Residences' },
  { icon: Bath, value: '2,000+', label: 'Spa-grade suites' },
  { icon: Maximize, value: '20+', label: 'Global Cities' },
];

const HeroSection = () => {
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
  });

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/82 via-luxury-black/65 to-luxury-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-luxury-black/60" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/10 via-transparent to-gold-primary/20" />

      <div className="relative z-10 container px-4 text-center lg:px-8">
        <div className="mx-auto max-w-4xl animate-fade-in">
          <div className="mb-14">
            <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.2em] text-gold-primary/70">
              Premia Realty
            </span>
            <h1 className="text-3xl font-normal leading-tight text-platinum-pearl md:text-5xl lg:text-6xl">
              <span>Where exceptional properties</span>
              <br />
              <span className="text-gold-primary">meet discerning taste</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-platinum-pearl/70 md:text-xl">
              Curating the world's most exclusive residences for those who appreciate the finer things in life.
            </p>
          </div>

          <div className="glass-card mx-auto max-w-5xl animate-slide-up p-8">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-serif text-platinum-pearl">Find your sanctuary</h3>
              <p className="mt-2 text-sm text-platinum-pearl/60">Search through our curated collection</p>
            </div>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-primary" />
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
                  className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 pl-12 text-sm text-platinum-pearl placeholder:text-platinum-pearl/50 focus:border-gold-primary focus:outline-none focus:ring-0"
                />
              </div>
              <div className="relative">
                <House className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-primary" />
                <select
                  value={filters.propertyType}
                  onChange={(event) => setFilters((prev) => ({ ...prev, propertyType: event.target.value }))}
                  className="w-full appearance-none rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 pl-12 pr-10 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none"
                >
                  <option value="" disabled hidden>
                    Property Type
                  </option>
                  <option value="apartment">Luxury Apartment</option>
                  <option value="villa">Premium Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-primary" />
                <select
                  value={filters.priceRange}
                  onChange={(event) => setFilters((prev) => ({ ...prev, priceRange: event.target.value }))}
                  className="w-full appearance-none rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 pl-12 pr-10 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none"
                >
                  <option value="" disabled hidden>
                    Price Range
                  </option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="1m-2m">$1M - $2M</option>
                  <option value="2m-5m">$2M - $5M</option>
                  <option value="5m+">$5M+</option>
                </select>
              </div>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-gold text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 border-t border-gold-primary/10 pt-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-light text-gold-primary">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-platinum-pearl/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-gold-primary/20 bg-luxury-black/40 px-6 py-5 text-left backdrop-blur-glass shadow-glass"
              >
                <item.icon className="mb-4 h-6 w-6 text-gold-primary" />
                <p className="text-lg font-semibold text-gold-primary">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-platinum-pearl/50">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:justify-center">
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
    </section>
  );
};

export default HeroSection;