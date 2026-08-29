import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import ProductActions from "@/components/shop/ProductActions";
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

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const { data: product, error } = await supabase
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
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Error loading product:", error);
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">

        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-semibold text-white/50 transition hover:text-white"
        >
          ← Back to Shop
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">

          {/* PRODUCT IMAGE */}
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">

            {product.image_url ? (
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 text-8xl">
                {product.product_type?.toLowerCase() === "physical"
                  ? "📦"
                  : "💻"}
              </div>
            )}

          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex flex-col justify-center">

            {product.category && (
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                {product.category}
              </p>
            )}

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              {product.name}
            </h1>

            {product.short_description && (
              <p className="mt-6 text-lg leading-8 text-white/55">
                {product.short_description}
              </p>
            )}

            {/* PRICE */}
            <div className="mt-8 flex items-center gap-3">

              <span className="text-3xl font-black">
                {product.currency || "INR"}{" "}
                {Number(product.price ?? 0).toLocaleString("en-IN")}
              </span>

              {Number(product.compare_price ?? 0) >
                Number(product.price ?? 0) && (
                <span className="text-lg text-white/30 line-through">
                  {product.currency || "INR"}{" "}
                  {Number(product.compare_price).toLocaleString("en-IN")}
                </span>
              )}

            </div>

            {/* PRODUCT STATUS */}
            {product.stock !== null && (
              <p className="mt-4 text-sm text-white/45">
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Currently out of stock"}
              </p>
            )}

            {/* DESCRIPTION */}
            {product.description && (
              <div className="mt-10 border-t border-white/10 pt-8">

                <h2 className="text-xl font-bold">
                  Product Details
                </h2>

                <p className="mt-4 whitespace-pre-line leading-8 text-white/55">
                  {product.description}
                </p>

              </div>
            )}

            {/* ACTION */}

<ProductActions
  productId={product.id}
  productName={product.name}
  slug={product.slug}
  productType={product.product_type}
  price={product.price}
  currency={product.currency}
  stock={product.stock}
/>

            {/* SKU */}
            {product.sku && (
              <p className="mt-8 text-xs text-white/25">
                SKU: {product.sku}
              </p>
            )}

          </div>

        </div>

      </section>

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