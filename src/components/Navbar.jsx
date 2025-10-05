import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        isScrolled
          ? "bg-background/85 shadow-lg shadow-black/10 backdrop-blur"
          : "bg-gradient-to-b from-background/95 to-background/40"
      }`}
    >
      <nav className="mx-auto flex max-w-content items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/60">
            <span className="text-2xl font-semibold text-accent">PG</span>
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-white sm:text-xl">
              Premia Goldclass
            </p>
            <p className="text-xs tracking-[0.35em] text-white/50 sm:text-[0.7rem]">
              ESTATE COLLECTION
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative text-sm font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${
                    isActive ? "text-accent" : "text-white/70 hover:text-accent"
                  }`
                }
              >
                {item.label}
                <span className="pointer-events-none absolute inset-x-0 -bottom-2 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
              </NavLink>
            ))}
          </div>
          <Link
            to="/properties"
            className="rounded-full bg-accent px-6 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-background shadow-glow transition hover:brightness-110"
          >
            View Residences
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-white/80 transition hover:text-accent lg:hidden"
          aria-label="Toggle navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-border bg-background/95 px-4 pb-6 pt-4 shadow-lg shadow-black/20 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-content flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium uppercase tracking-[0.3em] transition-colors ${
                    isActive ? "text-accent" : "text-white/70 hover:text-accent"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/properties"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-6 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-background shadow-glow"
            >
              View Residences
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;