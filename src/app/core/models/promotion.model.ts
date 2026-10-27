export type BannerGradient = 'blue-indigo' | 'emerald-teal' | 'amber-orange' | 'purple-pink' | 'dark-slate';

export type BannerPlacement = 'STORE_HERO' | 'STORE_BETWEEN_SECTIONS' | 'PORTAL_TOP';

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string; // ej: "¡OFERTA DE LANZAMIENTO!", "50% OFF", "CUPOS LIMITADOS"
  buttonText: string;
  buttonLink: string; // url o wa.me
  whatsappMessage?: string;
  placement: BannerPlacement;
  gradient: BannerGradient;
  active: boolean;
  priority?: number;
  imageUrl?: string;
}

export type UpgradeIcon = 'Camera' | 'Sparkles' | 'Megaphone' | 'TrendingUp' | 'MessageCircle' | 'Star' | 'Video' | 'Palette';

export interface ServiceUpgradeOffer {
  id: string;
  title: string;
  shortDescription: string;
  badge: string; // ej: "30% OFF Clientes", "Más Pedido", "Upgrade Express"
  regularPrice: number;
  promoPrice: number;
  billingPeriod: string; // ej: "pago único", "/mes", "por entrega"
  features: string[];
  icon: UpgradeIcon;
  active: boolean;
  whatsappMessageTemplate?: string;
  recommendedFor?: string; // ej: "Ideal si ya tenés el Plan Integral"
}

export interface AgencyPromotionsConfig {
  agencyWhatsapp: string;
  storeTopBarNotice: {
    enabled: boolean;
    text: string;
    highlight: string;
    buttonText?: string;
    buttonLink?: string;
  };
  banners: PromotionalBanner[];
  upgrades: ServiceUpgradeOffer[];
}
