import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, HelpCircle, Sparkles } from 'lucide-react';
import { AdminHelpModalComponent } from './admin-help-modal.component';

interface FloatingHelpButtonProps {
  onNavigate?: (route: string, param?: string) => void;
  userRole?: string;
}

export const FloatingHelpButtonComponent: React.FC<FloatingHelpButtonProps> = ({
  onNavigate,
  userRole,
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Solo mostrar para el administrador / equipo
  if (userRole !== 'admin' && userRole !== 'team') return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 no-print">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl shadow-xl shadow-blue-600/30 border border-blue-400/40 cursor-pointer group"
          title="Centro de Ayuda y Guías del Sistema"
          aria-label="Abrir Asistente de Ayuda"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Centro de Ayuda</span>
            </div>
            <div className="text-[10px] text-blue-100">
              Guías del sistema
            </div>
          </div>
        </motion.button>
      </div>

      <AdminHelpModalComponent
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
