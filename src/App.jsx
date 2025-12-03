// src/App.jsx
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyOTP from "@/pages/VerifyOTP";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Team from "@/pages/Team";
import Settings from "@/pages/Settings";

// Auth context moved to `src/context/AuthContext.jsx`
// Layout
function AppLayout() {
  // useAuth is provided by the context in src/context/AuthContext.jsx
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const location = useLocation();
  const noLayoutPaths = ["/login", "/signup", "/forgot-password", "/verify-otp"];
  const isAuthPage = noLayoutPaths.includes(location.pathname);

  if (isAuthPage || !user) return <Outlet />;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

// ────────────────────────────────────────────────────────────────
// Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

// ────────────────────────────────────────────────────────────────
// Public Route (Redirect if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/home" replace /> : children;
}

// ────────────────────────────────────────────────────────────────
// Logout Route Component
function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // logout will handle clearing storage and redirecting
    logout();
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Déconnexion en cours...</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />

        {/* Logout Route */}
        <Route path="/logout" element={<LogoutPage />} />

        {/* Protected App (use /home as main protected route) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Root */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}   