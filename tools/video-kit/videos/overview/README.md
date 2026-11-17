# Synax ERP overview video: "Pip & Sage" (source and production package)

Source for `public/videos/synax-overview.mp4` (1280×720, website: the **Watch overview** button that opens the
"Synax Platform Overview" tour) and the 1920×1080 master `video-exports/synax-overview-birds-1080p.mp4` (git-ignored).
Length **4:59**, 30 fps, two AI voices, synthesised music and sound design, **no subtitles or captions**.

Nothing is screen-recorded and no portal screen is copied. Every frame is an original HTML/SVG illustration drawn as a
pure function of time (`__apply(t)`) and captured with Playwright. Module and menu names come from the portal's sidebar
export (route JSON, 229 routes, generated 17 Nov 2026). Claims about what the product does come from `app/erp/_data/live.ts`
(the live portal). People, companies, document numbers and amounts are fictional sample data.

## 1. Creative concept

- **Title:** *Synax ERP: One Platform. Connected Business.*
- **Core message:** Synax is not one app. It is one connected platform where projects, people, the shop floor, money and
  control live side by side, each team in its own workspace on shared data.
- **Story:** two birds look down on a busy company where every team is an island ("its own sheet, its own version of the
  truth"). Sage shows Pip how the same work runs in Synax: a profitable project, a staffing request, one employee's
  journey, one customer order through the factory, the money side, access control, and AI that proposes while people
  approve. They end where they began, with every module connected.
- **Structure:** the conversation changes shape from scene to scene (a question, a scenario, a full process, a surprise,
  a joke, a challenged assumption, a summary), never "problem, solution, feature" on repeat.

### Characters

| | **Pip** (Bird A, the curious explorer) | **Sage** (Bird B, the guide) |
| --- | --- | --- |
| Look | Sky blue (#4F9CF5), pale belly, three orange crest feathers, orange beak and feet, slightly smaller | Navy (#1E3A6E), light belly, one swept crest, round light-blue glasses, amber beak and feet |
| Personality | Energetic, practical questions, misreads how teams connect, the jokes | Calm, confident, explains by showing, never salesy, a dry sense of humour |
| Voice | Female Indian-English (Edge `en-IN-NeerjaNeural`, +10 % rate, +12 Hz) | Male Indian-English (Edge `en-IN-PrabhatNeural`, +6 % rate) |
| Animation | Flies in, hops, flaps when excited, waves, surprised eyes, "facepalm" after the factory tour | Walks and glides, points with a wing, shrugs, shakes the head, smug look after the joke |

Both birds are rigged SVG puppets (`birds.js`): blinking, pupils that follow what is being discussed, head tilt and
bob while talking, beak synced to each word of the narration, wing gestures, walking hops, flying arcs, hovering, turning
round, landing squash, and moods (curious, surprised, happy, tired, smug).

### Visual direction

- One light world from start to finish (sky-blue gradient, faint navy dot grid, soft blue and orange glows). The
  birds stand on the same ground as the product windows, so the cartoon and the UI no longer feel like two films.
- Product scenes use an app window with the **portal's own sidebar** (the real menu names for that section, the active
  item lit as the voice names it, a breadcrumb), and cards that fill most of the frame. Text is at least 15 px at
  1080p (sidebar) and mostly 19–44 px.
- Brand palette: navy, sky blue, slate, white, soft orange accents. The Synax logo is the site's own file
  (`public/images/synax-pro.webp`). Inter.
- One dark moment for Synax AI (navy with stars, the birds get a soft glow) so it is memorable, then back to light.

## 2. Script (dialogue)

Spoken forms spell out acronyms for the voice ("P O", "M R P", "G R N", "C O C", "N C R"); they are written normally here.

**1. Hook: a busy company** (0:00–0:21)

| Time | Who | Line |
| --- | --- | --- |
| 0:01 | Pip | I've been watching this company all morning. Projects, people, machines, finance. Everyone is so busy! |
| 0:10 | Sage | Busy, yes. Connected? Not really. Every team has its own sheet, and its own version of the truth. |
| 0:19 | Pip | So that's why they keep calling each other! |

**2. Meet Synax ERP** (0:21–0:44)

| Time | Who | Line |
| --- | --- | --- |
| 0:22 | Sage | Now picture them all on one platform. Meet Synax ERP. |
| 0:27 | Pip | Projects, people, and the shop floor? In one place? |
| 0:31 | Sage | Projects, staffing, HR, manufacturing, quality and finance. Each team gets its own workspace, on shared data. |
| 0:40 | Pip | Okay, you have my attention. Show me! |

**3. Projects** (0:44–1:03)

| Time | Who | Line |
| --- | --- | --- |
| 0:45 | Pip | How does a manager know if a project is actually making money? |
| 0:49 | Sage | The team logs its hours in the Work Tracker, and Cost Mapper brings the project's costs together. |
| 0:55 | Pip | And billing? |
| 0:56 | Sage | Billing and dev cost review sit right beside it. Project analytics shows the whole picture. |

**4. Staffing** (1:03–1:29)

| Time | Who | Line |
| --- | --- | --- |
| 1:04 | Pip | New scenario. A client needs three Java developers by Monday! |
| 1:09 | Sage | That's a requirement under a statement of work. Then candidates, interviews and offers, onboarding and deployment. |
| 1:17 | Pip | So hiring is just the beginning? |
| 1:19 | Sage | Exactly. Work logs and timesheets lead to invoices and payments, with replacements and an audit trail on record. |

**5. HRMS** (1:29–2:04)

| Time | Who | Line |
| --- | --- | --- |
| 1:30 | Pip | And the people inside the company? Attendance, leave, the usual chaos? |
| 1:35 | Sage | Follow Maya. A manpower request opens a job position. She's interviewed, gets an offer, and pre-joining checks are done before day one. |
| 1:46 | Pip | Does she get her own login? |
| 1:48 | Sage | Her own employee portal: attendance, leave, the holiday calendar and her documents. Then performance reviews, and one day, clearance, final settlement and an exit interview. |
| 2:01 | Pip | From hello to goodbye. Got it! |

**6. Manufacturing: follow one order** (2:04–3:40)

| Time | Who | Line |
| --- | --- | --- |
| 2:05 | Pip | Now the serious part. A customer order comes in. Does everyone start phoning each other? |
| 2:12 | Sage | Not here. Let's follow one order. The customer PO is recorded, and contract review checks that we can deliver. |
| 2:22 | Pip | Do we even have the material? |
| 2:23 | Sage | Sales planning and the MRP run work it out. Anything short becomes a purchase requisition, then a vendor PO. |
| 2:32 | Pip | And when the truck arrives? |
| 2:33 | Sage | Gate control logs it, the GRN register books it in, and the material ledger holds the stock. Customer-owned material is tracked separately, for job work. |
| 2:45 | Pip | Now we make the parts? |
| 2:46 | Sage | A route card is generated against the bill of materials, material is issued, and jobs are scheduled. The load chart shows how busy each machine is. |
| 2:57 | Pip | What if a machine stops halfway? |
| 2:59 | Sage | Live monitoring shows every connected machine, and downtime and alarms record why it stopped. |
| 3:06 | Pip | I thought manufacturing was just machines making things! |
| 3:09 | Sage | And I thought birds didn't do paperwork. |
| 3:12 | Pip | Fair point. What if a part fails inspection? |
| 3:15 | Sage | Quality has its own workspace: final inspection and COC, FAIR, NCR and CAPA, and calibration. Genealogy traces any part back through its history. |
| 3:28 | Pip | And then it ships? |
| 3:29 | Sage | Packing and dispatch, delivery challans with e-way bills, and the route cards move on to the invoice. |
| 3:37 | Pip | From order to truck. I need a moment. |

**7. Finance, Assets, Admin** (3:40–4:07)

| Time | Who | Line |
| --- | --- | --- |
| 3:41 | Pip | Does it stop once the work is done? |
| 3:43 | Sage | No. Customer invoices with your own templates, debit and credit notes, project billing and staffing invoices. |
| 3:52 | Pip | Quick one. Who has the company laptop? |
| 3:55 | Sage | Check assets. Every asset is listed and assigned to a person. |
| 4:00 | Pip | And who decides who sees what? |
| 4:02 | Sage | Admins do, with roles, users, and page and feature permissions. |

**8. Synax AI and Agents** (4:07–4:35)

| Time | Who | Line |
| --- | --- | --- |
| 4:09 | Pip | Last question. With all this data, who spots the problems? |
| 4:13 | Sage | Synax AI answers questions about your data, and Synax agents watch for exceptions, like overdue challans, and propose a fix. |
| 4:23 | Pip | Wait. They change things on their own? |
| 4:26 | Sage | No. Nothing changes until someone with the right role approves. And teams talk it through in chat and meetings. |

**9. Close and brand** (4:35–4:59)

| Time | Who | Line |
| --- | --- | --- |
| 4:36 | Pip | Projects, people, manufacturing, finance. All connected? |
| 4:40 | Sage | That's the idea. Less juggling. More visibility. Better control. |
| 4:47 | Pip | Sounds like a smarter way to run a business! |
| 4:50 | Sage | Synax ERP. One platform. Connected business. |


## 3. Storyboard

| # | Scene | Birds | Product UI and animation | Camera / transitions | Sound |
| --- | --- | --- | --- | --- | --- |
| 1 | Hook (0:00–0:21) | Pip flies in from the top right and lands; Sage walks in from the left; they face each other in the middle. Pip looks at each team as he names it; Sage shrugs at "Not really". | Six department islands (Projects, HR, Shop floor, Purchase, Finance, Management), each with "own sheet". Broken dashed links with orange ×. Question bubbles pop up on "own sheet / version / truth"; the phones shake on "calling". | Fade in from light; slow float. | Whoosh, chirp on landing, pops, alert blips, phone trill. |
| 2 | Meet Synax ERP (0:21–0:44) | Both fly to the lower left; Pip is startled by the reveal and flaps; Sage points around the ring. | The islands fly into the centre; a white hub with the Synax logo pops; title "One platform. Connected business."; ten module tiles burst out on a ring as Sage names them; data dots flow along the spokes on "shared data". | Push in on the hub at "Meet", out again for the ring. | Sub, sweep, chime, tile pops, ping. |
| 3 | Projects (0:44–1:03) | Pip turns to Sage to ask; turns to the screen while Sage points. | Projects window: header "Atlas Portal Revamp" PRJ-0142 with progress; Work Tracker hours fill; Cost Mapper lines add up to the cost to date; Billing milestones; Dev Cost Review chip; Project Analytics (contract, cost, margin, monthly bars). | Gentle push towards Analytics. | Pops, sidebar ticks, ping. |
| 4 | Staffing (1:03–1:30) | Pip raises a wing at the urgent request; Sage points along the flow. | Staffing window (all 20 menu items): Requirement REQ-2207, SOW-104, a candidate funnel (Candidates 6 → Interviews 5 → Offers 4 → Onboarding 4 → Deployed 3, avatars hop column to column), Work Logs → Timesheets → Invoices → Payments, then Performance & Risk, Replacements, Approvals, Audit Trail. | Static. | Snaps per stage, pops. |
| 5 | HRMS (1:30–2:04) | Pip shrugs at "chaos", waves "goodbye". | HRMS window: Maya's journey track (Request → Interview → Offer → Pre-joining → Portal → Review → Exit) with her avatar travelling; panels swap: manpower request and job position, interview rounds, offer "Accepted" stamp, pre-joining checks, Employee Portal tiles (My Attendance, My Leaves, Holiday Calendar, My Documents, Break Pass, My Requests), review stars, clearance, FNF, exit interview. | Static. | Pops and ticks. |
| 6 | Manufacturing (2:04–3:41) | Both fly into a factory hall, then back to their corner when the screen rises. Pip flies across to peek at the alarming machine and hovers there; the joke (Pip happy, Sage smug, Pip surprised); Pip "facepalms" at the end. | Factory hall with machines; the order card "FH-220 × 500, Orion Aero" pops, then flies into the app. Flow strip Order → Plan → Purchase → Receive → Produce → Monitor → Quality → Dispatch. Panels: Customer PO + Contract Review (stamp) + Order Fulfilment queue; Monthly Sales Planning + MRP Run (220 kg short) → Purchase Requisition → Vendor PO; Gate Control, GRN Register (within tolerance), Material Ledger (300 → 522 kg), Customer Material (job work); Route Card RC-0917 with operations, material issued, All Schedules, Load Chart; Live Monitoring board (counts climbing, VMC-05 alarm pulses) and Downtime & Alarms; Final Inspection & COC, NCR → CAPA, FAIR / Calibration / PPAP / QMS Registers / Supplier Quality, Quality Genealogy tracing back to the vendor PO; Packing & Dispatch boxes, Delivery Challan with e-way bill and gate exit, Route Cards to Invoice with a truck driving off. The sidebar group and item follow the voice. | Push in on the order card; slide-up of the app; push towards the machine board. | Machine-hall ambience, kick drum in the music, alarm blips, stamp, whooshes. |
| 7 | Finance, Assets, Admin (3:41–4:08) | Pip curious; Sage points at each card. | Three tall cards in turn: Customer Invoice INV-2026-0418 plus Invoice Templates, Debit Notes, Credit Notes, Project Billing, Staffing Invoices; Assets list with the laptop assigned to Maya highlighted; Access Control roles × pages matrix ticking on, Users, User Requests, Page Permissions, Feature Permissions, Integration Center. | Static; the active card is lit, the others dim. | Pops, ticks, ping. |
| 8 | Synax AI and Agents (4:08–4:35) | Birds glow on the dark background; Pip startled ("on their own?"); Sage shakes his head on "No". | Synax AI chat: the question is typed, the answer lists 3 overdue challans; a Synax Agent proposal card (send reminders) pulses until "approves", then Approve is pressed and "Approved by A. Novak (Stores manager) · recorded" appears; Chat and Meeting cards. | Fade to navy with stars and back. | Sweep, chime, typing ticks, ping, click, success chime. |
| 9 | Close and brand (4:35–4:59) | Both return to the middle, face each other, then step aside, face the viewer and wave. | Two rows of module tiles connect to the birds; "Less juggling. More visibility. Better control."; end card: logo, "One platform. Connected business.", "Connect your people, projects and operations with one business platform.", "Explore Synax ERP · Book a demo", synax.senwellgroup.com. | Fade to the end card. | Chirp, end chime, final chord. |

## 4. Product coverage matrix

| Product area | Features shown (portal menu names) | Scene | Business value |
| --- | --- | --- | --- |
| Projects & Work Tracker | Work Tracker, Projects List / ID, Cost Mapper, Billing, Dev Cost Review, Analytics (sidebar also shows Add, Leads, Meetings) | 3 | Know whether a project makes money before the month ends |
| Staffing | Customers, Requirements, SOW, Candidates, Interviews, Offers, Onboarding, Deployments, Work Logs, Timesheets, Invoices, Payments, Performance & Risk, Replacements, Approvals, Audit Trail (all 20 items listed) | 4 | One flow from a client's request to the payment |
| HRMS | Manpower Requests, Job Positions, Interviews, Candidate Evaluations, Offer Management, Pre-Joining Verification, Employee Portal and Self Service (My Profile, Holiday Calendar, My Requests, My Documents), Break Pass, Performance & Compliance, Offboarding Requests / Clearance / FNF, Exit Interview | 5 | One employee record from hello to goodbye |
| Manufacturing: sales and planning | Order Fulfilment, RFQ Register, Customer PO, Contract Review, Monthly Sales Planning, MRP Run, Purchase Requisition, Vendor PO | 6 | Know before committing whether you can deliver and what to buy |
| Manufacturing: stores and logistics | Gate Control, GRN Register (receipt tolerance), Material Ledger, Customer Material, Job Work Traceability, Delivery Challan (e-way bill), Dispatch Gate Exit | 6 | Every kilo and every customer-owned part accounted for |
| Manufacturing: production and machines | Route Card Generation, RC Issue, All Schedules, Load Chart, Live Monitoring, Downtime & Alarms (Maintenance, NC Programs in the sidebar) | 6 | See load and stoppages without walking the floor |
| Quality | Final Inspection & COC, NCR, CAPA, FAIR, Calibration, PPAP, QMS Registers, Supplier Quality, Quality Genealogy | 6 | Trace any part back to its PO, material lot, machine and operator |
| Dispatch and invoicing | Packing & Dispatch, Route Cards to Invoice, Customer Invoice | 6, 7 | From the last operation to the invoice in one flow |
| Finance | Customer Invoice, Invoice Templates, Debit Notes, Credit Notes, Project Billing, Staffing Invoices | 7 | The money side sits next to the work |
| Assets | Assets List, Add, Assign | 7 | Know who has which asset |
| Administration | Access Control (Roles, Users, User Requests, Page Permissions, Feature Permissions), Integration Center | 7 | Decide who sees and does what |
| Synax AI and Agents | Synax AI (questions about your data), Synax Agents (watch for exceptions, propose a fix; an approver decides; recorded) | 8 | Exceptions found early, people stay in control |
| Collaboration | Chat, Calendar / Meetings | 8 | Teams talk it through where the work is |

**Deliberately left out:** Firebase Rules (an internal security setting), technical routes and feature-permission keys,
Rubber Masters and Mixing & Weighing (only for rubber tenants), Masters and setup screens beyond a mention, Tally and GST
e-invoice wording (true per the portal, but kept out to keep the story short; the e-way bill is shown).

**Accuracy notes:**
- "Agents only propose; nothing changes until someone with the right role approves" is the portal's own statement (`live.ts`).
- Live Monitoring is described as showing "every connected machine" (the portal: CNC via OEM connection or FOCAS; others confirm counts on the shop-floor screen).
- No automatic hand-off between modules is claimed; the video says each step is recorded in its own workspace and that documents can be traced back (the portal's "each document carries the one before it").
- The route JSON lists 7 menu features as missing from the permission catalogue (Gate Control, Store Inward, Articles, Attendance Log / Biometric / OT Approval, Pre-Joining Verification) while its `missingFeatureCount` says 3. Gate Control and Pre-Joining Verification appear in the video because they are real menu items; check their permission keys in the portal.

## 5. Production assets and direction

- **Character sheets:** `tools/video-kit/engine/birds.js` (shapes, colours and rig in code; render any pose with `snap.js`).
- **Backgrounds and UI:** `tools/video-kit/engine/demo.tpl.html` (styles) and `director.js` (every scene, built from the portal's menu names).
- **Logo:** `public/images/synax-pro.webp` (no new logo was made).
- **Voice direction:** Pip quick and bright, rising on questions; Sage measured, warm, a smile on the joke. Replace the Edge
  voices with licensed or recorded voices before launch: keep each line's file name (`audio/<id>.mp3`), rerun the
  `audio` step (or skip it and write `words.json` from the new audio's word timings), and every animation re-times itself.
- **Music:** synthesised in `sound.js` (C major, 100 BPM; pad and plucks for curiosity, bass from the reveal, a kick and
  hats for the factory, pad only for the AI moment, everything for the close, then a held final chord), ducked under the
  voices. A licensed track can replace it: mix it under the voices at about -20 dB with ducking.
- **Sound effects:** synthesised (pops, ticks, clicks, whooshes, alert, phone trill, bird chirp, stamp, chimes),
  machine-hall ambience in the factory. Final mix -16 LUFS, true peak below -1.5 dBFS.

## 6. Files and rebuild

Built with the shared engine in `tools/video-kit/` (see its README). This folder holds only what is specific to this video:

| File | Role |
| --- | --- |
| `video.json` | Output name (`synax-overview`), 1080p master file name, end-card text and music levels per scene. |
| `lines.json` | The dialogue: one entry per line (speaker, text, scene start, pause after). |
| `director.js` | Timeline (every cue anchored to a spoken word) and the nine scenes. |
| `words.json`, `durations.json`, `icons.json` | Generated by the `audio` step and kept here, so a rebuild needs no new narration. |

The bird rig (`birds.js`), page template, audio, sound, render, check and encode scripts are shared in
`tools/video-kit/engine/`. Since the move, the shared rig waves at chest height (fixed in the Manufacturing ERP video);
the published 4:59 file still shows the older wave, which a re-render would update. From `tools/video-kit`:

```
node make.mjs overview audio      # only after changing lines.json
node make.mjs overview draft      # quick half-size check -> work/overview/draft.mp4
node make.mjs overview final      # publishes public/videos/synax-overview.mp4 and the poster
```

**Licence note:** the voices use the unofficial Edge text-to-speech client. Regenerate them with a licensed service
(for example Azure AI Speech, same voices) or recorded voices before launch. Music and effects are synthesised here and
carry no third-party licence.
