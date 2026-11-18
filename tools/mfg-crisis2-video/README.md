# Manufacturing crisis film 2: the dialogue version (source)

Source for `public/videos/manufacturing-crisis-2-full.mp4` (720p, the "Watch overview 2" button on the Manufacturing ERP page)
and the 1080p master `video-exports/synax-manufacturing-crisis-2-1080p.mp4` (git-ignored). It uses the same 2.5D
technique and sets as film 1 (`tools/mfg-crisis-video/`): layered sets, a parallax camera with depth of field, and
lighting overlays. This is a stylised film, not photoreal 3D. The difference is the story: here the plant talks its way
through an emergency nobody can explain. Six characters speak, and their mouths follow the word timings of their lines.

## Story (2 min 26 s)

| # | Scene | What happens |
| --- | --- | --- |
| 1 | Sudden production failure (0–12 s) | A wide shot of normal operations, with the supervisor monitoring. Then a close-up as machine M02 chatters and sparks, the tower lights and panel flash red, and the operator hits the E-stop and looks around in panic. Unfinished parts pile up on the other line, and a tracking shot follows workers rushing to the machine. Sound only, no voice. |
| 2 | Everyone starts communicating | The operator on the walkie-talkie ("Sir! Machine zero two has stopped!..."); the supervisor running in ("Stop the entire batch!..."); the inspector arriving with a tray of rejected parts ("These measurements are incorrect!..."); the manager in the plant office with three incoming calls ("What happened? Which production order is affected?..."). Role tags appear the first time each person speaks. |
| 3 | Material and production losses | A montage over the inventory employee's line: idle machines and waiting workers, rejected parts with finished goods on hold, raw material already consumed, delayed production orders. She reaches the manager ("How much material have we lost?...", "I don't have the complete figures yet..."). No financial figures are shown. |
| 4 | Nobody has the answer | The team gathers. Each person answers in a close-up (operator, inspector, inventory, planner), but none has the full answer. The manager's last questions cut to job cards flying out of the cabinet, the wall clock, and the manager calling again. |
| 5 | The root cause (flashback) | Sepia, "Earlier that day". A clerk copies the PO (Ø 25.40 mm) onto a paper job card and writes 24.50 (a close-up with a slow zoom and a red circle). The card goes to the tray, the supervisor hands it to the operator, she keys in 24.50, and the machine cuts the wrong size. The narrator explains over the scene. |
| 6 | The turning point | The dark plant, with three cards for the manual ways of working (Spreadsheets, Paper records, Manual communication), each marked as unlinked. A blue ripple then reveals the connected factory, the Synax logo and seven areas: manufacturing operations, production orders, order fulfilment, material information, workforce coordination, assets, management reporting. |
| 7 | Manufacturing with Synax ERP | The manager reviews on his tablet in front of the out-of-focus factory. Six panels appear as they are named: Manufacturing overview, Order fulfilment, Production management, Dashboards, Reports hub, and Connected information (Production, Quality, Stores and Planning linked through Synax). |
| 8 | Business transformation | The same floor in clean light, then the inspector measuring 25.40 into the OK bin. |
| 9 | Brand reveal | "FROM MANUAL CHAOS TO MANUFACTURING CONTROL." and "Synax ERP – Smarter Manufacturing. Complete Operational Visibility." |

**Cast** (one rig, the same outfits throughout):

- **Production Manager:** male, the main character; white hard hat, navy vest, phone, tablet.
- **Production Supervisor:** grey hard hat, grey vest.
- **Machine Operator:** female; blue hard hat, safety glasses, navy coverall, walkie-talkie.
- **Quality Inspector:** female; lab coat, safety glasses, tray of rejected parts.
- **Inventory Employee:** female; slate shirt, clipboard of stock records.
- **Production Planner:** female; navy blazer, glasses, printed schedule.
- **Others:** the clerk in the flashback and background workers.

**Voices.** Edge offers only three Indian-English neural voices (Prabhat, Neerja, Neerja Expressive), so the roles are
cast from them with different pitch and pace:

- **Narrator:** Prabhat, deeper and calm.
- **Production Manager:** Prabhat, urgent.
- **Production Supervisor:** Prabhat, higher and fast.
- **Machine Operator:** Neerja Expressive.
- **Quality Inspector:** Neerja.
- **Inventory Employee:** Neerja, lower.
- **Production Planner:** Neerja Expressive, higher.

The dialogue is the brief's own text. Some lines overlap slightly in the argument scenes.

**Length.** The brief asks for 120 s, but its dialogue alone runs about 70 s even at an urgent pace (the brief allows
48 s for those scenes). With the narration and the silent opening, the film is 2 min 26 s.

**Claims.** The panels show only the capabilities the brief lists: manufacturing overview, order fulfilment, production
management, dashboards, reports hub and connected information. All values are demo data. There is no automatic quality
inspection, no predictive maintenance and no automatic error prevention.

## Rebuild

In a scratch folder with `playwright` (Chromium), `ffmpeg-static`, `@fontsource/inter` and `msedge-tts` (path in `TTS_DIR`),
copy these files and `assets/synax-pro-light.webp` (from `public/images`), then:

```
node icons.mjs && node gen_audio.mjs && node build.js && node meta.js && node check.js && node sound.js
node render.js 0 4 & node render.js 1 4 & node render.js 2 4 & node render.js 3 4
node encode.js
```

Regenerate the voices with a licensed voice service before launch.
