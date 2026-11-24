import { lazy } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { ContentProvider } from "@/services/content";

const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const MapsPage = lazy(() => import("@/features/maps/MapsPage").then((m) => ({ default: m.MapsPage })));
const MapDetailPage = lazy(() => import("@/features/maps/MapDetailPage").then((m) => ({ default: m.MapDetailPage })));
const GrenadeLabPage = lazy(() => import("@/features/grenades/GrenadeLabPage").then((m) => ({ default: m.GrenadeLabPage })));
const TacticsPage = lazy(() => import("@/features/tactics/TacticsPage").then((m) => ({ default: m.TacticsPage })));
const TacticDetailPage = lazy(() => import("@/features/tactics/TacticDetailPage").then((m) => ({ default: m.TacticDetailPage })));
const TrainingPage = lazy(() => import("@/features/training/TrainingPage").then((m) => ({ default: m.TrainingPage })));
const SessionPage = lazy(() => import("@/features/training/SessionPage").then((m) => ({ default: m.SessionPage })));
const PlaybookPage = lazy(() => import("@/features/playbook/PlaybookPage").then((m) => ({ default: m.PlaybookPage })));
const ProgressPage = lazy(() => import("@/features/progress/ProgressPage").then((m) => ({ default: m.ProgressPage })));
const LibraryPage = lazy(() => import("@/features/library/LibraryPage").then((m) => ({ default: m.LibraryPage })));
const FavoritesPage = lazy(() => import("@/features/favorites/FavoritesPage").then((m) => ({ default: m.FavoritesPage })));
const MatchPrepPage = lazy(() => import("@/features/prep/MatchPrepPage").then((m) => ({ default: m.MatchPrepPage })));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })));

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ContentProvider>
        <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="prep" element={<MatchPrepPage />} />
              <Route path="maps" element={<MapsPage />} />
              <Route path="maps/:id" element={<MapDetailPage />} />
              <Route path="grenades" element={<GrenadeLabPage />} />
              <Route path="tactics" element={<TacticsPage />} />
              <Route path="tactics/:id" element={<TacticDetailPage />} />
              <Route path="training" element={<TrainingPage />} />
              <Route path="training/session" element={<SessionPage />} />
              <Route path="playbook" element={<PlaybookPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </ContentProvider>
    </MotionConfig>
  );
}
