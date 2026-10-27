# ITERACIÓN 2: GESTIÓN DE CLIENTES (CRM), CONVERSIÓN AUTOMÁTICA Y ONBOARDING

## 1. OBJETIVO DE ESTA ITERACIÓN
Excelente trabajo con la Iteración 1. Ahora vamos a construir la **Iteración 2**, enfocada en el **Panel Admin de Gestión de Clientes Nuevos y Activos (`client-manager`)**.

Cuando una cotización pasa a estado `'APPROVED'` (ya sea porque el cliente hizo clic en "Aceptar Propuesta Comercial" en la vista pública o porque el Admin la aprobó manualmente), el sistema debe crear o vincular automáticamente una ficha de cliente en el nodo `clients` de Firebase RTDB / Estado Reactivo, iniciando su etapa de **Onboarding** y el contador de meses de su bonificación.

---

## 2. REGLAS ESTRICTAS DE MANTENIMIENTO (MANDATORIO)
1. **Límite de 300 líneas por archivo:** Mantén todos los archivos nuevos y modificados estrictamente por debajo de las **300 líneas de código**.
2. **Modularización:** Separa la lista de clientes (`client-list.component.ts`), la vista de detalle (`client-detail.component.ts`) y el checklist de configuración inicial (`onboarding-checklist.component.ts`).
3. **Colorimetría:** Mantén estrictamente la paleta Blanca (`bg-white`), Gris claro (`bg-slate-50`), Negro (`text-slate-900`) y Azul (`bg-blue-600`, `bg-blue-50`, `text-blue-600`).
4. **No rompas la Iteración 1:** El cotizador y la vista pública A4 deben seguir funcionando exactamente igual, integrándose ahora con el servicio de clientes.

---

## 3. ARCHIVOS A CREAR O ACTUALIZAR EN ESTA ITERACIÓN

```text
src/app/
├── core/
│   ├── models/
│   │   └── client.model.ts                    # [ACTUALIZAR] Modelo completo de Cliente y Onboarding
│   └── services/
│       ├── clients.service.ts                 # [CREAR] Signals y CRUD de clientes + conversión desde Quote
│       └── quotes.service.ts                  # [ACTUALIZAR] Disparar creación de cliente al aprobar Quote
└── features/
    └── admin/
        └── client-manager/
            ├── client-list.component.ts       # [CREAR] Directorio CRM con filtros y métricas de promo
            ├── client-detail.component.ts     # [CREAR] Cabecera del cliente, estado de promo y pestañas
            └── onboarding-checklist.component.ts # [CREAR] Checklist interactivo de Configuración Inicial
```

---

## 4. MODELO DE DATOS DE CLIENTE (`client.model.ts`)

```typescript
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
}
```

### Datos Semilla en `clients.service.ts`
Incluye por defecto el cliente **"Familia Cardoso"** vinculado a su cotización inicial para poder probar de inmediato tanto el Onboarding como la gestión activa.

---

## 5. REQUERIMIENTOS FUNCIONALES DETALLADOS

### A. Conversión Automática Cotización -> Cliente
- En `quotes.service.ts` y `proposal-view.component.ts`, cuando una cotización cambia su estado a `'APPROVED'`, verifica si ya existe un cliente con ese `quoteId`.
- Si no existe, llama a `clientsService.createClientFromQuote(quote)` que crea automáticamente el cliente en estado `'ONBOARDING'`, copiando sus precios (`finalMonthlyPrice`, `listPrice`, `discountDurationMonths`) e inicializando el objeto `onboarding` en blanco.

### B. `client-list.component.ts` (Tablero CRM)
- Ruta Admin: `/admin/clientes`.
- **Filtros por Pestañas (Pills azules/grises):** `Todos`, `En Onboarding (Nuevos)`, `Clientes Activos`, `Pausados`.
- **Tarjetas o Tabla de Clientes:**
  - Nombre del cliente, categoría (`Cliente Preferencial`), `@instagramHandle` y estado (`ONBOARDING` o `ACTIVE`).
  - **Indicador de Bonificación (Promo Tracker):** Muestra una barra de progreso o badge azul indicando cuántos meses de promoción al 50% le quedan (ej. `"Mes 1 de 6 con 50% OFF — Cuota actual: $161.490"`).
  - **Progreso de Onboarding:** Muestra el porcentaje completado de la puesta a punto inicial (ej. `1/3 tareas listas` o `100% Completado`).
  - Botón para entrar al detalle (`/admin/clientes/:id`).

### C. `client-detail.component.ts` y `onboarding-checklist.component.ts`
- Ruta Admin: `/admin/clientes/:id`.
- **Cabecera Ejecutiva:**
  - Datos del cliente, botón para ver su cotización original (`/propuesta/:slug`), y botón para copiar el **Link del Portal del Cliente** (`/portal/:id` que completaremos en la Iteración 3).
  - Control rápido del **Contador de Meses de Bonificación**: Botones `+` / `-` para descontar o ajustar manualmente los `promoMonthsRemaining` a medida que se facturan los meses, actualizando la tarifa mostrada si llega a `0` (pasa a tarifa estándar `listPrice`).
- **Módulo de Onboarding (`onboarding-checklist.component.ts`):**
  - Refleja exactamente los 3 entregables del módulo **"Configuración & Optimización Inicial"** de la cotización:
    1. **Carga e integración de datos de contacto completos:** Checkbox de completado + Textarea para anotar WhatsApp comercial, correo, dirección y links de bio.
    2. **Carga e implementación del logo en alta resolución:** Checkbox de completado + Input para pegar el link de Google Drive/WeTransfer con el logo + botón externo para abrir el link.
    3. **Emprolijamiento y estandarización estética general de la cuenta:** Checkbox de completado + Input para `@usuario` de Instagram y notas de paleta estética.
  - **Cálculo Reactivo:** Si los 3 checks están marcados (`100%`), muestra un banner azul sugiriendo pasar el estado del cliente de `'ONBOARDING'` a `'ACTIVE'` con un solo clic.