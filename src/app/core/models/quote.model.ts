export type QuoteStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';

export interface ServiceModule {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  deliverables: string[];
}

export interface QuotePricing {
  listPrice: number;
  applyDiscount: boolean;
  discountTitle: string;
  discountPercentage: number;
  discountDurationMonths: number;
  discountAmount: number;
  finalMonthlyPrice: number;
}

export interface Quote {
  id: string;
  slug: string;
  clientName: string;
  clientCategory: string;
  serviceTitle: string;
  serviceSubtitle: string;
  createdAt: number;
  status: QuoteStatus;
  modules: ServiceModule[];
  pricing: QuotePricing;
  terms: string[];
}

export interface ModuleTemplate {
  id: string;
  title: string;
  subtitle: string;
  suggestedPrice: number;
  deliverables: string[];
  tag: string;
  active?: boolean;
}

