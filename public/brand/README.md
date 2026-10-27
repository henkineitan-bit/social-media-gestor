# Gestión Digital & Social Media — Brand Kit

Paquete de recursos visuales creado a partir de la dirección visual aprobada. Incluye vectores SVG y exportaciones PNG de alta resolución.

## Contenido

- `logos/svg/`: logos horizontales, apilados, wordmarks e isotipos en color, monocromo y blanco. Los textos de los logos están vectorizados, por lo que no dependen de una fuente instalada.
- `logos/png/`: exportaciones transparentes en alta resolución para documentos, CMS y herramientas que no aceptan SVG.
- `app-icons/`: icono de aplicación en SVG/PNG (16 a 1024 px), favicon SVG e ICO.
- `icons/svg/`: iconos lineales de interfaz (24 × 24), preparados con `currentColor` para heredar el color CSS. `sprite.svg` contiene símbolos SVG con IDs.
- `icons/png/`: vista previa/exportación azul de cada icono a 64 y 128 px.
- `badges/`: muestras SVG de estados Activo, Borrador, Pendiente y Entregado.
- `patterns/`: patrones decorativos escalables.
- `illustrations/`: ilustración editable del flujo de entregables en SVG y PNG.
- `tokens/`: paleta JSON y variables CSS listas para la interfaz.
- `preview/`: hoja de referencia visual original.

## Colores

| Token | HEX | Uso sugerido |
|---|---|---|
| Primario | `#1760FF` | Acciones principales, enlaces, foco |
| Texto principal | `#081B3A` | Títulos y texto importante |
| Texto secundario | `#64748B` | Ayuda, etiquetas y metadatos |
| Superficie | `#E6EDF7` | Superficies suaves |
| Fondo | `#F7FAFF` | Fondo de páginas |
| Éxito | `#12B76A` | Estado positivo/completado |
| Advertencia | `#F59E0B` | Pendientes y alertas suaves |

## Uso recomendado

- Web: usar SVG para logos, favicons, iconos, patrones e ilustraciones; importar `tokens/design-tokens.css`.
- App/icono instalado: elegir el PNG de `app-icons/` del tamaño requerido.
- Fondo oscuro: usar las variantes `-blanco.svg` sobre fondos oscuros.
- Monocromo: usar las variantes `-monocromo.svg` en espacios de un solo color.
- Iconos de UI: al usar los SVG directamente, controlar el color con CSS (`color: var(--gd-primary)`). Para tamaños estándar, mantener 20–24 px de caja en navegación y 16–20 px en acciones secundarias.

## Nota de producción

Los SVG están diseñados para ser escalables y se entregan sin rasterizar. Revisa contraste y tamaño óptico al integrarlos en componentes reales. El logo principal se ha preparado como vector geométrico; antes de imprimir a gran formato o registrar marca, conviene validar el arte final y sus usos legales/comerciales.
