"use client";

import { useEffect, useRef } from "react";

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Responsive Canvas Resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Particle Constructor
    const particlesArray: Particle[] = [];
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Bounce off edges
        if (canvas) {
          if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
          }
          if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
          }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    const init = () => {
      particlesArray.length = 0;
      const numberOfParticles = Math.min((canvas.height * canvas.width) / 10000, 100); 
      for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 2) + 0.5; // very subtle
        const x = Math.random() * innerWidth;
        const y = Math.random() * innerHeight;
        const directionX = (Math.random() - 0.5) * 1.5;
        const directionY = (Math.random() - 0.5) * 1.5;
        // Esports teal with extreme transparency
        const color = "rgba(0, 196, 180, 0.4)";

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear entire canvas
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
        }
      }
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,           // Behind the content
        pointerEvents: "none", // Prevent click blocking
      }}
    />
  );
}
