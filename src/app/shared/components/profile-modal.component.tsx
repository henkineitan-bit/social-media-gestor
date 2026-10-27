import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  Check, 
  User, 
  Mail, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Users
} from 'lucide-react';
import { AuthService, AdminAccount } from '../../core/services/auth.service';
import { AuthUser, UserRole } from '../../core/models/auth.model';
import { CustomDropdown, DropdownOption } from './custom-dropdown.component';
import { ConfirmModalComponent } from './confirm-modal.component';

const ADMIN_ROLE_OPTIONS: DropdownOption<UserRole>[] = [
  { value: 'admin', label: 'Administrador (Total)', description: 'Control total' },
  { value: 'team', label: 'Gestor de Equipo', description: 'Gestión operativa' },
];

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
}

export const ProfileModalComponent: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'team'>('profile');
  const [name, setName] = useState(currentUser?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para nuevo administrador
  const [adminList, setAdminList] = useState<AdminAccount[]>([]);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<UserRole>('admin');
  const [teamMsg, setTeamMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAdminList(AuthService.getAdminAccounts());
      setName(currentUser?.name || '');
      setMsg(null);
      setTeamMsg(null);
    }
  }, [isOpen, currentUser]);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'team';

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!currentUser) return;

    if (!newPassword.trim()) {
      setMsg({ text: 'Por favor ingresa una nueva contraseña.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMsg({ text: 'La contraseña debe tener al menos 6 caracteres.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ text: 'Las contraseñas no coinciden.', type: 'error' });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const ok = AuthService.updateTeamPassword(currentUser.email, newPassword);
      if (name.trim() && name !== currentUser.name) {
        AuthService.updateTeamProfile(currentUser.email, name.trim());
      }
      setIsSaving(false);
      if (ok) {
        setMsg({ text: '¡Contraseña actualizada correctamente!', type: 'success' });
        setNewPassword('');
        setConfirmPassword('');
        setAdminList(AuthService.getAdminAccounts());
      } else {
        setMsg({ text: 'No se pudo actualizar la contraseña. Revisa tus permisos.', type: 'error' });
      }
    }, 300);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setTeamMsg(null);

    const res = AuthService.createAdminAccount({
      name: newAdminName,
      email: newAdminEmail,
      pass: newAdminPass,
      role: newAdminRole,
    });

    if (res.success) {
      setTeamMsg({ 
        text: `¡Cuenta para ${newAdminName} creada y sincronizada!`, 
        type: 'success' 
      });
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPass('');
      setAdminList(AuthService.getAdminAccounts());
    } else {
      setTeamMsg({ text: res.error || 'Error al crear cuenta.', type: 'error' });
    }
  };

  const handleDeleteAdmin = (id: string, adminEmail: string) => {
    setAdminToDelete({ id, email: adminEmail });
  };

  const handleConfirmDeleteAdmin = () => {
    if (adminToDelete) {
      const ok = AuthService.deleteAdminAccount(adminToDelete.id);
      if (ok) {
        setAdminList(AuthService.getAdminAccounts());
        setTeamMsg({ text: 'Administrador eliminado del sistema.', type: 'success' });
      }
      setAdminToDelete(null);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Gestión de Administradores
              </h2>
              <p className="text-xs text-slate-500">
                Seguridad & Sincronización en la Nube
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        {isAdmin && (
          <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mi Cuenta & Clave</span>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'team'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Equipo / Admins ({adminList.length})</span>
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'profile' && (
            <>
              {/* Info Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">Nombre:</span>
                  <span className="text-slate-700 font-medium">{currentUser.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">Email:</span>
                  <span className="text-slate-900 font-mono font-medium">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Rol asignado:</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700">
                    {currentUser.role === 'admin' ? 'Administrador Principal (PRO)' : 'Gestor de Equipo'}
                  </span>
                </div>
              </div>

              {/* Password update form */}
              {isAdmin && (
                <form onSubmit={handleUpdatePassword} className="space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span>Cambiar mi Contraseña de Acceso</span>
                  </div>

                  {msg && (
                    <div
                      className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                        msg.type === 'success'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border border-rose-200 text-rose-700'
                      }`}
                    >
                      {msg.type === 'success' ? (
                        <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                      )}
                      <span>{msg.text}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la nueva contraseña"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    <span>{isSaving ? 'Guardando...' : 'Guardar Nueva Contraseña'}</span>
                  </button>
                </form>
              )}
            </>
          )}

          {activeTab === 'team' && (
            <div className="space-y-5">
              {teamMsg && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    teamMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-700'
                  }`}
                >
                  {teamMsg.type === 'success' ? (
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{teamMsg.text}</span>
                </div>
              )}

              {/* Lista actual en la nube */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Cuentas de Administrador ({adminList.length})
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {adminList.map((admin) => (
                    <div
                      key={admin.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{admin.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                            {admin.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">{admin.email}</p>
                        <p className="text-[10px] text-slate-400">ID de Cuenta: <span className="font-mono">{admin.id}</span></p>
                      </div>

                      {admin.email.toLowerCase() !== 'martinrierajw@gmail.com' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Eliminar administrador"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulario nuevo administrador */}
              <form onSubmit={handleCreateAdmin} className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Crear Nuevo Administrador / Gestor</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Gómez"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase">Rol</label>
                    <CustomDropdown<UserRole>
                      value={newAdminRole}
                      onChange={(newRole) => setNewAdminRole(newRole)}
                      options={ADMIN_ROLE_OPTIONS}
                      variant="select"
                      className="py-1.5 px-2.5 text-xs rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase">Contraseña</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Crear y Guardar Administrador</span>
                </motion.button>
              </form>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de Confirmación para Eliminar Administrador */}
      <ConfirmModalComponent
        isOpen={adminToDelete !== null}
        onClose={() => setAdminToDelete(null)}
        onConfirm={handleConfirmDeleteAdmin}
        title="¿Eliminar acceso de administrador?"
        description={
          adminToDelete ? (
            <p>
              Estás por eliminar el acceso al sistema de <strong className="text-slate-900 font-bold">{adminToDelete.email}</strong>. Este usuario ya no podrá iniciar sesión en el panel.
            </p>
          ) : null
        }
        confirmText="Sí, Eliminar Acceso"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  )}
</AnimatePresence>,
document.body
  );
};
