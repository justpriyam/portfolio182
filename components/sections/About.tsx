'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Code2, Award, Download, FileText, Sparkles } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import JourneyModal from './JourneyModal';

const stats = [
  { icon: GraduationCap, label: 'GPA', value: '8.65/10.0', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: MapPin, label: 'University', value: 'GEHU Bhimtal', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Code2, label: 'Focus', value: 'Backend & Full-Stack', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Award, label: 'Problems', value: '250+ Solved', color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

export default function About() {
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      <section id="about" className="relative py-24 sm:py-32 bg-primary">
        <div className="section-divider absolute top-0 left-0 right-0" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <SectionHeading
              badge="About Me"
              title="Who I"
              highlight="Am"
              badgeColor="purple"
            />

            {/* Self Overview Card */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-2xl p-8 sm:p-10 mb-8 mt-8 glass-card"
            >
              <p className="text-lg leading-relaxed mb-5 text-secondary">
                Priyam Gupta is a dedicated <span className="text-cyan-400 font-medium">Backend & Full-Stack Developer</span> with a strong foundation in cloud computing, concurrent systems, and compiler-based applications. Currently pursuing a B.Tech in Computer Science Engineering at Graphic Era Hill University, Bhimtal Campus, he maintains a GPA of 8.65/10.0 while actively contributing to multiple technical and leadership roles.
              </p>
              <p className="text-base leading-relaxed mb-5 text-slate-400">
                His expertise spans <span className="text-white/80">Java, Python, C/C++, and TypeScript</span>, with hands-on experience building scalable REST APIs, AI-driven diagnostic tools, and compiler-inspired code analysis systems. Priyam has designed full-stack telemedicine platforms, multithreaded HTTP servers, and gesture-controlled interfaces — demonstrating versatility across web development, systems programming, and computer vision.
              </p>
              <p className="text-base leading-relaxed mb-6 text-slate-400">
                Beyond code, he leads the <span className="text-white/80">Student Placement Committee</span> (coordinating placements for 500+ students), serves as Managing Director of the Astroverse Club, and has been a finalist at Tech Aarambh 2.0 National Hackathon. He holds certifications from <span className="text-white/80">AWS, NPTEL, and IBM</span>, and has contributed 3 years to the National Service Scheme.
              </p>

              {/* Action Row */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  onClick={() => setIsJourneyOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-300 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <Sparkles size={16} className="group-hover:scale-110 transition-transform" />
                  Explore My Journey
                </motion.button>

                <motion.a
                  href="/resume/Priyam_Gupta_Resume.pdf"
                  download="Priyam_Gupta_Resume.pdf"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 border border-purple-500/20 hover:border-purple-500/40"
                >
                  <FileText size={16} className="group-hover:scale-110 transition-transform" />
                  View Resume
                </motion.a>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative group rounded-xl p-5 text-center glass-card hover:border-cyan-500/20 hover-lift"
                >
                  <div className={`inline-flex p-2.5 rounded-xl mb-2.5 ${stat.bg}`}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <p className="text-[10px] font-medium tracking-wider uppercase mb-1 text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-base font-bold text-white">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <JourneyModal isOpen={isJourneyOpen} onClose={() => setIsJourneyOpen(false)} />
    </>
  );
}
