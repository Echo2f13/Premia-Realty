import { Building2, Users, Award } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import LazyImage from "../components/LazyImage";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle">
      <div className="pt-24">
        {/* Header */}
        <section className="py-20 border-b border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="text-accent text-base font-semibold tracking-[0.3em] mb-4 font-monument">OUR LEGACY</div>
              <h1 className="text-6xl md:text-7xl mb-6">About Premia</h1>
              <p className="text-xl text-foreground/60 font-light leading-relaxed">
                For over a decade, we have redefined luxury real estate in Bahrain
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-accent text-xs tracking-[0.3em] mb-6 font-monument">ESTABLISHED EXCELLENCE</div>
                <h2 className="text-4xl mb-8">Our Story</h2>
                <p className="text-foreground/60 text-lg mb-6 font-light leading-relaxed">
                  Founded with a vision to transform the luxury real estate landscape, Premia Realty has become synonymous with excellence, trust, and sophistication.
                </p>
                <p className="text-foreground/60 text-lg font-light leading-relaxed">
                  Our journey began with a belief that every client deserves an extraordinary experience when finding their dream property. Today, we stand as a beacon of premium service, offering an exclusive portfolio of the finest properties.
                </p>
              </div>
              <div className="relative h-[500px] hover-zoom-image">
                <LazyImage
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000"
                  alt="Luxury property exterior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-40" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats */}
        <section className="py-24 border-y border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-3 gap-16">
              <ScrollReveal animation="fade-in-up" delay={100}>
                <div className="text-center">
                  <Building2 className="w-12 h-12 text-accent mx-auto mb-6" strokeWidth={1} aria-hidden="true" />
                  <div className="text-5xl mb-3 text-accent">500+</div>
                  <div className="text-sm tracking-[0.2em] text-foreground/60">PREMIUM PROPERTIES</div>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={200}>
                <div className="text-center">
                  <Users className="w-12 h-12 text-accent mx-auto mb-6" strokeWidth={1} aria-hidden="true" />
                  <div className="text-5xl mb-3 text-accent">2,000+</div>
                  <div className="text-sm tracking-[0.2em] text-foreground/60">HAPPY CLIENTS</div>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={300}>
                <div className="text-center">
                  <Award className="w-12 h-12 text-accent mx-auto mb-6" strokeWidth={1} aria-hidden="true" />
                  <div className="text-5xl mb-3 text-accent">15+</div>
                  <div className="text-sm tracking-[0.2em] text-foreground/60">YEARS EXPERIENCE</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <ScrollReveal animation="fade-in">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="text-accent text-xs tracking-[0.3em] mb-4">OUR VALUES</div>
                <h2 className="text-5xl mb-6">Our Philosophy</h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-12">
              <ScrollReveal animation="fade-in-up" delay={100}>
                <div className="text-center">
                  <h3 className="text-2xl text-accent mb-4">Excellence</h3>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    We maintain the highest standards in every aspect of our service, from property selection to client care
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-in-up" delay={200}>
                <div className="text-center">
                  <h3 className="text-2xl text-accent mb-4">Integrity</h3>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    Transparency and honesty form the foundation of our relationships with clients and partners
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-in-up" delay={300}>
                <div className="text-center">
                  <h3 className="text-2xl text-accent mb-4">Innovation</h3>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    We embrace cutting-edge technology and creative solutions to deliver exceptional results
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
