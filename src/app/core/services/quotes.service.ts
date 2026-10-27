import { Quote, QuotePricing, QuoteStatus, ServiceModule, ModuleTemplate } from '../models/quote.model';
import { rtdbService } from './firebase-rtdb.service';
import { ClientsService } from './clients.service';

const QUOTES_STORAGE_KEY = 'quotes';

export const SEED_TEMPLATES: ModuleTemplate[] = [
  {
    id: 'tpl-config',
    title: 'Configuración & Optimización Inicial',
    subtitle: 'Puesta a punto del perfil institucional en Instagram.',
    suggestedPrice: 80000,
    tag: 'Setup',
    deliverables: [
      'Carga e integración de datos de contacto completos.',
      'Carga e implementación del logo en alta resolución.',
      'Emprolijamiento y estandarización estética general de la cuenta.',
    ],
  },
  {
    id: 'tpl-diseno',
    title: 'Planificación & Diseño Gráfico',
    subtitle: 'Estrategia visual y contenidos estáticos.',
    suggestedPrice: 120000,
    tag: 'Diseño',
    deliverables: [
      'Diseño y estructuración del calendario de publicaciones.',
      'Creación de 1 pieza gráfica semanal (diseño de posteo para contenido general del servicio).',
    ],
  },
  {
    id: 'tpl-audiovisual',
    title: 'Producción Audiovisual',
    subtitle: 'Contenido dinámico para Reels/Shorts.',
    suggestedPrice: 122980,
    tag: 'Video',
    deliverables: [
      'Creación de 1 video semanal básico.',
      'Edición realizada a partir de videos o fotos proporcionadas por el cliente.',
    ],
  },
  {
    id: 'tpl-ads',
    title: 'Gestión de Pauta Publicitaria (Meta Ads)',
    subtitle: 'Campañas de tráfico, conversión y alcance pago.',
    suggestedPrice: 95000,
    tag: 'Publicidad',
    deliverables: [
      'Configuración de cuenta en Meta Business Suite y píxel de seguimiento.',
      'Creación, segmentación y testeo A/B de campañas activas.',
      'Reporte quincenal de métricas, alcance y costo por interacción.',
    ],
  },
  {
    id: 'tpl-community',
    title: 'Community Management & Moderación',
    subtitle: 'Gestión de comunidad y atención directa.',
    suggestedPrice: 70000,
    tag: 'Gestión',
    deliverables: [
      'Respuesta de mensajes directos (DM) y comentarios de lunes a viernes.',
      'Protocolo de derivación ágil de consultas comerciales.',
      'Interacción estratégica con perfiles y clientes del nicho.',
    ],
  },
];

export const DEFAULT_TERMS: string[] = [
  'Los insumos gráficos (fotos, videos en alta calidad y logotipos) deben ser proporcionados a tiempo por el cliente para mantener el cronograma de entregas.',
  'La bonificación del 50% es válida exclusivamente durante los primeros 6 meses consecutivos. A partir del séptimo mes se aplicará la tarifa estándar vigente.',
  'Los pagos de los abonos mensuales se efectúan por adelantado del 1 al 10 de cada mes mediante transferencia bancaria.',
  'La propuesta comercial cuenta con un periodo de validez de 15 días corridos a partir de la fecha de emisión.',
];

export const SEED_QUOTE: Quote = {
  id: 'quote-familia-cardoso',
  slug: 'familia-cardoso',
  clientName: 'Familia Cardoso',
  clientCategory: 'Cliente Preferencial',
  serviceTitle: 'Gestión de Instagram',
  serviceSubtitle: 'Servicio Mensual Inicial',
  createdAt: Date.now() - 86400000 * 2,
  status: 'SENT',
  modules: [
    {
      id: 'mod-1',
      title: 'Configuración & Optimización Inicial',
      subtitle: 'Puesta a punto del perfil institucional en Instagram.',
      price: 80000,
      deliverables: [
        'Carga e integración de datos de contacto completos.',
        'Carga e implementación del logo en alta resolución.',
        'Emprolijamiento y estandarización estética general de la cuenta.',
      ],
    },
    {
      id: 'mod-2',
      title: 'Planificación & Diseño Gráfico',
      subtitle: 'Estrategia visual y contenidos estáticos.',
      price: 120000,
      deliverables: [
        'Diseño y estructuración del calendario de publicaciones.',
        'Creación de 1 pieza gráfica semanal (diseño de posteo para contenido general del servicio).',
      ],
    },
    {
      id: 'mod-3',
      title: 'Producción Audiovisual',
      subtitle: 'Contenido dinámico para Reels/Shorts.',
      price: 122980,
      deliverables: [
        'Creación de 1 video semanal básico.',
        'Edición realizada a partir de videos o fotos proporcionadas por el cliente.',
      ],
    },
  ],
  pricing: {
    listPrice: 322980,
    applyDiscount: true,
    discountTitle: 'Bonificación Especial de Bienvenida',
    discountPercentage: 50,
    discountDurationMonths: 6,
    discountAmount: 161490,
    finalMonthlyPrice: 161490,
  },
  terms: [
    'Los insumos gráficos (fotos, videos en alta calidad y logotipos) deben ser proporcionados a tiempo por el cliente para mantener el cronograma de entregas.',
    'La bonificación del 50% es válida exclusivamente durante los primeros 6 meses consecutivos. A partir del séptimo mes se aplicará la tarifa estándar vigente.',
  ],
};

export class QuotesService {
  public static calculatePricing(
    modules: ServiceModule[],
    applyDiscount: boolean = true,
    discountPercentage: number = 50,
    discountDurationMonths: number = 6,
    discountTitle: string = 'Bonificación Especial de Bienvenida'
  ): QuotePricing {
    const listPrice = modules.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    const pct = applyDiscount ? Math.max(0, Math.min(100, discountPercentage)) : 0;
    const discountAmount = applyDiscount ? Math.round((listPrice * pct) / 100) : 0;
    const finalMonthlyPrice = Math.max(0, listPrice - discountAmount);

    return {
      listPrice,
      applyDiscount,
      discountTitle,
      discountPercentage: pct,
      discountDurationMonths: applyDiscount ? discountDurationMonths : 0,
      discountAmount,
      finalMonthlyPrice,
    };
  }

  public static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount).replace('ARS', '$').trim();
  }

  public static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  public static getQuotes(): Quote[] {
    const list = rtdbService.get<Quote[]>(QUOTES_STORAGE_KEY, [SEED_QUOTE]);
    if (!list || list.length === 0) {
      rtdbService.set(QUOTES_STORAGE_KEY, [SEED_QUOTE]);
      return [SEED_QUOTE];
    }
    return list;
  }

  public static getQuoteBySlug(slug: string): Quote | null {
    const quotes = this.getQuotes();
    return quotes.find((q) => q.slug === slug) || null;
  }

  public static getQuoteById(id: string): Quote | null {
    const quotes = this.getQuotes();
    return quotes.find((q) => q.id === id) || null;
  }

  public static saveQuote(quote: Quote): Quote {
    const quotes = this.getQuotes();
    const existingIndex = quotes.findIndex((q) => q.id === quote.id);

    let updated: Quote[];
    if (existingIndex >= 0) {
      updated = [...quotes];
      updated[existingIndex] = quote;
    } else {
      updated = [quote, ...quotes];
    }

    rtdbService.set(QUOTES_STORAGE_KEY, updated);
    return quote;
  }

  public static deleteQuote(id: string): void {
    const quotes = this.getQuotes().filter((q) => q.id !== id);
    rtdbService.set(QUOTES_STORAGE_KEY, quotes);
  }

  public static updateStatus(id: string, status: QuoteStatus): void {
    const quotes = this.getQuotes();
    const targetQuote = quotes.find((q) => q.id === id);
    const updated = quotes.map((q) => (q.id === id ? { ...q, status } : q));
    rtdbService.set(QUOTES_STORAGE_KEY, updated);

    // Conversión automática a Cliente al aprobar cotización
    if (status === 'APPROVED' && targetQuote) {
      ClientsService.createClientFromQuote({ ...targetQuote, status: 'APPROVED' });
    }
  }

  public static restoreSeed(): void {
    rtdbService.set(QUOTES_STORAGE_KEY, [SEED_QUOTE]);
  }

  public static subscribe(callback: (quotes: Quote[]) => void): () => void {
    return rtdbService.listen<Quote[]>(QUOTES_STORAGE_KEY, callback);
  }
}
