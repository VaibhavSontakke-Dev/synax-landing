# Home hero dashboard (source)

The dashboard behind the home-page hero (`app/erp/_components/home-hero.tsx`) is an illustration, not a portal screenshot.
`dashboard.html` draws it at 1748 × 1045 in the site's theme colours: navy brand, orange accent, slate and white in
light; deep navy surfaces, milky text, steel blue and orange-300 in dark (`#light` / `#dark`).

- **Sharp:** what the six product cards point at stays crisp. That is the **Projects** and **Staffing** menus and the
  **Overview** (AI & BI), **Planning & Production** (Shop Floor), **Purchase & SCM** (Manufacturing ERP) and **People**
  (HRMS) cards.
- **Frosted:** every other menu, KPI tile and card. Their words are soft, unreadable smudges (transparent text with a
  blurred shadow), and the cards are slightly blurred and faded. Sparklines, bars, a donut and a throughput chart keep
  their shape, so the frosted areas still read as a dashboard.
- **Animated in the hero:** a soft band of light sweeps across each frosted card in turn, and the KPI tiles and the
  machine-status card carry pulsing live dots (`.synax-hero-sweep` and `.synax-hero-live` in `app/globals.css`;
  the boxes come from `regions.json` as `HAZE`).
- **The airplane** is not in the image. The hero draws it as its own SVG layer over the banner and animates it with CSS
  (`.synax-hero-plane` in `app/globals.css`, off for `prefers-reduced-motion`).

`render.js` (Playwright + ffmpeg-static) writes these files to `public/images/`:

- `hero-dashboard-v3.webp`: the image shown, 1748 × 1045.
- `hero-dashboard-v3-master.webp`: the same design at 2× (3496 × 2090), which the zoom lens crops from.
- `hero-dashboard-v3-dark.webp` and `hero-dashboard-v3-dark-master.webp`: the same two in the dark theme.

It also writes `regions.json`: the exact boxes of the sharp elements as fractions (the hero's `region`), a lens `crop`
for each (menu rows get some sidebar around them), and the `banner` box where the airplane flies.

Rebuild: in a folder with `playwright`, `ffmpeg-static` and `@fontsource/inter`, run `node icons.mjs` (from the repo,
for the Lucide icons), then `node render.js`, then copy the numbers from `regions.json` into `HERO_PRODUCTS` and
`BANNER` in `home-hero.tsx`. Use new file names if the images change, because `/images` is cached.

## The USP "AI" row variant

The first row of "What sets Synax apart" (`home-usp.tsx`) uses the same design with **only the Overview card sharp** (where
Synax AI lives). It has the orange ring on the Synax AI chip, a zoom lens on the Overview card, and the same light sweeps,
live dots and airplane through the shared `DashboardMotion` (`app/erp/_components/dashboard-motion.tsx`, which the
hero uses too).

`node render.js usp-ai-dashboard overview regions-usp-ai.json` writes `usp-ai-dashboard.webp`, `-master`, `-dark` and
`-dark-master`, and the boxes `overview`, `synaxai`, `banner` and `haze`. The ring, lens crop and position in
`home-usp.tsx` are computed from them.

## The USP machine row variant

The second row ("Live machine monitoring") uses `machines.html`: the same frame, sidebar and theme with a machine
board instead of the module grid.

- **Sharp:** the Manufacturing menu, with Machine board selected; the navy header ("Machine board", Live and FOCAS · OEM
  pills); and the **Live machine board**. The board shows six drawn machines (VMC, lathe, HMC), each with a stack light,
  status, cycle count, progress bar and job. M-03 has a tool-life alarm and M-05 is idle.
- **Frosted:** the other menus, the KPI strip, the OEE, line-events and operators cards, and the downtime timeline.
- **Animated in the row:** light sweeps and live dots through `DashboardMotion`, with no airplane (the `banner` prop is
  optional), plus a pulsing orange ring on M-03.

`node render.js usp-machines-v4 "" regions-usp-machines.json machines.html` writes `usp-machines-v4.webp`, `-master`,
`-dark` and `-dark-master`, and the boxes `menu`, `live`, `board`, `alarm` and `haze`. `MACHINES_HAZE` and
`MACHINES_ALARM` in `home-usp.tsx` are copied from it; the sidebar's small menu rows are left out of the sweeps.
