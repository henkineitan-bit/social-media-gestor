import React from 'react';
import { Star, Eye, EyeOff, Edit3, Trash2 } from 'lucide-react';
import { PredefinedPlan } from '../../../core/models/catalog.model';
import { QuotesService } from '../../../core/services/quotes.service';

interface CatalogPlansTabProps {
  plans: PredefinedPlan[];
  onToggleActive: (plan: PredefinedPlan) => void;
  onEdit: (plan: PredefinedPlan) => void;
  onDelete: (id: string) => void;
}

export const CatalogPlansTabComponent: React.FC<CatalogPlansTabProps> = ({
  plans,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((p) => {
        const isActive = p.active !== false;
        return (
          <div
            key={p.id}
            className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-xs transition ${
              isActive ? 'border-slate-200' : 'border-slate-200/60 opacity-60 bg-slate-50/50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-black text-slate-900 text-base">{p.name}</h3>
                  {p.popular && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>Más Elegido</span>
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isActive ? 'Activo' : 'Oculto'}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed min-h-[32px]">{p.tagline}</p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-400 line-through">
                  Lista: {QuotesService.formatCurrency(p.listPrice)}/mes
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-black text-slate-900 font-heading">
                    {QuotesService.formatCurrency(p.promoPrice)}
                  </span>
                  <span className="text-xs text-slate-500">/mes</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded ml-auto">
                    {p.discountPct}% OFF ({p.promoMonths}m)
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {p.features.length} Beneficios configurados
                </span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {p.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {p.features.length > 3 && (
                    <li className="text-[11px] text-slate-400 italic">+{p.features.length - 3} más...</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onToggleActive(p)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                title={isActive ? 'Ocultar de la tienda' : 'Mostrar en la tienda'}
              >
                {isActive ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEdit(p)}
                  className="px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title="Eliminar paquete"
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
