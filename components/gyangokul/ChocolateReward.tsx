"use client";

interface ChocolateRewardProps {
  score: number;
}

export default function ChocolateReward({
  score,
}: ChocolateRewardProps) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-black text-orange-600">
        Krishna gives you {score}{" "}
        {score === 1 ? "chocolate" : "chocolates"}! 🍫
      </h2>

      {score === 0 ? (
        <p className="mt-4 text-lg font-semibold text-gray-500">
          Keep playing and collect chocolates in your next session! 🌟
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-5 justify-items-center gap-4 sm:grid-cols-10">
          {Array.from({ length: score }).map((_, index) => (
            <div
              key={index}
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-4xl shadow-md transition-transform hover:scale-110"
              aria-label={`Chocolate ${index + 1}`}
            >
              🍫
            </div>
          ))}
        </div>
      )}
    </section>
  );
}