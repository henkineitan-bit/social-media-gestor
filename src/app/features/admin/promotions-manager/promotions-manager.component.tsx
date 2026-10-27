import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Check, 
  X, 
  RotateCcw, 
  Tag, 
  Megaphone, 
  Camera, 
  Sliders, 
  DollarSign, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  PromotionalBanner, 
  ServiceUpgradeOffer, 
  BannerGradient, 
  BannerPlacement, 
  UpgradeIcon, 
  AgencyPromotionsConfig 
} from '../../../core/models/promotion.model';
import { PromotionsService } from '../../../core/services/promotions.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { CustomCheckbox } from '../../../shared/components/custom-checkbox.component';
import { StorePromoBannerComponent } from '../../public/store/store-promo-banner.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { BannerEditorModalComponent } from './banner-editor-modal.component';
import { CollapsibleHelpCardComponent } from '../../../shared/components/collapsible-help-card.component';

const GRADIENT_OPTIONS: { value: BannerGradient; label: string; previewClass: string }[] = [
  { value: 'blue-indigo', label: 'Azul & Índigo (Tecnológico)', previewClass: 'from-blue-600 to-indigo-600' },
  { value: 'emerald-teal', label: 'Esmeralda & Verde (Éxito)', previewClass: 'from-emerald-600 to-teal-600' },
  { value: 'purple-pink', label: 'Púrpura & Rosa (Creativo)', previewClass: 'from-purple-600 to-pink-600' },
  { value: 'amber-orange', label: 'Ámbar & Naranja (Urgencia/Oferta)', previewClass: 'from-amber-500 to-orange-600' },
  { value: 'dark-slate', label: 'Modo Oscuro Elegante', previewClass: 'from-slate-900 to-blue-950' },
];

const PLACEMENT_OPTIONS: { value: BannerPlacement; label: string }[] = [
  { value: 'STORE_HERO', label: 'Tienda Pública (Bajo la cabecera inicial)' },
  { value: 'STORE_BETWEEN_SECTIONS', label: 'Tienda Pública (Entre paquetes y módulos)' },
  { value: 'PORTAL_TOP', label: 'Portal Privado del Cliente (Destacado superior)' },
];

const ICON_OPTIONS: UpgradeIcon[] = ['Camera', 'Sparkles', 'Video', 'Star', 'TrendingUp', 'Megaphone', 'MessageCircle', 'Palette'];

export const PromotionsManagerComponent: React.FC = () => {
  const [config, setConfig] = useState<AgencyPromotionsConfig>(() => PromotionsService.getConfig());
  const [activeSubTab, setActiveSubTab] = useState<'banners' | 'upgrades' | 'store-notice' | 'preview'>('banners');

  // Modal / Form Banner state
  const [editingBanner, setEditingBanner] = useState<PromotionalBanner | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerBadge, setBannerBadge] = useState('🔥 PROMOCIÓN ESPECIAL');
  const [bannerButtonText, setBannerButtonText] = useState('Consultar por WhatsApp');
  const [bannerButtonLink, setBannerButtonLink] = useState('https://wa.me/');
  const [bannerPlacement, setBannerPlacement] = useState<BannerPlacement>('STORE_HERO');
  const [bannerGradient, setBannerGradient] = useState<BannerGradient>('blue-indigo');
  const [bannerActive, setBannerActive] = useState(true);

  // Modal / Form Upgrade state
  const [editingUpgrade, setEditingUpgrade] = useState<ServiceUpgradeOffer | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgTitle, setUpgTitle] = useState('');
  const [upgDesc, setUpgDesc] = useState('');
  const [upgBadge, setUpgBadge] = useState('30% OFF Clientes');
  const [upgRegularPrice, setUpgRegularPrice] = useState(70000);
  const [upgPromoPrice, setUpgPromoPrice] = useState(49000);
  const [upgPeriod, setUpgPeriod] = useState('/mes');
  const [upgFeaturesText, setUpgFeaturesText] = useState('');
  const [upgIcon, setUpgIcon] = useState<UpgradeIcon>('Sparkles');
  const [upgRecommended, setUpgRecommended] = useState('');
  const [upgActive, setUpgActive] = useState(true);

  // Custom Confirm Modals
  const [bannerToDelete, setBannerToDelete] = useState<PromotionalBanner | null>(null);
  const [upgradeToDelete, setUpgradeToDelete] = useState<ServiceUpgradeOffer | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const reloadData = () => {
    setConfig(PromotionsService.getConfig());
  };

  useEffect(() => {
    reloadData();
    const unsub = PromotionsService.subscribe(reloadData);
    return () => unsub();
  }, []);

  // Open banner editor
  const handleOpenBannerModal = (banner?: PromotionalBanner) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerTitle(banner.title);
      setBannerSubtitle(banner.subtitle);
      setBannerBadge(banner.badge);
      setBannerButtonText(banner.buttonText);
      setBannerButtonLink(banner.buttonLink);
      setBannerPlacement(banner.placement);
      setBannerGradient(banner.gradient);
      setBannerActive(banner.active);
    } else {
      setEditingBanner(null);
      setBannerTitle('');
      setBannerSubtitle('');
      setBannerBadge('🔥 PROMOCIÓN ESPECIAL');
      setBannerButtonText('Reclamar Beneficio por WhatsApp');
      setBannerButtonLink('https://wa.me/');
      setBannerPlacement('STORE_HERO');
      setBannerGradient('blue-indigo');
      setBannerActive(true);
    }
    setIsBannerModalOpen(true);
  };

  // Save Banner
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) return;

    const bannerToSave: PromotionalBanner = {
      id: editingBanner ? editingBanner.id : `banner-${Date.now()}`,
      title: bannerTitle.trim(),
      subtitle: bannerSubtitle.trim(),
      badge: bannerBadge.trim() || 'PROMO',
      buttonText: bannerButtonText.trim() || 'Ver Más',
      buttonLink: bannerButtonLink.trim() || 'https://wa.me/',
      placement: bannerPlacement,
      gradient: bannerGradient,
      active: bannerActive,
    };

    PromotionsService.saveBanner(bannerToSave);
    setIsBannerModalOpen(false);
  };

  // Open upgrade editor
  const handleOpenUpgradeModal = (upgrade?: ServiceUpgradeOffer) => {
    if (upgrade) {
      setEditingUpgrade(upgrade);
      setUpgTitle(upgrade.title);
      setUpgDesc(upgrade.shortDescription);
      setUpgBadge(upgrade.badge);
      setUpgRegularPrice(upgrade.regularPrice);
      setUpgPromoPrice(upgrade.promoPrice);
      setUpgPeriod(upgrade.billingPeriod);
      setUpgFeaturesText(upgrade.features.join('\n'));
      setUpgIcon(upgrade.icon);
      setUpgRecommended(upgrade.recommendedFor || '');
      setUpgActive(upgrade.active);
    } else {
      setEditingUpgrade(null);
      setUpgTitle('');
      setUpgDesc('');
      setUpgBadge('Tarifa Bonificada');
      setUpgRegularPrice(60000);
      setUpgPromoPrice(42000);
      setUpgPeriod('/mes');
      setUpgFeaturesText('Beneficio 1 del servicio\nBeneficio 2 con entrega rápida\nAsesoramiento personalizado');
      setUpgIcon('Sparkles');
      setUpgRecommended('');
      setUpgActive(true);
    }
    setIsUpgradeModalOpen(true);
  };

  // Save Upgrade
  const handleSaveUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgTitle.trim()) return;

    const features = upgFeaturesText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const upgradeToSave: ServiceUpgradeOffer = {
      id: editingUpgrade ? editingUpgrade.id : `upg-${Date.now()}`,
      title: upgTitle.trim(),
      shortDescription: upgDesc.trim(),
      badge: upgBadge.trim() || 'Tarifa Bonificada',
      regularPrice: Number(upgRegularPrice) || 50000,
      promoPrice: Number(upgPromoPrice) || 35000,
      billingPeriod: upgPeriod.trim() || '/mes',
      features: features.length > 0 ? features : ['Servicio integral adicional para tu marca'],
      icon: upgIcon,
      recommendedFor: upgRecommended.trim() || undefined,
      active: upgActive,
    };

    PromotionsService.saveUpgrade(upgradeToSave);
    setIsUpgradeModalOpen(false);
  };

  // Save Top Bar Notice
  const handleSaveTopNotice = (enabled: boolean, text: string, highlight: string) => {
    PromotionsService.updateTopBarNotice({
      ...config.storeTopBarNotice,
      enabled,
      text,
      highlight,
    });
  };

  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    PromotionsService.resetToDefaults();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Guía de Banners y Promociones */}
      <CollapsibleHelpCardComponent
        storageKey="promotions_guide"
        title="¿Cómo usar los banners para promocionar tus servicios?"
        subtitle="Publicá ofertas llamativas en tu tienda o portal para captar nuevos clientes."
        steps={[
          {
            title: '1. Crear un Banner',
            description: 'Tocá "+ Nuevo Banner". Escribí un título potente (ej: "50% OFF este mes") y elegí los colores.',
            badge: 'Diseño',
          },
          {
            title: '2. Ubicación en la Web',
            description: 'Elegí si lo querés arriba en la tienda (Store Hero) o dentro del portal para tus clientes activos.',
            badge: 'Ubicación',
          },
          {
            title: '3. Botón de Contacto',
            description: 'Configuralo para que al tocarlo abra un WhatsApp directo con el mensaje que vos elijas.',
            badge: 'Venta',
          },
        ]}
        tip="Foco TDA: Tener 1 o 2 banners claros y bien redactados vende mucho más que llenar la pantalla de anuncios."
        defaultOpen={false}
      />

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('banners')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'banners'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Banners Promocionales ({config.banners.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('upgrades')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'upgrades'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Upgrades Portal de Clientes ({config.upgrades.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('store-notice')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'store-notice'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Aviso Superior Tienda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('preview')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'preview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Vista Previa</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition cursor-pointer"
          title="Restablecer banners y promociones originales"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer Originales</span>
        </button>
      </div>

      {/* SECCIÓN 1: BANNERS PROMOCIONALES */}
      {activeSubTab === 'banners' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Banners Promocionales Configurados
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Aparecen en la Tienda Inicial y en el Portal de Clientes para destacar ofertas, lanzamientos o combos especiales.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenBannerModal()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Banner Promocional</span>
            </button>
          </div>

          <div className="space-y-4">
            {config.banners.map((banner) => (
              <div
                key={banner.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  banner.active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                      {banner.badge}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Ubicación: <strong>{PLACEMENT_OPTIONS.find((p) => p.value === banner.placement)?.label || banner.placement}</strong>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      Estilo: <strong>{banner.gradient}</strong>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-heading">
                    {banner.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    {banner.subtitle}
                  </p>

                  <div className="pt-1 flex items-center gap-2 text-xs text-blue-700 font-semibold">
                    <span>Botón: &quot;{banner.buttonText}&quot;</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-slate-500 font-mono text-[11px] truncate max-w-xs">{banner.buttonLink}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <CustomCheckbox
                    checked={banner.active}
                    onChange={() => PromotionsService.toggleBanner(banner.id)}
                    label={banner.active ? 'Activo' : 'Pausado'}
                    variant={banner.active ? 'emerald' : 'dark'}
                    size="sm"
                  />

                  <button
                    type="button"
                    onClick={() => handleOpenBannerModal(banner)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Editar Banner"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setBannerToDelete(banner)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Eliminar Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: UPGRADES PARA CLIENTES */}
      {activeSubTab === 'upgrades' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Upgrades & Promociones para el Portal de Clientes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Servicios adicionales que tus clientes pueden solicitar con un clic desde su portal privado para aumentar tu facturación.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenUpgradeModal()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Servicio Adicional / Upgrade</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.upgrades.map((upg) => (
              <div
                key={upg.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-xs flex flex-col justify-between space-y-4 ${
                  upg.active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                      {upg.badge}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenUpgradeModal(upg)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpgradeToDelete(upg)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-heading">
                    {upg.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {upg.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Beneficios incluidos:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {upg.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                      {upg.features.length > 3 && (
                        <li className="text-[11px] text-slate-400 italic">
                          + {upg.features.length - 3} beneficio(s) más
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-1.5 font-medium">
                      {QuotesService.formatCurrency(upg.regularPrice)}
                    </span>
                    <span className="text-lg font-black text-slate-900 font-heading">
                      {QuotesService.formatCurrency(upg.promoPrice)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium ml-1">
                      {upg.billingPeriod}
                    </span>
                  </div>

                  <CustomCheckbox
                    checked={upg.active}
                    onChange={() => PromotionsService.toggleUpgrade(upg.id)}
                    label={upg.active ? 'Activo' : 'Oculto'}
                    variant={upg.active ? 'emerald' : 'dark'}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 3: AVISO SUPERIOR DE LA TIENDA */}
      {activeSubTab === 'store-notice' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 max-w-2xl shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Barra Superior de Aviso Promocional en la Tienda
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Franja destacada que se muestra en la parte superior del catálogo de servicios para comunicar beneficios comerciales directos.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <CustomCheckbox
              checked={config.storeTopBarNotice.enabled}
              onChange={(checked) =>
                handleSaveTopNotice(
                  checked,
                  config.storeTopBarNotice.text,
                  config.storeTopBarNotice.highlight
                )
              }
              label="Habilitar barra de aviso promocional en la tienda"
              description="Visible para todos los clientes que ingresen a ver los planes."
              variant="brand"
              size="md"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Texto del Aviso
              </label>
              <input
                type="text"
                value={config.storeTopBarNotice.text}
                onChange={(e) =>
                  handleSaveTopNotice(
                    config.storeTopBarNotice.enabled,
                    e.target.value,
                    config.storeTopBarNotice.highlight
                  )
                }
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                placeholder="Ej. 🔥 Beneficio Especial de Bienvenida:"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Texto Destacado (Negrita / Resaltado)
              </label>
              <input
                type="text"
                value={config.storeTopBarNotice.highlight}
                onChange={(e) =>
                  handleSaveTopNotice(
                    config.storeTopBarNotice.enabled,
                    config.storeTopBarNotice.text,
                    e.target.value
                  )
                }
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                placeholder="Ej. 50% OFF en tu cuota mensual por 6 meses."
              />
            </div>

            {/* Vista Previa del aviso */}
            <div className="pt-3 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Vista Previa de la Franja:
              </span>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs sm:text-sm font-medium flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 truncate">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{config.storeTopBarNotice.text} <strong>{config.storeTopBarNotice.highlight}</strong></span>
                </div>
                <span className="text-xs font-bold text-blue-700 underline shrink-0 cursor-pointer">
                  Aprovechar Promo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 4: VISTA PREVIA COMPLETA */}
      {activeSubTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Así es como se visualizan actualmente tus banners y promociones activas para los usuarios.
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Banners Activos de la Tienda:
            </h4>
            {config.banners.filter((b) => b.active).map((b) => (
              <StorePromoBannerComponent key={b.id} banner={b} />
            ))}
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR BANNER (Componente Reutilizable) */}
      <BannerEditorModalComponent
        isOpen={isBannerModalOpen}
        banner={editingBanner}
        onClose={() => {
          setIsBannerModalOpen(false);
          setEditingBanner(null);
        }}
        onSaved={() => reloadData()}
      />

      {/* MODAL CREAR / EDITAR UPGRADE */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden my-6 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-heading font-black text-lg">
                    {editingUpgrade ? 'Editar Upgrade de Servicio' : 'Nuevo Upgrade de Servicio'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUpgrade} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Título del Servicio
                  </label>
                  <input
                    type="text"
                    required
                    value={upgTitle}
                    onChange={(e) => setUpgTitle(e.target.value)}
                    placeholder="Ej. Sesión Fotográfica & Cobertura Presencial"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 font-heading font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Descripción Breve
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={upgDesc}
                    onChange={(e) => setUpgDesc(e.target.value)}
                    placeholder="Para qué sirve y cómo beneficia al negocio..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Precio de Lista
                    </label>
                    <input
                      type="number"
                      required
                      value={upgRegularPrice}
                      onChange={(e) => setUpgRegularPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Precio Bonificado
                    </label>
                    <input
                      type="number"
                      required
                      value={upgPromoPrice}
                      onChange={(e) => setUpgPromoPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-indigo-700 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Período
                    </label>
                    <input
                      type="text"
                      required
                      value={upgPeriod}
                      onChange={(e) => setUpgPeriod(e.target.value)}
                      placeholder="/mes, pago único, etc."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Badge Promocional
                    </label>
                    <input
                      type="text"
                      value={upgBadge}
                      onChange={(e) => setUpgBadge(e.target.value)}
                      placeholder="Ej. 30% OFF Clientes"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Icono
                    </label>
                    <select
                      value={upgIcon}
                      onChange={(e) => setUpgIcon(e.target.value as UpgradeIcon)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Características / Qué incluye (una por línea)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={upgFeaturesText}
                    onChange={(e) => setUpgFeaturesText(e.target.value)}
                    placeholder="Hasta 30 fotos profesionales&#10;Edición y retoque de color&#10;Entrega en carpeta privada en la nube"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Recomendación comercial (Opcional)
                  </label>
                  <input
                    type="text"
                    value={upgRecommended}
                    onChange={(e) => setUpgRecommended(e.target.value)}
                    placeholder="Ej. Ideal para renovar el banco visual de tu negocio"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div className="pt-2">
                  <CustomCheckbox
                    checked={upgActive}
                    onChange={(checked) => setUpgActive(checked)}
                    label="Publicar este upgrade en el Portal de Clientes"
                    variant="indigo"
                    size="sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsUpgradeModalOpen(false)}
                    className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
                  >
                    Guardar Upgrade
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmar Eliminación de Banner */}
      <ConfirmModalComponent
        isOpen={bannerToDelete !== null}
        onClose={() => setBannerToDelete(null)}
        onConfirm={() => {
          if (bannerToDelete) {
            PromotionsService.deleteBanner(bannerToDelete.id);
            setBannerToDelete(null);
          }
        }}
        title="¿Eliminar este banner promocional?"
        description={
          bannerToDelete ? (
            <p>
              Estás por eliminar el banner <strong className="text-slate-900 font-bold">{bannerToDelete.title}</strong>. Dejará de mostrarse en la tienda o portal.
            </p>
          ) : null
        }
        confirmText="Sí, Eliminar Banner"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Confirmar Eliminación de Upgrade */}
      <ConfirmModalComponent
        isOpen={upgradeToDelete !== null}
        onClose={() => setUpgradeToDelete(null)}
        onConfirm={() => {
          if (upgradeToDelete) {
            PromotionsService.deleteUpgrade(upgradeToDelete.id);
            setUpgradeToDelete(null);
          }
        }}
        title="¿Eliminar este upgrade de servicio?"
        description={
          upgradeToDelete ? (
            <p>
              Estás por eliminar la oferta <strong className="text-slate-900 font-bold">{upgradeToDelete.title}</strong> de las mejoras disponibles.
            </p>
          ) : null
        }
        confirmText="Sí, Eliminar Upgrade"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Confirmar Restablecer Banners */}
      <ConfirmModalComponent
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="¿Restablecer banners y promociones sugeridos?"
        description="Esta acción restablecerá todas las promociones, banners y upgrades a sus valores de fábrica originales."
        confirmText="Restablecer Todo"
        cancelText="Cancelar"
        variant="warning"
      />
    </div>
  );
};
