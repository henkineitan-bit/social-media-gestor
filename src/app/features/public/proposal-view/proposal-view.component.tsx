import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Check, 
  ShieldCheck, 
  Users
} from 'lucide-react';
import { Quote } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';
import { ClientsService } from '../../../core/services/clients.service';
import { ProposalSheetComponent } from './proposal-sheet.component';

interface ProposalViewProps {
  slug: string;
  onNavigateBack?: () => void;
  onNavigateToClient?: (clientId: string) => void;
}

export const ProposalViewComponent: React.FC<ProposalViewProps> = ({
  slug,
  onNavigateBack,
  onNavigateToClient,
}) => {
  const [quote, setQuote] = useState<Quote | null>(() => QuotesService.getQuoteBySlug(slug));
  const [acceptedToast, setAcceptedToast] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = QuotesService.getQuoteBySlug(slug);
    setQuote(found);
  }, [slug]);

  const handleAcceptProposal = () => {
    if (!quote) return;
    
    // 1. Actualizar estado de la cotización
    QuotesService.updateStatus(quote.id, 'APPROVED');
    const updatedQuote = QuotesService.getQuoteById(quote.id) || { ...quote, status: 'APPROVED' };
    setQuote(updatedQuote);

    // 2. Conversión automática e instantánea al CRM de Clientes
    ClientsService.createClientFromQuote(updatedQuote);

    setAcceptedToast(true);
    setTimeout(() => setAcceptedToast(false), 5000);
  };

  const handleDownloadPdf = () => {
    if (!quote) {
      window.print();
      return;
    }
    const originalTitle = document.title;
    const cleanClientName = quote.clientName.replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `Propuesta_${cleanClientName}_GestionDigital_A4`;
    
    window.print();

    // Restablecer el título original después de abrir el diálogo de impresión
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md shadow-xs">
          <p className="text-base font-semibold text-slate-800">Propuesta no encontrada</p>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            El enlace solicitado para el slug &quot;{slug}&quot; no existe o ha sido modificado.
          </p>
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="text-xs font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Volver al Panel
            </button>
          )}
        </div>
      </div>
    );
  }

  const isApproved = quote.status === 'APPROVED';
  const existingClient = ClientsService.getClientByQuoteId(quote.id);

  return (
    <div className="min-h-screen bg-slate-100 py-6 md:py-10 print:bg-white print:py-0">
      {/* Barra de Acciones Flotante (oculta en impresión) */}
      <motion.aside
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Acciones de la propuesta"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl print:hidden"
      >
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onNavigateBack && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateBack}
                className="text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver</span>
              </motion.button>
            )}
            <div className="text-sm">
              <span className="font-bold text-white block sm:inline">{quote.clientName}</span>
              <span className="text-slate-400 text-xs sm:ml-2">({quote.serviceTitle})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              title="Copiar link directo"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden md:inline">{copied ? 'Copiado' : 'Compartir'}</span>
            </motion.button>

            {/* Botón Descargar como PDF */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              title="Descargar propuesta en formato PDF A4"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Descargar PDF</span>
            </motion.button>

            {!isApproved ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAcceptProposal}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm shadow-blue-500/30 transition flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aceptar Propuesta Comercial</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3.5 py-2 text-sm font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded-xl flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Propuesta Aprobada</span>
                </motion.div>
                {existingClient && onNavigateToClient && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigateToClient(existingClient.id)}
                    className="px-3.5 py-2 text-sm font-bold text-blue-300 bg-blue-950/70 hover:bg-blue-900 border border-blue-700 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    title="Ir a la ficha CRM del cliente"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Ver en CRM</span>
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Toast de confirmación de aprobación & Onboarding */}
      <AnimatePresence>
        {acceptedToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md"
          >
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold block text-sm">¡Propuesta Comercial Aprobada!</span>
              <span>Se ha creado automáticamente la ficha del cliente en el CRM y se ha iniciado el proceso de Onboarding.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hoja Ejecutiva A4 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProposalSheetComponent quote={quote} isApproved={isApproved} />
      </motion.div>
    </div>
  );
};
