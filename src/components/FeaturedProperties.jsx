import { Link } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Square, Eye } from "lucide-react";

const featuredProperties = [
  {
    id: 1,
    title: "Luxury Penthouse Suite",
    location: "Downtown Manhattan",
    price: "$4,250,000",
    image: "/assets/property-1-BYXSAaID.jpg",
    beds: 3,
    baths: 2,
    area: "2,500 sq ft",
    status: "For Sale",
    featured: true,
  },
  {
    id: 2,
    title: "Modern Villa Estate",
    location: "Beverly Hills",
    price: "$8,900,000",
    image: "/assets/property-2-C4DbY7wx.jpg",
    beds: 5,
    baths: 4,
    area: "6,200 sq ft",
    status: "For Sale",
    featured: true,
  },
  {
    id: 3,
    title: "Executive Penthouse",
    location: "Miami Beach",
    price: "$3,750,000",
    image: "/assets/property-3-zqLbcdWX.jpg",
    beds: 4,
    baths: 3,
    area: "3,400 sq ft",
    status: "For Sale",
    featured: false,
  },
];

const FeaturedProperties = () => {
  return (
    <section className="bg-gradient-luxury py-20">
      <div className="container px-4 lg:px-8">
        <div className="mb-20 text-center animate-fade-in">
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-gold-primary/70 font-monument">
            Exclusive Collection
          </span>
          <h2 className="mb-6 text-2xl font-heading font-normal text-platinum-pearl md:text-3xl">
            Carefully curated residences
          </h2>
          <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-platinum-pearl/60">
            Each property represents the pinnacle of luxury living and architectural excellence.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property, index) => (
            <article
              key={property.id}
              className="group overflow-hidden rounded-[1.75rem] border border-gold-primary/20 bg-black/30 shadow-glass backdrop-blur-glass transition-all duration-500 hover:border-gold-primary/40 hover:shadow-luxury animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-luxury-black/60 opacity-0 transition duration-300 group-hover:opacity-100">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-primary/40 bg-black/40 text-gold-primary transition hover:bg-gold-primary hover:text-luxury-black"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-primary/40 bg-black/40 text-gold-primary transition hover:bg-gold-primary hover:text-luxury-black"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
                <div className="absolute top-4 left-4 rounded-full bg-gradient-gold px-4 py-1 text-sm font-semibold text-luxury-black">
                  {property.status}
                </div>
                {property.featured ? (
                  <div className="absolute top-4 right-4 rounded-full border border-gold-primary/50 bg-luxury-black/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-primary">
                    Featured
                  </div>
                ) : null}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-xl border border-gold-primary/30 bg-luxury-black/85 px-5 py-3 text-left text-2xl font-bold text-gold-primary shadow-gold">
                    {property.price}
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <h3 className="mb-3 text-lg font-heading font-medium text-platinum-pearl transition-colors duration-300 group-hover:text-gold-primary">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-sm text-platinum-pearl/60">
                    <MapPin className="mr-2 h-4 w-4 text-gold-primary/80" />
                    <span>{property.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gold-primary/10 pt-4 text-xs text-platinum-pearl/70">
                  <div className="flex items-center gap-1">
                    <Bed className="h-3.5 w-3.5 text-gold-primary/80" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5 text-gold-primary/80" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-3.5 w-3.5 text-gold-primary/80" />
                    <span>{property.area}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="rounded-full border border-gold-primary/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold-primary transition hover:border-gold-primary hover:bg-gold-primary/10"
                  >
                    View Details
                  </button>
                  <p className="text-xs uppercase tracking-[0.3em] text-platinum-pearl/40 font-monument">Exclusive Listing</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center animate-scale-in">
          <Link
            to="/properties"
            className="rounded-full border border-gold-primary/40 px-8 py-2 text-sm font-medium uppercase tracking-[0.4em] text-gold-primary transition hover:border-gold-primary hover:bg-gold-primary/10"
          >
            View Complete Collection
          </Link>
          <p className="mt-6 text-sm font-light text-platinum-pearl/50">
            Over 500 exceptional properties available exclusively
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
