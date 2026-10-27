export type ClientStatus = 'ONBOARDING' | 'ACTIVE' | 'PAUSED';

export interface OnboardingState {
  contactDataCompleted: boolean;
  contactInfoNotes: string;        // Teléfono, email, dirección, links de contacto
  logoReceived: boolean;
  highResLogoUrl: string;          // Link a Google Drive / Dropbox con el logo en alta
  aestheticStandardized: boolean;
  brandPaletteNotes: string;       // Notas de colores/tipografías de la cuenta
  instagramHandle: string;         // Ej: @familiacardoso
}

export interface DeliverableItem {
  id: string;
  weekLabel: string;               // Ej: "Semana 1 - Noviembre"
  type: 'GRAPHIC_POST' | 'REEL_VIDEO';
  title: string;
  rawAssetsLink: string;           // Link de Drive subido por el cliente (insumos crudos)
  agencyPreviewLink: string;       // Link de Drive subido por la agencia (pieza lista)
  copyText: string;                // Texto / Copy propuesto para Instagram
  status: 'WAITING_ASSETS' | 'IN_PRODUCTION' | 'PENDING_APPROVAL' | 'CHANGES_REQUESTED' | 'APPROVED';
  clientFeedback?: string;
  updatedAt: number;
}

export type AdObjective = 'FOLLOWERS' | 'WHATSAPP_LEADS' | 'SALES_TRAFFIC' | 'LOCAL_AWARENESS';
export type AdPlatform = 'INSTAGRAM_REELS' | 'INSTAGRAM_FEED' | 'META_ADS_ALL';
export type AdCampaignStatus = 'REQUESTED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface AdCampaignMetrics {
  reach: number;          // Personas alcanzadas
  clicks: number;         // Clics en el enlace o perfil
  conversations: number;  // Consultas directas iniciadas
}

export interface AdCampaign {
  id: string;
  title: string;
  objective: AdObjective;
  monthlyBudget: number;              // Inversión mensual en pauta (AR$)
  platform: AdPlatform;
  targetAudience: string;             // Segmentación descriptiva
  promotedDeliverableId?: string;     // ID del reel o post que se promociona
  status: AdCampaignStatus;
  createdAt: number;
  metrics?: AdCampaignMetrics;
  agencyNotes?: string;
}

export interface Client {
  id: string;
  quoteId: string;
  name: string;
  category: string;
  serviceTitle: string;
  status: ClientStatus;
  startDate: number;
  monthlyFee: number;
  listPrice: number;
  promoTotalMonths: number;        // Ej: 6 meses
  promoMonthsRemaining: number;    // Ej: 6 meses restantes al iniciar
  onboarding: OnboardingState;
  deliverables: DeliverableItem[];
  adCampaigns?: AdCampaign[];      // Campañas de publicidad y Meta Ads
  email?: string;                  // Email de acceso al portal
  loginPassword?: string;          // Contraseña asignada para el portal
}
