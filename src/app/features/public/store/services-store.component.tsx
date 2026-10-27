import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Sliders, 
  MessageCircle, 
  Users, 
  LogIn,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { ModuleTemplate } from '../../../core/models/quote.model';
import { PredefinedPlan } from '../../../core/models/catalog.model';
import { CatalogService } from '../../../core/services/catalog.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/auth.model';
import { PlanCardsComponent } from './plan-cards.component';
import { CustomBuilderModalComponent } from './custom-builder-modal.component';
import { LoginModalComponent } from '../../auth/login-modal.component';
import { StorePromoBannerComponent } from './store-promo-banner.component';
import { BrandLogo } from '../../../shared/components/brand-logo.component';
import { BrandIcon } from '../../../shared/components/brand-icon.component';
import { PromotionsService } from '../../../core/services/promotions.service';
import { PromotionalBanner, BannerPlacement } from '../../../core/models/promotion.model';
import { BannerEditorModalComponent } from '../../admin/promotions-manager/banner-editor-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';

interface ServicesStoreProps {
  onNavigateToProposal: (slug: string) => void;
  onNavigateToPortal: (clientId: string) => void;
  onNavigateToAdmin: () => void;
  onNavigateToBanners?: () => void;
}

export const ServicesStoreComponent: React.FC<ServicesStoreProps> = ({
  onNavigateToProposal,
  onNavigateToPortal,
  onNavigateToAdmin,
  onNavigateToBanners,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PredefinedPlan | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());

  // Modal y Gestión de Banners para Administrador en Tienda
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromotionalBanner | null>(null);
  const [bannerPlacementForNew, setBannerPlacementForNew] = useState<BannerPlacement>('STORE_HERO');
  const [bannerToDelete, setBannerToDelete] = useState<PromotionalBanner | null>(null);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'team';

  // Dynamic modules from CatalogService
  const [templates, setTemplates] = useState<ModuleTemplate[]>(() => CatalogService.getActiveTemplates());

  // Dynamic promotions from PromotionsService
  const [heroBanners, setHeroBanners] = useState<PromotionalBanner[]>(() => PromotionsService.getActiveBanners('STORE_HERO'));
  const [midBanners, setMidBanners] = useState<PromotionalBanner[]>(() => PromotionsService.getActiveBanners('STORE_BETWEEN_SECTIONS'));
  const [topNotice, setTopNotice] = useState(() => PromotionsService.getConfig().storeTopBarNotice);

  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
    const unsubAuth = AuthService.subscribe((u) => setCurrentUser(u));

    setTemplates(CatalogService.getActiveTemplates());
    const unsubCatalog = CatalogService.subscribe(() => {
      setTemplates(CatalogService.getActiveTemplates());
    });

    const refreshPromos = () => {
      const isAdm = AuthService.getCurrentUser()?.role === 'admin' || AuthService.getCurrentUser()?.role === 'team';
      if (isAdm) {
        setHeroBanners(PromotionsService.getBanners().filter((b) => b.placement === 'STORE_HERO'));
        setMidBanners(PromotionsService.getBanners().filter((b) => b.placement === 'STORE_BETWEEN_SECTIONS'));
      } else {
        setHeroBanners(PromotionsService.getActiveBanners('STORE_HERO'));
        setMidBanners(PromotionsService.getActiveBanners('STORE_BETWEEN_SECTIONS'));
      }
      setTopNotice(PromotionsService.getConfig().storeTopBarNotice);
    };
    refreshPromos();
    const unsubPromos = PromotionsService.subscribe(refreshPromos);

    return () => {
      unsubAuth();
      unsubCatalog();
      unsubPromos();
    };
  }, []);

  const handleOpenPlan = (plan: PredefinedPlan) => {
    setSelectedPlan(plan);
    setIsBuilderOpen(true);
  };

  const handleOpenCustom = () => {
    setSelectedPlan(null);
    setIsBuilderOpen(true);
  };

  const handlePortalAction = () => {
    if (currentUser?.role === 'client') {
      onNavigateToPortal(currentUser.clientId || 'client-familia-cardoso');
    } else if (currentUser?.role === 'admin' || currentUser?.role === 'team') {
      onNavigateToAdmin();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleOpenNewBanner = (placement: BannerPlacement = 'STORE_HERO') => {
    setEditingBanner(null);
    setBannerPlacementForNew(placement);
    setIsBannerModalOpen(true);
  };

  const handleEditBanner = (banner: PromotionalBanner) => {
    setEditingBanner(banner);
    setIsBannerModalOpen(true);
  };

  const handleDeleteBanner = (banner: PromotionalBanner) => {
    setBannerToDelete(banner);
  };

  const handleConfirmDeleteBanner = () => {
    if (bannerToDelete) {
      PromotionsService.deleteBanner(bannerToDelete.id);
      setBannerToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Promotional Bar Notice si está habilitado */}
      {topNotice.enabled && (
        <aside aria-label="Aviso promocional" className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-xs flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
          <span>
            {topNotice.text} <strong className="text-amber-200">{topNotice.highlight}</strong>
          </span>
          {topNotice.buttonText && topNotice.buttonLink && (
            <a
              href={topNotice.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 font-bold text-amber-300 hover:text-white underline inline-flex items-center gap-1 shrink-0"
            >
              <span>{topNotice.buttonText}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </aside>
      )}

      {/* Top Banner Navigation for Store */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1760FF] flex items-center justify-center p-2 shadow-xs shrink-0">
              <BrandLogo variant="isotipo" theme="white" className="w-full h-full" />
            </div>
            <div>
              <span className="font-heading font-black text-[#081B3A] tracking-tight text-base sm:text-lg block">
                Gestión Digital & Social Media
              </span>
              <span className="text-xs text-[#64748B] font-medium block">
                Catálogo Oficial de Servicios & Planes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenCustom}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-[#1760FF] bg-[#E8F0FF] hover:bg-blue-100 rounded-xl border border-[#B8D2FF] transition cursor-pointer"
            >
              <BrandIcon name="cotizaciones" className="w-4 h-4" />
              <span>Cotizador a Medida</span>
            </button>

            {currentUser ? (
              <button
                onClick={handlePortalAction}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                {currentUser.role === 'client' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mi Portal ({currentUser.name})</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#1760FF]" />
                    <span>Ir al Panel Admin</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#1760FF] hover:bg-[#124ecc] rounded-xl shadow-sm shadow-blue-500/20 transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Barra de Gestión de Banners para el Administrador */}
      {isAdmin && (
        <aside aria-label="Gestión de Banners" className="bg-slate-900 text-white py-3 px-4 sm:px-6 shadow-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-bold text-amber-300 font-heading">Panel Administrador en la Tienda:</span>
              <span className="text-slate-300">Podés agregar, editar o activar banners promocionales para tus clientes aquí en vivo.</span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenNewBanner('STORE_HERO')}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Añadir Banner a la Tienda</span>
              </button>
              {onNavigateToBanners && (
                <button
                  type="button"
                  onClick={onNavigateToBanners}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition cursor-pointer text-xs"
                >
                  <span>Banners & Marketing</span>
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-10 text-center space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold shadow-2xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>Bonificación Especial: 50% OFF durante los primeros 6 meses</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading max-w-3xl mx-auto leading-tight"
        >
          Impulsamos tu Negocio con <span className="text-blue-600">Gestión Digital & Social Media</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Estrategia mensual, diseño gráfico profesional y videos dinámicos (Reels) para Instagram. Contratación transparente, sin contratos forzosos y con revisión semanal de tus entregables.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="pt-3 flex flex-wrap items-center justify-center gap-3.5"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenCustom}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-sm shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Sliders className="w-5 h-5" />
            <span>Simular Mi Combo a Medida</span>
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/?text=Hola!%20Quisiera%20consultar%20por%20los%20servicios%20de%20Gesti%C3%B3n%20Digital%20y%20Social%20Media"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>Hablar por WhatsApp</span>
          </motion.a>
        </motion.div>
      </section>

      {/* Banners Promocionales de la Cabecera */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 space-y-4">
        {heroBanners.length > 0 ? (
          <>
            {isAdmin && (
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Banners de Cabecera ({heroBanners.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenNewBanner('STORE_HERO')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Sumar otro banner</span>
                </button>
              </div>
            )}
            {heroBanners.map((banner) => (
              <StorePromoBannerComponent
                key={banner.id}
                banner={banner}
                onOpenBuilder={handleOpenCustom}
                isAdmin={isAdmin}
                onEdit={handleEditBanner}
                onDelete={handleDeleteBanner}
              />
            ))}
          </>
        ) : isAdmin ? (
          <button
            type="button"
            onClick={() => handleOpenNewBanner('STORE_HERO')}
            className="w-full py-6 rounded-3xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>+ Añadir Banner Promocional para la Cabecera de la Tienda</span>
          </button>
        ) : null}
      </section>

      {/* Planes Recomendados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Paquetes de Servicio Recomendados
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Elige el plan que mejor se adapte al momento de tu marca o personaliza tu combo.
          </p>
        </div>

        <PlanCardsComponent onSelectPlan={handleOpenPlan} />
      </section>

      {/* Banners Promocionales Intermedios */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {midBanners.length > 0 ? (
          <>
            {isAdmin && (
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Banners Intermedios ({midBanners.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenNewBanner('STORE_BETWEEN_SECTIONS')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Sumar banner intermedio</span>
                </button>
              </div>
            )}
            {midBanners.map((banner) => (
              <StorePromoBannerComponent
                key={banner.id}
                banner={banner}
                onOpenBuilder={handleOpenCustom}
                isAdmin={isAdmin}
                onEdit={handleEditBanner}
                onDelete={handleDeleteBanner}
              />
            ))}
          </>
        ) : isAdmin ? (
          <button
            type="button"
            onClick={() => handleOpenNewBanner('STORE_BETWEEN_SECTIONS')}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-white hover:bg-emerald-50/30 text-slate-600 hover:text-emerald-700 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Añadir Banner Promocional Intermedio (entre paquetes y módulos)</span>
          </button>
        ) : null}
      </section>

      {/* Catálogo de Módulos a la Carta */}
      {templates.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="border-t border-slate-200 pt-10 text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Módulos Individuales a la Carta
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Conoce cada uno de los componentes de trabajo que puedes combinar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((tpl, idx) => (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                whileHover={{ y: -5, transition: { duration: 0.18 } }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {tpl.tag}
                    </span>
                    <span className="font-bold text-slate-900 text-base font-heading">
                      {QuotesService.formatCurrency(tpl.suggestedPrice)}/m
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-heading">{tpl.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{tpl.subtitle}</p>
                  
                  <ul className="space-y-2 pt-3 border-t border-slate-100 text-sm text-slate-700">
                    {tpl.deliverables.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleOpenCustom}
                  className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-sm rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  + Incluir en mi cotización
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Metodología de Flujo de Trabajo y Entregables */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-[#DCE6F4] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1760FF] text-xs font-bold border border-[#B8D2FF]">
                <BrandIcon name="entregables" className="w-4 h-4" />
                <span>FLUJO DE ENTREGABLES Y SERVICIOS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#081B3A] font-heading leading-tight">
                Del requerimiento a la publicación semanal
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Trabajamos con un proceso predecible y ordenado: cargamos tus insumos, producimos el contenido estético y en video, y lo recibes en tu portal privado para aprobación en un solo clic.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm font-semibold text-[#081B3A]">
                  <span className="w-6 h-6 rounded-full bg-[#DDF8EC] text-[#12B76A] flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span>Estrategia, guiones y definición de contenidos</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-[#081B3A]">
                  <span className="w-6 h-6 rounded-full bg-[#E8F0FF] text-[#1760FF] flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span>Diseño de carruseles, posts y edición de Reels</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-[#081B3A]">
                  <span className="w-6 h-6 rounded-full bg-[#FFF3D6] text-[#F59E0B] flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span>Revisión en tu portal y publicación programada</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 flex justify-center">
              <img
                src="/brand/illustrations/flujo-entregables.svg"
                alt="Flujo de entregables y servicios"
                className="w-full max-w-lg h-auto rounded-2xl drop-shadow-sm"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección Clientes Activos: Acceso Unificado */}
      <section className="max-w-4xl mx-auto px-4 py-8 mb-12">
        <div className="bg-[#081B3A] text-white p-7 sm:p-9 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-[#1760FF] tracking-wider">
              <Users className="w-4 h-4" />
              <span>ZONA DE CLIENTES ACTIVOS</span>
            </div>
            <h3 className="text-2xl font-black font-heading text-white">
              ¿Ya tienes un servicio contratado?
            </h3>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Inicia sesión con tu correo para acceder directamente a tu portal de entregas semanales y revisar tus publicaciones de Instagram.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePortalAction}
              className="px-6 py-3.5 bg-[#1760FF] hover:bg-[#124ecc] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-900/30 transition flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{currentUser ? 'Ir a Mi Portal de Entregas' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <span className="text-xs text-slate-400 font-medium">
              Acceso seguro con correo y contraseña
            </span>
          </div>
        </div>
      </section>

      {/* Modal Configurador Personalizado */}
      <CustomBuilderModalComponent
        initialPlan={selectedPlan}
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onGeneratedQuote={(slug) => onNavigateToProposal(slug)}
      />

      {/* Modal Unificado de Inicio de Sesión */}
      <LoginModalComponent
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(user) => {
          setIsLoginModalOpen(false);
          if (user.role === 'client') {
            onNavigateToPortal(user.clientId || 'client-familia-cardoso');
          } else {
            onNavigateToAdmin();
          }
        }}
      />

      {/* Modal Editor de Banners para el Administrador */}
      <BannerEditorModalComponent
        isOpen={isBannerModalOpen}
        banner={editingBanner}
        defaultPlacement={bannerPlacementForNew}
        onClose={() => {
          setIsBannerModalOpen(false);
          setEditingBanner(null);
        }}
        onSaved={() => {
          const isAdm = AuthService.getCurrentUser()?.role === 'admin' || AuthService.getCurrentUser()?.role === 'team';
          if (isAdm) {
            setHeroBanners(PromotionsService.getBanners().filter((b) => b.placement === 'STORE_HERO'));
            setMidBanners(PromotionsService.getBanners().filter((b) => b.placement === 'STORE_BETWEEN_SECTIONS'));
          } else {
            setHeroBanners(PromotionsService.getActiveBanners('STORE_HERO'));
            setMidBanners(PromotionsService.getActiveBanners('STORE_BETWEEN_SECTIONS'));
          }
        }}
      />

      {/* Modal de Confirmación para Eliminar Banner */}
      <ConfirmModalComponent
        isOpen={bannerToDelete !== null}
        onClose={() => setBannerToDelete(null)}
        onConfirm={handleConfirmDeleteBanner}
        title="¿Eliminar este banner promocional?"
        description={
          bannerToDelete ? (
            <p>
              Estás por eliminar el banner <strong className="text-slate-900 font-bold">{bannerToDelete.title}</strong>. Dejará de mostrarse en la tienda pública.
            </p>
          ) : null
        }
        confirmText="Sí, Eliminar Banner"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};
