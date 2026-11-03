
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  Plus,
  X,
} from "lucide-react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  status: "active",
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState(initialFormData);

  const pageSize = 10;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/customers", {
        params: {
          search: search.trim(),
          status,
          page,
          limit: pageSize,
        },
      });

      const data = response.data;
      const customerList =
        data.customers ??
        data.data?.customers ??
        data.data ??
        [];

      const list = Array.isArray(customerList) ? customerList : [];

      setCustomers(list);

      const paginationData =
        data.pagination ?? data.data?.pagination ?? {};

      const total =
        paginationData.total ?? data.total ?? list.length;

      setPagination({
        total,
        totalPages:
          paginationData.totalPages ??
          data.totalPages ??
          Math.max(1, Math.ceil(total / pageSize)),
      });
    } catch (err) {
      setCustomers([]);
      setError(
        err.response?.data?.message ||
          "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCreateCustomer = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    setSuccessMessage("");

    try {
      await api.post("/customers", formData);

      setFormData({ ...initialFormData });
      setShowForm(false);
      setSearch("");
      setStatus("");
      setPage(1);
      setSuccessMessage("Customer created successfully.");

      // Refresh the list after the new customer is saved.
      // State updates may take effect after this function returns,
      // so fetchCustomers will run again when filters/page change.
      await fetchCustomers();
    } catch (err) {
      const validationErrors = err.response?.data?.errors;

      setFormError(
        Array.isArray(validationErrors)
          ? validationErrors.map((item) => item.msg).join(", ")
          : err.response?.data?.message ||
              "Unable to create customer."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
    setSuccessMessage("");
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
    setSuccessMessage("");
  };

  const openCreateForm = () => {
    setFormData({ ...initialFormData });
    setFormError("");
    setShowForm(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 md:ml-64">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="p-6">
          {/* Page heading */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Customers
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View and manage your customer records.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={fetchCustomers}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <button
                type="button"
                onClick={openCreateForm}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Customer
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {/* Create customer form */}
          {showForm && (
            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                  Create Customer
                </h2>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleCreateCustomer}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      required
                      maxLength={100}
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          name: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      maxLength={254}
                      value={formData.email}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          email: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                      placeholder="customer@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      maxLength={20}
                      value={formData.phone}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          phone: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          status: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {formError && (
                  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {formError}
                  </p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormError("");
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Customer"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Customer table */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by name or email..."
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={status}
                onChange={handleStatusChange}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        Loading customers...
                      </td>
                    </tr>
                  ) : customers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center">
                        <Users
                          className="mx-auto mb-2 text-slate-400"
                          size={28}
                        />
                        <p className="text-slate-600">
                          No customers found.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr
                        key={customer._id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 font-medium text-slate-800">
                          {customer.name || "—"}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {customer.email || "—"}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {customer.phone || "—"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              customer.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {customer.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                Total customers: {pagination.total}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  disabled={page <= 1 || loading}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-600">
                  Page {page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        pagination.totalPages,
                        current + 1
                      )
                    )
                  }
                  disabled={
                    page >= pagination.totalPages || loading
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
