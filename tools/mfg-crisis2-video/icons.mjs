import { createRequire } from "module";
const req = createRequire("C:/Projects/synax-landing/package.json");
const React = req("react");
const { renderToStaticMarkup } = req("react-dom/server");
const L = req("lucide-react");
const names = ["Phone","Factory","SearchCheck","Boxes","CirclePause","PackageX","CalendarX","Sheet","Files","PhoneCall","Unlink","Cog","ClipboardList","PackageCheck","Users","Wrench","ChartColumn","LayoutDashboard","FileChartColumn","FileText","Network","Clock","Truck","CircleCheck","ListChecks"];
const out = {};
for (const n of names) {
  if (!L[n]) { console.log("missing", n); continue; }
  const html = renderToStaticMarkup(React.createElement(L[n], { size: 24, strokeWidth: 2 }));
  out[n] = html.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
}
import fs from "fs";
fs.writeFileSync("icons.json", JSON.stringify(out));
console.log(Object.keys(out).length, "icons");
