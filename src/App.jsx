import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyOTP from "@/pages/VerifyOTP";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";       
import Tasks from "@/pages/Tasks";           
import Team from "@/pages/Team";             
import Settings from "@/pages/Settings";    

function AppLayout() {
  const location = useLocation();

  const noLayoutPaths = ["/login", "/signup", "/forgot-password", "/verify-otp"];
  const isAuthPage = noLayoutPaths.includes(location.pathname);

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/app" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/app" replace /> : <Signup />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      <Route
        path="/app"
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated ? "/app" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}