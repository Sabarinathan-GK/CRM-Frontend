
import { useEffect, useState } from "react";
import {
  Users,
  UserRound,
  BriefcaseBusiness,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const initialStats = {
  totalUsers: 0,
  totalCustomers: 0,
  totalLeads: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/dashboard/stats");

      // Supports either { stats: {...} } or a direct stats object.
      const data = response.data?.stats ?? response.data;

      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalCustomers: data.totalCustomers ?? 0,
        totalLeads: data.totalLeads ?? 0,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: UserRound,
      color: "bg-violet-100 text-violet-700",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: BriefcaseBusiness,
      color: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 md:ml-64">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Overview of your CRM activity.
              </p>
            </div>

            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
              <button
                onClick={fetchStats}
                className="ml-2 font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>
                    <div className={`rounded-lg p-3 ${card.color}`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <p className="mt-4 text-3xl font-bold text-slate-800">
                    {loading ? "..." : card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Getting started
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Use Customers to manage customer records and Leads to track
              potential business opportunities.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
