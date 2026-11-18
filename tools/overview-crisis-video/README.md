# Synax overview film: "Running Out of Hands" (source)

Source for `public/videos/synax-overview-crisis-v2.mp4` (720p, the home page's **Watch overview**, the "Synax Platform
Overview" tour) and the 1080p master `video-exports/synax-overview-crisis-v2-1080p.mp4` (git-ignored). It replaces the
Pip & Sage bird video (`synax-overview.mp4`, source `tools/video-kit/videos/overview/`), which stays in `public/videos`
unused. It uses the same cinematic 2.5D technique as the manufacturing films (`tools/mfg-crisis-video/`,
`tools/mfg-crisis2-video/`): layered sets, a parallax camera with depth of field, and lighting overlays. It is not
photoreal 3D, and it has no subtitles. The content follows the earlier overview video (its coverage matrix) and the
portal's own wording; no automation is invented.

## Story (2 min 27 s)

| Part | What happens |
| --- | --- |
| The pain (0:00–1:15) | **8:55, the founder's glass office**: the phone buzzes on the desk and notifications stack up ("12 unread", "Machine 4: alarm", "Client: escalation"). The founder answers: "Okay. Talk to me." Then every department calls in turn, with a role tag each:<br>• **Project Manager**: margin unknown, three sheets.<br>• **Staffing Lead**: three Java developers by Monday, candidates in email.<br>• **HR Manager**: attendance and leave wrong, a new joiner tomorrow.<br>• **Production Manager**, on the factory floor under a red light: machine 4 stopped, nobody knows why.<br>• **Quality Inspector**: the lot can't be traced.<br>• **Finance Head**: can't bill.<br>• **IT & Admin**: who has the new hire's laptop?<br>Papers pile up on the founder's desk. He says: "Every team is working hard. So why are we always behind?" Five sheets float past with five different numbers for the same order, followed by cutaways: the missed delivery, the escalation email, the stopped machine, a candidate who withdrew, an invoice not raised. |
| The cause (1:15–1:30) | Six departments become islands, each with "its own sheet", and the links between them break. The narrator: nothing is connected, and every problem lands on the founder's desk. |
| Synax (1:30–2:45) | A blue ripple, then the Synax hub with nine modules on a ring. For each caller there is a red "before" flash with their problem in a few words, then the person, relaxed, beside a "With Synax" panel that fills in on the narrator's words:<br>• **Projects**: Work Tracker, Cost Mapper, Billing, Project analytics.<br>• **Staffing**: requirement → candidates → interviews → offers → deployed, then timesheets → invoices → payments.<br>• **HRMS**: one employee record, from the manpower request to exit.<br>• **Manufacturing**: customer PO → material → route card → schedule, plus Live monitoring and Downtime.<br>• **Quality**: inspection, NCR and CAPA, and genealogy back to order, lot, machine and operator.<br>• **Finance & Assets**: invoice, debit and credit notes, a laptop assigned to a person, access control.<br>Then **Synax AI** on navy: a question, the answer (3 overdue challans), and an agent's proposal that the founder approves ("recorded"). Agents only propose. |
| Control (2:45–2:59) | The same office in clean light: the founder leans back. "Less juggling. More visibility. Better control." End card: "FROM DISCONNECTED TEAMS TO ONE CONNECTED BUSINESS." and "Synax ERP – One Platform. Connected Business." |

**Cast** (one rig, the same outfits throughout):

- **Founder / MD:** the main character; navy blazer, light-blue shirt.
- **Project Manager:** blue cardigan, glasses.
- **Staffing Lead:** light-blue shirt, phone.
- **HR Manager:** grey blazer.
- **Production Manager:** white hard hat, navy vest.
- **Quality Inspector:** lab coat, safety glasses.
- **Finance Head:** dark blazer, glasses.
- **IT & Admin:** slate shirt.

All names and numbers are fictional and international. No money amounts are shown.

**Voices (v2).** A mixed Indian, UK and US cast, each role with its own voice, delivered with more energy (faster
and a little brighter):

- **Narrator:** `en-GB-RyanNeural` (UK).
- **Founder:** `en-IN-PrabhatNeural`.
- **Project Manager:** `en-US-AvaNeural`.
- **Staffing Lead:** `en-GB-ThomasNeural`.
- **HR Manager:** `en-IN-NeerjaNeural`.
- **Production Manager:** `en-US-GuyNeural`.
- **Quality Inspector:** `en-GB-SoniaNeural`.
- **Finance Head:** `en-US-EmmaNeural`.
- **IT & Admin:** `en-US-BrianNeural`.

**v2 enhancements:**

- **Pacing:** tighter, with the calls overlapping (2:59 became 2:27).
- **Whip pans:** cuts in the crisis whip in with a motion blur and a whip sound.
- **Role tags:** raised above the bottom third and bolder (navy with an orange bar, 36 px).
- **Title cards:** four kinetic titles ("8:55 AM · Monday", "Nothing is connected.", "Meet Synax ERP", "Back in control.").
- **Solution panels:** numbers count up, each row's progress bar fills, a data dot runs along each flow, and a green
  "Solved" stamp with a ring burst appears when a problem is solved.
- **Score:** a driving tension pulse that speeds up under the calls, then an upbeat 120 BPM theme after the reveal,
  with bigger hits on the cuts.

## Files

`art.js` (the manufacturing films' rig and sets, plus the founder's office, a department desk with props per role, and the
cast), `director.js` (timeline from the word timings, shots, overlays, panels, sound cues), `demo.tpl.html`,
`gen_audio.mjs`, `sound.js`, `check.js` (layout checks without screenshots), `meta.js`, `render.js`, `encode.js`,
`icons.mjs`.

## Rebuild

In a scratch folder with `playwright`, `ffmpeg-static`, `@fontsource/inter` and `msedge-tts` (path in `TTS_DIR`), copy
these files and `assets/synax-pro-light.webp`, then:

```
node icons.mjs && node gen_audio.mjs && node build.js && node meta.js && node check.js && node sound.js
node render.js 0 4 & node render.js 1 4 & node render.js 2 4 & node render.js 3 4
node encode.js
```

Run the render a second time if a worker stopped on a timeout; it fills in only the missing frames.
