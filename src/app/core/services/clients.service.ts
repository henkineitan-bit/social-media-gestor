import { Client, ClientStatus, OnboardingState, DeliverableItem, AdCampaign, AdCampaignStatus } from '../models/client.model';
import { Quote } from '../models/quote.model';
import { rtdbService } from './firebase-rtdb.service';

const CLIENTS_STORAGE_KEY = 'clients';

export const SEED_CLIENT: Client = {
  id: 'client-familia-cardoso',
  quoteId: 'quote-familia-cardoso',
  name: 'Familia Cardoso',
  category: 'Cliente Preferencial',
  serviceTitle: 'Gestión de Instagram',
  status: 'ONBOARDING',
  startDate: Date.now() - 86400000 * 2,
  monthlyFee: 161490,
  listPrice: 322980,
  promoTotalMonths: 6,
  promoMonthsRemaining: 6,
  onboarding: {
    contactDataCompleted: true,
    contactInfoNotes: 'WhatsApp Comercial: +54 9 11 5432-8900 | Correo: contacto@familiacardoso.com | Bio link: bio.link/familiacardoso',
    logoReceived: true,
    highResLogoUrl: 'https://drive.google.com/drive/folders/demo-familia-cardoso-brand-assets',
    aestheticStandardized: false,
    brandPaletteNotes: 'Colores clave: Azul corporativo (#1D4ED8), Blanco y Gris pizarra (#0F172A). Tipografía moderna y cercana.',
    instagramHandle: '@familiacardoso',
  },
  email: 'cliente@cardoso.com',
  loginPassword: 'cliente123',
  deliverables: [
    {
      id: 'del-1',
      weekLabel: 'Semana 1 - Noviembre',
      type: 'GRAPHIC_POST',
      title: 'Pieza Gráfica Semanal (Posteo Estático)',
      rawAssetsLink: 'https://drive.google.com/drive/folders/demo-familia-cardoso-fotos',
      agencyPreviewLink: 'https://drive.google.com/file/d/demo-preview-post-grafico/view',
      copyText: '✨ Empezar con claridad es el primer paso hacia el orden familiar y financiero. En Familia Cardoso te acompañamos en cada etapa con el compromiso de siempre.\n\n👉 Envíanos un mensaje directo o contáctanos por WhatsApp para coordinar tu consulta personalizada.\n\n#FamiliaCardoso #Servicios #AtencionPersonalizada',
      status: 'PENDING_APPROVAL',
      updatedAt: Date.now() - 3600000 * 5,
    },
    {
      id: 'del-2',
      weekLabel: 'Semana 1 - Noviembre',
      type: 'REEL_VIDEO',
      title: 'Video Semanal Básico (Reel / Short)',
      rawAssetsLink: '',
      agencyPreviewLink: '',
      copyText: 'Detrás de escena: la dedicación y el valor humano de nuestro equipo día a día. #Reels #FamiliaCardoso',
      status: 'WAITING_ASSETS',
      updatedAt: Date.now() - 3600000 * 24,
    },
  ],
  adCampaigns: [
    {
      id: 'ad-cardoso-1',
      title: 'Campaña WhatsApp - Nuevas Consultas',
      objective: 'WHATSAPP_LEADS',
      monthlyBudget: 60000,
      platform: 'INSTAGRAM_FEED',
      targetAudience: 'Radio de 15km, hombres y mujeres de 28 a 55 años con interés en servicios familiares y bienestar.',
      promotedDeliverableId: 'del-1',
      status: 'ACTIVE',
      createdAt: Date.now() - 86400000 * 4,
      metrics: {
        reach: 12450,
        clicks: 680,
        conversations: 34,
      },
      agencyNotes: 'Anuncio optimizado para inicio de conversación directa por WhatsApp Business.',
    },
  ],
};

export class ClientsService {
  public static getClients(): Client[] {
    const list = rtdbService.get<Client[]>(CLIENTS_STORAGE_KEY, [SEED_CLIENT]);
    if (!list || list.length === 0) {
      rtdbService.set(CLIENTS_STORAGE_KEY, [SEED_CLIENT]);
      return [SEED_CLIENT];
    }
    return list;
  }

  public static getClientById(id: string): Client | null {
    const clients = this.getClients();
    return clients.find((c) => c.id === id) || null;
  }

  public static getClientByQuoteId(quoteId: string): Client | null {
    const clients = this.getClients();
    return clients.find((c) => c.quoteId === quoteId) || null;
  }

  public static createClientFromQuote(quote: Quote): Client {
    const existing = this.getClientByQuoteId(quote.id);
    if (existing) {
      return existing;
    }

    const promoMonths = quote.pricing?.applyDiscount ? (quote.pricing.discountDurationMonths || 6) : 0;
    const finalFee = quote.pricing?.finalMonthlyPrice || 0;
    const listPrice = quote.pricing?.listPrice || finalFee;

    const newClient: Client = {
      id: `client-${Date.now()}`,
      quoteId: quote.id,
      name: quote.clientName,
      category: quote.clientCategory,
      serviceTitle: quote.serviceTitle,
      status: 'ONBOARDING',
      startDate: Date.now(),
      monthlyFee: finalFee,
      listPrice: listPrice,
      promoTotalMonths: promoMonths,
      promoMonthsRemaining: promoMonths,
      onboarding: {
        contactDataCompleted: false,
        contactInfoNotes: '',
        logoReceived: false,
        highResLogoUrl: '',
        aestheticStandardized: false,
        brandPaletteNotes: '',
        instagramHandle: `@${quote.slug || 'cliente'}`,
      },
      email: `cliente.${quote.slug || Date.now()}@gestion.com`,
      loginPassword: 'cliente123',
      deliverables: [],
    };

    const clients = this.getClients();
    const updated = [newClient, ...clients];
    rtdbService.set(CLIENTS_STORAGE_KEY, updated);
    return newClient;
  }

  public static saveClient(client: Client): Client {
    const clients = this.getClients();
    const index = clients.findIndex((c) => c.id === client.id);

    let updated: Client[];
    if (index >= 0) {
      updated = [...clients];
      updated[index] = client;
    } else {
      updated = [client, ...clients];
    }

    rtdbService.set(CLIENTS_STORAGE_KEY, updated);
    return client;
  }

  public static updateStatus(id: string, status: ClientStatus): void {
    const clients = this.getClients().map((c) => (c.id === id ? { ...c, status } : c));
    rtdbService.set(CLIENTS_STORAGE_KEY, clients);
  }

  public static updateOnboarding(id: string, onboarding: OnboardingState): void {
    const client = this.getClientById(id);
    if (!client) return;
    this.saveClient({ ...client, onboarding });
  }

  public static adjustPromoMonths(id: string, delta: number): void {
    const client = this.getClientById(id);
    if (!client) return;

    const newRemaining = Math.max(0, Math.min(client.promoTotalMonths, client.promoMonthsRemaining + delta));
    const currentFee = newRemaining > 0 ? client.monthlyFee : client.listPrice;

    this.saveClient({
      ...client,
      promoMonthsRemaining: newRemaining,
      monthlyFee: currentFee,
    });
  }

  // --- MÉTODOS DE ENTREGABLES SEMANALES (ITERACIÓN 3) ---

  public static addDeliverable(clientId: string, item: DeliverableItem): void {
    const client = this.getClientById(clientId);
    if (!client) return;
    this.saveClient({
      ...client,
      deliverables: [item, ...(client.deliverables || [])],
    });
  }

  public static updateDeliverable(clientId: string, deliverableId: string, updates: Partial<DeliverableItem>): void {
    const client = this.getClientById(clientId);
    if (!client) return;
    const updated = (client.deliverables || []).map((d) =>
      d.id === deliverableId ? { ...d, ...updates, updatedAt: Date.now() } : d
    );
    this.saveClient({ ...client, deliverables: updated });
  }

  public static deleteDeliverable(clientId: string, deliverableId: string): void {
    const client = this.getClientById(clientId);
    if (!client) return;
    this.saveClient({
      ...client,
      deliverables: (client.deliverables || []).filter((d) => d.id !== deliverableId),
    });
  }

  public static generateWeeklyDeliverables(clientId: string, weekLabel: string): void {
    const client = this.getClientById(clientId);
    if (!client) return;

    const postItem: DeliverableItem = {
      id: `del-${Date.now()}-1`,
      weekLabel,
      type: 'GRAPHIC_POST',
      title: 'Pieza Gráfica Semanal (Posteo Estático)',
      rawAssetsLink: '',
      agencyPreviewLink: '',
      copyText: '',
      status: 'WAITING_ASSETS',
      updatedAt: Date.now(),
    };

    const reelItem: DeliverableItem = {
      id: `del-${Date.now()}-2`,
      weekLabel,
      type: 'REEL_VIDEO',
      title: 'Video Semanal Básico (Reel / Short)',
      rawAssetsLink: '',
      agencyPreviewLink: '',
      copyText: '',
      status: 'WAITING_ASSETS',
      updatedAt: Date.now(),
    };

    this.saveClient({
      ...client,
      deliverables: [postItem, reelItem, ...(client.deliverables || [])],
    });
  }

  public static submitClientRawAssets(clientId: string, deliverableId: string, rawAssetsLink: string): void {
    this.updateDeliverable(clientId, deliverableId, {
      rawAssetsLink,
      status: 'IN_PRODUCTION',
    });
  }

  public static clientApproveDeliverable(clientId: string, deliverableId: string): void {
    this.updateDeliverable(clientId, deliverableId, {
      status: 'APPROVED',
      clientFeedback: undefined,
    });
  }

  public static clientRequestChanges(clientId: string, deliverableId: string, feedback: string): void {
    this.updateDeliverable(clientId, deliverableId, {
      status: 'CHANGES_REQUESTED',
      clientFeedback: feedback,
    });
  }

  // --- MÉTODOS DE PUBLICIDAD & META ADS ---

  public static requestAdCampaign(
    clientId: string,
    campaignData: Omit<AdCampaign, 'id' | 'createdAt' | 'status'>
  ): AdCampaign | null {
    const client = this.getClientById(clientId);
    if (!client) return null;

    const newCampaign: AdCampaign = {
      ...campaignData,
      id: `ad-${Date.now()}`,
      status: 'REQUESTED',
      createdAt: Date.now(),
    };

    const currentCampaigns = client.adCampaigns || [];
    this.saveClient({
      ...client,
      adCampaigns: [newCampaign, ...currentCampaigns],
    });

    return newCampaign;
  }

  public static updateAdCampaignStatus(clientId: string, campaignId: string, status: AdCampaignStatus): void {
    const client = this.getClientById(clientId);
    if (!client || !client.adCampaigns) return;

    const updated = client.adCampaigns.map((ad) =>
      ad.id === campaignId ? { ...ad, status } : ad
    );
    this.saveClient({ ...client, adCampaigns: updated });
  }

  public static deleteAdCampaign(clientId: string, campaignId: string): void {
    const client = this.getClientById(clientId);
    if (!client || !client.adCampaigns) return;

    const updated = client.adCampaigns.filter((ad) => ad.id !== campaignId);
    this.saveClient({ ...client, adCampaigns: updated });
  }

  public static deleteClient(id: string): void {
    const clients = this.getClients().filter((c) => c.id !== id);
    rtdbService.set(CLIENTS_STORAGE_KEY, clients);
  }

  public static restoreSeed(): void {
    rtdbService.set(CLIENTS_STORAGE_KEY, [SEED_CLIENT]);
  }

  public static subscribe(callback: (clients: Client[]) => void): () => void {
    return rtdbService.listen<Client[]>(CLIENTS_STORAGE_KEY, callback);
  }
}
