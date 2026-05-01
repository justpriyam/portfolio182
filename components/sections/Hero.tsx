'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Download, Github, Linkedin, Instagram, ChevronDown } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';

const StarsCanvas = dynamic(() => import('@/components/3d/StarsCanvas'), {
  ssr: false,
});

const roles = [
  'Computer Science Engineering Undergraduate',
  'Backend & Full-Stack Developer',
  'Innovator',
];

export default function Hero() {
  const displayText = useTypewriter(roles);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary"
    >
      {/* ===== 3D Star Particles Background ===== */}
      <StarsCanvas />

      {/* Subtle color orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl animate-float bg-cyan-500/8" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl animate-float-slow bg-purple-500/8" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting Tag */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Welcome to my portfolio
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white"
        >
          Hi, I&apos;m{' '}
          <span className="gradient-text">Priyam Gupta.</span>
        </motion.h1>

        {/* Typewriter Subtitle */}
        <motion.div
          variants={itemVariants}
          className="mb-8 h-8 flex items-center justify-center"
        >
          <p className="text-lg sm:text-xl font-medium text-secondary">
            <span>{displayText}</span>
            <span className="typewriter-cursor" />
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="/resume/Priyam_Gupta_Resume.pdf"
            download="Priyam_Gupta_Resume.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm border border-slate-700 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-all duration-300"
          >
            <Download
              size={18}
              className="group-hover:-translate-y-0.5 transition-transform"
            />
            Download Resume
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3"
        >
          {[
            { icon: Github, href: 'https://github.com/justpriyam', label: 'GitHub' },
            { icon: Linkedin, href: 'https://www.linkedin.com/in/priyam-gupta-a944772b5/', label: 'LinkedIn' },
            { icon: Instagram, href: 'https://www.instagram.com/justttalok/', label: 'Instagram' },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-slate-800/60 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
              title={social.label}
            >
              <social.icon size={22} />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={24} className="text-slate-600" />
      </motion.div>
    </section>
  );
}
