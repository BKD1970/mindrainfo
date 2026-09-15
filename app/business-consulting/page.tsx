import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import BusinessConsultingForm from "@/components/BusinessConsultingForm";

export const metadata: Metadata = {
  title: "Business Consulting",
  description:
    "Have a business idea? MindraInfo helps entrepreneurs plan, structure and build businesses step by step.",
};

export default function BusinessConsultingPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-slate-900">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-amber-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-72 h-[360px] w-[360px] rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-20 sm:px-6 sm:pb-20 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-700 shadow-sm">
              💼 MindraInfo Business Consulting
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              Start building your business.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Have a business idea but do not know where to start?
              Tell us about your idea and the kind of help you need.
              We can help you plan, structure and build your business
              step by step.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <BusinessConsultingForm />
          </div>
        </div>
      </section>
    </main>
  );
}
