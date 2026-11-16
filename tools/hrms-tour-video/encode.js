const { spawnSync } = require("child_process");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const WEB = "C:/Projects/synax-landing/public/videos/";
const MASTER = "C:/Projects/synax-landing/video-exports/";
fs.mkdirSync(WEB, { recursive: true });
fs.mkdirSync(MASTER, { recursive: true });
function run(args) {
  const r = spawnSync(ffmpeg, args, { encoding: "utf8" });
  if (r.status !== 0) {
    console.log(r.stderr.slice(-1500));
    process.exit(1);
  }
}
// 1080p master (Full HD, 16:9): frames + the final mix (voice, ambience, sound design). No subtitles are drawn or embedded.
run(["-y", "-framerate", "30", "-i", "frames/f%05d.jpg", "-i", "audio_final.wav", "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-sn", "-movflags", "+faststart", "-shortest", "hrms-tour-1080p.mp4"]);
fs.copyFileSync("hrms-tour-1080p.mp4", MASTER + "synax-hrms-tour-1080p.mp4");
console.log("1080p", Math.round(fs.statSync("hrms-tour-1080p.mp4").size / 1048576), "MB");
// 720p for the website
run(["-y", "-i", "hrms-tour-1080p.mp4", "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-sn", "-movflags", "+faststart", WEB + "hrms-tour.mp4"]);
console.log("720p", Math.round(fs.statSync(WEB + "hrms-tour.mp4").size / 1048576), "MB");
run(["-y", "-ss", "2.1", "-i", "hrms-tour-1080p.mp4", "-frames:v", "1", "-vf", "scale=1280:720", "-c:v", "libwebp", "-quality", "80", WEB + "hrms-tour-poster.webp"]);
console.log("poster done");
