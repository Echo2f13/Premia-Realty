import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Building2, Menu, User, X } from "lucide-react";
import useAuth from "../hooks/useAuth";

const links = [
  { label: "HOME", to: "/" },
  { label: "PROPERTIES", to: "/properties" },
  { label: "ABOUT", to: "/about" },
  { label: "CONTACT", to: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 border border-accent/30 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-accent" strokeWidth={1} />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl tracking-[0.2em] text-foreground">PREMIA</div>
              <div className="text-[10px] tracking-[0.3em] text-accent -mt-1">REALTY</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-base font-medium tracking-[0.15em] transition-colors ${
                    isActive ? "text-accent" : "text-foreground/70 hover:text-foreground"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-base font-medium tracking-[0.15em] transition-colors ${
                    isActive ? "text-accent" : "text-foreground/70 hover:text-foreground"
                  }`
                }
              >
                ADMIN
              </NavLink>
            )}

            <div className="w-px h-6 bg-border/50" />

            {isAuthenticated ? (
              <Link
                to="/account"
                className="inline-flex items-center gap-2 text-base font-medium tracking-[0.15em] text-foreground/70 hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                ACCOUNT
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-medium tracking-[0.15em] text-foreground/70 hover:text-foreground transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 border border-accent text-accent text-base font-medium tracking-[0.15em] hover:bg-accent hover:text-background transition-all"
                >
                  INQUIRE
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-12 w-12 items-center justify-center border border-accent/30 text-foreground transition hover:border-accent hover:text-accent lg:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden">
          <div className="border-t border-border/50 bg-background/98 px-6 pb-10 pt-6">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `border border-accent/30 px-5 py-3 text-base font-medium tracking-[0.15em] transition ${
                      isActive
                        ? "bg-accent text-background"
                        : "text-foreground/70 hover:border-accent hover:text-foreground"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `border border-accent/30 px-5 py-3 text-base font-medium tracking-[0.15em] transition ${
                      isActive
                        ? "bg-accent text-background"
                        : "text-foreground/70 hover:border-accent hover:text-foreground"
                    }`
                  }
                >
                  ADMIN
                </NavLink>
              )}

              <div className="mt-2 flex flex-col gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 border border-accent/30 px-5 py-3 text-base font-medium tracking-[0.15em] text-accent transition hover:bg-accent hover:text-background"
                  >
                    <User className="h-4 w-4" />
                    ACCOUNT
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-center text-base font-medium tracking-[0.15em] text-foreground/70 transition hover:text-foreground"
                    >
                      LOGIN
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center justify-center border border-accent px-6 py-3 text-base font-medium tracking-[0.15em] text-accent transition hover:bg-accent hover:text-background"
                    >
                      INQUIRE
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
