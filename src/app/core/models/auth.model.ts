export type UserRole = 'admin' | 'team' | 'client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clientId?: string;      // ID de cliente vinculado si el rol es 'client'
  quoteId?: string;       // ID de cotización vinculada para acceso directo
  avatar?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
  redirectTo?: string;
}
