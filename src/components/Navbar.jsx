import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Building, Menu, User, X } from "lucide-react";
import useAuth from "../hooks/useAuth";

const links = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navClass = scrolled
    ? "bg-luxury-black/85 backdrop-blur-2xl border-b border-gold-primary/20"
    : "bg-transparent";

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${navClass}`}>
      <div className="container flex h-20 items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-luxury-black shadow-gold">
            <Building className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <p className="text-xl font-serif text-gold-primary">Premia Realty</p>
            <p className="text-[0.65rem] uppercase tracking-[0.5em] text-platinum-pearl/70">Luxury Properties</p>
          </div>
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          <div className="flex items-center gap-8">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium uppercase tracking-[0.35em] transition-colors duration-300 ${
                    isActive ? "text-gold-primary" : "text-platinum-pearl/70 hover:text-gold-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/account"
                className="inline-flex items-center gap-2 rounded-full border border-gold-primary/40 bg-black/30 px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-gold-primary transition hover:border-gold-primary hover:text-gold-accent"
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold uppercase tracking-[0.4em] text-platinum-pearl/70 transition hover:text-gold-primary"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-gradient-gold px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/30 text-platinum-pearl transition hover:border-gold-primary hover:text-gold-primary lg:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="lg:hidden">
          <div className="border-t border-gold-primary/20 bg-luxury-black/95 px-4 pb-10 pt-6 shadow-luxury">
            <div className="flex flex-col gap-5">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-full border border-gold-primary/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.45em] transition ${
                      isActive
                        ? "bg-gradient-gold text-luxury-black"
                        : "text-platinum-pearl/70 hover:border-gold-primary hover:text-gold-primary"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="mt-2 flex flex-col gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-primary/40 bg-black/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.45em] text-gold-primary transition hover:border-gold-primary hover:text-gold-accent"
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-center text-xs font-semibold uppercase tracking-[0.45em] text-platinum-pearl/70 transition hover:text-gold-primary"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.45em] text-luxury-black shadow-gold transition hover:shadow-luxury"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
