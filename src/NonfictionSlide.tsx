import React, { useEffect, useRef } from 'react';

interface NonfictionSlideProps {
  id: string;
}

const posts = [
{title: "From Hot Dogs to Parallel Universes: The Hidden Politics of Scientific Labels", url: "https://open.substack.com/pub/nebu/p/from-hot-dogs-to-parallel-universes?r=7fgws&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true", image: "substack-hotdog.jpg"},
{title: "The Convenient Myth of Experimental Rigor in Science", url: "https://open.substack.com/pub/nebu/p/the-convenient-myth-of-experimental?r=7fgws&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true", image: "substack-scientific-rigor.jpg"},
{title: "The GPU Coincidence: How Hardware Compatibility May Be Shaping the Future of AI", url: "https://open.substack.com/pub/nebu/p/the-gpu-coincidence-how-hardware?r=7fgws&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true", image: "substack-gpu-coincidence.jpg"}
];

const NonfictionSlide: React.FC<NonfictionSlideProps> = ({ id }) => {
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

    // Floating text particles
    class TextParticle {
      x: number;
      y: number;
      text: string;
      vx: number;
      vy: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      pulse: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.text = this.getRandomText();
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = 0.1 + Math.random() * 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.pulse = Math.random() * Math.PI * 2;
      }

      getRandomText() {
        const words = ['science', 'research', 'analysis', 'evidence', 'theory', 'hypothesis', 'experiment', 'data', 'conclusion', 'methodology', 'peer review', 'replication', 'bias', 'rigor', 'objectivity'];
        return words[Math.floor(Math.random() * words.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.pulse += 0.02;

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
        
        const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.05;
        ctx.fillStyle = `rgba(139, 69, 19, ${pulseOpacity})`;
        ctx.font = '10px serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, 0, 0);
        
        ctx.restore();
      }
    }

    // Ink flow effect
    class InkFlow {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.maxLife = 0.5 + Math.random() * 0.5;
        this.size = 2 + Math.random() * 4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.01;
        this.size += 0.1;
        
        if (this.life <= 0) {
          this.life = this.maxLife;
          this.x = Math.random() * (canvas?.width || 800);
          this.y = Math.random() * (canvas?.height || 600);
          this.size = 2 + Math.random() * 4;
        }
      }

      draw() {
        if (!ctx) return;
        const alpha = this.life;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Paper texture effect
    class PaperTexture {
      draw() {
        if (!ctx) return;
        // Create subtle paper texture with noise
        for (let i = 0; i < 1000; i++) {
          const x = Math.random() * (canvas?.width || 800);
          const y = Math.random() * (canvas?.height || 600);
          const alpha = 0.01 + Math.random() * 0.02;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Create instances
    const textParticles: TextParticle[] = Array.from({ length: 25 }, () => new TextParticle());
    const inkFlows: InkFlow[] = Array.from({ length: 15 }, () => new InkFlow());
    const paperTexture = new PaperTexture();

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear canvas with paper-like background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#faf9f6');
      gradient.addColorStop(0.5, '#f5f5dc');
      gradient.addColorStop(1, '#f0e68c');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add paper texture
      paperTexture.draw();

      // Update and draw all elements
      textParticles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      inkFlows.forEach(flow => {
        flow.update();
        flow.draw();
      });

      // Add subtle grid lines like notebook paper
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.lineWidth = 1;
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Vertical margin line
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.lineTo(80, canvas.height);
      ctx.stroke();

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
      <div style={{ position: 'relative', zIndex: 1, height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'black' }}>
        <h2>Non-Fiction Writing</h2>
        <p><a href="https://nebu.substack.com" target="_blank" rel="noopener" style={{ color: '#8B4513' }}>Read my essays on Substack</a></p>
        
        <div className="posts-grid">
          {posts.map((post, index) => (
            <a 
              key={index}
              href={post.url} 
              target="_blank" 
              rel="noopener"
              className="post-thumbnail"
            >
              <img src={`${post.image}`} alt={post.title} />
            </a>
          ))}
        </div>
        
        <div className="arrow">↓</div>
      </div>
    </section>
  );
};

export default NonfictionSlide;
