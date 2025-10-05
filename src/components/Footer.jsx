import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface/70 text-white/70">
      <div className="mx-auto flex max-w-content flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8 lg:flex-row lg:justify-between">
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80">
              <span className="text-2xl font-semibold text-accent">PG</span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-white">
                Premia Goldclass Estate
              </p>
              <p className="text-xs tracking-[0.35em] text-white/50">
                CURATED RESIDENCES
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/60">
            Elevated living crafted for connoisseurs of refined experiences. Discover signature residences, bespoke services, and exclusivity beyond compare.
          </p>
        </div>

        <div className="grid w-full gap-8 text-sm sm:grid-cols-2 lg:w-auto">
          <div className="space-y-3">
            <p className="font-semibold uppercase tracking-[0.3em] text-white">Explore</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" },
                { label: "Properties", to: "/properties" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="transition hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-semibold uppercase tracking-[0.3em] text-white">Connect</p>
            <div className="flex flex-col gap-2">
              <a href="tel:+91-9876543210" className="transition hover:text-accent">
                +91 98765 43210
              </a>
              <a href="mailto:concierge@premiagoldclass.com" className="transition hover:text-accent">
                concierge@premiagoldclass.com
              </a>
              <p className="text-white/50">9th Avenue, Sector 62, Gurgaon</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-6">
        <p className="text-center text-xs uppercase tracking-[0.4em] text-white/35">
          © {new Date().getFullYear()} Premia Goldclass Estate. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;