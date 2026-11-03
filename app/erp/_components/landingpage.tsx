"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Cpu,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Lock,
  Zap,
  Layers,
  X,
  ChevronDown,
  Menu,
  Award,
  Sparkles,
  Check,
  ChevronLeft,
  Server,
  Activity,
  FileCheck,
  UserCheck,
  Calendar,
  Clock,
  Briefcase,
  ArrowUpRight,
  Shield,
  Factory,
  Gauge,
  Workflow,
  Target,
  Settings,
  AlertCircle,
  TrendingUp,
  Plane,
  Play,
  CheckCircle,
  MessageSquare,
  Bot,
  Send,
} from "lucide-react";

/* =========================================================================
   TYPE DEFINITIONS
   ========================================================================= */

export type PageView = "home" | "precision" | "aerospace" | "staffing" | "hrms";

export interface ModuleGroup {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export interface ModuleSection {
  kicker: string;
  subtitle: string;
  groups: ModuleGroup[];
}

export interface ProductMeta {
  id: PageView;
  title: string;
  badge: string;
  subtitle: string;
  accentColor: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  icon: React.ElementType;
  description: string;
  heroStat: { label: string; value: string };
  highlights: string[];
  moduleSection?: ModuleSection;
  capabilities: {
    title: string;
    description: string;
    metric?: string;
  }[];
}

export interface FormDataState {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  product: string;
  floorSize: string;
  message: string;
}

/* =========================================================================
   PRODUCT DATA CONFIGURATION (4 FLAGSHIP ENTERPRISE MODULES)
   ========================================================================= */

const PRODUCT_DATA: Record<Exclude<PageView, "home">, ProductMeta> = {
  precision: {
    id: "precision",
    title: "Synax ERP — Precision Manufacturing",
    badge: "CNC IoT & Shop Floor Dispatch",
    subtitle: "Real-time Machine Telemetry, Tool Life Cycle & Dynamic Capacity Loading",
    accentColor: "emerald",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-600",
    accentBorder: "border-emerald-200",
    icon: Factory,
    description:
      "Purpose-built for high-mix CNC machine shops, multi-axis machining facilities, and precision tooling operations. Unify live spindle telemetry, real-time OEE optimization, predictive tool wear alerts, and dynamic capacity scheduling into a single pane of glass.",
    heroStat: { label: "CNC OEE Benchmark", value: "94.8%" },
    highlights: [
      "Direct CNC Machine IoT Integration (Fanuc, Siemens, Heidenhain, Mazatrol)",
      "Real-time Spindle RPM, Feed Rate & Dynamic Workstation Dispatch",
      "Predictive Cutting Tool Wear Tracking & Automated Pre-set Offsets",
      "Job Traveler Barcoding with Live Stage-by-Stage Scrap Analysis",
    ],
    moduleSection: {
      kicker: "Manufacturing",
      subtitle: "Planning, material, and quality workflows",
      groups: [
        {
          id: "planning-execution",
          title: "Planning & Execution",
          description:
            "Plan jobs and execute production with live operator and machine coordination.",
          items: [
            "Machine Loading Plan Board",
            "Operator Panel & Login",
            "Job Scheduling Calendar",
            "Job Schedule List",
            "Execution Reports",
          ],
        },
        {
          id: "material-procurement",
          title: "Material & Procurement",
          description:
            "Control material flow from entry to stock-out with traceable procurement.",
          items: [
            "Material Entry Audit",
            "Material History",
            "Stock Out Management",
            "Vendor PO & Internal PO",
            "Bill of Materials",
          ],
        },
        {
          id: "quality-compliance",
          title: "Quality & Compliance",
          description:
            "Structured quality workflows for audits, traceability, and corrective actions.",
          items: [
            "NCR / CAPA",
            "FAIR Manager",
            "Calibration Dashboard",
            "Genealogy Trace",
            "Dispatch Release Controls",
          ],
        },
      ],
    },
    capabilities: [
      {
        title: "Dynamic Capacity & Machine Loading",
        description:
          "Automatically balance queue times across 3-axis, 5-axis, and EDM cells based on cycle times and operator skill matrix.",
        metric: "+32% Floor Velocity",
      },
      {
        title: "Predictive Tool Wear & Life Management",
        description:
          "Track cutting hours per insert and endmill. Prevent catastrophic tool breakage with automated tool swap alerts.",
        metric: "0.08% Part Scrap",
      },
      {
        title: "Live Shop Floor Kiosk Dispatch",
        description:
          "Paperless digital travelers with live step sign-offs, drawing revisions, and CAD/CAM setup sheets directly at the machine console.",
        metric: "100% Paperless Floor",
      },
      {
        title: "Raw Metal & Billet Inventory Tracking",
        description:
          "Trace every bar stock, billet, and plate back to its mill heat cert with precise remnant nesting and scrap salvage.",
        metric: "Full Lot Genealogy",
      },
      {
        title: "Automated Operator Shift Timecards",
        description:
          "Connect job cycle start/stop times directly to operator timecards for accurate actual-vs-standard labor cost accounting.",
        metric: "Accurate Job Costing",
      },
      {
        title: "Preventive Machine Maintenance (TPM)",
        description:
          "Automated maintenance schedules triggered by actual machine run hours, coolant refractometer tests, and spindle vibration sensor limits.",
        metric: "99.4% Uptime",
      },
    ],
  },
  aerospace: {
    id: "aerospace",
    title: "Synax ERP — Aerospace & Defence",
    badge: "AS9100 Rev D • ITAR • NADCAP",
    subtitle: "Zero-Defect Traceability, AS9102 FAIR Generator & Defense Vault",
    accentColor: "blue",
    accentBg: "bg-blue-50",
    accentText: "text-blue-600",
    accentBorder: "border-blue-200",
    icon: ShieldCheck,
    description:
      "Mission-critical enterprise software designed specifically for Tier 1 & Tier 2 aerospace component manufacturers, defense contractors, and flight-critical subassembly suppliers requiring airtight ITAR/EAR compliance and zero-defect QA gates.",
    heroStat: { label: "First Article Accuracy", value: "100%" },
    highlights: [
      "AS9100 Rev D, NADCAP & CMMC Level 2 Compliance Architecture",
      "360° Material Heat Lot, Serial Number & Sub-tier Plating Genealogy",
      "Automated CMM Quality Gateways & Digital AS9102 FAIR Document Builder",
      "Cryptographically Enforced ITAR / EAR Defense Data Vault with RBAC",
    ],
    moduleSection: {
      kicker: "Aerospace & Defence",
      subtitle: "AS9100D, zero-defect traceability, and compliance workflows",
      groups: [
        {
          id: "planning-execution",
          title: "Planning & Execution",
          description:
            "Plan jobs and execute production with live operator and machine coordination.",
          items: [
            "Machine Loading Plan Board",
            "Operator Panel & Login",
            "Job Scheduling Calendar",
            "Job Schedule List",
            "Execution Reports",
          ],
        },
        {
          id: "material-procurement",
          title: "Material & Procurement",
          description:
            "Control material flow from entry to stock-out with traceable procurement.",
          items: [
            "Material Entry Audit",
            "Material History",
            "Stock Out Management",
            "Vendor PO & Internal PO",
            "Bill of Materials",
          ],
        },
        {
          id: "quality-compliance",
          title: "Quality & Compliance",
          description:
            "Structured quality workflows for audits, traceability, and corrective actions.",
          items: [
            "NCR / CAPA",
            "FAIR Manager",
            "Calibration Dashboard",
            "Genealogy Trace",
            "Dispatch Release Controls",
          ],
        },
      ],
    },
    capabilities: [
      {
        title: "Automated AS9102 FAIR Builder",
        description:
          "Generate Form 1, Form 2, and Form 3 First Article Inspection Reports directly from CMM Zeiss/Hexagon measurement feeds.",
        metric: "10x Faster FAIR Release",
      },
      {
        title: "Unbroken Lot & Heat Genealogy",
        description:
          "Single-click backward and forward traceability from raw titanium/inconel ingot mill test reports (MTR) to delivered flight components.",
        metric: "Instant Audit Readiness",
      },
      {
        title: "Integrated NCR & CAPA Gateways",
        description:
          "Hold parts automatically at any machining or inspection stage upon out-of-spec readings. Enforce root cause 8D investigations.",
        metric: "Zero Escaped Defects",
      },
      {
        title: "ITAR / EAR Export Security Vault",
        description:
          "Role-based access control (RBAC) ensuring technical data packages, drawings, and CAD models are isolated to authorized defense personnel only.",
        metric: "CMMC Level 2 Ready",
      },
      {
        title: "Sub-tier Special Process Tracking",
        description:
          "Manage NADCAP certified external processors for heat treating, anodizing, NDT testing, and passivating with certificate verification.",
        metric: "Full Vendor Compliance",
      },
      {
        title: "Gauge & Equipment Calibration Matrix",
        description:
          "Prevent tool usage on the shop floor if micrometer, height gauge, or CMM probe calibration has expired. Fully NIST traceable.",
        metric: "100% Calibrated Tools",
      },
    ],
  },
  hrms: {
    id: "hrms",
    title: "Synax HRMS Platform",
    badge: "Enterprise HCM & Biometric IoT",
    subtitle: "Automated Global Payroll, Biometric Turnstiles & OKR Appraisals",
    accentColor: "sky",
    accentBg: "bg-sky-50",
    accentText: "text-sky-600",
    accentBorder: "border-sky-200",
    icon: Building2,
    description:
      "Modern human capital management engineered for high-precision workforce operations. Bridge the shop floor and corporate offices with biometric turnstile hardware sync, plant shift break-pass monitoring, multi-region automated tax payroll, and continuous OKR evaluations.",
    heroStat: { label: "Payroll Calculation Time", value: "< 60 Sec" },
    highlights: [
      "Real-time Biometric Hardware IoT Sync & Smart Turnstile Gateways",
      "Plant Shift Break-Pass Monitor with Floor Overstay Alerts",
      "1-Click Multi-Tax Automated Payroll & Statutory Compliance Engine",
      "360° OKR Performance Appraisals & Technical Skill Matrix Reviews",
    ],
    moduleSection: {
      kicker: "IT Services",
      subtitle: "Delivery, people, and service workflows",
      groups: [
        {
          id: "project-delivery",
          title: "Project Delivery",
          description:
            "Execution-focused tools for planning, tracking, and delivery visibility.",
          items: [
            "Project List & Project Add",
            "Daily Meetings",
            "Activity Tracker",
            "PM / PC Dashboards",
            "Project Billing Tracker",
          ],
        },
        {
          id: "people-operations",
          title: "People Operations",
          description:
            "Everything needed to run teams, attendance, and payroll operations smoothly.",
          items: [
            "Employee Management",
            "Attendance & OT Approval",
            "Budget Planner",
            "Payroll",
            "Break Pass Management",
          ],
        },
        {
          id: "communication-service",
          title: "Communication & Service",
          description:
            "Collaboration, support, and customer communication modules in one place.",
          items: [
            "Team Chat",
            "Video Calls",
            "Support Tickets",
            "Public Meetings",
            "Company Visitor Management",
          ],
        },
      ],
    },
    capabilities: [
      {
        title: "Biometric Hardware IoT Integration",
        description:
          "Direct plug-and-play sync with ZKTeco, Suprema, and RFID turnstile hardware. Eliminate buddy punching and manual timesheet reconciliation.",
        metric: "99.9% Punch Accuracy",
      },
      {
        title: "Shop Floor Break-Pass Gatekeeper",
        description:
          "Monitor plant operator tea, lunch, and smoke break passes in real time. Maintain optimal safety coverage on active machining lines.",
        metric: "Zero Unplanned Idle Time",
      },
      {
        title: "Automated Multi-Tax Payroll Engine",
        description:
          "Calculate complex shift differentials, overtime, statutory PF/ESI/TDS withholdings, and dispatch digital payslips in under 60 seconds.",
        metric: "100% Tax Compliant",
      },
      {
        title: "Mobile Employee Self-Service (ESS)",
        description:
          "Intuitive mobile and web portal for leave requests, punch regularization, tax investment proofs, and peer appreciation.",
        metric: "4.9/5 Employee Rating",
      },
      {
        title: "Technical Skill Matrix & Certifications",
        description:
          "Track mandatory aerospace welding, CNC programming, and safety certifications. Receive automated alerts 60 days before expiration.",
        metric: "Zero Expired Licenses",
      },
      {
        title: "Continuous 360° OKR Appraisals",
        description:
          "Align individual engineering milestones with plant output targets using objective Key Performance Indicators and peer evaluations.",
        metric: "Data-Driven Bonuses",
      },
    ],
  },
  staffing: {
    id: "staffing",
    title: "Synax IT Staffing VMS",
    badge: "AI Talent Bench & VMS Suite",
    subtitle: "AI Semantic Resume Matching, Bench Utilization & SOW Billing",
    accentColor: "indigo",
    accentBg: "bg-indigo-50",
    accentText: "text-indigo-600",
    accentBorder: "border-indigo-200",
    icon: Users,
    description:
      "Accelerate IT talent supply chains and contingent workforce management. Empower recruiting agencies and enterprise staffing organizations with AI candidate matching, real-time bench utilization tracking, multi-vendor VMS workflows, and automated contractor billing.",
    heroStat: { label: "Avg Time-to-Placement", value: "3.8 Days" },
    highlights: [
      "AI Semantic Resume Parser & Technical Code Benchmark Evaluator",
      "Real-time Candidate Bench Utilization & Re-deployment Dashboard",
      "Enterprise Vendor Management System (VMS) with Tiered Supplier SLAs",
      "Automated Client Timecard Approvals & Multi-Currency SOW Invoicing",
    ],
    moduleSection: {
      kicker: "IT Services",
      subtitle: "Delivery, people, and service workflows",
      groups: [
        {
          id: "project-delivery",
          title: "Project Delivery",
          description:
            "Execution-focused tools for planning, tracking, and delivery visibility.",
          items: [
            "Project List & Project Add",
            "Daily Meetings",
            "Activity Tracker",
            "PM / PC Dashboards",
            "Project Billing Tracker",
          ],
        },
        {
          id: "people-operations",
          title: "People Operations",
          description:
            "Everything needed to run teams, attendance, and payroll operations smoothly.",
          items: [
            "Employee Management",
            "Attendance & OT Approval",
            "Budget Planner",
            "Payroll",
            "Break Pass Management",
          ],
        },
        {
          id: "communication-service",
          title: "Communication & Service",
          description:
            "Collaboration, support, and customer communication modules in one place.",
          items: [
            "Team Chat",
            "Video Calls",
            "Support Tickets",
            "Public Meetings",
            "Company Visitor Management",
          ],
        },
      ],
    },
    capabilities: [
      {
        title: "AI Semantic Match & Skill Graph",
        description:
          "Parse technical resumes instantly, mapping candidate capabilities, frameworks, and domain expertise against open client requisitions.",
        metric: "98.4% Match Accuracy",
      },
      {
        title: "Bench Utilization & Allocation Hub",
        description:
          "Keep high-cost technical resources continuously billable. Predict project roll-offs 30 days in advance to pre-book future client SOWs.",
        metric: "+28% Bench Profitability",
      },
      {
        title: "End-to-End Vendor Management (VMS)",
        description:
          "Manage tier-1, tier-2 staffing agency partners with automated candidate submission portals, rate card compliance, and interview tracking.",
        metric: "18+ Partners Synced",
      },
      {
        title: "Automated SOW Timesheet Approvals",
        description:
          "Collect weekly contractor hours, route for dual manager approval, and generate client-ready invoices with zero accounting friction.",
        metric: "100% Billing Accuracy",
      },
      {
        title: "Candidate Onboarding & Background Checks",
        description:
          "Automate NDA sign-offs, I-9 verification, technical background screening, and client equipment provisioning checklists.",
        metric: "48-Hour Onboarding",
      },
      {
        title: "Gross Margin & Real-Time Analytics",
        description:
          "Monitor bill rates, pay rates, gross margins, and consultant turnover across accounts, projects, and geographic regions.",
        metric: "Transparent Margins",
      },
    ],
  },
};

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function Landingpage() {
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [tourVideoModalOpen, setTourVideoModalOpen] = useState(false);
  const [tourVideoTitle, setTourVideoTitle] = useState<string>("Synax Precision ERP Product Tour");
  const [selectedProduct, setSelectedProduct] = useState<string>(
    "Synax ERP — Precision Manufacturing"
  );

  // Interactive Live Console Preview Tab in Hero
  const [previewTab, setPreviewTab] = useState<Exclude<PageView, "home">>("precision");

  // Console Simulator Interactive States
  const [precisionOee, setPrecisionOee] = useState(94.8);
  const [precisionScrap, setPrecisionScrap] = useState(0.08);
  const [precisionToolLife, setPrecisionToolLife] = useState(86);

  const [aeroFairPassed, setAeroFairPassed] = useState(true);
  const [aeroToleranceOffset, setAeroToleranceOffset] = useState("+0.0012 mm");

  const [hrmsPunches, setHrmsPunches] = useState(428);
  const [hrmsSyncPulse, setHrmsSyncPulse] = useState(false);

  const [staffingMatchScore, setStaffingMatchScore] = useState(98.6);
  const [staffingBenchCount, setStaffingBenchCount] = useState(142);

  // Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    product: "Synax ERP — Precision Manufacturing",
    floorSize: "50 - 250 Employees",
    message: "",
  });

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const openModal = (prodName = "Synax Unified Enterprise Suite") => {
    setSelectedProduct(prodName);
    setFormData((prev) => ({ ...prev, product: prodName }));
    setFormSubmitted(false);
    setDemoModalOpen(true);
  };

  const openTourModal = (title = "Synax Precision ERP Product Tour") => {
    setTourVideoTitle(title);
    setTourVideoModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Interactive Console Simulator Triggers
  const simulatePrecisionOptim = () => {
    setPrecisionOee(96.4);
    setPrecisionScrap(0.05);
    setPrecisionToolLife(98);
  };

  const simulateFairCheck = () => {
    setAeroFairPassed(true);
    setAeroToleranceOffset("+0.0004 mm (Nominal)");
  };

  const simulateBiometricSync = () => {
    setHrmsSyncPulse(true);
    setHrmsPunches((prev) => prev + 1);
    setTimeout(() => setHrmsSyncPulse(false), 1200);
  };

  const simulateAiCandidateMatch = () => {
    setStaffingMatchScore(99.2);
    setStaffingBenchCount(146);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* =========================================================================
         TOP ANNOUNCEMENT BANNER
         ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white text-[11px] py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-blue-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white">
              Enterprise Ecosystem
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              Engineered by Senwell Group for Precision Manufacturing, Aerospace, HRMS & IT Staffing
            </span>
            <span className="text-slate-300 font-medium sm:hidden">
              Senwell Group Enterprise Software Ecosystem
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[10px] shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AS9100 Rev D & ITAR Ready
            </span>
            <a
              href="#senwell"
              className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Senwell Pedigree &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
         HEADER / NAVIGATION
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => setCurrentPage("home")}
            className="cursor-pointer flex items-center group py-1"
          >
            <img
              src="https://synax.senwellgroup.com/assets/logo/synax_logo.png"
              alt="Synax by Senwell"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setCurrentPage("home")}
              className={`transition-colors hover:text-blue-600 ${
                currentPage === "home" ? "text-blue-600 font-bold" : ""
              }`}
            >
              Overview
            </button>

            {/* Products Mega Dropdown */}
            <div className="relative group py-4">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-1">
                Products (4)
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div className="absolute top-full -left-12 w-96 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl p-3 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  Enterprise Solutions (4)
                </div>

                {/* 1. Precision Manufacturing */}
                <button
                  onClick={() => setCurrentPage("precision")}
                  className={`w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group/item ${
                    currentPage === "precision" ? "bg-emerald-50/60" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Factory className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/item:text-emerald-600">
                      Precision Manufacturing ERP
                    </div>
                    <div className="text-[11px] text-slate-500">
                      CNC IoT Telemetry, Tool Life & OEE
                    </div>
                  </div>
                </button>

                {/* 2. Aerospace & Defence */}
                <button
                  onClick={() => setCurrentPage("aerospace")}
                  className={`w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group/item ${
                    currentPage === "aerospace" ? "bg-blue-50/60" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/item:text-blue-600">
                      Aerospace & Defence ERP
                    </div>
                    <div className="text-[11px] text-slate-500">
                      AS9100 Rev D, ITAR Vault & AS9102 FAIRs
                    </div>
                  </div>
                </button>

                {/* 3. HRMS Platform */}
                <button
                  onClick={() => setCurrentPage("hrms")}
                  className={`w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group/item ${
                    currentPage === "hrms" ? "bg-sky-50/60" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/item:text-sky-600">
                      Synax HRMS Platform
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Biometric IoT Sync, Break Passes & Payroll
                    </div>
                  </div>
                </button>

                {/* 4. IT Staffing VMS */}
                <button
                  onClick={() => setCurrentPage("staffing")}
                  className={`w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group/item ${
                    currentPage === "staffing" ? "bg-indigo-50/60" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/item:text-indigo-600">
                      Synax IT Staffing VMS
                    </div>
                    <div className="text-[11px] text-slate-500">
                      AI Talent Bench, SOW Billing & Placement
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Industries Dropdown */}
            <div className="relative group py-4">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-1">
                Industries
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div className="absolute top-full -left-16 w-[410px] bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl p-3 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  Target Industry Sectors
                </div>

                {/* 1. Aerospace & Defence */}
                <button
                  onClick={() => setCurrentPage("aerospace")}
                  className={`w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group/item ${
                    currentPage === "aerospace" ? "bg-blue-50/60" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/item:text-blue-600">
                      Aerospace & Defence
                    </div>
                    <div className="text-[11px] text-slate-500">
                      AS9100 Rev D, ITAR Vault & AS9102 FAIRs
                    </div>
                  </div>
                </button>

                {/* 2. Precision Manufacturing */}
                <button
                  onClick={() => setCurrentPage("precision")}
                  className={`w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group/item ${
                    currentPage === "precision" ? "bg-emerald-50/60" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Factory className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/item:text-emerald-600">
                      Precision CNC Machining & Tooling
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Multi-axis CNC IoT, tool life & capacity dispatch
                    </div>
                  </div>
                </button>

                {/* 3. IT Services & Staffing */}
                <button
                  onClick={() => setCurrentPage("staffing")}
                  className={`w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group/item ${
                    currentPage === "staffing" ? "bg-indigo-50/60" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/item:text-indigo-600">
                      IT Services & Talent Staffing
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Consultant bench, AI matching & SOW timecards
                    </div>
                  </div>
                </button>

                {/* 4. Automotive & Industrial Engineering */}
                <button
                  onClick={() => {
                    setCurrentPage("home");
                    setTimeout(() => {
                      const el = document.getElementById("senwell");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group/item"
                >
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/item:text-amber-600">
                      Automotive & Heavy Industrial
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Multi-plant polymers, stamping & Senwell heritage
                    </div>
                  </div>
                </button>

                {/* 5. Plant Workforce & HCM */}
                <button
                  onClick={() => setCurrentPage("hrms")}
                  className={`w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 group/item ${
                    currentPage === "hrms" ? "bg-sky-50/60" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/item:text-sky-600">
                      Plant Workforce & Multi-Facility HCM
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Biometric turnstile IoT & automated shift payroll
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* <a href="#ecosystem" className="hover:text-blue-600 transition-colors">
              Ecosystem Loop
            </a>
            <a href="#senwell" className="hover:text-blue-600 transition-colors">
              Senwell Group
            </a> */}
            <a href="#solutions" className="hover:text-blue-600 transition-colors">
              Solutions
            </a>
            <a href="#comparison" className="hover:text-blue-600 transition-colors">
              Why Synax
            </a>
            <a href="#security" className="hover:text-blue-600 transition-colors">
              Security & Trust
            </a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => openModal("Product Exploration Call")}
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors"
            >
              Contact Sales
            </button>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
            >
              <span>Schedule Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl">
            <button
              onClick={() => {
                setCurrentPage("home");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-bold text-slate-900 py-1"
            >
              Overview
            </button>

            <div className="pl-3 border-l-2 border-blue-500 space-y-2 py-1">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Enterprise Products
              </div>
              <button
                onClick={() => {
                  setCurrentPage("precision");
                  setMobileMenuOpen(false);
                }}
                className="block text-left text-xs font-semibold text-emerald-600 py-1"
              >
                1. Precision Manufacturing ERP
              </button>
              <button
                onClick={() => {
                  setCurrentPage("aerospace");
                  setMobileMenuOpen(false);
                }}
                className="block text-left text-xs font-semibold text-blue-600 py-1"
              >
                2. Aerospace & Defence ERP
              </button>
              <button
                onClick={() => {
                  setCurrentPage("hrms");
                  setMobileMenuOpen(false);
                }}
                className="block text-left text-xs font-semibold text-sky-600 py-1"
              >
                3. Synax HRMS Platform
              </button>
              <button
                onClick={() => {
                  setCurrentPage("staffing");
                  setMobileMenuOpen(false);
                }}
                className="block text-left text-xs font-semibold text-indigo-600 py-1"
              >
                4. Synax IT Staffing VMS
              </button>
            </div>

            <div className="pl-3 border-l-2 border-emerald-500 space-y-2 py-1">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Industry Sectors
              </div>
              <button
                onClick={() => {
                  setCurrentPage("aerospace");
                  setMobileMenuOpen(false);
                }}
                className="block text-left text-xs font-semibold text-blue-600 py-1"
              >
                Aerospace & Defence
              </button>
              <button
                onClick={() => {
                  setCurrentPage("precision");
                  setMobileMenuOpen(false);
                }}
                className="block text-left text-xs font-semibold text-emerald-600 py-1"
              >
                Precision CNC Machining
              </button>
              <button
                onClick={() => {
                  setCurrentPage("staffing");
                  setMobileMenuOpen(false);
                }}
                className="block text-left text-xs font-semibold text-indigo-600 py-1"
              >
                IT Services & Staffing
              </button>
              <button
                onClick={() => {
                  setCurrentPage("hrms");
                  setMobileMenuOpen(false);
                }}
                className="block text-left text-xs font-semibold text-sky-600 py-1"
              >
                Plant Workforce & HCM
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-700">
              <a
                href="#solutions"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-slate-600 hover:text-blue-600"
              >
                Solutions by Need
              </a>
              <a
                href="#ecosystem"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-slate-600 hover:text-blue-600"
              >
                Connected Ecosystem
              </a>
              <a
                href="#senwell"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-slate-600 hover:text-blue-600"
              >
                Senwell Group Pedigree
              </a>
              <a
                href="#comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-slate-600 hover:text-blue-600"
              >
                Platform Comparison
              </a>
            </div>

            <button
              onClick={() => {
                openModal();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-3 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-md"
            >
              Book Executive Demo
            </button>
          </div>
        )}
      </header>

      {/* =========================================================================
         VIEW ROUTING: 'home' | 'precision' | 'aerospace' | 'hrms' | 'staffing'
         ========================================================================= */}
      {currentPage === "home" && (
        <HomeView
          setCurrentPage={setCurrentPage}
          openModal={openModal}
          previewTab={previewTab}
          setPreviewTab={setPreviewTab}
          // Interactive Console Props
          precisionOee={precisionOee}
          precisionScrap={precisionScrap}
          precisionToolLife={precisionToolLife}
          simulatePrecisionOptim={simulatePrecisionOptim}
          aeroFairPassed={aeroFairPassed}
          aeroToleranceOffset={aeroToleranceOffset}
          simulateFairCheck={simulateFairCheck}
          hrmsPunches={hrmsPunches}
          hrmsSyncPulse={hrmsSyncPulse}
          simulateBiometricSync={simulateBiometricSync}
          staffingMatchScore={staffingMatchScore}
          staffingBenchCount={staffingBenchCount}
          simulateAiCandidateMatch={simulateAiCandidateMatch}
        />
      )}

      {currentPage === "precision" && (
        <ProductDetailView
          meta={PRODUCT_DATA.precision}
          setCurrentPage={setCurrentPage}
          openModal={openModal}
          openTourModal={openTourModal}
        />
      )}

      {currentPage === "aerospace" && (
        <ProductDetailView
          meta={PRODUCT_DATA.aerospace}
          setCurrentPage={setCurrentPage}
          openModal={openModal}
          openTourModal={openTourModal}
        />
      )}

      {currentPage === "hrms" && (
        <ProductDetailView
          meta={PRODUCT_DATA.hrms}
          setCurrentPage={setCurrentPage}
          openModal={openModal}
          openTourModal={openTourModal}
        />
      )}

      {currentPage === "staffing" && (
        <ProductDetailView
          meta={PRODUCT_DATA.staffing}
          setCurrentPage={setCurrentPage}
          openModal={openModal}
          openTourModal={openTourModal}
        />
      )}

      {/* =========================================================================
         GLOBAL SENWELL GROUP FOOTER
         ========================================================================= */}
      <footer className="bg-slate-200 text-slate-400 text-xs py-16 border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
            {/* Col 1: Brand Info */}
            <div className="space-y-4 md:col-span-2">
              <div
                onClick={() => setCurrentPage("home")}
                className="cursor-pointer inline-block"
              >
                <img
                  src="https://synax.senwellgroup.com/assets/logo/synax_logo.png"
                  alt="Synax by Senwell"
                  className="h-8 sm:h-9 w-auto object-contain hover:opacity-90 transition-opacity"
                />
              </div>
              <p className="text-slate-900 text-xs leading-relaxed max-w-sm">
                Industry-focused enterprise software ecosystem architected by{" "}
                <strong className="text-slate-900">Senwell Group</strong>. Delivering
                precision-calibrated cloud platforms for CNC manufacturing, aerospace & defense
                traceability, workforce HRMS intelligence, and IT staffing VMS.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-900 font-mono">
                <span>synax.senwellgroup.com</span>
                <span>•</span>
                <span>Global HQ: Senwell Industrial Park</span>
              </div>
            </div>

            {/* Col 2: The 4 Enterprise Suites */}
            <div>
              <div className="font-bold text-slate-950 mb-4 text-xs uppercase tracking-wider">
                Enterprise Suites (4)
              </div>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setCurrentPage("precision")}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Precision Manufacturing ERP
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage("aerospace")}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    Aerospace & Defence ERP
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage("hrms")}
                    className="hover:text-sky-400 transition-colors text-left"
                  >
                    Synax HRMS Platform
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage("staffing")}
                    className="hover:text-indigo-400 transition-colors text-left"
                  >
                    Synax IT Staffing VMS
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Senwell Group */}
            <div>
              <div className="font-bold text-slate-950 mb-4 text-xs uppercase tracking-wider">
                Senwell Group
              </div>
              <ul className="space-y-2.5">
                <li>
                  <a href="#senwell" className="hover:text-blue-400 transition-colors">
                    Industrial Heritage
                  </a>
                </li>
                <li>
                  <a href="#senwell" className="hover:text-blue-400 transition-colors">
                    Senwell Exports
                  </a>
                </li>
                <li>
                  <a href="#senwell" className="hover:text-blue-400 transition-colors">
                    Stacwell Rubber
                  </a>
                </li>
                <li>
                  <a href="#senwell" className="hover:text-blue-400 transition-colors">
                    Stacem France & Morocco
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Certifications & Security */}
            <div>
              <div className="font-bold text-slate-200 mb-4 text-xs uppercase tracking-wider">
                Security & Standards
              </div>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AS9100 Rev D QMS
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" /> ITAR / EAR Encrypted
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> ISO 9001:2015
                </li>
                <li className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-400" /> CMMC 2.0 Level 2
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 Synax by Senwell Group. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#security" className="hover:text-slate-300 transition-colors">
                Security Architecture
              </a>
              <span>•</span>
              <button
                onClick={() => openModal()}
                className="hover:text-blue-400 transition-colors font-semibold"
              >
                Executive Portal
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
         ENTERPRISE DEMO MODAL
         ========================================================================= */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Consultation Scheduled</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. A dedicated solutions architect
                  from <strong>Senwell Group</strong> will contact you at{" "}
                  <strong>{formData.email}</strong> to prepare a tailored demonstration for{" "}
                  <strong className="text-blue-600">{formData.product}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setDemoModalOpen(false)}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    Return to Platform
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    Senwell Group Architecture Consultation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Request Executive Demo
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect with an industrial systems engineer to evaluate workflows for your
                    organization.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Marcus Vance"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="m.vance@company.com"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Aerospace Machining Ltd."
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 019-2834"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Primary Suite of Interest *
                    </label>
                    <select
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="Synax ERP — Precision Manufacturing">
                        Synax ERP — Precision Manufacturing
                      </option>
                      <option value="Synax ERP — Aerospace & Defence">
                        Synax ERP — Aerospace & Defence
                      </option>
                      <option value="Synax HRMS Platform">Synax HRMS Platform</option>
                      <option value="Synax IT Staffing VMS">Synax IT Staffing VMS</option>
                      <option value="Full Synax Unified Enterprise Suite">
                        Full Synax Unified Enterprise Suite (All 4)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Facility / Headcount Scale
                    </label>
                    <select
                      name="floorSize"
                      value={formData.floorSize}
                      onChange={handleInputChange}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="1 - 50 Employees (1 Plant)">1 - 50 Employees (1 Plant)</option>
                      <option value="50 - 250 Employees (1-3 Plants)">
                        50 - 250 Employees (1-3 Plants)
                      </option>
                      <option value="250 - 1,000 Employees (Multi-facility)">
                        250 - 1,000 Employees (Multi-facility)
                      </option>
                      <option value="1,000+ Enterprise Tier">1,000+ Enterprise Tier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Operational Requirements & Timeline
                    </label>
                    <textarea
                      rows={2}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Notes on current ERP (SAP, JobBOSS, spreadsheets), AS9100 audit target, or CNC machines..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md mt-1 cursor-pointer"
                  >
                    Confirm & Request Architecture Demo
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    Compliant with Senwell Group Enterprise Privacy & ITAR Confidentiality
                    Protocols.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
         PRODUCT TOUR DEMO VIDEO MODAL
         ========================================================================= */}
      {tourVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {tourVideoTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Interactive Walkthrough & Guided Architecture Tour
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTourVideoModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close video tour modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player / Interactive Interactive Tour Showcase */}
            <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden group">
              {/* Animated subtle grid background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#0ea5e9 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                  backgroundPosition: "0 0, 12px 12px",
                }}
              />

              {/* Mock Video Player Screen with UI overlay */}
              <div className="relative z-10 max-w-2xl w-full bg-slate-900/90 rounded-2xl border border-slate-800/80 p-6 sm:p-8 backdrop-blur-sm shadow-2xl space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Product Tour • Guided Architecture Preview
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    Experience {tourVideoTitle} in Action
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
                    Interactive demonstration of core platform modules, live workflows, telemetry feeds, and automated enterprise controls.
                  </p>
                </div>

                {/* Simulated Tour Video Stage / Player Controls */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-left space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      SYSTEM STATUS: ACTIVE PREVIEW
                    </span>
                    <span className="font-mono">1080p 60FPS</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">System Pipeline</div>
                      <div className="font-bold text-white mt-0.5">Live Telemetry</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Operational Flow</div>
                      <div className="font-bold text-white mt-0.5">End-to-End Tracking</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Governance & Release</div>
                      <div className="font-bold text-white mt-0.5">Enterprise Compliance</div>
                    </div>
                  </div>

                  {/* Progress bar simulation */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full w-2/3 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>02:14</span>
                      <span>03:45</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setTourVideoModalOpen(false);
                      openModal(tourVideoTitle.replace(" Tour", "").replace(" Demo Video", ""));
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Schedule 1-on-1 Guided Deep Dive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTourVideoModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors border border-slate-700 cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   1. MAIN LANDING HUB VIEW (HOME)
   ========================================================================= */

interface HomeViewProps {
  setCurrentPage: (page: PageView) => void;
  openModal: (prodName?: string) => void;
  previewTab: Exclude<PageView, "home">;
  setPreviewTab: (tab: Exclude<PageView, "home">) => void;
  // Interactive Console Simulator Props
  precisionOee: number;
  precisionScrap: number;
  precisionToolLife: number;
  simulatePrecisionOptim: () => void;
  aeroFairPassed: boolean;
  aeroToleranceOffset: string;
  simulateFairCheck: () => void;
  hrmsPunches: number;
  hrmsSyncPulse: boolean;
  simulateBiometricSync: () => void;
  staffingMatchScore: number;
  staffingBenchCount: number;
  simulateAiCandidateMatch: () => void;
}

const HERO_LABELS = [
  "Precision Industry & Enterprise",
  "Precision Manufacturing ERP",
  "Aerospace & Defence ERP",
  "HRMS & Workforce Platform",
  "IT Staffing VMS",
];

function HomeView({
  setCurrentPage,
  openModal,
  previewTab,
  setPreviewTab,
  precisionOee,
  precisionScrap,
  precisionToolLife,
  simulatePrecisionOptim,
  aeroFairPassed,
  aeroToleranceOffset,
  simulateFairCheck,
  hrmsPunches,
  hrmsSyncPulse,
  simulateBiometricSync,
  staffingMatchScore,
  staffingBenchCount,
  simulateAiCandidateMatch,
}: HomeViewProps) {
  const [solutionFilter, setSolutionFilter] = useState<string>("precision");
  const [heroLabelIndex, setHeroLabelIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroVisible(false);
      setTimeout(() => {
        setHeroLabelIndex((i) => (i + 1) % HERO_LABELS.length);
        setHeroVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      {/* =========================================================================
         HERO SECTION (60/40 SPLIT LAYOUT WITH EDGE-TO-EDGE DASHBOARD IMAGE)
         ========================================================================= */}
      <section className="relative overflow-hidden pt-6 pb-14 md:pt-10 md:pb-18 lg:py-16 xl:py-20">
        {/* Decorative subtle ambient backdrop glow behind hero */}
        <div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/3"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Centered Container for Left 60% Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="lg:w-[58%] xl:w-[56%] space-y-6 text-center lg:text-left relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Industrial Operating Suite Founded & Developed by Senwell Group</span>
            </div>

            {/* Main Headline */}
            <h4 className="text-2xl sm:text-4xl xl:text-[3.1rem] font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              The Unified Operating Platform for
              <span className="block h-[1.2em] overflow-hidden mt-1">
                <span
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent block transition-all duration-300"
                  style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(10px)" }}
                >
                  {HERO_LABELS[heroLabelIndex]}
                </span>
              </span>
            </h4>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
              <strong>Synax</strong> eliminates fragmented software stacks. Engineered specifically for{" "}
              <span className="text-slate-900 font-semibold">Precision CNC Manufacturing</span>,{" "}
              <span className="text-slate-900 font-semibold">Aerospace & Defence AS9100D</span>,{" "}
              <span className="text-slate-900 font-semibold">Plant Biometric HRMS</span>, and{" "}
              <span className="text-slate-900 font-semibold">IT Staffing VMS</span> in one connected,
              audit-proof ecosystem.
            </p>

            {/* Dual CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={() => openModal()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Schedule Free 30-Min Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {/* <a
                href="#products"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors text-center"
              >
                Explore 4 Core Suites &darr;
              </a> */}
            </div>

            {/* Compliance & Standards Badges */}
            <div className="pt-3 flex items-center justify-center lg:justify-start gap-5 sm:gap-7 text-xs text-slate-500 font-semibold flex-wrap">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /> AS9100 Rev D
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-500 shrink-0" /> ITAR / EAR Vault
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-500 shrink-0" /> ISO 9001:2015
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" /> CNC Machine IoT
              </span>
            </div>
          </div>
        </div>

        {/* Right Visual Area (40% - Extending Beyond the Right Edge of the Display) */}
        {/* On desktop (lg+), absolutely positioned relative to .relative hero-section, extending past right screen edge */}
        <div className="hidden lg:flex absolute top-1/2 right-0 -translate-y-1/2 w-[40%] xl:w-[42%] 2xl:w-[44%] items-center justify-start pointer-events-none z-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-150 ease-out pr-0">
          <div className="relative w-full flex items-center justify-start select-none">
            {/* Ambient Background Shadow Glow Layers extending behind the dashboard */}
            <div
              className="absolute -inset-6 sm:-inset-10 bg-gradient-to-l from-blue-600/30 via-indigo-500/25 to-teal-400/20 rounded-l-[48px] blur-3xl -z-10 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -left-6 inset-y-4 w-40 bg-slate-950/25 blur-2xl -z-10 pointer-events-none"
              aria-hidden="true"
            />

            {/* Dashboard image scaling out past the right boundary */}
            <div className="w-[125%] xl:w-[130%] 2xl:w-[135%] shrink-0 -mr-[25%] xl:-mr-[30%] 2xl:-mr-[35%]">
              <img
                src="/images/synax-dashboard.png"
                alt="Synax Enterprise ERP Command Dashboard"
                className="block w-full h-auto max-h-[86vh] object-cover object-left shadow-[-20px_25px_60px_-15px_rgba(15,23,42,0.4)] rounded-l-2xl xl:rounded-l-3xl border-y border-l border-slate-200/90 pointer-events-auto transition-transform duration-500 hover:scale-[1.01]"
                loading="eager"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Stacking (< lg): Placed below hero content, 100% full width, no cropping */}
        <div className="lg:hidden mt-10 sm:mt-12 w-full px-4 sm:px-6 flex items-center justify-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 ease-out">
          <div className="relative w-full max-w-2xl">
            {/* Ambient Mobile Glow Shadow */}
            <div
              className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-teal-400/20 rounded-3xl blur-xl -z-10 pointer-events-none"
              aria-hidden="true"
            />
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.3)] bg-white p-1">
              <img
                src="/images/synax-dashboard.png"
                alt="Synax Enterprise ERP Command Dashboard"
                className="w-full h-auto object-contain block rounded-xl"
                loading="eager"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
         Product Ecosystem
         ========================================================================= */}
      <section id="products" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Market-Ready Platforms
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Connect, manage, and grow every part of your business with multiple powerful solutions in one unified platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Choose individual modules to solve critical bottlenecks or deploy the unified suite for
            unbroken visibility from talent sourcing to the finished aerospace assembly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CARD 1: PRECISION MANUFACTURING */}
          <div className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 transition-all duration-200 shadow-sm hover:shadow-xl p-7 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Factory className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {PRODUCT_DATA.precision.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {PRODUCT_DATA.precision.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {PRODUCT_DATA.precision.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {PRODUCT_DATA.precision.description}
              </p>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-emerald-900 font-medium">Standard CNC OEE Uplift</span>
                <span className="font-extrabold text-emerald-700">
                  {PRODUCT_DATA.precision.heroStat.value}
                </span>
              </div>

              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {PRODUCT_DATA.precision.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-3">
              <button
                onClick={() => setCurrentPage("precision")}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Explore Precision ERP</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openModal(PRODUCT_DATA.precision.title)}
                className="px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
              >
                Demo
              </button>
            </div>
          </div>

          {/* CARD 2: AEROSPACE & DEFENCE */}
          <div className="bg-white rounded-3xl border border-slate-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-xl p-7 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {PRODUCT_DATA.aerospace.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {PRODUCT_DATA.aerospace.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {PRODUCT_DATA.aerospace.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {PRODUCT_DATA.aerospace.description}
              </p>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-blue-900 font-medium">AS9102 FAIR Verification Rate</span>
                <span className="font-extrabold text-blue-700">
                  {PRODUCT_DATA.aerospace.heroStat.value}
                </span>
              </div>

              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {PRODUCT_DATA.aerospace.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-3">
              <button
                onClick={() => setCurrentPage("aerospace")}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Explore Aerospace ERP</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openModal(PRODUCT_DATA.aerospace.title)}
                className="px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
              >
                Demo
              </button>
            </div>
          </div>

          {/* CARD 3: SYNAX HRMS PLATFORM */}
          <div className="bg-white rounded-3xl border border-slate-200 hover:border-sky-300 transition-all duration-200 shadow-sm hover:shadow-xl p-7 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  {PRODUCT_DATA.hrms.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {PRODUCT_DATA.hrms.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {PRODUCT_DATA.hrms.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {PRODUCT_DATA.hrms.description}
              </p>

              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs">
                <span className="text-sky-900 font-medium">Monthly Payroll Run Speed</span>
                <span className="font-extrabold text-sky-700">
                  {PRODUCT_DATA.hrms.heroStat.value}
                </span>
              </div>

              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {PRODUCT_DATA.hrms.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-3">
              <button
                onClick={() => setCurrentPage("hrms")}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Explore HRMS Platform</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openModal(PRODUCT_DATA.hrms.title)}
                className="px-4 py-3 rounded-xl bg-sky-50 text-sky-700 font-semibold text-xs hover:bg-sky-100 transition-colors border border-sky-200 cursor-pointer"
              >
                Demo
              </button>
            </div>
          </div>

          {/* CARD 4: SYNAX IT STAFFING VMS */}
          <div className="bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-xl p-7 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  {PRODUCT_DATA.staffing.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {PRODUCT_DATA.staffing.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {PRODUCT_DATA.staffing.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {PRODUCT_DATA.staffing.description}
              </p>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
                <span className="text-indigo-900 font-medium">Average Time-to-Placement</span>
                <span className="font-extrabold text-indigo-700">
                  {PRODUCT_DATA.staffing.heroStat.value}
                </span>
              </div>

              <ul className="space-y-2 pt-1 text-xs text-slate-700">
                {PRODUCT_DATA.staffing.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-3">
              <button
                onClick={() => setCurrentPage("staffing")}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Explore Staffing VMS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openModal(PRODUCT_DATA.staffing.title)}
                className="px-4 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-xs hover:bg-indigo-100 transition-colors border border-indigo-200 cursor-pointer"
              >
                Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         Solutions by Industry / Business Need
         ========================================================================= */}
      <section id="solutions" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Sector & Challenge Alignment
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Solutions by Industry / Business Need
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Discover how the Synax product ecosystem directly addresses mission-critical operational challenges, compliance bottlenecks, and workforce friction across specialized sectors.
          </p>

          {/* Interactive Filter Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSolutionFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                solutionFilter === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Industries (4)
            </button>
            <button
              onClick={() => setSolutionFilter("precision")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                solutionFilter === "precision"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Precision Manufacturing
            </button>
            <button
              onClick={() => setSolutionFilter("aerospace")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                solutionFilter === "aerospace"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Aerospace & Defence
            </button>
            <button
              onClick={() => setSolutionFilter("hrms")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                solutionFilter === "hrms"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Human Resource Management
            </button>
            <button
              onClick={() => setSolutionFilter("staffing")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                solutionFilter === "staffing"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              IT Staffing & Workforce
            </button>
          </div>
        </div>

        {/* 4 In-Depth Solution Cards */}
        <div className="space-y-8">
          {/* Solution 1: Precision Manufacturing */}
          {(solutionFilter === "all" || solutionFilter === "precision") && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all p-7 sm:p-9 border-l-4 border-l-emerald-600">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Factory className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                      CNC Fleet & Shop Floor
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Precision Manufacturing
                  </h3>
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/80">
                    Powered by Synax ERP — Precision Manufacturing
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Designed for multi-axis CNC machine shops, tooling facilities, and discrete manufacturing cells requiring real-time spindle intelligence and dynamic dispatch.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => setCurrentPage("precision")}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Explore Precision Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openModal("Synax ERP — Precision Manufacturing")}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
                    >
                      Book Demo
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* The Business Challenge */}
                    <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>The Business Challenge</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Unplanned machine downtime, unmeasured OEE (often under 65%), unexpected tool breakage causing scrapped high-value billets, and chaotic paper routing between CAD/CAM stations and CNC mills.
                      </p>
                    </div>

                    {/* How Synax Solves It */}
                    <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>How Synax Solves It</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Direct IoT controller sync (Fanuc, Siemens, Mazatrol), predictive tool wear alerts, dynamic capacity load balancing across 3-axis/5-axis cells, and paperless digital travelers.
                      </p>
                    </div>
                  </div>

                  {/* Measurable ROI & Capabilities */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                      Impact: +32% Machine OEE
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                      Scrap: &lt; 0.08% Rate
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      100% Paperless Floor
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Live Spindle RPM & Vibration Telemetry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Automatic Tool Pre-set Offsets & Alarms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Raw Ingot Heat Cert Mill Traceability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Work Order Gantt Schedule Optimization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Solution 2: Aerospace & Defence */}
          {(solutionFilter === "all" || solutionFilter === "aerospace") && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all p-7 sm:p-9 border-l-4 border-l-blue-600">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                      AS9100 Rev D & ITAR
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Aerospace & Defence
                  </h3>
                  <div className="text-xs font-semibold text-blue-700 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100/80">
                    Powered by Synax ERP — Aerospace & Defence
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Built specifically for flight-critical component suppliers, defense machine shops, and NADCAP certified chemical processors requiring zero-defect assurance.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => setCurrentPage("aerospace")}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Explore Aerospace Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openModal("Synax ERP — Aerospace & Defence")}
                      className="px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
                    >
                      Book Demo
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* The Business Challenge */}
                    <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>The Business Challenge</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Strict AS9100D compliance audits requiring weeks of manual paper reassembly; ITAR/EAR defense data spill risks; manual First Article Inspection Reports (FAIRs) that delay shipping.
                      </p>
                    </div>

                    {/* How Synax Solves It */}
                    <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>How Synax Solves It</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Air-gapped cryptographic ITAR vault with RBAC, direct Zeiss/Hexagon CMM coordinate inspection integration, automated AS9102 FAIR builder, and 360° MTR lot genealogy.
                      </p>
                    </div>
                  </div>

                  {/* Measurable ROI & Capabilities */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                      Speed: 10x Faster FAIR Release
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      Escaped Defects: Zero Tolerance
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                      100% Audit Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Digital AS9102 FAIR (Form 1, 2, 3) Generator</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Role-Based ITAR / EAR Cryptographic Vault</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Serialized Lot & Heat Genealogy Matrix</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Integrated NCR / CAPA 8D Quality Gateways</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Solution 3: Human Resource Management */}
          {(solutionFilter === "all" || solutionFilter === "hrms") && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all p-7 sm:p-9 border-l-4 border-l-sky-600">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 uppercase tracking-wider">
                      Workforce & HCM
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Human Resource Management
                  </h3>
                  <div className="text-xs font-semibold text-sky-700 bg-sky-50/70 p-2.5 rounded-xl border border-sky-100/80">
                    Powered by Synax HRMS Platform
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Designed for high-intensity industrial plants, multi-facility manufacturing enterprises, and shift-based engineering teams.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => setCurrentPage("hrms")}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Explore HRMS Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openModal("Synax HRMS Platform")}
                      className="px-3.5 py-2.5 rounded-xl bg-sky-50 text-sky-700 font-semibold text-xs hover:bg-sky-100 transition-colors border border-sky-200 cursor-pointer"
                    >
                      Book Demo
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* The Business Challenge */}
                    <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>The Business Challenge</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Buddy punching, unaccounted plant floor break passes leaving active machining lines unattended, and multi-day manual payroll calculations with complex shift differential and tax errors.
                      </p>
                    </div>

                    {/* How Synax Solves It */}
                    <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>How Synax Solves It</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Direct biometric hardware sync (ZKTeco/Suprema), live break-pass gatekeeper with floor overstay alerts, 1-click multi-tax payroll calculation under 60 seconds, and 360° OKR reviews.
                      </p>
                    </div>
                  </div>

                  {/* Measurable ROI & Capabilities */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                      Payroll Run: &lt; 60 Seconds
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
                      Attendance: 99.9% Punch Accuracy
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                      Zero Expired Certifications
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Biometric Turnstile Hardware IoT Sync</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Plant Shift Break-Pass Monitor & Gatekeeper</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Automated Multi-Tax & Statutory PF/ESI Engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>360° OKRs & Operator Skill Certification Matrix</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Solution 4: IT Staffing & Workforce Management */}
          {(solutionFilter === "all" || solutionFilter === "staffing") && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all p-7 sm:p-9 border-l-4 border-l-indigo-600">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                      AI Sourcing & VMS
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    IT Staffing & Workforce Management
                  </h3>
                  <div className="text-xs font-semibold text-indigo-700 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/80">
                    Powered by Synax IT Staffing VMS
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Built for enterprise staffing agencies, technical consulting networks, and contingent workforce providers managing complex client SOWs.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => setCurrentPage("staffing")}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Explore Staffing Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openModal("Synax IT Staffing VMS")}
                      className="px-3.5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-xs hover:bg-indigo-100 transition-colors border border-indigo-200 cursor-pointer"
                    >
                      Book Demo
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* The Business Challenge */}
                    <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>The Business Challenge</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Weeks-long recruiting cycles, expensive technical consultants sitting idle on unbillable bench time, multi-vendor communication friction, and disputed timesheets and client invoices.
                      </p>
                    </div>

                    {/* How Synax Solves It */}
                    <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>How Synax Solves It</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        AI semantic resume parser with code benchmarks, real-time candidate bench allocation with 30-day roll-off forecasts, tiered VMS supplier workflows, and automated SOW invoicing.
                      </p>
                    </div>
                  </div>

                  {/* Measurable ROI & Capabilities */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                      Placement: 3.8 Days Avg Time
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                      Bench Profitability: +28%
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                      100% SOW Billing Accuracy
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>AI Semantic Match & Technical Skill Graph</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Candidate Bench Allocation & Roll-Off Predictor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>End-to-End Enterprise VMS Supplier Portal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Automated Client Timecard & Milestone Invoicing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
         THE LARGER PURPOSE BEHIND THE SYNAX ECOSYSTEM
         ========================================================================= */}
      <section id="purpose" className="py-20 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              The Ecosystem Purpose
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Larger Purpose Behind the Synax Ecosystem
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Traditional ERPs were built for finance departments, forcing shop floor engineers,
              quality leads, and workforce managers to survive on fragmented spreadsheets. Synax
              exists to unify high-precision execution, human capital, and regulatory compliance into
              one cohesive continuum.
            </p>
          </div>

          {/* 4 Core Purpose Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Pillar 1: Industry-Focused Solutions */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border-l-4 border-l-blue-600">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                    Precision & Compliance
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    1. Industry-Focused Solutions
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Domain-native workflows instead of generic ERP workarounds
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  We reject one-size-fits-all software. Every module in Synax is calibrated for the
                  exact operational realities of high-stakes industries — from AS9100 Rev D audit
                  readiness and ITAR defense data vaulting in aerospace, to multi-axis CNC machine
                  loading and First Article Inspection Reports (AS9102 FAIR) on precision shop floors.
                </p>
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>AS9100D & ITAR Native</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Zeiss/Hexagon CMM Sync</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 2: Smarter Business Operations */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border-l-4 border-l-emerald-600">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                    Operational Velocity
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    2. Smarter Business Operations
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Single source of truth from raw ingot receipt to customer dispatch
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Synax breaks the barrier between the front office and the shop floor. By capturing
                  real-time machine telemetry, material heat-lot certifications, and stage-by-stage
                  scrap rates, leadership gains true OEE visibility and predictive capacity dispatch
                  without waiting for end-of-month manual reconciliation.
                </p>
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>360° Material Lot Genealogy</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dynamic Machine Dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 3: Better Workforce Management */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border-l-4 border-l-sky-600">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 uppercase tracking-wider">
                    Human Capital Intelligence
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    3. Better Workforce Management
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Unifying permanent floor staff with contingent technical talent
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  High-precision delivery requires the right certified specialist on every shift.
                  Synax bridges biometric turnstile punch-ins, plant floor break-pass monitoring,
                  and &lt;60s automated payroll with an AI-powered talent bench that sources and
                  validates certified engineers and machinists on demand.
                </p>
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Biometric IoT Turnstile Sync</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>AI Bench Matching & VMS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 4: Technology-Driven Transformation */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border-l-4 border-l-indigo-600">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                    Modern Tech Architecture
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    4. Technology-Driven Transformation
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Cloud-native scale, IoT sensor telematics & immutable security
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Replacing clunky legacy on-premise architectures with modern, cloud-native
                  engineering. Synax combines edge CNC machine connectivity, CMM inspection
                  interfaces, automated cryptographic audit trails, and bank-grade 256-bit AES
                  encryption to deliver resilient, continuous digital transformation.
                </p>
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Direct CNC IoT Machine Data</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>256-bit AES & Immutable Logs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Callout Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                Senwell Group Engineering Discipline
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-white">
                One Unified Continuum. Zero Disconnected Tools.
              </h4>
              <p className="text-xs text-slate-400 max-w-xl">
                Every tier of Synax works in synchrony: from hiring and biometric clock-in to CNC
                machining and AS9100 aerospace release.
              </p>
            </div>
            <button
              onClick={() => openModal("Architecture Consultation")}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Explore Platform Synergy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
         SYNAX AI — INTELLIGENT ENTERPRISE ASSISTANT
         ========================================================================= */}
      <section id="synax-ai" className="py-20 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Synax AI — Always On
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Enterprise, Answered{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">
                Instantly
              </span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Synax AI is a built-in intelligent assistant that understands your entire enterprise — orders, HRMS records, live transactions, inventory, compliance status, and more. Just ask.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Capability Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: <BarChart3 className="w-4 h-4" />,
                  color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                  title: "Live Transaction Queries",
                  desc: "Ask \"What are today's open purchase orders?\" or \"Show me all invoices pending approval\" and get instant answers from live ERP data.",
                },
                {
                  icon: <Users className="w-4 h-4" />,
                  color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
                  title: "HRMS & Workforce Intelligence",
                  desc: "Query attendance records, payroll status, leave balances, skill certifications, and biometric punch logs in plain language.",
                },
                {
                  icon: <Factory className="w-4 h-4" />,
                  color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                  title: "Shop Floor & Production Data",
                  desc: "Get real-time OEE, job traveler status, tool life remaining, scrap rates, and machine queue depth — all from a single chat prompt.",
                },
                {
                  icon: <ShieldCheck className="w-4 h-4" />,
                  color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                  title: "Compliance & Audit Readiness",
                  desc: "Instantly surface AS9100D audit trails, FAIR document status, ITAR access logs, and calibration expiry alerts on demand.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors">
                  <div className={`p-2 rounded-xl border shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Chat UI Mock */}
            <div className="bg-slate-950/80 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/60">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Synax AI</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected to your enterprise data
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-5 space-y-4 text-xs">
                {/* User message 1 */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                    What are the current open transactions today?
                  </div>
                </div>
                {/* AI reply 1 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] space-y-2">
                    <p>Here&apos;s a live summary of today&apos;s open transactions:</p>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">Purchase Orders</div>
                        <div className="font-bold text-white">14 Open</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">Sales Invoices</div>
                        <div className="font-bold text-white">7 Pending</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">Job Orders</div>
                        <div className="font-bold text-white">23 Active</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">GRN Pending</div>
                        <div className="font-bold text-white">5 Awaiting</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User message 2 */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                    Show me attendance for Shift A today
                  </div>
                </div>
                {/* AI reply 2 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                    <span className="text-emerald-400 font-semibold">Shift A — 428 punched in</span>, 12 on active break pass, 3 on approved leave. Payroll sync is up to date. No overstay alerts.
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                  <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs text-slate-500 flex-1">Ask anything about your enterprise data...</span>
                  <button className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer">
                    <Send className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center space-y-4">
            <p className="text-xs text-slate-500">Synax AI is included in every enterprise plan — no extra setup, no third-party integrations.</p>
            <button
              onClick={() => openModal("Synax AI Enterprise Assistant")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>See Synax AI in Your Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHY SYNAX
         ========================================================================= */}
      <section id="comparison" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Market Benchmark
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Industry Leaders Migrate to Synax
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Compare modern purpose-built manufacturing software against legacy monoliths and
            disjointed point solutions.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="py-4 px-5 font-bold text-slate-700">Operational Dimension</th>
                <th className="py-4 px-5 font-extrabold text-blue-700 bg-blue-50/60 border-x border-blue-100">
                  Synax Unified Suite
                </th>
                <th className="py-4 px-5 font-semibold text-slate-500">Legacy ERPs (SAP/Oracle)</th>
                <th className="py-4 px-5 font-semibold text-slate-500">
                  Disconnected Point Tools
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">CNC Machine IoT Telemetry</td>
                <td className="py-4 px-5 font-semibold text-emerald-700 bg-blue-50/30 border-x border-blue-100">
                  ✓ Native Fanuc/Siemens/Mazatrol
                </td>
                <td className="py-4 px-5 text-slate-500">Requires expensive third-party SCADA</td>
                <td className="py-4 px-5 text-slate-500">Manual paper whiteboard logging</td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">AS9102 FAIR Document Builder</td>
                <td className="py-4 px-5 font-semibold text-emerald-700 bg-blue-50/30 border-x border-blue-100">
                  ✓ Automated CMM direct feed
                </td>
                <td className="py-4 px-5 text-slate-500">Manual paperwork entry & reassembly</td>
                <td className="py-4 px-5 text-slate-500">Vulnerable Excel spreadsheets</td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">
                  Biometric IoT & Shift Break Passes
                </td>
                <td className="py-4 px-5 font-semibold text-emerald-700 bg-blue-50/30 border-x border-blue-100">
                  ✓ Hardware synchronized in real time
                </td>
                <td className="py-4 px-5 text-slate-500">Separate HCM module with sync lags</td>
                <td className="py-4 px-5 text-slate-500">Isolated punch cards / buddy punching</td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">
                  Integrated IT Staffing VMS & Bench
                </td>
                <td className="py-4 px-5 font-semibold text-emerald-700 bg-blue-50/30 border-x border-blue-100">
                  ✓ Built-in AI Semantic Talent Engine
                </td>
                <td className="py-4 px-5 text-slate-500">Unconnected external ATS silos</td>
                <td className="py-4 px-5 text-slate-500">Scattered email resumes & PDFs</td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">Implementation Timeline</td>
                <td className="py-4 px-5 font-semibold text-emerald-700 bg-blue-50/30 border-x border-blue-100">
                  ✓ 4 to 8 Weeks (Turnkey Rollout)
                </td>
                <td className="py-4 px-5 text-slate-500">12 to 18 Months of consulting</td>
                <td className="py-4 px-5 text-slate-500">Endless patchworks & API breaks</td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-900">ITAR / EAR Defense Vault</td>
                <td className="py-4 px-5 font-semibold text-emerald-700 bg-blue-50/30 border-x border-blue-100">
                  ✓ Cryptographic RBAC Vault Native
                </td>
                <td className="py-4 px-5 text-slate-500">Complex on-prem add-on servers</td>
                <td className="py-4 px-5 text-slate-500">Severe compliance breach risk</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>


       {/* Interactive Platform Console */}
          <section className="pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
                Live Platform Preview
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                See Synax in Action
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Interact with live telemetry feeds, compliance dashboards, and AI-powered workflows across all four enterprise modules.
              </p>
            </div>
            <div>
              {/* Viewport Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900 text-slate-300 px-4 py-2.5 rounded-t-2xl border border-slate-800 gap-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400">
                    synax.senwellgroup.com/console/{previewTab}
                  </span>
                </div>

                {/* Switchable 4 Product Tabs */}
                <div className="flex flex-wrap gap-1 bg-slate-800/90 p-1 rounded-xl">
                  <button
                    onClick={() => setPreviewTab("precision")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      previewTab === "precision"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Precision ERP
                  </button>
                  <button
                    onClick={() => setPreviewTab("aerospace")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      previewTab === "aerospace"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Aerospace ERP
                  </button>
                  <button
                    onClick={() => setPreviewTab("hrms")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      previewTab === "hrms"
                        ? "bg-sky-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Synax HRMS
                  </button>
                  <button
                    onClick={() => setPreviewTab("staffing")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      previewTab === "staffing"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    IT Staffing VMS
                  </button>
                </div>
              </div>

              {/* 16:9 Aspect Ratio Display Viewport */}
              <div className="aspect-[16/9] min-h-[440px] sm:min-h-0 w-full bg-white rounded-b-2xl border border-slate-200 border-t-0 p-4 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                {/* -------------------------------------------------------------
                  TAB 1: PRECISION MANUFACTURING SIMULATION
                  ------------------------------------------------------------- */}
                {previewTab === "precision" && (
                  <div className="h-full flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          Live Telemetry • CNC Machine IoT Feed
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                          5-Axis Machine Loading, Spindle Telemetry & Capacity Dispatch
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={simulatePrecisionOptim}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-[11px] hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                        >
                          Simulate Tool Swap &rarr;
                        </button>
                        <button
                          onClick={() => setCurrentPage("precision")}
                          className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Full Page</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Shop OEE Index</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          {precisionOee}%
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Mazak 5-Axis #01 Active
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Scrap / Defect Rate</div>
                        <div className="text-base sm:text-lg font-extrabold text-emerald-700 mt-0.5">
                          {precisionScrap}%
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Target: &lt; 0.25%</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Endmill Tool Life</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          {precisionToolLife}% Rem.
                        </div>
                        <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                          Carbide 12mm 4-Flute
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Work Order Queue</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          Job #PM-8092
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">48 / 50 Pcs Complete</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Factory className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          Material Heat #882-X9 Titanium Ingot attached to Job Traveler #PM-8092
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        CAD/CAM SYNCED
                      </span>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                  TAB 2: AEROSPACE & DEFENCE SIMULATION
                  ------------------------------------------------------------- */}
                {previewTab === "aerospace" && (
                  <div className="h-full flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                          AS9100 Rev D & ITAR Enforced
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                          AS9102 FAIR Generator & CMM Quality Verification Gate
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={simulateFairCheck}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px] hover:bg-blue-100 border border-blue-200 cursor-pointer"
                        >
                          Trigger CMM Scan &rarr;
                        </button>
                        <button
                          onClick={() => setCurrentPage("aerospace")}
                          className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Full Page</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">AS9102 FAIR Form 3</div>
                        <div className="text-base sm:text-lg font-extrabold text-blue-700 mt-0.5">
                          {aeroFairPassed ? "100% Passed" : "Pending"}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          Zeiss CMM Verified
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Bore Tolerance Offset</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          {aeroToleranceOffset}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Limit: ±0.0050 mm</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">ITAR Access Control</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          Active Vault
                        </div>
                        <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                          US-Person RBAC Locked
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">NADCAP Plating Spec</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          MIL-A-8625
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Cert #ND-9921 Linked</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>
                          Aerospace Defense Cryptographic Traveler: Subassembly #AD-9041 ready for final
                          release
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        ZERO DEFECTS
                      </span>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                  TAB 3: HRMS PLATFORM SIMULATION
                  ------------------------------------------------------------- */}
                {previewTab === "hrms" && (
                  <div className="h-full flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                          Global HCM • Biometric IoT Gateway
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                          Biometric Turnstile Hardware Sync & Plant Break-Pass Monitor
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={simulateBiometricSync}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-semibold text-[11px] hover:bg-sky-100 border border-sky-200 cursor-pointer"
                        >
                          Punch Simulator &rarr;
                        </button>
                        <button
                          onClick={() => setCurrentPage("hrms")}
                          className="text-xs text-sky-700 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Full Page</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Biometric Punches</div>
                        <div
                          className={`text-base sm:text-lg font-extrabold text-slate-900 mt-0.5 transition-all ${
                            hrmsSyncPulse ? "text-sky-600 scale-105" : ""
                          }`}
                        >
                          {hrmsPunches} On-Floor
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ZKTeco Turnstile Online
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Plant Break Passes</div>
                        <div className="text-base sm:text-lg font-extrabold text-sky-700 mt-0.5">
                          12 Active
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Shift Alpha Nominal</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Monthly Payroll Run</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          &lt; 52 Sec
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          Tax & PF Automated
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Skill Cert Matrix</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          100% Verified
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">0 Expired Licenses</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>
                          Plant Shift Attendance synced directly with CNC Operator Labor Accounting
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                        REAL-TIME SYNC
                      </span>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                  TAB 4: IT STAFFING VMS SIMULATION
                  ------------------------------------------------------------- */}
                {previewTab === "staffing" && (
                  <div className="h-full flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          AI Sourcing & Vendor Management
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                          AI Talent Semantic Parser & Bench Utilization Portal
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={simulateAiCandidateMatch}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-[11px] hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
                        >
                          Run Semantic AI Match &rarr;
                        </button>
                        <button
                          onClick={() => setCurrentPage("staffing")}
                          className="text-xs text-indigo-700 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Full Page</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Candidate Bench</div>
                        <div className="text-base sm:text-lg font-extrabold text-indigo-700 mt-0.5">
                          {staffingBenchCount} Techs
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          Ready for Deployment
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">AI Match Score</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          {staffingMatchScore}%
                        </div>
                        <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                          Senior Avionics Dev
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">Avg Placement Time</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          3.8 Days
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">3.5x Market Speed</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] text-slate-500 font-medium">SOW Client Billing</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                          100% Auto
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">18 VMS Vendors Synced</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>
                          Client Requisition #CR-402 matched with 3 certified defense systems engineers
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                        AI PIPELINE ARMED
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>


      {/* =========================================================================
         CUSTOMER VOICES & VERIFIED TESTIMONIALS (4 DOMAINS)
         ========================================================================= */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              Operational Proof
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Validated on Active Plant Floors & Delivery Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Hear directly from directors, plant managers, and quality leaders who run Synax
              every single shift.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Story 1: Precision */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                  Precision Manufacturing ERP
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;Synax eliminated spreadsheet chaos across our 5-axis CNC lines. Spindle
                  telemetry and real-time tool wear offsets boosted our overall floor OEE by 32%.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <div className="text-xs font-bold text-slate-900">Rajesh Kumar</div>
                <div className="text-[11px] text-slate-500">Operations Director, Precision Machining Co.</div>
              </div>
            </div>

            {/* Story 2: Aerospace */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                  Aerospace & Defence ERP
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;AS9100D and ITAR compliance used to mean weeks of paper reassembly. With
                  Synax, CMM records and AS9102 FAIRs generate automatically at the inspection gate.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <div className="text-xs font-bold text-slate-900">Michael Chen</div>
                <div className="text-[11px] text-slate-500">QA Lead, Defense Flight Components Inc.</div>
              </div>
            </div>

            {/* Story 3: HRMS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 uppercase">
                  Synax HRMS Platform
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;Connecting biometric turnstiles directly to plant break-passes and shift differentials
                  reduced our monthly payroll run from 4 days to under 60 seconds.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <div className="text-xs font-bold text-slate-900">Sarah Mitchell</div>
                <div className="text-[11px] text-slate-500">Plant Manager & Controller, Advanced Aerospace</div>
              </div>
            </div>

            {/* Story 4: IT Staffing */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">
                  Synax IT Staffing VMS
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;The AI semantic matching and bench utilization suite gave us instant clarity on
                  consultant allocations. Placement velocity tripled within the first quarter.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <div className="text-xs font-bold text-slate-900">Emma Rodriguez</div>
                <div className="text-[11px] text-slate-500">VP of Talent Acquisition, Global IT Services</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         TRUSTED ENTERPRISE CLIENTS & ECOSYSTEM PARTNERS
         ========================================================================= */}
      <section className="py-14 sm:py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Trusted By Industry Leaders
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ecosystem Clients & Global Operations
            </h2>
            <p className="text-xs text-slate-500">
              Powering global aerospace precision manufacturing, digital technology, and high-performance engineering.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {/* Client 1: Senwell Exports */}
            <a
              href="https://senwellexports.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-300 bg-white hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <img
                src="https://senwellexports.com/static/media/SenwellLogo.524bb520c09926753630.png"
                alt="Senwell Exports"
                className="h-10 sm:h-12 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-emerald-700 transition-colors">
                senwellexports.com
              </span>
            </a>

            {/* Client 2: Exxon Info */}
            <a
              href="https://exxoninfo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-blue-300 bg-white hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="https://exxoninfo.com/favicon.ico"
                  alt="Exxon Info"
                  className="w-7 h-7 object-contain"
                  loading="lazy"
                />
                <span className="font-extrabold text-[#0a1128] tracking-tight text-lg sm:text-xl">
                  EXXON <span className="text-[#0b6cff]">INFO</span>
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-700 transition-colors">
                exxoninfo.com
              </span>
            </a>

            {/* Client 3: Stacwell */}
            <a
              href="https://stacwell.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-blue-300 bg-white hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <img
                src="https://stacwell.com/_next/image?url=%2FstacwellLogo.webp&w=256&q=75"
                alt="Stacwell"
                className="h-9 sm:h-11 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-700 transition-colors">
                stacwell.com
              </span>
            </a>

            {/* Client 4: Stacem */}
            <a
              href="https://www.stacem.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-blue-300 bg-white hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <img
                src="https://www.stacem.com/wp-content/themes/themeb17/img/logo-stacem.svg"
                alt="Stacem"
                className="h-8 sm:h-10 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-700 transition-colors">
                stacem.com
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
         SECURITY & ARCHITECTURE PILLARS
         ========================================================================= */}
      <section id="security" className="py-18 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
              Zero-Trust Architecture
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Enterprise Security & Scalability
            </h2>
            <p className="text-xs text-slate-600">
              Built to withstand stringent defense audits, data sovereignty regulations, and 24/7
              manufacturing uptimes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <Lock className="w-6 h-6 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">256-bit AES Encryption</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete data encryption at rest and in transit with isolated cloud multi-tenancy and
                tamper-proof keys.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <Server className="w-6 h-6 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Open REST & Webhook APIs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct integration with CAD/CAM packages, CMM inspection arms, SAP, and biometric
                IoT hardware.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <Activity className="w-6 h-6 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">99.99% Guaranteed SLA</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Multi-region fault-tolerant infrastructure monitored 24/7 by Senwell Group systems
                engineers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <FileCheck className="w-6 h-6 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">Cryptographic Audit Trails</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Immutable, timestamped logs capturing drawing approvals, shop floor overrides, and
                payroll authorizations.
              </p>
            </div>
          </div>
        </div>
      </section>

         {/* =========================================================================
         SENWELL GROUP PARENTAGE & HERITAGE
         ========================================================================= */}
      <section id="senwell" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-3 text-center lg:text-left max-w-xl">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Manufacturing Pedigree
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Built by Manufacturers, for Manufacturers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Synax was not engineered in a generic software incubator. It was born out of{" "}
                <strong className="text-slate-800">Senwell Group’s</strong> multi-decade heritage in
                precision aerospace manufacturing, global industrial export (Senwell Exports,
                Stacwell Rubber, Stacem France & Morocco), and high-volume engineering operations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full lg:w-auto">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div className="text-base sm:text-lg font-extrabold text-slate-900">AS9100D</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Quality Certified</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div className="text-base sm:text-lg font-extrabold text-slate-900">ITAR Ready</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Defense Vault</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div className="text-base sm:text-lg font-extrabold text-slate-900">ISO 9001</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Global Standard</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div className="text-base sm:text-lg font-extrabold text-slate-900">99.99%</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Enterprise SLA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         BOTTOM EXECUTIVE CTA SECTION
         ========================================================================= */}
      <section className="py-20 bg-slate-100 text-black relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest bg-blue-200 px-3 py-1 rounded-full border border-blue-800">
            Senwell Group Enterprise Software
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight">
            Ready to Calibrate Your Operations with Synax?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join tier-1 precision manufacturers, defense machine shops, and fast-scaling IT
            enterprises that trust Synax for compliance, velocity, and zero-defect execution.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openModal()}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Schedule Solution Architecture Consultation &rarr;
            </button>
            <button
              onClick={() => setCurrentPage("precision")}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs border border-slate-800 transition-colors cursor-pointer"
            >
              Explore Precision Manufacturing
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================================
   2. REUSABLE PRODUCT DETAIL VIEW (FOR ALL 4 MODULES)
   ========================================================================= */

interface ProductDetailViewProps {
  meta: ProductMeta;
  setCurrentPage: (page: PageView) => void;
  openModal: (prodName?: string) => void;
  openTourModal: (title?: string) => void;
}

function ProductDetailView({ meta, setCurrentPage, openModal, openTourModal }: ProductDetailViewProps) {
  const IconComponent = meta.icon;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14 animate-in fade-in duration-200">
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Synax Enterprise Overview</span>
        </button>
        <span className="text-[11px] font-mono text-slate-400">
          synax.senwellgroup.com/{meta.id}
        </span>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${meta.accentBg} ${meta.accentText} ${meta.accentBorder}`}
            >
              {meta.badge}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {meta.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => openTourModal(`${meta.title} Tour`)}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Take Tour</span>
            </button>
            <button
              onClick={() => openModal(meta.title)}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule {meta.title.split("—")[1] || "Platform"} Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => openModal(meta.title)}
              className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Download Tech Spec
            </button>
          </div>
        </div>

        {/* 16:9 Aspect Ratio Media Viewport */}
        <div className="aspect-[16/9] bg-white rounded-2xl border border-slate-200 p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <IconComponent className={`w-5 h-5 ${meta.accentText}`} />
              <span className="text-xs font-bold text-slate-900">Live Operating Module</span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${meta.accentBg} ${meta.accentText} ${meta.accentBorder}`}
            >
              BENCHMARK: {meta.heroStat.value}
            </span>
          </div>

          <div className="space-y-2.5 my-auto">
            {meta.highlights.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <span className="text-slate-600 truncate mr-2">{item}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2.5 flex items-center justify-between">
            <span>Senwell Group Certified Architecture</span>
            <button
              onClick={() => openTourModal(`${meta.title} Tour`)}
              className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-emerald-600" />
              <span>Watch Demo Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Deep Dive Grid / Core Modules & Capabilities */}
      <div className="space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            {meta.moduleSection?.kicker ? meta.moduleSection.kicker : "Platform Architecture"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Core Modules & Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {meta.moduleSection?.subtitle || "Engineered to streamline daily operations and pass rigorous compliance reviews."}
          </p>
          {/* <div className="pt-1 flex items-center justify-center">
            <button
              onClick={() => openTourModal(`${meta.title} Tour`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Take Tour</span>
            </button>
          </div> */}
        </div>

        {meta.moduleSection ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meta.moduleSection.groups.map((group) => (
              <div
                key={group.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className={`p-2 rounded-xl ${meta.accentBg} ${meta.accentText}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{group.title}</h3>
                      <p className="text-[11px] text-slate-400">Core Subsystem</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {group.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Workflows & Capabilities
                    </span>
                    <ul className="space-y-2">
                      {group.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    onClick={() => openTourModal(`${group.title} Demo Video`)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch {group.title} Demo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meta.capabilities.map((cap, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2.5 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-lg ${meta.accentBg} ${meta.accentText} flex items-center justify-center font-bold text-xs`}
                  >
                    {i + 1}
                  </div>
                  {cap.metric && (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {cap.metric}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{cap.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dedicated View CTA Banner */}
      <div className="p-8 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-bold">Schedule a Demonstration of {meta.title}</h3>
          <p className="text-xs text-slate-400">
            Speak directly with a Senwell Group systems engineer to assess plant integration.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* <button
            onClick={() => openTourModal(`${meta.title} Product Tour`)}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-md cursor-pointer flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Take Tour</span>
          </button> */}
          <button
            onClick={() => openModal(meta.title)}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-md cursor-pointer"
          >
            Book Technical Walkthrough
          </button>
        </div>
      </div>
    </div>
  );
}