import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ExternalLink, 
  UploadCloud, 
  MessageSquare, 
  FileImage, 
  Video, 
  Send, 
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  Megaphone
} from 'lucide-react';
import { DeliverableItem } from '../../../core/models/client.model';
import { ClientsService } from '../../../core/services/clients.service';

interface PortalApprovalCardProps {
  clientId: string;
  item: DeliverableItem;
  onRefresh: () => void;
  onBoostWithAd?: (deliverableId: string) => void;
}

export const PortalApprovalCardComponent: React.FC<PortalApprovalCardProps> = ({
  clientId,
  item,
  onRefresh,
  onBoostWithAd,
}) => {
  const [rawLink, setRawLink] = useState(item.rawAssetsLink || '');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveRawAssets = () => {
    if (!rawLink.trim()) return;
    setIsSubmitting(true);
    ClientsService.submitClientRawAssets(clientId, item.id, rawLink.trim());
    setIsSubmitting(false);
    onRefresh();
  };

  const handleApprove = () => {
    ClientsService.clientApproveDeliverable(clientId, item.id);
    onRefresh();
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    ClientsService.clientRequestChanges(clientId, item.id, feedbackText.trim());
    setShowFeedbackInput(false);
    setFeedbackText('');
    onRefresh();
  };

  const isApproved = item.status === 'APPROVED';
  const isPendingApproval = item.status === 'PENDING_APPROVAL';
  const isWaitingAssets = item.status === 'WAITING_ASSETS';
  const isInProduction = item.status === 'IN_PRODUCTION';
  const isChangesRequested = item.status === 'CHANGES_REQUESTED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`bg-white rounded-2xl border p-6 transition-all duration-200 shadow-xs hover:shadow-md space-y-5 ${
        isApproved
          ? 'border-emerald-200 bg-emerald-50/10'
          : isPendingApproval
          ? 'border-blue-300 ring-2 ring-blue-500/10'
          : 'border-slate-200'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            {item.type === 'GRAPHIC_POST' ? (
              <FileImage className="w-5 h-5 text-blue-600" />
            ) : (
              <Video className="w-5 h-5 text-indigo-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-heading">{item.title}</h3>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {item.weekLabel}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              {item.type === 'GRAPHIC_POST' ? 'Diseño estático para feed' : 'Video dinámico Reel'}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isApproved && (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Aprobado para Publicar</span>
            </span>
          )}
          {isPendingApproval && (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 animate-pulse">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Listo para tu Aprobación</span>
            </span>
          )}
          {isInProduction && (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              <Clock className="w-4 h-4" />
              <span>En Diseño por la Agencia</span>
            </span>
          )}
          {isWaitingAssets && (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
              <UploadCloud className="w-4 h-4 text-amber-600" />
              <span>Esperando tus Fotos/Videos</span>
            </span>
          )}
          {isChangesRequested && (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-800 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Ajustes en Producción</span>
            </span>
          )}
        </div>
      </div>

      {/* Subida de Insumos Crudos (Drive / Dropbox) */}
      <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 text-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="font-bold text-slate-800 block text-xs uppercase tracking-wider">
            Tus Fotos / Videos Crudos para esta pieza
          </label>
          {item.rawAssetsLink && (
            <a
              href={item.rawAssetsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold hover:underline flex items-center gap-1 text-xs"
            >
              <span>Ver carpeta enviada</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <input
            type="url"
            value={rawLink}
            onChange={(e) => setRawLink(e.target.value)}
            placeholder="Pega aquí el enlace de Google Drive o WeTransfer..."
            className="flex-1 w-full text-sm sm:text-base bg-white border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-slate-800 shadow-2xs"
          />
          <button
            type="button"
            onClick={handleSaveRawAssets}
            disabled={!rawLink.trim() || isSubmitting}
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition shrink-0 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Enviar Insumos</span>
          </button>
        </div>
      </div>

      {/* Vista Previa de la Agencia y Copy para Aprobar */}
      {item.agencyPreviewLink ? (
        <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 sm:p-7 space-y-5 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
            <div>
              <span className="font-bold text-slate-900 block font-heading text-lg">
                Propuesta de Publicación Lista
              </span>
              <span className="text-slate-600 text-xs sm:text-sm">
                Revisa el diseño o video preparado y el texto que lo acompañará en Instagram.
              </span>
            </div>

            <a
              href={item.agencyPreviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm rounded-xl border border-blue-200 shadow-xs transition shrink-0"
            >
              <span>Abrir Diseño / Video Terminado</span>
              <ExternalLink className="w-4 h-4 text-blue-600" />
            </a>
          </div>

          {/* Copy Text */}
          {item.copyText && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Texto / Copy Propuesto para el Posteo
              </span>
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 text-slate-800 whitespace-pre-line leading-relaxed text-sm sm:text-base shadow-2xs font-sans w-full min-h-[140px]">
                {item.copyText}
              </div>
            </div>
          )}

          {/* Si el cliente pidió ajustes anteriormente */}
          {isChangesRequested && item.clientFeedback && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-sm">
              <span className="font-bold block">Tu solicitud de ajuste actual:</span>
              <p className="mt-1 leading-relaxed">{item.clientFeedback}</p>
            </div>
          )}

          {/* Botones de Aprobación o Solicitud de Ajustes */}
          {!isApproved ? (
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleApprove}
                className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-sm shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Aprobar Publicación</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowFeedbackInput(!showFeedbackInput)}
                className="py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base rounded-xl border border-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-slate-500" />
                <span>Solicitar Ajuste</span>
              </motion.button>
            </div>
          ) : (
            onBoostWithAd && (
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-blue-50/60 p-4 sm:p-5 rounded-2xl border border-blue-100">
                <div className="text-xs sm:text-sm text-slate-700">
                  <span className="font-bold text-[#081B3A] block sm:inline mr-1">¡Esta pieza está lista y aprobada!</span>
                  ¿Querés amplificar su alcance con pauta publicitaria en Meta Ads?
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onBoostWithAd(item.id)}
                  className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#1760FF] hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-2xs transition cursor-pointer shrink-0"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Sumar Anuncio para esta Pieza</span>
                </motion.button>
              </div>
            )
          )}

          {/* Campo para escribir el ajuste */}
          <AnimatePresence>
            {showFeedbackInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3 mt-3 overflow-hidden shadow-xs"
              >
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  ¿Qué cambio o corrección deseas que realicemos?
                </label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Ej. Modificar el título de la imagen, cambiar la foto del slide 2, retocar el copy, etc..."
                  className="w-full text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 leading-relaxed shadow-2xs"
                />
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackInput(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSendFeedback}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-xs"
                  >
                    Enviar Solicitud de Ajuste
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-sm font-medium">
          La agencia está preparando la propuesta final de diseño y redacción para esta entrega.
        </div>
      )}
    </motion.div>
  );
};
