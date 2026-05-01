'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-12 bg-primary border-t border-slate-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com/justpriyam"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl transition-colors bg-slate-800/60 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/priyam-gupta-a944772b5/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl transition-colors bg-slate-800/60 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
            >
              <Linkedin size={20} />
            </motion.a>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          {/* Copyright */}
          <p className="text-sm flex items-center gap-1.5 text-slate-500">
            Built with <Heart size={14} className="text-red-400" fill="currentColor" /> by Priyam
            Gupta &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
