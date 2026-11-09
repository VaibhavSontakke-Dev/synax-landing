# Synax Landing

Marketing site for Synax by Senwell Group (Next.js App Router, Tailwind v4).
Routes: `/` and `/erp` render the landing page in
[`app/erp/_components/landingpage.tsx`](app/erp/_components/landingpage.tsx).

```bash
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Configuration

| Env var | Purpose |
|---|---|
| `DEMO_REQUEST_WEBHOOK_URL` | Where demo-form leads are POSTed as JSON (CRM / Zapier / Slack / Power Automate). If unset, the form shows an error and no lead is delivered. |

## Changelog

Rule: **every commit updates this section** (newest first) so any change can be traced
and rolled back. Entries are identified by the commit subject — find the commit with
`git log --grep "<subject>"`. Roll back one with `git revert <hash>`.

### Pending (next commit) — Landing audit fixes
Commit subject: `Landing audit fixes: lead intake, a11y, honest proof, hero perf`
- **Demo form now delivers leads**: new route `app/api/demo-request/route.ts` (validation,
  honeypot, forwards to `DEMO_REQUEST_WEBHOOK_URL`). Success copy changed from
  "Consultation Scheduled" to "Request Received"; shows an error when delivery fails.
- **Proof/claims**: testimonials hidden via `SHOW_TESTIMONIALS = false`
  (flip to `true` once real, permissioned quotes replace the placeholders);
  "Trusted By Industry Leaders" → "Running on Synax / Senwell Group & Ecosystem Companies";
  certification wording softened to "supports / aligned" (banner, hero badge, footer).
- **Accessibility**: hero headline `h4` → `h1`; logos are buttons; form labels linked to
  inputs; demo modal has dialog roles, Escape and backdrop close; menu button `aria-expanded`;
  dropdown opens on keyboard focus; larger small-text and better footer contrast.
- **Conversion/perf**: secondary hero CTA ("Explore the 4 Suites"); sticky mobile
  "Schedule a Demo" bar; hero image `home.png` (426KB) → `public/images/home.webp` (51KB)
  with width/height; logo served from `/images/synax_logo.png`; footer Privacy/Terms link to
  the live site pages.
- **Metadata**: Open Graph tags added in `app/layout.tsx`.
- Files: `app/erp/_components/landingpage.tsx`, `app/layout.tsx`,
  `app/api/demo-request/route.ts` (new), `public/images/home.webp` (new), `README.md`.
- Rollback: `git revert` the commit; `home.png` is untouched, so reverting restores the old hero.

### Pending (next commit) — Hero v5: image-first spotlight hero
Commit subject: `Hero v5: dashboard first and largest, product pills beneath, smaller text, no eyebrow tag`
- Rewrites `app/erp/_components/home-hero.tsx` (same `<Hero …/>` props). Supersedes every earlier hero entry — none of
  those versions were committed.
- **Order flipped**: the dashboard stage comes first and is the focus; the intro (headline, product name, paragraph,
  CTAs, tick lines) comes underneath. The intro stays **first in the DOM** (reading order / SEO) and is moved below with
  `order-2` / `order-1`; on phones the image is also first.
- **Paragraph removed** ("Streamline operations, empower your workforce…"); the freed space went to a roomier intro, a larger
  dashboard (stage max width `calc(47vh*2.1 + 2*var(--g) + 3rem)` (was 53vh, trimmed back a little)) and a larger tagline (`text-[2rem]` / `sm:text-5xl` /
  `lg:clamp(2rem,5vh,3rem)`, `font-black`) with a hand-drawn orange underline under "Every Operation" (inline SVG, `aria-hidden`).
- **Card heights fit their content**: on lg+ each card is `self-center` in its grid row instead of stretching to a third of
  the dashboard height (the connector still aims at the card centre).
- **Narrower dashboard (−20%, same height, nothing cropped)**: stage max width factor `47vh` → `37.6vh`; the page now uses
  a new image `public/images/hero-dashboard-fit.webp` (1534×917 = the original squeezed to 80% width with sharp, `fit:
  'fill'`), shown at `aspect-[1534/917]`, `FRAME_RATIO = NATIVE_RATIO` (no crop). Text/icons are ~20% narrower. Side cards
  unchanged. To undo: `47vh`, src `hero-dashboard-light.webp` 1918×917, `aspect-[1918/917]`.
- **Dashboard shape**: a 19:10 crop (taller) cut the sidebar and "My Work" edges and looked broken, so the screenshot is
  back to its full native ratio (`aspect-[1918/917]`, nothing cropped). `FRAME_RATIO` in `home-hero.tsx` is the one knob:
  a smaller number is taller but crops the sides; `mapX()` keeps the spotlight/connector aligned either way.
- **Compact side cards**: product cards use `p-2`, `gap-2`, `rounded-lg`, a `size-7` icon tile and an 11.5px label; the side
  columns are `9.5rem` (lg) / `11.5rem` (xl) wide with `gap-y-2`, which gives the dashboard more room.
- **Eyebrow tag removed** ("Unified Business Suite Founded & Developed by Senwell Group").
- **Smaller text, headline slightly larger and bolder**: H1 `text-[1.75rem]` / `sm:text-4xl` / `lg:clamp(1.75rem,4vh,2.5rem)`
  in `font-black` on one line; the gradient product name under it is set at `0.78em` of the headline so the longest name
  ("Shop Floor & Machine Monitoring") stays on one line and reads as the secondary line, paragraph `text-xs` / `sm:text-sm`, buttons `0.8125rem`, ticks 11.5px.
- **Stage**: the real dashboard (`hero-dashboard-light.webp`, `next/image` `priority`) in a white glass frame on two tinted
  "platform" plates with the six product cards **on the sides** (3 + 3 from lg; a 2 / 3-column grid under the image on
  smaller screens). A row of pills *under* the image was tried and dropped — it pushed the CTAs out of the first viewport.
  The stage's max width is `calc(46vh*2.1 + 2*var(--g) + 3rem)` on lg+, so the stage and the CTAs below it fit the first
  screen; card descriptions show at xl+.
- **Behaviour**: one product active at a time — card highlighted, an orange outline glides to its module on the screenshot,
  and from lg a dashed line is drawn from the card to that module (measured from the DOM with a `ResizeObserver`); the
  headline's gradient name follows. Auto-steps every 2.8s until hover / focus / tap; never for reduced motion. Cards are
  buttons with `aria-pressed`.
- **Module mapping** is the `region` field per product in `HERO_PRODUCTS` (fractions of the screenshot): IT → Projects card,
  HRMS → People & HR, Staffing → Staffing sidebar row, AI → My Work, Manufacturing → Assets, Shop Floor → More pages —
  illustrative; confirm the real mapping and re-measure if the screenshot changes.
- CSS: uses `synax-hero-visual` and `synax-hero-fade` from `app/globals.css` (unchanged). Unused assets in
  `public/images`: `hero-factory.webp`, `home.webp`.
- Files: `home-hero.tsx`, `README.md`. Rollback: `git revert` (earlier hero versions were never committed).

### Pending (next commit) — Market-Ready Platforms redesign (`home-products.tsx`)
Commit subject: `Products: menu-coloured icons, navy Explore / orange-outline Demo buttons, quick picks`
- New component `app/erp/_components/home-products.tsx`, rendered as `<Products setCurrentPage=…
  scrollToSection=… openModal=… />` in place of the inline `<section id="products">` (same id,
  same carousel container id `product-cards`, same Explore/Demo behaviour per product).
- Icon/accent colours now match the Products menu: Manufacturing ERP + Shop Floor green, IT Services
  + HRMS navy, Staffing + AI orange — used for the icon tile, a 3px card top bar, the tag and the
  check marks. **Buttons**: Explore = solid navy (`bg-blue-900`), Demo = 2px orange outline (the
  hero's two styles); previously each card had its own coloured buttons.
- New: quick-pick chips (jump to a product, active one outlined) and a "n of 6" counter; carousel
  (progress bar, prev/next, arrow keys, snap) kept, with `aria-roledescription="slide"` per card and
  reduced-motion-aware scrolling.
- The carousel state/handlers moved out of `HomeView` (they re-rendered the whole home page on every
  scroll tick). Copy is the original; small tweaks: the focus box is slightly lighter/neutral and
  the hero stat strings are unchanged (`< 60 Sec` for HRMS comes from the old data — verify it).
- Files: new `home-products.tsx`; `landingpage.tsx` (section replaced, carousel state removed,
  unused `useRef`/`ChevronRight` imports removed); `README.md`. Rollback: `git revert` (pre-change copy
  in the system temp folder as `landingpage.before-products.tsx`).

### Pending (next commit) — One section tag everywhere (`section-tag.tsx`)
Commit subject: `Consistency: single SectionTag component for every section kicker`
- Section kickers had drifted into four styles (blue-on-grey pills of three sizes, a plain blue label, a
  white dotted pill in the hero, the orange rule-flanked tag). New `app/erp/_components/section-tag.tsx`
  is now the only definition: `text-xs font-bold tracking-widest uppercase`, orange (`orange-600`) with
  short rules — `lines="both"` for centred headings, `lines="start"` for left-aligned headings/cards,
  `tone="dark"` (`orange-300`) on dark surfaces.
- Applied to: hero ("Unified Business Suite…"), Market-Ready Platforms, Sector & Challenge Alignment, Market
  Benchmark, The Ecosystem Purpose (+ its closing banner kicker), Rollout blueprint (the `eyebrow` prop of
  `SectionHeading` is no longer used there), Synax AI ("Always On", dark), Live Platform Preview, Operational
  Proof (hidden), Running on Synax, Zero-Trust Architecture, Manufacturing Pedigree, Senwell Group Enterprise
  Software, the footer call-to-action ("Get started", dark) and the demo-modal tag.
- Not changed on purpose: in-card labels and badges (e.g. "Live Telemetry • CNC Machine IoT Feed", card tags,
  menu group labels, footer column headings) — they are not section kickers.
- The hero tag lost its small dot and the Synax AI tag lost its pulsing dot (all tags now look identical).
- Files: new `section-tag.tsx`; `landingpage.tsx`, `home-hero.tsx`, `home-products.tsx`, `home-sectors.tsx`,
  `home-comparison.tsx`, `home-purpose.tsx`, `home-footer.tsx`, `rollout.tsx`, `README.md`. Rollback:
  `git revert` (pre-change copies of the eight edited files are in the system temp folder under `before-tags`).

### Pending (next commit) — Market Benchmark comparison redesign v2 — bento (`home-comparison.tsx`)
Commit subject: `Comparison: timeline bars, Synax-first dimension cards, navy CTA card`
- New component `app/erp/_components/home-comparison.tsx`, rendered as
  `<Comparison onBookDemo=… onSeeProducts=… />` in place of the inline `<section id="comparison">` (same id,
  so the header "Why Synax" link still works). This replaces an interim table version that was never committed.
- **Old section**: a flat 4-column table that scrolled sideways on phones, green ✓ glyphs (off palette), no
  emphasis on Synax, no call to action.
- **New (bento)**: an **Implementation Timeline** card draws the claim as three bars (Synax 4 to 8 weeks, Legacy
  ERPs 12 to 18 months, point tools "endless patchworks" with a dashed bar and arrow) that grow in when
  scrolled into view (`IntersectionObserver`, no animation under reduced motion); then one card per other
  dimension (CNC telemetry, AS9102 FAIR builder, biometric & shift passes, IT staffing VMS & bench, ITAR/EAR
  vault) with the **Synax advantage first** in a navy-outlined box with an orange check and the two alternatives
  beneath (`dl`); the sixth grid slot is a navy call-to-action card with **Book Demo** (opens the demo form) and
  **Explore the products** (orange outline, scrolls to `#products`). Single column on phones, 2 / 3 columns up.
  Eyebrow, heading, paragraph and every row/column text are the original; the Implementation Timeline row moved
  into the bars card.
- Footnote added by us ("Comparison reflects typical deployments and Synax's own assessment; results vary with
  scope and data readiness") and "Illustrative scale" on the bars — confirm or edit.
- **Flagged, not changed**: the competitor claims and named vendors (SAP/Oracle; e.g. "12 to 18 Months of
  consulting", "Severe compliance breach risk") are the original text — get them reviewed (legal /
  substantiation) before launch and drop the bars if the figures can't be backed; keep "4 to 8 Weeks"
  consistent with the Rollout section; the intro still says "manufacturing software".
- Files: `home-comparison.tsx` (new), `landingpage.tsx` (section replaced), `README.md`. Rollback: `git revert`
  (pre-change copy in the system temp folder as `landingpage.before-comparison.tsx`).

### Pending (next commit) — Sector & Challenge Alignment redesign (`home-sectors.tsx`)
Commit subject: `Sectors: grouped sector list with one challenge-to-solution panel`
- New component `app/erp/_components/home-sectors.tsx`, rendered as `<Sectors setCurrentPage=… openModal=… />`
  in place of the inline `<section id="solutions">` (same id and header copy; same Explore/Demo
  destinations per sector, same default selection = Precision Manufacturing).
- **Analysis of the old section**: four tall stacked cards (~2,500px) behind filter pills that hid cards and
  made the page jump; mixed grouping (industries vs business functions under "All Industries"); the same
  dense 12px layout four times; red-pink challenge boxes, four accent colours and buttons outside the new
  button system; filter pills without `aria-pressed`; the filter state lived in `HomeView` (re-rendering the
  whole page on every click).
- **New**: a master-detail layout — a sector list grouped **By industry** (Precision Manufacturing,
  Aerospace & Defence) / **By business need** (Human Resource Management, IT Staffing & Workforce
  Management) with the menu-coloured icons (horizontal scroller below lg), and one detail panel: tag,
  "Powered by", title, description, **The Business Challenge → How Synax Solves It** (neutral card with an
  orange alert vs a navy-outlined card), the four key capabilities, **Book Demo** (solid navy) and
  **Explore this solution** (2px orange outline), plus a "Your sector is not listed? Talk to us" link.
- Accessibility: proper `tablist`/`tab`/`tabpanel`, roving tabindex, arrow/Home/End keys; selected sector
  state moved into the component (the filter state was removed from `HomeView`).
- **Copy**: all original text kept (descriptions, challenge, solution, the four capability lines). **Removed**
  the numeric "Measurable ROI" chips ("10x Faster FAIR Release", "99.9% Punch Accuracy", "+28% Bench
  Profitability", "100% SOW Billing Accuracy", "3.8 Days", …) because they cannot be substantiated — re-add
  as a results strip only with real data. Industry-specific wording (AS9100, ITAR, NADCAP, CNC) is unchanged.
- Files: new `home-sectors.tsx`; `landingpage.tsx` (section replaced, `solutionFilter` state and the unused
  `AlertCircle` import removed); `README.md`. Rollback: `git revert` (pre-change copy in the system temp
  folder as `landingpage.before-sectors.tsx`).

### Pending (next commit) — Products buttons flipped
- In the Market-Ready Platforms cards (`home-products.tsx`) the button styles were flipped:
  **Demo** is now the solid navy button (`bg-blue-900`, white text) and **Explore** is the 2px orange
  outline. Sizes/order are unchanged (Explore stays the wide one). This supersedes the button colours in
  the "Market-Ready Platforms redesign" entry below.

### Pending (next commit) — Synax AI section: softer chat colours
Commit subject: `Synax AI: soften chat colours, replace off-palette purple CTA`
- In the "Your Enterprise, Answered Instantly" section (`landingpage.tsx`, `#synax-ai`) the solid
  orange chat colours were too bold. Now: user bubbles `bg-orange-400/15` + `border-orange-300/25`
  with `text-orange-50` (was solid `bg-orange-700`); the four AI avatars (header + three in the
  thread) are tinted tiles with an `orange-300` icon instead of the bright orange→amber gradient;
  the send button is a tinted `orange-400/15` button with an `aria-label`.
- The "See Synax AI in Your Demo" button was still `bg-purple-600` (missed by the earlier palette
  change); it is now a light button (`bg-white text-blue-900`, `hover:bg-orange-50`).
- Copy unchanged. Files: `landingpage.tsx`, `README.md`. Rollback: `git revert`.

### Pending (next commit) — Ecosystem Purpose redesign (`home-purpose.tsx`)
Commit subject: `Purpose: chequerboard pillars with central hub, read-more toggle, lighter closing banner`
- Implements the approved mock-up as a new component, `app/erp/_components/home-purpose.tsx`,
  rendered as `<Purpose onExplore={() => openModal("Architecture Consultation")} />` in place of the
  inline `<section id="purpose">` in `landingpage.tsx` (same id, same CTA behaviour).
- Layout: 2×2 chequerboard of the four pillars (navy / light / light / navy) with a central orange
  "One continuum" hub (md+); icon, large faint number, tag, title, one-line summary, description,
  two feature chips per tile. Header gains a "Fragmented spreadsheets → One cohesive continuum"
  pair; the dark slab banner became a light strip with a single navy button. Navy + orange only
  (the green/blue accents are gone).
- **Copy is the original, unmodified** (the "1.–4." prefixes were dropped from titles because the
  big numbers replace them). Each long pillar paragraph is clamped to 3 lines with a **Read more /
  Show less** toggle (`aria-expanded`), so nothing is lost.
- Still industry-specific wording inside the pillars (AS9100, ITAR, CNC, ingot receipt…) — kept
  verbatim; reword in the `PILLARS` array if the section should be industry-neutral like the hero.
- Files: new `home-purpose.tsx`; `landingpage.tsx` (section replaced, unused `Cpu`/`TrendingUp`
  imports removed); `README.md`. Rollback: `git revert` (a pre-change copy was kept in the system
  temp folder as `landingpage.before-purpose.tsx`).

### Pending (next commit) — Rollout blueprint redesign (`rollout.tsx`)
Commit subject: `Rollout: connected timeline, go-live emphasis, checklist and owner tiles`
- Implements the approved mock-up. **Copy and data are unchanged** (`ROLLOUT`, `ROLLOUT_CHECKLIST`,
  `ROLLOUT_ROLES` in `_data/content.ts`); only presentation changed.
- Timeline (lg+): one connected track through four numbered nodes — solid navy to the pilot, dashed
  orange afterwards with an arrow for the open-ended phase. Below lg the cards stack, node beside
  each. Week 3 pilot is the go-live milestone (orange outline + "Week 3 · Go-live" tag); Week 4+ is
  dashed/"Ongoing". One icon per phase (`PHASE_ICONS`).
- Pacing note + CTA in one strip. The CTA is now a real button wired to the demo form via a new
  optional `onTalk` prop (`<Rollout onTalk={() => openModal()} />` in `landingpage.tsx`); without
  the prop it falls back to the old `#demo` link (the old link had no target on this page).
- "Before onboarding" is a checklist with check icons and a step count; "Rollout ownership" is four
  icon tiles (`ROLE_ICONS`). Navy (`erp-brand`) + orange only, same as the rest of the site.
- Files: `app/erp/_components/rollout.tsx` (rewritten), `landingpage.tsx` (one-line prop),
  `README.md`. Rollback: `git revert`.

### Pending (next commit) — New footer (`home-footer.tsx`)
Commit subject: `Footer: new component with CTA card, six-product nav, compliance chips, legal bar`
- Old footer (inline in `landingpage.tsx`): flat 5-column text lists, copy still describing "CNC
  manufacturing, aerospace & defense… IT staffing VMS", an "Enterprise Suites (4)" list that no
  longer matched the six products, compliance items that were plain text, no CTA, no back-to-top,
  `text-xs` throughout, unlabelled link groups.
- New `app/erp/_components/home-footer.tsx`, rendered as `<Footer …/>`:
  1. closing CTA card (navy gradient): "See all six Synax products working together" with
     **Schedule a Demo** (opens the demo form) and **Watch overview** (tour modal);
  2. 12-column link grid: brand (logo on a white tile for contrast, neutral description, web + HQ),
     **Products** (the six products with the same icon tiles/destinations as the header menu),
     **Platform** (Solutions, Why Synax, Synax AI, Security & Trust), **Senwell Group**
     (About, Senwell Exports, Stacwell, Stacem, Contact Sales);
  3. "Compliance alignment" chips (same supportive wording as before);
  4. legal bar: © (current year), Privacy, Terms, Security, **Back to top**.
- Accessibility: each link group is a labelled `<nav>`, visible orange focus outlines, external
  links announce "(opens in a new tab)", footer text is `text-sm`+ on `slate-950`.
- Dark navy/slate-950 surface with an orange accent line, soft glows and a faint dot grid; orange
  is the accent, matching the rest of the site. Mobile: grid stacks, bottom padding replaces the old
  spacer so the sticky mobile CTA never covers the last line.
- No new contact details, social links or newsletter were invented; add them to the Brand/Company
  columns when you have real ones.
- Files: new `home-footer.tsx`; `landingpage.tsx` (footer block replaced, unused `Award` import
  removed); `README.md`. Rollback: `git revert` (pre-change copy also kept in the system temp folder
  as `landingpage.before-footer.tsx`).

### Pending (next commit) — Hero structure refactor (`home-hero.tsx`)
Diagnosed and fixed in the same commit as the hero work below:
- **Whole home page re-rendered every 2.8s**: the rotating product name's state lived in
  `HomeView` (~2,600 lines), so each rotation re-rendered all of it twice. Now isolated in
  `RotatingProduct` inside the new `app/erp/_components/home-hero.tsx`.
- **Two coordinate systems**: copy was a % of a centred 1280px container while the dashboard was
  `absolute` as a % of the viewport, so they could collide and the panel never aligned with the
  copy. Now one CSS grid (`5fr / 4fr`, dashboard bleeds to the edge with a negative margin).
- **Clipped product names**: the label sat in a fixed `h-[1.2em] overflow-hidden` box, so a name
  that wrapped (e.g. "Shop Floor & Machine Monitoring") was cut off. Names now share one grid cell
  (cross-fade, block height = tallest name, nothing clipped, gradient fits each name).
- **Headline accessibility**: the `<h1>` text changed every 2.8s for assistive tech. The rotating
  names are `aria-hidden` and the full list is announced once (`sr-only`); rotation is skipped
  for `prefers-reduced-motion`; the old inner `setTimeout` was never cleaned up (now one interval).
- **Duplicate visual markup**: separate desktop and mobile dashboard blocks (two `<img>` of the
  same file) are now one `HeroVisual`; DOM order is intro → visual → details, so on phones the
  dashboard follows the CTAs instead of sitting under every product row.
- **Stacking**: decorative `-z-10` layers had no stacking context; the hero is now `isolate`d with
  a single `HeroBackdrop`. Dead `animate-in …` classes removed; the magic `6.25rem` offset is a
  named constant (`HERO_MIN_HEIGHT`); images use `next/image` (`priority` on the dashboard).
- CSS: `.synax-hero-enter`/`-enter-up` merged into `.synax-hero-visual` (rise on phones, slide-in
  from lg). Content, copy, colours and icons are unchanged.
- Bigger dashboard (follow-up): hero grid `5fr / 4fr` → `1fr / 1fr` and panel `scale-[1.03]` →
  `scale-[1.08]` (≈15–20% larger on lg+). If the text column feels tight, go back to
  `minmax(0,5fr)_minmax(0,4fr)`/`1.03`, or use e.g. `9fr/8fr` for a smaller step.
- Right-edge gap (follow-up): the dashboard no longer touches the viewport edge — its bleed is now
  `lg:-mr-[max(0rem,calc((100vw-80rem)/2-4rem))]` (≈4rem from the edge on wide screens, the normal
  container padding on narrower ones). Increase the `4rem` for more space, use `0rem` to bleed again.
- Files: new `app/erp/_components/home-hero.tsx`; `landingpage.tsx` (hero block replaced by
  `<Hero …/>`, rotating state/constants removed, unused `Sparkles` import dropped);
  `app/globals.css`; `README.md`.
- Rollback: `git revert` the commit (copies of the pre-refactor files were also kept in the
  system temp folder as `landingpage.before-hero-refactor.tsx` / `globals.before-hero-refactor.css`).

### Pending (next commit) — Hero redesign (reference-style, industry-neutral)
Commit subject: `Hero: reference-style redesign, industry-neutral copy, tilted floating dashboard`
- **Left column** (restyled to the reference): accent-bar eyebrow ("Unified Business Suite
  Founded & Developed by Senwell Group"); headline "One Platform for Every Operation" with the
  rotating line cycling the six products (Manufacturing ERP, IT Services & Project ERP, HRMS,
  Staffing & Resource Management, Shop Floor & Machine Monitoring, AI & Business Intelligence);
  short subtitle; icon-bubble row for the six products (`HERO_PRODUCTS`); pill CTAs
  ("Schedule Free 30-Min Consultation" keeps its modal behaviour, "Explore the 6 Products");
  trust row with dividers (Secure by design / Real-time / AI-assisted). The old per-industry
  compliance badges (AS9100 / ITAR / ISO / CNC IoT) are gone.
- **Right column** (lg+): the existing dashboard screenshot (`home.webp`, aspect ratio kept, no
  crop) in a navy frame, perspective-tilted (see follow-up tweaks below),
  floating with a contact shadow, glass sheen; behind it a soft light arc, faint blueprint grid,
  sky-blue glow and navy/sky corner bands at the bottom-right. **No orange** (the reference's
  orange CTA/accents were deliberately swapped for blue) and no factory photo (hero is not
  manufacturing-only). The earlier floating chips, orbit rings and aerospace backdrop were removed.
- Follow-up tweaks: dashboard panel position `top-[46%]` (was raised to 37%, then nudged back down a little), rounder corners
  (`rounded-[1.75rem]`/`[2.25rem]`) and stronger tilt (`perspective(1500px) rotateY(-16deg)
  rotateX(5deg) rotateZ(2deg)`); the two CTAs now sit directly under the subtitle (above the
  product row) so they stay visible; the mobile sticky "Schedule a Demo" bar only appears after
  scrolling past ~720px so it never covers the hero buttons.
- Above-the-fold fit: hero left column compacted on desktop so the six-product row and the
  trust row are visible without scrolling (section padding `lg:py-8 xl:py-10`, `space-y-4`,
  H1 `xl:text-[2.75rem]`, subtitle `text-base`, product bubbles `size-9`, trust icons `size-6`).
- Full-height hero (lg+): section is `min-h-[calc(100svh-6.25rem)]` (viewport minus the ~34px
  announcement banner and 64px header) with the copy vertically centred, so the hero fills the
  screen below the header. The left container got `w-full` so flex centring doesn't shrink it.
- Top whitespace fix: hero top padding cut to `lg:pt-4` with extra bottom padding
  (`lg:pb-[7vh]`) so the centred copy sits slightly above middle; spacing, H1 and subtitle now
  scale with viewport height via `clamp(…vh…)` so tall screens fill out instead of leaving
  empty bands.
- **Final layout (reverted from a card/strip experiment):** structure is the icon-bubble row of
  the six products, then the inline Secure / Real-time / AI-assisted row; no bottom strip, no
  floating chips; right visual back to `w-[40%] xl:w-[42%] 2xl:w-[44%]`, `top-[46%]`.
  Even small top/bottom distance: `lg:py-6` with content centred in the full-height hero, and
  content scaled by viewport height (`clamp(…vh…)` on spacing, H1, subtitle, bubble size and
  label) so the hero reads occupied without large empty bands.
- **Platform highlights restyled** (Secure by design / Real-time / AI-assisted are shared
  platform traits, not products): separated from the product row by a divider, labelled
  "PLATFORM HIGHLIGHTS · across the Synax platform", and shown as orange-tinted chips. This is
  the one place orange is used in the hero (everything else stays navy/blue).
- **Hero buttons**: now "Schedule a Demo" (opens the demo form; original `bg-blue-900`) and
  "Watch overview" (orange `bg-orange-200`, grey play icon; opens the existing tour modal
  via `openTourModal("Synax Platform Overview")`). Both use square-ish corners (`rounded-md`).
  The old "Explore the 6 Products" scroll link was replaced. The six product icon circles now
  have a grey background (`bg-slate-200`).
- **Rotating product name gradient**: the label's gradient (blue → indigo → teal) was painted
  across the full column width, so short names (HRMS) showed only the blue end while long ones
  (…Management) showed the teal end. The label is now `inline-block`, so the gradient spans each
  name's own width and every product shows the full gradient.
- **Bigger, more upfront dashboard**: right column widened to `w-[42%] xl:w-[47%] 2xl:w-[48%]`
  (side padding `pr-[2%]`), panel `scale-[1.03]` with a deeper shadow, and the tilt eased to
  `perspective(1500px) rotateY(-12deg) rotateX(4deg) rotateZ(1.5deg)` so it faces the viewer more.
  If it crowds the left text on some width, lower the `xl:`/`2xl:` widths.
- **Taller dashboard (lg+)**: the screenshot (native 1917×907, ≈2.11:1) is shown at
  `aspect-[19/10] object-cover object-left`, ≈11% taller; this crops ≈10% off the right edge
  (the "My Work"/"Today" column). Raise the second number (e.g. `19/11`) for more height, or
  restore `h-auto` for the uncropped image. Mobile/tablet image is unchanged.
- **Narrower and taller (latest, supersedes the two dashboard size bullets above)**: column
  `w-[40%] xl:w-[43%] 2xl:w-[44%]`, image `aspect-[7/4] object-cover object-left` (≈1.75:1 vs
  native 2.11:1), which crops ≈17% off the right edge of the screenshot. Tune the aspect value
  for height (smaller second number ratio = wider; `7/5` = taller) and the column widths for width.
- **Product-name gradient without blue**: the rotating label now runs
  `from-violet-600 via-indigo-500 to-teal-500` (was `blue-600 → indigo-600 → teal-500`).
- **Site-wide colour change — vivid blue retired** (primary = "Schedule a Demo" navy
  `blue-900`/`blue-800`; secondary = "Watch overview" orange): every Tailwind `blue-*` shade up to
  `blue-700` in `landingpage.tsx` was remapped — text/buttons/borders/rings → `blue-900`, hover →
  `blue-800`, soft tints (`blue-50/100`) → `slate-100/200`, soft borders → `slate-200/300`,
  light-on-dark accents (footer, banner, "Synax AI" section) → `orange-300`/`orange-700`/
  `orange-500` tints; hero glow/corner band use slate/orange. `app/globals.css` `--color-erp-brand*`
  tokens (used by Rollout and focus rings) moved from `#0b6cff` to navy `#1e3a8a`, `--color-erp-sky`
  to orange-300. Not changed: sky, indigo, teal, emerald, amber and violet category accents, and
  the client-logo mimic `text-[#0b6cff]` for "EXXON INFO". Unused components under `_components`
  (hero, dashboard, …) still carry old colours.
- **Sky / indigo / teal accents recoloured to the same two-colour system**: `sky-*` → navy
  (`blue-900`) with slate tints (`slate-100/200/300`); `indigo-*` → orange (`orange-50/100/200`
  tints, `orange-700` text/solid); teal glows → orange, the teal button → navy; light-on-dark
  accents → `orange-300` / `slate-300`. The rotating product label keeps its approved
  violet → indigo → teal gradient on purpose. Emerald, amber, red, violet (status/other accents)
  are unchanged. Supersedes the "sky, indigo, teal… not changed" note above.
- **Product icon consistency**: the hero's six product icons (`HERO_PRODUCTS`) now match the
  Products menu and product cards — Manufacturing ERP `Factory`, IT Services & Project ERP
  `Briefcase`, HRMS `Building2`, Staffing & Resource Management `Users`, Shop Floor & Machine
  Monitoring `Activity`, AI & Business Intelligence `Bot` (was Users / Layers / Cpu / BarChart3).
- **Product icon tiles match the Products menu**: `HERO_PRODUCTS` now carries a `tile` class per
  product (same colours the menu uses — emerald for Manufacturing ERP and Shop Floor, navy/slate
  for IT Services & Project ERP and HRMS, orange for Staffing and AI) and the hero icons use the
  same rounded-square tile with a border instead of grey circles.
- **"Watch overview" is now an outline button**: `border-2 border-orange-500`, transparent
  fill (`hover:bg-orange-50`), grey play icon kept; `py-2.5` plus the 2px border keeps its height
  equal to "Schedule a Demo".
- **Right side rebuilt to match the supplied reference (left column untouched)**:
  - New assets: `public/images/hero-dashboard-light.webp` (the light-theme app screenshot,
    1918×917, 55KB) replaces `home.webp` in the hero (desktop + mobile; `home.webp` is now unused
    by the hero but still in the repo), and `public/images/hero-factory.webp` (a 582×285 strip
    cropped from the reference mock-up) is the faded backdrop photo.
  - Composition (lg+): factory photo at the top-right, masked into the page with a curved fade;
    soft white arc over it; navy + orange corner bands bottom-right (larger, `h-32 w-[38%]`);
    the light dashboard sits lower (`top-[57%]`) in a white glass frame, perspective-tilted
    (`rotateY(-12deg) rotateX(4deg) rotateZ(1.5deg)`), still `aspect-[7/4] object-cover
    object-left`. The blueprint grid was removed. Mobile/tablet uses the same light image in a
    white frame, no tilt.
  - Note: the factory photo is manufacturing imagery, used because the reference design has it;
    swap `hero-factory.webp` for a neutral picture if the hero should stay industry-neutral.
- Mobile/tablet: image stacks below the copy, full width, same navy frame (no tilt).
- Motion: CSS only (`synax-hero-enter`, `-enter-up`, `-float`, `-sheen` in `app/globals.css`);
  all disabled under `prefers-reduced-motion`. The old `animate-in …` classes did nothing (no
  animation plugin is installed).
- Files: `app/erp/_components/landingpage.tsx` (hero only), `app/globals.css` (appended block),
  `README.md`.
- Rollback: `git revert` this commit.
- Tuning knobs: tilt is the `[transform:perspective(…)…]` class on the dashboard frame; remove it
  for a flat panel.

### Earlier history (backfilled from `git log`)
| Hash | Date | Subject |
|---|---|---|
| `75533fd` | 2026-11-06 | module, dashboard and landing page changes |
| `d30eebe` | 2026-11-05 | Fixed viewport card design |
| `4c7c7e5` | 2026-11-03 | landing page changes |
| `617573a` | 2026-11-03 | latest commit |
| `e25b4af` | 2026-11-02 | latest |
| `81abadb` | 2026-11-02 | latest change |
| `8be36ee` | 2026-10-30 | UI changes |
| `32c15a9` | 2026-10-30 | UI fixes |
| `c4c9155` | 2026-10-30 | UI changes |
| `0203352` | 2026-10-30 | fix design |
| `96ed300` | 2026-10-29 | Update home page |
| `e32f0ab` | 2026-10-29 | Initial commit |
