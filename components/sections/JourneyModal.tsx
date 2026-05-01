'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface JourneyItem {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  createdAt: string;
}

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JourneyModal({ isOpen, onClose }: JourneyModalProps) {
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch journey items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/journey');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {
      console.error('Failed to fetch journey items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, fetchItems]);

  // ESC handler
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showUpload) setShowUpload(false);
        else onClose();
      }
    },
    [onClose, showUpload]
  );

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleEsc]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Navigate gallery
  const goNext = () => setActiveIndex((p) => (p + 1) % items.length);
  const goPrev = () => setActiveIndex((p) => (p - 1 + items.length) % items.length);

  // Keep active index in bounds
  useEffect(() => {
    if (activeIndex >= items.length && items.length > 0) {
      setActiveIndex(items.length - 1);
    }
  }, [items.length, activeIndex]);

  // File selection handler
  const handleFileSelect = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      setToast({ type: 'error', message: 'Invalid file type. Use JPEG, PNG, WebP, GIF, or AVIF.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setToast({ type: 'error', message: 'File too large. Maximum 10MB.' });
      return;
    }
    setUploadFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // Upload
  const handleUpload = async () => {
    if (!uploadFile) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', uploadFile);
      formData.append('title', uploadTitle || 'Untitled Achievement');
      formData.append('description', uploadDesc);

      const res = await fetch('/api/journey', { method: 'POST', body: formData });

      if (res.ok) {
        const newItem = await res.json();
        setItems((prev) => [...prev, newItem]);
        setActiveIndex(items.length); // point to the new item
        resetUploadForm();
        setShowUpload(false);
        setToast({ type: 'success', message: 'Achievement uploaded successfully!' });
      } else {
        const err = await res.json();
        setToast({ type: 'error', message: err.error || 'Upload failed' });
      }
    } catch {
      setToast({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      const res = await fetch(`/api/journey?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setToast({ type: 'success', message: 'Removed successfully.' });
      } else {
        const err = await res.json();
        setToast({ type: 'error', message: err.error || 'Delete failed' });
      }
    } catch {
      setToast({ type: 'error', message: 'Delete failed. Please try again.' });
    } finally {
      setDeleting(null);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setPreviewUrl(null);
    setUploadTitle('');
    setUploadDesc('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currentItem = items[activeIndex];

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
            if (e.target === e.currentTarget && !showUpload) onClose();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          {/* Toast Notification */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl backdrop-blur-sm border ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
                    : 'bg-red-500/15 text-red-400 border-red-500/30 shadow-red-500/10'
                }`}
              >
                {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>

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

          {/* Title & Upload Button */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="absolute top-6 left-0 right-0 text-center z-[110] px-20"
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles size={20} className="text-amber-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                My Journey
              </h2>
              <Sparkles size={20} className="text-amber-400" />
            </div>
            <p className="text-sm text-white/50 mt-1.5">
              Achievements, milestones & memorable moments
            </p>
          </motion.div>

          {/* Add New Button (floating) */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            onClick={() => setShowUpload(true)}
            className="absolute top-6 left-6 z-[110] p-3 rounded-xl cursor-pointer transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
            title="Add Achievement"
          >
            <Plus size={20} />
          </motion.button>

          {/* Main Gallery Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[105] w-full max-w-3xl mx-auto px-4 mt-16"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-80 gap-4">
                <Loader2 size={36} className="text-cyan-400 animate-spin" />
                <p className="text-white/50 text-sm">Loading your journey...</p>
              </div>
            ) : items.length === 0 ? (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-80 gap-5"
              >
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/40">
                  <ImageIcon size={48} className="text-slate-600" />
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-lg font-medium">No achievements yet</p>
                  <p className="text-white/30 text-sm mt-1">
                    Click the + button to add your first milestone
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUpload(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                >
                  <Plus size={16} />
                  Add Your First Achievement
                </motion.button>
              </motion.div>
            ) : (
              /* Gallery view */
              <div className="flex flex-col items-center gap-6">
                {/* Main Image Display */}
                <div className="relative w-full aspect-[16/10] max-h-[55vh] rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-700/40 group">
                  <AnimatePresence mode="wait">
                    {currentItem && (
                      <motion.img
                        key={currentItem.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        src={currentItem.imagePath}
                        alt={currentItem.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </AnimatePresence>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Info overlay */}
                  {currentItem && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                        {currentItem.title}
                      </h3>
                      {currentItem.description && (
                        <p className="text-sm text-white/60">{currentItem.description}</p>
                      )}
                    </div>
                  )}

                  {/* Delete button (top-right of image) */}
                  {currentItem && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(currentItem.id)}
                      disabled={deleting === currentItem.id}
                      className="absolute top-3 right-3 p-2.5 rounded-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50"
                      title="Delete this achievement"
                    >
                      {deleting === currentItem.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </motion.button>
                  )}

                  {/* Navigation arrows */}
                  {items.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 text-white/80 hover:bg-black/70 hover:text-white backdrop-blur-sm"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 text-white/80 hover:bg-black/70 hover:text-white backdrop-blur-sm"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {items.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full scrollbar-hide">
                    {items.map((item, idx) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                          idx === activeIndex
                            ? 'border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                            : 'border-transparent opacity-50 hover:opacity-80'
                        }`}
                      >
                        <img
                          src={item.imagePath}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Counter */}
                <p className="text-xs text-white/30 font-medium">
                  {activeIndex + 1} / {items.length} achievements
                </p>
              </div>
            )}
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-6 left-0 right-0 text-center text-xs text-white/30 z-[110]"
          >
            Press ESC or click outside to close · Click + to add achievements
          </motion.p>

          {/* ── Upload Panel (slide-over) ── */}
          <AnimatePresence>
            {showUpload && (
              <>
                {/* Overlay for upload panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => { setShowUpload(false); resetUploadForm(); }}
                  className="absolute inset-0 bg-black/40 z-[115]"
                />

                <motion.div
                  initial={{ opacity: 0, x: -100, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed left-4 top-4 bottom-4 z-[120] w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-900/95 border border-slate-700/60 backdrop-blur-xl shadow-2xl overflow-y-auto"
                >
                  <div className="p-6">
                    {/* Panel header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-cyan-500/10">
                          <Upload size={18} className="text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Add Achievement</h3>
                      </div>
                      <button
                        onClick={() => { setShowUpload(false); resetUploadForm(); }}
                        className="p-2 rounded-lg cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative w-full h-48 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                        dragOver
                          ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02]'
                          : previewUrl
                          ? 'border-slate-600 bg-slate-800/30'
                          : 'border-slate-600/60 bg-slate-800/20 hover:border-slate-500 hover:bg-slate-800/30'
                      }`}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <div className={`p-3 rounded-xl transition-colors ${dragOver ? 'bg-cyan-500/20' : 'bg-slate-700/40'}`}>
                            <ImageIcon size={28} className={dragOver ? 'text-cyan-400' : 'text-slate-500'} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-300">
                              Drop image here or click to browse
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              JPEG, PNG, WebP, GIF · Max 10MB
                            </p>
                          </div>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                    </div>

                    {previewUrl && (
                      <button
                        onClick={resetUploadForm}
                        className="mt-2 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        Remove selected image
                      </button>
                    )}

                    {/* Title */}
                    <div className="mt-5">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                        Title
                      </label>
                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="e.g. Hackathon Winner, Dean's List..."
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-800/60 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                        Description
                      </label>
                      <textarea
                        value={uploadDesc}
                        onChange={(e) => setUploadDesc(e.target.value)}
                        placeholder="Brief description of this achievement..."
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-800/60 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
                      />
                    </div>

                    {/* Upload button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpload}
                      disabled={!uploadFile || uploading}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Achievement
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
