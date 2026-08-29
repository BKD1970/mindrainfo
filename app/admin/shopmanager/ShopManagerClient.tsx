"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Product = {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  product_type: string;
  category: string;
  price: number;
  compare_price: number | null;
  currency: string;
  image_url: string | null;
  stock: number | null;
  sku: string | null;
  digital_file_url: string | null;
  external_url: string | null;
  published: boolean;
  featured: boolean;
  status: string;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  short_description: "",
  product_type: "digital",
  category: "Software",
  price: "",
  compare_price: "",
  currency: "INR",
  stock: "0",
  sku: "",
  digital_file_url: "",
  external_url: "",
  image_url: "",
  published: false,
  featured: false,
  status: "draft",
};

export default function ShopManagerClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();

    window.location.replace("/admin/login?role=shop");
  }

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading products:", error);
      alert(`Could not load products: ${error.message}`);
    } else {
      setProducts(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateField(
    field: keyof typeof emptyForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug: createSlug(value),
    }));
  }

  function handleImageChange(file: File | null) {
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function uploadProductImage() {
    if (!imageFile) {
      return form.image_url.trim() || null;
    }

    setUploadingImage(true);

    const fileExtension =
      imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName = createSlug(form.name || "product");

    const fileName = `${safeName}-${Date.now()}.${fileExtension}`;

    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading product image:", uploadError);
      alert(`Could not upload image: ${uploadError.message}`);
      setUploadingImage(false);
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    setUploadingImage(false);

    return data.publicUrl;
  }

  function startEdit(product: Product) {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      short_description: product.short_description || "",
      product_type: product.product_type || "digital",
      category: product.category || "Software",
      price: String(product.price ?? ""),
      compare_price:
        product.compare_price !== null
          ? String(product.compare_price)
          : "",
      currency: product.currency || "INR",
      stock: String(product.stock ?? 0),
      sku: product.sku || "",
      digital_file_url: product.digital_file_url || "",
      external_url: product.external_url || "",
      image_url: product.image_url || "",
      published: product.published,
      featured: product.featured,
      status: product.status || "draft",
    });

    setImageFile(null);
    setImagePreview(product.image_url || null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({
      ...emptyForm,
    });
    setImageFile(null);
    setImagePreview(null);
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Please enter a product slug.");
      return;
    }

    if (!form.category.trim()) {
      alert("Please enter a category.");
      return;
    }

    setSaving(true);

    const imageUrl = await uploadProductImage();

    if (imageFile && !imageUrl) {
      setSaving(false);
      return;
    }

    const productData = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      short_description: form.short_description.trim() || null,
      product_type: form.product_type,
      category: form.category.trim(),
      price: Number(form.price) || 0,
      compare_price: form.compare_price
        ? Number(form.compare_price)
        : null,
      currency: form.currency.trim() || "INR",
      stock: Number(form.stock) || 0,
      sku: form.sku.trim() || null,
      digital_file_url: form.digital_file_url.trim() || null,
      external_url: form.external_url.trim() || null,
      image_url: imageUrl,
      published: form.published,
      featured: form.featured,
      status: form.published ? "published" : form.status,
    };

    if (editingId !== null) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingId);

      if (error) {
        console.error("Error updating product:", error);
        alert(`Could not update product: ${error.message}`);
      } else {
        alert("Product updated successfully.");

        cancelEdit();
        await loadProducts();
      }
    } else {
      const { error } = await supabase
        .from("products")
        .insert(productData);

      if (error) {
        console.error("Error saving product:", error);
        alert(`Could not save product: ${error.message}`);
      } else {
        alert("Product saved successfully.");

        setForm({
          ...emptyForm,
        });

        setImageFile(null);
        setImagePreview(null);

        await loadProducts();
      }
    }

    setSaving(false);
  }

  async function togglePublished(product: Product) {
    const newPublished = !product.published;

    const { error } = await supabase
      .from("products")
      .update({
        published: newPublished,
        status: newPublished ? "published" : "draft",
      })
      .eq("id", product.id);

    if (error) {
      console.error("Error updating product:", error);
      alert(`Could not update product: ${error.message}`);
      return;
    }

    await loadProducts();
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error("Error deleting product:", error);
      alert(`Could not delete product: ${error.message}`);
      return;
    }

    if (editingId === product.id) {
      cancelEdit();
    }

    await loadProducts();
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Admin
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Shop Manager
            </h1>

            <p className="mt-3 text-white/50">
              Create and manage MindraInfo digital and physical products.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              href="/admin"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              ← Admin Dashboard
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl bg-red-500/90 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
            >
              Sign Out
            </button>

          </div>

        </div>

        {/* PRODUCT FORM */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h2 className="text-2xl font-bold">
                {editingId !== null
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <p className="mt-2 text-sm text-white/45">
                {editingId !== null
                  ? "Update the product information below."
                  : "Create a digital or physical product."}
              </p>
            </div>

            {editingId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form
            onSubmit={saveProduct}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >

            {/* NAME */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Product Name
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  handleNameChange(e.target.value)
                }
                placeholder="Example: MindraInfo Excel Toolkit"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </div>

            {/* SLUG */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Slug
              </label>

              <input
                value={form.slug}
                onChange={(e) =>
                  updateField(
                    "slug",
                    createSlug(e.target.value)
                  )
                }
                placeholder="mindra-info-excel-toolkit"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </div>

            {/* PRODUCT TYPE */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Product Type
              </label>

              <select
                value={form.product_type}
                onChange={(e) =>
                  updateField(
                    "product_type",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1025] px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="digital">
                  Digital Product
                </option>

                <option value="physical">
                  Physical Product
                </option>
              </select>
            </div>

            {/* CATEGORY */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Category
              </label>

              <input
                value={form.category}
                onChange={(e) =>
                  updateField(
                    "category",
                    e.target.value
                  )
                }
                placeholder="Software"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* SHORT DESCRIPTION */}

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-white/75">
                Short Description
              </label>

              <input
                value={form.short_description}
                onChange={(e) =>
                  updateField(
                    "short_description",
                    e.target.value
                  )
                }
                placeholder="A short description shown on the Shop card."
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-white/75">
                Full Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Describe the product in detail."
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* PRICE */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Price
              </label>

              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  updateField("price", e.target.value)
                }
                placeholder="499"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* COMPARE PRICE */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Compare Price / MRP
              </label>

              <input
                type="number"
                min="0"
                value={form.compare_price}
                onChange={(e) =>
                  updateField(
                    "compare_price",
                    e.target.value
                  )
                }
                placeholder="999"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* CURRENCY */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Currency
              </label>

              <input
                value={form.currency}
                onChange={(e) =>
                  updateField(
                    "currency",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* STOCK */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  updateField(
                    "stock",
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* SKU */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                SKU
              </label>

              <input
                value={form.sku}
                onChange={(e) =>
                  updateField("sku", e.target.value)
                }
                placeholder="MI-TSHIRT-001"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* IMAGE UPLOAD */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Catalog Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(
                    e.target.files?.[0] ?? null
                  )
                }
                className="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-cyan-400"
              />

              <p className="mt-2 text-xs text-white/35">
                JPG, PNG, WEBP or other image formats.
                Maximum 5 MB.
              </p>

              {imagePreview && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-56 w-full object-cover"
                  />
                </div>
              )}

            </div>

            {/* IMAGE URL */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Image URL (Optional)
              </label>

              <input
                value={form.image_url}
                onChange={(e) =>
                  updateField(
                    "image_url",
                    e.target.value
                  )
                }
                placeholder="https://..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />

              <p className="mt-2 text-xs text-white/35">
                Leave empty when uploading an image above.
              </p>

              {!imagePreview && form.image_url && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={form.image_url}
                    alt="Product image"
                    className="h-56 w-full object-cover"
                  />
                </div>
              )}

            </div>

            {/* DIGITAL FILE */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Digital File URL
              </label>

              <input
                value={form.digital_file_url}
                onChange={(e) =>
                  updateField(
                    "digital_file_url",
                    e.target.value
                  )
                }
                placeholder="For digital downloads"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* EXTERNAL URL */}

            <div>
              <label className="text-sm font-semibold text-white/75">
                Software / Access URL
              </label>

              <input
                value={form.external_url}
                onChange={(e) =>
                  updateField(
                    "external_url",
                    e.target.value
                  )
                }
                placeholder="https://..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* OPTIONS */}

            <div className="flex flex-wrap gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:col-span-2">

              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    updateField(
                      "published",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4"
                />

                Publish immediately
              </label>

              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    updateField(
                      "featured",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4"
                />

                Featured product
              </label>

            </div>

            {/* SAVE */}

            <div className="flex flex-wrap gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-bold shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingImage
                  ? "Uploading Image..."
                  : saving
                    ? editingId !== null
                      ? "Updating..."
                      : "Saving..."
                    : editingId !== null
                      ? "Update Product"
                      : "Add Product"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving || uploadingImage}
                  className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold transition hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* PRODUCT LIST */}

        <section className="mt-10">

          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-400">
              Products
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Product Inventory
            </h2>
          </div>

          {loading ? (

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/50">
              Loading products...
            </div>

          ) : products.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-12 text-center">

              <div className="text-5xl">
                📦
              </div>

              <h3 className="mt-4 text-2xl font-bold">
                No products yet
              </h3>

              <p className="mt-2 text-white/40">
                Create your first MindraInfo product above.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {products.map((product) => (

                <div
                  key={product.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div className="flex items-start gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5">

                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">
                            {product.product_type === "digital"
                              ? "💻"
                              : "📦"}
                          </span>
                        )}

                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-lg font-bold">
                            {product.name}
                          </h3>

                          <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-400">
                            {product.product_type}
                          </span>

                          {product.featured && (
                            <span className="rounded-full bg-purple-400/10 px-2.5 py-1 text-xs font-semibold text-purple-400">
                              Featured
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-sm text-white/40">
                          {product.category} ·{" "}
                          {product.currency}{" "}
                          {product.price}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          /shop/{product.slug}
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          startEdit(product)
                        }
                        className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
                      >
                        Edit
                      </button>

                      <a
                        href={`/shop/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
                      >
                        View
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          togglePublished(product)
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                          product.published
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {product.published
                          ? "Published"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProduct(product)
                        }
                        className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>
    </main>
  );
}