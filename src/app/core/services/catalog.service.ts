import { ModuleTemplate } from '../models/quote.model';
import { PredefinedPlan } from '../models/catalog.model';
import { SEED_TEMPLATES } from './quotes.service';

const PLANS_STORAGE_KEY = 'catalog_plans';
const TEMPLATES_STORAGE_KEY = 'catalog_templates';

export const INITIAL_PLANS: PredefinedPlan[] = [
  {
    id: 'plan-despegue',
    name: 'Plan Despegue Inicial',
    tagline: 'Ideal para negocios que necesitan ordenar su perfil e imagen.',
    popular: false,
    active: true,
    listPrice: 200000,
    promoPrice: 100000,
    discountPct: 50,
    promoMonths: 6,
    includedModuleIds: ['tpl-config', 'tpl-diseno'],
    features: [
      'Puesta a punto y optimización completa del perfil en Instagram',
      'Configuración de datos de contacto, enlaces y estética general',
      'Planificación mensual con calendario de publicaciones',
      '1 Pieza gráfica semanal (diseño estático institucional)',
      'Acompañamiento y soporte continuo por WhatsApp',
    ],
  },
  {
    id: 'plan-integral',
    name: 'Plan Integral Social Media',
    tagline: 'El servicio más elegido para generar alcance y ventas continuas.',
    popular: true,
    active: true,
    listPrice: 322980,
    promoPrice: 161490,
    discountPct: 50,
    promoMonths: 6,
    includedModuleIds: ['tpl-config', 'tpl-diseno', 'tpl-audiovisual'],
    features: [
      'Todo lo incluido en el Plan Despegue Inicial',
      '1 Video semanal dinámico (Reel / Short) con edición profesional',
      'Estrategia de contenidos orientada a captación de clientes',
      'Portal exclusivo para revisión y aprobación semanal de piezas',
      'Bonificación especial del 50% congelada por 6 meses',
    ],
  },
  {
    id: 'plan-growth',
    name: 'Plan Full Growth & Ads',
    tagline: 'Máxima visibilidad, producción audiovisual y campañas pagas.',
    popular: false,
    active: true,
    listPrice: 417980,
    promoPrice: 208990,
    discountPct: 50,
    promoMonths: 6,
    includedModuleIds: ['tpl-config', 'tpl-diseno', 'tpl-audiovisual', 'tpl-ads'],
    features: [
      'Todo lo incluido en el Plan Integral Social Media',
      'Gestión de Pauta Publicitaria en Meta Ads (Instagram y Facebook)',
      'Configuración de cuenta publicitaria y segmentación de clientes',
      'Creación y testeo A/B de campañas para atraer clientes potenciales',
      'Reporte mensual de rendimiento, alcance y retorno',
    ],
  },
];

type CatalogListener = () => void;

export class CatalogService {
  private static listeners: CatalogListener[] = [];

  public static subscribe(listener: CatalogListener): () => void {
    CatalogService.listeners.push(listener);
    return () => {
      CatalogService.listeners = CatalogService.listeners.filter((l) => l !== listener);
    };
  }

  private static notify(): void {
    CatalogService.listeners.forEach((l) => l());
  }

  // --- PLANS ---
  public static getPlans(): PredefinedPlan[] {
    try {
      const raw = localStorage.getItem(PLANS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading catalog plans from storage', e);
    }
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(INITIAL_PLANS));
    return INITIAL_PLANS;
  }

  public static getActivePlans(): PredefinedPlan[] {
    return CatalogService.getPlans().filter((p) => p.active !== false);
  }

  public static savePlan(plan: PredefinedPlan): void {
    const plans = CatalogService.getPlans();
    const idx = plans.findIndex((p) => p.id === plan.id);
    if (idx >= 0) {
      plans[idx] = { ...plan };
    } else {
      plans.push(plan);
    }
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    CatalogService.notify();
  }

  public static deletePlan(id: string): void {
    const plans = CatalogService.getPlans().filter((p) => p.id !== id);
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    CatalogService.notify();
  }

  // --- TEMPLATES ---
  public static getTemplates(): ModuleTemplate[] {
    try {
      const raw = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading catalog templates from storage', e);
    }
    const defaults = SEED_TEMPLATES.map((t) => ({ ...t, active: true }));
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  public static getActiveTemplates(): ModuleTemplate[] {
    return CatalogService.getTemplates().filter((t) => t.active !== false);
  }

  public static saveTemplate(tpl: ModuleTemplate): void {
    const templates = CatalogService.getTemplates();
    const idx = templates.findIndex((t) => t.id === tpl.id);
    if (idx >= 0) {
      templates[idx] = { ...tpl };
    } else {
      templates.push(tpl);
    }
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    CatalogService.notify();
  }

  public static deleteTemplate(id: string): void {
    const templates = CatalogService.getTemplates().filter((t) => t.id !== id);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    CatalogService.notify();
  }

  public static resetToDefaults(): void {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(INITIAL_PLANS));
    const defaults = SEED_TEMPLATES.map((t) => ({ ...t, active: true }));
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(defaults));
    CatalogService.notify();
  }
}
