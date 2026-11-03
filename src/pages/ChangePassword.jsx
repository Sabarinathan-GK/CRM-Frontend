
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function ChangePassword() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (formData.newPassword.length < 6) {
            setError("New password must contain at least 6 characters.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.put("/auth/change-password", formData);

            setMessage(response.data.message);

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to change password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        {
            name: "currentPassword",
            label: "Current Password",
        },
        {
            name: "newPassword",
            label: "New Password",
        },
        {
            name: "confirmPassword",
            label: "Confirm New Password",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-xl">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                        <LockKeyhole size={24} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Change Password
                        </h1>
                        <p className="text-sm text-gray-500">
                            Update your account password securely.
                        </p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="mb-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {message}
                        </div>
                    )}

                    {fields.map((field) => (
                        <div key={field.name}>
                            <label
                                htmlFor={field.name}
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                {field.label}
                            </label>

                            <input
                                id={field.name}
                                name={field.name}
                                type="password"
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                                autoComplete={
                                    field.name === "currentPassword"
                                        ? "current-password"
                                        : "new-password"
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
