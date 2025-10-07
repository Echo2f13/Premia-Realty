import { Award, Building, TrendingUp, Users } from "lucide-react";

const stats = [
  { icon: Building, value: "500+", label: "Premium Properties" },
  { icon: Users, value: "2,000+", label: "Happy Clients" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: TrendingUp, value: "$2B+", label: "Properties Sold" },
];

const About = () => {
  return (
    <div className="bg-background text-platinum-pearl">
      <section className="relative isolate overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/assets/hero-skyline-B9OuM1TT.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-luxury-black/75 to-luxury-black/60" />
          <div className="absolute -left-1/5 -top-1/6 h-[520px] w-[520px] rounded-full bg-gold-primary/15 blur-[180px]" />
        </div>
        <div className="relative container px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <span className="text-sm font-medium uppercase tracking-[0.45em] text-gold-primary/80">Our Legacy</span>
            <h1 className="mt-6 text-4xl font-serif md:text-5xl">Crafting residences that define modern luxury</h1>
            <p className="mt-6 text-base leading-relaxed text-platinum-pearl/70">
              For over two decades, Premia Realty has shaped city skylines with limited-edition residences. We orchestrate architecture, hospitality, technology, and artistry into tactile environments for discerning collectors.
            </p>
          </div>
        </div>
      </section>

      <section className="container space-y-20 px-4 pb-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr]">
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <div className="glass-card p-12">
              <h2 className="text-3xl font-serif font-bold">Our Story</h2>
              <p className="mt-4 text-sm leading-relaxed text-platinum-pearl/70">
                Founded with a vision to transform the luxury real estate landscape, Premia Realty has become synonymous with excellence, trust, and sophistication. Our journey began with a belief that every client deserves an extraordinary experience when finding their dream property.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-platinum-pearl/70">
                Today we stand as a beacon of premium service, offering an exclusive portfolio of the finest properties and delivering personalised solutions that exceed expectations.
              </p>
            </div>
            <div className="glass-card p-10">
              <h2 className="text-3xl font-serif font-bold">Our Philosophy</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="text-lg font-serif text-gold-primary">Excellence</h3>
                  <p className="mt-2 text-sm text-platinum-pearl/70">
                    We maintain the highest standards in every aspect of our service, from property selection to client care.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-gold-primary">Integrity</h3>
                  <p className="mt-2 text-sm text-platinum-pearl/70">
                    Transparency and honesty form the foundation of our relationships with clients and partners.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-gold-primary">Innovation</h3>
                  <p className="mt-2 text-sm text-platinum-pearl/70">
                    We embrace cutting-edge technology and creative solutions to deliver exceptional results.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="glass-card p-8">
              <h2 className="text-2xl font-serif font-bold">Our Experience</h2>
              <p className="mt-4 text-sm leading-relaxed text-platinum-pearl/70">
                Dedicated lifestyle concierges orchestrate everything from private aviation and restorative wellness to invite-only cultural showcases. Residents enjoy integrated smart technologies, handcrafted interiors, and sustainability benchmarks.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {stats.map((item) => (
                <div key={item.label} className="glass-card flex flex-col items-center gap-3 px-6 py-8 text-center">
                  <item.icon className="h-8 w-8 text-gold-primary" />
                  <p className="text-3xl font-bold text-gold-primary">{item.value}</p>
                  <p className="text-sm text-platinum-pearl/70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card grid gap-10 p-12 lg:grid-cols-[1fr,0.9fr]">
          <div className="space-y-6">
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-gold-primary/80">Founder's Letter</span>
            <h2 className="text-3xl font-serif">A conversation with our principal visionary</h2>
            <p className="text-sm leading-relaxed text-platinum-pearl/70">
              "Our residences are curated not only as homes but as legacies. We craft spaces where art, technology, wellness, and personal heritage converge. Each Premia project is an orchestration of discreet luxury, from the arrival ritual to the final reveal." - Aanya Prem, Principal Curator
            </p>
            <span className="inline-flex w-fit items-center gap-3 rounded-full border border-gold-primary/20 px-5 py-2 text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
              In conversation with Architectural Digest India
            </span>
          </div>
          <div className="space-y-6 rounded-[1.75rem] border border-gold-primary/20 bg-luxury-black/50 p-10 text-sm leading-relaxed text-platinum-pearl/70">
            <p>
              Premia residences span across Mumbai, NCR, Goa, Hyderabad, and Bengaluru with forthcoming developments in Pune and Dubai. Each enclave includes private lounges, wellness sanctuaries, and curated community programming limited to membership circles.
            </p>
            <div className="grid gap-4 text-xs uppercase tracking-[0.4em] text-platinum-pearl/55 sm:grid-cols-2">
              <div className="rounded-3xl border border-gold-primary/20 bg-luxury-black/40 px-5 py-4">Skyline Royale, Mumbai</div>
              <div className="rounded-3xl border border-gold-primary/20 bg-luxury-black/40 px-5 py-4">Elysian Garden, Gurgaon</div>
              <div className="rounded-3xl border border-gold-primary/20 bg-luxury-black/40 px-5 py-4">Azure Harbour, Goa</div>
              <div className="rounded-3xl border border-gold-primary/20 bg-luxury-black/40 px-5 py-4">Meridian Residences, Hyderabad</div>
            </div>
            <div className="rounded-3xl border border-gold-primary/20 bg-luxury-black/40 px-5 py-4 text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
              Sustainability benchmarks - LEED Platinum | Smart Grid Energy | Zero-waste materiality
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
