import { Link } from "react-router-dom";
import { Building2, Award, Users } from "lucide-react";
import PropertiesMap from "../components/PropertiesMap";
import ScrollReveal from "../components/ScrollReveal";
import { useRef, useEffect } from "react";

const Home = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateParallax = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const yPos = -(scrolled * 0.5);
        parallaxRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          ref={parallaxRef}
          className="parallax-bg absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000')",
            top: "-20%",
            height: "120%",
            backgroundPosition: "center center",
            backgroundSize: "cover"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/85 to-background z-10" />

        <div className="relative z-20 text-center px-6 max-w-5xl animate-fade-in">
          <div className="text-accent text-base font-semibold tracking-[0.3em] mb-6 animation-delay-100 font-monument">BAHRAIN'S FINEST</div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl mb-8 text-foreground leading-tight animation-delay-200">
            Luxury Redefined
          </h1>
          <p className="text-xl md:text-2xl text-foreground/60 mb-12 max-w-3xl mx-auto font-light leading-relaxed animation-delay-300">
            Discover exceptional properties that embody sophistication, elegance, and timeless design
          </p>

          <div className="flex gap-6 justify-center flex-wrap animation-delay-400">
            <Link
              to="/properties"
              className="px-10 py-4 bg-accent text-background text-sm tracking-[0.2em] hover:bg-accent/90 transition-all btn-primary hover-glow"
              aria-label="Explore our properties"
            >
              EXPLORE PROPERTIES
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 border border-accent text-accent text-sm tracking-[0.2em] hover:bg-accent hover:text-background transition-all"
              aria-label="Schedule a property viewing"
            >
              SCHEDULE VIEWING
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <ScrollReveal animation="fade-in-up" delay={100}>
              <div className="text-center">
                <Building2 className="w-10 h-10 text-accent mx-auto mb-6" strokeWidth={1} aria-hidden="true" />
                <div className="text-5xl mb-3 text-accent">50+</div>
                <div className="text-sm tracking-[0.2em] text-foreground/60 font-monument">EXCLUSIVE PROPERTIES</div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={200}>
              <div className="text-center">
                <Award className="w-10 h-10 text-accent mx-auto mb-6" strokeWidth={1} aria-hidden="true" />
                <div className="text-5xl mb-3 text-accent">15+</div>
                <div className="text-sm tracking-[0.2em] text-foreground/60 font-monument">YEARS EXCELLENCE</div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-in-up" delay={300}>
              <div className="text-center">
                <Users className="w-10 h-10 text-accent mx-auto mb-6" strokeWidth={1} aria-hidden="true" />
                <div className="text-5xl mb-3 text-accent">500+</div>
                <div className="text-sm tracking-[0.2em] text-foreground/60 font-monument">SATISFIED CLIENTS</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Properties Map Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollReveal animation="fade-in-up">
            <PropertiesMap />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-border/50">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <ScrollReveal animation="scale-in">
            <div className="max-w-3xl mx-auto">
              <div className="text-accent text-base font-semibold tracking-[0.3em] mb-6 font-monument">BEGIN YOUR JOURNEY</div>
              <h2 className="text-5xl md:text-6xl mb-8">Experience Luxury Living</h2>
              <p className="text-xl text-foreground/60 mb-12 font-light leading-relaxed">
                Let us guide you to your perfect property in Bahrain's most prestigious locations
              </p>
              <Link
                to="/contact"
                className="inline-block px-12 py-4 border border-accent text-accent text-sm tracking-[0.2em] hover:bg-accent hover:text-background transition-all btn-primary"
                aria-label="Contact us to get started"
              >
                CONTACT US
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
