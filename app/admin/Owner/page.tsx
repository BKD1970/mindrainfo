"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { requireAdminRole } from "@/lib/admin-auth";

export default function OwnerDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<{
    email: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkOwnerAccess() {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      if (!session?.user) {
        router.replace("/admin/login?role=owner");
        return;
      }

      const { data, error } = await supabaseBrowser
        .from("admin_users")
        .select("email, is_owner")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Owner access check failed:", error);
        router.replace("/admin");
        return;
      }

      if (!data || data.is_owner !== true) {
        router.replace("/admin");
        return;
      }

      if (!mounted) return;

      setAdminUser({
        email: data.email,
      });

      setAuthorized(true);
      setLoading(false);
    }

    checkOwnerAccess();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    router.replace("/admin/login?role=owner");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-white/60">
            Loading Owner Dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-400">
              MindraInfo Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Owner Dashboard
            </h1>

            {adminUser?.email && (
              <p className="mt-2 text-sm text-white/50">
                Signed in as {adminUser.email}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Sign Out
          </button>
        </div>

        {/* Dashboard cards */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Owner Controls
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/50">
            Manage MindraInfo administrative operations from this
            Owner area.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Business Consultation */}
            <Link
              href="/admin/Owner/business-consultation-requests"
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.07]"
            >
              <div className="text-3xl">💼</div>

              <h3 className="mt-4 text-lg font-bold">
                Business Consultation Requests
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/50">
                View entrepreneur enquiries, review submitted
                project proposals, and manage consultation status.
              </p>

              <div className="mt-5 text-sm font-semibold text-amber-400 transition group-hover:text-amber-300">
                Open Requests →
              </div>
            </Link>

            {/* Future section */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="text-3xl">⚙️</div>

              <h3 className="mt-4 text-lg font-bold">
                Owner Settings
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Additional owner-level controls can be added here
                later.
              </p>

              <div className="mt-5 text-sm font-semibold text-white/30">
                Coming Soon
              </div>
            </div>

            {/* Future section */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="text-3xl">📊</div>

              <h3 className="mt-4 text-lg font-bold">
                Business Overview
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Owner-level statistics and operational information
                can be added here later.
              </p>

              <div className="mt-5 text-sm font-semibold text-white/30">
                Coming Soon
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}