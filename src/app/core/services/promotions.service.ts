import { AgencyPromotionsConfig, PromotionalBanner, ServiceUpgradeOffer } from '../models/promotion.model';

const STORAGE_KEY = 'agency_promotions_config_v1';

export const DEFAULT_PROMOTIONS_CONFIG: AgencyPromotionsConfig = {
  agencyWhatsapp: '5491100000000',
  storeTopBarNotice: {
    enabled: true,
    text: '🔥 Beneficio Especial de Bienvenida:',
    highlight: '50% OFF en tu cuota mensual congelado por los primeros 6 meses.',
    buttonText: 'Aprovechar Promo',
    buttonLink: 'https://wa.me/?text=Hola!%20Quiero%20aprovechar%20la%20bonificaci%C3%B3n%20del%2050%25%20en%20Gesti%C3%B3n%20Digital',
  },
  banners: [
    {
      id: 'banner-store-hero',
      title: 'Impulsa tus ventas esta temporada con Contenido Profesional',
      subtitle: 'Contratando cualquier plan este mes te bonificamos la puesta a punto y optimización inicial de tu cuenta de Instagram sin cargo.',
      badge: '🔥 PROMOCIÓN POR TIEMPO LIMITADO',
      buttonText: 'Reclamar Bonificación por WhatsApp',
      buttonLink: 'https://wa.me/?text=Hola!%20Quiero%20reclamar%20la%20puesta%20a%20punto%20bonificada%20para%20mi%20marca',
      whatsappMessage: 'Hola! Quiero reclamar la puesta a punto bonificada para mi marca.',
      placement: 'STORE_HERO',
      gradient: 'blue-indigo',
      active: true,
      priority: 1,
    },
    {
      id: 'banner-portal-top',
      title: 'Beneficio Exclusivo: 30% OFF en Producción Extra para tu Cuenta',
      subtitle: 'Como cliente activo de la agencia, accedés a tarifas preferenciales para sesiones fotográficas, cobertura de eventos y packs de historias adicionales.',
      badge: '⭐ BENEFICIO EXCLUSIVO PARA CLIENTES',
      buttonText: 'Ver Mejoras Disponibles',
      buttonLink: '#upgrades',
      whatsappMessage: 'Hola! Quiero consultar por las mejoras exclusivas para mi plan.',
      placement: 'PORTAL_TOP',
      gradient: 'purple-pink',
      active: true,
      priority: 1,
    },
    {
      id: 'banner-store-mid',
      title: '¿Necesitas un combo especial para tu rubro?',
      subtitle: 'Podés armar tu presupuesto personalizado eligiendo sólo los módulos que necesitás desde nuestro cotizador interactivo.',
      badge: '✨ 100% PERSONALIZABLE',
      buttonText: 'Abrir Cotizador a Medida',
      buttonLink: 'builder',
      placement: 'STORE_BETWEEN_SECTIONS',
      gradient: 'emerald-teal',
      active: true,
      priority: 2,
    },
  ],
  upgrades: [
    {
      id: 'upg-photoshoot',
      title: 'Sesión Fotográfica & Cobertura Presencial',
      shortDescription: 'Producción de fotos profesionales de tus productos, platos o local para elevar el impacto estético de tu feed.',
      badge: '28% OFF Clientes',
      regularPrice: 90000,
      promoPrice: 65000,
      billingPeriod: 'pago único',
      features: [
        'Producción en tu local o estudio con cámara y óptica profesional',
        'Hasta 30 fotografías en alta resolución editadas con retoque de color',
        'Insumos listos para alimentar tus publicaciones y reels del mes',
        'Entrega rápida en carpeta privada en la nube',
      ],
      icon: 'Camera',
      active: true,
      recommendedFor: 'Ideal para renovar el banco visual de tu negocio',
      whatsappMessageTemplate: '¡Hola! Me interesa solicitar la Sesión Fotográfica Presencial bonificada para mi cuenta.',
    },
    {
      id: 'upg-stories-pack',
      title: 'Pack de 8 Stories Estratégicas Semanales',
      shortDescription: 'Historias diarias diseñadas con llamados a la acción, stickers interactivos y ganchos de conversión para vender más.',
      badge: 'Más Solicitado',
      regularPrice: 55000,
      promoPrice: 38000,
      billingPeriod: '/mes',
      features: [
        'Secuencias diseñadas para generar consultas por mensaje directo (DM)',
        'Stickers de preguntas, encuestas y enlaces a catálogos',
        'Diseño visual 100% adaptado a la identidad de tu marca',
        'Acompañamiento continuo con sugerencias de contenido espontáneo',
      ],
      icon: 'Sparkles',
      active: true,
      recommendedFor: 'Para marcas que buscan generar conversaciones diarias',
      whatsappMessageTemplate: '¡Hola! Quiero sumar el Pack de Stories Estratégicas a mi plan mensual.',
    },
    {
      id: 'upg-reels-boost',
      title: 'Pack de 2 Reels Extra con Guion Viral',
      shortDescription: 'Videos verticales dinámicos con audio en tendencia, gancho inicial potente y edición profesional con subtítulos.',
      badge: 'Crecimiento Rápido',
      regularPrice: 75000,
      promoPrice: 52000,
      billingPeriod: '/mes',
      features: [
        '2 videos adicionales por mes listos para publicar en Instagram Reels y TikTok',
        'Estructura de guion probada para retener atención los primeros 3 segundos',
        'Subtítulos dinámicos de colores y efectos visuales modernos',
        'Revisión y aprobación previa desde tu portal',
      ],
      icon: 'Video',
      active: true,
      recommendedFor: 'Para negocios que quieren multiplicar su alcance orgánico',
      whatsappMessageTemplate: '¡Hola! Quiero activar el Pack de 2 Reels Extra para potenciar mi cuenta.',
    },
    {
      id: 'upg-google-maps',
      title: 'Puesta a Punto de Google Mi Negocio & Reseñas',
      shortDescription: 'Optimizamos tu ficha en Google Maps para que los clientes de tu zona te encuentren fácilmente y te elijan.',
      badge: 'Negocios Físicos',
      regularPrice: 48000,
      promoPrice: 32000,
      billingPeriod: 'pago único',
      features: [
        'Configuración completa y verificación de tu perfil de Google',
        'Carga de catálogo de servicios, horarios actualizados y fotos de portada',
        'Estrategia y plantilla para solicitar reseñas 5 estrellas a clientes felices',
        'Mejora de posicionamiento SEO local en Google Maps',
      ],
      icon: 'Star',
      active: true,
      recommendedFor: 'Indispensable para locales a la calle y servicios de cercanía',
      whatsappMessageTemplate: '¡Hola! Quiero optimizar mi ficha de Google Maps y perfil de negocio.',
    },
  ],
};

type PromotionsListener = () => void;

export class PromotionsService {
  private static listeners: PromotionsListener[] = [];

  public static subscribe(listener: PromotionsListener): () => void {
    PromotionsService.listeners.push(listener);
    return () => {
      PromotionsService.listeners = PromotionsService.listeners.filter((l) => l !== listener);
    };
  }

  private static notify(): void {
    PromotionsService.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in PromotionsService listener', err);
      }
    });
  }

  public static getConfig(): AgencyPromotionsConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROMOTIONS_CONFIG));
        return DEFAULT_PROMOTIONS_CONFIG;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PROMOTIONS_CONFIG;
    }
  }

  public static saveConfig(config: AgencyPromotionsConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    PromotionsService.notify();
  }

  public static updateTopBarNotice(notice: AgencyPromotionsConfig['storeTopBarNotice']): void {
    const config = PromotionsService.getConfig();
    config.storeTopBarNotice = notice;
    PromotionsService.saveConfig(config);
  }

  public static getBanners(): PromotionalBanner[] {
    return PromotionsService.getConfig().banners;
  }

  public static getActiveBanners(placement?: PromotionalBanner['placement']): PromotionalBanner[] {
    const banners = PromotionsService.getBanners().filter((b) => b.active);
    if (!placement) return banners;
    return banners.filter((b) => b.placement === placement);
  }

  public static saveBanner(banner: PromotionalBanner): void {
    const config = PromotionsService.getConfig();
    const index = config.banners.findIndex((b) => b.id === banner.id);
    if (index >= 0) {
      config.banners[index] = banner;
    } else {
      config.banners.push(banner);
    }
    PromotionsService.saveConfig(config);
  }

  public static toggleBanner(id: string): void {
    const config = PromotionsService.getConfig();
    config.banners = config.banners.map((b) => {
      if (b.id === id) {
        return { ...b, active: !b.active };
      }
      return b;
    });
    PromotionsService.saveConfig(config);
  }

  public static deleteBanner(id: string): void {
    const config = PromotionsService.getConfig();
    config.banners = config.banners.filter((b) => b.id !== id);
    PromotionsService.saveConfig(config);
  }

  public static getUpgrades(): ServiceUpgradeOffer[] {
    return PromotionsService.getConfig().upgrades;
  }

  public static getActiveUpgrades(): ServiceUpgradeOffer[] {
    return PromotionsService.getUpgrades().filter((u) => u.active);
  }

  public static saveUpgrade(upgrade: ServiceUpgradeOffer): void {
    const config = PromotionsService.getConfig();
    const index = config.upgrades.findIndex((u) => u.id === upgrade.id);
    if (index >= 0) {
      config.upgrades[index] = upgrade;
    } else {
      config.upgrades.push(upgrade);
    }
    PromotionsService.saveConfig(config);
  }

  public static toggleUpgrade(id: string): void {
    const config = PromotionsService.getConfig();
    config.upgrades = config.upgrades.map((u) => {
      if (u.id === id) {
        return { ...u, active: !u.active };
      }
      return u;
    });
    PromotionsService.saveConfig(config);
  }

  public static deleteUpgrade(id: string): void {
    const config = PromotionsService.getConfig();
    config.upgrades = config.upgrades.filter((u) => u.id !== id);
    PromotionsService.saveConfig(config);
  }

  public static resetToDefaults(): void {
    PromotionsService.saveConfig(DEFAULT_PROMOTIONS_CONFIG);
  }
}
