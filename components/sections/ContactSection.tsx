'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  Download,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import BallpitBackground from '../BallpitBackground/BallpitBackground';
import JourneyModal from './JourneyModal';
import SectionHeading from '../ui/SectionHeading';

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/justpriyam',
    hoverColor: 'hover:text-cyan-400',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/priyam-gupta-a944772b5/',
    hoverColor: 'hover:text-cyan-400',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/justttalok/',
    hoverColor: 'hover:text-pink-400',
  },
];

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'priyamgupta183@gmail.com',
    href: 'mailto:priyamgupta183@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 8127217247',
    href: 'tel:+918127217247',
  },
  {
    icon: MapPin,
    label: 'Locations',
    value: 'Uttrakhand, India • GEHU Bhimtal Campus',
    href: null,
  },
];

const ballpitColors = ['#00FFC8', '#BA50FF', '#FF00B8'];

export default function ContactSection() {
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      <section
        id="contact"
        className="relative min-h-[700px] py-24 sm:py-32 overflow-hidden"
      >
        {/* Ballpit Background with 3D shining balls */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-primary" />
          <BallpitBackground
            count={130}
            gravity={0.3}
            friction={0.997}
            followCursor={true}
            colors={ballpitColors}
          />
        </div>

        {/* Section divider */}
        <div className="section-divider absolute top-0 left-0 right-0 z-10" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <SectionHeading
              badge="Get In Touch"
              title="Connect"
              highlight="With Me"
              subtitle="I'm always open to new opportunities, collaborations, and conversations."
            />

            {/* Main Card */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-8 sm:p-10 mt-8 bg-slate-900/70 border border-slate-800/60 backdrop-blur-md"
            >
              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {contactInfo.map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.03, y: -3 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group rounded-xl p-5 text-center bg-slate-800/50 border border-slate-700/40 hover:border-cyan-500/30"
                  >
                    <div className="inline-flex p-2.5 rounded-xl mb-3 bg-cyan-500/10 text-cyan-400">
                      <item.icon size={20} />
                    </div>
                    <p className="text-xs font-medium tracking-wider uppercase mb-1 text-slate-500">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm font-medium block truncate text-slate-300 hover:text-cyan-400 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-300">
                        {item.value}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Social Links & Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Social Icons */}
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-xl transition-all duration-300 bg-slate-800/60 text-slate-400 ${social.hoverColor} hover:bg-slate-800 hover:shadow-lg`}
                      title={social.label}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Journey Button */}
                  <motion.button
                    onClick={() => setIsJourneyOpen(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-300 bg-slate-800/60 text-slate-300 border border-slate-700/40 hover:border-cyan-500/30 hover:text-cyan-400"
                  >
                    <Sparkles size={16} />
                    Explore My Journey
                  </motion.button>

                  {/* Download Resume */}
                  <motion.a
                    href="/resume/Priyam_Gupta_Resume.pdf"
                    download="Priyam_Gupta_Resume.pdf"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35"
                  >
                    <Download
                      size={16}
                      className="group-hover:-translate-y-0.5 transition-transform"
                    />
                    Download Resume
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* Bottom accent */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-center"
            >
              <a
                href="https://github.com/justpriyam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium transition-colors text-slate-500 hover:text-cyan-400"
              >
                <ExternalLink size={12} />
                View my work on GitHub
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Journey Modal */}
      <JourneyModal
        isOpen={isJourneyOpen}
        onClose={() => setIsJourneyOpen(false)}
      />
    </>
  );
}
