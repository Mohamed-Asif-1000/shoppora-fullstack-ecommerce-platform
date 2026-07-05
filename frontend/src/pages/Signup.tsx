import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";
import { Mail, Lock, User, Store, Truck, BarChart3 } from "lucide-react";

export default function Signup(): React.JSX.Element {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "username") {
      const usernameRegex = /^[A-Za-z0-9@._-]*$/;

      if (!usernameRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          username:
            "Spaces and special characters are not allowed. Use only letters, numbers, _, -, ., @",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          username: "",
        }));
      }

      return;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleRole = (role: string) => {
    setForm({
      ...form,

      role,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await signupUser(form);

      if (response.message || response.id || response.username) {
        alert("Signup successful");

        navigate("/login");
      } else {
        setErrors(response);
      }
    } catch (error) {
      console.error(error);

      if (typeof error === "object" && error !== null) {
        setErrors(error as Record<string, string>);
      } else {
        alert("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-r from-violet-950 via-purple-950 to-indigo-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-pink-600">
              <span className="text-xl font-bold text-white">S</span>
            </div>

            <span className="text-3xl font-bold text-pink-400">Shoppora</span>
          </div>

          <p className="text-slate-400">Create your account</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="space-y-6 rounded-2xl border border-slate-700 bg-slate-800/50 p-8"
        >
          <div>
            <label className="text-sm text-white">Username</label>

            <div className="relative mt-2">
              <User className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="John_Doe"
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 py-2.5 pl-10 text-white"
              />
            </div>

            {errors.username && (
              <p className="mt-1 text-sm text-red-400">
                {Array.isArray(errors.username)
                  ? errors.username[0]
                  : errors.username}
              </p>
            )}

            <p className="mt-1 text-xs text-slate-400">
              Username can contain letters, numbers, _, -, ., and @ only.
            </p>
          </div>

          <div>
            <label className="text-sm text-white">Email</label>

            <div className="relative mt-2">
              <Mail className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 py-2.5 pl-10 text-white"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-white">Password</label>

            <div className="relative mt-2">
              <Lock className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 py-2.5 pl-10 text-white"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {Array.isArray(errors.password)
                  ? errors.password[0]
                  : errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="mb-3 block text-sm text-white">
              Account Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRole("customer")}
                className={`rounded-lg border p-3 ${
                  form.role === "customer"
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-slate-600"
                }`}
              >
                <User className="mx-auto text-white" />

                <p className="text-white">Customer</p>
              </button>

              <button
                type="button"
                onClick={() => handleRole("seller")}
                className={`rounded-lg border p-3 ${
                  form.role === "seller"
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-slate-600"
                }`}
              >
                <Store className="mx-auto text-white" />

                <p className="text-white">Seller</p>
              </button>

              <button
                type="button"
                disabled
                className="rounded-lg border border-slate-600 bg-slate-700/30 p-3 opacity-50"
              >
                <BarChart3 className="mx-auto text-white" />

                <p className="text-white">Admin</p>
              </button>

              <button
                type="button"
                onClick={() => handleRole("delivery")}
                className={`rounded-lg border p-3 ${
                  form.role === "delivery"
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-slate-600"
                }`}
              >
                <Truck className="mx-auto text-white" />

                <p className="text-white">Delivery</p>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-500 py-3 font-semibold text-white hover:bg-pink-600"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have account?
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="ml-2 text-pink-400"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
