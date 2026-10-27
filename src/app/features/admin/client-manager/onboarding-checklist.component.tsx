import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Instagram, 
  Image as ImageIcon, 
  PhoneCall, 
  Sparkles, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Client, OnboardingState } from '../../../core/models/client.model';
import { CustomCheckbox } from '../../../shared/components/custom-checkbox.component';

interface OnboardingChecklistProps {
  client: Client;
  onUpdateOnboarding: (onboarding: OnboardingState) => void;
  onPromoteToActive: () => void;
}

export const OnboardingChecklistComponent: React.FC<OnboardingChecklistProps> = ({
  client,
  onUpdateOnboarding,
  onPromoteToActive,
}) => {
  const { onboarding } = client;

  const handleToggle = (key: keyof Pick<OnboardingState, 'contactDataCompleted' | 'logoReceived' | 'aestheticStandardized'>) => {
    onUpdateOnboarding({
      ...onboarding,
      [key]: !onboarding[key],
    });
  };

  const handleChange = (key: keyof OnboardingState, value: string) => {
    onUpdateOnboarding({
      ...onboarding,
      [key]: value,
    });
  };

  // Calcular progreso
  const completedCount = [
    onboarding.contactDataCompleted,
    onboarding.logoReceived,
    onboarding.aestheticStandardized,
  ].filter(Boolean).length;
  const progressPct = Math.round((completedCount / 3) * 100);
  const isAllCompleted = completedCount === 3;

  return (
    <div className="space-y-6">
      {/* Progreso del Onboarding */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900 font-heading">
              Puesta a Punto & Configuración Inicial
            </h3>
          </div>
          <span className="text-xs font-bold text-blue-600 font-heading">
            {completedCount} de 3 Tareas ({progressPct}%)
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Banner 100% completado -> Promover a ACTIVO */}
      {isAllCompleted && client.status === 'ONBOARDING' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-blue-900 text-sm font-heading block">
                ¡Puesta a Punto Inicial Completada al 100%!
              </span>
              <p className="text-xs text-blue-800">
                El perfil de Instagram está optimizado. Puedes pasar el estado del cliente a Activo para iniciar el flujo de publicaciones semanales.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onPromoteToActive}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-blue-500/20 transition shrink-0 cursor-pointer"
          >
            <span>Activar Cliente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Los 3 Entregables del Checklist */}
      <div className="space-y-4">
        {/* Tarea 1: Contacto Completo */}
        <div className={`bg-white rounded-xl border p-5 transition shadow-xs ${
          onboarding.contactDataCompleted ? 'border-emerald-200 bg-emerald-50/15' : 'border-slate-200'
        }`}>
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5">
              <CustomCheckbox
                checked={onboarding.contactDataCompleted}
                onChange={() => handleToggle('contactDataCompleted')}
                size="lg"
                variant="emerald"
                aria-label="Marcar contacto completado"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${
                  onboarding.contactDataCompleted ? 'text-slate-900 line-through decoration-slate-300' : 'text-slate-900'
                }`}>
                  1. Carga e integración de datos de contacto completos
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Entregable Setup</span>
              </div>
              <p className="text-xs text-slate-500">
                Configuración en bio de WhatsApp Business, correo institucional, ubicación física y botones de acción rápida.
              </p>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Notas de Contacto Registradas
                </label>
                <textarea
                  rows={2}
                  value={onboarding.contactInfoNotes}
                  onChange={(e) => handleChange('contactInfoNotes', e.target.value)}
                  placeholder="Ej. WhatsApp: +54 9 11 5432-8900 | info@cliente.com | Av. Libertador 1200..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tarea 2: Logo en Alta Resolución */}
        <div className={`bg-white rounded-xl border p-5 transition shadow-xs ${
          onboarding.logoReceived ? 'border-emerald-200 bg-emerald-50/15' : 'border-slate-200'
        }`}>
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5">
              <CustomCheckbox
                checked={onboarding.logoReceived}
                onChange={() => handleToggle('logoReceived')}
                size="lg"
                variant="emerald"
                aria-label="Marcar logo recibido"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${
                  onboarding.logoReceived ? 'text-slate-900 line-through decoration-slate-300' : 'text-slate-900'
                }`}>
                  2. Carga e implementación del logo en alta resolución
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Activo Vectorial</span>
              </div>
              <p className="text-xs text-slate-500">
                Avatar circular optimizado para móvil, versiones en fondo claro/oscuro y favicon.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={onboarding.highResLogoUrl}
                  onChange={(e) => handleChange('highResLogoUrl', e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/carpeta-del-logo"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                />
                {onboarding.highResLogoUrl && (
                  <a
                    href={onboarding.highResLogoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition shrink-0"
                    title="Abrir carpeta de Drive"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tarea 3: Estandarización Estética General */}
        <div className={`bg-white rounded-xl border p-5 transition shadow-xs ${
          onboarding.aestheticStandardized ? 'border-emerald-200 bg-emerald-50/15' : 'border-slate-200'
        }`}>
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5">
              <CustomCheckbox
                checked={onboarding.aestheticStandardized}
                onChange={() => handleToggle('aestheticStandardized')}
                size="lg"
                variant="emerald"
                aria-label="Marcar estética estandarizada"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${
                  onboarding.aestheticStandardized ? 'text-slate-900 line-through decoration-slate-300' : 'text-slate-900'
                }`}>
                  3. Emprolijamiento y estandarización estética general de la cuenta
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Branding</span>
              </div>
              <p className="text-xs text-slate-500">
                Portadas de historias destacadas, orden visual de la grilla y alineación cromática.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Usuario de Instagram
                  </label>
                  <div className="relative">
                    <Instagram className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={onboarding.instagramHandle}
                      onChange={(e) => handleChange('instagramHandle', e.target.value)}
                      placeholder="@usuario"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Paleta de Marca / Notas Estéticas
                  </label>
                  <input
                    type="text"
                    value={onboarding.brandPaletteNotes}
                    onChange={(e) => handleChange('brandPaletteNotes', e.target.value)}
                    placeholder="Azul #1D4ED8, Dorado, Tipografía moderna..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
