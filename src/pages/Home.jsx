import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import PropertiesMap from "../components/PropertiesMap";
import ScrollReveal from "../components/ScrollReveal";
import LazyImage from "../components/LazyImage";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const { t, language } = useLanguage();
  const [priorityProperties, setPriorityProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Fetch priority properties
  useEffect(() => {
    const fetchPriorityProperties = async () => {
      try {
        setLoadingProperties(true);
        const propertiesRef = collection(db, "properties");
        const q = query(
          propertiesRef,
          where("priority", "==", 1),
          where("deletedAt", "==", null)
        );
        const snapshot = await getDocs(q);
        const properties = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPriorityProperties(properties.slice(0, 6)); // Show max 6 properties
      } catch (error) {
        console.error("Error fetching priority properties:", error);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchPriorityProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.jpg"
            alt="Luxury real estate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>

        {/* Floating Property Cards - Decorative */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {/* Top Right Card */}
          <div className="absolute top-[15%] right-[8%] w-[280px] opacity-20 transform hover:opacity-30 transition-all duration-700 animate-float-slow">
            <div className="bg-card border border-accent/30 backdrop-blur-sm p-4">
              <div className="h-32 bg-gradient-to-br from-accent/20 to-transparent mb-3" />
              <div className="h-3 w-3/4 bg-accent/30 mb-2" />
              <div className="h-2 w-1/2 bg-accent/20" />
            </div>
          </div>

          {/* Left Side Card */}
          <div className="absolute top-[35%] left-[5%] w-[260px] opacity-15 transform hover:opacity-25 transition-all duration-700 animate-float-slower">
            <div className="bg-card border border-accent/30 backdrop-blur-sm p-4">
              <div className="h-28 bg-gradient-to-br from-accent/20 to-transparent mb-3" />
              <div className="h-3 w-2/3 bg-accent/30 mb-2" />
              <div className="h-2 w-1/3 bg-accent/20" />
            </div>
          </div>

          {/* Bottom Right Small Card */}
          <div className="absolute bottom-[20%] right-[15%] w-[240px] opacity-10 transform hover:opacity-20 transition-all duration-700 animate-float">
            <div className="bg-card border border-accent/30 backdrop-blur-sm p-3">
              <div className="h-24 bg-gradient-to-br from-accent/20 to-transparent mb-2" />
              <div className="h-2 w-3/4 bg-accent/30 mb-2" />
              <div className="h-2 w-1/2 bg-accent/20" />
            </div>
          </div>

          {/* Top Left Accent Shape */}
          <div className="absolute top-[25%] left-[12%] w-32 h-32 border border-accent/20 rotate-45 animate-spin-very-slow opacity-10" />

          {/* Bottom Left Accent Circle */}
          <div className="absolute bottom-[25%] left-[8%] w-24 h-24 border border-accent/20 rounded-full animate-pulse-slow opacity-10" />
        </div>

        {/* Main Content */}
        <div className="relative z-20 text-center px-6 max-w-6xl">
          {/* Subtitle with animated underline */}
          <div className="inline-block mb-8 animate-fade-in">
            <div className="text-accent text-sm md:text-base font-semibold tracking-[0.3em] mb-3 animation-delay-100">
              {t(translations.home.hero.subtitle)}
            </div>
            <div className="h-[1px] w-0 bg-accent mx-auto animate-expand-width" />
          </div>

          {/* Main Heading with Staggered Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 text-foreground leading-[1.1] font-light animation-delay-200 animate-fade-in-up">
            <span className="inline-block animation-delay-200 animate-fade-in-up">
              {t(translations.home.hero.title).split(' ')[0]}
            </span>{' '}
            <span className="inline-block animation-delay-300 animate-fade-in-up text-accent font-normal">
              {t(translations.home.hero.title).split(' ').slice(1).join(' ')}
            </span>
          </h1>

          {/* Description with subtle animation */}
          <p className="text-lg md:text-xl lg:text-2xl text-foreground/70 mb-14 max-w-3xl mx-auto font-light leading-relaxed animation-delay-400 animate-fade-in">
            {t(translations.home.hero.description)}
          </p>

          {/* CTA Buttons with Enhanced Styling */}
          <div className="flex gap-6 justify-center flex-wrap animation-delay-500 animate-fade-in-up">
            <Link
              to="/properties"
              className="group relative px-12 py-5 bg-accent text-background text-sm tracking-[0.2em] overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105"
              aria-label="Explore our properties"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-[#F4E5C2] to-accent bg-[length:200%_100%] animate-shimmer" />
              <div className="absolute inset-0 bg-accent" />
              <span className="relative z-10">{t(translations.home.hero.exploreButton)}</span>
            </Link>
            <Link
              to="/contact"
              className="relative px-12 py-5 border-2 border-accent text-accent text-sm tracking-[0.2em] transition-all duration-300 hover:bg-accent hover:text-background group overflow-hidden"
              aria-label="Schedule a property viewing"
            >
              <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <span className="relative z-10">{t(translations.home.hero.learnMore)}</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-[25] animation-delay-600 animate-fade-in">
          <div className="flex flex-col items-center gap-2 text-accent/60 animate-bounce-slow">
            <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Bottom Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[15]" />
      </section>

      {/* Featured Properties Map Section */}
      <ScrollReveal animation="fade-in-up">
        <PropertiesMap />
      </ScrollReveal>

      {/* Priority Properties Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6 lg:px-12">
          <ScrollReveal animation="fade-in-up">
            <div className="text-center mb-16">
              <div className="text-accent text-xs tracking-[0.3em] mb-4">{t(translations.home.priorityProperties.subtitle)}</div>
              <h2 className="text-4xl md:text-5xl mb-4">{t(translations.home.priorityProperties.title)}</h2>
              <p className="text-foreground/60 text-lg font-light max-w-2xl mx-auto">
                {t(translations.home.priorityProperties.description)}
              </p>
            </div>
          </ScrollReveal>

          {loadingProperties ? (
            <div className="text-center py-12 text-foreground/70">
              {t(translations.home.priorityProperties.loading)}
            </div>
          ) : priorityProperties.length === 0 ? (
            <div className="text-center py-12 text-foreground/70">
              {t(translations.home.priorityProperties.noProperties)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {priorityProperties.map((property, index) => (
                <ScrollReveal key={property.id} animation="fade-in-up" delay={index * 100}>
                  <Link to={`/properties/${property.id}`} className="group block">
                    <div className="bg-card border border-border/50 rounded-lg overflow-hidden hover-glow transition-all h-full">
                      <div className="relative h-64 overflow-hidden">
                        <LazyImage
                          src={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-60" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl mb-2 text-foreground group-hover:text-accent transition-colors line-clamp-1">
                          {language === 'ar' && property.titleAr ? property.titleAr : property.title}
                        </h3>
                        <div className="flex items-center text-sm text-foreground/60 mb-4">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="line-clamp-1">
                            {typeof property.location === 'object'
                              ? `${property.location.area}, ${property.location.governorate}`
                              : property.location}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border/30">
                          <div>
                            <div className="text-xs text-foreground/60 mb-1">
                              {property.intent === 'rent' ? 'Monthly Rent' : 'Price'}
                            </div>
                            <div className="text-lg text-accent font-semibold">
                              {property.price ? `${property.price} BHD` : t(translations.properties.contactForPrice)}
                            </div>
                          </div>
                          <div className="text-sm text-accent">
                            {t(translations.home.priorityProperties.viewDetails)} →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          {priorityProperties.length > 0 && (
            <ScrollReveal animation="fade-in-up" delay={400}>
              <div className="text-center mt-12">
                <Link
                  to="/properties"
                  className="inline-block px-8 py-3 border border-accent text-accent text-sm tracking-[0.2em] hover:bg-accent hover:text-background transition-all"
                >
                  {t(translations.home.priorityProperties.viewAll)}
                </Link>
              </div>
            </ScrollReveal>
          )}
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
