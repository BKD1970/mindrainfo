import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  product_type: string | null;
  category: string | null;
  price: number | null;
  compare_price: number | null;
  currency: string | null;
  image_url: string | null;
  stock: number | null;
  sku: string | null;
  external_url: string | null;
  published: boolean;
  featured: boolean;
  status: string | null;
};

const productTypes = [
  {
    title: "Digital Products",
    description:
      "Software, web applications, AI tools, templates and other digital solutions designed to solve practical problems.",
    icon: "💻",
    href: "#digital-products",
  },
  {
    title: "Physical Products",
    description:
      "Thoughtfully designed physical products, merchandise and lifestyle products created for everyday use.",
    icon: "📦",
    href: "#physical-products",
  },
];

export default async function ShopPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        slug,
        description,
        short_description,
        product_type,
        category,
        price,
        compare_price,
        currency,
        image_url,
        stock,
        sku,
        external_url,
        published,
        featured,
        status
      `
    )
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading shop products:", error);
  }

  const allProducts = products ?? [];

  const digitalProducts = allProducts.filter(
    (product) => product.product_type?.toLowerCase() === "digital"
  );

  const physicalProducts = allProducts.filter(
    (product) => product.product_type?.toLowerCase() === "physical"
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <SiteHeader />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            MindraInfo Shop
          </div>

          <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
            Discover something
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}useful.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/55 md:text-xl">
            Explore digital solutions and physical products designed to
            help you learn, work, create and grow.
          </p>
        </div>
      </section>

      {/* =====================================================
          PRODUCT TYPES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {productTypes.map((type) => (
            <a
              key={type.title}
              href={type.href}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >
              <div className="text-5xl transition duration-300 group-hover:scale-110">
                {type.icon}
              </div>

              <h2 className="mt-6 text-3xl font-black">
                {type.title}
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-white/50">
                {type.description}
              </p>

              <span className="mt-7 inline-block font-semibold text-cyan-400 transition group-hover:translate-x-1">
                Explore {type.title} →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* =====================================================
          DIGITAL PRODUCTS
      ====================================================== */}

      <section
        id="digital-products"
        className="border-y border-white/5 bg-white/[0.015]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              Digital Products
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              Software & digital solutions
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-white/50">
              Useful software, digital tools, templates, AI solutions and
              downloadable products.
            </p>
          </div>

          {digitalProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {digitalProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/[0.07]"
                >
                  {product.image_url ? (
                    <div className="aspect-video overflow-hidden bg-white/5">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 text-6xl">
                      💻
                    </div>
                  )}

                  <div className="p-7">
                    {product.category && (
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                        {product.category}
                      </p>
                    )}

                    <h3 className="mt-3 text-2xl font-bold">
                      {product.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {product.short_description ||
                        product.description ||
                        "A useful digital product from MindraInfo."}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xl font-black">
                          {product.currency || "INR"}{" "}
                          {Number(product.price ?? 0).toLocaleString("en-IN")}
                        </span>

                        {Number(product.compare_price ?? 0) >
                          Number(product.price ?? 0) && (
                          <span className="ml-2 text-sm text-white/30 line-through">
                            {product.currency || "INR"}{" "}
                            {Number(product.compare_price).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}
                      </div>

                      <span className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-10 text-center">
              <div className="text-5xl">💻</div>

              <h3 className="mt-5 text-2xl font-bold">
                Digital products are coming.
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-white/45">
                Software, AI tools, templates and other useful digital
                products will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          PHYSICAL PRODUCTS
      ====================================================== */}

      <section
        id="physical-products"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400">
            Physical Products
          </p>

          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Products you can use in the real world.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-white/50">
            Explore future MindraInfo merchandise, lifestyle products and
            other thoughtfully designed physical products.
          </p>
        </div>

        {physicalProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {physicalProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-400/30 hover:bg-white/[0.07]"
              >
                {product.image_url ? (
                  <div className="aspect-square overflow-hidden bg-white/5">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 text-6xl">
                    📦
                  </div>
                )}

                <div className="p-7">
                  {product.category && (
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
                      {product.category}
                    </p>
                  )}

                  <h3 className="mt-3 text-xl font-bold">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/45">
                    {product.short_description ||
                      product.description ||
                      "A useful physical product from MindraInfo."}
                  </p>

                  <div className="mt-6">
                    <div className="text-xl font-black">
                      {product.currency || "INR"}{" "}
                      {Number(product.price ?? 0).toLocaleString("en-IN")}
                    </div>

                    {Number(product.compare_price ?? 0) >
                      Number(product.price ?? 0) && (
                      <span className="ml-2 text-sm text-white/30 line-through">
                        {product.currency || "INR"}{" "}
                        {Number(product.compare_price).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    )}

                    <div className="mt-4">
                      <span className="flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 px-4 py-3 text-sm font-bold">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "👕",
                title: "Apparel",
              },
              {
                icon: "🏷️",
                title: "Stickers & Merchandise",
              },
              {
                icon: "🛍️",
                title: "Lifestyle Products",
              },
              {
                icon: "📦",
                title: "Other Products",
              },
            ].map((product) => (
              <div
                key={product.title}
                className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-7"
              >
                <div className="text-4xl">
                  {product.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {product.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/45">
                  Products will be available here as the MindraInfo Shop
                  expands.
                </p>

                <span className="mt-6 inline-block text-sm font-semibold text-white/30">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="mx-auto max-w-5xl px-6 pb-24 text-center">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 backdrop-blur-xl md:p-16">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
            MindraInfo Shop
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            More useful products are coming.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/50">
            MindraInfo Shop will gradually grow into a marketplace for
            useful software, digital products and physical products.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white/90 transition hover:bg-white/10"
          >
            ← Back to MindraInfo
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-white/40 md:flex-row">
          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <Link
            href="/"
            className="transition hover:text-white"
          >
            MindraInfo Home →
          </Link>
        </div>
      </footer>
    </main>
  );
}