
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setMessage(
        response.data?.message ||
          "If an account exists for this email, password reset instructions will be sent."
      );
    } catch (error) {
  console.error("Forgot password error:", error);
  console.error("Response status:", error.response?.status);
  console.error("Response data:", error.response?.data);

  setMessage(
    error.response?.data?.message ||
      error.message ||
      "Something went wrong"
  );
}
    // catch (err) {
    //   console.error(
    //     "Forgot password error:",
    //     err.response?.data || err.message
    //   );

    //   setError(
    //     err.response?.data?.message ||
    //       "Unable to process your request. Please try again."
    //   );
    // } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
          Forgot Password?
        </h1>

        <p className="mb-6 text-center text-slate-500">
          Enter your registered email to request password reset instructions.
        </p>

        {message && (
          <div
            role="status"
            className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Request Password Reset"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
