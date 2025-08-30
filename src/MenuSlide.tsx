import React, { useEffect, useRef } from 'react';

interface MenuItem {
  label: string;
  href: string;  // Constructed href for the anchor tag
}

interface MenuSlideProps {
  id: string;
  items: MenuItem[];
}

const MenuSlide: React.FC<MenuSlideProps> = ({ id, items }) => {
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

    // Floating menu item
    class FloatingMenuItem {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
      label: string;
      pulse: number;
      rotation: number;
      scale: number;
      isHovered: boolean;

      constructor(label: string, index: number) {
        this.label = label;
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.targetX = (canvas?.width || 800) * 0.5;
        this.targetY = 200 + index * 80;
        this.pulse = Math.random() * Math.PI * 2;
        this.rotation = (Math.random() - 0.5) * 0.2;
        this.scale = 1;
        this.isHovered = false;
      }

      update() {
        // Move towards target position
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }

        // Add some floating motion
        this.x += Math.sin(this.pulse) * 0.5;
        this.y += Math.cos(this.pulse) * 0.5;
        
        this.pulse += 0.02;
        this.rotation += 0.005;
        
        // Reset scale if not hovered
        if (!this.isHovered) {
          this.scale = Math.max(1, this.scale * 0.95);
        }
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        // Draw background circle
        const pulseAlpha = 0.3 + Math.sin(this.pulse) * 0.1;
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, 60, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = `rgba(0, 255, 255, ${pulseAlpha + 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw label
        ctx.fillStyle = `rgba(0, 0, 0, 0.8)`;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.label, 0, 5);
        
        ctx.restore();
      }

      checkHover(mouseX: number, mouseY: number) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 60) {
          this.isHovered = true;
          this.scale = Math.min(1.3, this.scale * 1.1);
        } else {
          this.isHovered = false;
        }
      }
    }

    // Selection indicator
    class SelectionIndicator {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      pulse: number;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.pulse = 0;
      }

      update(targetX: number, targetY: number) {
        this.targetX = targetX;
        this.targetY = targetY;
        
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        
        this.x += dx * 0.1;
        this.y += dy * 0.1;
        this.pulse += 0.05;
      }

      draw() {
        if (!ctx) return;
        
        const pulseAlpha = 0.5 + Math.sin(this.pulse) * 0.2;
        
        // Draw selection ring
        ctx.strokeStyle = `rgba(0, 255, 255, ${pulseAlpha})`;
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.arc(this.x, this.y, 70, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw inner glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 70);
        gradient.addColorStop(0, `rgba(0, 255, 255, ${pulseAlpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 70, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Background particles
    class BackgroundParticle {
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
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = 1;
        this.maxLife = 0.5 + Math.random() * 0.5;
        this.size = 1 + Math.random() * 3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.01;
        
        if (this.life <= 0) {
          this.life = this.maxLife;
          this.x = Math.random() * (canvas?.width || 800);
          this.y = Math.random() * (canvas?.height || 600);
        }
      }

      draw() {
        if (!ctx) return;
        const alpha = this.life;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create instances
    const menuItems: FloatingMenuItem[] = items.map((item, index) => new FloatingMenuItem(item.label, index));
    const selectionIndicator = new SelectionIndicator();
    const backgroundParticles: BackgroundParticle[] = Array.from({ length: 30 }, () => new BackgroundParticle());

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear canvas with menu-themed background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a1a2a');
      gradient.addColorStop(0.5, '#2a2a3a');
      gradient.addColorStop(1, '#1a1a2a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw background particles
      backgroundParticles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Update and draw menu items
      menuItems.forEach(item => {
        item.update();
        item.checkHover(mouseX, mouseY);
        item.draw();
      });

      // Update and draw selection indicator
      const hoveredItem = menuItems.find(item => item.isHovered);
      if (hoveredItem) {
        selectionIndicator.update(hoveredItem.x, hoveredItem.y);
      }
      selectionIndicator.draw();

      // Add subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 100;
      
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
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [items]);

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
        <h2>Did you know I'm into all of these things?</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item, index) => (
            <li key={index} style={{ margin: '20px 0' }}>
              <a href={item.href} style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MenuSlide;
