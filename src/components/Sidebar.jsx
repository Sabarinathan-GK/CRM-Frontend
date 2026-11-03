
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  LockKeyhole,
  LogOut,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Leads",
      path: "/leads",
      icon: BriefcaseBusiness,
    },
    {
      name: "Change Password",
      path: "/change-password",
      icon: LockKeyhole,
    },
  ];

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">
        <div>
          <h1 className="text-xl font-bold tracking-wide">CRM Portal</h1>
          <p className="mt-1 text-xs text-slate-400">
            Customer Relationship Management
          </p>
        </div>

        <button
          type="button"
          onClick={closeMobileMenu}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
          aria-label="Close navigation menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-700 px-4 py-5">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-800 p-3">
          <UserCircle size={36} className="shrink-0 text-slate-300" />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {user?.email || ""}
            </p>
            {user?.role && (
              <p className="mt-1 text-xs capitalize text-blue-400">
                {user.role}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-slate-900 px-4 py-3 text-white md:hidden">
        <h1 className="text-lg font-bold">CRM Portal</h1>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 md:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            onClick={closeMobileMenu}
            className="absolute inset-0 h-full w-full bg-black/50"
            aria-label="Close navigation overlay"
          />

          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
