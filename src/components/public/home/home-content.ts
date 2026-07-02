import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  BarChart3,
  Bell,
  Building2,
  ClipboardCheck,
  Globe2,
  Layers3,
  Package,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export type Capability = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type WorkflowStep = {
  label: string;
  title: string;
  description: string;
};

export type Stat = {
  value: string;
  label: string;
  detail: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type Partner = {
  name: string;
  category: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export const capabilities: Capability[] = [
  {
    icon: Package,
    title: "Inventory Control",
    description:
      "Create, update, and categorize items with clean stock records across every location.",
  },
  {
    icon: Building2,
    title: "Warehouse Visibility",
    description:
      "Track how products are distributed across warehouses, bins, and active operating zones.",
  },
  {
    icon: ArrowRightLeft,
    title: "Stock Movements",
    description:
      "Record stock in, stock out, and transfers with a movement trail your team can trust.",
  },
  {
    icon: Bell,
    title: "Low Stock Alerts",
    description:
      "Surface replenishment risks early so teams can restock before operations slow down.",
  },
  {
    icon: Users,
    title: "Team Access",
    description:
      "Keep account access controlled with user management built for day-to-day operators.",
  },
  {
    icon: BarChart3,
    title: "Operational Reporting",
    description:
      "Read stock performance, warehouse activity, and inventory health from focused reports.",
  },
];

export const workflowSteps: WorkflowStep[] = [
  {
    label: "01",
    title: "Structure your catalog",
    description:
      "Keep products, categories, warehouses, and users organized before stock starts moving.",
  },
  {
    label: "02",
    title: "Track every movement",
    description:
      "Capture stock increases, deductions, and transfers as the source of inventory truth.",
  },
  {
    label: "03",
    title: "Act on exceptions",
    description:
      "Use alerts and reports to prioritize replenishment, audit gaps, and operational follow-up.",
  },
];

export const trustSignals = [
  { value: "12k+", label: "items tracked" },
  { value: "99%", label: "record accuracy" },
  { value: "24/7", label: "stock visibility" },
];

export const operatingPillars = [
  {
    icon: ClipboardCheck,
    label: "Reliable records",
  },
  {
    icon: ShieldCheck,
    label: "Secure access",
  },
  {
    icon: Layers3,
    label: "Scalable structure",
  },
];

export const stats: Stat[] = [
  {
    value: "48%",
    label: "faster stock checks",
    detail: "Teams spend less time reconciling counts across locations.",
  },
  {
    value: "3.2x",
    label: "clearer replenishment",
    detail: "Low-stock alerts help buyers focus on the right products sooner.",
  },
  {
    value: "18+",
    label: "operational reports",
    detail: "Inventory, movement, warehouse, and user views stay connected.",
  },
  {
    value: "6",
    label: "core workflows",
    detail: "Products, warehouses, transfers, alerts, teams, and insights.",
  },
];

export const companyPillars = [
  {
    icon: ShieldCheck,
    title: "Reliable control",
    description:
      "We help teams reduce guesswork with inventory records that stay organized and easy to audit.",
  },
  {
    icon: Sparkles,
    title: "Simple adoption",
    description:
      "The interface stays direct, so warehouse teams and business owners can move quickly without heavy setup.",
  },
  {
    icon: Globe2,
    title: "Built to scale",
    description:
      "Start with one location and grow into multi-warehouse operations without changing systems.",
  },
];

export const partners: Partner[] = [
  { name: "Northline Retail", category: "Retail operations" },
  { name: "Harbor Supply Co.", category: "Wholesale distribution" },
  { name: "Metro Parts Group", category: "Parts inventory" },
  { name: "Summit Warehousing", category: "Third-party logistics" },
  { name: "FreshRoute Foods", category: "Food supply chain" },
  { name: "Urban Depot", category: "Multi-site stockrooms" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "StockLogic gave our purchasing and warehouse teams the same view of stock. The biggest change was how quickly we could trust what was available.",
    name: "Maya Okafor",
    role: "Operations Lead",
    company: "Northline Retail",
  },
  {
    quote:
      "The platform is practical. We can review transfers, low-stock items, and product records without jumping between spreadsheets.",
    name: "Jon Bell",
    role: "Warehouse Manager",
    company: "Harbor Supply Co.",
  },
  {
    quote:
      "Our team adopted it quickly because the system mirrors how inventory work actually happens during the day.",
    name: "Alicia Morgan",
    role: "Inventory Controller",
    company: "Metro Parts Group",
  },
];

export const socials: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "Facebook", href: "https://www.facebook.com" },
  { label: "YouTube", href: "https://www.youtube.com" },
];
