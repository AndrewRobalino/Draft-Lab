# Draft Lab — Brawl Stars Draft Assistant

## Project Overview
Competitive Brawl Stars draft recommendation tool. Built by Andrew and Carter (both competitive players). All data sourced from pro play (BSC monthly finals), NOT ladder/Masters stats.

## Tech Stack
- React 18 + Vite 5
- Pure CSS (dark theme, gold accent #d4af37)
- No backend — all data in static JS files
- Fonts: Orbitron, Rajdhani

## Architecture
```
src/
  components/    # DraftSimulator, BestCompPage, HomePage, AboutPage
  data/          # recommendationEngine.js (642 lines), brawlers.js, maps.js, drafts.js, bestComps.js
  utils/         # normalizers.js, assets.js
public/assets/   # brawler webp icons, map png thumbnails
```

## Core Engine (recommendationEngine.js)
Multi-factor scoring: mapScore * 1.95 + modeScore * 0.7 + globalScore * 0.2
6 adjustment layers: role, counter, threat, draft need, synergy, pick-specific
Hardcoded brawler sets: antiTankIds, diveIds, strongThrowerIds, longRangeIds, midControlIds, heavyDamageIds, wallBreakIds

## Current Status: Meta Overhaul In Progress

### What Needs Updating
1. **Brawler roster** — Missing ~10+ brawlers (Glowbert, Sirius, Najia, Finx, Lumi, Kaze, Jay-Yong, Alli, Trunk, Ollie, Ziggy, Pierce)
2. **Buffies system** — Two waves of buffies (Dec 2025, Feb 2026) changed brawler viability drastically. Engine has zero awareness of buffies
3. **Hardcoded brawler sets** — antiTankIds, diveIds, etc. are stale. Need full reclassification based on current meta
4. **Draft data** — Currently 88 drafts from World Finals 2025. Needs new monthly finals data from all regions (Feb/Mar 2026)
5. **Map pool** — Some maps rotated out, new ones in (Double Swoosh, Out in the Open)
6. **Best comps** — All 18 map compositions are outdated
7. **Global ban system** — BSC 2026 March+ uses blind global match bans (2 per team, locked for entire match). Draft simulator doesn't model this
8. **Engine optimization** — Scoring weights are magic numbers, role/counter/threat logic needs rework for accuracy

### Waiting On
- Andrew and Carter finishing data collection from all regional monthly finals
- Final meta reads and buffy impact assessments from their analysis
- DO NOT make changes until they provide the final data

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run preview` — preview build

## Workflow
- Don't commit unless Andrew says to
- Don't add Docker, SQL, or backend unless there's a clear need (there isn't right now)
- Data updates come from Andrew and Carter watching pro play, not from APIs or scraping
