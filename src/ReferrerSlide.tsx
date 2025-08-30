import React, { useEffect, useRef } from 'react';
import type { JSX } from 'react';

export type ReferrerBucket = "streaming" | "programming" | "non-fiction" | "fiction"

interface ReferrerSlideProps {
  domainName: string;
  bucket: ReferrerBucket;
}

const messageMap: {[K in ReferrerBucket]: (s: string) => JSX.Element} = {
  "streaming": (domain) => <p style={{ marginTop: '20px', fontSize: '1.2em' }}>You came from {domain}, so you probably know me from streaming!</p>,
  "programming": (domain) => <p style={{ marginTop: '20px', fontSize: '1.2em' }}>You came from {domain}, so you probably know me from one of my programming projects!</p>,
  "fiction": (domain) => <p style={{ marginTop: '20px', fontSize: '1.2em' }}>You came from {domain}, so you probably know me from one of my contrarian articles!</p>,
  "non-fiction": (domain) => <p style={{ marginTop: '20px', fontSize: '1.2em' }}>You came from {domain}, so you probably know me from one of my works of fiction!</p>,
}

const ReferrerSlide: React.FC<ReferrerSlideProps> = ({ domainName, bucket }) => {
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

    // Network node
    class NetworkNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      connections: NetworkNode[];
      pulse: number;
      type: string;

      constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = 8 + Math.random() * 4;
        this.connections = [];
        this.pulse = Math.random() * Math.PI * 2;
        this.type = type;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
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
        const pulseScale = 1 + Math.sin(this.pulse) * 0.1;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(pulseScale, pulseScale);
        
        // Draw node
        const colors = {
          'streaming': '#ff69b4',
          'programming': '#00ff00',
          'non-fiction': '#ffa500',
          'fiction': '#8b0000'
        };
        
        ctx.fillStyle = colors[bucket as keyof typeof colors] || '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node type label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type, 0, this.size + 15);
        
        ctx.restore();
      }
    }

    // Connection line
    class ConnectionLine {
      startNode: NetworkNode;
      endNode: NetworkNode;
      pulse: number;
      strength: number;

      constructor(start: NetworkNode, end: NetworkNode) {
        this.startNode = start;
        this.endNode = end;
        this.pulse = Math.random() * Math.PI * 2;
        this.strength = 0.3 + Math.random() * 0.4;
      }

      update() {
        this.pulse += 0.01;
      }

      draw() {
        if (!ctx) return;
        const pulseAlpha = this.strength + Math.sin(this.pulse) * 0.1;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(this.startNode.x, this.startNode.y);
        ctx.lineTo(this.endNode.x, this.endNode.y);
        ctx.stroke();
        
        ctx.setLineDash([]);
      }
    }

    // Data flow particle
    class DataParticle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      life: number;
      maxLife: number;
      size: number;

      constructor(startX: number, startY: number, endX: number, endY: number) {
        this.x = startX;
        this.y = startY;
        this.targetX = endX;
        this.targetY = endY;
        this.life = 1;
        this.maxLife = 1;
        this.size = 2 + Math.random() * 3;
      }

      update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
          const speed = 3;
          this.x += (dx / distance) * speed;
          this.y += (dy / distance) * speed;
        }
        
        this.life -= 0.01;
      }

      draw() {
        if (!ctx || this.life <= 0) return;
        
        const alpha = this.life;
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create network nodes
    const nodes: NetworkNode[] = [];
    const connections: ConnectionLine[] = [];
    const dataParticles: DataParticle[] = [];
    
    // Create nodes for different referrer types
    const nodeTypes = ['streaming', 'programming', 'non-fiction', 'fiction'];
    nodeTypes.forEach((type, index) => {
      const x = 100 + (index * 150);
      const y = 100 + Math.random() * 100;
      const node = new NetworkNode(x, y, type);
      nodes.push(node);
    });

    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < 0.7) {
          const connection = new ConnectionLine(nodes[i], nodes[j]);
          connections.push(connection);
        }
      }
    }

    // Create data particles periodically
    let particleTimer = 0;

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear canvas with network-themed background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a1a2a');
      gradient.addColorStop(0.5, '#1a2a3a');
      gradient.addColorStop(1, '#0a1a2a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw all elements
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      connections.forEach(connection => {
        connection.update();
        connection.draw();
      });

      // Create new data particles
      particleTimer++;
      if (particleTimer > 30) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        const endNode = nodes[Math.floor(Math.random() * nodes.length)];
        if (startNode !== endNode) {
          const particle = new DataParticle(startNode.x, startNode.y, endNode.x, endNode.y);
          dataParticles.push(particle);
        }
        particleTimer = 0;
      }

      // Update and draw data particles
      dataParticles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        
        if (particle.life <= 0) {
          dataParticles.splice(index, 1);
        }
      });

      // Add grid overlay
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
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
  }, [bucket]);

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
      <div style={{ position: 'relative', zIndex: 1, height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        {messageMap[bucket](domainName)}
        <div className="arrow" style={{ marginTop: '30px' }}>↓</div>
      </div>
    </section>
  );
};

export default ReferrerSlide;
