import { Target, Users, Award, TrendingUp } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import LazyImage from "../components/LazyImage";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle">
      <div className="pt-24">
        {/* Hero Header */}
        <section className="py-16 border-b border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="text-accent text-xs uppercase tracking-[0.3em] mb-3">
                {t(translations.about.subtitle)}
              </div>
              <h1 className="text-5xl md:text-6xl mb-5 leading-tight">
                {t(translations.about.title)}
              </h1>
              <p className="text-lg text-foreground/70 font-light leading-relaxed">
                {t(translations.about.intro.description)}
              </p>
            </div>
          </div>
        </section>

        {/* Our Story - Condensed */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-5 gap-12 items-center">
              {/* Image - Takes 2 columns */}
              <div className="md:col-span-2 relative h-[400px] rounded-lg overflow-hidden hover-zoom-image">
                <LazyImage
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000"
                  alt="Luxury property exterior"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-40" />
              </div>

              {/* Content - Takes 3 columns */}
              <div className="md:col-span-3">
                <div className="text-accent text-xs uppercase tracking-[0.3em] mb-4">
                  {t(translations.about.subtitle)}
                </div>
                <h2 className="text-3xl md:text-4xl mb-5 leading-tight">
                  {t(translations.about.story.title)}
                </h2>
                <div className="text-foreground/70 text-base font-light leading-relaxed space-y-4">
                  <p>
                    Premia Realty was established in 2025 with a singular purpose: to make premium home leasing accessible, seamless, and client-focused. Founded by Mr. Viji Varghese, we address the market's need for truly personalized and transparent leasing service.
                  </p>
                  <p>
                    Built on trust, transparency, and a client-first philosophy, we carefully vet each property for quality, location, and livability—ensuring our clients see only the best options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission - Compact */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-6 lg:px-12">
            <ScrollReveal animation="fade-in">
              <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-5">
                  <Target className="w-7 h-7 text-accent" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h2 className="text-3xl md:text-4xl mb-4 leading-tight">
                  {t(translations.about.mission.title)}
                </h2>
                <p className="text-foreground/70 text-base font-light leading-relaxed">
                  {t(translations.about.mission.description)}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Leadership - Refined */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-3">{t(translations.about.team.title)}</h2>
            </div>
            <ScrollReveal animation="fade-in-up">
              <div className="max-w-3xl mx-auto">
                <div className="bg-card border border-border/50 rounded-lg p-8 md:p-10 hover-glow transition-all">
                  <div className="text-center mb-6 pb-6 border-b border-border/30">
                    <h3 className="text-2xl mb-2 text-accent font-semibold">
                      {t(translations.about.team.founder.name)}
                    </h3>
                    <p className="text-foreground/60 text-sm font-light tracking-wide uppercase">
                      {t(translations.about.team.founder.title)}
                    </p>
                  </div>
                  <div className="text-foreground/70 text-base font-light leading-relaxed space-y-4">
                    <p>
                      With extensive experience in customer relations and business management, Mr. Viji Varghese brings a client-centric approach to Premia Realty. His vision: create a leasing service that respects the client's time, needs, and aspirations.
                    </p>
                    <p>
                      Under his leadership, Premia Realty has set new benchmarks for quality and service—building a company that values relationships over transactions.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Milestones - Cleaner Grid */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-3">{t(translations.about.milestones.title)}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <ScrollReveal animation="fade-in-up" delay={100}>
                <div className="bg-background border border-border/50 rounded-lg p-6 hover-glow transition-all text-center h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                    <Award className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="text-accent text-lg font-semibold mb-2">
                    {t(translations.about.milestones.year2025.title)}
                  </div>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {t(translations.about.milestones.year2025.description)}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={200}>
                <div className="bg-background border border-border/50 rounded-lg p-6 hover-glow transition-all text-center h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                    <TrendingUp className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="text-accent text-lg font-semibold mb-2">
                    {t(translations.about.milestones.launch.title)}
                  </div>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {t(translations.about.milestones.launch.description)}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={300}>
                <div className="bg-background border border-border/50 rounded-lg p-6 hover-glow transition-all text-center h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                    <Users className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="text-accent text-lg font-semibold mb-2">
                    {t(translations.about.milestones.expansion.title)}
                  </div>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {t(translations.about.milestones.expansion.description)}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* What Makes Us Different - Optimized 2x2 Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-3">{t(translations.about.difference.title)}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <ScrollReveal animation="fade-in-up" delay={100}>
                <div className="bg-card border border-border/50 rounded-lg p-6 hover-glow transition-all h-full">
                  <h3 className="text-lg mb-3 text-accent font-semibold">
                    {t(translations.about.difference.reason1.title)}
                  </h3>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {t(translations.about.difference.reason1.description)}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={200}>
                <div className="bg-card border border-border/50 rounded-lg p-6 hover-glow transition-all h-full">
                  <h3 className="text-lg mb-3 text-accent font-semibold">
                    {t(translations.about.difference.reason2.title)}
                  </h3>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {t(translations.about.difference.reason2.description)}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={300}>
                <div className="bg-card border border-border/50 rounded-lg p-6 hover-glow transition-all h-full">
                  <h3 className="text-lg mb-3 text-accent font-semibold">
                    {t(translations.about.difference.reason3.title)}
                  </h3>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {t(translations.about.difference.reason3.description)}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-in-up" delay={400}>
                <div className="bg-card border border-border/50 rounded-lg p-6 hover-glow transition-all h-full">
                  <h3 className="text-lg mb-3 text-accent font-semibold">
                    {t(translations.about.difference.reason4.title)}
                  </h3>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {t(translations.about.difference.reason4.description)}
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
