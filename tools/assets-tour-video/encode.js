const { spawnSync } = require("child_process");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const OUT = "C:/Projects/synax-landing/public/videos/";
fs.mkdirSync(OUT, { recursive: true });

function run(args) {
  const r = spawnSync(ffmpeg, args, { encoding: "utf8" });
  if (r.status !== 0) {
    console.log(r.stderr.slice(-1200));
    process.exit(1);
  }
}

// 1080p master (for sharing): frames + the final mix (voice, sound design). No subtitles are drawn or embedded.
run(["-y", "-framerate", "30", "-i", "frames/f%05d.jpg", "-i", "audio_final.wav", "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-sn", "-movflags", "+faststart", "-shortest", "assets-tour-1080p.mp4"]);
console.log("1080p done", Math.round(fs.statSync("assets-tour-1080p.mp4").size / 1024), "KB");

// 720p for the website
run(["-y", "-i", "assets-tour-1080p.mp4", "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-sn", "-movflags", "+faststart", OUT + "assets-tour-v2.mp4"]);
console.log("720p done", Math.round(fs.statSync(OUT + "assets-tour-v2.mp4").size / 1024), "KB");

// poster: the title frame of the intro
run(["-y", "-ss", "2.1", "-i", "assets-tour-1080p.mp4", "-frames:v", "1", "-vf", "scale=1280:720", "-c:v", "libwebp", "-quality", "80", OUT + "assets-tour-v2-poster.webp"]);
console.log("poster done");
