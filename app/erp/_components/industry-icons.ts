import { Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PRODUCT_DATA } from "../_data/products";
import type { IndustryPage } from "../_data/industries";

/** Icon per industry page (a fixed table, so components can use it without creating components during render). */
export const INDUSTRY_ICON: Record<IndustryPage["icon"], LucideIcon> = {
  precision: PRODUCT_DATA.precision.icon,
  it: PRODUCT_DATA.it.icon,
  hrms: PRODUCT_DATA.hrms.icon,
  staffing: PRODUCT_DATA.staffing.icon,
  shopfloor: PRODUCT_DATA.shopfloor.icon,
  ai: PRODUCT_DATA.ai.icon,
  aerospace: PRODUCT_DATA.aerospace.icon,
  layers: Layers,
};
