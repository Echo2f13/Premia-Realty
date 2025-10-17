import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top ${isVisible ? 'visible' : ''} w-12 h-12 border border-accent/30 bg-card hover:bg-accent hover:border-accent flex items-center justify-center transition-all group`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5 text-accent group-hover:text-background transition-colors" strokeWidth={1.5} />
    </button>
  );
};

export default BackToTop;
