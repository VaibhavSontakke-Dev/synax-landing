// MP4s and poster. 720p + poster -> the site's public/videos/<name>; 1080p master -> video-exports/ (git-ignored).
// Name and master file come from video.json. Run by make.mjs (cwd = work/<video>).
const { spawnSync } = require("child_process");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const path = require("path");
const REPO = process.env.REPO || path.resolve(__dirname, "../../..");
const video = JSON.parse(fs.readFileSync("video.json", "utf8"));
const OUT = REPO + "/public/videos/";
const MASTER = REPO + "/video-exports/" + video.master;
const NAME = video.name;
const meta = JSON.parse(fs.readFileSync("meta.json", "utf8"));
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(REPO + "/video-exports", { recursive: true });
function run(args) {
  const r = spawnSync(ffmpeg, args, { encoding: "utf8" });
  if (r.status !== 0) {
    console.log(r.stderr.slice(-1500));
    process.exit(1);
  }
}
// Draft: half-size frames + mix -> work/<video>/draft.mp4 only (nothing published)
if (process.env.DRAFT) {
  run(["-y", "-framerate", "30", "-i", "frames_draft/f%05d.jpg", "-i", "audio_final.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-shortest", "draft.mp4"]);
  console.log("draft", require("path").resolve("draft.mp4"), Math.round(fs.statSync("draft.mp4").size / 1024), "KB");
  process.exit(0);
}
// 1080p master: frames + final mix. No subtitles are drawn or embedded.
run(["-y", "-framerate", "30", "-i", "frames/f%05d.jpg", "-i", "audio_final.wav", "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-sn", "-movflags", "+faststart", "-shortest", MASTER]);
console.log("1080p", Math.round(fs.statSync(MASTER).size / 1024), "KB");
// 720p web version
run(["-y", "-i", MASTER, "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-sn", "-movflags", "+faststart", OUT + NAME + ".mp4"]);
console.log("720p", Math.round(fs.statSync(OUT + NAME + ".mp4").size / 1024), "KB");
// poster: the frame at meta.poster (set by the director)
run(["-y", "-ss", meta.poster.toFixed(2), "-i", MASTER, "-frames:v", "1", "-vf", "scale=1280:720", "-c:v", "libwebp", "-quality", "82", OUT + NAME + "-poster.webp"]);
console.log("poster done");
