import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, DollarSign, Percent, Calendar, ShieldCheck } from 'lucide-react';
import { QuotePricing, ServiceModule } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';

interface PricingSummaryProps {
  pricing: QuotePricing;
  modules: ServiceModule[];
  onPricingChange: (pricing: QuotePricing) => void;
}

export const PricingSummaryComponent: React.FC<PricingSummaryProps> = ({
  pricing,
  modules,
  onPricingChange,
}) => {
  const handleToggleDiscount = (apply: boolean) => {
    const updated = QuotesService.calculatePricing(
      modules,
      apply,
      pricing.discountPercentage,
      pricing.discountDurationMonths,
      pricing.discountTitle
    );
    onPricingChange(updated);
  };

  const handlePercentageChange = (pct: number) => {
    const validPct = Math.max(0, Math.min(100, pct));
    const updated = QuotesService.calculatePricing(
      modules,
      pricing.applyDiscount,
      validPct,
      pricing.discountDurationMonths,
      pricing.discountTitle
    );
    onPricingChange(updated);
  };

  const handleMonthsChange = (months: number) => {
    const validMonths = Math.max(1, Math.min(36, months));
    const updated = QuotesService.calculatePricing(
      modules,
      pricing.applyDiscount,
      pricing.discountPercentage,
      validMonths,
      pricing.discountTitle
    );
    onPricingChange(updated);
  };

  const handleTitleChange = (title: string) => {
    onPricingChange({
      ...pricing,
      discountTitle: title,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            Resumen Financiero & Bonificaciones
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Cálculo automático de la cuota mensual recurrente y beneficios promocionales de entrada.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* Switch de Bonificación Especial */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block">
                Activar Bonificación Comercial
              </span>
              <span className="text-sm text-slate-600">
                Aplica descuento directo sobre los primeros meses de contratación
              </span>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => handleToggleDiscount(!pricing.applyDiscount)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
              pricing.applyDiscount ? 'bg-blue-600' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={pricing.applyDiscount}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                pricing.applyDiscount ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <AnimatePresence>
          {pricing.applyDiscount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Título del Beneficio
                  </label>
                  <input
                    type="text"
                    value={pricing.discountTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Bonificación Especial de Bienvenida"
                    className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Descuento (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={pricing.discountPercentage}
                      onChange={(e) => handlePercentageChange(Number(e.target.value) || 0)}
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Duración (Meses)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="36"
                      value={pricing.discountDurationMonths}
                      onChange={(e) => handleMonthsChange(Number(e.target.value) || 1)}
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Breakdown Card */}
      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-sm">
        <div className="p-4 bg-slate-50 flex items-center justify-between">
          <span className="text-slate-700 font-medium">Precio de Lista Mensual (Suma de Módulos)</span>
          <span className="text-slate-900 font-bold font-heading text-base">
            {QuotesService.formatCurrency(pricing.listPrice)}
          </span>
        </div>

        {pricing.applyDiscount && (
          <div className="p-4 bg-blue-50/70 flex items-center justify-between border-y border-blue-100">
            <div>
              <span className="font-bold text-blue-950 block">{pricing.discountTitle}</span>
              <span className="text-xs text-blue-800 font-medium">
                Primeros {pricing.discountDurationMonths} meses ({pricing.discountPercentage}% OFF)
              </span>
            </div>
            <span className="font-bold text-blue-700 font-heading text-base">
              - {QuotesService.formatCurrency(pricing.discountAmount)}
            </span>
          </div>
        )}

        {/* Final Price Highlight */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-slate-300 block">
              Total Mensual Promocional
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">
              {pricing.applyDiscount
                ? `Durante los primeros ${pricing.discountDurationMonths} meses del servicio`
                : 'Tarifa mensual estándar fija'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {QuotesService.formatCurrency(pricing.finalMonthlyPrice)}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">/mes + IVA si aplica</span>
          </div>
        </div>
      </div>
    </div>
  );
};
