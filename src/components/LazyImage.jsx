import { useState, useEffect, useRef } from 'react';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'https://via.placeholder.com/400x300?text=Loading...',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;
    const imgElement = imgRef.current;

    if (imgElement && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imgElement);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      observer.observe(imgElement);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      setImageSrc(src);
    }

    return () => {
      if (observer && imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`lazy-load-image ${imageLoaded ? 'loaded' : ''} ${className}`}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default LazyImage;
