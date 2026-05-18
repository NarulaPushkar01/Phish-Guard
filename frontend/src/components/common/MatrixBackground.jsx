import React, { useEffect, useRef, useCallback } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Mouse interaction coordinates
    let mouse = { x: null, y: null, radius: 150 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Boundary check
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Collision detection with mouse
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;

          if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
          } else {
            if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 20;
            }
            if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 20;
            }
          }
        } else {
          // Normal slow movement if no mouse interaction
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
        }

        // Add regular slow movement drift
        this.x += this.directionX * 0.3;
        this.y += this.directionY * 0.3;
        this.baseX += this.directionX * 0.3;
        this.baseY += this.directionY * 0.3;

        this.draw();
      }
    }

    // Detect if light theme is active
    const isLightMode = () => document.body.classList.contains('light-theme');

    const init = () => {
      particles = [];
      // Calculate particle amount based on screen size to prevent lag
      let numberOfParticles = (canvas.width * canvas.height) / 12000;
      
      for (let i = 0; i < numberOfParticles; i++) {
        let light = isLightMode();
        // Bolder, larger particles for better visibility
        let size = light ? (Math.random() * 3) + 1.5 : (Math.random() * 2) + 0.5;
        let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        
        let color;
        if (light) {
          // Use deep, bold colors that pop on white/light backgrounds
          color = Math.random() > 0.5 
            ? 'rgba(5, 150, 105, 0.7)'   // deep emerald, high opacity
            : 'rgba(2, 132, 199, 0.6)';  // deep sky blue, high opacity
        } else {
          // Original neon colors for dark mode
          color = Math.random() > 0.5 
            ? 'rgba(0, 255, 136, 0.4)' 
            : 'rgba(0, 240, 255, 0.3)';
        }

        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    const connect = () => {
      let opacityValue = 1;
      const light = isLightMode();
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + 
                         ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
          
          if (distance < (canvas.width / 10) * (canvas.height / 10)) {
            opacityValue = 1 - (distance / 20000);
            if (light) {
              // Bold, visible connection lines for light mode
              ctx.strokeStyle = `rgba(5, 150, 105, ${opacityValue * 0.35})`;
              ctx.lineWidth = 1.5;
            } else {
              ctx.strokeStyle = `rgba(0, 255, 136, ${opacityValue * 0.15})`;
              ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
    };

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" 
      id="particle-canvas" 
    />
  );
};

export default ParticleBackground;
