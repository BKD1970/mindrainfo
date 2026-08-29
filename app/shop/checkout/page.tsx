"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  productId: number;
  productName: string;
  slug: string;
  productType: string | null;
  price: number;
  currency: string;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [testPaymentId, setTestPaymentId] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("mindraInfoCart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const hasPhysicalProduct = cart.some(
    (item) => item.productType?.toLowerCase() === "physical"
  );

  const currency = cart[0]?.currency || "INR";

  // Placeholder charges for now.
  // We will configure the actual GST/handling rules later.
  const gst = 0;
  const handlingCharge = 0;
  const totalPayable = total + gst + handlingCharge;

  function updateCustomer(
    field: keyof typeof customer,
    value: string
  ) {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateQuantity(
    productId: number,
    value: string
  ) {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: parsedValue,
            }
          : item
      )
    );
  }

  function removeItem(productId: number) {
    const updatedCart = cart.filter(
      (item) => item.productId !== productId
    );

    setCart(updatedCart);

    if (updatedCart.length === 0) {
      localStorage.removeItem("mindraInfoCart");
    } else {
      localStorage.setItem(
        "mindraInfoCart",
        JSON.stringify(updatedCart)
      );
    }
  }

  function validateCustomerDetails() {
    if (!customer.fullName.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    if (!customer.email.trim()) {
      alert("Please enter your email address.");
      return false;
    }

    if (!customer.email.includes("@")) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (hasPhysicalProduct) {
      if (!customer.phone.trim()) {
        alert("Please enter your phone number.");
        return false;
      }

      if (!customer.address.trim()) {
        alert("Please enter your shipping address.");
        return false;
      }

      if (!customer.city.trim()) {
        alert("Please enter your city.");
        return false;
      }

      if (!customer.state.trim()) {
        alert("Please enter your state.");
        return false;
      }

      if (!customer.pincode.trim()) {
        alert("Please enter your PIN code.");
        return false;
      }
    }

    return true;
  }

  async function continueToPayment() {
  if (!validateCustomerDetails()) {
    return;
  }

  try {
    const response = await fetch("/api/payment/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalPayable,
        currency,
        customer,
        cart,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      alert(result.message || "Test payment failed.");
      return;
    }

    setTestPaymentId(result.paymentId);

const orderResponse = await fetch("/api/orders/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    customer,
    cart,
    subtotal: total,
    gst,
    handlingCharge,
    totalAmount: totalPayable,
    currency,
    paymentId: result.paymentId,
  }),
});

const orderResult = await orderResponse.json();

if (!orderResponse.ok || !orderResult.success) {
  console.error("ORDER CREATION FAILED:", orderResult);

  alert(
    orderResult.message ||
      "Payment succeeded, but the order could not be created."
  );

  return;
}

console.log("TEST PAYMENT SUCCESS:", result);
console.log("ORDER CREATED SUCCESSFULLY:", orderResult);

setSubmitted(true);
  } catch (error) {
    console.error("TEST PAYMENT ERROR:", error);
    alert("Unable to connect to the test payment system.");
  }
}

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* HEADER */}

      <header className="border-b border-white/10">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/shop"
            className="text-xl font-black"
          >
            MindraInfo Shop
          </Link>

          <Link
            href="/shop"
            className="text-sm font-semibold text-white/50 transition hover:text-white"
          >
            ← Back to Shop
          </Link>

        </div>

      </header>

      {/* MAIN */}

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Checkout
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Complete Your Order
          </h1>

          <p className="mt-3 text-white/45">
            Enter your details and review your order before payment.
          </p>

        </div>

        {/* EMPTY CART */}

        {cart.length === 0 ? (

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">

            <div className="text-5xl">
              🛒
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Your cart is empty
            </h2>

            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold"
            >
              Browse Shop
            </Link>

          </div>

        ) : (

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* LEFT SIDE */}

            <div className="space-y-8">

              {/* CUSTOMER INFORMATION */}

              <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                    Customer Information
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Your Details
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    We will use these details to process your order.
                  </p>

                </div>

                <div className="mt-7 grid gap-5 md:grid-cols-2">

                  {/* NAME */}

                  <div className="md:col-span-2">

                    <label className="text-sm font-semibold text-white/75">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={customer.fullName}
                      onChange={(e) =>
                        updateCustomer(
                          "fullName",
                          e.target.value
                        )
                      }
                      placeholder="Enter your full name"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="text-sm font-semibold text-white/75">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) =>
                        updateCustomer(
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                    />

                    <p className="mt-2 text-xs text-white/30">
                      Your order information will be associated with this email.
                    </p>

                  </div>

                  {/* PHONE */}

                  {hasPhysicalProduct && (

                    <div>

                      <label className="text-sm font-semibold text-white/75">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) =>
                          updateCustomer(
                            "phone",
                            e.target.value
                          )
                        }
                        placeholder="Enter phone number"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                      />

                    </div>

                  )}

                </div>

              </section>

              {/* SHIPPING INFORMATION */}

              {hasPhysicalProduct && (

                <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
                      Delivery
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Shipping Address
                    </h2>

                    <p className="mt-2 text-sm text-white/40">
                      Required because your order contains a physical product.
                    </p>

                  </div>

                  <div className="mt-7 space-y-5">

                    {/* ADDRESS */}

                    <div>

                      <label className="text-sm font-semibold text-white/75">
                        Address
                      </label>

                      <textarea
                        value={customer.address}
                        onChange={(e) =>
                          updateCustomer(
                            "address",
                            e.target.value
                          )
                        }
                        rows={4}
                        placeholder="House / Flat / Street / Area"
                        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                      />

                    </div>

                    {/* CITY / STATE */}

                    <div className="grid gap-5 md:grid-cols-2">

                      <div>

                        <label className="text-sm font-semibold text-white/75">
                          City
                        </label>

                        <input
                          type="text"
                          value={customer.city}
                          onChange={(e) =>
                            updateCustomer(
                              "city",
                              e.target.value
                            )
                          }
                          placeholder="City"
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                        />

                      </div>

                      <div>

                        <label className="text-sm font-semibold text-white/75">
                          State
                        </label>

                        <input
                          type="text"
                          value={customer.state}
                          onChange={(e) =>
                            updateCustomer(
                              "state",
                              e.target.value
                            )
                          }
                          placeholder="State"
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                        />

                      </div>

                    </div>

                    {/* PINCODE */}

                    <div>

                      <label className="text-sm font-semibold text-white/75">
                        PIN Code
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={customer.pincode}
                        onChange={(e) =>
                          updateCustomer(
                            "pincode",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        placeholder="6-digit PIN code"
                        maxLength={6}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                      />

                    </div>

                  </div>

                </section>

              )}

              {/* ORDER ITEMS */}

              <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                    Your Cart
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Order Items
                  </h2>

                </div>

                <div className="mt-6 space-y-4">

                  {cart.map((item) => (

                    <div
                      key={item.productId}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >

                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <h3 className="text-lg font-bold">
                            {item.productName}
                          </h3>

                          <p className="mt-1 text-sm text-white/40">
                            {item.productType === "physical"
                              ? "Physical Product"
                              : "Digital Product"}
                          </p>

                          <p className="mt-3 text-sm font-semibold text-white/60">
                            {item.currency}{" "}
                            {item.price.toLocaleString("en-IN")} each
                          </p>

                        </div>

                        <div className="flex items-center gap-4">

                          {/* QUANTITY INPUT */}

                          <div className="flex items-center rounded-xl border border-white/10 bg-white/5">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  String(Math.max(1, item.quantity - 1))
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="px-4 py-2 text-lg font-bold text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.productId,
                                  e.target.value
                                )
                              }
                              className="w-16 border-x border-white/10 bg-transparent px-2 py-2 text-center font-bold outline-none"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  String(item.quantity + 1)
                                )
                              }
                              className="px-4 py-2 text-lg font-bold text-white/70 transition hover:text-white"
                            >
                              +
                            </button>

                          </div>

                          {/* ITEM TOTAL */}

                          <div className="min-w-[90px] text-right">

                            <p className="font-black">
                              {item.currency}{" "}
                              {(
                                item.price * item.quantity
                              ).toLocaleString("en-IN")}
                            </p>

                          </div>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.productId)
                        }
                        className="mt-4 text-xs font-semibold text-red-400 transition hover:text-red-300"
                      >
                        Remove
                      </button>

                    </div>

                  ))}

                </div>

              </section>

            </div>

            {/* RIGHT SIDE — ORDER SUMMARY */}

            <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-6">

              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              {/* ORDER SUMMARY BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setShowSummary((current) => !current)
                }
                className="mt-6 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:bg-white/[0.07]"
              >

                <span className="font-semibold">
                  Order Summary
                </span>

                <span className="text-white/40">
                  {showSummary ? "▲" : "▼"}
                </span>

              </button>

              {/* BREAKDOWN */}

              {showSummary && (

                <div className="mt-3 rounded-2xl border border-cyan-400/10 bg-[#0a1025] p-5">

                  <div className="space-y-4 text-sm">

                    <div className="flex justify-between">

                      <span className="text-white/45">
                        Initial Price
                      </span>

                      <span className="font-semibold">
                        {currency}{" "}
                        {total.toLocaleString("en-IN")}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-white/45">
                        GST
                      </span>

                      <span className="font-semibold">
                        {currency}{" "}
                        {gst.toLocaleString("en-IN")}
                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="text-white/45">
                        Handling Charge
                      </span>

                      <span className="font-semibold">
                        {currency}{" "}
                        {handlingCharge.toLocaleString("en-IN")}
                      </span>

                    </div>

                    <div className="border-t border-white/10 pt-4">

                      <div className="flex justify-between">

                        <span className="font-bold">
                          Total Payable Amount
                        </span>

                        <span className="text-lg font-black">
                          {currency}{" "}
                          {totalPayable.toLocaleString("en-IN")}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              )}

              {/* SIMPLE TOTAL */}

              <div className="mt-6 border-t border-white/10 pt-5">

                <div className="flex justify-between">

                  <span className="text-sm text-white/45">
                    Total
                  </span>

                  <span className="text-2xl font-black">
                    {currency}{" "}
                    {totalPayable.toLocaleString("en-IN")}
                  </span>

                </div>

              </div>

              {/* CONTINUE */}

              <button
                type="button"
                onClick={continueToPayment}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 font-bold transition hover:-translate-y-0.5"
              >
                Continue to Payment →
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-white/30">
                Payment gateway integration will be connected in the next milestone.
              </p>

              {/* SUCCESS MESSAGE */}

              {submitted && (

                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-center">

                  <p className="font-bold text-emerald-400">
                    Details saved for checkout.
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Payment integration is the next step.
                  </p>

                </div>

              )}

            </aside>

          </div>

        )}

      </section>

    </main>
  );
}