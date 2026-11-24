import { LayoutDashboard, Map, Bomb, Swords, Dumbbell, Trophy, LineChart, Target, Library, Heart, Settings } from "lucide-react";

export const NAV_MAIN = [
  { to: "/", label: "Главная", icon: LayoutDashboard, end: true },
  { to: "/prep", label: "Перед матчем", icon: Target },
  { to: "/maps", label: "Карты", icon: Map },
  { to: "/grenades", label: "Гранаты", icon: Bomb },
  { to: "/tactics", label: "Тактики", icon: Swords },
  { to: "/training", label: "Тренировки", icon: Dumbbell },
  { to: "/playbook", label: "Pro Playbook", icon: Trophy },
  { to: "/progress", label: "Прогресс", icon: LineChart },
] as const;

export const NAV_SECONDARY = [
  { to: "/favorites", label: "Избранное", icon: Heart },
  { to: "/library", label: "Источники", icon: Library },
  { to: "/settings", label: "Настройки", icon: Settings },
] as const;
