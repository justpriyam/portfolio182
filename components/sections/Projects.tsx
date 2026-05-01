'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Server, Shield, Cpu, Hand, X, Sparkles } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import BallpitBackground from '../BallpitBackground/BallpitBackground';

interface Project {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  previewImage: string;
}

const projects: Project[] = [
  {
    title: 'AyuNet Telemedicine Platform',
    description:
      'Full-stack telemedicine platform with AI-based symptom analysis, role-based portals (Patient, Doctor, Admin), and video consultation. Designed normalized SQL schemas and scalable backend workflows for consultations.',
    icon: Server,
    gradient: 'from-cyan-500/20 to-blue-500/20',
    tech: ['React', 'Node.js', 'MySQL', 'AI/ML', 'TypeScript', 'WebRTC'],
    githubUrl: 'https://github.com/justpriyam/AyuNet_telemedicine.git',
    liveUrl: 'https://v0-ayunet-telemedicien.vercel.app/',
    previewImage: '/images/projects/ayunet.png',
  },
  {
    title: 'Source Code Plagiarism Detector',
    description:
      'A Turnitin-style compiler-based project analyzing source code using C and Lex. Applied lexical analysis, token comparison, and syntax-based similarity detection with AST-driven fingerprinting.',
    icon: Shield,
    gradient: 'from-purple-500/20 to-pink-500/20',
    tech: ['C', 'Lex', 'Compiler Design', 'Python'],
    githubUrl: 'https://github.com/justpriyam',
    previewImage: '/images/projects/plagiarism.png',
  },
  {
    title: 'Multithreaded Web Server',
    description:
      'Java-based HTTP server utilizing socket programming and multithreading to drastically improve request throughput via concurrent client handling with thread pool management.',
    icon: Cpu,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    tech: ['Java', 'Socket Programming', 'Multithreading'],
    githubUrl: 'https://github.com/justpriyam',
    previewImage: '/images/projects/webserver.png',
  },
  {
    title: 'Gesture Pointer',
    description:
      'Computer vision system built with Python and OpenCV to control mouse operations using real-time hand gesture recognition and landmark detection.',
    icon: Hand,
    gradient: 'from-amber-500/20 to-orange-500/20',
    tech: ['Python', 'OpenCV', 'Computer Vision'],
    githubUrl: 'https://github.com/justpriyam',
    previewImage: '/images/projects/gesture.png',
  },
];

/* ===== Pastel ball colors for the bottom decoration ===== */
const pastelBallColors = [
  '#a7c7e7', // soft blue
  '#f4c2c2', // soft pink
  '#b5ead7', // soft teal
  '#d4a5e5', // soft lavender
  '#ffd1a9', // soft peach
  '#c9e4de', // soft mint
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <>
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative group rounded-2xl overflow-hidden h-full glass-card"
      >
        {/* Gradient glow on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Preview Image */}
        <div
          className="relative w-full h-44 sm:h-48 overflow-hidden cursor-pointer"
          onClick={() => setShowPreview(true)}
        >
          <Image
            src={project.previewImage}
            alt={`${project.title} preview`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1836] via-transparent to-transparent" />

          {/* Expand hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-black/60 text-white backdrop-blur-sm border border-white/10">
              Click to preview
            </span>
          </div>
        </div>

        <div className="relative p-6 flex flex-col flex-1">
          {/* Top Row: Icon + Links */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex p-2.5 rounded-xl w-fit bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-500/10 transition-colors duration-300">
              <project.icon size={20} />
            </div>
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
                >
                  <Github size={16} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed flex-1 text-slate-400">
            {project.description}
          </p>

          {/* Tech Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-1 rounded-md text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/15"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Full-screen preview modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setShowPreview(false)}
              className="absolute top-6 right-6 z-[110] p-3 rounded-xl cursor-pointer bg-slate-800/80 text-white hover:bg-slate-700"
            >
              <X size={20} />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-[105] max-w-4xl w-full rounded-2xl overflow-hidden border border-slate-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={project.previewImage}
                alt={`${project.title} full preview`}
                width={1200}
                height={675}
                className="w-full h-auto"
              />
              <div className="p-6 bg-slate-900/95 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{project.description}</p>
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                    >
                      <Github size={16} /> View Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
                    >
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative py-24 sm:py-32 bg-primary"
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <SectionHeading
            badge="Featured Projects"
            title="Things I've"
            highlight="Built"
            subtitle="A selection of projects that showcase my skills and passion for building."
            badgeColor="purple"
          />

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ===== Softer Pastel 3D Balls Decoration ===== */}
      <div className="relative h-48 sm:h-64 mt-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <BallpitBackground
            count={80}
            gravity={0.15}
            friction={0.998}
            followCursor={true}
            colors={pastelBallColors}
          />
        </motion.div>

        {/* Fade-in gradient from top */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#050816] to-transparent pointer-events-none z-10" />

        {/* Centered sparkle text */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/5"
          >
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-xs font-medium text-slate-400">
              More projects on GitHub
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
