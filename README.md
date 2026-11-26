<div align="center">

# GTA VI Radios — The Sound of Leonida

**An interactive, Spotify-meets-GTA web radio simulator streaming 25 continuous stations with simulated live broadcasting, a circular GTA Dial tuner, and zero-egress HTTP Range audio delivery.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-gta--vi--radios.vercel.app-1DB954?style=for-the-badge&logo=vercel&logoColor=white)](https://gta-vi-radios.vercel.app)
[![Documentation Wiki](https://img.shields.io/badge/Docs-Project%20Wiki-2563EB?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Fernius07/GTA-VI-Radios/wiki)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare R2](https://img.shields.io/badge/Audio-Cloudflare%20R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/r2/)

[Launch Live App](https://gta-vi-radios.vercel.app) · [Explore the Wiki](https://github.com/Fernius07/GTA-VI-Radios/wiki) · [Architecture](https://github.com/Fernius07/GTA-VI-Radios#-architecture--project-structure)

</div>

---

## Overview

**GTA VI Radios** brings the atmosphere of *Grand Theft Auto VI*'s Vice City and Leonida airwaves to the browser. Instead of a static audio playlist, every station behaves like a real, always-on FM broadcast: all **25 stations** advance continuously in real time—even when paused or after closing the browser—and stream **~7.3 GB of high-bitrate MP3 broadcasts** on demand using `HTTP Range` requests (`206 Partial Content`).

Built with **React 19**, **TypeScript**, **Vite 6**, and **Tailwind CSS v4**, the interface seamlessly pairs a sleek **Spotify-inspired dark UI** with an authentic, gesture-ready **GTA Dial Mode**.

---

## Key Features

### Simulated Live Broadcast Engine
- **Randomized First Visit:** On your first visit, a random initial station is selected and each of the 25 stations receives an independent random starting offset so the dial feels alive immediately.
- **Continuous Background Progression (`localStorage`):** Anchored to a persisted `anchorTimestamp` (`gta6_radio_live_session_v1`), every station keeps advancing in real time while you are away—across minutes, hours, or days—looping seamlessly via modulo arithmetic.
- **Away Time Notice & Session Reset:** Returning after 5+ seconds displays how long you were away while the stations kept playing, with an option to reset the radio world at any time.

### 25 Complete Stations & Real-Time Tracklists
- **Rich Station Catalog:** 25 distinct stations spanning pop, 80s classics, rock/metal, hip-hop, jazz, electronic, Latin, blues, country, and talk radio—each with custom artwork, frequency, hosts, genres, slogan, description, and accent theme color.
- **Live "Now Playing" Tracking:** Music stations resolve the active track, artist, elapsed track time, track duration, and upcoming track directly from the live broadcast timestamp (while talk stations gracefully omit track metadata).

### Dual UI Modes: Spotify-Style Library & GTA Dial
- **Spotify-Inspired Workspace:**
  - **Dynamic `HeroBanner`:** Automatically adapts its radial glow and background gradient to the active station's `accentColor`.
  - **Library & Filtering:** Responsive `Sidebar` (slide-over drawer on mobile), `MobileNav` bottom bar, instant substring search across names, hosts, slogans, frequencies, and tags, genre category pills, and a persistent **Favorites** view.
  - **`StationCard` Grid:** Cards with pulsing live badges, quick-toggle favorite stars, and floating play controls.
- **Interactive GTA Dial Mode (`DialView`):**
  - Circular shortest-arc tuning wheel centering the active station with scaled, depth-layered neighbors on each side.
  - Horizontal touch-swipe gesture support (filtering out vertical scrolls), mouse/click selection, and full keyboard/ARIA accessibility.

### Persistent Adaptive Player, FM Static & Hardware Integration
- **Adaptive `PlayerBar`:** Three-column desktop control bar and a floating mobile mini-player featuring `MarqueeText` overflow tickers, an animated CSS equalizer, volume/mute controls, and a randomizer button.
- **Synthesized FM Tuning Static:** Web Audio API noise generator (`playFmTuningBurst`) produces a crisp analog static burst when switching stations (toggleable from the player bar).
- **Lock Screen, Bluetooth & Apple CarPlay Support:** Uses the browser **Media Session API** paired with an offscreen `<canvas>` generator (`getStationLockscreenArtwork`) that composites each station's gradient and logo into an **opaque 512×512 PNG** for reliable display on iOS/Android lock screens and car stereos.
- **Bilingual Experience (`EN` / `ES`):** Full UI and station metadata localization with automatic browser language detection (`navigator.language`) and persistent language switching.

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `→` | Next station |
| `←` | Previous station |
| `R` | Tune random station |
| `M` | Mute / Unmute |

*(Shortcuts automatically ignore focus inside inputs, textareas, and editable elements.)*

---

## Engineering Highlights

- **Zero-Backend Live Time Simulation:** Deterministic client-side time math (`(elapsedSeconds + stationOffset) % duration`) gives 25 synchronized "live" streams without server state or WebSockets.
- **Custom Vite `HTTP Range` Middleware:** A custom Vite plugin (`localAudioPlugin`) serves local `./local-audio/<slug>.mp3` files with path-traversal protection and `206 Partial Content` byte-range streaming for instant seeking across 70–690 MB audio files.
- **Zero-Egress Production Streaming:** Decouples ~7.3 GB of static audio from Git and Vercel by streaming directly from **Cloudflare R2** via `VITE_AUDIO_BASE_URL` with CORS `Range` header support.
- **Cross-Device Media Session Artwork:** Generates 512×512 opaque PNG data URLs dynamically via `<canvas>` to work around `.webp` and alpha-transparency limitations in mobile OS lock screens and Apple CarPlay.
- **Production Hardening & Security Headers:** Strict TypeScript (`strict`, `noUnusedLocals`, `noUnusedParameters`), Tailwind CSS v4, `javascript-obfuscator` + esbuild `console`/`debugger` stripping in production builds, and hardened HTTP headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`) in `vercel.json`.

---

## Architecture & Project Structure

[![Architecture diagram](https://gitdiagram.com/diagram-badge.svg)](https://gitdiagram.com/fernius07/gta-vi-radios?utm_source=readme&utm_medium=badge)
[![Architecture diagram of fernius07/gta-vi-radios](https://gitdiagram.com/fernius07/gta-vi-radios/diagram.png)](https://gitdiagram.com/fernius07/gta-vi-radios?utm_source=readme&utm_medium=picture)

```text
├── public/
│   ├── covers/                 # Station cover artwork (.webp / .jpg)
│   ├── favicon.webp
│   └── gta6-logo.webp
├── src/
│   ├── components/
│   │   ├── DialView.tsx        # Circular GTA-style tuning wheel with swipe gestures
│   │   ├── HeroBanner.tsx      # Accent-colored featured station banner
│   │   ├── MarqueeText.tsx     # ResizeObserver-backed overflowing text ticker
│   │   ├── MobileNav.tsx       # Bottom navigation bar for mobile viewports
│   │   ├── PlayerBar.tsx       # Desktop 3-column bar & mobile mini-player
│   │   ├── Sidebar.tsx         # Desktop sidebar / mobile drawer + station library
│   │   ├── StationArtwork.tsx  # Size-preset cover renderer & active equalizer
│   │   └── StationCard.tsx     # Accessible grid card with live & favorite badges
│   ├── data/
│   │   ├── stations.ts         # 25 station definitions, genres & runtime audio URLs
│   │   ├── stationsEn.ts       # English metadata translations
│   │   └── tracklists.ts       # Timestamped tracklists for music stations
│   ├── hooks/
│   │   └── useRadioPlayer.ts   # Persistent HTMLAudioElement & Media Session controller
│   ├── lib/
│   │   ├── antiInspect.ts      # Production casual-inspection guard
│   │   ├── fmStatic.ts         # Web Audio API FM static burst synthesizer
│   │   ├── i18n.ts             # EN/ES dictionaries & language persistence
│   │   ├── mediaArtwork.ts     # Offscreen 512x512 PNG lock screen artwork generator
│   │   └── radioEngine.ts      # Session persistence, live position math & track lookup
│   ├── App.tsx                 # Root state, filtering, tabs & keyboard shortcuts
│   ├── index.css               # Tailwind v4, equalizer keyframes, slider & dial vars
│   └── main.tsx                # App entry point & Vercel Analytics
├── vite.config.ts              # Local HTTP Range plugin & production build pipeline
└── vercel.json                 # Security headers & SPA rewrites
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.8 |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons |
| **Build Tooling** | Vite 6, `javascript-obfuscator` |
| **Browser APIs** | HTML5 Audio (`HTTP Range`), Web Audio API, Media Session API, Canvas 2D, `localStorage` |
| **Infrastructure** | Vercel (Hosting & Analytics), Cloudflare R2 (Zero-Egress Audio CDN) |

---

## Documentation

Comprehensive technical documentation is available in the **[Project Wiki](https://github.com/Fernius07/GTA-VI-Radios/wiki)**:

- [Getting Started](https://github.com/Fernius07/GTA-VI-Radios/wiki/Getting-Started) — local setup, NPM scripts, and TypeScript config
- [Radio Engine](https://github.com/Fernius07/GTA-VI-Radios/wiki/Radio-Engine) — `localStorage` session lifecycle, live time math, and tracklists
- [useRadioPlayer Controller](https://github.com/Fernius07/GTA-VI-Radios/wiki/useRadioPlayer-Controller) — audio element management, Media Session, and FM static
- [Dial View](https://github.com/Fernius07/GTA-VI-Radios/wiki/Dial-View) — circular geometry, responsive CSS variables, and swipe gestures
- [Build and Deployment](https://github.com/Fernius07/GTA-VI-Radios/wiki/Build-and-Deployment) — Vite `localAudioPlugin`, Cloudflare R2, and Vercel config
- [Glossary](https://github.com/Fernius07/GTA-VI-Radios/wiki/Glossary) — quick reference of domain and codebase terms

---

## Local Development & Deployment

### Run Locally

```bash
git clone https://github.com/Fernius07/GTA-VI-Radios.git
cd GTA-VI-Radios
npm install
npm run dev
```

Place `.mp3` broadcast files inside `local-audio/<slug>.mp3` (for example, `local-audio/flash-fm.mp3`). Vite's `localAudioPlugin` automatically serves `/audio/*` with `HTTP Range` support so seeking is instantaneous while keeping `local-audio/` gitignored and excluded from `dist/`.

### Production Deployment (Cloudflare R2 + Vercel)

Because the 25 `.mp3` broadcasts range from **71 MB to 690 MB each (~7.3 GB total)**, they exceed GitHub's 100 MB file limit and static bundle limits.

1. **Host Audio on Cloudflare R2:**
   - Create a public R2 bucket (e.g. `gta6-radio-audio`) and enable its **Public Development URL** (or custom domain).
   - Upload all 25 `.mp3` files to the bucket root keeping their exact slug filenames (`flash-fm.mp3`, `v-rock.mp3`, etc.).
   - Add the following CORS policy under **Settings → CORS Policy**:
     ```json
     [
       {
         "AllowedOrigins": ["*"],
         "AllowedMethods": ["GET", "HEAD"],
         "AllowedHeaders": ["Range"]
       }
     ]
     ```
2. **Deploy to Vercel:**
   - Import the repository in [Vercel](https://vercel.com/).
   - Set the environment variable `VITE_AUDIO_BASE_URL` to your public R2 URL (without a trailing `/`, e.g. `https://pub-xxxxxxxxxxxxxxxx.r2.dev`).
   - Deploy.
