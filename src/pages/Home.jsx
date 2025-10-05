import HeroSection from "../components/HeroSection";
import PropertyCard from "../components/PropertyCard";
import properties from "../data/properties.json";

const Home = () => {
  const featured = properties[0];

  return (
    <div className="space-y-24 pb-24">
      <HeroSection
        eyebrow="CURATED RESIDENCES"
        title="A Gold Standard in Luxury Living"
        subtitle="Experience a curated selection of signature residences that blend contemporary architecture with timeless sophistication. Crafted for discerning individuals seeking exclusivity beyond compare."
        ctaPrimary={{ label: "Schedule A Private Tour", href: "#featured-residence" }}
        ctaSecondary={{ label: "Discover Our Story", href: "/about" }}
        backgroundImage="https://images.unsplash.com/photo-1512914890250-352c5ee5e774?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 rounded-[2.75rem] border border-border/50 bg-surface/60 p-10 sm:grid-cols-3">
          {[{
            title: "Legacy of Excellence",
            copy:
              "Over 20 years of sculpting landmark residences across India's most coveted neighborhoods.",
          },
          {
            title: "Private Membership",
            copy:
              "Access curated lifestyle services, from Michelin-star dining privileges to bespoke concierge.",
          },
          {
            title: "Tailored Services",
            copy:
              "Resident experiences personalised by dedicated lifestyle curators and valet teams.",
          }].map((item) => (
            <div key={item.title} className="space-y-4 border-white/5 sm:border-l sm:pl-8 first:pl-0 first:sm:border-l-0">
              <span className="inline-block text-xs uppercase tracking-[0.35em] text-accent/70">
                PREMIER ADVANTAGE
              </span>
              <h2 className="font-display text-2xl text-white">{item.title}</h2>
              <p className="text-sm leading-relaxed text-white/65">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="featured-residence" className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent/70">SIGNATURE SHOWCASE</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
              Featured Private Residence
            </h2>
          </div>
          <a
            href="/properties"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-accent hover:text-accent"
          >
            View Complete Portfolio
          </a>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr,380px]">
          <PropertyCard property={featured} />
          <div className="space-y-8 rounded-[2.5rem] border border-border/40 bg-background/60 p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-accent/70">ELEVATED LIVING</p>
              <p className="mt-3 text-sm leading-loose text-white/60">
                Private terraces wrap around the skyline-level residence, framed by triple-height glass and bespoke Italian marble finishes. A sky lounge, infinity-edge plunge pool, and sommelier-curated cellar complete the experience.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { metric: "11,000", label: "Square Feet" },
                { metric: "06", label: "Signature Suites" },
                { metric: "04", label: "Private Lounges" },
                { metric: "24/7", label: "Lifestyle Concierge" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-border/30 bg-background/40 px-5 py-6 text-center">
                  <p className="font-display text-3xl text-accent">{item.metric}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/50">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;