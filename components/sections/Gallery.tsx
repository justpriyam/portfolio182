'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

interface GalleryImage {
  src: string;
  title: string;
  description?: string;
}

const defaultImages: GalleryImage[] = [
  { src: '/images/priyam-formal-2.png', title: 'Professional', description: 'Formal headshot' },
  { src: '/images/priyam-formal-3.png', title: 'Conference', description: 'At a tech event' },
  { src: '/images/priyam-formal-4.png', title: 'Team Lead', description: 'Leading the team' },
  { src: '/images/priyam-formal-5.png', title: 'Campus Life', description: 'GEHU Bhimtal' },
  { src: '/images/priyam-outdoor.png', title: 'Outdoors', description: 'Exploring nature' },
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>(defaultImages);
  const [activeIndex, setActiveIndex] = useState(2);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, { src: url, title: file.name.split('.')[0], description: 'Uploaded' }]);
    });
    setShowUpload(false);
  };

  const goTo = (dir: 'prev' | 'next') => {
    setActiveIndex((i) => (dir === 'next' ? (i + 1) % images.length : (i - 1 + images.length) % images.length));
  };

  return (
    <section id="gallery" className="relative py-24 sm:py-32 bg-primary overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Gallery"
          title="Captured"
          highlight="Moments"
          subtitle="A collection of memories, events, and experiences."
          badgeColor="rose"
        />

        {/* Stack Card Carousel */}
        <div className="relative flex items-center justify-center h-[380px] sm:h-[440px] mt-8">
          {images.map((img, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            const isActive = index === activeIndex;

            if (absOffset > 2) return null;

            return (
              <motion.div
                key={img.src + index}
                className="absolute cursor-pointer"
                onClick={() => {
                  if (isActive) setLightboxOpen(true);
                  else setActiveIndex(index);
                }}
                animate={{
                  x: offset * 70,
                  scale: isActive ? 1 : 0.85 - absOffset * 0.05,
                  zIndex: 10 - absOffset,
                  rotateY: offset * -5,
                  opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.2,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                whileHover={isActive ? { scale: 1.03, y: -5 } : {}}
              >
                <div
                  className={`relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border transition-all duration-300 ${
                    isActive ? 'border-cyan-500/30 shadow-cyan-500/10' : 'border-slate-700/30'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-0 left-0 right-0 p-5"
                    >
                      <h4 className="text-base font-semibold text-white">{img.title}</h4>
                      {img.description && (
                        <p className="text-xs text-white/60 mt-0.5">{img.description}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goTo('prev')}
            className="p-2.5 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </motion.button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all cursor-pointer ${
                  i === activeIndex ? 'w-6 h-2 bg-cyan-400' : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goTo('next')}
            className="p-2.5 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40 cursor-pointer"
          >
            <ChevronRight size={18} />
          </motion.button>

          {/* Upload button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowUpload(!showUpload)}
            className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:border-purple-500/40 cursor-pointer ml-2"
            title="Add photos"
          >
            <ImagePlus size={18} />
          </motion.button>
        </div>

        {/* Upload Panel */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-6"
            >
              <div className="rounded-xl p-6 glass-card text-center">
                <p className="text-sm text-slate-400 mb-4">
                  Upload your photos to add them to the gallery
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  <ImagePlus size={16} />
                  Choose Images
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 z-[110] p-3 rounded-xl bg-slate-800/80 text-white hover:bg-slate-700 cursor-pointer"
            >
              <X size={20} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-[105] max-w-3xl w-full max-h-[80vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].title}
                width={900}
                height={600}
                className="w-full h-auto object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
