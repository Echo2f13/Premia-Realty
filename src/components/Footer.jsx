import { Link } from 'react-router-dom';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 mt-32">
      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 border border-accent/30 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-accent" strokeWidth={1} />
              </div>
              <div>
                <div className="text-xl tracking-[0.2em] font-monument">PREMIA</div>
                <div className="text-[10px] tracking-[0.3em] text-accent -mt-1 font-monument">REALTY</div>
              </div>
            </div>
            <p className="text-base text-foreground/60 font-light leading-relaxed mb-8">
              Curating exclusive luxury properties across Bahrain's most prestigious locations
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-base text-foreground/60">
                <Phone className="w-5 h-5 text-accent" strokeWidth={1} />
                <span>+973 1234 5678</span>
              </div>
              <div className="flex items-center gap-3 text-base text-foreground/60">
                <Mail className="w-5 h-5 text-accent" strokeWidth={1} />
                <span>concierge@premiarealty.com</span>
              </div>
              <div className="flex items-center gap-3 text-base text-foreground/60">
                <MapPin className="w-5 h-5 text-accent" strokeWidth={1} />
                <span>Manama, Kingdom of Bahrain</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] text-accent mb-6 font-monument">NAVIGATION</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-base text-foreground/60 hover:text-accent transition-colors">
                Home
              </Link>
              <Link to="/properties" className="block text-base text-foreground/60 hover:text-accent transition-colors">
                Properties
              </Link>
              <Link to="/about" className="block text-base text-foreground/60 hover:text-accent transition-colors">
                About
              </Link>
              <Link to="/contact" className="block text-base text-foreground/60 hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] text-accent mb-6 font-monument">HOURS</h4>
            <div className="space-y-3 text-sm text-foreground/60 font-light">
              <p>Monday - Friday</p>
              <p>9:00 AM - 6:00 PM</p>
              <p className="mt-6">Private viewings by appointment</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 text-center">
          <p className="text-xs text-foreground/40 tracking-[0.2em] font-monument">
            © {new Date().getFullYear()} PREMIA REALTY. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
