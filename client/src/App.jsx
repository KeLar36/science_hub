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
const AboutPage = lazy(() => import("./pages/aboutPage"));
const Blog = lazy(() => import("./pages/BlogPage"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const RulesPage = lazy(() => import("./pages/RulesPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ArchivePage = lazy(() => import("./pages/ArchivePage"));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage"));
const ProgramDetails = lazy(() => import("./pages/ProgramDetails"));
const DashboardLayout = lazy(
  () => import("./components/operator/DashboardLayout"),
);
const SuperAdminPage = lazy(() => import("./pages/admin/SuperAdminPage"));
const OrgAdminPage = lazy(() => import("./pages/admin/OrgAdminPage"));
const ReviewerPage = lazy(() => import("./pages/ReviewerPage"));
const ContentPanel = lazy(() => import("./pages/ContentPanel"));
const CreatePost = lazy(() => import("./pages/CreatePost"));

const PageLoader = () => (
  <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Якщо ролі передано, і користувач не має потрібної ролі
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
          <Route path="/programs" element={<ProgramsPage />} />
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
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "superadmin",
                  "admin",
                  "reviewer",
                  "content-manager",
                ]}
              >
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <div className="text-sm font-bold text-[var(--text-gray)] uppercase tracking-wider">
                  👋 Вітаємо в робочій зоні Science Platform!
                </div>
              }
            />

            <Route path="superadmin" element={<SuperAdminPage />} />

            <Route path="org-admin" element={<OrgAdminPage />} />

            <Route path="reviewer" element={<ReviewerPage />} />

            <Route path="content-panel" element={<ContentPanel />} />
            <Route path="content-management" element={<CreatePost />} />
            <Route path="edit-post/:id" element={<CreatePost />} />
          </Route>

          <Route
            path="/superadmin"
            element={<Navigate to="/dashboard/superadmin" replace />}
          />
          <Route
            path="/org-admin"
            element={<Navigate to="/dashboard/org-admin" replace />}
          />
          <Route
            path="/reviewer"
            element={<Navigate to="/dashboard/reviewer" replace />}
          />
          <Route
            path="/content-panel"
            element={<Navigate to="/dashboard/content-panel" replace />}
          />
          <Route
            path="/content-management"
            element={<Navigate to="/dashboard/content-management" replace />}
          />
          <Route
            path="/edit-post/:id"
            element={<Navigate to="/dashboard/edit-post/:id" replace />}
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
