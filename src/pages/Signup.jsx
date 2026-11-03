
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const { password, confirmPassword } = formData;

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      console.error(
        "Signup error:",
        err.response?.data || err.message
      );

      const responseData = err.response?.data;
      const validationErrors = responseData?.errors;

      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(
          validationErrors.map((item) => item.msg).filter(Boolean).join(". ")
        );
      } else if (
        err.response?.status === 409 ||
        /already exists|already registered|duplicate/i.test(
          responseData?.message || ""
        )
      ) {
        setError("This email is already registered. Please sign in instead.");
      } else {
        setError(
          responseData?.message ||
          responseData?.error ||
          "Unable to create account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
          Create Account
        </h1>

        <p className="mb-6 text-center text-slate-500">
          Register to access your CRM account
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700"
          >
            {error}
            {error.toLowerCase().includes("already registered") && (
              <div className="mt-2">
                <Link
                  to="/login"
                  className="font-semibold underline"
                >
                  Go to Sign In
                </Link>
              </div>
            )}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              maxLength={100}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>


          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
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
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
