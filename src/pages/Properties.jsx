import PropertyCard from "../components/PropertyCard";
import properties from "../data/properties.json";

const Properties = () => {
  return (
    <div className="space-y-16 pb-24">
      <section className="relative overflow-hidden border-b border-border/60 bg-surface/40 py-20">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-30 lg:block" />
        <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-accent/70">CURATED PORTFOLIO</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl text-white sm:text-5xl">
            Reserve Access to India's Finest Residences
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65">
            Each listing is handpicked for architectural merit, location prominence, and bespoke lifestyle privileges. Our curation spans sky penthouses, landscaped villas, and limited-edition duplexes across premier metros.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent/70">EXCLUSIVE LISTINGS</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Featured Residences</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-white/60">
            Explore our portfolio of limited-availability homes. Reach out to our concierge team to request tailored recommendations or private viewings.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Properties;