# Manufacturing crisis film (source)

"One Small Mistake. An Entire Production Line at Risk." Source for `public/videos/manufacturing-crisis.mp4` (720p, the
Watch overview on the Manufacturing ERP page) and the 1080p master `video-exports/synax-manufacturing-crisis-1080p.mp4`
(git-ignored).

**Style: cinematic 2.5D, not 3D.** Photoreal 3D (rendered machinery, realistic faces) is not possible with this
pipeline. The film is drawn in HTML/SVG as a pure function of time, `apply(t)`, at 30 fps. Each set is split into depth
layers (background, middle, foreground) that a virtual camera moves with parallax and depth-of-field blur. Lighting is done
with overlays: red alarm light and glow, a sepia flashback with grain and white flashes, a cool investigation grade, and
clean blue-white light after Synax. There are sparks, smoke, machine shake and camera shake, and hard cuts on narration
words. No logo appears before the Synax turning point, and there are no subtitles.

## Story (2 min 08 s)

| # | Scene | What happens |
| --- | --- | --- |
| 1 | The emergency (0–11 s) | Close-up of machine 4 (a turning centre): the shaft spins, the machine starts to chatter, sparks fly, the alarm goes off and the screen reads "SPINDLE LOAD 142%". The operator hits the E-stop, the spindle winds down and smoke rises. His shocked face, then a wide shot of the floor with workers turning. The narration starts after 4 s of sound only. |
| 2 | Production chaos | The conveyor slows and stops, workers run to M4, and parts pile up at the end of the line. The Production Manager walks in and calls "Stop the line!" |
| 3 | Quality failure | The Quality Inspector measures a shaft with a digital caliper: 24.50 against a tag of Ø 25.40 ± 0.02. He is shocked and calls for help. The batch is sorted into the REJECT bin, and the Production Manager receives the report. |
| 4 | The manual mistake (flashback) | Sepia, "Two days earlier". The Production Employee copies the customer PO (Ø 25.40 mm) onto a paper job card and writes Ø 24.50 (close-up; a red circle marks it). He drops the card in the "To shop floor" tray. The operator follows the card and keys 24.50 into the machine. |
| 5 | The consequences | Rejected parts on the bench. Chips: Machine hours lost, Material consumed, Schedule broken, Delivery at risk. The schedule board has a red cross, and a close-up of the worried manager shows "Due 21 Nov · in 3 days". |
| 6 | The investigation | In the plant office the employee flips through job cards, the inspector checks the production records and the operator checks the material ledger, while the manager is on the phone. Four departments appear on screen (Production, Quality, Stores, Planning) with broken, flickering links. |
| 7 | The turning point | A slow push on the manager as the grade drains. A ripple of blue light turns the plant into the connected factory: blue links run from the Synax logo to the machines, the panel and the conveyor, and six areas appear (Production orders, Operations, Materials, Workforce, Assets, Reports). |
| 8 | Manufacturing with Synax | Glass panels over the out-of-focus factory: the production order released against the part master and BOM (Ø 25.40 "from part master", "One approved record"); the route card (op 10 turning on M4 confirmed, op 20 grinding live, op 30 stage inspection ✓); the manufacturing overview (machines running, jobs on time, downtime, order fulfilment). Then the part passport, linking the part to its order, material lot, machine and operator. |
| 9 | The transformation | The same floor in clean light, with everything running and the panel showing "Ø 25.40 ✓ from part master". The inspector measures 25.40 and drops the part in the OK bin; the manager smiles over her tablet. The narration says problems can still happen, but they are found sooner and traced in minutes. |
| 10 | Brand close | Synax logo on navy: "FROM MANUAL CHAOS TO MANUFACTURING CONTROL." and "Synax ERP – Smarter Manufacturing. Complete Operational Visibility." |

**Characters** (one rig, the same outfits in every scene):

- **Production Manager:** a woman in a white hard hat, light-blue shirt, navy vest with reflective stripes and an ID badge.
- **Machine Operator:** blue hard hat, safety glasses, navy coverall with stripes, gloves.
- **Quality Inspector:** white lab coat, safety glasses, blue gloves.
- **Production Employee:** office shirt, glasses, ID badge.
- **Background workers:** grey coveralls.

**Claims shown** come only from the website's Manufacturing ERP page:

- production orders (route cards) released against the part master and BOM
- machine-confirmed operations and live machines
- stage buy-offs and inspection
- order fulfilment
- dashboards
- the part passport (traced to its PO, material lot, machine and operator)

The values (PO-4471, ML-2291, 11/12 machines, 96 %, 18 min, 72 %) are demo data. The film does not claim that the ERP
removes human error.

## Files

| File | Role |
| --- | --- |
| `art.js` | Characters (the rig with hard hats, safety glasses, vests, a lab coat, gloves, props) and the sets: factory floor with machines 1–3, conveyor and machine 4 (chuck, shaft, tool, coolant, tower lights, control panel, E-stop), QC bench (caliper with LCD, tag, bins, tray), office, plant office. |
| `director.js` | Timeline and shot list (cuts on narration words), virtual camera with parallax, shake and depth of field, lighting modes, the per-set animation, the insert, chips, departments, ripple, network, nodes, feature panels, part passport, end card; lists the sound cues and music sections. |
| `demo.tpl.html` | Page, overlays and styles. |
| `gen_audio.mjs` | Narration: Edge neural voice `en-IN-PrabhatNeural` (mature male Indian English) via `msedge-tts`, word timings. |
| `sound.js` | Effects and score, synthesised in ffmpeg. Effects: hum, chatter, sparks, alarm, clank, spin-down, tinks, beeps, paper, pen, keys, phone, glitch, risers, hits, logo shimmer. Score: a tension bed that quickens until the reveal, then a corporate theme. The music ducks under the voice. |
| `meta.js`, `check.js`, `render.js`, `encode.js`, `icons.mjs` | Timeline export; checks without screenshots (every shot frames its subject, overlays on screen and not overlapping, no text overflow); frame capture; MP4/poster encoding; icons. |

## Rebuild

In a scratch folder with `playwright` (Chromium), `ffmpeg-static`, `@fontsource/inter` and `msedge-tts` (path in `TTS_DIR`),
copy these files and `assets/synax-pro-light.webp` (from `public/images`), then:

```
node icons.mjs && node gen_audio.mjs && node build.js && node meta.js && node check.js && node sound.js
node render.js 0 4 & node render.js 1 4 & node render.js 2 4 & node render.js 3 4
node encode.js
```

Regenerate the narration with a licensed voice service before launch.
