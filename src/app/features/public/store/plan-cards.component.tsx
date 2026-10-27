import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Star } from 'lucide-react';
import { PredefinedPlan } from '../../../core/models/catalog.model';
import { CatalogService } from '../../../core/services/catalog.service';
import { QuotesService } from '../../../core/services/quotes.service';

export type { PredefinedPlan };

interface PlanCardsProps {
  onSelectPlan: (plan: PredefinedPlan) => void;
}

export const PlanCardsComponent: React.FC<PlanCardsProps> = ({ onSelectPlan }) => {
  const [plans, setPlans] = useState<PredefinedPlan[]>(() => CatalogService.getActivePlans());

  useEffect(() => {
    setPlans(CatalogService.getActivePlans());
    const unsubscribe = CatalogService.subscribe(() => {
      setPlans(CatalogService.getActivePlans());
    });
    return unsubscribe;
  }, []);

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <p className="text-sm text-slate-500">
          No hay paquetes activos en este momento. El administrador puede activarlos desde el panel.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className={`relative bg-white rounded-2xl border p-6 sm:p-8 flex flex-col justify-between transition-shadow duration-200 shadow-xs hover:shadow-xl ${
            plan.popular
              ? 'border-[#1760FF] ring-2 ring-[#1760FF]/20 shadow-blue-500/10'
              : 'border-[#DCE6F4] hover:border-slate-300'
          }`}
        >
          {plan.popular && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1760FF] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md shadow-blue-500/30 flex items-center gap-1.5"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Más Elegido por Negocios</span>
            </motion.div>
          )}

          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-[#081B3A] font-heading">
                {plan.name}
              </h3>
            </div>
            <p className="text-sm text-[#64748B] mt-2 min-h-[36px] leading-relaxed">
              {plan.tagline}
            </p>

            {/* Pricing Box */}
            <div className="mt-5 p-4 rounded-xl bg-[#F7FAFF] border border-[#DCE6F4]">
              <span className="text-xs text-[#64748B] font-medium line-through block">
                Precio de lista: {QuotesService.formatCurrency(plan.listPrice)}/mes
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-[#081B3A] font-heading">
                  {QuotesService.formatCurrency(plan.promoPrice)}
                </span>
                <span className="text-sm text-[#64748B] font-medium">/mes</span>
              </div>
              <span className="inline-block mt-2.5 text-xs font-bold text-[#1760FF] bg-[#E8F0FF] px-2.5 py-1 rounded-md border border-[#B8D2FF]">
                {plan.discountPct}% OFF por {plan.promoMonths} meses de bienvenida
              </span>
            </div>

            {/* Deliverables List */}
            <div className="mt-6 space-y-3">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                ¿Qué incluye este plan?
              </span>
              <ul className="space-y-2.5 text-sm text-[#081B3A]">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-snug">
                    <span className="w-5 h-5 rounded-full bg-[#E8F0FF] text-[#1760FF] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              type="button"
              onClick={() => onSelectPlan(plan)}
              className={`w-full py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                plan.popular
                  ? 'bg-[#1760FF] hover:bg-[#124ecc] text-white shadow-blue-500/20'
                  : 'bg-[#081B3A] hover:bg-slate-800 text-white'
              }`}
            >
              <span>Elegir este Plan</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
