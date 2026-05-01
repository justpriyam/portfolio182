'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Code2,
  Cpu,
  FileCode2,
  Globe,
  Cloud,
  Wrench,
} from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const FloatingBall = dynamic(() => import('@/components/3d/FloatingBall'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse" />
    </div>
  ),
});

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: string[];
  color: string;
  accentHex: string;
  span?: string;
}

const categories: SkillCategory[] = [
  {
    title: 'Languages',
    icon: Code2,
    skills: ['Java', 'C', 'C++', 'Python', 'TypeScript', 'JavaScript'],
    color: 'cyan',
    accentHex: '#22d3ee',
    span: 'sm:col-span-2',
  },
  {
    title: 'Core CS',
    icon: Cpu,
    skills: ['Data Structures & Algorithms', 'OOP', 'Multithreading', 'DBMS', 'OS', 'Compiler Design'],
    color: 'purple',
    accentHex: '#a855f7',
    span: 'sm:col-span-2',
  },
  {
    title: 'Compiler Tools',
    icon: FileCode2,
    skills: ['Lex', 'Parsing Techniques', 'Semantic Analysis'],
    color: 'blue',
    accentHex: '#3b82f6',
  },
  {
    title: 'Web & Backend',
    icon: Globe,
    skills: ['Full-Stack Development', 'REST APIs', 'Authentication'],
    color: 'emerald',
    accentHex: '#10b981',
  },
  {
    title: 'Cloud & DB',
    icon: Cloud,
    skills: ['AWS EC2', 'S3', 'IAM', 'Cloud Practitioner Concepts', 'MySQL', 'MongoDB'],
    color: 'amber',
    accentHex: '#f59e0b',
    span: 'sm:col-span-2',
  },
  {
    title: 'Tools',
    icon: Wrench,
    skills: ['Git', 'GitHub', 'VS Code', 'IntelliJ IDEA'],
    color: 'rose',
    accentHex: '#f43f5e',
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
};

function TiltCard({ category }: { category: SkillCategory }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

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

  const colors = colorMap[category.color] || colorMap.cyan;

  return (
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
      className={`relative group rounded-2xl p-6 h-full cursor-default ${category.span || ''} glass-card hover:border-slate-700/60`}
      whileHover={{ translateZ: 10 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl ${colors.bg}`}>
          <category.icon size={20} className={colors.text} />
        </div>
        <h3 className="font-semibold text-base text-white">
          {category.title}
        </h3>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <motion.span
            key={skill}
            whileHover={{ scale: 1.08 }}
            className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/40 hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 bg-primary"
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <SectionHeading
            badge="Technical Skills"
            title="My"
            highlight="Toolkit"
            subtitle="Technologies and tools I work with to bring ideas to life."
          />

          {/* 3D Floating Balls - Desktop only */}
          <div className="hidden lg:flex flex-wrap justify-center gap-6 mb-16">
            {[
              { name: 'Java', icon: '/icons/java.svg', color: '#f89820' },
              { name: 'Python', icon: '/icons/python.svg', color: '#3776ab' },
              { name: 'TypeScript', icon: '/icons/typescript.svg', color: '#3178c6' },
              { name: 'React', icon: '/icons/react.svg', color: '#61dafb' },
              { name: 'Node.js', icon: '/icons/nodejs.svg', color: '#339933' },
              { name: 'AWS', icon: '/icons/aws.svg', color: '#ff9900' },
              { name: 'MongoDB', icon: '/icons/mongodb.svg', color: '#47a248' },
              { name: 'Git', icon: '/icons/git.svg', color: '#f05032' },
            ].map((tech) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 relative group"
                title={tech.name}
              >
                <FloatingBall icon={tech.icon} color={tech.color} />
                <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-500 group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                  {tech.name}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Bento Grid - All devices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.title}
                variants={itemVariants}
                className={cat.span || ''}
              >
                <TiltCard category={cat} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
