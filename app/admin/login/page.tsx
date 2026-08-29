"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

type AdminRole =
  | "owner"
  | "jobs"
  | "articles"
  | "shop"
  | "technology"
  | "orders";

const ROLE_INFO: Record<
  AdminRole,
  {
    title: string;
    description: string;
  }
> = {
  owner: {
    title: "Owner Sign In",
    description:
      "Sign in to access the MindraInfo administration panel.",
  },
  jobs: {
    title: "Admin Sign In",
    description:
      "Sign in to access the MindraInfo Job Manager panel.",
  },
  articles: {
    title: "Admin Sign In",
    description:
      "Sign in to access the MindraInfo Article Manager panel.",
  },
  shop: {
    title: "Admin Sign In",
    description:
      "Sign in to access the MindraInfo Shop Manager panel.",
  },
  technology: {
    title: "Admin Sign In",
    description:
      "Sign in to access the MindraInfo Technology Manager panel.",
  },
  orders: {
    title: "Admin Sign In",
    description:
      "Sign in to access the MindraInfo Order Manager panel.",
  },
};

function getValidRole(value: string | null): AdminRole {
  if (
    value === "owner" ||
    value === "jobs" ||
    value === "articles" ||
    value === "shop" ||
    value === "technology" ||
    value === "orders"
  ) {
    return value;
  }

  return "owner";
}

function AdminLoginContent() {
  const searchParams = useSearchParams();

  const role = getValidRole(searchParams.get("role"));
  const currentRole = ROLE_INFO[role];
  const isOwner = role === "owner";

  const [mode, setMode] = useState<"login" | "forgot">(
    "login"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const {
        data: authData,
        error: loginError,
      } =
        await supabaseBrowser.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!authData.user) {
        throw new Error("Unable to sign in.");
      }

      const {
        data: adminUser,
        error: adminError,
      } = await supabaseBrowser
        .from("admin_users")
        .select(
          `
            id,
            email,
            is_owner,
            can_manage_jobs,
            can_manage_articles,
            can_manage_shop,
            can_manage_technology,
            can_manage_orders,
            can_manage_users
          `
        )
        .eq("id", authData.user.id)
        .single();

      if (adminError || !adminUser) {
        await supabaseBrowser.auth.signOut();

        throw new Error(
          "Your account does not have admin access."
        );
      }

      let hasPermission = false;

      if (adminUser.is_owner === true) {
        hasPermission = true;
      } else {
        switch (role) {
          case "jobs":
            hasPermission =
              adminUser.can_manage_jobs === true;
            break;

          case "articles":
            hasPermission =
              adminUser.can_manage_articles === true;
            break;

          case "shop":
            hasPermission =
              adminUser.can_manage_shop === true;
            break;

          case "technology":
            hasPermission =
              adminUser.can_manage_technology === true;
            break;

          case "orders":
            hasPermission =
              adminUser.can_manage_orders === true;
            break;

          case "owner":
            hasPermission = false;
            break;

          default:
            hasPermission = false;
        }
      }

      if (!hasPermission) {
        await supabaseBrowser.auth.signOut();

        throw new Error(
          "You do not have permission to access this administration panel."
        );
      }

      const destinations: Record<
        AdminRole,
        string
      > = {
        owner: "/admin",
        jobs: "/admin/jobsmanager",
        articles: "/admin/articlesmanager",
        shop: "/admin/shopmanager",
        technology:
          "/admin/technologytopicsmanager",
        orders: "/admin/ordersmanager",
      };

      window.location.replace(
        destinations[role]
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const cleanEmail = email.trim();

      if (!cleanEmail) {
        throw new Error(
          "Please enter your email address."
        );
      }

      const resetUrl =
        `${window.location.origin}/auth/reset-password?role=${encodeURIComponent(
          role
        )}`;

      const { error: resetError } =
        await supabaseBrowser.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo: resetUrl,
          }
        );

      if (resetError) {
        throw resetError;
      }

      setMessage(
        "Password reset email sent. Please check your email and click the reset link."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send password reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`flex min-h-screen items-center justify-center px-4 py-10 ${
        isOwner
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950"
          : "bg-[#f7f7f4]"
      }`}
    >
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div
            className={`mb-4 inline-flex items-center justify-center rounded-2xl px-5 py-3 shadow-lg ${
              isOwner
                ? "border border-amber-400/40 bg-slate-900/80 shadow-amber-500/10"
                : "bg-white ring-1 ring-gray-200"
            }`}
          >
            <span className="text-2xl font-black tracking-tight">
              <span
                className={
                  isOwner
                    ? "text-amber-400"
                    : "text-emerald-600"
                }
              >
                Mindra
              </span>

              <span
                className={
                  isOwner
                    ? "text-white"
                    : "text-gray-900"
                }
              >
                Info
              </span>
            </span>
          </div>

          <p
            className={`text-sm font-bold uppercase tracking-[0.2em] ${
              isOwner
                ? "text-amber-400"
                : "text-emerald-600"
            }`}
          >
            Private Administration
          </p>
        </div>

        <div
          className={`rounded-3xl p-7 sm:p-9 ${
            isOwner
              ? "border border-amber-400/30 bg-slate-900/90 shadow-2xl shadow-amber-950/40"
              : "border border-gray-200 bg-white shadow-xl"
          }`}
        >
          {mode === "login" ? (
            <>
              <div className="mb-7">
                <h1
                  className={`text-3xl font-black tracking-tight ${
                    isOwner
                      ? "text-amber-300"
                      : "text-gray-900"
                  }`}
                >
                  {currentRole.title}
                </h1>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    isOwner
                      ? "text-slate-300"
                      : "text-gray-500"
                  }`}
                >
                  {currentRole.description}
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Enter your admin email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                        setMessage("");
                      }}
                      className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-20 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign In"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">
                  Reset Password
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Enter your admin email and we'll send you a
                  password reset link.
                </p>
              </div>

              <form
                onSubmit={handleForgotPassword}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="reset-email"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Admin Email
                  </label>

                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Enter your admin email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setMessage("");
                  }}
                  className="w-full text-sm font-semibold text-gray-500 transition hover:text-emerald-600"
                >
                  ← Back to Sign In
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm font-semibold text-gray-500 transition hover:text-emerald-600"
          >
            ← Back to MindraInfo
          </a>
        </div>

      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 text-white">
          <div className="text-center">
            <div className="text-2xl font-black">
              <span className="text-cyan-400">
                Mindra
              </span>
              <span>Info</span>
            </div>

            <p className="mt-3 text-sm text-white/50">
              Loading admin login...
            </p>
          </div>
        </main>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}