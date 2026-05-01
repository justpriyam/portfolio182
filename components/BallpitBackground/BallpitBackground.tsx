'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  highlightAngle: number;
}

export interface BallpitBackgroundProps {
  count?: number;
  gravity?: number;
  friction?: number;
  followCursor?: boolean;
  colors?: string[];
  className?: string;
}

export default function BallpitBackground({
  count = 120,
  gravity = 0.3,
  friction = 0.997,
  followCursor = true,
  colors = ['#00FFC8', '#BA50FF', '#FF00B8'],
  className = '',
}: BallpitBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const createBalls = useCallback(
    (width: number, height: number) => {
      const balls: Ball[] = [];
      for (let i = 0; i < count; i++) {
        const radius = 4 + Math.random() * 14;
        balls.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.3 + Math.random() * 0.5,
          highlightAngle: Math.random() * Math.PI * 2,
        });
      }
      return balls;
    },
    [count, colors]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const setSize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    setSize();
    ballsRef.current = createBalls(width, height);

    const resizeObserver = new ResizeObserver(() => {
      setSize();
    });
    resizeObserver.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    if (followCursor) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Helper to parse hex color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 };
    };

    // Draw a 3D shining ball using radial gradients
    const draw3DBall = (ball: Ball) => {
      const { x, y, radius, color, opacity } = ball;
      const rgb = hexToRgb(color);

      ctx.globalAlpha = opacity;

      // 1. Main body gradient (dark edge → bright center-ish)
      const bodyGrad = ctx.createRadialGradient(
        x - radius * 0.3,
        y - radius * 0.3,
        radius * 0.1,
        x,
        y,
        radius
      );
      bodyGrad.addColorStop(0, `rgba(${Math.min(rgb.r + 80, 255)}, ${Math.min(rgb.g + 80, 255)}, ${Math.min(rgb.b + 80, 255)}, 1)`);
      bodyGrad.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
      bodyGrad.addColorStop(1, `rgba(${Math.max(rgb.r - 60, 0)}, ${Math.max(rgb.g - 60, 0)}, ${Math.max(rgb.b - 60, 0)}, 0.8)`);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 2. Specular highlight (top-left bright spot)
      const highlightGrad = ctx.createRadialGradient(
        x - radius * 0.35,
        y - radius * 0.35,
        radius * 0.05,
        x - radius * 0.2,
        y - radius * 0.2,
        radius * 0.6
      );
      highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      highlightGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
      highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = highlightGrad;
      ctx.fill();

      // 3. Outer glow
      ctx.shadowColor = color;
      ctx.shadowBlur = radius * 2;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.globalAlpha = 1;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const balls = ballsRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];

        // Gravity
        ball.vy += gravity * 0.1;

        // Cursor repulsion
        if (followCursor && mouse.x > 0 && mouse.y > 0) {
          const dx = ball.x - mouse.x;
          const dy = ball.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            ball.vx += (dx / dist) * force * 1.5;
            ball.vy += (dy / dist) * force * 1.5;
          }
        }

        // Friction
        ball.vx *= friction;
        ball.vy *= friction;

        // Position update
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Boundary collisions
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx *= -0.6;
        }
        if (ball.x + ball.radius > width) {
          ball.x = width - ball.radius;
          ball.vx *= -0.6;
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy *= -0.6;
        }
        if (ball.y + ball.radius > height) {
          ball.y = height - ball.radius;
          ball.vy *= -0.5;
          // Small random bounce to keep things alive
          if (Math.abs(ball.vy) < 0.5) {
            ball.vy = -(1 + Math.random() * 2);
          }
        }

        // Simple ball-ball collision (only nearby)
        for (let j = i + 1; j < balls.length; j++) {
          const other = balls[j];
          const ddx = other.x - ball.x;
          const ddy = other.y - ball.y;
          const dDist = Math.sqrt(ddx * ddx + ddy * ddy);
          const minDist = ball.radius + other.radius;

          if (dDist < minDist && dDist > 0) {
            const overlap = (minDist - dDist) / 2;
            const nx = ddx / dDist;
            const ny = ddy / dDist;

            ball.x -= nx * overlap;
            ball.y -= ny * overlap;
            other.x += nx * overlap;
            other.y += ny * overlap;

            // Exchange velocities
            const dvx = ball.vx - other.vx;
            const dvy = ball.vy - other.vy;
            const dotProduct = dvx * nx + dvy * ny;

            ball.vx -= dotProduct * nx * 0.5;
            ball.vy -= dotProduct * ny * 0.5;
            other.vx += dotProduct * nx * 0.5;
            other.vy += dotProduct * ny * 0.5;
          }
        }

        // Draw 3D shining ball
        draw3DBall(ball);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      if (followCursor) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [createBalls, gravity, friction, followCursor]);

  // Re-create balls when colors change
  useEffect(() => {
    if (containerRef.current && ballsRef.current.length > 0) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      ballsRef.current = createBalls(width, height);
    }
  }, [colors, createBalls]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
