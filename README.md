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

### Pending (next commit) — Site-wide spacing: less white space
Commit subject: `Tighten vertical spacing across every page`
- **Rule of thumb (desktop)**: standard section padding 80-112px -> 40-48px, hero padding 56px -> 40px, heading-to-content gap 40px -> 28px, breadcrumb gap 32px -> 20px, closing band 64px -> 40px; mobile sections 32-40px. Compact sections (/security) 32-40px.
- **Shared**: `Block`, `PageHero`, `CtaBand`, `Breadcrumb` in `site-page.tsx` (affects /solutions, /why-synax, /security and the industry pages); product pages (`product-page.tsx`); industry pages; `/products`, `/solutions`, `/why-synax`, `/security` custom sections; footer (top padding 56px -> 40px, bars 48/32px -> 32/24px).
- **Home**: USP section, Market-Ready Platforms, Sectors, Benchmark, Purpose, Synax AI, the live preview, security, Senwell and the closing section now use ~40-48px; Rollout (`Section compact` in `ui.tsx`) 112px -> 48px. The earlier smaller pass in the USP entry is superseded by these numbers.
- If a section now feels tight, raise its `py-*` one step (e.g. `py-10` -> `py-12`); the new values are listed in this entry only as a range because they differ per section.
- Verified: `tsc`, `next build`. Not checked in a browser. Rollback: `git revert` the commit.

### Pending (next commit) — Home: USP section after the hero (AI, live machines, Tally and GST)
Commit subject: `Home: add the USP section after the hero and use the USPs in the hero and comparison`
- **New section** `_components/home-usp.tsx` (`<Usp/>`, placed right after `<Hero/>` in `landingpage.tsx`): tag "What sets Synax apart", headline "Built in, not bolted on: AI, live machines, Tally and GST", chips, then three numbered story rows with a dashed rail: **1 AI that acts** (home screenshot with a pulsing ring on the Synax AI tile; a floating "Synax AI proposes" card with a working Approve button), **2 Live machine monitoring** (scan line over the machine view; floating machine board with ticking counters and a tool-life alarm; "FOCAS connected"), **3 Tally and GST** (Finance & Billing crop; floating invoice card whose chips light up: Approved, IRN generated, E-way bill, Tally voucher; "Voucher sent to Tally"). Frames tilt on desktop and level on hover; floating cards stack under the frame on phones. Ends with a navy machine-to-ledger flow band with a travelling dot. Copy is the portal wording (`_data/live.ts`); no demo button (links to the AI, Shop Floor and Manufacturing pages). Animations (`synax-usp-*` in `globals.css`) and the timers stop for reduced motion.
- **Images**: `usp-machines.webp` (from `synax-dashboard.png`, an AI-generated **illustration** with garbled small text; replace with a real machine-board capture) and `usp-billing.webp` (crop of the Finance & Billing card from the cleaned home screenshot; replace with a real invoice / e-invoice capture). The AI row uses `hero-dashboard-overview.webp`.
- **Spacing pass** (home page): vertical padding trimmed so sections no longer leave large white gaps: the USP section (py 80px -> 56px on desktop, row gaps 64px -> 48px), Market-Ready Platforms, Sector & Challenge Alignment, Market Benchmark, Ecosystem Purpose, Synax AI and the closing section (py 80px -> 56 / 64px), headings gaps 48px -> 32px in Benchmark and Purpose, and the Rollout blueprint via a new `compact` option on the shared `Section` (`ui.tsx`: 112px -> 64px on desktop). Change the numbers back if any section now feels tight.
- **Hero**: the three tick lines under the buttons are now the USPs (AI that proposes, you approve; live machine monitoring via OEM or FOCAS; Tally and GST built in).
- **Comparison** (home and /why-synax): the staffing row is replaced by "AI Assistant That Acts" and the machine row is titled "Live Machine Monitoring (IoT)" (keeps the bento at five cards).
- Not done: the Watch overview video (needs a recording). Card figures (counts, M-01 etc., INV-2201) are sample data. "Most plants stitch these together from separate tools" is positioning copy, not a measured claim.
- Verified: `tsc`, `eslint`, `next build`. Not checked in a browser (tilt, floating card positions and the AI highlight position in particular). Rollback: `git revert` the commit.

### Pending (next commit) — Product renamed: Work & Delivery Management
Commit subject: `Rename IT Services & Project ERP to Work & Delivery Management`
- **Why**: it is not a project-ERP; it is the services side of the workspace (work tracker, projects, timesheets, billing, team and support tools) next to Manufacturing ERP. The old name made it read like a project-management add-on.
- **New name and copy**: *Work & Delivery Management* (short: Work & Delivery). Tagline "Plan the work, track the hours, bill what you deliver"; menu line "Work tracker, projects, timesheets & billing"; stat "Work to Billing"; four highlights; three module groups (Work & Projects, Time & Billing, Teams & Support) in `PRODUCT_DATA.it` and `PRODUCT_ROUTES` (`_data/products.ts`).
- **URL**: `/products/work-delivery-management`. The old `/products/it-services-project-erp` is a permanent redirect (`redirects()` in `next.config.ts`).
- **Updated**: home product carousel card, hero card, footer product list and brand blurb, demo-form option and industry-page demo name (both derive from the route name), products index and site metadata descriptions. The header/footer group label "Primary Business ERPs" is now "Core Business Products" and the card tag "Core ERP" is now "Core Product".
- **Not changed**: the "IT Services & Talent Staffing" **industry** page (it is an industry, not a product) and old README history entries. Please confirm that timesheets and billing are live in the product; they are on the earlier module list but not on the portal's current landing page.
- Verified: `tsc`, `next build`. Not checked in a browser. Rollback: `git revert` the commit.

### Pending (next commit) — New home hero image (no personal info)
Commit subject: `Home hero: new dashboard screenshot with personal details replaced`
- New screenshot of the Synax home screen (the Senwell Exports workspace) cleaned of personal and customer details with a script: "Anoop" -> "Synax" in the greeting, the company/tenant line "Senwell Exports / SERouteCards" -> "Synax Workspace / Demo tenant" (top-left and under the greeting), the signed-in user "Anoop Mishra" and email -> "Synax Demo" / "Demo workspace" ("Super Admin" kept), the customer name "Celsior" in Today -> "Team", and both Senwell logo tiles -> the Synax logo. Nothing else was changed (the "Precision People Performance" banner text is part of the photo and was left).
- Files: `public/images/hero-dashboard-overview.webp` (2000x1045 master) and `hero-dashboard-overview-fit.webp` (1748x1045, the full image squeezed ~12.6% in width so the stage keeps its 1.67:1 shape; this is what the page shows). `home-hero.tsx` now uses it, and the product -> module spotlight regions were re-measured for the new layout: Manufacturing ERP -> Purchase & SCM, Shop Floor -> Planning & Production, HRMS -> People, AI & BI -> Overview, IT Services -> sidebar Projects, Staffing -> sidebar Staffing (cards: left = IT, Staffing, AI; right = Shop Floor, Manufacturing, HRMS).
- The older screenshots (`hero-dashboard-light.webp`, `hero-dashboard-fit.webp`, `home.webp`/`home.png`) are no longer used by the app and still contain the old names; they remain in git history.
- Verified: `tsc`, `eslint`. Not checked in a browser. Rollback: `git revert` the commit.

### Pending (next commit) — /solutions: new sections instead of repeating the home page
Commit subject: `Solutions page: where to start, coverage matrix, module directory and go-live FAQ`
- **Why**: the "Solutions in detail" cards (challenge -> answer -> capabilities per solution) said the same thing as the home page's Sector & Challenge Alignment. They are gone.
- **New, from the live portal** ("Start with what hurts most. Add the rest when you are ready."): (1) **Four starting points**: for each solution the pain, the modules to **start with** (numbered) and what to **add next** (dashed chips), plus the portal's "Who is Synax built for?" answer and "module by module within a few weeks"; (2) a **coverage matrix** (solutions x the portal's eight module areas: core / optional / not typical); (3) the portal's own **module directory** by area, each card saying which solutions it is core to; (4) a **getting-started FAQ** (onboarding, Tally, GST, machines, pricing) from the portal. The rollout block was dropped because it duplicated the home page's Rollout blueprint; the industry pages block and the Plan-Execute-Inspect-Release workflow stay.
- The hero now says "Start with what hurts most..." and its side card jumps to the four starting points. New data: `_data/solution-paths.ts` (module names come from `LIVE_MODULES` and the staffing product highlights; **coverage is typical use, my judgement - please review**).
- Verified: `tsc`, `eslint`. Not checked in a browser. Rollback: `git revert` the commit.

### Pending (next commit) — /security and /solutions follow the /why-synax type and colours
Commit subject: `Security and solutions pages: same fonts and colours as /why-synax; tighter spacing`
- **Same look as /why-synax**: bold navy hero headline, extrabold slate-900 section headings, bold slate-900 card titles, slate-600 / slate-700 body copy, navy fact values, orange tags and outlines, sky-blue bands and sky closing band (`CtaBand tone="light"`, now also on /solutions). The softer dusky-gray type tried earlier on /security was replaced by this; `PageHero calm` and `Block calm` still exist in `site-page.tsx` but are not used.
- **Kept on /security**: the tighter spacing (`Block compact`), compliance and responsibility side by side, the slim privacy strip, the jump bar, hero fact icons and the "What happens to every posting" rail.
- Verified: `tsc`, `eslint`, `next build`. Not checked in a browser. Rollback: `git revert` the commit.

### Pending (next commit) — /why-synax jump bar shows the current section
Commit subject: `Jump bar on /why-synax: active chip is navy and follows the scroll`
- New `_components/jump-bar.tsx` (client) replaces the static chips: the chip for the section being read is navy with white text (the first, "Pillars", is active from the top of the page), the others stay outlined. It follows the scroll (the last section whose top has passed ~150px under the sticky header + bar; the last chip at the very bottom), activates on click right away (scroll updates paused ~0.9s so the smooth scroll does not flicker), keeps the active chip visible in the sideways-scrolling row on phones, and sets `aria-current`.
- Reusable: `<JumpBar items={[{ id, label }]} />`; the section ids must exist on the page.
- Verified: `tsc`, `eslint`, `next build`. Not checked in a browser. Rollback: `git revert` the commit.

### Pending (next commit) — Sky-blue hero background on every page except the home page
Commit subject: `Use the /why-synax hero background on all other page heroes`
- The `/why-synax` hero look (`border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-white`, navy headline, slate-700 lead) now also applies to the heroes of /products, product pages, /solutions, industry pages and /security (`PageHero` in `site-page.tsx`, `product-page.tsx`, `products/page.tsx`). The home page hero is unchanged. The hero side cards (solutions jump list, security facts, industry at-a-glance, product highlights) are white with a sky border to match.
- Verified: `tsc`, `eslint`. Not checked in a browser. Rollback: `git revert` the commit.

### Pending (next commit) — Button policy: Watch overview kept, Schedule a Demo not repeated
Commit subject: `Keep Watch overview in hero and closing band; stop repeating Schedule a Demo`
- **Policy (agreed)**: *Watch overview* stays in the **hero and the closing band of every page** (home hero and closing section, product, industry, /products, /solutions, /why-synax, /security). *Schedule a Demo* appears only in the always-visible **header**, the **hero** and **one closing block**; no demo buttons inside cards or sections.
- **Update**: the heroes of every page except the home page now carry only *Watch overview*; *Schedule a Demo* stays in the header, the home hero and the closing band of each page. (`PageHero` no longer takes `product`; /products, product pages, /why-synax, /solutions, industry pages and /security changed.)
- **Header**: one "Schedule a Demo" (desktop and mobile); the duplicate "Contact Sales" button is gone (it stays as a footer link). The mobile sticky bar on the home page stays, because the header button is hidden on phones.
- **Footer**: the separate closing card is gone, because every page now ends with its own closing band (demo + Watch overview).
- **Removed demo buttons** (each opened the same form): the six per-card Demo buttons in Market-Ready Platforms, Book Demo in the sector panel, the rollout and comparison buttons, the "Talk to us about your process" button (now a link to /solutions), the four Book a demo buttons on /solutions, and the Ecosystem Purpose button (now a link to /why-synax). The Synax AI section button is now a link to the AI product page.
- **Code**: `PageHero` and `CtaBand` (`site-page.tsx`) take `tourTitle` again and show both buttons; `Products`, `Sectors`, `Rollout` and `Comparison` lose their demo props; industry pages use Watch overview in the hero (no extra Explore link).
- Verified: `tsc`, `eslint`, `next build`. Not checked in a browser. Rollback: `git revert` the commit.

### Committed (`Add product, industry and content routes; shared page frame; portal-aligned copy`) — /why-synax redesigned (light blue, less white space)
Commit subject: `Redesign /why-synax: sky-blue hero, jump bar, flow rail, tabbed reasons, pricing beside FAQ`
- `app/why-synax/page.tsx` rewritten to the approved concept, in **light sky blue instead of near-black**: sky-blue gradient hero (headline with an orange stroke under "Synax", the two buttons, and a 2x2 proof board: Free for SMEs under 50, Tally, GST, AS9100D); a sticky jump bar (Pillars, Flow, Reasons, Compare, Pricing, FAQ); three pillar cards with coloured top edges; the six-step spindle-to-invoice flow as one connected rail on a sky-50 band; the five reasons as **tabs** (`_components/reason-tabs.tsx`, arrow-key navigation) instead of five tall rows; the comparison table (cards on phones); a sky-blue pricing card (sticky on desktop) beside the full 7-question FAQ; a heritage strip of group companies; and a light-blue closing call to action.
- `site-page.tsx`: `CtaBand` gets `tone="light"` (used here; the other pages keep the navy band), and `Block` anchors use `scroll-mt-32` so headings clear the header and the jump bar.
- **Removed from this page** (as in the approved concept): the "fits your stack" block (integration points and tech highlights) and the rollout phases; the rollout is still on /solutions and the tech highlights on /security.
- Verified: `tsc`, `eslint`, `next build`. Not checked in a browser. Rollback: `git revert` the commit.

### Committed (`Add product, industry and content routes; shared page frame; portal-aligned copy`) — Live Platform Preview: new viewport (photo panel + dashboard)
Commit subject: `Live Platform Preview: photo panel beside a dashboard with flow timeline and AI proposal`
- **The window bar and the four product tabs above the viewport are unchanged** (dots, URL, Manufacturing ERP / Aerospace & Defence / HRMS / Staffing).
- New `_components/console-viewport.tsx` replaces the old viewport in `landingpage.tsx`. Left: a clear photo panel (`next/image`, 300px on desktop, a banner on phones) with a live chip and a dark caption bar. Right, on a light panel: kicker + title + an orange-outline simulate button + "Full page" link; four stat tiles with sparklines; a flow timeline (done = navy tick, current = light orange, upcoming = dashed, progress line); a "needs attention" list with Late / Review / Ready chips; and a "Synax AI proposes" card whose **Approve** button turns it green ("Recorded in the event history"). Per-tab data is the `DATA` object at the top of the file; photos: `precision.png`, `aerospace.png`, `hrms.jpg`, `IT-staffing.jpg`.
- All figures are sample data and labelled so. Removed with the old viewport: the CNC / FAIR / punch / match simulators and their state in `Landingpage` / `HomeView`, the "< 52 Sec" payroll tile, and `console-extras.tsx` (from the previous step, never committed).
- Verified: `tsc`, `eslint`, `next build`. Not checked in a browser. Rollback: `git revert` the commit.

### Committed (`Add product, industry and content routes; shared page frame; portal-aligned copy`) — /solutions: redesigned solution cards
Commit subject: `Vary the solution card layouts on /solutions`
- `app/solutions/page.tsx`: the section under the hero has its own heading ("Solutions in detail") and the four solutions no longer repeat one card. Layout: the first is a **wide card** (story panel on the left: tinted, big number, icon, title, description, delivered-by and buttons; problem -> arrow -> answer and 2x2 capability tiles on the right), the middle two are **compact cards** side by side (header band, then everything stacked, footer bar), and the last is a **wide card mirrored** (story panel on the right). Cards fade in on scroll (staggered for the pair) and lift their shadow on hover. Card parts are small components in the same file (`Challenge`, `Answer`, `Capabilities`, `WideCard`, `CompactCard`), so another layout is a few lines.
- Content is unchanged (`_data/solutions.ts`). Cards are now `h3` under a new `h2`. Jump links from the hero still work.
- Verified: `tsc`, `eslint`. Not checked in a browser. Rollback: `git revert` the commit.

### Committed (`Add product, industry and content routes; shared page frame; portal-aligned copy`) — Header active state + five industry pages
Commit subject: `Header shows the current page; add dedicated industry pages`
- **Header active state** (`_components/site-nav.tsx`, rewritten): the page you are on is bold navy with an orange underline in the bar
  (Overview, Solutions, Why Synax, Security & Trust), has `aria-current="page"`, and gets a tinted row with a "Here" tag inside the Products
  and Industries dropdowns. The Products / Industries triggers are marked too when you are on one of their pages (`/products*`,
  `/solutions/<slug>`). The mobile menu uses an orange left bar + bold. "Compare all products" is marked on `/products`. Trailing
  slashes are ignored.
- **Marker colour and motion**: the orange is light (a `#fdba74` to `#fed7aa` underline, light-orange "Here" tag, orange-300 mobile bar), and it
  animates: the underline draws in from the left whenever a link becomes current, the tag pops in, the mobile row slides in. Keyframes
  `synax-nav-draw / -pop / -slide` and classes `.synax-nav-active / -here / -slide` are at the end of `app/globals.css`; all off for
  `prefers-reduced-motion`. To change the colour or speed, edit that block.
- **Industry pages**: `/solutions/<slug>` for every item in the Industries menu, from `_data/industries.ts` (`INDUSTRY_PAGES`):
  `aerospace-defence` (same URL as before), `precision-cnc-machining`, `it-services-staffing`, `automotive-heavy-industrial`,
  `plant-workforce-hcm`. Before, only aerospace had a page (a generic product template) and the others pointed at a product page or a
  home anchor. Statically generated, unknown slugs 404, each with its own title, description and canonical.
- **Template** (`_components/industry-page.tsx`): hero with an "At a glance" card (built for, delivered by), the challenges, the flow that
  answers them (6-step spindle-to-invoice, Plan-Execute-Inspect-Release, or an industry-specific flow with module chips), the modules
  behind it, the products (first = "Start here"), proof where it exists (Senwell group companies on the automotive page), the matching
  FAQ questions from the portal, the other industries, and a CTA. Icons come from `industry-icons.ts`.
- **Content**: flows, FAQ and module groups come from the portal data and product data. The "challenge" cards are written in plain
  language from the earlier solution copy and the portal's wording; **please review them**. Nothing about certifications or numbers was
  added. The automotive menu line "Multi-plant polymers, stamping & Senwell heritage" and the IT line "AI matching" were dropped (the
  portal does not say them).
- `/solutions` has a new "A dedicated page for your industry" block linking all five. `app/solutions/aerospace-defence/page.tsx` was
  removed (the dynamic route serves the same URL).
- Verified: `tsc`, `eslint` (0 errors), `next build` (24 pages). The current page is already marked (`aria-current`) in the prerendered HTML of the menu items; the colours were not checked in a browser. Rollback: `git revert` the commit.

### Committed (`Add product, industry and content routes; shared page frame; portal-aligned copy`) — Align the home page and product data with the live portal
Commit subject: `Align home page, nav, footer and product copy with the live portal`
- **Why**: the live portal (`_data/live.ts`) does not claim a 99.99% SLA, 256-bit AES, an ITAR vault, NADCAP, ISO 9001, CMMC, "Quality
  Certified" badges, Zeiss/Hexagon CMM sync, or a "4 to 8 weeks vs 12 to 18 months" timeline. Those were removed or replaced with what it
  does say. AS9100D QMS controls (in the portal's own metadata), FAIR register, COC, Tally, GST e-invoice/e-way bill, FOCAS and
  approval-first AI are kept.
- **Home page** (`landingpage.tsx`): Security section is now the portal's "Security & control" (4 controls + link to /security);
  Senwell section tiles show group companies running on Synax instead of AS9100D/ITAR/ISO/99.99% badges; closing CTA is "See your own
  shop floor in Synax"; Synax AI card no longer mentions ITAR logs; console preview labels (ITAR/NADCAP/Cryptographic/3.5x/Zeiss/ZKTeco)
  reworded (the preview numbers are still sample data).
- **Purpose section**, **footer** (chips: AS9100D QMS controls, GST e-invoice & e-way bill, Works with Tally, DPDP Act 2023 privacy
  policy), **header banner/menu**, and **site metadata** (`app/layout.tsx`, `app/erp/layout.tsx`: "The ERP for precision and job-work
  manufacturers", free for SMEs under 50).
- **Comparison** (home + /why-synax): "Legacy ERPs (SAP/Oracle)" → "Legacy ERP suites"; the timeline bar now says "Live module by module
  in a few weeks" (portal wording) vs "A long, consultant-led project"; rows rewritten to portal-backed capabilities (OEM/FOCAS, FAIR
  register & COC, Tally & GST); the ITAR vault row is gone.
- **Product data**: Aerospace, HRMS and Staffing entries rewritten (their unverified metrics — "100% first article accuracy", "3.8 days
  to placement", "4.9/5 employee rating", "99.9% punch accuracy" — and capability lists are gone). **Fixed a copy-paste bug**: the HRMS
  and Staffing pages were showing the *IT Services* module groups (Project Delivery etc.); they now have their own groups.
  `solutions.ts` aerospace/HRMS/staffing rewritten the same way. `content.ts`: "99.9% platform availability" tiles replaced by Tally.
- **Left alone (hidden or unchanged)**: the home testimonial (hidden by `SHOW_TESTIMONIALS = false`; it still says "AS9100D and ITAR
  compliance…"), `TESTIMONIALS` in `content.ts`, the HRMS/Staffing home-card stats ("< 60 Sec" payroll run), and the ~20 unused legacy
  components. Re-add any removed claim only after the owner confirms it.
- Verified: `tsc`, `eslint` (0 errors), `next build`. Not checked in a browser. Rollback: `git revert` the commit.

### Committed (`Add product, industry and content routes; shared page frame; portal-aligned copy`) — Portal data pass: new pages use the live Synax portal's own content
Commit subject: `Use live portal copy on /security, /why-synax and the Shop Floor and AI pages`
- **Source**: `https://synax.senwellgroup.com/landing` is an Angular app (the HTML is just "Loading Synax"), so the copy was read from
  its published bundle (`9004.*.js`, the landing chunk) and the page metadata on 2026-11-11. It is stored in `app/erp/_data/live.ts`
  (positioning, trust chips, three pillars, spindle-to-invoice flow, security controls, pricing, FAQ, module directory, clients,
  compliance statements). Update that file when the portal changes.
- **What the portal says** (and the old Next.js pages did not): "The ERP for precision and job-work manufacturers", GST e-invoice /
  e-way bill, works with Tally (vouchers bridge), ITC-04 pack, FOCAS/OEM machine connection, AI agents only propose / maker-checker,
  **free for SMEs under 50 employees** (per-seat plans above that, module add-ons), onboarding "a few weeks" with Excel import.
- **/security rewritten** from the portal's "Security & control" section (isolated workspaces, server-checked postings, audit history,
  role-based access with two-step sign-in), the AI-approval FAQ answer, and the privacy/terms pages (Senwell Group Private Limited,
  DPDP Act 2023). **Removed because the portal does not say it**: 99.9% availability, "encryption in transit and at rest", "monitored
  24/7", ISO 9001, CMMC, ITAR/EAR vault. Compliance block = AS9100D QMS controls, GST e-invoice/e-way bill, ITC-04, DPDP.
- **/why-synax**: hero uses the portal's headline and trust chips (replacing the 99.9% tile set); new sections "Built around how a
  machine shop actually works" (3 pillars), "Spindle to invoice" (6-step flow), Pricing and FAQ (7 questions, native `<details>`).
- **Shop Floor & Machine Monitoring** and **AI & Business Intelligence** pages: descriptions and module groups now use the portal's
  wording (OEM/FOCAS connection, barcode job start, OEE per job; agents only propose, maker-checker, event history).
- **Not changed (needs a decision)** — home page claims the live portal does not make: "99.99% SLA", "256-bit AES", "ITAR Vault",
  "NADCAP", "AS9100D Quality Certified", "ISO 9001 / ITAR Ready" badges, "99.9%" in `content.ts` (`IMPACT_STATS`, `HERO_PROOF`), the
  "4 to 8 weeks vs 12 to 18 months" bars, SAP/Oracle names, and positioning ("Aerospace, HRMS & IT Staffing" vs the portal's "precision
  and job-work manufacturers"). Note the portal's own route metadata still says "ERP for Aerospace, Defense & IT Services" while its
  landing page and SEO tags say "Smart ERP for SMEs in IT & Manufacturing" — the portal is not consistent either.
- Files: new `_data/live.ts`; changed `security/page.tsx`, `why-synax/page.tsx`, `_components/site-page.tsx` (`Faq`), `_data/products.ts`.
- Verified: `tsc`, `eslint`, `next build`. Not checked in a browser. Rollback: `git revert` the commit.

### Committed (`Add product, industry and content routes; shared page frame; portal-aligned copy`) — Solutions, Why Synax and Security & Trust pages
Commit subject: `Add /solutions, /why-synax and /security pages`
- **/solutions** (`app/solutions/page.tsx`): one deep-dive card per solution (Precision Manufacturing, Aerospace & Defence, HRMS,
  IT Staffing): challenge → how Synax solves it → capabilities → the product that delivers it, with demo / explore buttons; then the
  Plan-Execute-Inspect-Release workflow and the four-phase rollout + "before onboarding" checklist. `/solutions/aerospace-defence`
  is unchanged.
- **/why-synax** (`app/why-synax/page.tsx`): key facts, the five reasons (from `PLATFORM_BENEFITS`), a comparison table
  (cards on phones) from `_data/benchmark.ts`, "fits your stack" (integration points + tech highlights), the rollout, and the
  Senwell heritage. **Left out on purpose**: the "4 to 8 weeks vs 12 to 18 months" timeline and the SAP/Oracle names (the table says
  "Legacy ERP suites" / "Disconnected point tools"); the home page section still has them.
- **/security** (`app/security/page.tsx`): six controls in plain language (tenant isolation, access control, audit trails, data
  protection, availability, integrations), compliance alignment (AS9100D, ITAR/EAR, ISO 9001:2015, CMMC 2.0, worded as "supports", not
  "certified"), a shared-responsibility split, and a "bring your security questionnaire" CTA (demo form option "Security & Trust
  Review"). **Review before launch** — every line comes from existing site copy, but these were removed because nothing in the repo
  backs them: "256-bit AES", "tamper-proof keys", "99.99% guaranteed SLA", "air-gapped" (the published figure is 99.9%). The home page
  security and Senwell sections still say 99.99%; the CMMC sentence is a plain-language gloss of "CMMC 2.0 practice support".
- **Shared data** so the home page and the new pages cannot drift: `_data/solutions.ts` (read by `home-sectors.tsx` and
  `/solutions`), `_data/benchmark.ts` (read by `home-comparison.tsx` and `/why-synax`). The sector panel's "Powered by" label now shows
  the current product name (e.g. "Staffing & Resource Management" instead of "IT Staffing VMS"). Demo-form product names fixed so
  "HRMS" and the sector buttons pre-select correctly.
- **Navigation**: header (desktop + mobile) and footer now link to `/solutions`, `/why-synax`, `/security` instead of home-page anchors.
  Shared page parts: `_components/site-page.tsx` (hero, section block, CTA band); layouts `app/why-synax/layout.tsx`,
  `app/security/layout.tsx` (same shell as the other routes).
- Verified: `tsc`, `eslint` (0 errors), `next build` (all routes prerendered). Not checked in a browser.
- Rollback: `git revert` the commit.

### Committed (`Add product, industry and content routes; shared page frame; portal-aligned copy`) — Real routes per product + shared page frame
Commit subject: `Routes: /products/<slug> per product, /solutions, shared shell, deep-link fixes`
- **New URLs** (registry: `app/erp/_data/products.ts` → `PRODUCT_ROUTES`; change a slug there and every link follows):
  `/products` (overview), `/products/manufacturing-erp`, `/products/it-services-project-erp`, `/products/hrms`,
  `/products/staffing-resource-management`, `/products/shop-floor-machine-monitoring`,
  `/products/ai-business-intelligence`, and `/solutions/aerospace-defence`. They are statically generated
  (`app/products/[slug]/page.tsx` uses `generateStaticParams`; unknown slugs 404), each with its own title,
  description and canonical URL.
- **Before**: Manufacturing, HRMS, Staffing and Aerospace were in-page views switched by `useState` (no URL, no back
  button, not indexable); IT Services, Shop Floor and AI only scrolled to home sections. All of that state is gone.
- **Content**: `PRODUCT_DATA` moved unchanged from `landingpage.tsx` to `_data/products.ts`; `it`, `shopfloor`, `ai` are
  new, drafted from the home product cards and module stacks (**please review the wording**). The old per-capability metrics
  ("98.4% match accuracy" etc.) are not shown on the new pages (unverified numbers).
- **One page template**: `_components/product-page.tsx` (server component) in the navy/orange system with `SectionTag`,
  green/navy/orange product tones (`route-tone.ts`), `DemoButton` / `TourButton` (`demo-buttons.tsx`).
- **Shared frame**: `_components/erp-shell.tsx` = `.erp-root` + fonts + banner/header (`site-nav.tsx`) + footer
  (`home-footer.tsx`) + demo/tour modals (`demo-provider.tsx`, `useDemo()`). Used by the layouts of `/erp`, `/products`,
  `/solutions`, `/cloud-erp-software` and by `app/page.tsx`, so `/` now matches `/erp` (it used to render without the
  Synax fonts/scope). Header/footer/cards/"Full Page" buttons are real `<Link>`s. The product dropdown now says
  "Compare all products" → `/products`.
- **`/erp#comparison` fix**: `landingpage.tsx` scrolled to the top on mount (a `[currentPage]` effect), which overrode any
  `#hash`; that effect is gone with the state. Home sections (`comparison`, `products`, `solutions`, `purpose`, `synax-ai`,
  `security`, `senwell`) got `scroll-mt-20` so the sticky header no longer covers their headings.
- **`/cloud-erp-software/manufacturing-management`**: was a copy of another vendor's page (their brochure/video hotlinks, "Why
  Acumatica", "Coming soon" blocks, old blue). Now renders the Synax Manufacturing ERP page with canonical
  `/products/manufacturing-erp`.
- **Other changes**: demo form product list = the six products + aerospace + full suite; the tour modal's fake player (status
  bar, "1080p 60FPS", progress bar) is replaced by an honest "recorded tour is being prepared – book a live walkthrough";
  footer year is a constant (`COPYRIGHT_YEAR`) because `new Date()` fails prerendering under Cache Components.
- Files: new `_data/products.ts`, `erp-shell.tsx`, `site-nav.tsx`, `demo-provider.tsx`, `demo-buttons.tsx`, `product-page.tsx`,
  `route-tone.ts`, `app/products/{layout,page,[slug]/page}.tsx`, `app/solutions/{layout,aerospace-defence/page}.tsx`,
  `app/cloud-erp-software/layout.tsx`; changed `landingpage.tsx` (1.1k lines → header/footer/modals/detail views removed),
  `home-footer.tsx`, `home-products.tsx`, `home-sectors.tsx`, `home-comparison.tsx`, `home-purpose.tsx`, `erp/layout.tsx`,
  `app/page.tsx`, `cloud-erp-software/manufacturing-management/page.tsx`. `site-header.tsx` / `site-footer.tsx` are now unused.
- Verified: `tsc`, `eslint` (0 errors) and `next build` (all 8 routes prerendered). Not checked in a browser.
- Rollback: `git revert` the commit. After pulling it, delete `.next` once (route and CSS-token caches).

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Landing audit fixes
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Hero v5: image-first spotlight hero
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Market-Ready Platforms redesign (`home-products.tsx`)
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — One section tag everywhere (`section-tag.tsx`)
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Market Benchmark comparison redesign v2 — bento (`home-comparison.tsx`)
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Sector & Challenge Alignment redesign (`home-sectors.tsx`)
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Products buttons flipped
- In the Market-Ready Platforms cards (`home-products.tsx`) the button styles were flipped:
  **Demo** is now the solid navy button (`bg-blue-900`, white text) and **Explore** is the 2px orange
  outline. Sizes/order are unchanged (Explore stays the wide one). This supersedes the button colours in
  the "Market-Ready Platforms redesign" entry below.

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Synax AI section: softer chat colours
Commit subject: `Synax AI: soften chat colours, replace off-palette purple CTA`
- In the "Your Enterprise, Answered Instantly" section (`landingpage.tsx`, `#synax-ai`) the solid
  orange chat colours were too bold. Now: user bubbles `bg-orange-400/15` + `border-orange-300/25`
  with `text-orange-50` (was solid `bg-orange-700`); the four AI avatars (header + three in the
  thread) are tinted tiles with an `orange-300` icon instead of the bright orange→amber gradient;
  the send button is a tinted `orange-400/15` button with an `aria-label`.
- The "See Synax AI in Your Demo" button was still `bg-purple-600` (missed by the earlier palette
  change); it is now a light button (`bg-white text-blue-900`, `hover:bg-orange-50`).
- Copy unchanged. Files: `landingpage.tsx`, `README.md`. Rollback: `git revert`.

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Ecosystem Purpose redesign (`home-purpose.tsx`)
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Rollout blueprint redesign (`rollout.tsx`)
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — New footer (`home-footer.tsx`)
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Hero structure refactor (`home-hero.tsx`)
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

### Committed (`latest ommit` 14997fd / `latest` 42619bc) — Hero redesign (reference-style, industry-neutral)
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
