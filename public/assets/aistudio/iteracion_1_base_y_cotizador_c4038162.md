# ITERACIÓN 1: ARQUITECTURA BASE, MOTOR DE COTIZACIONES Y VISTA PÚBLICA A4

## 1. ROL Y OBJETIVO DE ESTA ITERACIÓN
Actúa como un Arquitecto de Software Senior especialista en Angular (v17/18+) y Firebase. 
Estamos construyendo una plataforma SaaS para una agencia de **"Servicios de Gestión Digital & Social Media"**.

En esta **Iteración 1**, tu único objetivo es construir los cimientos de la aplicación, el **Constructor de Cotizaciones (Panel Admin)** y la **Vista Pública de Propuesta Comercial (Imprimible en A4)**. **NO construyas todavía** el CRM de clientes ni el portal de entregas semanales; deja sus rutas preparadas o con componentes placeholder simples.

---

## 2. REGLAS ESTRICTAS DE ARQUITECTURA Y CÓDIGO (MANDATORIO)
1. **Límite de Líneas por Archivo:** NINGÚN archivo (`.ts`, `.html`, `.css`) puede superar las **300 líneas de código**. Divide las vistas complejas en sub-componentes granulares (`dumb components`).
2. **Angular Moderno:**
   - Usa exclusivamente **Standalone Components** (`standalone: true`).
   - Gestión de estado reactiva mediante **Angular Signals** (`signal`, `computed`, `effect`).
   - Nuevo control flow en plantillas (`@if`, `@for`, `@switch`).
   - Inyección de dependencias con `inject()`.
3. **Persistencia Híbrida (RTDB + Fallback Local):** Diseña el servicio de Firebase Realtime Database (`firebase-rtdb.service.ts`) de modo que pueda conectarse a una URL de RTDB configurada en `environment`, pero que incluya un **modo reactivo con `localStorage` y datos semilla (seed data)** pre-cargados para que la app funcione al 100% en el preview de AI Studio desde el segundo cero.
4. **Cero Hardcodeo en Vistas:** Los módulos de servicio, precios base, descuentos y términos deben venir de los servicios reactivos, nunca estáticos en el HTML.

---

## 3. SISTEMA DE DISEÑO Y COLORIMETRÍA (TAILWIND CSS)
Estética minimalista, corporativa y limpia (inspirada en Linear / Stripe):
- **Fondos:** Blanco puro (`bg-white`) para tarjetas, formularios y hoja de presupuesto; Gris claro (`bg-slate-50` / `bg-gray-100`) para el fondo general de la app.
- **Textos y Bordes:** Negro/Gris muy oscuro (`text-slate-900`) para títulos y montos principales; Gris medio (`text-slate-500`) para subtítulos; Bordes finos (`border-slate-200`).
- **Acento Principal (Azul):** Azul corporativo (`bg-blue-600`, `hover:bg-blue-700`, `text-blue-600`, `bg-blue-50`, `border-blue-200`) para botones primarios, badges de estado, switches activos y el recuadro de bonificación especial.
- **Tipografía:** `Inter` o `Plus Jakarta Sans`.

---

## 4. ÁRBOL DE ARCHIVOS A GENERAR EN ESTA ITERACIÓN

```text
src/app/
├── core/
│   ├── models/
│   │   ├── quote.model.ts              # Interfaces de Cotización, Módulos y Precios
│   │   └── client.model.ts             # Interfaces base de Cliente (para tipado futuro)
│   └── services/
│       ├── firebase-rtdb.service.ts    # Wrapper CRUD RTDB con fallback local + Seed Data
│       └── quotes.service.ts           # Signals para gestionar catálogo y cotizaciones
├── shared/
│   └── components/
│       ├── navbar.component.ts         # Navegación Admin minimalista
│       └── status-badge.component.ts   # Badge reutilizable (DRAFT, SENT, APPROVED)
└── features/
    ├── admin/
    │   ├── dashboard/
    │   │   └── dashboard.component.ts  # Lista de cotizaciones creadas, métricas y accesos
    │   └── quote-builder/
    │       ├── quote-builder.component.ts     # Contenedor principal del armador
    │       ├── module-selector.component.ts   # Sub-componente para elegir/editar módulos
    │       └── pricing-summary.component.ts   # Sub-componente de cálculo y bonificación
    └── public/
        └── proposal-view/
            └── proposal-view.component.ts     # Vista pública de cotización + Modo Impresión A4
```

---

## 5. MODELOS DE DATOS Y SEMILLA INICIAL (SEED DATA)

### Interfaces (`quote.model.ts`)
```typescript
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
```

### Datos Semilla Obligatorios (Precargar en `quotes.service.ts`)
Debes inicializar el catálogo de plantillas y una **cotización de ejemplo ya creada** llamada **"Familia Cardoso"** con estos datos exactos:
- **Cliente:** `Familia Cardoso` | **Categoría:** `Cliente Preferencial`
- **Detalle de Propuesta:** `Gestión de Instagram` | **Subtítulo:** `Servicio Mensual Inicial`
- **Módulos Incluidos:**
  1. **Configuración & Optimización Inicial** (*Puesta a punto del perfil institucional en Instagram.*) - Precio base sugerido: `$80.000`
     - `Carga e integración de datos de contacto completos.`
     - `Carga e implementación del logo en alta resolución.`
     - `Emprolijamiento y estandarización estética general de la cuenta.`
  2. **Planificación & Diseño Gráfico** (*Estrategia visual y contenidos estáticos.*) - Precio base sugerido: `$120.000`
     - `Diseño y estructuración del calendario de publicaciones.`
     - `Creación de 1 pieza gráfica semanal (diseño de posteo para contenido general del servicio).`
  3. **Producción Audiovisual** (*Contenido dinámico para Reels/Shorts.*) - Precio base sugerido: `$122.980`
     - `Creación de 1 video semanal básico.`
     - `Edición realizada a partir de videos o fotos proporcionadas por el cliente.`
- **Bonificación y Precios:**
  - Precio de Lista Mensual: `$322.980`
  - Bonificación activa: `Bonificación Especial de Bienvenida` (Se aplica un 50% de descuento directo sobre la cuota mensual durante los primeros 6 meses de contratación del servicio).
  - Descuento (Primeros 6 meses - 50%): `-$161.490`
  - Total Mensual Promocional: `$161.490`
- **Términos y Condiciones Generales:**
  - `Los insumos gráficos (fotos, videos en alta calidad y logotipos) deben ser proporcionados a tiempo por el cliente para mantener el cronograma de entregas.`
  - `La bonificación del 50% es válida exclusivamente durante los primeros 6 meses consecutivos. A partir del séptimo mes se aplicará la tarifa estándar vigente.`

---

## 6. REQUERIMIENTOS FUNCIONALES DE LOS COMPONENTES

### A. `dashboard.component.ts`
- Muestra tarjetas de resumen: Total Cotizaciones, Cotizaciones Aprobadas, Monto Mensual Proyectado.
- Tabla limpia con las cotizaciones creadas (incluyendo "Familia Cardoso" por defecto).
- Acciones rápidas por fila: **Editar en el Constructor**, **Abrir Vista Pública (`/propuesta/:slug`)**, **Copiar Link**, y cambiar estado.

### B. `quote-builder.component.ts` (+ Sub-componentes)
- **Cabecera del Prospecto:** Inputs reactivos para Nombre del Cliente, Categoría (`Cliente Preferencial`, `Empresa`, `Emprendedor`), Título del Servicio y Subtítulo. Genera automáticamente el `slug` (ej. `familia-cardoso`).
- **Selector de Módulos (`module-selector.component.ts`):**
  - Botones para agregar módulos desde el catálogo predefinido o crear un módulo en blanco.
  - Cada módulo agregado permite editar su título, subtítulo, precio individual y agregar/eliminar/editar ítems de su lista de `deliverables` (entregables).
- **Resumen Financiero (`pricing-summary.component.ts`):**
  - Calcula automáticamente `listPrice` sumando los precios de los módulos activos usando `computed()`.
  - Switch/Toggle azul para activar la **Bonificación Especial**.
  - Inputs para editar el porcentaje de descuento (por defecto `50%`) y cantidad de meses (por defecto `6`).
  - Muestra en vivo el ahorro (`-$161.490`) y el **Total Mensual Promocional** (`$161.490`).
- **Editor de Términos:** Lista editable de condiciones generales.
- **Botón Guardar y Previsualizar:** Guarda en RTDB/Estado y navega a la vista pública.

### C. `proposal-view.component.ts` (Vista Pública & Impresión A4)
- Ruta: `/propuesta/:slug`.
- Diseño de **Documento Ejecutivo Premium** centrado en pantalla (`max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 p-8 md:p-12`).
- Estructura visual fiel al documento comercial:
  1. Cabecera institucional: `"SERVICIOS DE GESTIÓN DIGITAL & SOCIAL MEDIA"`.
  2. Bloque de destinatario: `"PREPARADO PARA: [Nombre Cliente]"` con badge azul `"Cliente Preferencial"` y al lado `"DETALLE DE PROPUESTA: [Título Servicio]"`.
  3. Tabla estilizada `"DETALLE DEL SERVICIO"` con dos columnas (`MÓDULO DE TRABAJO` | `ENTREGABLES INCLUIDOS` con bullets azules).
  4. Caja destacada en estética azul suave (`bg-blue-50 border-blue-200`) para la **Bonificación Especial de Bienvenida** y tabla de desglose numérico (`Precio de Lista Mensual`, `Descuento`, y fila destacada en negro/azul para `Total Mensual Promocional`).
  5. Pie de página con `"TÉRMINOS Y CONDICIONES GENERALES"`.
- **Barra de Acción Flotante (`print:hidden`):**
  - Botón secundario: **"Imprimir / Guardar PDF"** (ejecuta `window.print()`). Asegúrate de configurar clases `@media print` (`print:shadow-none print:border-none print:p-0`) para que la hoja A4 salga impecable.
  - Botón primario Azul: **"Aceptar Propuesta Comercial"** (actualiza el estado de la cotización a `'APPROVED'` y muestra confirmación visual).