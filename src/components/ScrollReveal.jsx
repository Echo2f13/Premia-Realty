import { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({
  children,
  className = '',
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, triggerOnce]);

  const animationClass = isVisible ? `animate-${animation}` : 'opacity-0';
  const delayClass = delay > 0 ? `animation-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`${animationClass} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
