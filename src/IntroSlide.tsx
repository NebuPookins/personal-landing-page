import React, { useEffect, useState, useRef } from 'react';

interface IntroSlideProps {
}

const IntroSlide: React.FC<IntroSlideProps> = ({}) => {
  const [animate, setAnimate] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Trigger animation on component mount
    setAnimate(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let animationId: number;
    let time = 0;

    // Star class for parallax effect
    class Star {
      x: number;
      y: number;
      z: number;
      speed: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.z = Math.random() * 1000;
        this.speed = 0.5 + Math.random() * 2;
      }

      update() {
        this.z -= this.speed;
        if (this.z < 1) {
          this.z = 1000;
          this.x = Math.random() * (canvas?.width || 800);
          this.y = Math.random() * (canvas?.height || 600);
        }
      }

      draw() {
        const canvasWidth = canvas?.width || 800;
        const canvasHeight = canvas?.height || 600;
        const x = (this.x - canvasWidth / 2) * (1000 / this.z) + canvasWidth / 2;
        const y = (this.y - canvasHeight / 2) * (1000 / this.z) + canvasHeight / 2;
        const size = (1000 - this.z) / 100;

        if (x > 0 && x < canvasWidth && y > 0 && y < canvasHeight && ctx) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, size / 10)})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Create stars
    const stars: Star[] = Array.from({ length: 200 }, () => new Star());



    // 3D perspective grid with fractal heightmap
    const draw3DGrid = () => {
      const topHorizonY = 0;
      const bottomHorizonY = canvas.height;
      const gridDepth = 30;
      const gridWidth = 25;
      const perspectiveFactor = 0.97; // 0.95 < ? < 0.99
      
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 10;

      // Fractal heightmap function
      const getHeight = (x: number, z: number, t: number) => {
        const scale1 = 0.01;
        const scale2 = 0.02;
        const scale3 = 0.04;
        
        const noise1 = Math.sin(x * scale1 + t * 0.01) * Math.cos(z * scale1 + t * 0.015);
        const noise2 = Math.sin(x * scale2 + t * 0.02) * Math.cos(z * scale2 + t * 0.025) * 0.5;
        const noise3 = Math.sin(x * scale3 + t * 0.03) * Math.cos(z * scale3 + t * 0.035) * 0.25;
        
        return (noise1 + noise2 + noise3) * 50;
      };

      // Function to draw a single grid
      const drawSingleGrid = (horizonY: number, isFlipped: boolean = false) => {
        // Draw horizontal lines (depth layers)
        for (let z = 0; z < gridDepth; z++) {
          const perspective = Math.pow(perspectiveFactor, z);
          const baseY = horizonY + (isFlipped ? - (z * 30 * perspective) : (z * 30 * perspective));
          const alpha = Math.max(0, 1 - z / gridDepth);
          
          ctx.strokeStyle = `rgba(255, 0, 255, ${alpha * 0.8})`;
          ctx.lineWidth = Math.max(1, 3 * perspective);
          
          ctx.beginPath();
          for (let x = -gridWidth; x <= gridWidth; x++) {
            const screenX = (x * 50 * perspective) + canvas.width / 2;
            const height = getHeight(x, z, time);
            const finalY = isFlipped ? baseY - height : baseY + height;
            
            if (x === -gridWidth) {
              ctx.moveTo(screenX, finalY);
            } else {
              ctx.lineTo(screenX, finalY);
            }
          }
          ctx.stroke();
        }
      };

      // Draw top grid (normal)
      drawSingleGrid(topHorizonY, false);
      
      // Draw bottom grid (flipped)
      drawSingleGrid(bottomHorizonY, true);

      ctx.shadowBlur = 0;
    };

    // Animation loop
    const animate = () => {
      time += 1;

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a2a');
      gradient.addColorStop(0.3, '#1a0a3a');
      gradient.addColorStop(0.7, '#2a0a4a');
      gradient.addColorStop(1, '#0a0a2a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      // Draw 3D perspective grid
      draw3DGrid();



      // Add some atmospheric glow
      const glowGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      glowGradient.addColorStop(0, 'rgba(255, 0, 255, 0.1)');
      glowGradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      className="slide"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Hi, I'm Nebu Pookins</h1>
        <h2>(And the cat's name is Marley)</h2>
        <div className="arrow">↓</div>
        <img
          src="nebu-and-marley.png"
          alt="An Asian guy holding up a cat"
          className={`animated-image ${animate ? 'slide-in' : ''}`}
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '50vw',
            height: '50vh', 
            objectFit: 'cover',
          }}
        />
      </div>
    </section>
  );
};

export default IntroSlide;
