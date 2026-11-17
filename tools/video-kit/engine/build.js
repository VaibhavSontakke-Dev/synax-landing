// Builds demo.html in the work folder: the shared template + this video's styles, end card, icons, timings and lines.
// Run by make.mjs (cwd = work/<video>, which already holds the video's files).
const fs = require("fs");
const path = require("path");
const video = JSON.parse(fs.readFileSync("video.json", "utf8"));
const style = fs.existsSync("style.css") ? fs.readFileSync("style.css", "utf8") : "";
const e = video.end || {};
const end = `<h2>${e.title || ""}</h2><p>${e.text || ""}</p><div class="cta">${e.cta || "Book a demo"}</div>`;
let h = fs.readFileSync(path.join(__dirname, "demo.tpl.html"), "utf8");
h = h
  .replace("/*STYLE*/", () => style)
  .replace("/*END*/", () => end)
  .replace("/*ICONS*/", () => fs.readFileSync("icons.json", "utf8"))
  .replace("/*DUR*/", () => fs.readFileSync("durations.json", "utf8"))
  .replace("/*WORDS*/", () => fs.readFileSync("words.json", "utf8"))
  .replace("/*LINES*/", () => fs.readFileSync("lines.json", "utf8"));
fs.writeFileSync("demo.html", h);
console.log("built", h.length);
