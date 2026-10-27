import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { 
  X, 
  Check, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  FileText, 
  Layers, 
  Instagram, 
  Phone, 
  User 
} from 'lucide-react';
import { ModuleTemplate, Quote, ServiceModule } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { PredefinedPlan } from './plan-cards.component';
import { CustomCheckbox } from '../../../shared/components/custom-checkbox.component';

interface CustomBuilderModalProps {
  initialPlan?: PredefinedPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onGeneratedQuote: (slug: string) => void;
}

export const CustomBuilderModalComponent: React.FC<CustomBuilderModalProps> = ({
  initialPlan,
  isOpen,
  onClose,
  onGeneratedQuote,
}) => {
  const [availableTemplates, setAvailableTemplates] = useState<ModuleTemplate[]>(() => CatalogService.getActiveTemplates());

  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(() => {
    if (initialPlan) return initialPlan.includedModuleIds;
    return ['tpl-config', 'tpl-diseno', 'tpl-audiovisual'];
  });

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAvailableTemplates(CatalogService.getActiveTemplates());
      if (initialPlan) {
        setSelectedModuleIds(initialPlan.includedModuleIds);
      }
    }
  }, [isOpen, initialPlan]);

  const toggleModule = (id: string) => {
    if (selectedModuleIds.includes(id)) {
      if (selectedModuleIds.length > 1) {
        setSelectedModuleIds(selectedModuleIds.filter((m) => m !== id));
      }
    } else {
      setSelectedModuleIds([...selectedModuleIds, id]);
    }
  };

  // Módulos seleccionados
  const chosenTemplates = availableTemplates.filter((t) => selectedModuleIds.includes(t.id));
  const listPrice = chosenTemplates.reduce((acc, t) => acc + t.suggestedPrice, 0);
  const discountAmount = Math.round(listPrice * 0.5);
  const promoMonthlyPrice = listPrice - discountAmount;

  const handleGenerateQuote = () => {
    if (!clientName.trim()) {
      alert('Por favor ingresa tu nombre o el de tu negocio.');
      return;
    }

    setIsSubmitting(true);
    const slug = QuotesService.slugify(clientName);

    const modules: ServiceModule[] = chosenTemplates.map((t, idx) => ({
      id: `mod-${Date.now()}-${idx}`,
      title: t.title,
      subtitle: t.subtitle,
      price: t.suggestedPrice,
      deliverables: [...t.deliverables],
    }));

    const quote: Quote = {
      id: `quote-${Date.now()}`,
      slug,
      clientName: clientName.trim(),
      clientCategory: 'Cliente Preferencial',
      serviceTitle: initialPlan?.name || 'Gestión Digital Integral & Social Media',
      serviceSubtitle: 'Propuesta Mensual Personalizada',
      createdAt: Date.now(),
      status: 'SENT',
      modules,
      pricing: {
        listPrice,
        applyDiscount: true,
        discountTitle: 'Bonificación Especial de Bienvenida',
        discountPercentage: 50,
        discountDurationMonths: 6,
        discountAmount,
        finalMonthlyPrice: promoMonthlyPrice,
      },
      terms: [
        'Los insumos gráficos (fotos, videos en alta calidad y logotipos) deben ser proporcionados a tiempo por el cliente para mantener el cronograma de entregas.',
        'La bonificación del 50% es válida exclusivamente durante los primeros 6 meses consecutivos. A partir del séptimo mes se aplicará la tarifa estándar vigente.',
        'Los pagos de los abonos mensuales se efectúan por adelantado del 1 al 10 de cada mes mediante transferencia bancaria.',
      ],
    };

    QuotesService.saveQuote(quote);
    setIsSubmitting(false);
    onClose();
    onGeneratedQuote(slug);
  };

  const handleWhatsAppContact = () => {
    const modulesText = chosenTemplates.map((t) => `• ${t.title}`).join('\n');
    const msg = `¡Hola! Me interesa contratar el servicio de Gestión Digital & Social Media.\n\n*Negocio:* ${clientName || 'A definir'}\n*Instagram:* ${instagram || 'No especificado'}\n*Módulos seleccionados:*\n${modulesText}\n\n*Total estimado con 50% OFF:* ${QuotesService.formatCurrency(promoMonthlyPrice)}/mes (por 6 meses).\n\n¿Cómo podemos coordinar para comenzar?`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block font-heading">
              Configurador de Servicios
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Personaliza tu Plan de Gestión Digital
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Módulos Selector */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-800 uppercase tracking-wider block">
            1. Selecciona los servicios que deseas incluir:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableTemplates.map((tpl) => {
              const isSelected = selectedModuleIds.includes(tpl.id);
              return (
                <div
                  key={tpl.id}
                  onClick={() => toggleModule(tpl.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 text-slate-900 ring-1 ring-blue-600/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <CustomCheckbox
                    checked={isSelected}
                    onChange={() => toggleModule(tpl.id)}
                    size="md"
                    variant="brand"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-bold block text-slate-900">{tpl.title}</span>
                    <span className="text-xs text-blue-700 font-bold font-heading block mt-0.5">
                      {QuotesService.formatCurrency(tpl.suggestedPrice)}/mes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen de Precios */}
        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div>
            <span className="text-slate-500 line-through block text-xs font-medium">
              Precio de Lista: {QuotesService.formatCurrency(listPrice)}/mes
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-black text-slate-900 font-heading">
                {QuotesService.formatCurrency(promoMonthlyPrice)}
              </span>
              <span className="text-slate-600 font-medium">/mes</span>
            </div>
            <span className="text-xs text-blue-700 font-bold block mt-1">
              50% OFF Aplicado (Ahorras {QuotesService.formatCurrency(discountAmount)}/mes por 6 meses)
            </span>
          </div>
          <span className="text-xs text-slate-500 sm:text-right font-medium">
            {chosenTemplates.length} servicios incluidos • Sin contratos forzosos
          </span>
        </div>

        {/* Formulario de Contacto */}
        <div className="space-y-3 pt-2">
          <label className="text-sm font-bold text-slate-800 uppercase tracking-wider block">
            2. Tus datos para generar la propuesta:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tu Negocio o Nombre *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Estudio Dental"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp de Contacto</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+54 9 11..."
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Usuario de Instagram</label>
              <div className="relative">
                <Instagram className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="@tunegocio"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleWhatsAppContact}
            className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm rounded-xl border border-emerald-200 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Consultar por WhatsApp</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGenerateQuote}
            disabled={isSubmitting || !clientName.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-sm shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generar Propuesta Oficial A4</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>,
document.body
  );
};
