import { LayoutDashboard, Map, Bomb, Swords, Dumbbell, Trophy, LineChart, Target, Library, Heart, Settings } from "lucide-react";
import type { UIKey } from "@/i18n";

export const NAV_MAIN: { to: string; key: UIKey; icon: typeof Map; end?: boolean; mobile?: boolean }[] = [
  { to: "/", key: "nav.home", icon: LayoutDashboard, end: true, mobile: true },
  { to: "/prep", key: "nav.prep", icon: Target, mobile: true },
  { to: "/maps", key: "nav.maps", icon: Map, mobile: true },
  { to: "/grenades", key: "nav.grenades", icon: Bomb, mobile: true },
  { to: "/tactics", key: "nav.tactics", icon: Swords },
  { to: "/training", key: "nav.training", icon: Dumbbell, mobile: true },
  { to: "/playbook", key: "nav.playbook", icon: Trophy },
  { to: "/progress", key: "nav.progress", icon: LineChart },
];

export const NAV_SECONDARY: { to: string; key: UIKey; icon: typeof Map }[] = [
  { to: "/favorites", key: "nav.favorites", icon: Heart },
  { to: "/library", key: "nav.sources", icon: Library },
  { to: "/settings", key: "nav.settings", icon: Settings },
];
