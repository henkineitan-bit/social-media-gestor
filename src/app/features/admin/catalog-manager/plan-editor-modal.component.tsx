import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { PredefinedPlan } from '../../../core/models/catalog.model';
import { CatalogService } from '../../../core/services/catalog.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { CustomCheckbox } from '../../../shared/components/custom-checkbox.component';

interface PlanEditorModalProps {
  plan?: PredefinedPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: PredefinedPlan) => void;
}

export const PlanEditorModalComponent: React.FC<PlanEditorModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [popular, setPopular] = useState(false);
  const [active, setActive] = useState(true);
  const [listPrice, setListPrice] = useState(300000);
  const [discountPct, setDiscountPct] = useState(50);
  const [promoMonths, setPromoMonths] = useState(6);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);

  const allTemplates = CatalogService.getTemplates();

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setTagline(plan.tagline);
      setPopular(!!plan.popular);
      setActive(plan.active !== false);
      setListPrice(plan.listPrice);
      setDiscountPct(plan.discountPct);
      setPromoMonths(plan.promoMonths);
      setFeatures([...plan.features]);
      setSelectedModuleIds([...plan.includedModuleIds]);
    } else {
      setName('');
      setTagline('');
      setPopular(false);
      setActive(true);
      setListPrice(250000);
      setDiscountPct(50);
      setPromoMonths(6);
      setFeatures([
        'Planificación estratégica y calendario mensual de publicaciones',
        'Diseño gráfico profesional para redes sociales',
        'Revisión y acompañamiento continuo',
      ]);
      setSelectedModuleIds(allTemplates.slice(0, 2).map((t) => t.id));
    }
  }, [plan, isOpen]);

  const promoPrice = Math.round(listPrice * (1 - discountPct / 100));

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleToggleModule = (modId: string) => {
    if (selectedModuleIds.includes(modId)) {
      setSelectedModuleIds(selectedModuleIds.filter((id) => id !== modId));
    } else {
      setSelectedModuleIds([...selectedModuleIds, modId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedPlan: PredefinedPlan = {
      id: plan ? plan.id : `plan-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim(),
      popular,
      active,
      listPrice: Number(listPrice) || 0,
      promoPrice,
      discountPct: Number(discountPct) || 0,
      promoMonths: Number(promoMonths) || 1,
      includedModuleIds: selectedModuleIds,
      features: features.length > 0 ? features : ['Servicio integral de gestión en redes sociales'],
    };

    onSave(savedPlan);
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
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-lg">
              {plan ? 'Editar Paquete de Servicio' : 'Nuevo Paquete de Servicio'}
            </h3>
            <p className="text-xs text-slate-400">
              Personaliza cómo se mostrará este plan en la tienda pública
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Nombre del Paquete *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Plan Integral Social Media"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Descripción corta / Bajada</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ej: El servicio más elegido para generar alcance y ventas continuas."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Precio de Lista Mensual ($)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={listPrice}
                onChange={(e) => setListPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Descuento (%) y Meses</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPct}
                  onChange={(e) => setDiscountPct(Number(e.target.value))}
                  placeholder="% OFF"
                  className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                />
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={promoMonths}
                  onChange={(e) => setPromoMonths(Number(e.target.value))}
                  placeholder="Meses"
                  className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-blue-900">
            <div>
              <span className="text-[11px] text-blue-700 block">Total Promocional Calculado:</span>
              <span className="font-heading font-black text-base text-blue-900">
                {QuotesService.formatCurrency(promoPrice)}/mes
              </span>
            </div>
            <span className="text-[11px] font-bold bg-blue-200/60 text-blue-800 px-2.5 py-1 rounded-full">
              {discountPct}% OFF por {promoMonths} meses
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <CustomCheckbox
              checked={popular}
              onChange={setPopular}
              label="Destacar como 'Más Elegido'"
              description="Añade cinta dorada y relieve"
              variant="brand"
              size="sm"
            />

            <CustomCheckbox
              checked={active}
              onChange={setActive}
              label="Plan Activo"
              description="Visible en la Tienda"
              variant="emerald"
              size="sm"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Módulos que integra este paquete</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              {allTemplates.map((t) => {
                const isChecked = selectedModuleIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => handleToggleModule(t.id)}
                    className="flex items-center gap-2.5 text-xs cursor-pointer p-2 rounded-lg hover:bg-white transition border border-transparent hover:border-slate-200"
                  >
                    <CustomCheckbox
                      checked={isChecked}
                      onChange={() => handleToggleModule(t.id)}
                      size="sm"
                      variant="brand"
                    />
                    <span className="truncate font-semibold text-slate-800">{t.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Beneficios / Puntos Clave</label>
            <div className="space-y-1.5 mb-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-700 text-xs">{feat}</span>
                  <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                placeholder="Añadir punto clave del servicio..."
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddFeature}
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
              Guardar Paquete
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
