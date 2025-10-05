const About = () => {
  return (
    <div className="space-y-20 pb-24">
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/40" />
        <div className="relative mx-auto max-w-content px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="text-xs uppercase tracking-[0.35em] text-accent/70">OUR LEGACY</p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl text-white sm:text-5xl">
            Crafting Residences That Define Modern Luxury in India
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
            Premia Goldclass Estate represents a legacy of visionary developments, meticulous craftsmanship, and personalised hospitality. Our portfolio spans 40+ landmark projects, each distinguished by design sophistication, privileged locations, and curated lifestyle services tailored to each resident.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr]">
          <div className="space-y-8">
            <div className="rounded-[2.5rem] border border-border/40 bg-surface/60 p-10">
              <h2 className="font-display text-3xl text-white">Our Vision</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                To establish an ensemble of residences that go beyond physical spaces—offering immersive lifestyle ecosystems where privacy, wellness, and refinement harmoniously coexist.
              </p>
            </div>
            <div className="rounded-[2.5rem] border border-border/40 bg-background/70 p-10">
              <h2 className="font-display text-3xl text-white">Our Mission</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                We curate intimate communities with intuitive services, exceptional architecture, and bespoke amenities that anticipate a resident's every desire—delivering modern Indian luxury with global standards.
              </p>
            </div>
          </div>

          <div className="flex h-full flex-col justify-between gap-6">
            <div className="rounded-[2.5rem] border border-border/40 bg-background/70 p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-accent/70">THE EXPERIENCE</p>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                Dedicated lifestyle concierges orchestrate everything from private aviation, wellness rituals, to invite-only cultural showcases. Residents enjoy integrated smart home technologies, handcrafted interiors, and world-class sustainability benchmarks.
              </p>
            </div>
            <div className="rounded-[2.5rem] border border-border/40 bg-surface/60 p-8">
              <ul className="space-y-4 text-sm text-white/65">
                {[
                  "40+ iconic developments across tier-1 cities",
                  "In-house design atelier collaborating with global architects",
                  "Partnerships with Michelin star chefs & hospitality curators",
                  "Sustainability-first builds with LEED Platinum benchmarks",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;