import React, { useEffect, useRef } from 'react';

interface StreamingSlideProps {
  id: string;
}

const StreamingSlide: React.FC<StreamingSlideProps> = ({ id }) => {
  const tiktokVideos = [
    { id: "7372832293834018091", title: "Please enter favorite animal" },
    { id: "7481911156873989407", title: "Super Secret Special White Sauce for Suki" },
    { id: "7405856116267224366", title: "GOTTEM" },
    { id: "7494528210877566251", title: "I don't want to get too political here, but..." },
    { id: "7511507687478234414", title: "The resident evil meme" }
  ];
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

    // Streaming particles
    class StreamParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.life = 1;
        this.maxLife = 0.5 + Math.random() * 0.5;
        this.size = 2 + Math.random() * 6;
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        const colors = ['#ff69b4', '#00ff00', '#ff1493', '#00ced1', '#ff4500', '#9400d3'];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.01;
        this.size += 0.05;
        
        if (this.life <= 0) {
          this.life = this.maxLife;
          this.x = Math.random() * (canvas?.width || 800);
          this.y = Math.random() * (canvas?.height || 600);
          this.size = 2 + Math.random() * 6;
          this.color = this.getRandomColor();
        }
      }

      draw() {
        if (!ctx) return;
        const alpha = this.life;
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Camera frame effect
    class CameraFrame {
      x: number;
      y: number;
      width: number;
      height: number;
      pulse: number;

      constructor() {
        this.x = 50;
        this.y = 50;
        this.width = 200;
        this.height = 150;
        this.pulse = 0;
      }

      update() {
        this.pulse += 0.05;
      }

      draw() {
        if (!ctx) return;
        const pulseAlpha = 0.3 + Math.sin(this.pulse) * 0.1;
        
        // Draw camera frame
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.setLineDash([]);
        
        // Draw camera corners
        const cornerSize = 15;
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        ctx.lineWidth = 4;
        ctx.setLineDash([]);
        
        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + cornerSize);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x + cornerSize, this.y);
        ctx.stroke();
        
        // Top-right corner
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - cornerSize, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + cornerSize);
        ctx.stroke();
        
        // Bottom-left corner
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height - cornerSize);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + cornerSize, this.y + this.height);
        ctx.stroke();
        
        // Bottom-right corner
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - cornerSize, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height - cornerSize);
        ctx.stroke();
      }
    }

    // Social media icons
    class SocialIcon {
      x: number;
      y: number;
      type: string;
      pulse: number;
      rotation: number;

      constructor(type: string) {
        this.x = type === 'tiktok' ? (canvas?.width || 800) * 0.3 : (canvas?.width || 800) * 0.7;
        this.y = (canvas?.height || 600) * 0.8;
        this.type = type;
        this.pulse = Math.random() * Math.PI * 2;
        this.rotation = 0;
      }

      update() {
        this.pulse += 0.03;
        this.rotation += 0.01;
      }

      draw() {
        if (!ctx) return;
        const pulseScale = 1 + Math.sin(this.pulse) * 0.1;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(pulseScale, pulseScale);
        ctx.rotate(this.rotation);
        
        if (this.type === 'tiktok') {
          // Draw TikTok-like icon
          ctx.fillStyle = 'rgba(255, 20, 147, 0.8)';
          ctx.beginPath();
          ctx.arc(0, 0, 30, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('♪', 0, 5);
        } else {
          // Draw Instagram-like icon
          ctx.fillStyle = 'rgba(255, 69, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(0, 0, 30, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('📷', 0, 5);
        }
        
        ctx.restore();
      }
    }

    // Create instances
    const streamParticles: StreamParticle[] = Array.from({ length: 40 }, () => new StreamParticle());
    const cameraFrame = new CameraFrame();
    const tiktokIcon = new SocialIcon('tiktok');
    const instagramIcon = new SocialIcon('instagram');

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear canvas with streaming-themed background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a0033');
      gradient.addColorStop(0.3, '#4a0080');
      gradient.addColorStop(0.7, '#8000ff');
      gradient.addColorStop(1, '#1a0033');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw all elements
      streamParticles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      cameraFrame.update();
      cameraFrame.draw();

      tiktokIcon.update();
      tiktokIcon.draw();

      instagramIcon.update();
      instagramIcon.draw();

      // Add streaming lines effect
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 6) * (i + 1);
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
        <h1>I Stream on <a href="https://twitch.tv/NebuPookins" target="_blank" rel="noopener" style={{ color: '#ff69b4' }}>Twitch</a></h1>
        <br />
        <h2>Here's my channel trailer</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/a2Bk7hbfJ88?si=sEZ3lZf9X77t0hvC"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        />
          <br />
          <h2>And I post my clips on</h2>
          <div style={{
            display: 'flex',
            gap: '40px',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px'
          }}>
            <a 
              href="https://www.tiktok.com/@nebupookins" 
              target="_blank" 
              rel="noopener"
              style={{
                display: 'block',
                transition: 'transform 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img 
                src="icon-tiktok-bg.png" 
                alt="TikTok" 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px'
                }}
              />
            </a>
            <a 
              href="https://www.instagram.com/nebupookins" 
              target="_blank" 
              rel="noopener"
              style={{
                display: 'block',
                transition: 'transform 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img 
                src="icon-instagram-bg.png" 
                alt="Instagram" 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px'
                }}
              />
            </a>
          </div>
      </div>
    </section>
  );
};

export default StreamingSlide;
