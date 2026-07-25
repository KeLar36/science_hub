/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import { AuthProvider } from "@/shared/lib/context/AuthContext";
import { useAuth } from "@/shared/lib/hooks/useAuth";

import ScrollToTop from "@/components/ScrollToTop";
import Loader from "@/shared/ui/Loader";

const ContentManagerPage = lazy(
  () => import("@/features/content-manager/pages/ContentManagerPage"),
);
const SubmitProjectPage = lazy(
  () => import("@/features/user/pages/SubmitProjectPage"),
);
const OrganizationDashboardPage = lazy(
  () => import("@/features/organization/pages/OrganizationDashboard"),
);
const HomePage = lazy(() => import("@/pages/homePage"));
const AboutPage = lazy(() => import("@/pages/aboutPage"));
const RulesPage = lazy(() => import("@/pages/RulesPage"));
const ArchivePage = lazy(() => import("@/features/projects/pages/ArchivePage"));
const ProgramsPage = lazy(
  () => import("@/features/programs/pages/ProgramsPage"),
);
const ProgramDetailsPage = lazy(
  () => import("@/features/programs/pages/ProgramDetails"),
);

const Blog = lazy(() => import("@/features/blog/pages/BlogPage"));
const PostDetail = lazy(() => import("@/features/blog/pages/PostDetail"));
const AuthPage = lazy(() => import("@/features/auth/pages/AuthPage"));
const ProfilePage = lazy(() => import("@/features/user/pages/ProfilePage"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

function AppContent() {
  return (
    <Router>
      <ScrollToTop />

      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
          {/* ================================================================ */}
          {/* 1. ПУБЛІЧНИЙ ШАР (Вільний доступ для всіх відвідувачів)         */}
          {/* ================================================================ */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:id" element={<ProgramDetailsPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<PostDetail />} />

          {/* ================================================================ */}
          {/* 2. ШАР АВТОРИЗАЦІЇ (Доступні лише неавторизованим)              */}
          {/* ================================================================ */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/forgot-password" element={<AuthPage />} />
          <Route path="/reset-password/:token" element={<AuthPage />} />

          {/* ================================================================ */}
          {/* 3. РУТИ ДЛЯ АВТОРИЗОВАНИХ КОРИСТУВАЧІВ                           */}
          {/* ================================================================ */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/submit"
            element={
              <ProtectedRoute>
                <SubmitProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization/dashboard"
            element={
              <ProtectedRoute>
                <OrganizationDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* ================================================================ */}
          {/* 4. Захищені шляхи (Створення, редагування блогу)               */}
          {/* ================================================================ */}
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute>
                <ContentManagerPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
