# ITERACIÓN 3: GESTIÓN DE ENTREGABLES SEMANALES Y PORTAL PÚBLICO DEL CLIENTE

## 1. OBJETIVO DE ESTA ITERACIÓN
Vamos a completar la aplicación con la **Iteración 3**. 
En los términos y condiciones de la cotización se establece que: *"Los insumos gráficos (fotos, videos en alta calidad y logotipos) deben ser proporcionados a tiempo por el cliente para mantener el cronograma de entregas"*, y que el servicio incluye **1 pieza gráfica semanal** y **1 video semanal básico (Reel/Short)**.

En esta iteración construiremos:
1. **El Gestor de Entregas Semanales en el Panel Admin** (dentro del detalle del cliente).
2. **El Portal Público del Cliente (`/portal/:clientId`)**, donde el cliente puede subir sus links de insumos crudos (fotos/videos), completar datos de onboarding faltantes y aprobar o pedir cambios sobre las piezas diseñadas por la agencia.

---

## 2. REGLAS ESTRICTAS DE MANTENIMIENTO (MANDATORIO)
1. **Límite de 300 líneas por archivo:** Ningún archivo `.ts` o `.html` puede superar las **300 líneas**. Crea sub-componentes dedicados para no recargar `client-detail.component.ts` ni `client-portal.component.ts`.
2. **Sin Firebase Storage Pago:** Todo el intercambio de archivos pesados (logos en alta, videos crudos, Reels editados y diseños gráficos) se realiza mediante **URLs externas** (links a carpetas de Google Drive, Dropbox, WeTransfer o Canva) validadas limpiamente en los formularios.
3. **Colorimetría:** Mantén la estética corporativa en Blanco (`bg-white`), Gris claro (`bg-slate-50`), Negro (`text-slate-900`) y Azul (`bg-blue-600`, `bg-blue-50`, `text-blue-600`).

---

## 3. ARCHIVOS A CREAR O ACTUALIZAR EN ESTA ITERACIÓN

```text
src/app/
├── core/
│   └── services/
│       └── clients.service.ts                      # [ACTUALIZAR] Métodos para CRUD de entregables y feedback
└── features/
    ├── admin/
    │   └── client-manager/
    │       ├── client-detail.component.ts          # [ACTUALIZAR] Agregar pestaña de Entregas Semanales
    │       └── deliverables-manager.component.ts   # [CREAR] Gestor Admin de posteos y Reels semanales
    └── public/
        └── client-portal/
            ├── client-portal.component.ts          # [CREAR] Vista principal del Portal Público del Cliente
            ├── portal-assets-drop.component.ts     # [CREAR] Sub-componente para que el cliente envíe insumos
            └── portal-approval-card.component.ts   # [CREAR] Tarjeta para aprobar o pedir cambios en piezas
```

---

## 4. REQUERIMIENTOS FUNCIONALES DETALLADOS

### A. Panel Admin: Gestor de Entregas Semanales (`deliverables-manager.component.ts`)
- Se integra como una pestaña o sección principal dentro de `client-detail.component.ts` llamada **"Calendario & Entregas Semanales"**.
- **Botón "Generar Semana de Trabajo":** Con un solo clic, crea automáticamente los 2 entregables estándar contratados para una semana determinada (ej. `"Semana 1 - Noviembre"`):
  1. `GRAPHIC_POST`: *"Pieza Gráfica Semanal (Posteo Estático)"*.
  2. `REEL_VIDEO`: *"Video Semanal Básico (Reel / Short)"*.
  *(También permite agregar una entrega individual personalizada).*
- **Gestión de cada Entrega por parte del Admin:**
  - Selector de Estado:
    - `WAITING_ASSETS` (Esperando insumos del cliente)
    - `IN_PRODUCTION` (En edición / diseño)
    - `PENDING_APPROVAL` (Listo para revisión del cliente)
    - `CHANGES_REQUESTED` (Cliente solicitó ajustes)
    - `APPROVED` (Aprobado para publicar)
  - Visualización del **Link de Insumos Crudos (`rawAssetsLink`)** enviado por el cliente.
  - Input para que el Admin pegue el **Link del Entregable Terminado (`agencyPreviewLink`)** (ej. link al video editado o imagen en Drive/Canva).
  - Textarea para redactar el **Copy / Texto de la publicación (`copyText`)**.
  - Si el estado es `CHANGES_REQUESTED`, muestra una alerta destacada con el comentario (`clientFeedback`) que dejó el cliente.

### B. Vista Pública: Portal del Cliente (`client-portal.component.ts`)
- Ruta pública sin login complejo: `/portal/:clientId` (accesible desde el botón "Ver Portal del Cliente" en el Admin y desde un acceso directo de demostración en el Navbar para poder probarlo fácilmente).
- **Cabecera de Bienvenida:**
  - Saludo personalizado: `"Portal de Gestión Digital — [Nombre del Cliente]"`.
  - Badge con su categoría (`Cliente Preferencial`) y resumen transparente de su plan activo (ej. `"Plan Mensual Promocional Activo: $161.490 (50% OFF — Te quedan X meses de bonificación)"`) con un link para ver su propuesta original (`/propuesta/:slug`).
- **Sección 1: Onboarding & Insumos del Perfil (`portal-assets-drop.component.ts`):**
  - Permite al cliente ver qué ítems de su **Configuración Inicial** están pendientes.
  - Si aún no envió el logo en alta resolución o sus datos de contacto, le muestra un formulario limpio para pegar el link de su logo (`highResLogoUrl`) y sus datos de contacto, actualizando en tiempo real el checklist del Admin.
  - **Recordatorio de Términos:** Banner sutil azul claro recordando que enviar los insumos a tiempo mantiene al día el cronograma semanal de entregas.
- **Sección 2: Calendario de Entregas y Aprobaciones (`portal-approval-card.component.ts`):**
  - Lista agrupada por semana de las piezas (`Pieza Gráfica Semanal` y `Video Reel Semanal`).
  - **Paso 1 para el Cliente (Subir Insumos Crudos):** En cada tarjeta (especialmente si está en `WAITING_ASSETS`), el cliente tiene un campo para pegar el link de Google Drive/WeTransfer con las fotos o videos crudos de esa semana. Al guardarlo, el estado pasa automáticamente a `'IN_PRODUCTION'`.
  - **Paso 2 para el Cliente (Revisar y Aprobar):** Cuando la agencia carga el `agencyPreviewLink` y el `copyText` (estado `PENDING_APPROVAL`), el cliente ve:
    - Botón para abrir y ver el diseño/video terminado.
    - Caja con el *Copy* (texto del posteo) propuesto por la agencia.
    - Dos botones de acción:
      1. **Botón Azul Primario ("Aprobar Publicación"):** Cambia el estado a `'APPROVED'` y registra la aprobación.
      2. **Botón Secundario ("Solicitar Ajuste"):** Despliega un campo de texto donde el cliente escribe qué desea corregir (`clientFeedback`) y cambia el estado a `'CHANGES_REQUESTED'`.

---

## 5. DATOS DE PRUEBA PARA DEMOSTRACIÓN INMEDIATA
Actualiza los datos semilla de **"Familia Cardoso"** en `clients.service.ts` para que ya incluya **2 entregas en la "Semana 1"**:
1. Una **Pieza Gráfica Semanal** en estado `'PENDING_APPROVAL'` (con un link de vista previa de ejemplo y un copy redactado listo para que puedas probar el botón "Aprobar" o "Solicitar Ajuste" en el portal).
2. Un **Video Semanal Básico (Reel)** en estado `'WAITING_ASSETS'` (listo para probar cómo el cliente pega el link de sus videos crudos).