"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

type DownloadItem = {
  productId: number;
  productName: string;
  quantity: number;
};

function DownloadPageContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [loadingProduct, setLoadingProduct] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function downloadProduct(productId: number) {
    if (!orderId) {
      setMessage("Order ID is missing.");
      return;
    }

    setLoadingProduct(productId);
    setMessage("");

    try {
      const response = await fetch("/api/downloads/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          productId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Unable to create download link.");
        return;
      }

      window.location.href = result.downloadUrl;
    } catch (error) {
      console.error("DOWNLOAD ERROR:", error);
      setMessage("Unable to connect to the download system.");
    } finally {
      setLoadingProduct(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            MindraInfo Shop
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Your Download
          </h1>

          <p className="mt-3 text-white/45">
            Your payment was successful. Your digital product is ready.
          </p>
        </div>

        {/* ORDER */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                Order ID
              </p>

              <p className="mt-1 font-bold">
                #{orderId || "Unknown"}
              </p>
            </div>

            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-400">
              Payment Successful
            </div>

          </div>

          {/* TEST PRODUCT */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Test Product
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Digital Product
                </p>
              </div>

              <button
                type="button"
                onClick={() => downloadProduct(4)}
                disabled={loadingProduct === 4}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingProduct === 4
                  ? "Preparing..."
                  : "Download"}
              </button>

            </div>

          </div>

          {/* MESSAGE */}
          {message && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-center text-sm text-red-300">
              {message}
            </div>
          )}

        </section>

        {/* BACK */}
        <div className="mt-8 text-center">

          <Link
            href="/shop"
            className="text-sm font-semibold text-white/40 transition hover:text-white"
          >
            ← Back to Shop
          </Link>

        </div>

      </div>
    </main>
  );
}

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
          <p className="text-white/50">
            Loading download page...
          </p>
        </main>
      }
    >
      <DownloadPageContent />
    </Suspense>
  );
}