"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { PDFDocument } from "pdf-lib";

type ImageFile = {
  file: File;
  preview: string;
};

export default function JPGToPDFPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [converting, setConverting] = useState(false);

  const [pageSize, setPageSize] = useState<"A4" | "fit">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [margin, setMargin] = useState(20);

  const addImages = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) =>
      ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
    );

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((current) => {
      const removed = current[index];

      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }

      return current.filter((_, i) => i !== index);
    });
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;

    setImages((current) => {
      const updated = [...current];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      return;
    }

    moveImage(dragIndex, index);
    setDragIndex(null);
  };

  const getImageDimensions = (
    image: HTMLImageElement,
    maxWidth: number,
    maxHeight: number
  ) => {
    const ratio = Math.min(
      maxWidth / image.width,
      maxHeight / image.height
    );

    return {
      width: image.width * ratio,
      height: image.height * ratio,
    };
  };

  const convertToPDF = async () => {
    if (images.length === 0) return;

    try {
      setConverting(true);

      const pdfDoc = await PDFDocument.create();

      for (const imageItem of images) {
        const image = new Image();

        image.src = imageItem.preview;

        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () =>
            reject(new Error("Unable to load image."));
        });

        let pageWidth = 595.28;
        let pageHeight = 841.89;

        if (pageSize === "fit") {
          pageWidth = image.width;
          pageHeight = image.height;
        } else if (orientation === "landscape") {
          pageWidth = 841.89;
          pageHeight = 595.28;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        if (pageSize === "fit") {
          const embeddedImage =
            imageItem.file.type === "image/png"
              ? await pdfDoc.embedPng(await imageItem.file.arrayBuffer())
              : await pdfDoc.embedJpg(await imageItem.file.arrayBuffer());

          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: pageWidth,
            height: pageHeight,
          });

          continue;
        }

        const embeddedImage =
          imageItem.file.type === "image/png"
            ? await pdfDoc.embedPng(await imageItem.file.arrayBuffer())
            : await pdfDoc.embedJpg(await imageItem.file.arrayBuffer());

        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;

        const dimensions = getImageDimensions(
          image,
          availableWidth,
          availableHeight
        );

        const x = (pageWidth - dimensions.width) / 2;
        const y = (pageHeight - dimensions.height) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: dimensions.width,
          height: dimensions.height,
        });
      }

      const pdfBytes = await pdfDoc.save();

const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
new Uint8Array(pdfBuffer).set(pdfBytes);

const blob = new Blob([pdfBuffer], {
  type: "application/pdf",
});

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "mindrainfo-images.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Unable to create the PDF. Please try another image.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">
      <SiteHeader />

      {/* HERO */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Link
            href="/tools/pdf"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            ← Back to PDF Tools
          </Link>

          <div className="mt-8 max-w-3xl">
            <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
              PDF Tool
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-tight md:text-6xl">
              JPG to PDF
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Convert JPG, JPEG and PNG images into a single PDF document.
              Arrange your images, choose the page layout and download your
              PDF instantly.
            </p>
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* MAIN AREA */}
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            {images.length === 0 ? (
              <label className="flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center transition hover:border-orange-400 hover:bg-orange-50/40">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-4xl">
                  🖼️
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  Upload your images
                </h2>

                <p className="mt-3 max-w-md text-gray-500">
                  Select JPG, JPEG or PNG images. You can upload multiple
                  images and arrange them before creating your PDF.
                </p>

                <span className="mt-7 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white">
                  Select Images
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  multiple
                  className="hidden"
                  onChange={(e) => addImages(e.target.files)}
                />
              </label>
            ) : (
              <>
                {/* TOOLBAR */}
                <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">
                      Your Images
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {images.length}{" "}
                      {images.length === 1 ? "image" : "images"} selected
                    </p>
                  </div>

                  <label className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-bold transition hover:bg-gray-100">
                    + Add Images

                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      className="hidden"
                      onChange={(e) => addImages(e.target.files)}
                    />
                  </label>
                </div>

                {/* IMAGE GRID */}
                <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={`${image.file.name}-${index}`}
                      draggable
                      onDragStart={() => setDragIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(index)}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                    >
                      <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-black text-white shadow">
                        {index + 1}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-gray-700 shadow transition hover:bg-red-500 hover:text-white"
                        title="Remove image"
                      >
                        ×
                      </button>

                      <div className="flex h-56 items-center justify-center p-4">
                        <img
                          src={image.preview}
                          alt={image.file.name}
                          className="max-h-full max-w-full rounded-xl object-contain shadow-sm"
                        />
                      </div>

                      <div className="border-t border-gray-200 bg-white px-4 py-3">
                        <p
                          className="truncate text-sm font-semibold"
                          title={image.file.name}
                        >
                          {image.file.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Drag to reorder
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* SETTINGS */}
          <aside className="h-fit rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              PDF Settings
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Customize how your images will be placed inside the PDF.
            </p>

            {/* PAGE SIZE */}
            <div className="mt-7">
              <label className="text-sm font-bold">
                Page Size
              </label>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPageSize("A4")}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                    pageSize === "A4"
                      ? "bg-orange-500 text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  A4
                </button>

                <button
                  type="button"
                  onClick={() => setPageSize("fit")}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                    pageSize === "fit"
                      ? "bg-orange-500 text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  Fit Image
                </button>
              </div>
            </div>

            {/* ORIENTATION */}
            {pageSize === "A4" && (
              <div className="mt-6">
                <label className="text-sm font-bold">
                  Orientation
                </label>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrientation("portrait")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                      orientation === "portrait"
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    Portrait
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrientation("landscape")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                      orientation === "landscape"
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
            )}

            {/* MARGIN */}
            {pageSize === "A4" && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold">
                    Margin
                  </label>

                  <span className="text-sm font-bold text-orange-500">
                    {margin}px
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="60"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="mt-4 w-full accent-orange-500"
                />
              </div>
            )}

            {/* CONVERT */}
            <button
              type="button"
              disabled={images.length === 0 || converting}
              onClick={convertToPDF}
              className="mt-8 w-full rounded-xl bg-orange-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
            >
              {converting ? "Creating PDF..." : "Convert to PDF →"}
            </button>

            {images.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  images.forEach((image) =>
                    URL.revokeObjectURL(image.preview)
                  );
                  setImages([]);
                }}
                className="mt-3 w-full rounded-xl px-5 py-3 text-sm font-bold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                Clear All
              </button>
            )}

            {/* PRIVACY */}
            <div className="mt-7 rounded-2xl bg-green-50 p-4">
              <div className="flex gap-3">
                <span className="text-lg">🔒</span>

                <div>
                  <p className="text-sm font-bold text-green-700">
                    Your files stay private
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-700/70">
                    Files are processed in your browser and are not saved to
                    the MindraInfo database.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* INFO */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-2xl">1️⃣</div>
              <h3 className="mt-4 text-lg font-black">
                Upload images
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Select one or multiple JPG, JPEG or PNG images.
              </p>
            </div>

            <div>
              <div className="text-2xl">2️⃣</div>
              <h3 className="mt-4 text-lg font-black">
                Arrange & customize
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Drag images into the order you want and choose the PDF
                layout.
              </p>
            </div>

            <div>
              <div className="text-2xl">3️⃣</div>
              <h3 className="mt-4 text-lg font-black">
                Download PDF
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Generate your PDF and download it directly to your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-[#f7f7f4]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">
          <p>© 2026 MindraInfo. All rights reserved.</p>

          <Link
            href="/tools/pdf"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Back to PDF Tools →
          </Link>
        </div>
      </footer>
    </main>
  );
}