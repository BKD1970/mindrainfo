"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "This password reset link is invalid or has expired. Please request a new reset email."
        );
        return;
      }

      setReady(true);
    };

    checkSession();
  }, []);

  const handleUpdatePassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    const { error: updateError } =
      await supabase.auth.updateUser({
        password,
      });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setMessage(
      "Password updated successfully. Redirecting to admin login..."
    );

    await supabase.auth.signOut();

    setTimeout(() => {
      router.replace("/admin/login");
    }, 1500);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-4 py-10">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-gray-200">
            <span className="text-2xl font-black tracking-tight">
              <span className="text-emerald-600">
                Mindra
              </span>
              <span>Info</span>
            </span>
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Private Administration
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-xl sm:p-9">

          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Set New Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Create a new password for your MindraInfo admin
            account.
          </p>

          {!ready && !error && (
            <div className="mt-6 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Checking reset link...
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
              {message}
            </div>
          )}

          {ready && !message && (
            <form
              onSubmit={handleUpdatePassword}
              className="mt-7 space-y-5"
            >

              {/* NEW PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter new password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                  >
                    {showPassword ? (
                      /* EYE OFF */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.58 10.58a2 2 0 002.84 2.84"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.88 5.09A9.77 9.77 0 0112 4.5c5.25 0 9.3 4.5 10.5 7.5a16.5 16.5 0 01-3.08 4.45"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.61 6.61C4.85 7.78 3.6 9.43 1.5 12c1.2 3 5.25 7.5 10.5 7.5 1.73 0 3.27-.4 4.61-1.08"
                        />
                      </svg>
                    ) : (
                      /* EYE */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Enter new password again"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                  >
                    {showConfirmPassword ? (
                      /* EYE OFF */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.58 10.58a2 2 0 002.84 2.84"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.88 5.09A9.77 9.77 0 0112 4.5c5.25 0 9.3 4.5 10.5 7.5a16.5 16.5 0 01-3.08 4.45"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.61 6.61C4.85 7.78 3.6 9.43 1.5 12c1.2 3 5.25 7.5 10.5 7.5 1.73 0 3.27-.4 4.61-1.08"
                        />
                      </svg>
                    ) : (
                      /* EYE */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Updating Password..."
                  : "Update Password"}
              </button>

            </form>
          )}

          <div className="mt-6 text-center">
            <a
              href="/admin/login"
              className="text-sm font-semibold text-gray-500 transition hover:text-emerald-600"
            >
              ← Back to Admin Login
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}