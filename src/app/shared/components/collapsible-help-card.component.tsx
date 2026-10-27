import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, ChevronDown, ChevronUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export interface HelpStep {
  title: string;
  description: string;
  badge?: string;
}

export interface CollapsibleHelpCardProps {
  storageKey: string;
  title: string;
  subtitle?: string;
  steps: HelpStep[];
  tip?: string;
  actionText?: string;
  onAction?: () => void;
  defaultOpen?: boolean;
}

export const CollapsibleHelpCardComponent: React.FC<CollapsibleHelpCardProps> = ({
  storageKey,
  title,
  subtitle,
  steps,
  tip,
  actionText,
  onAction,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`help_open_${storageKey}`);
      if (saved !== null) return saved === 'true';
      return defaultOpen;
    } catch {
      return defaultOpen;
    }
  });

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    try {
      localStorage.setItem(`help_open_${storageKey}`, String(next));
    } catch {
      // ignore storage restriction
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-sky-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
      {/* Header bar always visible */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base leading-snug">
                {title}
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                Guía Rápida
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={toggleOpen}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold transition shadow-2xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>{isOpen ? 'Ocultar Explicación' : '¿Cómo funciona? (Ver Ayuda)'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Steps Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-3 border-t border-blue-200/70 space-y-4">
              {/* Step Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-white/90 backdrop-blur-xs rounded-xl p-3.5 border border-blue-100 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        {step.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {step.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-heading pt-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Tip & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                {tip && (
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-amber-50/80 border border-amber-200/70 px-3 py-1.5 rounded-xl">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span><strong>Recomendación:</strong> {tip}</span>
                  </div>
                )}

                {actionText && onAction && (
                  <button
                    type="button"
                    onClick={onAction}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <span>{actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
