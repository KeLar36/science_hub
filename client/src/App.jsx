/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import "react-datepicker/dist/react-datepicker.css";
import ScrollToTop from "./components/ScrollToTop";
import AOS from "aos";
import "aos/dist/aos.css";

const HomePage = lazy(() => import("./pages/homePage"));
const LoginPage = lazy(() => import("./pages/loginPage"));
const RegisterPage = lazy(() => import("./pages/registerPage"));
const ProfilePage = lazy(() => import("./pages/profilePage"));
const SuperAdminPage = lazy(
  () => import("./adminPanels/superadmin/SuperAdminPage"),
);
const OrgAdminPage = lazy(() => import("./adminPanels/orgAdmin/OrgAdminPage"));
const AboutPage = lazy(() => import("./pages/aboutPage"));
const ProgramDetails = lazy(() => import("./pages/ProgramDetails"));
const ReviewerPage = lazy(() => import("./pages/ReviewerPage"));
const ContentPanel = lazy(() => import("./pages/ContentPanel"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const Blog = lazy(() => import("./pages/BlogPage"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const RulesPage = lazy(() => import("./pages/RulesPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ArchivePage = lazy(() => import("./pages/ArchivePage"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[var(--purple-main)] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <PageLoader />; // Використовуємо наш новий компонент
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

      <Suspense fallback={<PageLoader />}>
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
