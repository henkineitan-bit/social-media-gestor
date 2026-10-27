import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Camera, 
  Video, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  Tag, 
  TrendingUp, 
  Megaphone,
  Palette,
  Check,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Client } from '../../../core/models/client.model';
import { ServiceUpgradeOffer, PromotionalBanner, UpgradeIcon } from '../../../core/models/promotion.model';
import { PromotionsService } from '../../../core/services/promotions.service';
import { QuotesService } from '../../../core/services/quotes.service';

interface PortalUpgradesSectionProps {
  client: Client;
}

const ICON_MAP: Record<UpgradeIcon, React.ReactNode> = {
  Camera: <Camera className="w-5 h-5 text-indigo-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-pink-600" />,
  Video: <Video className="w-5 h-5 text-blue-600" />,
  Star: <Star className="w-5 h-5 text-amber-500" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-emerald-600" />,
  Megaphone: <Megaphone className="w-5 h-5 text-purple-600" />,
  MessageCircle: <MessageCircle className="w-5 h-5 text-teal-600" />,
  Palette: <Palette className="w-5 h-5 text-rose-600" />,
};

export const PortalUpgradesSectionComponent: React.FC<PortalUpgradesSectionProps> = ({ client }) => {
  const [upgrades, setUpgrades] = useState<ServiceUpgradeOffer[]>(() => PromotionsService.getActiveUpgrades());
  const [portalBanners, setPortalBanners] = useState<PromotionalBanner[]>(() => 
    PromotionsService.getActiveBanners('PORTAL_TOP')
  );
  const [requestedId, setRequestedId] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      setUpgrades(PromotionsService.getActiveUpgrades());
      setPortalBanners(PromotionsService.getActiveBanners('PORTAL_TOP'));
    };
    refresh();
    const unsub = PromotionsService.subscribe(refresh);
    return () => unsub();
  }, []);

  const handleRequestUpgrade = (upgrade: ServiceUpgradeOffer) => {
    const handle = client.onboarding.instagramHandle || client.name;
    const msg = `¡Hola! Como cliente activo de Gestión Digital (${client.name} • ${handle}), quiero sumar la siguiente mejora a mi cuenta:\n\n*Servicio:* ${upgrade.title}\n*Tarifa Bonificada:* ${QuotesService.formatCurrency(upgrade.promoPrice)} (${upgrade.billingPeriod})\n\n¿Cómo podemos coordinar para comenzar?`;
    
    setRequestedId(upgrade.id);
    setTimeout(() => setRequestedId(null), 4000);

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8" id="upgrades">
      {/* Banner Promocional para Clientes si está activo */}
      {portalBanners.map((banner) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md"
        >
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{banner.badge}</span>
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-heading leading-tight">
              {banner.title}
            </h3>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              {banner.subtitle}
            </p>
          </div>
        </motion.div>
      ))}

      {/* Cabecera de Sección de Upgrades */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>EXCLUSIVO CLIENTES ACTIVOS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Promociones Exclusivas & Mejoras para tu Plan
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Suma servicios adicionales para potenciar tus ventas y presencia digital con tarifas bonificadas por pertenecer a nuestra cartera de clientes.
          </p>
        </div>

        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto">
          {upgrades.length} Mejoras Disponibles
        </span>
      </div>

      {/* Grid de Upgrades */}
      {upgrades.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
          <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No hay mejoras adicionales activas en este momento</p>
          <p className="text-xs text-slate-400 mt-0.5">La agencia anunciará nuevas promociones y paquetes aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {upgrades.map((upg, idx) => {
            const isJustRequested = requestedId === upg.id;
            const savings = upg.regularPrice - upg.promoPrice;

            return (
              <motion.div
                key={upg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Header Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                      {ICON_MAP[upg.icon] || <Sparkles className="w-5 h-5 text-indigo-600" />}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {upg.badge}
                      </span>
                      {savings > 0 && (
                        <span className="text-[11px] font-bold text-slate-600">
                          Ahorras {QuotesService.formatCurrency(savings)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      {upg.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {upg.shortDescription}
                    </p>
                  </div>

                  {/* Recommended tag if any */}
                  {upg.recommendedFor && (
                    <div className="text-[11px] font-medium text-indigo-700 bg-indigo-50/70 px-2.5 py-1 rounded-lg border border-indigo-100">
                      💡 {upg.recommendedFor}
                    </div>
                  )}

                  {/* Features list */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <span className="text-[11px] uppercase font-bold text-slate-600 tracking-wider block">
                      Qué incluye:
                    </span>
                    <ul className="space-y-1.5">
                      {upg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-600 line-through mr-2 font-medium">
                        {QuotesService.formatCurrency(upg.regularPrice)}
                      </span>
                      <span className="text-2xl font-black text-slate-900 font-heading">
                        {QuotesService.formatCurrency(upg.promoPrice)}
                      </span>
                      <span className="text-xs text-slate-600 ml-1 font-medium">
                        {upg.billingPeriod}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Tarifa Cliente
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleRequestUpgrade(upg)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      isJustRequested
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isJustRequested ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Solicitud enviada a la Agencia!</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        <span>Solicitar esta Mejora para mi Plan</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Nota de garantía de servicio */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-3.5 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
        <p>
          Las mejoras se coordinan directamente con el equipo de trabajo de la agencia y se incorporan a tu cronograma mensual sin trámites ni contratos nuevos.
        </p>
      </div>
    </div>
  );
};
