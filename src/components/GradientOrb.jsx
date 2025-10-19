import { useEffect, useRef } from 'react';

const GradientOrb = ({
  size = 600,
  colors = ['#000000', '#1a1a1a', '#D4AF37', '#B8960F'],
  rotationSpeed = 0.001,
  mouseInfluence = 0.1,
  blur = 100
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rotationRef = useRef(0);
  const animationFrameRef = useRef(null);
  const sizeRef = useRef({ current: size, target: size });
  const intensityRef = useRef(1);

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

    // Smooth mouse position with easing
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / width) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / height) * 2 - 1;

      // Calculate distance from center for intensity
      const distanceFromCenter = Math.sqrt(
        Math.pow(e.clientX - width / 2, 2) + Math.pow(e.clientY - height / 2, 2)
      );
      const maxDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
      const normalizedDistance = distanceFromCenter / maxDistance;

      // Orb grows when mouse is near center
      sizeRef.current.target = size * (1 + (1 - normalizedDistance) * 0.3);
    };

    // Create radial gradient with multiple color stops and intensity
    const createGradient = (centerX, centerY, radius, intensity = 1) => {
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );

      // Add color stops with dynamic intensity
      const alpha = Math.min(intensity, 1);
      gradient.addColorStop(0, colors[3] + Math.floor(alpha * 255).toString(16).padStart(2, '0')); // Gold center
      gradient.addColorStop(0.3, colors[2]); // Lighter gold
      gradient.addColorStop(0.6, colors[1]); // Dark gray
      gradient.addColorStop(1, colors[0]); // Black edge

      return gradient;
    };

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Smooth easing for mouse position
      const easing = 0.05;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * easing;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * easing;

      // Smooth easing for size changes
      sizeRef.current.current += (sizeRef.current.target - sizeRef.current.current) * 0.05;

      // Update rotation
      rotationRef.current += rotationSpeed;

      // Calculate orb position with mouse influence and rotation
      const baseX = width / 2;
      const baseY = height / 2;

      // Enhanced parallax effect with stronger mouse influence
      const parallaxStrength = mouseInfluence * 200;
      const offsetX = mouseRef.current.x * parallaxStrength;
      const offsetY = mouseRef.current.y * parallaxStrength;

      // Add subtle orbital motion
      const orbitRadius = 30;
      const orbitX = Math.cos(rotationRef.current * 2) * orbitRadius;
      const orbitY = Math.sin(rotationRef.current * 2) * orbitRadius;

      const orbX = baseX + offsetX + orbitX;
      const orbY = baseY + offsetY + orbitY;

      // Calculate intensity based on mouse activity
      const mouseActivity = Math.sqrt(
        Math.pow(mouseRef.current.x, 2) + Math.pow(mouseRef.current.y, 2)
      );
      intensityRef.current = 1 + mouseActivity * 0.3;

      // Create multiple overlapping gradients for depth
      ctx.save();

      // Apply blur effect
      ctx.filter = `blur(${blur}px)`;

      // Use dynamic size
      const currentSize = sizeRef.current.current;

      // Main orb with intensity
      const mainGradient = createGradient(orbX, orbY, currentSize / 2, intensityRef.current);
      ctx.beginPath();
      ctx.arc(orbX, orbY, currentSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = mainGradient;
      ctx.fill();

      // Secondary orb for glow effect - more reactive to mouse
      const secondaryOffsetX = Math.cos(rotationRef.current * 3) * 50 + mouseRef.current.x * 30;
      const secondaryOffsetY = Math.sin(rotationRef.current * 3) * 50 + mouseRef.current.y * 30;
      const glowGradient = createGradient(
        orbX + secondaryOffsetX,
        orbY + secondaryOffsetY,
        currentSize / 3,
        intensityRef.current
      );
      ctx.globalAlpha = 0.6 + mouseActivity * 0.2;
      ctx.beginPath();
      ctx.arc(
        orbX + secondaryOffsetX,
        orbY + secondaryOffsetY,
        currentSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Accent highlight - follows mouse more closely
      ctx.globalAlpha = 0.4 + mouseActivity * 0.3;
      const highlightOffsetX = Math.cos(rotationRef.current * 5) * 80 + mouseRef.current.x * 60;
      const highlightOffsetY = Math.sin(rotationRef.current * 5) * 80 + mouseRef.current.y * 60;
      const highlightGradient = ctx.createRadialGradient(
        orbX + highlightOffsetX,
        orbY + highlightOffsetY,
        0,
        orbX + highlightOffsetX,
        orbY + highlightOffsetY,
        currentSize / 4
      );
      highlightGradient.addColorStop(0, colors[3]);
      highlightGradient.addColorStop(0.5, colors[2]);
      highlightGradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(
        orbX + highlightOffsetX,
        orbY + highlightOffsetY,
        currentSize / 4,
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
