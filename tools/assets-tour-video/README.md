# Assets module tour video (source)

Source for `public/videos/assets-tour-v2.mp4`. The video is not a screen recording: the Assets screens are re-created in
`demo.tpl.html` from screenshots, and `director.js` draws the whole video (premium intro, cursor, typing, dropdown, clicks,
zoom, highlights) as a pure function of time, `apply(t)`. Every action is timed from the narration's word timings
(`words.json`). `render.js` captures it frame by frame (30 fps) with Playwright, `gen_audio.mjs` makes the narration
(Microsoft Edge neural voice en-IN-Neerja, via `msedge-tts`) and the word timings, `meta.js` exports the click and scene
times, `sound.js` synthesises the sound design in ffmpeg (launch sound, soft ambience that ducks under the voice, UI ticks,
success and end chimes) and mixes it with the voice, and `encode.js` produces the MP4s and the poster. No subtitles are
drawn or embedded.

To rebuild: install `playwright` (with Chromium), `ffmpeg-static`, `msedge-tts` and `@fontsource/inter` in a scratch folder,
copy these files and `assets/synax-pro-light.webp` there, fix the absolute paths at the top of `gen_audio.mjs`, `encode.js`
and `icons.mjs`, then: `node icons.mjs && node gen_audio.mjs && node build.js && node meta.js && node sound.js`, render with
`node render.js 0 3 & node render.js 1 3 & node render.js 2 3` (three workers), then `node encode.js`.
All names and values in the video are demo data. Regenerate the narration with a licensed voice service before launch.
