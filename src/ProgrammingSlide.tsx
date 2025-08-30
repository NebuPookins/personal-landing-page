import React, { useEffect, useRef } from 'react';

interface ProgrammingSlideProps {
  id: string;
}

const startedWorkingInSoftware = 2004;

const ProgrammingSlide: React.FC<ProgrammingSlideProps> = ({ id }) => {
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startedWorkingInSoftware;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const _canvas = canvasRef.current;
    if (!_canvas) return;
    const canvas = _canvas!!;
    

    const _ctx = canvas.getContext('2d');
    if (!_ctx) return;
    const ctx = _ctx!!;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix rain effect
    class CodeDrop {
      x: number;
      y: number;
      speed: number;
      length: number;
      chars: string[];
      opacity: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = -Math.random() * (canvas?.height || 600);
        this.speed = 1 + Math.random() * 3;
        this.length = 10 + Math.random() * 20;
        this.chars = [];
        this.opacity = 0.3 + Math.random() * 0.7;
        
        // Generate random code-like characters
        const codeChars = '01{}[]()<>;=+-*/&|!@#$%^&*()_+-=[]{}|;:,.<>?';
        for (let i = 0; i < this.length; i++) {
          this.chars.push(codeChars[Math.floor(Math.random() * codeChars.length)]);
        }
      }

      update() {
        this.y += this.speed;
        if (this.y > (canvas?.height || 600)) {
          this.y = -this.length * 10;
          this.x = Math.random() * (canvas?.width || 800);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.font = '14px monospace';
        ctx.fillStyle = `rgba(0, 255, 0, ${this.opacity})`;
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 5;
        
        for (let i = 0; i < this.chars.length; i++) {
          const alpha = this.opacity * (1 - i / this.chars.length);
          ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
          ctx.fillText(this.chars[i], this.x, this.y - i * 10);
        }
      }
    }

    // Floating code snippets
    class CodeSnippet {
      x: number;
      y: number;
      text: string;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      pulse: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.text = this.getRandomCode();
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = 0.1 + Math.random() * 0.3;
        this.pulse = Math.random() * Math.PI * 2;
      }

      getRandomCode() {
        const snippets = [
          'function()', 'const x =', 'if (true)', 'return null', 
          'async await', 'try catch', 'class {}', 'import from',
          'useEffect()', 'useState()', 'props =>', 'map() =>',
          'filter()', 'reduce()', 'Promise', 'TypeScript'
        ];
        return snippets[Math.floor(Math.random() * snippets.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.pulse += 0.05;

        // Bounce off edges
        if (this.x < 0 || this.x > (canvas?.width || 800)) this.vx *= -1;
        if (this.y < 0 || this.y > (canvas?.height || 600)) this.vy *= -1;

        // Keep in bounds
        this.x = Math.max(0, Math.min(canvas?.width || 800, this.x));
        this.y = Math.max(0, Math.min(canvas?.height || 600, this.y));
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.1;
        ctx.fillStyle = `rgba(0, 150, 255, ${pulseOpacity})`;
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#0096ff';
        ctx.shadowBlur = 3;
        ctx.fillText(this.text, 0, 0);
        
        ctx.restore();
      }
    }

    // Binary particles
    class BinaryParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.maxLife = 0.5 + Math.random() * 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.01;
        
        if (this.life <= 0) {
          this.life = this.maxLife;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }

      draw() {
        const alpha = this.life;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = '10px monospace';
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', this.x, this.y);
      }
    }

    // Create instances
    const codeDrops: CodeDrop[] = Array.from({ length: 50 }, () => new CodeDrop());
    const codeSnippets: CodeSnippet[] = Array.from({ length: 15 }, () => new CodeSnippet());
    const binaryParticles: BinaryParticle[] = Array.from({ length: 100 }, () => new BinaryParticle());

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear canvas with dark tech background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.5, '#1a1a2a');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw all elements
      codeDrops.forEach(drop => {
        drop.update();
        drop.draw();
      });

      codeSnippets.forEach(snippet => {
        snippet.update();
        snippet.draw();
      });

      binaryParticles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Add subtle grid overlay
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
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
        <h2>Programming</h2>
        <div style={{ maxWidth: '30em', textAlign: 'left', marginLeft: 'auto', marginRight: 'auto' }}>
        <p>I'm a "classically trained" Software Development Engineer with {yearsOfExperience} years of experience.</p>
        <p>By "classically trained", I mean I earned a Bachelor of Computer Science from McGill University before LLMs were a thing.</p>
        <p>I've worked at various small companies you've probably never heard of (fewer than 20 employees), and at Amazon.</p>
        </div>
        <p><a href="https://github.com/NebuPookins" target="_blank" rel="noopener" style={{ color: '#00ff00' }}>Browse my GitHub</a></p>
        <div className="arrow">↓</div>
      </div>
    </section>
  );
};

export default ProgrammingSlide;
