import { createRequire } from "module";
import fs from "fs";
const req = createRequire("C:/Projects/synax-landing/package.json");
const React = req("react");
const { renderToStaticMarkup } = req("react-dom/server");
const L = req("lucide-react");
const names = ["House","Timer","FolderKanban","Database","Users","UserCog","Factory","Box","MessageCircle","CalendarDays","ChartColumn","LayoutDashboard","FileChartColumn","Sparkles","PackageCheck","Route","ClipboardList","Activity","TriangleAlert","ShoppingCart","ClipboardCheck","Truck","Building2","Wallet","Receipt","Wrench","Layers","ShieldCheck","Warehouse","UserRoundCheck","CalendarCheck","Banknote","UserRoundSearch","TrendingUp","Bell","Search","ChevronDown","Gauge","Cpu","CircleCheck","Clock","Handshake","FileText","Settings"];
const out = {};
for (const n of names) { if (!L[n]) { console.log("missing", n); continue; } out[n] = renderToStaticMarkup(React.createElement(L[n], { size: 24, strokeWidth: 2 })).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, ""); }
fs.writeFileSync("icons.json", JSON.stringify(out));
console.log(Object.keys(out).length, "icons");
