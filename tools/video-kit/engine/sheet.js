// Contact sheets from snaps/*.jpg: 3x3 grids at 640x360 per cell -> snaps/sheet_N.jpg
const { spawnSync } = require("child_process");
const fs = require("fs");
const ff = require("ffmpeg-static");
const files = fs.readdirSync((process.env.SNAPS || "snaps")).filter((f) => /^t\d/.test(f)).sort();
for (let s = 0; s * 9 < files.length; s++) {
  const part = files.slice(s * 9, s * 9 + 9);
  const args = ["-y"];
  part.forEach((f) => args.push("-i", (process.env.SNAPS || "snaps") + "/" + f));
  const n = part.length;
  const f = part.map((p, i) => `[${i}:v]scale=640:360,drawtext=text='${p.slice(1, 7)}':x=8:y=8:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.6[v${i}]`).join(";");
  const lay = part.map((_, i) => `${(i % 3) * 640}_${Math.floor(i / 3) * 360}`).join("|");
  args.push("-filter_complex", `${f};${part.map((_, i) => `[v${i}]`).join("")}xstack=inputs=${n}:layout=${lay}:fill=black[o]`, "-map", "[o]", "-frames:v", "1", "-update", "1", `${process.env.SNAPS || "snaps"}/sheet_${s}.jpg`);
  const r = spawnSync(ff, args, { encoding: "utf8" });
  if (r.status) console.log(r.stderr.slice(-600));
  else console.log((process.env.SNAPS || "snaps") + "/sheet_" + s + ".jpg");
}
