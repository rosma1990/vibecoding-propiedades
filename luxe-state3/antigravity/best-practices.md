# Buenas Prácticas para Apps Inmobiliarias en Next.js

Resumen rápido de prácticas clave para alto rendimiento, excelente UX y escalabilidad en plataformas de bienes raíces.

## 1. Arquitectura (Next.js)
* Usar **App Router** (`/app`) para maximizar los Server Components.
* Aplicar **ISR** (Incremental Static Regeneration) en páginas de detalles de propiedades.
* Utilizar **SSR** (Server-Side Rendering) para listados y búsquedas dinámicas.
* Implementar `<Suspense>` para mostrar *skeletons* de carga.
* Hacer **Lazy Loading** (`next/dynamic`) en mapas interactivos y tours 3D.
* Restringir el uso de `"use client"` estrictamente a componentes interactivos.

## 2. Búsqueda y Filtrado
* Aplicar **Debounce** (~300-500ms) en barras de búsqueda de texto.
* Sincronizar todos los filtros con los **parámetros de la URL** (`?precio=...`).
* Ocultar filtros avanzados (amenidades, año) en un modal o menú colapsable.
* Implementar **autocompletado** predictivo para buscar ubicaciones.
* Mantener el estado de búsqueda intacto al navegar hacia atrás.

## 3. Optimización de Imágenes
* Emplear SIEMPRE `next/image` para usar formatos modernos (WebP/AVIF).
* Cargar de forma inicial solo la **portada y 2 imágenes** extra.
* Usar **carruseles/modales con carga diferida** para el resto de la galería.
* Servir todas las fotografías mediante un **CDN global** rápido.
* Declarar `width` y `height` en imágenes para evitar el *Cumulative Layout Shift* (CLS).

## 4. Diseño UI / UX
* Mantener un estilo premium: **minimalismo**, *whitespace* abundante y tipografía moderna (ej. Inter).
* Agregar **micro-interacciones** (elevaciones, sombras dinámicas) en *hover*.
* Destacar el estado con **insignias visuales** ("Destacado", "Vendido", "Nuevo").
* Proveer navegación dual: **Vista de Lista** y **Vista de Mapa**.
* Activar **agrupación de marcadores** (*clustering*) en zonas con muchas propiedades.
* Desarrollar bajo la filosofía **Mobile-first** (100% responsivo).

## 5. SEO y Accesibilidad
* Inyectar `generateMetadata` para **títulos y descripciones dinámicos** por cada propiedad.
* Integrar **Schema Markup** (JSON-LD de tipo `RealEstateListing`).
* Autogenerar el `sitemap.xml` con las URL de las propiedades activas.
* Respetar la jerarquía semántica del HTML (`h1`, `h2`, `h3`).
* Describir cada fotografía con atributos `alt` detallados para accesibilidad.

## 6. Seguridad y Base de Datos (Supabase)
* Activar imperativamente **Row Level Security (RLS)** en todas las tablas.
* Habilitar políticas de *lectura pública* y *escritura privada* (solo admins/agentes).
* Implementar **paginación o Infinite Scroll** para consultas de propiedades.
* Validar esquemas de datos desde el cliente al servidor usando **Zod**.
* Crear **índices en BD** en columnas críticas (ubicación, rango de precio).

## 7. Extras e Innovación
* Integrar una **Calculadora de Hipotecas** en las vistas de detalles.
* Habilitar guardado en **Favoritos** usando `localStorage` (invitados) o BD (usuarios).
* Soportar **Modo Oscuro** para contrastar mejor los colores premium.
* Facilitar visualización de **Tours Virtuales 360°** (Matterport, YouTube).
* Crear un sistema de **Alertas Automáticas** cuando bajen los precios de favoritos.
