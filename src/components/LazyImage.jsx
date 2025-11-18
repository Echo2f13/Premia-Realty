import { useState, useEffect, useRef } from 'react';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23171717"/%3E%3C/svg%3E',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
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
          rootMargin: '100px', // Increased from 50px for earlier loading
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
    setImageError(false);
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
    // Use a fallback image from Unsplash if the original fails
    if (imageSrc !== placeholder) {
      setImageSrc('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop');
    }
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`lazy-load-image ${imageLoaded ? 'loaded' : ''} ${imageError ? 'error' : ''} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default LazyImage;
