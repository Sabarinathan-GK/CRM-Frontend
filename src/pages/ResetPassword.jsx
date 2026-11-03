
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import api from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/auth/reset-password/${token}`,
        { password, confirmPassword }
      );

      setMessage(
        response.data.message || "Password reset successful."
      );

      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <LockKeyhole size={28} />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Confirm new password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
