# Assets module explainer video (source)

Source for `public/videos/assets-tour-v5.mp4` (720p, website) and the 1080p master
`video-exports/synax-assets-explainer-1080p.mp4` (git-ignored). Nothing is screen-recorded and **no portal screen is shown
or copied**: the portal screenshots were only a reference for which fields, labels, steps and data exist. Every frame is an
original illustration drawn in HTML/SVG as a pure function of time, `apply(t)`, and captured at 30 fps.

## Story (about 2 min 20 s)

| # | Scene | What happens |
| --- | --- | --- |
| 0 | Opening cartoon (10 s) | 2D corporate office: an Employee asks "Where is the laptop assigned to me?", the Asset Manager searches spreadsheets (paperwork flies, a sheet full of #N/A), the Operations Manager asks "When was this machine last maintained?", a second Employee walks in with a damaged laptop. Problem chips along the top. |
| 1 | Synax reveal | Zoom-blur into navy. Scattered asset facts float around, then "Meet Synax ERP / Smarter Asset Management, Complete Control."; Register → Assign → Track; the cards snap into order around an "Assets at a glance" card (counts, bar chart by type). |
| 2 | Module overview | Assets with three tiles: List, Add, Assign. |
| 3-8 | Adding an asset | A six-step wizard (Type, Details, Codes, Specs, Dates, Save) with a live preview card: type tiles, typing, the serial and asset numbers appearing as auto-generated (a concept, not how they are built), configuration chips, warranty bar, Save, success burst. |
| 9 | Asset list | The asset flies into an illustrated list: type pills with live counts, search, sort, edit and delete, warranty dates in green. |
| 10 | Assigning | Assign Asset: the asset flies to an employee card; the Assigned view shows who has each asset. |
| 11 | Benefits | Full visibility, Clear ownership, Warranty in view. |
| 12 | End card | Book a demo. |

## Files

| File | Role |
| --- | --- |
| `cartoon.js` | The opening cartoon (SVG): characters (arms, blinking, talking mouths, moods), office, speech bubbles measured to fit, chips, flying papers, camera. |
| `director.js` | Timeline (every action is anchored to a word of the narration), reveal, overview, wizard, list, assigning, cursor and clicks, benefits, end card. |
| `demo.tpl.html` | Page and styles; `build.js` injects icons, durations and word timings into `demo.html`. |
| `gen_audio.mjs` | Narration (Edge neural voice `en-IN-NeerjaNeural` via `msedge-tts`) and word timings. |
| `sound.js` | Synthesised sound design (room tone, bubble pops, alert blips, paper rustle, footsteps, launch sound, card snaps, pings, typing ticks, clicks, swishes, chimes, ducked ambience), mixed to -16 LUFS. |
| `meta.js`, `check.js`, `render.js`, `encode.js`, `icons.mjs` | Timeline export; layout checks without screenshots (bubbles and chips, reveal cards, text that overflows its box, elements off screen, overlaps inside each wizard step, list cells against their columns, every cursor stop on its target); frame capture; MP4/poster encoding; icon extraction. |

No subtitles or captions are drawn or embedded (speech bubbles are part of the cartoon).

## Rebuild

In a scratch folder with `playwright` (Chromium), `ffmpeg-static`, `@fontsource/inter` and `msedge-tts` (path in `TTS_DIR`),
copy these files and `assets/synax-pro-light.webp` (from `public/images`), then:

```
node icons.mjs && node gen_audio.mjs && node build.js && node meta.js && node check.js && node sound.js
node render.js 0 4 & node render.js 1 4 & node render.js 2 4 & node render.js 3 4
node encode.js
```

All names and values are demo data. Regenerate the narration with a licensed voice service before launch.
