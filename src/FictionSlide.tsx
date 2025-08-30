import React, { useEffect, useRef } from 'react';

interface FictionSlideProps {
  id: string;
}

const FictionSlide: React.FC<FictionSlideProps> = ({ id }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Dark particles
    class DarkParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      type: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.maxLife = 0.5 + Math.random() * 0.5;
        this.size = 1 + Math.random() * 4;
        this.type = Math.random() > 0.5 ? 'shadow' : 'mist';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.01;
        this.size += 0.02;
        
        if (this.life <= 0) {
          this.life = this.maxLife;
          this.x = Math.random() * (canvas?.width || 800);
          this.y = Math.random() * (canvas?.height || 600);
          this.size = 1 + Math.random() * 4;
        }
      }

      draw() {
        if (!ctx) return;
        const alpha = this.life;
        
        if (this.type === 'shadow') {
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(128, 128, 128, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Eerie text effect
    class EerieText {
      x: number;
      y: number;
      text: string;
      pulse: number;
      flicker: number;
      rotation: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.text = this.getRandomText();
        this.pulse = Math.random() * Math.PI * 2;
        this.flicker = Math.random() * Math.PI * 2;
        this.rotation = (Math.random() - 0.5) * 0.1;
      }

      getRandomText() {
        const words = ['whisper', 'shadow', 'darkness', 'fear', 'silence', 'void', 'night', 'creep', 'lurk', 'haunt', 'dread', 'terror', 'horror', 'evil', 'death'];
        return words[Math.floor(Math.random() * words.length)];
      }

      update() {
        this.pulse += 0.02;
        this.flicker += 0.1;
      }

      draw() {
        if (!ctx) return;
        const pulseOpacity = 0.1 + Math.sin(this.pulse) * 0.05;
        const flickerOpacity = 0.8 + Math.sin(this.flicker) * 0.2;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = `rgba(139, 0, 0, ${pulseOpacity * flickerOpacity})`;
        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#8b0000';
        ctx.shadowBlur = 5;
        ctx.fillText(this.text, 0, 0);
        
        ctx.restore();
      }
    }

    // Lightning effect
    class Lightning {
      points: { x: number; y: number }[];
      life: number;
      maxLife: number;

      constructor() {
        this.points = [];
        this.life = 1;
        this.maxLife = 0.3 + Math.random() * 0.4;
        
        // Generate lightning path
        const startX = Math.random() * (canvas?.width || 800);
        const startY = 0;
        let currentX = startX;
        let currentY = startY;
        
        this.points.push({ x: currentX, y: currentY });
        
        while (currentY < (canvas?.height || 600)) {
          currentX += (Math.random() - 0.5) * 100;
          currentY += 20 + Math.random() * 30;
          this.points.push({ x: currentX, y: currentY });
        }
      }

      update() {
        this.life -= 0.02;
      }

      draw() {
        if (!ctx || this.life <= 0) return;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.8})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Create instances
    const darkParticles: DarkParticle[] = Array.from({ length: 60 }, () => new DarkParticle());
    const eerieTexts: EerieText[] = Array.from({ length: 20 }, () => new EerieText());
    let lightning: Lightning | null = null;
    let lightningTimer = 0;

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear canvas with dark horror background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.3, '#1a0a1a');
      gradient.addColorStop(0.7, '#2a0a2a');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw all elements
      darkParticles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      eerieTexts.forEach(text => {
        text.update();
        text.draw();
      });

      // Lightning effect
      lightningTimer++;
      if (lightningTimer > 200 && Math.random() < 0.02) {
        lightning = new Lightning();
        lightningTimer = 0;
      }

      if (lightning) {
        lightning.update();
        lightning.draw();
        if (lightning.life <= 0) {
          lightning = null;
        }
      }

      // Add atmospheric fog
      ctx.fillStyle = 'rgba(128, 128, 128, 0.05)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 50 + Math.random() * 100;
        
        const fogGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        fogGradient.addColorStop(0, 'rgba(128, 128, 128, 0.1)');
        fogGradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
        
        ctx.fillStyle = fogGradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

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
      id={id}
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
      <div style={{ position: 'relative', zIndex: 1, height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        <h2>Fiction Writing</h2>
        <p>I've written a sci-fi horror story.</p>
        <a 
          href="https://amzn.to/45GmIp3" 
          target="_blank" 
          rel="noopener"
          className="amazon-link"
        >
          <img 
            src="tiny-pests-cover.jpg" 
            alt="[Tiny Pests by Nebu Pookins]" 
            style={{
              maxWidth: '200px',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        </a>
        <small
          style={{
            maxWidth: '40em',
            fontSize: '50%',
            textAlign: 'left',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <p>
            From mind-altering parasites in nature to unsettling anomalies in modern research labs,
            Tiny Pests unfolds through a chilling collection of recovered audio logs, personal memos,
            and field notes from scientists across the globe. At first, the strange findings seem
            disconnected&emdash;quirky, even fascinating. A virus that makes animals rabid. A wasp
            that turns cockroaches into puppets. Microplastics showing up in places they shouldn't.
          </p>
          <p>
            But with each new log, a darker picture begins to emerge. Something is linking these
            discoveries. Something that's watching. Learning. Spreading.
          </p>
          <p>
            You'll think it's about bugs.<br/>
            You'll wish it were just bugs.
          </p>
          <p>
            <b>Tiny Pests</b> is a slow-burn horror story about science, control, and the terrifying
            realization that your thoughts may not be your own.
          </p>
        </small>
      </div>
    </section>
  );
};

export default FictionSlide;
