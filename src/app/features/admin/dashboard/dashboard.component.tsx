import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  FileText, 
  ExternalLink, 
  Edit3, 
  Copy, 
  Check, 
  Search, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  RotateCcw,
  Trash2,
  Share2,
  X,
  Sparkles
} from 'lucide-react';
import { Quote, QuoteStatus } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';
import { StatusBadge, QuoteStatusDropdown } from '../../../shared/components/status-badge.component';
import { DashboardStatsChartsComponent } from './dashboard-stats-charts.component';
import { BrandIcon } from '../../../shared/components/brand-icon.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { CollapsibleHelpCardComponent } from '../../../shared/components/collapsible-help-card.component';

interface DashboardProps {
  onNavigate: (route: string, param?: string) => void;
}

export const DashboardComponent: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [quotes, setQuotes] = useState<Quote[]>(() => QuotesService.getQuotes());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

  useEffect(() => {
    // Sincronización reactiva en tiempo real
    const unsubscribe = QuotesService.subscribe((updatedQuotes) => {
      setQuotes(updatedQuotes);
    });
    return () => unsubscribe();
  }, []);

  const handleCopyLink = (slug: string) => {
    const origin = window.location.origin;
    const url = `${origin}?view=propuesta&slug=${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const handleStatusChange = (id: string, newStatus: QuoteStatus) => {
    QuotesService.updateStatus(id, newStatus);
    setQuotes(QuotesService.getQuotes());
  };

  const handleRequestDelete = (quote: Quote) => {
    setQuoteToDelete(quote);
  };

  const handleConfirmDelete = () => {
    if (quoteToDelete) {
      QuotesService.deleteQuote(quoteToDelete.id);
      setQuotes(QuotesService.getQuotes());
      setQuoteToDelete(null);
    }
  };

  const handleRestoreSeed = () => {
    QuotesService.restoreSeed();
    setQuotes(QuotesService.getQuotes());
  };

  // Métricas
  const totalQuotes = quotes.length;
  const approvedQuotes = quotes.filter((q) => q.status === 'APPROVED').length;
  const sentQuotes = quotes.filter((q) => q.status === 'SENT').length;
  const draftQuotes = quotes.filter((q) => q.status === 'DRAFT').length;
  const rejectedQuotes = quotes.filter((q) => q.status === 'REJECTED').length;
  const projectedMonthlyRevenue = quotes
    .filter((q) => q.status === 'APPROVED' || q.status === 'SENT')
    .reduce((sum, q) => sum + (q.pricing?.finalMonthlyPrice || 0), 0);
  const conversionRate = totalQuotes > 0 ? Math.round((approvedQuotes / totalQuotes) * 100) : 0;

  const statusCounts: Record<string, number> = {
    ALL: totalQuotes,
    SENT: sentQuotes,
    APPROVED: approvedQuotes,
    DRAFT: draftQuotes,
    REJECTED: rejectedQuotes,
  };

  // Filtrado
  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Panel de Cotizaciones & Propuestas
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {totalQuotes} {totalQuotes === 1 ? 'activa' : 'activas'}
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Gestión comercial, cálculo de abonos mensuales y entrega de propuestas A4 para clientes.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('builder')}
            className="inline-flex items-center gap-2 bg-[#1760FF] hover:bg-[#124ecc] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition cursor-pointer"
          >
            <BrandIcon name="nueva" className="w-4 h-4" />
            Nueva Cotización
          </motion.button>
        </div>
      </div>

      {/* Resumen Comercial de Cotizaciones */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider font-heading">
            <Sparkles className="w-4 h-4" />
            <span>Resumen Comercial Activo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
            Tenés {sentQuotes} {sentQuotes === 1 ? 'propuesta enviada' : 'propuestas enviadas'} esperando respuesta
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {approvedQuotes > 0
              ? `Ya contás con ${approvedQuotes} ${approvedQuotes === 1 ? 'cliente con propuesta aprobada' : 'clientes con propuestas aprobadas'} listos para trabajar en el CRM.`
              : 'Podés crear una nueva propuesta en 2 minutos y enviarle el enlace a tu cliente por WhatsApp.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('builder')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Crear Nueva Cotización</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('crm-list')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition cursor-pointer"
          >
            <span>Ver Clientes en CRM</span>
          </button>
        </div>
      </div>

      {/* Guía de Flujo Comercial */}
      <CollapsibleHelpCardComponent
        storageKey="dashboard_quotes"
        title="¿Cómo funciona el circuito de cotizaciones?"
        subtitle="Paso a paso para crear, enviar y cerrar propuestas comerciales con clientes."
        steps={[
          {
            title: '1. Armar la Propuesta',
            description: 'Presioná "+ Nueva". Poné el nombre de tu cliente y elegí los servicios que necesita (feed, reels, historias).',
            badge: '2 minutos',
          },
          {
            title: '2. Enviar por WhatsApp',
            description: 'En la lista de abajo, tocá el botón de copiar enlace. Pegáselo en WhatsApp a tu cliente para que revise la propuesta interactiva.',
            badge: 'Link Directo',
          },
          {
            title: '3. Pasar a Aprobada',
            description: 'Cuando el cliente te confirme el inicio, cambiá su estado a "Aprobada" y continuá al CRM para coordinar las publicaciones.',
            badge: 'Cierre',
          },
        ]}
        tip="Podés copiar el link público tantas veces como necesites. Tu cliente no necesita contraseña para visualizar la propuesta A4."
        actionText="Crear Cotización Ahora"
        onAction={() => onNavigate('builder')}
        defaultOpen={false}
      />

      {/* Tarjetas de Estadísticas con Gráficos Recharts */}
      <DashboardStatsChartsComponent quotes={quotes} />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por cliente, servicio o slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              title="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden sm:inline">Estado:</span>
          {(['ALL', 'SENT', 'APPROVED', 'DRAFT', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{st === 'ALL' ? 'Todos' : st === 'SENT' ? 'Enviadas' : st === 'APPROVED' ? 'Aprobadas' : st === 'DRAFT' ? 'Borrador' : 'Rechazadas'}</span>
              <span className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-bold ${
                filterStatus === st ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
              }`}>
                {statusCounts[st]}
              </span>
            </button>
          ))}
          <button
            onClick={handleRestoreSeed}
            title="Restablecer cotización semilla Familia Cardoso"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg ml-auto transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Restablecer Semilla</span>
          </button>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[580px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-xs">
              <tr className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-4 px-6 bg-slate-50">Cliente & Propuesta</th>
                <th className="py-4 px-4 bg-slate-50">Categoría</th>
                <th className="py-4 px-4 bg-slate-50">Módulos</th>
                <th className="py-4 px-4 bg-slate-50">Total Mensual</th>
                <th className="py-4 px-4 bg-slate-50">Estado</th>
                <th className="py-4 px-6 bg-slate-50 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No se encontraron cotizaciones con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/80 transition group">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition text-base">
                        {quote.clientName}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mt-0.5">
                        <span>{quote.serviceTitle}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-xs text-slate-500 font-medium">/propuesta/{quote.slug}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {quote.clientCategory}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-sm text-slate-700">
                      <span className="font-bold text-slate-900">{quote.modules?.length || 0}</span> módulos
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-base">
                        {QuotesService.formatCurrency(quote.pricing?.finalMonthlyPrice || 0)}
                        <span className="text-xs font-normal text-slate-500 ml-1">/mes</span>
                      </div>
                      {quote.pricing?.applyDiscount && (
                        <div className="text-xs text-blue-700 font-bold mt-0.5">
                          {quote.pricing.discountPercentage}% OFF ({quote.pricing.discountDurationMonths}m)
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <QuoteStatusDropdown
                        status={quote.status}
                        onChange={(newStatus) => handleStatusChange(quote.id, newStatus)}
                      />
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Ver Propuesta Pública */}
                        <button
                          onClick={() => onNavigate('proposal', quote.slug)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Ver propuesta imprimible A4"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        {/* Copiar Link */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCopyLink(quote.slug)}
                          className={`p-2 rounded-lg transition ${
                            copiedSlug === quote.slug
                              ? 'text-emerald-600 bg-emerald-50 ring-1 ring-emerald-300'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                          title="Copiar link para enviar al cliente"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {copiedSlug === quote.slug ? (
                              <motion.span
                                key="check"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="block"
                              >
                                <Check className="w-4 h-4 text-emerald-600" />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="copy"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="block"
                              >
                                <Copy className="w-4 h-4" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>

                        {/* Editar */}
                        <button
                          onClick={() => onNavigate('builder', quote.id)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                          title="Editar cotización en el constructor"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => handleRequestDelete(quote)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Eliminar cotización"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmación Personalizado para Eliminar Cotización */}
      <ConfirmModalComponent
        isOpen={quoteToDelete !== null}
        onClose={() => setQuoteToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar esta cotización?"
        description={
          quoteToDelete ? (
            <div className="space-y-2">
              <p>
                Estás a punto de eliminar la propuesta de{' '}
                <strong className="text-slate-900 font-bold">{quoteToDelete.clientName}</strong> por un valor de{' '}
                <strong className="text-slate-900 font-bold">
                  {QuotesService.formatCurrency(quoteToDelete.pricing?.finalMonthlyPrice || 0)}/mes
                </strong>.
              </p>
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl font-medium">
                ⚠️ El enlace público ({quoteToDelete.slug}) ya no estará accesible para el cliente.
              </p>
            </div>
          ) : null
        }
        confirmText="Sí, Eliminar Cotización"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};
