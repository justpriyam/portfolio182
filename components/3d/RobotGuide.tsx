'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function RobotGuide() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollHint, setScrollHint] = useState('Scroll to explore ↓');
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springCfg = { stiffness: 120, damping: 20, mass: 0.5 };
  const eyeX = useSpring(mouseX, springCfg);
  const eyeY = useSpring(mouseY, springCfg);
  const headTilt = useSpring(0, { stiffness: 100, damping: 15 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const dx = (e.clientX - cx) / window.innerWidth;
    const dy = (e.clientY - (rect.top + rect.height / 2)) / window.innerHeight;
    mouseX.set(dx * 8);
    mouseY.set(dy * 5);
    headTilt.set(dx * 12);
  }, [mouseX, mouseY, headTilt]);

  useEffect(() => {
    const onScroll = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (p < 0.1) setScrollHint('Scroll to explore ↓');
      else if (p > 0.9) setScrollHint('Back to top ↑');
      else if (p > 0.5) setScrollHint('Almost there! ↓');
      else setScrollHint('Keep going ↓');
    };
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [handleMouseMove]);

  if (isMobile || !isVisible) return null;

  const handleClick = () => {
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (p > 0.9) window.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2 group cursor-pointer"
      onClick={handleClick}
    >
      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5 }}
        className="relative px-3 py-1.5 rounded-xl text-[10px] font-medium bg-slate-800/90 text-cyan-400 border border-slate-700/50 backdrop-blur-sm whitespace-nowrap shadow-lg"
      >
        {scrollHint}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800/90 border-r border-b border-slate-700/50 rotate-45" />
      </motion.div>

      {/* Robot SVG */}
      <motion.div style={{ rotate: headTilt }} className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-300">
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-lg">
          <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <line x1="32" y1="8" x2="32" y2="16" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="6" r="3" fill="#22d3ee" className="animate-pulse-glow" />
          </motion.g>
          <rect x="14" y="16" width="36" height="28" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <rect x="18" y="20" width="28" height="20" rx="5" fill="#0f172a" />
          <circle cx="26" cy="30" r="5" fill="#1e293b" />
          <motion.circle cx="26" cy="30" r="2.5" fill="#22d3ee" style={{ x: eyeX, y: eyeY }} />
          <motion.circle cx="27" cy="29" r="1" fill="white" style={{ x: eyeX, y: eyeY }} opacity="0.8" />
          <circle cx="38" cy="30" r="5" fill="#1e293b" />
          <motion.circle cx="38" cy="30" r="2.5" fill="#22d3ee" style={{ x: eyeX, y: eyeY }} />
          <motion.circle cx="39" cy="29" r="1" fill="white" style={{ x: eyeX, y: eyeY }} opacity="0.8" />
          <path d="M27 36 Q32 40 37 36" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="20" y="46" width="24" height="12" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <circle cx="32" cy="52" r="2" fill="#a855f7" className="animate-pulse-glow" />
          <motion.rect x="8" y="48" width="10" height="4" rx="2" fill="#334155" animate={{ rotate: [0, -5, 0, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} />
          <motion.rect x="46" y="48" width="10" height="4" rx="2" fill="#334155" animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
          <rect x="22" y="58" width="8" height="4" rx="2" fill="#334155" />
          <rect x="34" y="58" width="8" height="4" rx="2" fill="#334155" />
        </svg>
      </motion.div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-700 text-slate-400 text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 hover:text-white cursor-pointer"
      >
        ✕
      </button>
    </motion.div>
  );
}
