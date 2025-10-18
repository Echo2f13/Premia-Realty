import { Link } from 'react-router-dom';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

const Footer = () => {
  const { t } = useLanguage();

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
                <div className="text-xl tracking-[0.2em]">PREMIA</div>
                <div className="text-[10px] tracking-[0.3em] text-accent -mt-1">REALTY</div>
              </div>
            </div>
            <p className="text-base text-foreground/60 font-light leading-relaxed mb-8">
              {t(translations.footer.about.description)}
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
                <span>{t(translations.footer.address)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] text-accent mb-6">{t(translations.footer.quickLinks)}</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-base text-foreground/60 hover:text-accent transition-colors">
                {t(translations.nav.home)}
              </Link>
              <Link to="/properties" className="block text-base text-foreground/60 hover:text-accent transition-colors">
                {t(translations.nav.properties)}
              </Link>
              <Link to="/about" className="block text-base text-foreground/60 hover:text-accent transition-colors">
                {t(translations.nav.about)}
              </Link>
              <Link to="/contact" className="block text-base text-foreground/60 hover:text-accent transition-colors">
                {t(translations.nav.contact)}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] text-accent mb-6">{t(translations.contact.info.hours)}</h4>
            <div className="space-y-3 text-sm text-foreground/60 font-light">
              <p>{t(translations.contact.info.weekdays)}</p>
              <p className="mt-6">{t(translations.contact.info.weekend)}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 text-center">
          <p className="text-xs text-foreground/40 tracking-[0.2em]">
            {t(translations.footer.copyright)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
