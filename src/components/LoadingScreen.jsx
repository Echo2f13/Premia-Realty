import { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnimating(false);
            if (onLoadingComplete) {
              setTimeout(onLoadingComplete, 600);
            }
          }, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  if (!isAnimating) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      style={{
        animation: progress >= 100 ? 'fadeOut 0.6s ease-out forwards' : 'none'
      }}
    >
      <div className="relative flex flex-col items-center gap-16">
        {/* Brand Name */}
        <div className="text-center space-y-4">
          <div
            className="text-5xl tracking-[0.35em] text-accent font-semibold"
            style={{
              animation: 'fadeIn 0.6s ease-out forwards',
              opacity: 0
            }}
          >
            PREMIA
          </div>
          <div
            className="text-lg tracking-[0.5em] text-foreground/60 font-light"
            style={{
              animation: 'fadeIn 0.6s ease-out 0.2s forwards',
              opacity: 0
            }}
          >
            REALTY
          </div>
        </div>

        {/* Simple Progress Line */}
        <div
          className="w-80"
          style={{
            animation: 'fadeIn 0.6s ease-out 0.4s forwards',
            opacity: 0
          }}
        >
          <div className="relative h-px bg-border/20 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-accent"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 8px hsl(var(--accent) / 0.4)',
                transition: 'width 0.15s ease-out'
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
