import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import PropertiesMap from "../components/PropertiesMap";
import ScrollReveal from "../components/ScrollReveal";
import GradientOrb from "../components/GradientOrb";
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
        {/* Gradient Orb Background */}
        <div className="absolute inset-0 z-0">
          <GradientOrb
            size={600}
            colors={['#000000', '#1a1a1a', '#D4AF37', '#F4E5C2']}
            rotationSpeed={0.0005}
            mouseInfluence={0.1}
            blur={80}
          />
        </div>

        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50 z-10" />

        <div className="relative z-20 text-center px-6 max-w-5xl animate-fade-in">
          <div className="text-accent text-base font-semibold tracking-[0.3em] mb-6 animation-delay-100">{t(translations.home.hero.subtitle)}</div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl mb-8 text-foreground leading-tight animation-delay-200">
            {t(translations.home.hero.title)}
          </h1>
          <p className="text-xl md:text-2xl text-foreground/60 mb-12 max-w-3xl mx-auto font-light leading-relaxed animation-delay-300">
            {t(translations.home.hero.description)}
          </p>

          <div className="flex gap-6 justify-center flex-wrap animation-delay-400">
            <Link
              to="/properties"
              className="px-10 py-4 bg-accent text-background text-sm tracking-[0.2em] hover:bg-accent/90 transition-all btn-primary hover-glow"
              aria-label="Explore our properties"
            >
              {t(translations.home.hero.exploreButton)}
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 border border-accent text-accent text-sm tracking-[0.2em] hover:bg-accent hover:text-background transition-all"
              aria-label="Schedule a property viewing"
            >
              {t(translations.home.hero.learnMore)}
            </Link>
          </div>
        </div>
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
