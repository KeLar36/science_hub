import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import ProfilePage from './pages/profilePage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/aboutPage';
import ProgramDetails from './pages/ProgramDetails';
import ReviewerPage from './pages/ReviewerPage';
import ContentManagement from './pages/ContentManagement';
import Blog from './pages/BlogPage';
import PostDetail from './pages/PostDetail';

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!token;

  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/content-management" element={<ProtectedRoute allowedRole="content-manager">
        <ContentManagement />
        </ProtectedRoute>}/>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<PostDetail />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/program/:id" element={<ProgramDetails />} />

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
            <ProtectedRoute allowedRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviewer"
          element={
            <ProtectedRoute allowedRole="reviewer">
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