import React, { useState } from 'react';
import { KeyRound, Mail, Copy, Check, Save } from 'lucide-react';
import { Client } from '../../../core/models/client.model';
import { ClientsService } from '../../../core/services/clients.service';

interface ClientCredentialsCardProps {
  client: Client;
}

export const ClientCredentialsCardComponent: React.FC<ClientCredentialsCardProps> = ({ client }) => {
  const [email, setEmail] = useState(client.email || `cliente.${client.id}@gestion.com`);
  const [password, setPassword] = useState(client.loginPassword || 'cliente123');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    ClientsService.saveClient({
      ...client,
      email: email.trim(),
      loginPassword: password.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyAccessMessage = () => {
    const text = `Hola ${client.name}!\nYa tienes habilitado tu acceso al Portal de Gestión Digital & Social Media:\n\n🌐 Enlace: ${window.location.origin}\n📧 Usuario: ${email}\n🔑 Contraseña: ${password}\n\nDesde allí podrás subir los insumos semanales y aprobar tus publicaciones antes de salir en Instagram.`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Credenciales de Acceso del Cliente
            </h3>
            <p className="text-xs text-slate-500">
              Datos para que este cliente inicie sesión en su portal privado.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAccessMessage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition cursor-pointer self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
          <span>{copied ? '¡Copiado para WhatsApp!' : 'Copiar Acceso para Cliente'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <label className="block font-semibold text-slate-700 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Correo Electrónico de Login</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-semibold text-slate-700 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span>Contraseña Asignada</span>
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px] text-slate-400">
          El cliente usará la misma pantalla de inicio de sesión que el equipo, pero ingresará directo a su portal.
        </p>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition cursor-pointer"
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? 'Guardado' : 'Guardar Cambios'}</span>
        </button>
      </div>
    </div>
  );
};
