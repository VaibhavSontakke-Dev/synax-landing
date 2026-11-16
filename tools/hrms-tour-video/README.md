# HRMS module tour video (source)

Source for the long (9 min) HRMS tour, `hrms-tour.mp4` (no longer on the site; replaced by `tools/hrms-explainer-video/`) (720p, website) and the 1920×1080 master `video-exports/synax-hrms-tour-1080p.mp4`
(git-ignored). Like the Assets tour, this is not a screen recording: the HRMS screens are re-created in HTML from the portal
screenshots and the whole video is drawn as a pure function of time, `apply(t)`, then captured frame by frame at 30 fps.

## How it is built

| File | Role |
| --- | --- |
| `pages.js` | One builder per screen (Home, Employee List/Add, Interview List/Add, DWM Add/List/Create Project, Referral Add/Dashboard, Leave & Absence, Leave Policies, Performance Reviews, Offboarding Requests/Clearance/FNF, Exit Interview). Labels, columns and controls come from the screenshots; people, dates and numbers are fictional and consistent across screens. |
| `narration.js` | The voice-over, one clip per "beat" (`<scene>_<n>`). |
| `script.js` | The tour: per scene and beat, what the cursor does. Actions are anchored to words in the narration (`b.w("word")`), so cursor, typing, dropdowns, zoom and highlights stay in sync with the voice. |
| `engine.js` | Timeline builder + renderer: cursor, typing (date/time fields type digit by digit), dropdown menus, rings, camera, sidebar scroll/expand, section title cards, intro/end card, dimmed "sidebar tour" scenes. Also `lint()` (clipped text, overlaps, cards that clip content) and `probe()` (checks every cursor stop lands on its target element; no screenshots needed). |
| `gen_audio.mjs` | Narration via Microsoft Edge neural voice `en-IN-NeerjaNeural` (`msedge-tts`). Cached by text hash; writes `durations.json` and `words.json`. |
| `sound.js` | Sound design synthesised in JS (launch sound, section whooshes, page swishes, clicks, soft typing ticks, success chimes, end chime) mixed with the voice; ffmpeg adds a ducked ambient pad, limiter and loudness normalisation (-16 LUFS). |
| `meta.js`, `render.js`, `encode.js`, `build.js`, `icons.mjs` | Timeline export + lint, frame capture (Playwright, resumable, multi-worker), MP4/poster encoding, HTML build, icon extraction. |

No subtitles or captions are drawn or embedded.

## Rebuild

In a scratch folder install `playwright` (with Chromium), `ffmpeg-static`, `msedge-tts` (path via `TTS_DIR`) and
`@fontsource/inter`, copy these files plus `assets/synax-pro-light.webp` (from `public/images`) and `assets/plane.png` (this folder's `plane.png`, the
airplane banner cropped from the Home screenshot), then:

```
node icons.mjs && node gen_audio.mjs && node build.js && node meta.js   # meta.js prints build warnings, lint and probe results
node sound.js
node render.js 0 4 & node render.js 1 4 & node render.js 2 4 & node render.js 3 4   # four workers
node encode.js
```

Editing the story: change `narration.js` / `script.js`, then `gen_audio.mjs` (only changed lines are re-synthesised), `build.js`,
`meta.js` (read its warnings), `sound.js`, render, encode.

## Content decisions (please review)

* **Screens without a screenshot are not drawn.** Attendance Log, Attendance OT Approval, Break Pass, DWM Assign User, HRMS
  Compliance and Department Performance appear only in the sidebar (cursor + highlight over a dimmed page) with narration;
  nothing is invented for them. Add their screenshots and a `pages.js` builder to show them.
* Referral List: the screenshot provided is the Add Referral form, so that is what the Referral List menu entry opens in the video.
* Placeholders not visible in the screenshots (dropdown option lists such as gender/marital status/interview stage, Approve/Reject
  and Complete buttons, the Home "People & HR" tour, kanban task cards) are plausible demo content; swap them if the product differs.
* All interactions are simulated; no backend behaviour is claimed or shown (no success alerts are invented).
* Voice is a free neural voice for review. Regenerate with a licensed voice service before launch.
* Sample data is international for a global audience: no Indian names, European cities, fictional +44 / 7700 mobile numbers,
  and salary figures (CTC column, interview CTC, FNF amounts) in euros at ten times the original sample values.
