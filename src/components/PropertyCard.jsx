const PropertyCard = ({ property }) => {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border/40 bg-surface/70 p-1 transition duration-500 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative overflow-hidden rounded-3xl">
        <img
          src={property.image}
          alt={property.title}
          className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            {property.location}
          </p>
          <h3 className="mt-2 font-display text-2xl text-white">
            {property.title}
          </h3>
          <p className="mt-3 text-sm text-white/65">
            {property.description}
          </p>
          <div className="mt-5 flex items-center justify-between text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              {property.status}
            </p>
            <p className="text-lg font-semibold text-accent">
              {property.price}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;