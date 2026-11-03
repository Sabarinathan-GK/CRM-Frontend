
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />}/>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>

          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Unknown routes */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
