import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Layers, 
  Check, 
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ServiceModule, ModuleTemplate } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { BrandIcon } from '../../../shared/components/brand-icon.component';

interface ModuleSelectorProps {
  modules: ServiceModule[];
  onChange: (modules: ServiceModule[]) => void;
}

export const ModuleSelectorComponent: React.FC<ModuleSelectorProps> = ({
  modules,
  onChange,
}) => {
  const [showCatalog, setShowCatalog] = useState(false);
  const [newDeliverableText, setNewDeliverableText] = useState<{ [modId: string]: string }>({});

  const handleAddFromTemplate = (template: ModuleTemplate) => {
    onChange([...modules, {
      id: `mod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: template.title,
      subtitle: template.subtitle,
      price: template.suggestedPrice,
      deliverables: [...template.deliverables],
    }]);
    setShowCatalog(false);
  };

  const handleAddBlankModule = () => {
    onChange([...modules, {
      id: `mod-${Date.now()}`,
      title: 'Nuevo Módulo de Servicio',
      subtitle: 'Descripción breve del alcance del servicio.',
      price: 50000,
      deliverables: ['Primer entregable clave incluido.'],
    }]);
  };

  const handleUpdateModule = (id: string, updates: Partial<ServiceModule>) => {
    onChange(modules.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const handleRemoveModule = (id: string) => onChange(modules.filter((m) => m.id !== id));

  const handleAddDeliverable = (moduleId: string) => {
    const text = (newDeliverableText[moduleId] || '').trim();
    if (!text) return;
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;
    handleUpdateModule(moduleId, { deliverables: [...mod.deliverables, text] });
    setNewDeliverableText({ ...newDeliverableText, [moduleId]: '' });
  };

  const handleRemoveDeliverable = (moduleId: string, index: number) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (mod) handleUpdateModule(moduleId, { deliverables: mod.deliverables.filter((_, i) => i !== index) });
  };

  const handleDeliverableTextChange = (moduleId: string, index: number, value: string) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (mod) {
      const updated = [...mod.deliverables];
      updated[index] = value;
      handleUpdateModule(moduleId, { deliverables: updated });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            Módulos del Servicio ({modules.length})
          </h3>
          <p className="text-sm text-slate-600">
            Define los componentes de trabajo, precios base e hitos o entregables de cada uno.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCatalog(!showCatalog)}
            className="inline-flex items-center gap-2 text-sm font-bold px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl border border-blue-200 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Agregar de Catálogo</span>
            {showCatalog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleAddBlankModule}
            className="inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>Módulo en Blanco</span>
          </button>
        </div>
      </div>

      {/* Catalog Dropdown Panel */}
      <AnimatePresence>
        {showCatalog && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <BrandIcon name="modulos" className="w-4 h-4 text-[#1760FF]" /> Plantillas de Servicios de Agencia
                </span>
                <button
                  onClick={() => setShowCatalog(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CatalogService.getTemplates().map((tpl) => (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={tpl.id}
                    onClick={() => handleAddFromTemplate(tpl)}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {tpl.title}
                        </span>
                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                          {tpl.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{tpl.subtitle}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-sm">
                      <span className="font-bold text-slate-800 font-heading">
                        {QuotesService.formatCurrency(tpl.suggestedPrice)}
                      </span>
                      <span className="text-xs text-blue-700 font-bold group-hover:underline">
                        + Incluir módulo
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <BrandIcon name="modulos" className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-semibold text-slate-700">No hay módulos añadidos todavía</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Haz clic en &quot;Agregar de Catálogo&quot; o crea un &quot;Módulo en Blanco&quot;.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {modules.map((mod, index) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition"
              >
              {/* Header of Module */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => handleUpdateModule(mod.id, { title: e.target.value })}
                      placeholder="Título del Módulo (ej. Planificación & Diseño Gráfico)"
                      className="w-full font-bold text-slate-900 text-base border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none pb-0.5"
                    />
                    <input
                      type="text"
                      value={mod.subtitle}
                      onChange={(e) => handleUpdateModule(mod.id, { subtitle: e.target.value })}
                      placeholder="Subtítulo descriptivo breve"
                      className="w-full text-sm text-slate-600 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none pb-0.5"
                    />
                  </div>
                </div>

                {/* Price and delete */}
                <div className="flex items-center gap-3 sm:self-start">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-sm text-slate-500 font-semibold">$</span>
                    <input
                      type="number"
                      value={mod.price}
                      onChange={(e) =>
                        handleUpdateModule(mod.id, { price: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="w-28 text-base font-bold text-slate-900 bg-transparent focus:outline-none text-right font-heading"
                    />
                    <span className="text-xs text-slate-500 font-medium">/mes</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveModule(mod.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Eliminar este módulo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="pl-10 space-y-2.5 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Entregables Incluidos en este Módulo
                </span>

                <div className="space-y-2">
                  {mod.deliverables.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2.5 group">
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleDeliverableTextChange(mod.id, dIdx, e.target.value)}
                        className="text-sm text-slate-800 flex-1 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none py-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(mod.id, dIdx)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition"
                        title="Quitar entregable"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add deliverable row */}
                <div className="flex items-center gap-2.5 pt-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                  <input
                    type="text"
                    placeholder="Escribe un nuevo entregable y presiona enter..."
                    value={newDeliverableText[mod.id] || ''}
                    onChange={(e) =>
                      setNewDeliverableText({ ...newDeliverableText, [mod.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeliverable(mod.id);
                      }
                    }}
                    className="text-sm text-slate-700 flex-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDeliverable(mod.id)}
                    className="text-sm text-blue-700 hover:text-blue-800 font-bold px-2.5 py-1.5 hover:bg-blue-50 rounded-lg transition"
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      </div>
    </div>
  );
};
