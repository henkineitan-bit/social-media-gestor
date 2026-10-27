import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  ArrowLeft, 
  Sparkles, 
  CalendarDays, 
  CheckCircle2, 
  Instagram, 
  FileText,
  Clock,
  ShieldCheck,
  Megaphone,
  FolderHeart,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Client } from '../../../core/models/client.model';
import { ClientsService } from '../../../core/services/clients.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { AuthService } from '../../../core/services/auth.service';
import { PortalAssetsDropComponent } from './portal-assets-drop.component';
import { PortalApprovalCardComponent } from './portal-approval-card.component';
import { PortalAdsManagerComponent } from './portal-ads-manager.component';
import { PortalUpgradesSectionComponent } from './portal-upgrades-section.component';
import { BrandLogo } from '../../../shared/components/brand-logo.component';
import { BrandIcon } from '../../../shared/components/brand-icon.component';

interface ClientPortalProps {
  clientId: string;
  onNavigateBack?: () => void;
  onNavigateToProposal?: (slug: string) => void;
}

type PortalTab = 'deliverables' | 'ads' | 'upgrades' | 'assets';

export const ClientPortalComponent: React.FC<ClientPortalProps> = ({
  clientId,
  onNavigateBack,
  onNavigateToProposal,
}) => {
  const [client, setClient] = useState<Client | null>(() => ClientsService.getClientById(clientId));
  const [activeTab, setActiveTab] = useState<PortalTab>('deliverables');
  const [preselectedDeliverableId, setPreselectedDeliverableId] = useState<string | null>(null);

  const refreshClient = () => {
    setClient(ClientsService.getClientById(clientId));
  };

  useEffect(() => {
    refreshClient();
    const unsubscribe = ClientsService.subscribe(() => {
      setClient(ClientsService.getClientById(clientId));
    });
    return () => unsubscribe();
  }, [clientId]);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md shadow-xs">
          <p className="text-base font-semibold text-slate-800">Portal no encontrado</p>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            El enlace solicitado para el cliente con ID &quot;{clientId}&quot; no existe.
          </p>
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="text-xs font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Volver al Panel
            </button>
          )}
        </div>
      </div>
    );
  }

  const quote = QuotesService.getQuoteById(client.quoteId);
  const isPromoActive = client.promoMonthsRemaining > 0;
  const currentFee = isPromoActive ? client.monthlyFee : client.listPrice;
  const deliverables = client.deliverables || [];
  const adCampaigns = client.adCampaigns || [];
  const activeAdsCount = adCampaigns.filter((c) => c.status === 'ACTIVE').length;
  const pendingApprovalsCount = deliverables.filter((d) => d.status === 'PENDING_APPROVAL').length;

  const handleBoostDeliverable = (deliverableId: string) => {
    setPreselectedDeliverableId(deliverableId);
    setActiveTab('ads');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 md:py-10 text-slate-900 font-sans">
      {/* Top Floating Bar */}
      <aside aria-label="Navegación del portal" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between">
          {AuthService.isAdminOrTeam() && onNavigateBack ? (
            <button
              onClick={onNavigateBack}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Panel de Control</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-600">Portal Privado de Entregas & Publicidad</span>
          </div>
        </div>
      </aside>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Cabecera de Bienvenida */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#1760FF] flex items-center justify-center p-1.5 shadow-xs">
                  <BrandLogo variant="isotipo" theme="white" className="w-full h-full" />
                </div>
                <span className="text-xs font-bold text-[#1760FF] tracking-wider uppercase font-heading">
                  PORTAL CLIENTE • GESTIÓN DIGITAL & PUBLICIDAD
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#081B3A] font-heading">
                Portal de Gestión Digital — {client.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-[#64748B] mt-1">
                <span className="font-medium text-slate-800">{client.serviceTitle}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[#1760FF] font-bold">{client.onboarding.instagramHandle || '@cuenta'}</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-end gap-2">
              <span className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                {client.category}
              </span>
              {quote && onNavigateToProposal && (
                <button
                  onClick={() => onNavigateToProposal(quote.slug)}
                  className="text-xs sm:text-sm text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ver Contrato A4</span>
                </button>
              )}
            </div>
          </div>

          {/* Resumen del Plan */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
            <div>
              <span className="font-bold text-slate-900 font-heading text-base block">
                {isPromoActive ? 'Plan Mensual Promocional Activo' : 'Plan Mensual Estándar'}
              </span>
              <p className="text-slate-600 text-sm mt-0.5 leading-relaxed">
                {isPromoActive
                  ? `Cuota bonificada con 50% OFF — Te quedan ${client.promoMonthsRemaining} meses de beneficio comercial.`
                  : 'Tarifa mensual estándar fija vigente.'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-slate-900 font-heading">
                {QuotesService.formatCurrency(currentFee)}
              </span>
              <span className="text-slate-600 font-medium ml-1">/mes</span>
            </div>
          </div>
        </div>

        {/* Barra de Pestañas Interactivas */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('deliverables')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'deliverables'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <CalendarDays className={`w-4 h-4 ${activeTab === 'deliverables' ? 'text-[#1760FF]' : 'text-slate-400'}`} />
            <span>Entregas Semanales</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {deliverables.length}
            </span>
            {pendingApprovalsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Piezas pendientes de tu aprobación" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ads')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'ads'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Megaphone className={`w-4 h-4 ${activeTab === 'ads' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Publicidad & Meta Ads</span>
            {activeAdsCount > 0 ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {activeAdsCount} activas
              </span>
            ) : (
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white uppercase tracking-wider shadow-2xs">
                Nuevo
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upgrades')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'upgrades'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'upgrades' ? 'text-amber-500' : 'text-slate-400'}`} />
            <span>Mejoras & Promos</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
              Beneficio
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assets')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'assets'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <FolderHeart className={`w-4 h-4 ${activeTab === 'assets' ? 'text-pink-600' : 'text-slate-400'}`} />
            <span>Insumos & Kit de Marca</span>
          </button>
        </div>

        {/* Contenido de la Pestaña Activa con Transición Suave */}
        <AnimatePresence mode="wait">
          {activeTab === 'deliverables' && (
            <motion.div
              key="deliverables"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Encabezado de la Sección de Entregas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    Entregas Semanales & Aprobación de Piezas
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Revisá el contenido programado, aprobá cada publicación o solicitá ajustes antes de su lanzamiento en redes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('ads')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Sumar Publicidad Paga</span>
                </button>
              </div>

              {/* Lista de Piezas */}
              <div className="space-y-4">
                {deliverables.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 shadow-xs">
                    <CalendarDays className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">Sin piezas en el calendario aún</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      La agencia generará las entregas correspondientes a cada semana de trabajo.
                    </p>
                  </div>
                ) : (
                  deliverables.map((item) => (
                    <PortalApprovalCardComponent
                      key={item.id}
                      clientId={client.id}
                      item={item}
                      onRefresh={refreshClient}
                      onBoostWithAd={handleBoostDeliverable}
                    />
                  ))
                )}
              </div>

              {/* Banner de impulso comercial hacia Meta Ads */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider font-heading">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Multiplica tu Alcance</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    ¿Querés que tus publicaciones lleguen a miles de personas en tu ciudad?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                    Podés agregar pauta publicitaria en Meta Ads (Instagram y Facebook) configurando presupuesto diario o mensual directo desde el portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('ads')}
                  className="px-4 py-2.5 bg-[#1760FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Explorar Publicidad</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'ads' && (
            <motion.div
              key="ads"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PortalAdsManagerComponent
                client={client}
                onRefresh={refreshClient}
                initialDeliverableId={preselectedDeliverableId}
              />
            </motion.div>
          )}

          {activeTab === 'upgrades' && (
            <motion.div
              key="upgrades"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PortalUpgradesSectionComponent client={client} />
            </motion.div>
          )}

          {activeTab === 'assets' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <PortalAssetsDropComponent
                client={client}
                onUpdateClient={refreshClient}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
