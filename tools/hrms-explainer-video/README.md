# HRMS module explainer video (source)

Source for `public/videos/hrms-explainer.mp4` (720p, website: the Watch overview button on /products/hrms) and the 1080p
master `video-exports/synax-hrms-explainer-1080p.mp4` (git-ignored). Built like the Assets explainer: nothing is
screen-recorded and **no portal screen is shown or copied**. The portal screenshots were only a reference for which areas,
fields and steps exist. Every frame is drawn in HTML/SVG as a pure function of time, `apply(t)`, and captured at 30 fps.
The older 9-minute screen-by-screen tour is in `tools/hrms-tour-video/` and is no longer on the site.

## Story (about 2 min 18 s): problem, then solution

| # | Scene | What happens |
| --- | --- | --- |
| 0 | Opening cartoon (11 s) | HR desk chaos: an Employee asks "How many leaves do I have left?", the Hiring Manager "When is the interview again?", a leaving Employee carries a box: "Is my settlement done yet?", the HR Manager searches spreadsheets while papers fly. Problem chips: Leave confusion, Missed interviews, Late settlements, Scattered records. |
| 1 | Synax reveal | "Meet Synax ERP / Smarter HR, Happier People.", Hire → Manage → Support, scattered HR facts snap into order around a "People at a glance" card. |
| 2 | Overview | The employee journey: eight area tiles joined by a path, a dot travels from Recruitment to Offboarding. |
| 3-10 | Eight areas | Each starts with a 2.5–3 s cartoon problem moment with the same characters ("The problem" tag, a speech bubble, a prop), then a circular wipe into the Synax solution, shown as a concept: Employee Management (a profile fills in, joins the list, search), Recruitment & Interviews (a candidate card moves Screening → Technical → HR Round → Offered, schedule, feedback, offered CTC), Attendance & Breaks (check in, break, check out on a day timeline, overtime approved, who's in today), Daily Work Management (tasks on a board, assigned, one moves to Done, project progress), Referrals (refer in a few clicks, New → Shortlisted → Interview → Joined), Leave & Holidays (balance ring, request, Approve, company holidays), Performance Reviews (cycle, score, notes, variable pay, the whole team), Offboarding & Settlement (clearance checklist, full and final amount, paid, exit interview). |
| 11 | Benefits | One record, Faster hiring, Smooth exits. |
| 12 | End card | Book a demo. |

Sample data is fictional and international (no Indian names, European cities). Salary amounts are shown in euros at ten
times the original sample figures (for example a CTC of € 8,400,000 a year and a settlement of € 1,865,000), as requested.

## Files

| File | Role |
| --- | --- |
| `cartoon.js` | The HR office cartoon (SVG): characters, props, speech bubbles measured to fit; the opening (`Toon`) and the eight problem vignettes (`ToonV`). |
| `director.js` | Timeline (every action is anchored to a word of the narration), reveal, overview, the eight solution scenes, wipes, cursor, benefits, end card; it also lists every sound event for `sound.js`. |
| `demo.tpl.html` | Page and styles; `build.js` injects icons, durations and word timings into `demo.html`. |
| `gen_audio.mjs` | Narration (Edge neural voice `en-IN-NeerjaNeural` via `msedge-tts`) and word timings. |
| `sound.js` | Synthesised sound design (room tone, bubble pops, alert blips, paper rustle, footsteps, launch sound, whooshes for the wipes, pops, pings, clicks, typing ticks, end chime, ducked ambience), mixed to -16 LUFS. |
| `meta.js`, `check.js`, `render.js`, `encode.js`, `icons.mjs` | Timeline export; layout checks without screenshots (bubbles on screen and clear of faces, chips and tags; vignette text fully typed before the wipe; reveal cards; overview tiles; every solution: nothing off screen, no text overflowing its box or card, no overlapping cards or notes; every cursor stop on its target); frame capture; MP4/poster encoding; icon extraction. |

No subtitles or captions are drawn or embedded (speech bubbles are part of the cartoon).

## Rebuild

In a scratch folder with `playwright` (Chromium), `ffmpeg-static`, `@fontsource/inter` and `msedge-tts` (path in `TTS_DIR`),
copy these files and `assets/synax-pro-light.webp` (from `public/images`), then:

```
node icons.mjs && node gen_audio.mjs && node build.js && node meta.js && node check.js && node sound.js
node render.js 0 4 & node render.js 1 4 & node render.js 2 4 & node render.js 3 4
node encode.js
```

Regenerate the narration with a licensed voice service before launch.
