'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CardSwap, Card } from '@/components/CardSwap/CardSwap';

interface CampusCard {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
}

const campusCards: CampusCard[] = [
  {
    id: 1,
    title: 'Graphic Era Hill University',
    description: 'Bhimtal Campus, where I pursue my B.Tech in CSE.',
    imageSrc: '/images/campus/517ERg9k-gehu-btl-2-1-jpeg',
  },
  {
    id: 2,
    title: 'Campus View',
    description: 'Scenic views and greenery around the university.',
    imageSrc: '/images/campus/bhimtal-gallery-7.webp',
  },
  {
    id: 3,
    title: 'Lab Facilities',
    description: 'Modern computing labs and cloud-ready infrastructure.',
    imageSrc: '/images/campus/WhatsApp Image 2026-05-01 at 1.04.12 PM.jpeg',
  },
];

interface CampusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CampusModal({ isOpen, onClose }: CampusModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEsc]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-[110] p-3 rounded-xl cursor-pointer transition-colors bg-slate-800/80 text-white hover:bg-slate-700"
          >
            <X size={20} />
          </motion.button>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="absolute top-8 left-0 right-0 text-center z-[110]"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Graphic Era Hill University
            </h2>
            <p className="text-sm text-white/60 mt-1">Bhimtal Campus</p>
          </motion.div>

          {/* CardSwap container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[105]"
          >
            {/* Responsive sizing: smaller on mobile, larger on desktop */}
            <div className="block sm:hidden">
              <CardSwap
                width={300}
                height={220}
                cardDistance={30}
                verticalDistance={30}
                delay={4000}
                pauseOnHover
                skewAmount={4}
                easing="elastic"
              >
                {campusCards.map((card) => (
                  <Card key={card.id} className="p-0 overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        src={card.imageSrc}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-base font-semibold text-white">
                          {card.title}
                        </h3>
                        <p className="text-xs text-white/70 mt-0.5">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>

            <div className="hidden sm:block lg:hidden">
              <CardSwap
                width={420}
                height={300}
                cardDistance={45}
                verticalDistance={45}
                delay={4000}
                pauseOnHover
                skewAmount={5}
                easing="elastic"
              >
                {campusCards.map((card) => (
                  <Card key={card.id} className="p-0 overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        src={card.imageSrc}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-lg font-semibold text-white">
                          {card.title}
                        </h3>
                        <p className="text-sm text-white/70 mt-1">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>

            <div className="hidden lg:block">
              <CardSwap
                width={550}
                height={380}
                cardDistance={55}
                verticalDistance={55}
                delay={4000}
                pauseOnHover
                skewAmount={5}
                easing="elastic"
              >
                {campusCards.map((card) => (
                  <Card key={card.id} className="p-0 overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        src={card.imageSrc}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-semibold text-white">
                          {card.title}
                        </h3>
                        <p className="text-sm text-white/70 mt-1">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-0 right-0 text-center text-xs text-white/40 z-[110]"
          >
            Press ESC or click outside to close · Hover to pause
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
