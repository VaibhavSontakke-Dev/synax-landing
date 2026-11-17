# Synax video kit

One shared engine for the animated product videos with the two Synax birds, Pip and Sage. Each video keeps only its own
story; everything else is shared. Nothing here is part of the website build: the site only plays the finished files in
`public/videos/`.

```
tools/video-kit/
  make.mjs              one command for every step (see below)
  package.json          the kit's own tools: playwright, ffmpeg-static, msedge-tts 2.1.0, @fontsource/inter
  engine/               shared by every video
    birds.js            the two rigged birds (fly, walk, point, wave, moods, speech)
    demo.tpl.html       stage, backgrounds, cards, app window and end-card styles
    gen_audio.mjs       narration (two voices) and word timings
    build.js meta.js    page build and timeline export
    check.js            layout checks every 0.5 s (text overflow, cards overlapping, off screen)
    snap.js sheet.js    preview stills and contact sheets
    sound.js            music bed, sound effects, voice ducking, loudness to -16 LUFS
    render.js encode.js frame capture (multi-worker) and the MP4s and poster
    icons.mjs           Lucide icons from the site's own lucide-react
  videos/<video>/       one folder per video: only the story
    video.json          output name, master file name, end-card text, music level per scene
    lines.json          the dialogue
    director.js         the scenes, each cue anchored to a spoken word
    style.css           optional extra styles for this video's scenes
    README.md           story, sources and claims
    words.json durations.json icons.json   generated, kept so a rebuild needs no new narration
  work/<video>/         generated (demo.html, audio, frames, mixes, draft.mp4). Git-ignored, safe to delete.
```

## First time on a machine

```
cd tools/video-kit
npm install
```

Playwright drives the installed Microsoft Edge (`PW_CHANNEL`, default `msedge`); no browser download is needed.

## Commands (run in tools/video-kit)

| Command | What it does | Time (4 workers, this laptop) |
| --- | --- | --- |
| `node make.mjs list` | Lists the videos. | instant |
| `node make.mjs new <name> --from manufacturing-erp` | Starts a new video by copying an existing one's story files. | instant |
| `node make.mjs <video> audio` | Icons, narration and word timings, then build, timeline and layout check. Run after changing `lines.json`. | about 1 min |
| `node make.mjs <video> preview` | Build, timeline and layout check. | under 1 min |
| `node make.mjs <video> snap 12 40.5 90` | Half-size stills at those seconds and a contact sheet, in `work/<video>/snaps/`. | seconds |
| `node make.mjs <video> draft [workers]` | Whole video at 960×540 into `work/<video>/draft.mp4`. Nothing is published. | see below |
| `node make.mjs <video> final [workers]` | 1920×1080 frames, mix and encode: writes `public/videos/<name>.mp4`, its poster and the master in `video-exports/`. | the slow step |

Add `--resume` to `draft` or `final` only to continue an interrupted render of the same version; otherwise old frames are
cleared so a changed scene is never mixed with stale frames.

The site caches `/videos/*` for a week, so when a published video changes, give it a new `name` in `video.json` (for
example `-v2`) and point `app/erp/_data/tours.ts` at it.

## Making a new video, cheaply

1. `node make.mjs new <name> --from <closest video>`.
2. Write `lines.json` (the script) and `video.json` (name, end card, music per scene name).
3. Rewrite the scenes in `director.js`. Most of the work, and of the tokens if Claude writes it, is here. Reuse the
   helpers already in the existing directors (the app window with the portal sidebar `makeWin`, card headers `head`,
   scene titles `title`, problem cards and chips, the part-journey strip, the AI bot) instead of drawing from scratch.
4. `audio`, then `snap` at a few moments, then `draft`, and `final` only once the draft is approved.

A short brief is enough: the page link, the story order (for example problem, solution, AI), the length, and which
existing video to start from.

## Replacing the voices before launch

The voices come from the unofficial Edge text-to-speech client, as placeholders. To use licensed voices (for example
Azure AI Speech with the same voice names), either change the client in `engine/gen_audio.mjs`, or put recorded files at
`work/<video>/audio/<line id>.mp3` with matching `words.json` timings. Each animation re-times itself to the new audio.
A video can also override a voice in `video.json`: `"voices": { "P": { "name": "...", "rate": "+0%", "pitch": "+0Hz" } }`.
