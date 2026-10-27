import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  UploadCloud, 
  ExternalLink, 
  ShieldCheck, 
  Info, 
  Save, 
  Check,
  Instagram
} from 'lucide-react';
import { Client, OnboardingState } from '../../../core/models/client.model';
import { ClientsService } from '../../../core/services/clients.service';

interface PortalAssetsDropProps {
  client: Client;
  onUpdateClient: () => void;
}

export const PortalAssetsDropComponent: React.FC<PortalAssetsDropProps> = ({
  client,
  onUpdateClient,
}) => {
  const { onboarding } = client;
  const [logoUrl, setLogoUrl] = useState(onboarding.highResLogoUrl || '');
  const [contactNotes, setContactNotes] = useState(onboarding.contactInfoNotes || '');
  const [instagram, setInstagram] = useState(onboarding.instagramHandle || '');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    const updatedOnboarding: OnboardingState = {
      ...onboarding,
      highResLogoUrl: logoUrl.trim(),
      logoReceived: Boolean(logoUrl.trim()),
      contactInfoNotes: contactNotes.trim(),
      contactDataCompleted: Boolean(contactNotes.trim()),
      instagramHandle: instagram.trim() || onboarding.instagramHandle,
    };

    ClientsService.updateOnboarding(client.id, updatedOnboarding);
    onUpdateClient();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const pendingCount = [
    onboarding.contactDataCompleted,
    onboarding.logoReceived,
    onboarding.aestheticStandardized,
  ].filter((v) => !v).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-heading">
            Puesta a Punto & Insumos Iniciales de tu Cuenta
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Configuración y optimización de tu perfil institucional en Instagram.
          </p>
        </div>

        <div>
          {pendingCount === 0 ? (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Perfil Inicial 100% Configurado</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-800 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              <Info className="w-4 h-4 text-blue-600" />
              <span>{pendingCount} ítem{pendingCount > 1 ? 's' : ''} pendiente{pendingCount > 1 ? 's' : ''}</span>
            </span>
          )}
        </div>
      </div>

      {/* Recordatorio de Términos */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 sm:p-5 text-sm text-blue-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold">Condición de servicio:</strong> Los insumos gráficos (fotos, videos en alta calidad y logotipos) deben ser proporcionados a tiempo para mantener al día el cronograma y la calidad de las publicaciones semanales.
        </p>
      </div>

      {/* Formulario de insumos */}
      <div className="space-y-4">
        {/* Link del Logo */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
            Enlace a tu Logotipo en Alta Resolución (Google Drive / Dropbox / WeTransfer)
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/tu-logo-en-alta"
              className="w-full text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:border-blue-500 font-mono text-slate-800"
            />
            {logoUrl && (
              <a
                href={logoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition shrink-0"
                title="Abrir enlace"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <span className="text-xs text-slate-500 mt-1.5 block font-medium">
            Aceptamos formatos vectoriales (.AI, .EPS, .SVG, .PDF) o imágenes transparentes (.PNG) en alta definición.
          </span>
        </div>

        {/* Datos de Contacto */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
            Datos de Contacto a Integrar en la Bio y Perfil
          </label>
          <textarea
            rows={3}
            value={contactNotes}
            onChange={(e) => setContactNotes(e.target.value)}
            placeholder="Ej. WhatsApp de atención, correo electrónico de consultas, dirección comercial, horario de atención..."
            className="w-full text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 leading-relaxed"
          />
        </div>

        {/* Instagram Handle */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
            Usuario de Instagram de la Marca
          </label>
          <div className="relative max-w-md">
            <Instagram className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@tu_marca"
              className="w-full text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Botón Guardar Insumos */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {savedToast ? (
            <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" /> ¡Insumos actualizados correctamente!
            </span>
          ) : (
            <span className="text-xs text-slate-500 font-medium">
              Tus datos se sincronizan directamente con el equipo de producción de la agencia.
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Insumos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
