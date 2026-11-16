// Builds demo.html from demo.tpl.html (+ icons, narration durations and word timings).
const fs = require("fs");
let h = fs.readFileSync("demo.tpl.html", "utf8");
const rd = (f) => fs.readFileSync(f, "utf8");
h = h.replace("/*ICONS*/", rd("icons.json")).replace("/*DUR*/", rd("durations.json")).replace("/*WORDS*/", rd("words.json"));
fs.writeFileSync("demo.html", h);
console.log("built", h.length);
