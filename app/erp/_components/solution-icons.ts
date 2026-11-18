import { CircleDot, Cog, Drill, Fuel, HardHat, Laptop, Plane, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SolutionKey } from "../_data/solutions";

/** Icon per solution (a fixed table, so components can use it without creating components during render). */
export const SOLUTION_ICON: Record<SolutionKey, LucideIcon> = {
  aerospace: Plane,
  energy: Fuel,
  machinery: Cog,
  services: Laptop,
  precision: Drill,
  rubber: CircleDot,
  workforce: HardHat,
  staffing: Users,
};

/** Short names for chips and small buttons. */
export const SOLUTION_SHORT: Record<SolutionKey, string> = {
  aerospace: "Aerospace",
  energy: "Oil & Gas",
  machinery: "Machinery",
  services: "IT services",
  precision: "Precision",
  rubber: "Rubber",
  workforce: "Workforce",
  staffing: "Staffing",
};
