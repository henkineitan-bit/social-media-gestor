import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  FileText, 
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  Megaphone,
  HelpCircle
} from 'lucide-react';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../core/models/auth.model';
import { LoginModalComponent } from '../../features/auth/login-modal.component';
import { ProfileModalComponent } from './profile-modal.component';
import { BrandLogo } from './brand-logo.component';
import { BrandIcon } from './brand-icon.component';
import { AdminHelpModalComponent } from './admin-help-modal.component';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
    const unsubscribe = AuthService.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleNav = (route: string, param?: string) => {
    onNavigate(route, param);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    onNavigate('store');
    setMobileMenuOpen(false);
  };

  const isClient = currentUser?.role === 'client';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'team';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo Brand */}
          <div className="flex items-center gap-2 xl:gap-5 shrink-0">
            <button
              onClick={() => handleNav(isAdmin ? 'dashboard' : (isClient ? 'portal' : 'store'), isClient ? currentUser?.clientId : undefined)}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer shrink-0"
              title="Ir al inicio"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1760FF] flex items-center justify-center p-2 shadow-xs group-hover:bg-[#124ecc] transition shrink-0">
                <BrandLogo variant="isotipo" theme="white" className="w-full h-full" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-[#081B3A] tracking-tight text-base sm:text-lg whitespace-nowrap leading-none">
                    Gestión Digital
                  </span>
                  {isAdmin && (
                    <span className="text-[#1760FF] font-bold text-[10px] leading-none px-1.5 py-0.5 bg-[#E8F0FF] rounded border border-[#B8D2FF] shrink-0 uppercase tracking-wider">
                      PRO
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs text-[#64748B] font-medium whitespace-nowrap mt-1 leading-none">
                  {isAdmin ? 'Panel de Administración & CRM' : 'Servicios & Social Media'}
                </span>
              </div>
            </button>

            {/* Admin Navigation Tabs */}
            {isAdmin && (
              <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 ml-2 xl:ml-3 shrink-0">
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
                    currentRoute === 'dashboard' ? 'text-[#1760FF] bg-[#E8F0FF] font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BrandIcon name="cotizaciones" className="w-4 h-4 shrink-0" /> Cotizaciones
                </button>
                <button
                  onClick={() => handleNav('builder')}
                  className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
                    currentRoute === 'builder' ? 'text-[#1760FF] bg-[#E8F0FF] font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BrandIcon name="nueva" className="w-4 h-4 shrink-0" /> Nueva
                </button>
                <button
                  onClick={() => handleNav('crm-list')}
                  className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
                    currentRoute === 'crm-list' || currentRoute === 'crm-detail' ? 'text-[#1760FF] bg-[#E8F0FF] font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BrandIcon name="crm-clientes" className="w-4 h-4 shrink-0" /> CRM Clientes
                </button>
                <button
                  onClick={() => handleNav('catalog')}
                  className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
                    currentRoute === 'catalog' ? 'text-[#1760FF] bg-[#E8F0FF] font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BrandIcon name="catalogo-precios" className="w-4 h-4 shrink-0" /> Catálogo & Precios
                </button>
                <button
                  onClick={() => handleNav('catalog', 'promotions')}
                  className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-100 transition cursor-pointer whitespace-nowrap shrink-0"
                  title="Gestionar Banners de la Tienda y Promociones"
                >
                  <Megaphone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Banners & Promos</span>
                </button>
              </nav>
            )}

            {/* Client Navigation Tabs (discreet, client-specific) */}
            {isClient && (
              <nav className="hidden md:flex items-center gap-1.5 xl:gap-2 ml-2 xl:ml-4 shrink-0">
                <button
                  onClick={() => handleNav('portal', currentUser?.clientId)}
                  className={`flex items-center gap-2 px-3 py-1.5 xl:px-3.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
                    currentRoute === 'portal' ? 'text-[#1760FF] bg-[#E8F0FF] font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BrandIcon name="entregables" className="w-4 h-4 shrink-0" /> Mi Portal de Entregas
                </button>
                <button
                  onClick={() => handleNav('proposal', 'familia-cardoso')}
                  className={`flex items-center gap-2 px-3 py-1.5 xl:px-3.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
                    currentRoute === 'proposal' ? 'text-[#1760FF] bg-[#E8F0FF] font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" /> Mi Propuesta de Servicio
                </button>
                <button
                  onClick={() => handleNav('store')}
                  className="flex items-center gap-2 px-3 py-1.5 xl:px-3.5 xl:py-2 text-xs xl:text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg transition cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BrandIcon name="ver-tienda" className="w-4 h-4 shrink-0" /> Servicios & Planes
                </button>
              </nav>
            )}
          </div>

          {/* Right Area: Vistas de Cliente & Perfil */}
          <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Accesos a Vistas de Cara al Cliente (Para el Administrador) */}
            {isAdmin && (
              <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => handleNav('portal', 'client-familia-cardoso')}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
                    currentRoute === 'portal'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-white'
                  }`}
                  title="Ver el Portal del Cliente & Publicidad"
                >
                  <BrandIcon name="entregables" className={`w-3.5 h-3.5 ${currentRoute === 'portal' ? 'text-white' : 'text-blue-600'} shrink-0`} />
                  <span>Portal Cliente</span>
                </button>

                <button
                  onClick={() => handleNav('store')}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
                    currentRoute === 'store'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-700 hover:text-emerald-700 hover:bg-white'
                  }`}
                  title="Ver la Tienda Pública de Servicios"
                >
                  <BrandIcon name="ver-tienda" className={`w-3.5 h-3.5 ${currentRoute === 'store' ? 'text-white' : 'text-emerald-600'} shrink-0`} />
                  <span>Ver Tienda</span>
                </button>
              </div>
            )}

            {currentUser ? (
              <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
                    title="Centro de Ayuda y Guías del Sistema"
                    aria-label="Centro de Ayuda"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs xl:text-sm text-slate-700 transition cursor-pointer text-left shrink-0"
                  title="Ver perfil y cambiar contraseña"
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span className="font-semibold text-slate-900 whitespace-nowrap">{currentUser.name}</span>
                  <span className={`text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5 rounded-md font-bold shrink-0 ${
                    currentUser.role === 'admin' 
                      ? 'bg-blue-100 text-blue-700' 
                      : isAdmin 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {currentUser.role === 'admin' ? 'Admin' : isAdmin ? 'Equipo' : 'Cliente'}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 xl:p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-3.5 xl:px-4 py-1.5 xl:py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs xl:text-sm rounded-xl shadow-sm shadow-blue-500/20 transition cursor-pointer shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 overflow-hidden shadow-lg"
          >
            {currentUser ? (
              <div className="p-3 mb-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left"
                >
                  <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <span className="text-[10px] text-blue-600 font-semibold underline">Ver perfil / Cambiar clave</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-rose-600 hover:underline flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 mb-2 bg-blue-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Iniciar Sesión
              </button>
            )}

            {isAdmin && (
              <>
                <button onClick={() => handleNav('dashboard')} className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Cotizaciones</button>
                <button onClick={() => handleNav('builder')} className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Nueva Cotización</button>
                <button onClick={() => handleNav('crm-list')} className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">CRM Clientes</button>
                <button onClick={() => handleNav('catalog')} className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Catálogo & Precios</button>
                <button onClick={() => handleNav('catalog', 'promotions')} className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-indigo-600" />
                  <span>Banners & Promos Tienda</span>
                </button>
                <button onClick={() => handleNav('portal', 'client-familia-cardoso')} className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between">
                  <span>Portal Cliente & Publicidad</span>
                  <span className="text-[11px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowHelpModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Centro de Ayuda & Guías</span>
                </button>
              </>
            )}

            {isClient && (
              <>
                <button onClick={() => handleNav('portal', currentUser?.clientId)} className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded-lg">Mi Portal de Entregas</button>
                <button onClick={() => handleNav('proposal', 'familia-cardoso')} className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Mi Propuesta</button>
              </>
            )}

            <button onClick={() => handleNav('store')} className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Tienda de Servicios</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* Modales fuera de header para evitar containing block de backdrop-blur */}
    <LoginModalComponent
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      onSuccess={(user, redirectTo) => {
        setShowLoginModal(false);
        if (user.role === 'client') {
          onNavigate('portal', user.clientId || 'client-familia-cardoso');
        } else {
          onNavigate('dashboard');
        }
      }}
    />

    <ProfileModalComponent
      isOpen={showProfileModal}
      onClose={() => setShowProfileModal(false)}
      currentUser={currentUser}
    />

    {/* Centro de Ayuda & Documentación */}
    <AdminHelpModalComponent
      isOpen={showHelpModal}
      onClose={() => setShowHelpModal(false)}
      onNavigate={onNavigate}
    />
  </>
);
};
