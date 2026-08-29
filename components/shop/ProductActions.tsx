"use client";

import { useState } from "react";
import Link from "next/link";

type ProductActionsProps = {
  productId: number;
  productName: string;
  slug: string;
  productType: string | null;
  price: number | null;
  currency: string | null;
  stock: number | null;
};

export default function ProductActions({
  productId,
  productName,
  slug,
  productType,
  price,
  currency,
  stock,
}: ProductActionsProps) {
  const [added, setAdded] = useState(false);

  const isPhysical =
    productType?.toLowerCase() === "physical";

  const isOutOfStock =
    isPhysical && stock !== null && stock <= 0;

  function addToCart() {
    const existingCart = localStorage.getItem("mindraInfoCart");

    const cart = existingCart
      ? JSON.parse(existingCart)
      : [];

    const existingItem = cart.find(
      (item: { productId: number }) =>
        item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId,
        productName,
        slug,
        productType,
        price: Number(price ?? 0),
        currency: currency || "INR",
        quantity: 1,
      });
    }

    localStorage.setItem(
      "mindraInfoCart",
      JSON.stringify(cart)
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  function buyNow() {
    const cart = [
      {
        productId,
        productName,
        slug,
        productType,
        price: Number(price ?? 0),
        currency: currency || "INR",
        quantity: 1,
      },
    ];

    localStorage.setItem(
      "mindraInfoCart",
      JSON.stringify(cart)
    );

    window.location.href = "/shop/checkout";
  }

  if (isPhysical) {
    return (
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">

        <button
          type="button"
          onClick={addToCart}
          disabled={isOutOfStock}
          className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-bold transition hover:-translate-y-0.5 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isOutOfStock
            ? "Out of Stock"
            : added
              ? "✓ Added to Cart"
              : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={buyNow}
          disabled={isOutOfStock}
          className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-base font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now →
        </button>

      </div>
    );
  }

  return (
    <div className="mt-10">

      <button
        type="button"
        onClick={buyNow}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-base font-bold transition hover:-translate-y-0.5 md:w-auto"
      >
        Buy Now →
      </button>

      <p className="mt-3 text-xs text-white/30">
        Secure checkout will be available after payment
        integration.
      </p>

    </div>
  );
}