import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  CalendarDays, 
  DollarSign, 
  Sparkles, 
  Plus, 
  Minus, 
  FileText,
  Megaphone
} from 'lucide-react';
import { Client, ClientStatus, OnboardingState } from '../../../core/models/client.model';
import { ClientsService } from '../../../core/services/clients.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { OnboardingChecklistComponent } from './onboarding-checklist.component';
import { DeliverablesManagerComponent } from './deliverables-manager.component';
import { ClientCredentialsCardComponent } from './client-credentials-card.component';
import { PortalAdsManagerComponent } from '../../public/client-portal/portal-ads-manager.component';
import { CustomDropdown, DropdownOption } from '../../../shared/components/custom-dropdown.component';
import { CollapsibleHelpCardComponent } from '../../../shared/components/collapsible-help-card.component';

const CLIENT_STATUS_OPTIONS: DropdownOption<ClientStatus>[] = [
  {
    value: 'ONBOARDING',
    label: 'En Onboarding',
    dotColor: 'bg-[#F59E0B]',
    badgeClasses: { bg: 'bg-[#FFF3D6]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' },
    description: 'Completando relevamiento y configuración',
  },
  {
    value: 'ACTIVE',
    label: 'Cliente Activo',
    dotColor: 'bg-[#12B76A]',
    badgeClasses: { bg: 'bg-[#DDF8EC]', text: 'text-[#12B76A]', border: 'border-[#B6EED1]' },
    description: 'Servicio en producción y entregas vigentes',
  },
  {
    value: 'PAUSED',
    label: 'Pausado',
    dotColor: 'bg-[#64748B]',
    badgeClasses: { bg: 'bg-[#EEF2F8]', text: 'text-[#64748B]', border: 'border-[#DCE6F4]' },
    description: 'Servicio temporalmente en pausa',
  },
];

interface ClientDetailProps {
  clientId: string;
  onNavigate: (route: string, param?: string) => void;
}

export const ClientDetailComponent: React.FC<ClientDetailProps> = ({
  clientId,
  onNavigate,
}) => {
  const [client, setClient] = useState<Client | null>(() => ClientsService.getClientById(clientId));
  const [activeTab, setActiveTab] = useState<'deliverables' | 'ads' | 'onboarding' | 'contract'>('deliverables');
  const [copiedPortal, setCopiedPortal] = useState(false);

  useEffect(() => {
    setClient(ClientsService.getClientById(clientId));
    const unsubscribe = ClientsService.subscribe(() => {
      setClient(ClientsService.getClientById(clientId));
    });
    return () => unsubscribe();
  }, [clientId]);

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-base font-semibold text-slate-800">Cliente no encontrado</p>
        <button
          onClick={() => onNavigate('crm-list')}
          className="text-xs font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver al Directorio
        </button>
      </div>
    );
  }

  const handleCopyPortalLink = () => {
    const origin = window.location.origin;
    const url = `${origin}?view=portal&id=${client.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedPortal(true);
      setTimeout(() => setCopiedPortal(false), 2000);
    });
  };

  const isPromoActive = client.promoMonthsRemaining > 0;
  const currentFee = isPromoActive ? client.monthlyFee : client.listPrice;
  const deliverablesCount = client.deliverables?.length || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('crm-list')}
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer"
            title="Volver al CRM"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 font-heading">{client.name}</h1>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {client.category}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {client.serviceTitle} • <span className="font-semibold text-blue-700">{client.onboarding.instagramHandle || '@cuenta'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Abrir Portal del Cliente */}
          <button
            onClick={() => onNavigate('portal', client.id)}
            className="px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
            title="Ver vista pública del cliente"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Portal Cliente</span>
          </button>

          {/* Copiar Link Portal Cliente */}
          <button
            onClick={handleCopyPortalLink}
            className={`px-3.5 py-2.5 text-sm font-semibold rounded-xl border transition flex items-center gap-2 cursor-pointer ${
              copiedPortal ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
            title="Copiar enlace directo al portal"
          >
            {copiedPortal ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedPortal ? 'Copiado' : 'Copiar Link'}</span>
          </button>

          {/* Estado Selector Personalizado */}
          <CustomDropdown<ClientStatus>
            value={client.status}
            onChange={(newStatus) => ClientsService.updateStatus(client.id, newStatus)}
            options={CLIENT_STATUS_OPTIONS}
            variant="status-pill"
            size="md"
            align="right"
            title="Cambiar estado del cliente"
          />
        </div>
      </div>

      {/* Control Financiero & Tracker de Bonificación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Abono Mensual Vigente</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 font-heading">{QuotesService.formatCurrency(currentFee)}</span>
            <span className="text-sm text-slate-600 font-medium">/mes</span>
          </div>
          <span className="text-xs sm:text-sm text-slate-500 mt-1 block font-medium">
            {isPromoActive ? 'Precio con 50% de bonificación aplicada' : 'Tarifa estándar de lista vigente'}
          </span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider font-heading">Tracker de Bonificación</span>
            </div>
            <p className="text-base font-bold text-slate-900">
              {client.promoMonthsRemaining > 0
                ? `Mes ${client.promoTotalMonths - client.promoMonthsRemaining + 1} de ${client.promoTotalMonths} con beneficio activo`
                : 'Beneficio de bienvenida finalizado (Tarifa estándar aplicada)'}
            </p>
            <p className="text-sm text-slate-600">
              Quedan <strong className="text-blue-700 font-bold">{client.promoMonthsRemaining} meses</strong> restantes con descuento sobre un total de {client.promoTotalMonths}.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => ClientsService.adjustPromoMonths(client.id, -1)}
              disabled={client.promoMonthsRemaining <= 0}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition"
              title="Descontar un mes facturado"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center px-3">
              <span className="text-base font-bold text-slate-900 font-heading block">{client.promoMonthsRemaining}m</span>
              <span className="text-xs text-slate-500 font-medium">Restantes</span>
            </div>
            <button
              type="button"
              onClick={() => ClientsService.adjustPromoMonths(client.id, 1)}
              disabled={client.promoMonthsRemaining >= client.promoTotalMonths}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition"
              title="Extender un mes"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`pb-3 text-sm sm:text-base font-bold border-b-2 transition flex items-center gap-2 px-1 cursor-pointer whitespace-nowrap ${
            activeTab === 'deliverables' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Calendario & Entregas</span>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
            {deliverablesCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`pb-3 text-sm sm:text-base font-bold border-b-2 transition flex items-center gap-2 px-1 cursor-pointer whitespace-nowrap ${
            activeTab === 'ads' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Publicidad & Meta Ads</span>
          {client.adCampaigns && client.adCampaigns.length > 0 ? (
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              {client.adCampaigns.length}
            </span>
          ) : (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-[#1760FF] uppercase tracking-wider">
              Nuevo
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('onboarding')}
          className={`pb-3 text-sm sm:text-base font-bold border-b-2 transition flex items-center gap-2 px-1 cursor-pointer whitespace-nowrap ${
            activeTab === 'onboarding' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Configuración Inicial (Onboarding)</span>
          {client.status === 'ONBOARDING' && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab('contract')}
          className={`pb-3 text-sm sm:text-base font-bold border-b-2 transition flex items-center gap-2 px-1 cursor-pointer whitespace-nowrap ${
            activeTab === 'contract' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Contrato & Propuesta</span>
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'deliverables' && (
            <div className="space-y-6">
              <CollapsibleHelpCardComponent
                storageKey="help_deliverables_guide"
                title="¿Cómo funciona el calendario y aprobación de entregas?"
                subtitle="Flujo colaborativo para preparar y autorizar publicaciones de Instagram."
                steps={[
                  {
                    title: '1. Redactar y Enlazar',
                    description: 'Escribí el texto (copy) de cada pieza y pegá el link del diseño o video listo para publicar.',
                    badge: 'Producción',
                  },
                  {
                    title: '2. Enviar a Aprobación',
                    description: 'Cambiá el estado de la pieza a "Listo para Aprobación" para que tu cliente la vea en su portal.',
                    badge: 'Revisión',
                  },
                  {
                    title: '3. Aprobación del Cliente',
                    description: 'El cliente toca "Aprobar" o solicita un ajuste puntual. Todas las respuestas quedan registradas acá.',
                    badge: 'Validación',
                  },
                ]}
                tip="Cargá las piezas de la semana en un solo bloque para optimizar tu tiempo de trabajo."
                defaultOpen={false}
              />
              <DeliverablesManagerComponent client={client} />
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-6">
              <CollapsibleHelpCardComponent
                storageKey="help_meta_ads_guide"
                title="¿Cómo funciona el circuito de publicidad en Meta Ads?"
                subtitle="Gestión de presupuesto publicitario para Instagram y Facebook."
                steps={[
                  {
                    title: '1. Solicitud del Cliente',
                    description: 'El cliente elige el presupuesto (ej: $60.000/mes) y el objetivo (WhatsApp, Seguidores o Ventas) desde su portal.',
                    badge: 'Presupuesto',
                  },
                  {
                    title: '2. Aprobación y Activación',
                    description: 'Coordinás el pago de la pauta publicitaria y pasás el estado de la campaña a "Activa".',
                    badge: 'Pauta',
                  },
                  {
                    title: '3. Registro de Métricas',
                    description: 'Cargás el alcance, clics y mensajes generados para que el cliente visualice el rendimiento de la inversión.',
                    badge: 'Reporte',
                  },
                ]}
                tip="Recomendá a negocios locales iniciar con campañas dirigidas a WhatsApp para generar consultas inmediatas."
                defaultOpen={false}
              />
              <PortalAdsManagerComponent
                client={client}
                onRefresh={() => setClient(ClientsService.getClientById(clientId))}
              />
            </div>
          )}

          {activeTab === 'onboarding' && (
            <div className="space-y-6">
              <CollapsibleHelpCardComponent
                storageKey="help_onboarding_guide"
                title="¿Cómo recopilar los insumos iniciales de marca?"
                subtitle="Control de checklist y materiales provistos por el cliente."
                steps={[
                  {
                    title: '1. Datos de Contacto & Redes',
                    description: 'Revisá el usuario de Instagram oficial y el número de WhatsApp comercial de la marca.',
                    badge: 'Perfil',
                  },
                  {
                    title: '2. Logo & Archivos Gráficos',
                    description: 'Verificá que el cliente haya subido su logo en formato PNG o vectorial con fondo transparente.',
                    badge: 'Identidad',
                  },
                  {
                    title: '3. Carpeta de Recursos en la Nube',
                    description: 'Accedé al link de Google Drive o Dropbox con el banco de fotos y videos para producir el contenido.',
                    badge: 'Insumos',
                  },
                ]}
                tip="Una vez que tengas todos los insumos confirmados, podés promover al cliente a estado 'Activo'."
                defaultOpen={false}
              />
              <OnboardingChecklistComponent
                client={client}
                onUpdateOnboarding={(onboarding) => ClientsService.updateOnboarding(client.id, onboarding)}
                onPromoteToActive={() => ClientsService.updateStatus(client.id, 'ACTIVE')}
              />
            </div>
          )}

          {activeTab === 'contract' && (
            <div className="space-y-6">
              <ClientCredentialsCardComponent client={client} />

              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 font-heading">Términos Comerciales Registrados</h3>
                  <button
                    onClick={() => {
                      const quote = QuotesService.getQuoteById(client.quoteId);
                      if (quote) onNavigate('proposal', quote.slug);
                    }}
                    className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver Propuesta A4</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block mb-1">Precio de Lista Base</span>
                    <span className="text-sm font-bold text-slate-900 font-heading">{QuotesService.formatCurrency(client.listPrice)}/mes</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block mb-1">Cuota Bonificada (Primeros {client.promoTotalMonths} meses)</span>
                    <span className="text-sm font-bold text-blue-600 font-heading">{QuotesService.formatCurrency(client.monthlyFee)}/mes</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-2">
                  La cotización vinculada (ID: #{client.quoteId}) establece la bonificación del 50% por {client.promoTotalMonths} meses consecutivos. Al vencerse el plazo, el sistema actualiza la cuota mensual a la tarifa estándar de forma automática.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
