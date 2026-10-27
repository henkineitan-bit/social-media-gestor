import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Database, Check, X, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { rtdbService } from '../../core/services/firebase-rtdb.service';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseModalComponent: React.FC<FirebaseModalProps> = ({ isOpen, onClose }) => {
  const currentConn = rtdbService.getConnectionMode();
  const [url, setUrl] = useState(currentConn.url || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    rtdbService.setCustomRtdbUrl(url);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
      window.location.reload();
    }, 1200);
  };

  const handleResetLocal = () => {
    rtdbService.setCustomRtdbUrl(null);
    setUrl('');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
      window.location.reload();
    }, 1200);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-heading text-sm">
                    Conectar Firebase RTDB (Plan Spark 100% Gratis)
                  </h3>
                  <span className="text-[11px] text-slate-400">Hosting + Realtime Database sin tarjeta de crédito</span>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Base de Datos Gratuita en Google Cloud</span>
              </div>
              <p>
                Permite que tus cotizaciones, paquetes y entregas se sincronicen entre múltiples computadoras y celulares.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  URL de tu Firebase Realtime Database:
                </label>
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Ir a Consola</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="text"
                placeholder="https://tu-proyecto-default-rtdb.firebaseio.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
              />
              <p className="text-[10px] text-slate-400">
                Obtenla en Firebase Console → Build → Realtime Database. Asegúrate de configurar en Reglas: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">&quot;.read&quot;: true, &quot;.write&quot;: true</code>.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetLocal}
                className="text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
              >
                Usar modo local
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleSave}
                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'Guardado' : 'Guardar y Conectar'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
