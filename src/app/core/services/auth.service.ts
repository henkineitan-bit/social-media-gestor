import { AuthUser, LoginResponse, UserRole } from '../models/auth.model';
import { ClientsService } from './clients.service';
import { rtdbService } from './firebase-rtdb.service';

const AUTH_STORAGE_KEY = 'gestion_digital_auth_session';
const ADMINS_STORAGE_KEY = 'admins';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  pass: string;
  role: UserRole;
  createdAt?: string;
}

// Cuentas de administradores por defecto (sincronizadas directamente con Firebase RTDB)
export const DEFAULT_ADMINS: Record<string, AdminAccount> = {
  'usr-admin-martin': {
    id: 'usr-admin-martin',
    name: 'Martín Riera',
    email: 'martinrierajw@gmail.com',
    pass: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  'usr-admin-demo': {
    id: 'usr-admin-demo',
    name: 'Equipo de Gestión',
    email: 'admin@agencia.com',
    pass: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
};

type AuthListener = (user: AuthUser | null) => void;

export class AuthService {
  private static listeners: AuthListener[] = [];

  public static getAdminAccounts(): AdminAccount[] {
    const raw = rtdbService.get<Record<string, AdminAccount> | AdminAccount[]>(
      ADMINS_STORAGE_KEY,
      DEFAULT_ADMINS
    );

    if (!raw) return Object.values(DEFAULT_ADMINS);

    const accounts: AdminAccount[] = Array.isArray(raw) ? raw : Object.values(raw);

    // Asegurar que la cuenta de Martín siempre esté presente
    const hasMartin = accounts.some(
      (acc) => acc.email.toLowerCase() === 'martinrierajw@gmail.com'
    );
    if (!hasMartin) {
      accounts.push(DEFAULT_ADMINS['usr-admin-martin']);
      this.saveAdminAccount(DEFAULT_ADMINS['usr-admin-martin']);
    }
    return accounts;
  }

  // Compatibilidad con vistas previas
  public static getTeamAccounts() {
    return this.getAdminAccounts().map((a) => ({
      email: a.email,
      pass: a.pass,
      user: {
        id: a.id,
        name: a.name,
        email: a.email,
        role: a.role,
      },
    }));
  }

  public static saveAdminAccount(account: AdminAccount): void {
    const raw = rtdbService.get<Record<string, AdminAccount> | AdminAccount[]>(
      ADMINS_STORAGE_KEY,
      DEFAULT_ADMINS
    );
    let dict: Record<string, AdminAccount> = {};
    if (Array.isArray(raw)) {
      raw.forEach((a) => {
        dict[a.id || a.email.replace(/[@.]/g, '_')] = a;
      });
    } else if (raw && typeof raw === 'object') {
      dict = { ...raw };
    }
    dict[account.id] = account;
    rtdbService.set(ADMINS_STORAGE_KEY, dict);
  }

  public static createAdminAccount(data: {
    name: string;
    email: string;
    pass: string;
    role?: UserRole;
  }): { success: boolean; error?: string; account?: AdminAccount } {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPass = data.pass.trim();
    const cleanName = data.name.trim();

    if (!cleanEmail || !cleanPass || !cleanName) {
      return { success: false, error: 'Todos los campos son obligatorios.' };
    }

    const accounts = this.getAdminAccounts();
    const exists = accounts.some((a) => a.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' };
    }

    const slug = cleanName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'admin';

    const newAdmin: AdminAccount = {
      id: `usr-admin-${slug}-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      email: cleanEmail,
      pass: cleanPass,
      role: data.role || 'admin',
      createdAt: new Date().toISOString(),
    };

    this.saveAdminAccount(newAdmin);
    return { success: true, account: newAdmin };
  }

  public static deleteAdminAccount(id: string): boolean {
    const accounts = this.getAdminAccounts();
    const target = accounts.find((a) => a.id === id);
    if (!target || target.email.toLowerCase() === 'martinrierajw@gmail.com') {
      return false; // Proteger la cuenta de Martín
    }
    const raw = rtdbService.get<Record<string, AdminAccount>>(ADMINS_STORAGE_KEY, DEFAULT_ADMINS);
    if (raw && typeof raw === 'object') {
      const dict = { ...raw };
      delete dict[id];
      rtdbService.set(ADMINS_STORAGE_KEY, dict);
      return true;
    }
    return false;
  }

  public static updateTeamPassword(email: string, newPass: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAdminAccounts();
    const target = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (target) {
      target.pass = newPass.trim();
      this.saveAdminAccount(target);
      return true;
    }
    return false;
  }

  public static updateTeamProfile(email: string, name: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAdminAccounts();
    const target = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (target) {
      target.name = name.trim();
      this.saveAdminAccount(target);
      const current = this.getCurrentUser();
      if (current && current.email.toLowerCase() === cleanEmail) {
        this.setCurrentUser({ ...current, name: name.trim() });
      }
      return true;
    }
    return false;
  }

  public static getCurrentUser(): AuthUser | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as AuthUser;
    } catch {
      return null;
    }
  }

  public static login(identifier: string, pass: string): LoginResponse {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Por favor ingresa usuario y contraseña.' };
    }

    // 1. Verificar si coincide con cuenta de Administrador / Equipo (en RTDB)
    const adminAccounts = this.getAdminAccounts();
    const matchedAdmin = adminAccounts.find(
      (acc) => acc.email.toLowerCase() === cleanId && acc.pass === cleanPass
    );
    if (matchedAdmin) {
      const authUser: AuthUser = {
        id: matchedAdmin.id,
        name: matchedAdmin.name,
        email: matchedAdmin.email,
        role: matchedAdmin.role || 'admin',
      };
      this.setCurrentUser(authUser);
      return {
        success: true,
        user: authUser,
        redirectTo: 'dashboard',
      };
    }

    // 2. Verificar en el catálogo de clientes registrados
    const clients = ClientsService.getClients();
    const matchedClient = clients.find((c) => {
      const clientEmail = (c.email || '').toLowerCase().trim();
      const clientPass = c.loginPassword || 'cliente123';
      const clientId = c.id.toLowerCase();
      // Permite login por email o por ID interno asignado
      return (clientEmail === cleanId || clientId === cleanId) && clientPass === cleanPass;
    });

    if (matchedClient) {
      const clientUser: AuthUser = {
        id: `usr-${matchedClient.id}`,
        name: matchedClient.name,
        email: matchedClient.email || `${matchedClient.id}@cliente.com`,
        role: 'client',
        clientId: matchedClient.id,
        quoteId: matchedClient.quoteId,
      };

      this.setCurrentUser(clientUser);
      return {
        success: true,
        user: clientUser,
        redirectTo: `portal&id=${matchedClient.id}`,
      };
    }

    return {
      success: false,
      error: 'Credenciales inválidas. Verifica tu correo o contraseña.',
    };
  }

  public static logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.notifyListeners(null);
  }

  public static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  public static isAdminOrTeam(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'team';
  }

  public static isClient(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'client';
  }

  public static subscribe(callback: AuthListener): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static setCurrentUser(user: AuthUser): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    this.notifyListeners(user);
  }

  private static notifyListeners(user: AuthUser | null): void {
    this.listeners.forEach((cb) => cb(user));
  }
}
