import {
  Zap, Droplets, Wrench, Wind, Laptop, Hammer, Flame, PaintRoller, Grid3x3, Cctv, Sun,
  Refrigerator, Smartphone, Wifi, HardHat, Users, HandHelping, Sparkles, Home, ChefHat,
  Truck, Package, Leaf, PartyPopper, Warehouse, type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  Zap, Droplets, Wrench, Wind, Laptop, Hammer, Flame, PaintRoller, Grid3x3, Cctv, Sun,
  Refrigerator, Smartphone, Wifi, HardHat, Users, HandHelping, Sparkles, Home, ChefHat,
  Truck, Package, Leaf, PartyPopper, Warehouse,
};

export function iconFor(name: string): LucideIcon {
  return categoryIcons[name] ?? Wrench;
}

export const NEPAL_CITIES = [
  "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Butwal",
  "Biratnagar", "Birgunj", "Dharan", "Nepalgunj", "Hetauda", "Itahari",
];

export const verificationMeta: Record<string, { label: string; className: string }> = {
  basic: { label: "Basic", className: "bg-muted text-muted-foreground" },
  silver: { label: "Silver Verified", className: "bg-secondary text-secondary-foreground" },
  gold: { label: "Gold Verified", className: "bg-accent/15 text-accent" },
  platinum: { label: "Platinum Pro", className: "bg-primary/10 text-primary" },
};

export function npr(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return `Rs ${Number(value).toLocaleString("en-IN")}`;
}
