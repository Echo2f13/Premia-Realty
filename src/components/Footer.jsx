import { Link } from 'react-router-dom';
import { Building, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gold-primary/10 bg-luxury-black/90">
      <div className="container grid gap-12 px-4 py-16 lg:grid-cols-[1.2fr,1fr] lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-luxury-black shadow-gold">
              <Building className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <p className="text-lg font-serif text-gold-primary">Premia Realty</p>
              <p className="text-xs tracking-[0.4em] text-platinum-pearl/60">LUXURY ESTATES</p>
            </div>
          </div>
          <p className="max-w-md text-sm text-platinum-pearl/70">
            We curate an exclusive portfolio of luxury residences across the globe, matching discerning clients with
            properties that reflect their vision, lifestyle, and legacy.
          </p>
          <div className="flex items-center gap-4 text-sm text-platinum-pearl/60">
            <Phone className="h-4 w-4 text-gold-primary" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-platinum-pearl/60">
            <Mail className="h-4 w-4 text-gold-primary" />
            <span>concierge@premiarealty.com</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-platinum-pearl/60">
            <MapPin className="h-4 w-4 text-gold-primary" />
            <span>123 Luxury Avenue, Downtown</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm text-platinum-pearl/70">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-platinum-pearl">Navigation</p>
            <div className="flex flex-col gap-2">
              <Link to="/" className="hover:text-gold-primary transition-colors">
                Home
              </Link>
              <Link to="/properties" className="hover:text-gold-primary transition-colors">
                Properties
              </Link>
              <Link to="/about" className="hover:text-gold-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="hover:text-gold-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-platinum-pearl">Concierge</p>
            <p>Mon – Fri: 9AM – 6PM</p>
            <p>Sat: 10AM – 4PM</p>
            <p>Private previews by appointment</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gold-primary/10 py-6 text-center text-xs uppercase tracking-[0.4em] text-platinum-pearl/40">
        © {new Date().getFullYear()} Premia Realty. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;