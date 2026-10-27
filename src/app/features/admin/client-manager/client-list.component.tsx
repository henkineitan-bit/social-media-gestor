import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  Instagram, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  RotateCcw, 
  Check,
  Percent,
  Plus
} from 'lucide-react';
import { Client, ClientStatus } from '../../../core/models/client.model';
import { ClientsService } from '../../../core/services/clients.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { CollapsibleHelpCardComponent } from '../../../shared/components/collapsible-help-card.component';

interface ClientListProps {
  onNavigate: (route: string, param?: string) => void;
}

export const ClientListComponent: React.FC<ClientListProps> = ({ onNavigate }) => {
  const [clients, setClients] = useState<Client[]>(() => ClientsService.getClients());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'ONBOARDING' | 'ACTIVE' | 'PAUSED'>('ALL');

  useEffect(() => {
    const unsubscribe = ClientsService.subscribe((updated) => {
      setClients(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleRestoreSeed = () => {
    ClientsService.restoreSeed();
    setClients(ClientsService.getClients());
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.onboarding.instagramHandle || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterTab === 'ALL' || c.status === filterTab;

    return matchesSearch && matchesFilter;
  });

  // Métricas rápidas
  const totalCount = clients.length;
  const onboardingCount = clients.filter((c) => c.status === 'ONBOARDING').length;
  const activeCount = clients.filter((c) => c.status === 'ACTIVE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Directorio de Clientes & CRM
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Iteración 2
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Gestión de cuentas activas, seguimiento de Onboarding y control de periodos bonificados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('builder')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Cotización / Prospecto</span>
          </button>
        </div>
      </div>

      {/* Guía Rápida del CRM */}
      <CollapsibleHelpCardComponent
        storageKey="crm_list_guide"
        title="¿Cómo gestionar tus clientes y sus cuentas desde el CRM?"
        subtitle="Un paso a paso claro para revisar entregas semanales y materiales de trabajo."
        steps={[
          {
            title: '1. Abrir la Ficha del Cliente',
            description: 'Hacé clic sobre cualquier cliente de la lista para ver su calendario, insumos y estado de facturación.',
            badge: 'Acceso',
          },
          {
            title: '2. Cargar Entregas Semanales',
            description: 'En su ficha vas a poder redactar el texto de las publicaciones y adjuntar los diseños listos para aprobación.',
            badge: 'Contenido',
          },
          {
            title: '3. Insumos & Drive',
            description: 'Accedé directamente a la carpeta de Google Drive o Dropbox que el cliente compartió para descargar fotos.',
            badge: 'Insumos',
          },
        ]}
        tip="Si un cliente figura 'En Onboarding', significa que aún está completando sus materiales de marca. Podés ver su progreso entrando a su ficha."
        defaultOpen={false}
      />

      {/* Metric summary pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Clientes</span>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-heading">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">En Puesta a Punto</span>
            <p className="text-2xl font-bold text-blue-700 mt-1 font-heading">{onboardingCount} Cuentas</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Clientes Activos</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1 font-heading">{activeCount} Cuentas</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, Instagram o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'ALL', label: `Todos (${totalCount})` },
            { key: 'ONBOARDING', label: `En Onboarding (${onboardingCount})` },
            { key: 'ACTIVE', label: `Activos (${activeCount})` },
            { key: 'PAUSED', label: 'Pausados' },
          ].map((tab) => (
            <motion.button
              whileTap={{ scale: 0.96 }}
              key={tab.key}
              onClick={() => setFilterTab(tab.key as typeof filterTab)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                filterTab === tab.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}

          <button
            onClick={handleRestoreSeed}
            title="Restablecer cliente semilla Familia Cardoso"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg ml-auto transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden lg:inline">Semilla CRM</span>
          </button>
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="space-y-3.5">
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 shadow-xs">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-base font-semibold text-slate-700">No se encontraron clientes</p>
            <p className="text-sm text-slate-500 mt-1">
              Las cotizaciones aprobadas se convertirán automáticamente en clientes aquí.
            </p>
          </div>
        ) : (
          filteredClients.map((client, index) => {
            const completedTasks = [
              client.onboarding.contactDataCompleted,
              client.onboarding.logoReceived,
              client.onboarding.aestheticStandardized,
            ].filter(Boolean).length;
            const onboardingPct = Math.round((completedTasks / 3) * 100);

            const isPromoActive = client.promoMonthsRemaining > 0;
            const currentFee = isPromoActive ? client.monthlyFee : client.listPrice;
            const currentMonthIndex = client.promoTotalMonths - client.promoMonthsRemaining + 1;

            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                onClick={() => onNavigate('crm-detail', client.id)}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-shadow cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Info & Instagram */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition font-heading text-lg">
                      {client.name}
                    </h3>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                      {client.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        client.status === 'ONBOARDING'
                          ? 'bg-[#FFF3D6] text-[#B45309] border-[#FDE68A]'
                          : client.status === 'ACTIVE'
                          ? 'bg-[#DDF8EC] text-[#12B76A] border-[#B6EED1]'
                          : 'bg-[#EEF2F8] text-[#64748B] border-[#DCE6F4]'
                      }`}
                    >
                      {client.status === 'ONBOARDING' ? 'En Onboarding' : client.status === 'ACTIVE' ? 'Cliente Activo' : 'Pausado'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 text-sm text-slate-600">
                    <span className="font-medium text-slate-800">{client.serviceTitle}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 font-mono text-blue-700 font-semibold">
                      <Instagram className="w-4 h-4 text-blue-600" />
                      {client.onboarding.instagramHandle || '@cuenta'}
                    </span>
                    {client.email && (
                      <span className="text-slate-600 font-mono text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {client.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Center: Promo Tracker & Onboarding Progress */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-96 text-sm border-y md:border-y-0 md:border-l border-slate-100 py-3 md:py-0 md:pl-5">
                  {/* Promo tracker */}
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                      Beneficio Promocional
                    </span>
                    {isPromoActive ? (
                      <div className="mt-1">
                        <span className="font-bold text-blue-700 block">
                          Mes {currentMonthIndex} de {client.promoTotalMonths} (50% OFF)
                        </span>
                        <span className="text-slate-600 text-xs font-medium">
                          Cuota: {QuotesService.formatCurrency(currentFee)}/mes
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <span className="font-bold text-slate-800 block">Tarifa Estándar</span>
                        <span className="text-slate-600 text-xs font-medium">
                          {QuotesService.formatCurrency(currentFee)}/mes
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Onboarding checklist indicator */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
                        Onboarding
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        {completedTasks}/3 ({onboardingPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${onboardingPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block font-medium">
                      {completedTasks === 3 ? 'Listo para activar' : 'Puesta a punto pendiente'}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 justify-end shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('portal', client.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200 transition shadow-2xs cursor-pointer"
                    title="Abrir Portal del Cliente"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ver Portal</span>
                  </button>
                  <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 text-slate-400 flex items-center justify-center transition">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
