const fs = require("fs");
let h = fs.readFileSync("demo.tpl.html", "utf8");
h = h.replace("/*ICONS*/", fs.readFileSync("icons.json", "utf8")).replace("/*DUR*/", fs.readFileSync("durations.json", "utf8"));
fs.writeFileSync("demo.html", h);
console.log("built", h.length);
