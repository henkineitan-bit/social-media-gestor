import React from 'react';
import { Eye, EyeOff, Edit3, Trash2 } from 'lucide-react';
import { ModuleTemplate } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';

interface CatalogModulesTabProps {
  templates: ModuleTemplate[];
  onToggleActive: (template: ModuleTemplate) => void;
  onEdit: (template: ModuleTemplate) => void;
  onDelete: (id: string) => void;
}

export const CatalogModulesTabComponent: React.FC<CatalogModulesTabProps> = ({
  templates,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((t) => {
        const isActive = t.active !== false;
        return (
          <div
            key={t.id}
            className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-xs transition ${
              isActive ? 'border-slate-200' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {t.tag}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isActive ? 'Activo' : 'Oculto'}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-black text-slate-900 text-sm">{t.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.subtitle}</p>
              </div>

              <div className="text-sm font-bold text-slate-900 font-heading">
                Precio base: {QuotesService.formatCurrency(t.suggestedPrice)}/mes
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t.deliverables.length} Entregables incluidos:
                </span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {t.deliverables.map((d, i) => (
                    <li key={i} className="truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onToggleActive(t)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                title={isActive ? 'Ocultar del cotizador' : 'Activar en cotizador'}
              >
                {isActive ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEdit(t)}
                  className="px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title="Eliminar módulo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
