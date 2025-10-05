const HeroSection = ({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
}) => {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="relative mx-auto flex max-w-content flex-col gap-10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base text-white/70 sm:text-lg">
          {subtitle}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={ctaPrimary.href}
            className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-background shadow-glow transition hover:brightness-110"
          >
            {ctaPrimary.label}
          </a>
          <a
            href={ctaSecondary.href}
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-accent hover:text-accent"
          >
            {ctaSecondary.label}
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;