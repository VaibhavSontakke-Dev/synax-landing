const { spawnSync } = require("child_process");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const OUT = "C:/Projects/synax-landing/public/videos/";
const MASTER = "C:/Projects/synax-landing/video-exports/synax-hrms-explainer-1080p.mp4";
const meta = JSON.parse(fs.readFileSync("meta.json", "utf8"));
fs.mkdirSync(OUT, { recursive: true });

function run(args) {
  const r = spawnSync(ffmpeg, args, { encoding: "utf8" });
  if (r.status !== 0) {
    console.log(r.stderr.slice(-1200));
    process.exit(1);
  }
}

// 1080p master (for sharing): frames + the final mix (voice, sound design). No subtitles are drawn or embedded.
run(["-y", "-framerate", "30", "-i", "frames/f%05d.jpg", "-i", "audio_final.wav", "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-sn", "-movflags", "+faststart", "-shortest", MASTER]);
console.log("1080p done", Math.round(fs.statSync(MASTER).size / 1024), "KB");

// 720p for the website (a new file name: /videos is cached for a week)
run(["-y", "-i", MASTER, "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-sn", "-movflags", "+faststart", OUT + "hrms-explainer.mp4"]);
console.log("720p done", Math.round(fs.statSync(OUT + "hrms-explainer.mp4").size / 1024), "KB");

// poster: the organised reveal ("Smarter HR, Happier People.")
run(["-y", "-ss", (meta.reveal.pulse + 0.6).toFixed(2), "-i", MASTER, "-frames:v", "1", "-vf", "scale=1280:720", "-c:v", "libwebp", "-quality", "80", OUT + "hrms-explainer-poster.webp"]);
console.log("poster done");
