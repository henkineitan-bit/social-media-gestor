/**
 * Servicio de persistencia híbrida (Firebase Realtime Database con fallback reactivo en localStorage)
 * 100% compatible con Firebase Hosting y el Plan Spark Gratuito (sin tarjeta de crédito requerida).
 */

type ListenerCallback<T> = (data: T) => void;

class FirebaseRtdbService {
  private rtdbUrl: string | null = null;
  private listeners: Map<string, Set<ListenerCallback<unknown>>> = new Map();

  constructor() {
    this.initUrl();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifyListeners(e.key.replace(/^sq_/, ''), parsed);
          } catch {
            // Ignore parse errors on other storage keys
          }
        }
      });

      // Sincronizar datos remotos de Firebase al iniciar
      if (this.rtdbUrl) {
        this.initRemoteSync(['clients', 'quotes', 'admins']);
      }
    }
  }

  private initUrl(): void {
    if (typeof window === 'undefined') return;
    const custom = localStorage.getItem('sq_rtdb_custom_url');
    if (custom) {
      this.rtdbUrl = custom;
      return;
    }
    this.rtdbUrl = 
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_RTDB_URL) || 
      'https://servicios-gestion-socialmedia-default-rtdb.firebaseio.com';
  }

  public setCustomRtdbUrl(url: string | null): void {
    if (!url || !url.trim()) {
      localStorage.removeItem('sq_rtdb_custom_url');
      this.rtdbUrl = 
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_RTDB_URL) || 
        'https://servicios-gestion-socialmedia-default-rtdb.firebaseio.com';
      return;
    }
    const cleanUrl = url.trim().replace(/\/$/, '');
    localStorage.setItem('sq_rtdb_custom_url', cleanUrl);
    this.rtdbUrl = cleanUrl;
    this.initRemoteSync(['clients', 'quotes', 'admins']);
  }

  public async initRemoteSync(paths: string[]): Promise<void> {
    if (!this.rtdbUrl) return;
    for (const path of paths) {
      try {
        const endpoint = `${this.rtdbUrl.replace(/\/$/, '')}/${path}.json`;
        const res = await fetch(endpoint);
        if (res.ok) {
          const remoteData = await res.json();
          if (remoteData !== null) {
            localStorage.setItem(`sq_${path}`, JSON.stringify(remoteData));
            this.notifyListeners(path, remoteData);
          } else {
            const local = localStorage.getItem(`sq_${path}`);
            if (local) {
              await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: local,
              });
            }
          }
        }
      } catch (err) {
        console.warn(`[RTDB-Service] Remote sync failed for ${path}:`, err);
      }
    }
  }

  public getConnectionMode(): { mode: 'rtdb' | 'local'; label: string; url?: string } {
    if (this.rtdbUrl) {
      return { mode: 'rtdb', label: 'Sincronización en la Nube Activa', url: this.rtdbUrl };
    }
    return { mode: 'local', label: 'Modo Local' };
  }

  public get<T>(path: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(`sq_${path}`);
      if (!stored) {
        this.set(path, defaultValue);
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch (e) {
      console.warn(`[RTDB-Service] Error reading path ${path}:`, e);
      return defaultValue;
    }
  }

  public set<T>(path: string, data: T): void {
    try {
      localStorage.setItem(`sq_${path}`, JSON.stringify(data));
      this.notifyListeners(path, data);
      
      // Si hay URL de RTDB configurada, sincronizar con el endpoint REST de Firebase
      if (this.rtdbUrl) {
        this.syncToRemoteRtdb(path, data);
      }
    } catch (e) {
      console.error(`[RTDB-Service] Error saving path ${path}:`, e);
    }
  }

  public listen<T>(path: string, callback: ListenerCallback<T>): () => void {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    const set = this.listeners.get(path)!;
    set.add(callback as ListenerCallback<unknown>);

    return () => {
      set.delete(callback as ListenerCallback<unknown>);
    };
  }

  private notifyListeners<T>(path: string, data: T): void {
    const set = this.listeners.get(path);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[RTDB-Service] Listener error on path ${path}:`, err);
        }
      });
    }
  }

  private async syncToRemoteRtdb<T>(path: string, data: T): Promise<void> {
    if (!this.rtdbUrl) return;
    try {
      const endpoint = `${this.rtdbUrl.replace(/\/$/, '')}/${path}.json`;
      await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn(`[RTDB-Service] Remote sync to ${this.rtdbUrl} failed, preserving local state:`, err);
    }
  }

  public clearStorage(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sq_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}

export const rtdbService = new FirebaseRtdbService();
