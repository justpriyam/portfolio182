'use client';

import { motion } from 'framer-motion';
import { Users, Mic2, Briefcase, Rocket, Heart, Trophy, Award, BookOpen } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

interface ExperienceItem {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: 'leadership' | 'achievement';
}

const experiences: ExperienceItem[] = [
  {
    title: 'WordWhips Club — Lead Organizer',
    description:
      'Lead organizer for the MUNERA 2.0 Model United Nations conference (April 25–26, 2026), managing event logistics and design. Also served as Head of Design for technical projects.',
    icon: Users,
    color: 'cyan',
    category: 'leadership',
  },
  {
    title: 'Competitive Programming',
    description:
      'Solved 250+ problems on LeetCode; active on Codeforces and HackerRank.',
    icon: Trophy,
    color: 'amber',
    category: 'achievement',
  },
  {
    title: 'Student Placement Committee (GEHU)',
    description: 'Head. Coordinated placement operations for 500+ students.',
    icon: Briefcase,
    color: 'blue',
    category: 'leadership',
  },
  {
    title: 'Hackathon Finalist',
    description:
      'Finalist at Tech Aarambh 2.0 National Hackathon. Participated in SIH Internal, NASA Space Apps, Astroverse, and Unstop (Tata Steel, Reliance, NETC).',
    icon: Award,
    color: 'purple',
    category: 'achievement',
  },
  {
    title: 'Astroverse Club — Managing Director',
    description:
      'Organized workshops and university-level hackathons.',
    icon: Rocket,
    color: 'emerald',
    category: 'leadership',
  },
  {
    title: 'University Events — Official Anchor',
    description: 'Official anchor/host for the university Alumni Meet session.',
    icon: Mic2,
    color: 'rose',
    category: 'leadership',
  },
  {
    title: 'Certifications',
    description:
      'AWS Cloud Practitioner Essentials, AWS Cloud Quest, NPTEL (DSA, DBMS, Cloud, AI), IBM Python for Data Science & GenAI.',
    icon: BookOpen,
    color: 'amber',
    category: 'achievement',
  },
  {
    title: 'NSS Volunteer — 3 Years',
    description:
      '3 years of active contribution to social awareness, educational outreach, and cleanliness drives.',
    icon: Heart,
    color: 'rose',
    category: 'leadership',
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', dot: 'bg-cyan-400' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', dot: 'bg-purple-400' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-400' },
};

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-24 sm:py-32 bg-primary"
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Experience & Impact"
          title="Beyond"
          highlight="Code"
          subtitle="Leadership roles, competitive achievements, and certifications."
          badgeColor="amber"
        />

        {/* Timeline */}
        <div className="relative mt-12">
          {/* Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px timeline-line md:-translate-x-px" />

          {experiences.map((item, index) => {
            const colors = colorMap[item.color] || colorMap.cyan;
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex items-start mb-8 md:mb-12 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-slate-900 z-10 mt-1.5">
                  <div className={`w-full h-full rounded-full ${colors.dot}`} />
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] rounded-2xl p-5 sm:p-6 glass-card hover:border-slate-700/60 ${
                    isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}
                >
                  {/* Category Badge */}
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider mb-3 ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {item.category}
                  </span>

                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 p-2 rounded-xl ${colors.bg}`}>
                      <item.icon size={18} className={colors.text} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-white mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
