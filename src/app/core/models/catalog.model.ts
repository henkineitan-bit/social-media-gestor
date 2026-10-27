export interface PredefinedPlan {
  id: string;
  name: string;
  tagline: string;
  popular?: boolean;
  active?: boolean;
  listPrice: number;
  promoPrice: number;
  discountPct: number;
  promoMonths: number;
  includedModuleIds: string[];
  features: string[];
}

export interface CatalogState {
  plans: PredefinedPlan[];
  templates: import('./quote.model').ModuleTemplate[];
}
