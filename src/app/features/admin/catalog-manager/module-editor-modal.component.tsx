import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { ModuleTemplate } from '../../../core/models/quote.model';
import { CustomCheckbox } from '../../../shared/components/custom-checkbox.component';

interface ModuleEditorModalProps {
  template?: ModuleTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: ModuleTemplate) => void;
}

export const ModuleEditorModalComponent: React.FC<ModuleEditorModalProps> = ({
  template,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState(80000);
  const [tag, setTag] = useState('Servicio');
  const [active, setActive] = useState(true);
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverableText, setNewDeliverableText] = useState('');

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setSubtitle(template.subtitle);
      setSuggestedPrice(template.suggestedPrice);
      setTag(template.tag || 'Servicio');
      setActive(template.active !== false);
      setDeliverables([...template.deliverables]);
    } else {
      setTitle('');
      setSubtitle('');
      setSuggestedPrice(75000);
      setTag('Servicio');
      setActive(true);
      setDeliverables(['Entregable principal garantizado dentro del mes.']);
    }
  }, [template, isOpen]);

  const handleAddDeliverable = () => {
    if (!newDeliverableText.trim()) return;
    setDeliverables([...deliverables, newDeliverableText.trim()]);
    setNewDeliverableText('');
  };

  const handleRemoveDeliverable = (idx: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedTemplate: ModuleTemplate = {
      id: template ? template.id : `tpl-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      suggestedPrice: Number(suggestedPrice) || 0,
      tag: tag.trim() || 'Servicio',
      active,
      deliverables: deliverables.length > 0 ? deliverables : ['Entregable mensual estipulado'],
    };

    onSave(savedTemplate);
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

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-lg">
              {template ? 'Editar Módulo a la Carta' : 'Nuevo Módulo a la Carta'}
            </h3>
            <p className="text-xs text-slate-400">
              Configura el alcance y precio base para la tienda y cotizador
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Título del Módulo *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Planificación & Diseño Gráfico"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Descripción / Subtítulo</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ej: Estrategia visual y contenidos estáticos para el feed."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoría / Etiqueta</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Ej: Diseño, Video, Setup, Ads"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Precio Sugerido ($)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={suggestedPrice}
                onChange={(e) => setSuggestedPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="pt-1">
            <CustomCheckbox
              checked={active}
              onChange={setActive}
              label="Módulo Activo"
              description="Visible inmediatamente en la Tienda pública y en el simulador de cotizaciones"
              variant="brand"
              size="md"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Entregables incluidos en este módulo</label>
            <div className="space-y-1.5 mb-2">
              {deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-700 text-xs">{item}</span>
                  <button type="button" onClick={() => handleRemoveDeliverable(idx)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDeliverableText}
                onChange={(e) => setNewDeliverableText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDeliverable(); } }}
                placeholder="Añadir entregable concreto..."
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              Cancelar
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Guardar Módulo
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>,
document.body
  );
};
