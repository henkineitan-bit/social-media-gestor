import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, MessageCircle, Sliders, ExternalLink, Edit3, Trash2, Image as ImageIcon } from 'lucide-react';
import { PromotionalBanner } from '../../../core/models/promotion.model';

interface StorePromoBannerProps {
  banner: PromotionalBanner;
  onOpenBuilder?: () => void;
  isAdmin?: boolean;
  onEdit?: (banner: PromotionalBanner) => void;
  onDelete?: (banner: PromotionalBanner) => void;
}

const GRADIENT_STYLES: Record<PromotionalBanner['gradient'], { bg: string; border: string; text: string; badge: string; btn: string }> = {
  'blue-indigo': {
    bg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white',
    border: 'border-blue-500/30',
    text: 'text-blue-100',
    badge: 'bg-white/20 text-white border-white/30 backdrop-blur-xs',
    btn: 'bg-white text-blue-900 hover:bg-blue-50 shadow-md',
  },
  'emerald-teal': {
    bg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white',
    border: 'border-emerald-500/30',
    text: 'text-emerald-100',
    badge: 'bg-white/20 text-white border-white/30 backdrop-blur-xs',
    btn: 'bg-white text-emerald-950 hover:bg-emerald-50 shadow-md',
  },
  'amber-orange': {
    bg: 'bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white',
    border: 'border-orange-500/30',
    text: 'text-orange-100',
    badge: 'bg-white/20 text-white border-white/30 backdrop-blur-xs',
    btn: 'bg-white text-orange-950 hover:bg-orange-50 shadow-md',
  },
  'purple-pink': {
    bg: 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-700 text-white',
    border: 'border-pink-500/30',
    text: 'text-pink-100',
    badge: 'bg-white/20 text-white border-white/30 backdrop-blur-xs',
    btn: 'bg-white text-purple-950 hover:bg-pink-50 shadow-md',
  },
  'dark-slate': {
    bg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white',
    border: 'border-slate-700',
    text: 'text-slate-300',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20',
  },
};

export const StorePromoBannerComponent: React.FC<StorePromoBannerProps> = ({
  banner,
  onOpenBuilder,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  if (!banner.active && !isAdmin) return null;

  const style = GRADIENT_STYLES[banner.gradient] || GRADIENT_STYLES['blue-indigo'];

  const handleClickAction = (e: React.MouseEvent) => {
    if (banner.buttonLink === 'builder' && onOpenBuilder) {
      e.preventDefault();
      onOpenBuilder();
    }
  };

  const isInternalBuilder = banner.buttonLink === 'builder';
  const isWhatsApp = banner.buttonLink.includes('wa.me') || banner.buttonLink.includes('whatsapp');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-lg ${style.bg} ${style.border} ${
        !banner.active ? 'opacity-60 grayscale-[30%] border-dashed border-amber-300' : ''
      }`}
    >
      {/* Decorative ambient blobs */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      {/* Admin Quick Action Pill on Store */}
      {isAdmin && (onEdit || onDelete) && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md text-xs">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider hidden sm:inline mr-1">
            Admin
          </span>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(banner)}
              className="px-2 py-0.5 text-white hover:text-amber-300 font-semibold flex items-center gap-1 rounded transition cursor-pointer"
              title="Editar este banner"
            >
              <Edit3 className="w-3 h-3" />
              <span>Editar</span>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(banner)}
              className="px-2 py-0.5 text-rose-300 hover:text-rose-100 font-semibold flex items-center gap-1 rounded transition cursor-pointer"
              title="Eliminar este banner"
            >
              <Trash2 className="w-3 h-3" />
              <span>Eliminar</span>
            </button>
          )}
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${style.badge}`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{banner.badge}</span>
            </span>
            {!banner.active && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                Oculto para Clientes
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-heading tracking-tight leading-snug">
            {banner.title}
          </h3>

          <p className={`text-sm sm:text-base leading-relaxed ${style.text}`}>
            {banner.subtitle}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-4">
          {banner.imageUrl && (
            <div className="hidden lg:block w-24 h-24 rounded-2xl overflow-hidden shadow-md border border-white/20 shrink-0">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {isInternalBuilder ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleClickAction}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer ${style.btn}`}
            >
              <Sliders className="w-4 h-4" />
              <span>{banner.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={banner.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer ${style.btn}`}
            >
              {isWhatsApp ? (
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              <span>{banner.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
