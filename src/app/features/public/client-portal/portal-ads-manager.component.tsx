import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  MessageCircle, 
  Users, 
  Compass, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  PauseCircle, 
  PlayCircle, 
  ExternalLink,
  Instagram,
  Target,
  ArrowRight
} from 'lucide-react';
import { Client, AdCampaign, AdObjective, AdPlatform, AdCampaignStatus } from '../../../core/models/client.model';
import { ClientsService } from '../../../core/services/clients.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { CustomCheckbox } from '../../../shared/components/custom-checkbox.component';

interface PortalAdsManagerProps {
  client: Client;
  onRefresh: () => void;
  initialDeliverableId?: string | null;
}

const OBJECTIVE_INFO: Record<AdObjective, { label: string; icon: React.ReactNode; desc: string; badge: string }> = {
  WHATSAPP_LEADS: {
    label: 'Consultas & Ventas por WhatsApp',
    icon: <MessageCircle className="w-4 h-4 text-emerald-600" />,
    desc: 'Atrae clientes potenciales directamente a tu chat de WhatsApp Business.',
    badge: 'Más Recomendado',
  },
  FOLLOWERS: {
    label: 'Nuevos Seguidores & Visitas al Perfil',
    icon: <Users className="w-4 h-4 text-[#1760FF]" />,
    desc: 'Amplía la comunidad de tu cuenta de Instagram con público afín a tu rubro.',
    badge: 'Crecimiento de Marca',
  },
  SALES_TRAFFIC: {
    label: 'Tráfico Web / Tienda Online',
    icon: <TrendingUp className="w-4 h-4 text-indigo-600" />,
    desc: 'Lleva personas interesadas a tu tienda online o catálogo de servicios.',
    badge: 'Comercio Digital',
  },
  LOCAL_AWARENESS: {
    label: 'Reconocimiento Local de Cercanía',
    icon: <Compass className="w-4 h-4 text-amber-600" />,
    desc: 'Impacta a clientes que vivan o transiten en un radio de 5 a 15 km de tu local.',
    badge: 'Negocios Físicos',
  },
};

const PLATFORM_INFO: Record<AdPlatform, string> = {
  INSTAGRAM_REELS: 'Instagram Reels (Video Vertical)',
  INSTAGRAM_FEED: 'Instagram Feed (Post / Carrusel)',
  META_ADS_ALL: 'Meta Ads Completo (Instagram + Facebook)',
};

const BUDGET_PRESETS = [40000, 60000, 100000, 150000];

export const PortalAdsManagerComponent: React.FC<PortalAdsManagerProps> = ({ client, onRefresh, initialDeliverableId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState<AdObjective>('WHATSAPP_LEADS');
  const [monthlyBudget, setMonthlyBudget] = useState<number>(60000);
  const [platform, setPlatform] = useState<AdPlatform>('INSTAGRAM_FEED');
  const [targetAudience, setTargetAudience] = useState('');
  const [promotedDeliverableId, setPromotedDeliverableId] = useState<string>('');
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [submittedToast, setSubmittedToast] = useState(false);

  useEffect(() => {
    if (initialDeliverableId) {
      setPromotedDeliverableId(initialDeliverableId);
      setIsFormOpen(true);
      const deliv = client.deliverables?.find((d) => d.id === initialDeliverableId);
      if (deliv && !title) {
        setTitle(`Impulso: ${deliv.title}`);
      }
    }
  }, [initialDeliverableId]);

  const campaigns = client.adCampaigns || [];
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE');
  const totalAdBudget = activeCampaigns.reduce((sum, c) => sum + (c.monthlyBudget || 0), 0);

  // Total metrics
  const totalReach = activeCampaigns.reduce((sum, c) => sum + (c.metrics?.reach || 0), 0);
  const totalClicks = activeCampaigns.reduce((sum, c) => sum + (c.metrics?.clicks || 0), 0);
  const totalConvs = activeCampaigns.reduce((sum, c) => sum + (c.metrics?.conversations || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !confirmTerms) return;

    ClientsService.requestAdCampaign(client.id, {
      title: title.trim(),
      objective,
      monthlyBudget: Number(monthlyBudget) || 50000,
      platform,
      targetAudience: targetAudience.trim() || 'Público general segmentado por intereses afines a la marca.',
      promotedDeliverableId: promotedDeliverableId || undefined,
    });

    setIsFormOpen(false);
    setTitle('');
    setTargetAudience('');
    setConfirmTerms(false);
    setSubmittedToast(true);
    onRefresh();

    setTimeout(() => {
      setSubmittedToast(false);
    }, 4500);
  };

  const handleToggleStatus = (campaign: AdCampaign) => {
    const nextStatus: AdCampaignStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    ClientsService.updateAdCampaignStatus(client.id, campaign.id, nextStatus);
    onRefresh();
  };

  const approvedDeliverables = (client.deliverables || []).filter((d) => d.status === 'APPROVED');

  return (
    <div className="space-y-6">
      {/* Header Banner de Pauta Publicitaria */}
      <div className="bg-gradient-to-br from-[#081B3A] to-[#0F2856] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/25">
              <Megaphone className="w-3.5 h-3.5" />
              <span>META ADS & PUBLICIDAD EN INSTAGRAM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Impulsa tu Alcance con Publicidad Digital
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Potencia tus mejores Reels y posteos con pauta publicitaria en Meta Ads. 
              El 100% del presupuesto va directo a circulación y nuestro equipo se encarga de la segmentación y optimización.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-5 py-3 bg-[#1760FF] hover:bg-[#124ecc] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isFormOpen ? 'Cerrar Formulario' : 'Sumar Nueva Campaña de Publicidad'}</span>
            </motion.button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Quisiera consultar sobre la pauta publicitaria de Meta Ads para mi cuenta ${client.onboarding.instagramHandle || client.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold rounded-xl border border-white/10 transition flex items-center justify-center gap-2 text-center"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Asesorarme por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Métricas de Publicidad en Vivo si tiene campañas activas */}
        {activeCampaigns.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10 text-slate-200">
            <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Inversión Activa</span>
              <span className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5 block">
                {QuotesService.formatCurrency(totalAdBudget)}
              </span>
              <span className="text-[10px] text-blue-300">/mes en pauta</span>
            </div>

            <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Personas Alcanzadas</span>
              <span className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5 block">
                {totalReach.toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] text-emerald-300">Impactos estimados</span>
            </div>

            <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Clics / Interacción</span>
              <span className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5 block">
                {totalClicks.toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] text-slate-400">En perfil o anuncio</span>
            </div>

            <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Consultas WhatsApp</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-heading mt-0.5 block">
                {totalConvs}
              </span>
              <span className="text-[10px] text-emerald-300">Leads calificados</span>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notificación */}
      <AnimatePresence>
        {submittedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 border border-emerald-500"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <strong className="block text-sm font-bold">¡Solicitud de Publicidad Registrada!</strong>
              El equipo de la agencia creará la audiencia en el Administrador de Anuncios y te avisará al comenzar la circulación.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario Animado para Sumar Campaña */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-md space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 font-heading text-base">
                      Configurar Campaña Publicitaria en Instagram & Meta
                    </h3>
                    <p className="text-xs text-slate-500">
                      Define tu objetivo comercial y presupuesto mensual para tus anuncios
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Título de la campaña */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nombre o Foco de la Campaña *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Promoción Especial Mes / Captación de WhatsApp / Lanzamiento"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Selector de Objetivo Estratégico */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Elige el Objetivo Principal de tus Anuncios
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(OBJECTIVE_INFO) as AdObjective[]).map((objKey) => {
                    const info = OBJECTIVE_INFO[objKey];
                    const isSelected = objective === objKey;
                    return (
                      <div
                        key={objKey}
                        onClick={() => setObjective(objKey)}
                        className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {info.icon}
                            <span className="text-sm font-bold text-slate-900">{info.label}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {info.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{info.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Presupuesto de Inversión */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Inversión Mensual Estimada en Pauta (AR$)
                  </label>
                  <span className="text-xs text-slate-500">
                    Se abona a costo real directo en la plataforma publicitaria
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {BUDGET_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMonthlyBudget(preset)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        monthlyBudget === preset
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {QuotesService.formatCurrency(preset)}/mes
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                    <span className="text-xs font-semibold text-slate-500">Monto: $</span>
                    <input
                      type="number"
                      step={5000}
                      min={10000}
                      value={monthlyBudget}
                      onChange={(e) => setMonthlyBudget(Number(e.target.value) || 0)}
                      className="w-32 px-3 py-1.5 text-sm font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pieza o Entregable a Promocionar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    3. Pieza / Contenido a Pautar
                  </label>
                  <select
                    value={promotedDeliverableId}
                    onChange={(e) => setPromotedDeliverableId(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Anuncio diseñado exclusivamente desde cero</option>
                    {approvedDeliverables.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.weekLabel}: {d.title} ({d.type === 'REEL_VIDEO' ? 'Reel' : 'Post'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    4. Formato / Ubicación
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as AdPlatform)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INSTAGRAM_FEED">{PLATFORM_INFO.INSTAGRAM_FEED}</option>
                    <option value="INSTAGRAM_REELS">{PLATFORM_INFO.INSTAGRAM_REELS}</option>
                    <option value="META_ADS_ALL">{PLATFORM_INFO.META_ADS_ALL}</option>
                  </select>
                </div>
              </div>

              {/* Público Objetivo */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  5. Notas de Audiencia / Ciudades / Rango de Edad
                </label>
                <textarea
                  rows={2}
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ej. Personas de 25 a 55 años ubicadas en CABA y Zona Norte, interesadas en compras, servicios profesionales, etc."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Términos con CustomCheckbox */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <CustomCheckbox
                  checked={confirmTerms}
                  onChange={setConfirmTerms}
                  label="Confirmar Solicitud de Campaña de Pauta"
                  description="Comprendo que la inversión en pauta se destina íntegramente a Meta/Instagram y que la agencia preparará la segmentación antes de ponerla en circulación."
                  variant="brand"
                  size="md"
                />
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!title.trim() || !confirmTerms}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-sm shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Enviar Solicitud a la Agencia</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listado de Campañas Publicitarias Registradas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" />
              Tus Campañas de Pauta Registradas
            </h3>
            <p className="text-xs text-slate-500">
              Seguimiento de anuncios activos, métricas de rendimiento y solicitudes en curso.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
            {campaigns.length} {campaigns.length === 1 ? 'Campaña' : 'Campañas'}
          </span>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Megaphone className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <p className="text-base font-bold text-slate-800">
                Aún no tienes campañas de pauta publicitaria
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Potencia las publicaciones y reels que la agencia diseñe para tu marca. Suma publicidad paga para multiplicar tus seguidores y recibir consultas directas a tu WhatsApp.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Sumar mi primera campaña de pauta</span>
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((camp) => {
              const info = OBJECTIVE_INFO[camp.objective];
              const isActive = camp.status === 'ACTIVE';
              const isRequested = camp.status === 'REQUESTED';
              const isPaused = camp.status === 'PAUSED';

              return (
                <motion.div
                  key={camp.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow ${
                    isActive
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : isRequested
                      ? 'border-blue-200 bg-blue-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 font-heading">
                            {camp.title}
                          </h4>
                        </div>
                        <span className="text-xs text-slate-500">
                          {PLATFORM_INFO[camp.platform]} • Objetivo: <strong className="text-slate-700">{info.label}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>En Circulación</span>
                        </span>
                      )}
                      {isRequested && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>En Planificación por Agencia</span>
                        </span>
                      )}
                      {isPaused && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          <PauseCircle className="w-3.5 h-3.5" />
                          <span>Pausada</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Detalles y Métricas de la Campaña */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 uppercase tracking-wider font-semibold block text-[10px]">
                        Presupuesto Mensual
                      </span>
                      <span className="text-lg font-black text-slate-900 font-heading block">
                        {QuotesService.formatCurrency(camp.monthlyBudget)}
                      </span>
                      <span className="text-slate-400 text-[10px]">100% destinado a pauta</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 sm:col-span-2 space-y-1">
                      <span className="text-slate-500 uppercase tracking-wider font-semibold block text-[10px]">
                        Público Objetivo & Segmentación
                      </span>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {camp.targetAudience}
                      </p>
                      {camp.agencyNotes && (
                        <p className="text-[11px] text-blue-700 font-medium pt-1">
                          Nota de la agencia: {camp.agencyNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Métricas si tiene */}
                  {camp.metrics && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4 text-slate-600">
                        <span>Alcance: <strong className="text-slate-900">{camp.metrics.reach.toLocaleString('es-AR')}</strong></span>
                        <span>Clics: <strong className="text-slate-900">{camp.metrics.clicks.toLocaleString('es-AR')}</strong></span>
                        <span>Conversaciones: <strong className="text-emerald-700 font-bold">{camp.metrics.conversations}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(camp)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
                        >
                          {isActive ? <PauseCircle className="w-3.5 h-3.5 text-amber-600" /> : <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>{isActive ? 'Pausar Anuncios' : 'Reactivar'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
