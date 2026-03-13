/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/profilePage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/aboutPage";
import ProgramDetails from "./pages/ProgramDetails";
import ReviewerPage from "./pages/ReviewerPage";
import ContentPanel from "./pages/ContentPanel";
import CreatePost from "./pages/CreatePost";
import Blog from "./pages/BlogPage";
import PostDetail from "./pages/PostDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ScrollToTop from "./components/ScrollToTop";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
      offset: 100,
    });
  }, []);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthenticated = !!token;

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

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

        <Route
          path="/content-panel"
          element={
            <ProtectedRoute allowedRoles={["content-manager", "admin"]}>
              <ContentPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/content-management"
          element={
            <ProtectedRoute allowedRoles={["content-manager", "admin"]}>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute allowedRoles={["content-manager", "admin"]}>
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
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviewer"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
