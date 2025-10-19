import { useEffect, useRef } from 'react';

const GradientOrb = ({
  size = 600,
  colors = ['#000000', '#1a1a1a', '#D4AF37', '#B8960F'],
  rotationSpeed = 0.001,
  mouseInfluence = 0.1,
  blur = 100
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasSize();

    // Mouse position (normalized to -1 to 1)
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / width) * 2 - 1;
      mouseRef.current.y = (e.clientY / height) * 2 - 1;
    };

    // Create radial gradient with multiple color stops
    const createGradient = (centerX, centerY, radius) => {
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );

      // Add color stops
      gradient.addColorStop(0, colors[3]); // Gold center
      gradient.addColorStop(0.3, colors[2]); // Lighter gold
      gradient.addColorStop(0.6, colors[1]); // Dark gray
      gradient.addColorStop(1, colors[0]); // Black edge

      return gradient;
    };

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update rotation
      rotationRef.current += rotationSpeed;

      // Calculate orb position with mouse influence and rotation
      const baseX = width / 2;
      const baseY = height / 2;

      // Add parallax effect based on mouse position
      const offsetX = mouseRef.current.x * mouseInfluence * 100;
      const offsetY = mouseRef.current.y * mouseInfluence * 100;

      // Add subtle orbital motion
      const orbitRadius = 30;
      const orbitX = Math.cos(rotationRef.current * 2) * orbitRadius;
      const orbitY = Math.sin(rotationRef.current * 2) * orbitRadius;

      const orbX = baseX + offsetX + orbitX;
      const orbY = baseY + offsetY + orbitY;

      // Create multiple overlapping gradients for depth
      ctx.save();

      // Apply blur effect
      ctx.filter = `blur(${blur}px)`;

      // Main orb
      const mainGradient = createGradient(orbX, orbY, size / 2);
      ctx.beginPath();
      ctx.arc(orbX, orbY, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = mainGradient;
      ctx.fill();

      // Secondary orb for glow effect
      const secondaryOffsetX = Math.cos(rotationRef.current * 3) * 50;
      const secondaryOffsetY = Math.sin(rotationRef.current * 3) * 50;
      const glowGradient = createGradient(
        orbX + secondaryOffsetX,
        orbY + secondaryOffsetY,
        size / 3
      );
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(
        orbX + secondaryOffsetX,
        orbY + secondaryOffsetY,
        size / 3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Accent highlight
      ctx.globalAlpha = 0.4;
      const highlightOffsetX = Math.cos(rotationRef.current * 5) * 80;
      const highlightOffsetY = Math.sin(rotationRef.current * 5) * 80;
      const highlightGradient = ctx.createRadialGradient(
        orbX + highlightOffsetX,
        orbY + highlightOffsetY,
        0,
        orbX + highlightOffsetX,
        orbY + highlightOffsetY,
        size / 4
      );
      highlightGradient.addColorStop(0, colors[3]);
      highlightGradient.addColorStop(0.5, colors[2]);
      highlightGradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(
        orbX + highlightOffsetX,
        orbY + highlightOffsetY,
        size / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = highlightGradient;
      ctx.fill();

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [size, colors, rotationSpeed, mouseInfluence, blur]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        background: 'transparent',
        pointerEvents: 'none'
      }}
    />
  );
};

export default GradientOrb;
