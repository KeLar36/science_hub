/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import "react-datepicker/dist/react-datepicker.css";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/profilePage";
import SuperAdminPage from "./adminPanels/superadmin/SuperAdminPage";
import OrgAdminPage from "./adminPanels/orgAdmin/OrgAdminPage";
import AboutPage from "./pages/aboutPage";
import ProgramDetails from "./pages/ProgramDetails";
import ReviewerPage from "./pages/ReviewerPage";
import ContentPanel from "./pages/ContentPanel";
import CreatePost from "./pages/CreatePost";
import Blog from "./pages/BlogPage";
import PostDetail from "./pages/PostDetail";
import RulesPage from "./pages/RulesPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ArchivePage from "./pages/ArchivePage";
import ScrollToTop from "./components/ScrollToTop";
import AOS from "aos";
import "aos/dist/aos.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--purple-main)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
      offset: 100,
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<PostDetail />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/program/:id" element={<ProgramDetails />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/archive" element={<ArchivePage />} />

        <Route
          path="/content-panel"
          element={
            <ProtectedRoute
              allowedRoles={["content-manager", "admin", "superadmin"]}
            >
              <ContentPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-management"
          element={
            <ProtectedRoute
              allowedRoles={["content-manager", "admin", "superadmin"]}
            >
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute
              allowedRoles={["content-manager", "admin", "superadmin"]}
            >
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/org-admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <OrgAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviewer"
          element={
            <ProtectedRoute allowedRoles={["reviewer", "superadmin"]}>
              <ReviewerPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
