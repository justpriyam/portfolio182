'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  badge: string;
  title: string;
  highlight: string;
  subtitle?: string;
  badgeColor?: string;
}

export default function SectionHeading({
  badge,
  title,
  highlight,
  subtitle,
  badgeColor = 'cyan',
}: SectionHeadingProps) {
  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const badgeClasses = colorMap[badgeColor] || colorMap.cyan;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-4"
      >
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border ${badgeClasses}`}
        >
          {badge}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-4 text-white"
      >
        {title}{' '}
        <span className="gradient-text">{highlight}</span>
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm sm:text-base max-w-xl mx-auto mb-12 text-secondary"
        >
          {subtitle}
        </motion.p>
      )}
    </>
  );
}
