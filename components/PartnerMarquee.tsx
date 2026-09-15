export default function PartnerMarquee() {
  const logos = [
    "/partners/partner1.png",
    "/partners/partner2.png",
    "/partners/partner3.png",
    "/partners/partner4.png",
    "/partners/partner5.png",
  ];

  return (
    <div className="mt-5 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/95 py-4 shadow-lg">
      <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
        Our Partners
      </div>

      <div className="group overflow-hidden">
        <div className="partner-marquee-track flex w-max items-center gap-10 px-5">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="flex h-12 w-28 shrink-0 items-center justify-center"
            >
              <img
                src={logo}
                alt="MindraInfo partner"
                className="max-h-10 max-w-24 object-contain opacity-90 transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .partner-marquee-track {
          animation: partner-marquee 28s linear infinite;
        }

        .group:hover .partner-marquee-track {
          animation-play-state: paused;
        }

        @keyframes partner-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}