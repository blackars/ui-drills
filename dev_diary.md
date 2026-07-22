# Dev Diary — Playable Interface Lab

## Project Identity

- **Name**: Playable Interface Lab
- **Repo**: `blackars/ui-drills` → `blackars/PlayableInterfacesLaboratory`
- **URL**: `blackars.github.io/PlayableInterfacesLaboratory/`
- **Stack**: Vanilla HTML + CSS + JavaScript (zero frameworks)
- **Aesthetic**: Dark monochrome, minimal borders, clean typography, arcade-sober

---

## Repository Analysis (Initial State)

### Files Found

| Category | Count | Files |
|----------|-------|-------|
| Hub launcher | 1 | `hub.html` |
| Standalone HTML | 15 | Root-level `.html` files |
| Folder experiences | 5 | CSS Clip-path, Zoom Scroll, Parallax, Scrollytelling, Sticky Geometry |
| Minigames | 5 | darkinvaders, technovisualizer, wavehunter, darkpong/, subatomiccollider/ |
| CV (external) | 1 | `maincv.html` (removed — separate project) |
| Documentation | 2 | `about_project.pdf` (corrupt), `Tabla_1_y_2.pdf`, `Minigames Hub Agentic Prompt.md` |

### Tabla_1_y_2.pdf Content (Extracted)

**Tabla 1** — Registry of 21 experiences:

| ID | Experience | Type |
|----|-----------|------|
| EXP-01 | Hub principal (hub.html) | Navigation/UI shell |
| EXP-02 | CV/Perfil (maincv.html) | Landing/portfolio |
| EXP-03 | ASCII Art Effect | Image transform |
| EXP-04 | Spiral 1 | Generative art |
| EXP-05 | Spiral 2 | Generative art |
| EXP-06 | True Circle Typography | Typography motion |
| EXP-07 | ASCII Glitch Mirror | Image transform/FX |
| EXP-08 | Dark Snake | Game |
| EXP-09 | Gravity Dots | Physics toy |
| EXP-10 | Magnetic Cursor Field | Interactive field |
| EXP-11 | MirrorSplit | Visual FX |
| EXP-12 | Monolith Defense | Game |
| EXP-13 | OrbitLock | Puzzle/physics |
| EXP-14 | PacmanDarks | Game |
| EXP-15 | PrismRunner | Game |
| EXP-16 | ScrollTunnel | Scroll experiment |
| EXP-17 | Tri-Line | Generative art |
| EXP-18 | TypographyBoss | Typography/UI |
| EXP-19 | Clip-path Effect | CSS visual |
| EXP-20 | Sticky Geometry Scroll | Scrollytelling |
| EXP-21 | Parallax Gradient / Scrollytelling | Scrollytelling |

**Tabla 2** — 12-Phase Roadmap:
1. Standardize metadata (experiences.json)
2. Register 21 experiences with real routes
3. Global search (Fuse.js)
4. Filter by type (chips)
5. Tags per experience (badges on cards)
6. Placeholder media (webm/image fallback)
7. i18n ES/EN
8. Performance (lazy-load, prefetch)
9. Functional QA checklist
10. Observability (error logs, usage events)
11. Systemic design (tokens, typography, spacing)
12. Documentation (CONTRIBUTING + DESIGN_GUIDELINES)

### Minigames Hub Agentic Prompt.md (Salvaged Ideas)

- **Hub as launcher** with strong visual identity ✓ (already implemented)
- **Monorepo with manifests** → Future phase, not for MVP
- **Game lifecycle contract** (`start/pause/resume/restart/destroy`) → Future phase
- **postMessage API** for hub↔game communication → Future phase
- **localStorage → Supabase** data strategy → Future phase
- **PWA + Capacitor** mobile → Future phase
- **Weekly pipeline** with template cloning → Future workflow

**Not applicable for GitHub Pages MVP:**
- Vite/Preact build system
- Backend/database
- Capacitor mobile wrapper
- CI/CD pipelines beyond git push

---

## Tag System

Each module gets tags displayed as small badges inside its card.

### Categories

| Tag | Label | Description |
|-----|-------|-------------|
| `game` | Game | Playable minigames with score/loop/mechanics |
| `experience` | Experience | Interactive visual prototypes and demos |
| `element` | Element | Reusable web components/pieces for projects |
| `test` | Test | Quick experiments, proof of concepts |

### Tag Assignment (All 21 Modules)

| Module | Tags |
|--------|------|
| ASCII Art Effect | `experience` |
| ASCII Glitch Mirror | `experience`, `element` |
| Circle Typography | `experience` |
| Spiral 1 | `experience` |
| Spiral 2 | `experience` |
| Magnetic Cursor | `experience`, `element` |
| Scroll Tunnel | `experience` |
| Tri-Line | `experience` |
| Typography Boss | `experience` |
| Clip-path Effect | `element`, `test` |
| Zoom Scroll | `element` |
| Parallax Gradient | `element` |
| Scrollytelling | `element` |
| Sticky Geometry | `element` |
| Dark Snake | `game` |
| Gravity Dots | `game` |
| Mirror Split | `game`, `test` |
| Monolith Defense | `game` |
| Orbit Lock | `game` |
| Pacman Darks | `game` |
| Prism Runner | `game` |
| Dark Pong | `game` |
| Subatomic Collider | `game`, `experience` |
| Void Organism (Dark Invaders) | `game` |
| Techno Visualizer | `experience`, `game` |
| Wave Hunter | `game` |

---

## Implementation Plan

### Phase 0: Cleanup
- [x] Delete `maincv.html` (separate project)
- [x] Delete `about_project.pdf` (corrupt, unreadable)
- [x] Create `.gitignore`
- [x] Create `dev_diary.md`

### Phase 1: Restructure Directories
- [x] Create `games/` and `experiences/` directories
- [x] Move and rename all files with URL-safe names
- [x] Move MINIJUEGOS contents into `games/`

### Phase 2: Hub Overhaul
- [x] Rename `hub.html` → `index.html`
- [x] Add all 21+ modules to GAMES array
- [x] Implement tag system (badges on cards)
- [x] Update all routes to new paths

### Phase 3: Technical Fixes
- [x] Fix missing DOCTYPE in spiral1, spiral2, truecircletypography
- [x] Fix ASCII Art placeholder URL (use generative canvas)
- [x] Clean CODVERTER.COM references
- [x] Verify all files load correctly

### Phase 4: README + Deploy
- [x] Create public README.md
- [x] Force push to GitHub
- [x] Activate GitHub Pages
- [x] Verify deployment

### Phase 5: Polish — Audio Engine + Favicon + Animations
- [x] Generated `favicon.ico` (16x16 + 32x32 icosahedron)
- [x] Generated `favicon.svg` (icosahedron wireframe)
- [x] Generated `ambient-loop.mp3` (8s sci-fi drone, 96KB)
- [x] Added favicon `<link>` tags to hub `<head>`
- [x] Added `@keyframes fadeSlideUp` description animation + hover glow
- [x] Added AudioEngine class (Web Audio API)
  - Hover click: oscillator sweep 880→1320 Hz
  - Click: noise burst + sine 220→660 Hz
  - Filter click: triangle 440→660 Hz
  - Open module: sine sweep 330→1760 Hz
- [x] Added ambient music player (`ambient-loop.mp3`, `loop=true`, vol 0.12)
- [x] First-interaction unlock (click/touch/keydown triggers AudioContext + ambient)
- [x] Mute/volume toggle button in topbar (localStorage persistence)
- [x] Sound effects on card hover, card click, filter click

---

## Post-MVP Roadmap (Future Phases)

1. **Search + Filter** (Fuse.js, chip filters)
2. **Placeholder previews** (generative canvas thumbnails)
3. **i18n** (ES/EN selector)
4. **Performance** (lazy-load iframes, prefetch)
5. **Systemic design tokens**
6. **manifest.json per experience**
7. **Game lifecycle API** (postMessage)
8. **PWA + Capacitor** mobile
9. **Backend** (Supabase: auth, progress, favorites)
10. **Leaderboard + achievements**

---

## Changelog

### 2026-07-22 — Audio Engine + Favicon + Animations
- Generated icosahedron favicon (`.ico` + `.svg`)
- Generated ambient sci-fi drone loop (`ambient-loop.mp3`, 8s, 96KB)
- Added favicon links to hub `<head>`
- Added `@keyframes fadeSlideUp` description animation + hover text-shadow glow
- Built `AudioEngine` class (Web Audio API oscillators + ambient music)
- Sound effects: hover click, open module sweep, filter click, noise burst on card click
- Ambient music starts on first user interaction (browser autoplay policy)
- Mute/volume button in topbar with `localStorage` persistence
- Updated `dev_diary.md` with Phase 5 completion

### 2026-07-21 — Initial Restructure
- Analyzed full repository (21+ experiences, hub, docs)
- Extracted Tabla_1_y_2.pdf content (21 experiences + 12 phases)
- Salvaged useful concepts from agentic prompt
- Designed tag system: game / experience / element / test
- Restructured entire directory tree
- Updated hub with all modules + tag badges
- Fixed technical issues (DOCTYPE, URLs, references)
- Configured for GitHub Pages deployment
