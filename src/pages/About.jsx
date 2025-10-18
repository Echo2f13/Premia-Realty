import { Building2, Users, Award } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import LazyImage from "../components/LazyImage";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle">
      <div className="pt-24">
        {/* Header */}
        <section className="py-20 border-b border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="text-accent text-base font-semibold tracking-[0.3em] mb-4">{t(translations.about.subtitle)}</div>
              <h1 className="text-6xl md:text-7xl mb-6">{t(translations.about.title)}</h1>
              <p className="text-xl text-foreground/60 font-light leading-relaxed">
                {t(translations.about.section1.description)}
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-accent text-xs tracking-[0.3em] mb-6">{t(translations.about.subtitle)}</div>
                <h2 className="text-4xl mb-8">{t(translations.about.section1.title)}</h2>
                <p className="text-foreground/60 text-lg mb-6 font-light leading-relaxed">
                  {t(translations.about.section1.description)}
                </p>
                <p className="text-foreground/60 text-lg font-light leading-relaxed">
                  {t(translations.about.section2.description)}
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
                  <div className="text-sm tracking-[0.2em] text-foreground/60">{t(translations.about.section3.reason2.title)}</div>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={200}>
                <div className="text-center">
                  <Users className="w-12 h-12 text-accent mx-auto mb-6" strokeWidth={1} aria-hidden="true" />
                  <div className="text-5xl mb-3 text-accent">2,000+</div>
                  <div className="text-sm tracking-[0.2em] text-foreground/60">{t(translations.about.section3.reason3.title)}</div>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={300}>
                <div className="text-center">
                  <Award className="w-12 h-12 text-accent mx-auto mb-6" strokeWidth={1} aria-hidden="true" />
                  <div className="text-5xl mb-3 text-accent">15+</div>
                  <div className="text-sm tracking-[0.2em] text-foreground/60">{t(translations.about.section3.reason1.title)}</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <ScrollReveal animation="fade-in">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl mb-8">{t(translations.about.section2.title)}</h2>
                <p className="text-foreground/60 text-lg font-light leading-relaxed">
                  {t(translations.about.section2.description)}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-card/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl mb-6">{t(translations.about.section3.title)}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <ScrollReveal animation="fade-in-up" delay={100}>
                <div className="bg-background border border-border/50 p-8 hover-glow transition-all">
                  <h3 className="text-xl mb-4 text-accent">{t(translations.about.section3.reason1.title)}</h3>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    {t(translations.about.section3.reason1.description)}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={200}>
                <div className="bg-background border border-border/50 p-8 hover-glow transition-all">
                  <h3 className="text-xl mb-4 text-accent">{t(translations.about.section3.reason2.title)}</h3>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    {t(translations.about.section3.reason2.description)}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={300}>
                <div className="bg-background border border-border/50 p-8 hover-glow transition-all">
                  <h3 className="text-xl mb-4 text-accent">{t(translations.about.section3.reason3.title)}</h3>
                  <p className="text-foreground/60 font-light leading-relaxed">
                    {t(translations.about.section3.reason3.description)}
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
