Te recomiendo un flujo **“web-first + app wrapper”** para avanzar rápido sin duplicar trabajo:

## 1) Define el hub como “launcher”

Piensa el hub como:

-   **Portada** con identidad visual fuerte (como tu CSS actual: oscuro, tipografía compacta, UI limpia).
-   **Grid de experiencias** (cards minimalistas: título, duración estimada, estado “nuevo”, favorito).
-   **Vista de juego** embebida (iframe o carga del mini juego en una ruta dedicada).
-   **Progreso ligero** (último jugado, récord local, tiempo total).

Tu estilo actual ya encaja: paleta oscura, bordes finos, overlays, cards, microanimaciones styles.css.

## 2) Arquitectura recomendada

Como ya tienes HTML/CSS/Vanilla JS:

-   Crea un **core shell** (hub) en una SPA ligera (puede ser Vanilla + Vite, o Preact).
-   Cada minijuego como **módulo independiente**:
    -   `/games/nombre-juego/index.html`
    -   `manifest.json` propio (metadatos: nombre, descripción, input, orientación, duración).
-   El hub lee esos manifests y arma el catálogo automáticamente.

Así puedes seguir creando juegos simples sin romper el sistema.

## 3) Unifica contrato técnico de cada minijuego

Define una API mínima entre hub y juego:

-   `start()`, `pause()`, `resume()`, `restart()`, `destroy()`
-   Eventos: `game_over`, `score`, `unlock`, `exit`
-   Mensajería por `postMessage` si usas iframe.

Esto te permite:

-   ranking global
-   achievements comunes
-   analytics simples por juego
-   botón universal “salir”

## 4) Datos y backend (mínimo al inicio)

Empieza simple:

-   **v1 local-first**: `localStorage`/`IndexedDB` para progreso.
-   **v2 cloud sync**: Supabase/Firebase (auth + progreso + favoritos + nube).
-   Si quieres crecer: leaderboard por juego y retos semanales.

## 5) Web + Android/iOS con un solo código base

Ruta recomendada:

1.  **PWA** primero (instalable desde navegador).
2.  Empaquetar la misma web en app con **Capacitor** para Android/iOS.
3.  Añadir nativos solo donde haga falta (notificaciones, haptics, game center, etc.).

Con esto:

-   90% del código compartido
-   despliegue rápido
-   mantenimiento bajo

## 6) UX para “microexperiencias”

Como son minijuegos minimalistas:

-   Acceso en **1 toque** desde hub.
-   Carga rápida (ideal <2s).
-   Duración visible (ej. “30s”, “2 min”).
-   “Volver al hub” siempre accesible.
-   “Siguiente recomendado” al terminar.
-   Sonido/haptics opcionales globales (toggle en hub).

## 7) Pipeline de trabajo (práctico)

Te propongo este flujo semanal:

1.  **Plantilla base de juego** (starter con tu estilo y utilidades).
2.  Crear juego nuevo clonando template.
3.  Completar `manifest.json`.
4.  Test rápido en desktop + móvil.
5.  Build automático (CI/CD) y deploy.
6.  Hub detecta nuevo juego y lo muestra.

## 8) Stack concreto sugerido

-   Front/hub: **Vite + Vanilla/Preact**
-   Estilos: CSS propio (como ya haces), tokens de diseño
-   Estado simple: store mínima
-   Backend opcional: **Supabase**
-   Deploy web: **Cloudflare Pages / Vercel / Netlify**
-   App mobile: **Capacitor**
-   Analytics: Plausible o PostHog

## 9) Organización de repo (monorepo ligero)

-   `/hub` (launcher)
-   `/games/game-01`, `/games/game-02`...
-   `/packages/ui` (componentes compartidos: card, modal, topbar)
-   `/packages/core` (event bus, utilidades input/audio/storage)

## 10) Hoja de ruta en 3 fases

-   **Fase 1:** hub básico + 5 juegos integrados + PWA.
-   **Fase 2:** perfiles, progreso, favoritos, recomendaciones.
-   **Fase 3:** empaquetado iOS/Android + métricas + leaderboard.

----------

## Prompt agéntico para OpenCode

Quiero que actúes como **Lead Product Engineer + Tech PM** y ejecutes conmigo un proyecto real de principio a fin.

## Contexto del proyecto

Estoy construyendo un **hub de microexperiencias/minijuegos superminimalistas**.  
Los juegos son principalmente **HTML + CSS + JavaScript vanilla**, muchos embebidos.  
Quiero un producto único con:

1.  **Versión web** (navegador)
2.  **App Android/iOS** reutilizando al máximo el código web.

El estilo visual es minimalista oscuro, tipografía fuerte, bordes finos, overlays, cards limpias, microanimaciones, estética arcade sobria.

## Objetivo

Diseñar e implementar un **hub launcher** que liste juegos, permita abrirlos rápido, guardar progreso básico y escalar a mobile sin rehacer todo.

## Tu rol y modo de trabajo

Quiero que trabajes en modo **agéntico ejecutor**:

-   Tomas iniciativa.
-   Propones plan por fases.
-   Entregas artefactos listos para usar.
-   Siempre que falte información, haces supuestos explícitos y sigues avanzando.
-   Me pides confirmación solo en decisiones críticas (arquitectura, costos, cambios de alcance).
-   Respondes con formato claro, accionable y orientado a shipping.

## Restricciones y preferencias

-   Priorizar simplicidad y velocidad de entrega.
-   Evitar sobreingeniería.
-   Mantener compatibilidad con minijuegos existentes en vanilla.
-   Stack recomendado: web-first + empaquetado móvil.
-   UX: acceso en 1 toque, cargas rápidas, navegación mínima, “volver al hub” siempre visible.

## Entregables que necesito (en este orden)

1.  **Master Plan** en fases (MVP → v1 → v2) con tiempos estimados.
2.  **Arquitectura técnica** recomendada (frontend, datos, integración juegos, mobile wrapper).
3.  **Estructura de monorepo** (carpetas, responsabilidades, convenciones).
4.  **Contrato estándar de minijuego**:
    -   lifecycle (`start/pause/resume/restart/destroy`)
    -   eventos (`score`, `game_over`, `exit`, etc.)
    -   formato `manifest.json`
5.  **Scaffold inicial de código**:
    -   Hub base
    -   Catálogo de juegos por manifests
    -   Vista de juego embebida
    -   Persistencia local (progreso/último jugado)
6.  **Sistema de diseño mínimo** (tokens, componentes base, reglas de UI).
7.  **Plan mobile** con Capacitor (Android/iOS), incluyendo pasos concretos.
8.  **CI/CD** básico (build, test mínimo, deploy web).
9.  **Checklist QA** funcional + performance + mobile.
10.  **Backlog priorizado** con issues (P0/P1/P2), criterios de aceptación y definición de terminado.

## Forma de entrega obligatoria

Cada respuesta debe incluir estas secciones:

1.  **Qué haré ahora**
2.  **Resultado**
3.  **Código/artefactos**
4.  **Cómo probarlo**
5.  **Siguiente paso**

## Reglas de ejecución

-   Si propones tecnología, justifica trade-offs en 3–5 líneas máximo.
-   Si hay varias opciones, recomiéndame una por defecto.
-   Incluye comandos exactos de terminal cuando aplique.
-   Si generas código, entrégalo en bloques por archivo (`/ruta/archivo.ext`).
-   No te quedes en teoría: entrega implementación incremental.
-   Si detectas riesgos, añade sección **Riesgos y mitigación** breve.
-   Mantén enfoque en “producto que funciona” antes de “producto perfecto”.

## Primer paso que debes ejecutar ahora

Empieza ya con:

1.  Propuesta de stack final (cerrada, no ambigua).
2.  Estructura inicial del monorepo.
3.  `manifest.json` estándar de juego.
4.  Skeleton del hub (home + game view + loader de manifests).
5.  Comandos para correr localmente en menos de 10 minutos.

Si faltan datos, asume defaults razonables y continúa.
