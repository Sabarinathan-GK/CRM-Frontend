import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h2>
        <p className="text-sm text-slate-500">
          Here's what's happening in your CRM.
        </p>
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
      >
        <Bell size={20} />
      </button>
    </header>
  );
}
