import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Building, Menu, X } from 'lucide-react';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-gold-primary/20 transition-colors duration-500 ${
        scrolled ? 'bg-luxury-black/90 backdrop-blur-lg' : 'bg-luxury-black/60 backdrop-blur-sm'
      }`}
    >
      <div className="container flex h-20 items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold text-luxury-black shadow-gold">
            <Building className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-serif text-gold-primary">Premia Realty</p>
            <p className="text-xs tracking-[0.4em] text-platinum-pearl/60">LUXURY ESTATES</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-xs font-semibold uppercase tracking-[0.35em] transition-colors duration-300 ${
                    isActive ? 'text-gold-primary' : 'text-platinum-pearl/70 hover:text-gold-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <Link
            to="/properties"
            className="rounded-full bg-gradient-gold px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
          >
            View Listings
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/20 text-platinum-pearl transition hover:text-gold-primary lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="border-t border-gold-primary/20 bg-luxury-black/95 px-4 pb-8 pt-6 shadow-luxury">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-full border border-gold-primary/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.45em] transition ${
                      isActive
                        ? 'bg-gradient-gold text-luxury-black'
                        : 'text-platinum-pearl/70 hover:text-gold-primary'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/properties"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.45em] text-luxury-black shadow-gold"
              >
                Reserve Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;