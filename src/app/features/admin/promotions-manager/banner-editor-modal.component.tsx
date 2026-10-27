import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Layers, 
  Sliders, 
  MessageCircle, 
  ExternalLink, 
  Image, 
  Check, 
  Palette 
} from 'lucide-react';
import { 
  PromotionalBanner, 
  BannerGradient, 
  BannerPlacement 
} from '../../../core/models/promotion.model';
import { PromotionsService } from '../../../core/services/promotions.service';
import { CustomCheckbox } from '../../../shared/components/custom-checkbox.component';
import { StorePromoBannerComponent } from '../../public/store/store-promo-banner.component';

export interface BannerEditorModalProps {
  isOpen: boolean;
  banner?: PromotionalBanner | null;
  defaultPlacement?: BannerPlacement;
  onClose: () => void;
  onSaved?: (banner: PromotionalBanner) => void;
}

const GRADIENT_OPTIONS: { value: BannerGradient; label: string; previewClass: string }[] = [
  { value: 'blue-indigo', label: 'Azul & Índigo (Tecnológico)', previewClass: 'from-blue-600 to-indigo-600' },
  { value: 'emerald-teal', label: 'Esmeralda & Verde (Éxito)', previewClass: 'from-emerald-600 to-teal-600' },
  { value: 'purple-pink', label: 'Púrpura & Rosa (Creativo)', previewClass: 'from-purple-600 to-pink-600' },
  { value: 'amber-orange', label: 'Ámbar & Naranja (Urgencia / Oferta)', previewClass: 'from-amber-500 to-orange-600' },
  { value: 'dark-slate', label: 'Modo Oscuro Elegante', previewClass: 'from-slate-900 to-blue-950' },
];

const PLACEMENT_OPTIONS: { value: BannerPlacement; label: string; desc: string }[] = [
  { value: 'STORE_HERO', label: 'Tienda Pública (Cabecera Superior)', desc: 'Se muestra bien arriba, justo después del título de la tienda.' },
  { value: 'STORE_BETWEEN_SECTIONS', label: 'Tienda Pública (Entre Paquetes y Módulos)', desc: 'Ideal para invitar a cotizar un combo a medida.' },
  { value: 'PORTAL_TOP', label: 'Portal Privado del Cliente', desc: 'Visible para clientes activos dentro de su panel de entregas.' },
];

export const BannerEditorModalComponent: React.FC<BannerEditorModalProps> = ({
  isOpen,
  banner,
  defaultPlacement = 'STORE_HERO',
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('🔥 PROMOCIÓN ESPECIAL');
  const [buttonText, setButtonText] = useState('Consultar por WhatsApp');
  const [actionType, setActionType] = useState<'whatsapp' | 'builder' | 'custom'>('whatsapp');
  const [customLink, setCustomLink] = useState('https://wa.me/');
  const [whatsappMessage, setWhatsappMessage] = useState('Hola! Quisiera consultar por la promoción para mi marca.');
  const [placement, setPlacement] = useState<BannerPlacement>(defaultPlacement);
  const [gradient, setGradient] = useState<BannerGradient>('blue-indigo');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);

  // Sync form state when modal opens or banner changes
  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setSubtitle(banner.subtitle);
      setBadge(banner.badge);
      setButtonText(banner.buttonText);
      setPlacement(banner.placement);
      setGradient(banner.gradient);
      setActive(banner.active);
      setImageUrl(banner.imageUrl || '');

      if (banner.buttonLink === 'builder') {
        setActionType('builder');
        setCustomLink('builder');
      } else if (banner.buttonLink.includes('wa.me') || banner.buttonLink.includes('whatsapp')) {
        setActionType('whatsapp');
        setCustomLink(banner.buttonLink);
        setWhatsappMessage(banner.whatsappMessage || '');
      } else {
        setActionType('custom');
        setCustomLink(banner.buttonLink);
      }
    } else {
      // New Banner defaults
      setTitle('');
      setSubtitle('');
      setBadge('🔥 PROMOCIÓN ESPECIAL');
      setButtonText('Consultar por WhatsApp');
      setActionType('whatsapp');
      setWhatsappMessage('Hola! Quisiera aprovechar la promoción de Gestión Digital para mi negocio.');
      setCustomLink('https://wa.me/?text=Hola!%20Quisiera%20aprovechar%20la%20promoci%C3%B3n');
      setPlacement(defaultPlacement);
      setGradient('blue-indigo');
      setImageUrl('');
      setActive(true);
    }
  }, [banner, isOpen, defaultPlacement]);

  // Handle action type toggle
  const handleActionTypeChange = (type: 'whatsapp' | 'builder' | 'custom') => {
    setActionType(type);
    if (type === 'builder') {
      setCustomLink('builder');
      if (buttonText === 'Consultar por WhatsApp' || !buttonText) {
        setButtonText('Abrir Cotizador a Medida');
      }
    } else if (type === 'whatsapp') {
      const encodedMsg = encodeURIComponent(whatsappMessage || 'Hola! Quisiera consultar por la promoción.');
      setCustomLink(`https://wa.me/?text=${encodedMsg}`);
      if (buttonText === 'Abrir Cotizador a Medida' || !buttonText) {
        setButtonText('Reclamar por WhatsApp');
      }
    } else {
      if (customLink === 'builder' || customLink.includes('wa.me')) {
        setCustomLink('https://');
      }
    }
  };

  const handleWhatsappMessageChange = (msg: string) => {
    setWhatsappMessage(msg);
    if (actionType === 'whatsapp') {
      setCustomLink(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalLink = customLink.trim();
    if (actionType === 'builder') {
      finalLink = 'builder';
    } else if (actionType === 'whatsapp') {
      finalLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage || title)}`;
    }

    const bannerToSave: PromotionalBanner = {
      id: banner?.id || `banner-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      badge: badge.trim(),
      buttonText: buttonText.trim(),
      buttonLink: finalLink,
      whatsappMessage: actionType === 'whatsapp' ? whatsappMessage : undefined,
      placement,
      gradient,
      imageUrl: imageUrl.trim() || undefined,
      active,
    };

    PromotionsService.saveBanner(bannerToSave);
    if (onSaved) onSaved(bannerToSave);
    onClose();
  };

  if (typeof document === 'undefined' || !isOpen) return null;

  // Temporary dummy banner for preview
  const previewBanner: PromotionalBanner = {
    id: 'preview',
    title: title || 'Título de tu Banner Promocional',
    subtitle: subtitle || 'Escribe aquí la descripción o beneficio que motivará al cliente a solicitar el servicio.',
    badge: badge || '🔥 PROMOCIÓN',
    buttonText: buttonText || 'Ver Más',
    buttonLink: customLink,
    placement,
    gradient,
    imageUrl: imageUrl.trim() || undefined,
    active: true,
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 14 }}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl leading-tight">
                {banner ? 'Editar Banner Promocional' : 'Crear Nuevo Banner para la Tienda'}
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Configura un banner llamativo con promociones, bonificaciones o llamados a la acción.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-7 space-y-6 text-xs sm:text-sm">
          {/* Ubicación y Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                ¿Dónde se mostrará este Banner?
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as BannerPlacement)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {PLACEMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {PLACEMENT_OPTIONS.find((p) => p.value === placement)?.desc}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Paleta / Estilo de Color
              </label>
              <select
                value={gradient}
                onChange={(e) => setGradient(e.target.value as BannerGradient)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {GRADIENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] text-slate-500">Muestra:</span>
                <span className={`h-3 w-16 rounded-full bg-gradient-to-r ${GRADIENT_OPTIONS.find((g) => g.value === gradient)?.previewClass}`} />
              </div>
            </div>
          </div>

          {/* Badge y Título */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Etiqueta / Badge
              </label>
              <input
                type="text"
                required
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej. 🔥 50% OFF"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Título Principal
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. ¡Lanzamiento de Temporada con Bonificación Exclusiva!"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 font-heading font-bold"
              />
            </div>
          </div>

          {/* Subtítulo / Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Descripción / Mensaje Explicativo
            </label>
            <textarea
              rows={2}
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ej. Contratando este mes te regalamos la puesta a punto de tu cuenta y 2 reels iniciales para arrancar con todo."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Acción del Botón */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Acción al Hacer Clic en el Botón
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleActionTypeChange('whatsapp')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  actionType === 'whatsapp'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700">
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp Directo</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Abre chat con mensaje pre-armado
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleActionTypeChange('builder')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  actionType === 'builder'
                    ? 'bg-blue-50 border-blue-300 text-blue-950 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700">
                  <Sliders className="w-4 h-4 shrink-0" />
                  <span>Cotizador Interactivo</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Abre simulador de combo a medida
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleActionTypeChange('custom')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  actionType === 'custom'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-700">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>Enlace Personalizado</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Abre otra web o URL externa
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  required
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Ej. Reclamar Beneficio"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              {actionType === 'whatsapp' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Mensaje inicial de WhatsApp
                  </label>
                  <input
                    type="text"
                    value={whatsappMessage}
                    onChange={(e) => handleWhatsappMessageChange(e.target.value)}
                    placeholder="Ej. Hola! Quiero reclamar la bonificación"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {actionType === 'custom' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    URL de Destino
                  </label>
                  <input
                    type="url"
                    required
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Imagen Opcional */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              URL de Imagen Ilustrativa (Opcional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... o enlace de tu imagen"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
              />
              <Image className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Podés dejar este campo vacío para usar el diseño con degradados modernos y ambient blobs.
            </p>
          </div>

          {/* Toggle Activo */}
          <div className="pt-1">
            <CustomCheckbox
              checked={active}
              onChange={(checked) => setActive(checked)}
              label="Publicar y hacer visible este banner inmediatamente"
              description="Si lo desmarcas, quedará guardado como borrador oculto."
              variant="brand"
              size="md"
            />
          </div>

          {/* Vista Previa en Vivo */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Vista Previa en Vivo del Banner:
              </span>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {PLACEMENT_OPTIONS.find((p) => p.value === placement)?.label}
              </span>
            </div>
            <div className="rounded-3xl border border-slate-200/80 p-2 bg-slate-100/50">
              <StorePromoBannerComponent banner={previewBanner} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{banner ? 'Guardar Cambios' : 'Añadir Banner a la Tienda'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};
