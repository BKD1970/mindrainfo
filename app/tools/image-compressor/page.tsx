"use client";

import { useEffect, useRef, useState } from "react";

type DimensionUnit = "px" | "mm" | "cm";

type ImageItem = {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
  compressedBlob?: Blob;
  compressedUrl?: string;
  compressedSize?: number;
  outputWidth?: number;
  outputHeight?: number;
};

const TARGET_OPTIONS = [
  { label: "20 KB", value: 20 },
  { label: "50 KB", value: 50 },
  { label: "100 KB", value: 100 },
  { label: "200 KB", value: 200 },
];

function formatSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getImageDimensions(
  width: number,
  height: number,
  unit: DimensionUnit
) {
  if (unit === "px") {
    return {
      width,
      height,
    };
  }

  if (unit === "mm") {
    return {
      width: width * 0.264583,
      height: height * 0.264583,
    };
  }

  return {
    width: width * 0.0264583,
    height: height * 0.0264583,
  };
}

async function loadImage(
  file: File
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read this image."));
    };

    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error("Unable to create compressed image.")
          );
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

async function compressImageToTarget(
  file: File,
  targetKB: number,
  targetWidth?: number,
  targetHeight?: number
): Promise<{
  blob: Blob;
  width: number;
  height: number;
}> {
  const image = await loadImage(file);

  let width = targetWidth || image.naturalWidth;
  let height = targetHeight || image.naturalHeight;

  const maxWidth = 6000;
  const maxHeight = 6000;

  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  if (height > maxHeight) {
    const ratio = maxHeight / height;
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  let scale = 1;
  let bestBlob: Blob | null = null;

  for (let attempt = 0; attempt < 10; attempt++) {
    const canvas = document.createElement("canvas");

    const currentWidth = Math.max(
      1,
      Math.round(width * scale)
    );

    const currentHeight = Math.max(
      1,
      Math.round(height * scale)
    );

    canvas.width = currentWidth;
    canvas.height = currentHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser does not support canvas.");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.drawImage(
      image,
      0,
      0,
      currentWidth,
      currentHeight
    );

    let low = 0.1;
    let high = 0.95;
    let selectedBlob: Blob | null = null;

    for (let qualityAttempt = 0; qualityAttempt < 8; qualityAttempt++) {
      const quality = (low + high) / 2;

      const blob = await canvasToBlob(
        canvas,
        quality
      );

      if (blob.size <= targetKB * 1024) {
        selectedBlob = blob;
        low = quality;
      } else {
        high = quality;
      }
    }

    if (selectedBlob) {
      bestBlob = selectedBlob;

      if (selectedBlob.size <= targetKB * 1024) {
        return {
          blob: selectedBlob,
          width: currentWidth,
          height: currentHeight,
        };
      }
    }

    scale *= 0.75;
  }

  if (bestBlob) {
    return {
      blob: bestBlob,
      width: Math.round(width * scale),
      height: Math.round(height * scale),
    };
  }

  throw new Error(
    "Unable to compress this image to the selected size."
  );
}

export default function ImageCompressorPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [targetKB, setTargetKB] = useState(100);
  const [customKB, setCustomKB] = useState("");
  const [dimensionUnit, setDimensionUnit] =
    useState<DimensionUnit>("px");

  const [targetWidth, setTargetWidth] = useState("");
  const [targetHeight, setTargetHeight] = useState("");

  const [isCompressing, setIsCompressing] =
    useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);

        if (image.compressedUrl) {
          URL.revokeObjectURL(image.compressedUrl);
        }
      });
    };
  }, [images]);

  const addImages = async (files: FileList | File[]) => {
    setError("");

    const selectedFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/")
    );

    if (!selectedFiles.length) {
      setError(
        "Please select a JPG, PNG, WebP, or other image file."
      );
      return;
    }

    const newImages: ImageItem[] = [];

    for (const file of selectedFiles) {
      try {
        const image = await loadImage(file);

        newImages.push({
          id:
            `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,
          file,
          preview: URL.createObjectURL(file),
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      } catch {
        // Ignore invalid images
      }
    }

    if (!newImages.length) {
      setError("Unable to read the selected images.");
      return;
    }

    setImages((previous) => [
      ...previous,
      ...newImages,
    ]);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      addImages(event.target.files);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDragActive(false);

    if (event.dataTransfer.files) {
      addImages(event.dataTransfer.files);
    }
  };

  const removeImage = (id: string) => {
    setImages((previous) => {
      const image = previous.find(
        (item) => item.id === id
      );

      if (image) {
        URL.revokeObjectURL(image.preview);

        if (image.compressedUrl) {
          URL.revokeObjectURL(image.compressedUrl);
        }
      }

      return previous.filter(
        (item) => item.id !== id
      );
    });
  };

  const clearAll = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);

      if (image.compressedUrl) {
        URL.revokeObjectURL(image.compressedUrl);
      }
    });

    setImages([]);
    setError("");
  };

  const getTargetSize = () => {
    if (customKB.trim()) {
      const value = Number(customKB);

      if (
        Number.isFinite(value) &&
        value > 0
      ) {
        return value;
      }
    }

    return targetKB;
  };

  const convertDimensionToPixels = (
    value: string
  ) => {
    const number = Number(value);

    if (
      !Number.isFinite(number) ||
      number <= 0
    ) {
      return undefined;
    }

    if (dimensionUnit === "px") {
      return Math.round(number);
    }

    if (dimensionUnit === "mm") {
      return Math.round(number / 0.264583);
    }

    return Math.round(number / 0.0264583);
  };

  const reduceImages = async () => {
    if (!images.length) {
      setError("Please select at least one image.");
      return;
    }

    const size = getTargetSize();

    if (
      !Number.isFinite(size) ||
      size <= 0
    ) {
      setError(
        "Please enter a valid target size."
      );
      return;
    }

    setError("");
    setIsCompressing(true);

    try {
      const widthPixels =
        convertDimensionToPixels(targetWidth);

      const heightPixels =
        convertDimensionToPixels(targetHeight);

      const updatedImages: ImageItem[] = [];

      for (const image of images) {
        const result =
          await compressImageToTarget(
            image.file,
            size,
            widthPixels,
            heightPixels
          );

        const compressedUrl =
          URL.createObjectURL(result.blob);

        if (image.compressedUrl) {
          URL.revokeObjectURL(
            image.compressedUrl
          );
        }

        updatedImages.push({
          ...image,
          compressedBlob: result.blob,
          compressedUrl,
          compressedSize: result.blob.size,
          outputWidth: result.width,
          outputHeight: result.height,
        });
      }

      setImages(updatedImages);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to compress the selected images."
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadImage = (
    image: ImageItem
  ) => {
    if (!image.compressedUrl) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = image.compressedUrl;

    const originalName =
      image.file.name.replace(
        /\.[^/.]+$/,
        ""
      );

    link.download =
      `${originalName}-compressed.jpg`;

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  const displayDimensions = (
    image: ImageItem
  ) => {
    const width =
      image.outputWidth || image.width;

    const height =
      image.outputHeight || image.height;

    const converted =
      getImageDimensions(
        width,
        height,
        dimensionUnit
      );

    return `${Math.round(converted.width)} × ${Math.round(
      converted.height
    )} ${dimensionUnit}`;
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef4ff_45%,#f8fafc_100%)] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page heading */}
        <section className="mb-8 text-center">

          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-white shadow-[0_12px_35px_rgba(37,99,235,0.14)] ring-1 ring-slate-200">

            <svg
              className="h-9 w-9"
              viewBox="0 0 48 48"
              fill="none"
            >
              <rect
                x="5"
                y="5"
                width="38"
                height="38"
                rx="8"
                fill="#2563EB"
              />

              <circle
                cx="17"
                cy="18"
                r="4"
                fill="white"
              />

              <path
                d="M11 36L21 26L27 32L32 27L37 36H11Z"
                fill="white"
              />

            </svg>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Image Compressor
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Reduce image file size to your desired KB while
            keeping the image clean and usable.
          </p>

        </section>

        {/* Main card */}
        <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur">

          <div className="p-5 sm:p-8">

            {/* Target size */}
            <div className="mb-7">

              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Reduce Image Size In KB
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                {TARGET_OPTIONS.map(
                  (option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setTargetKB(
                          option.value
                        );
                        setCustomKB("");
                      }}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        targetKB ===
                          option.value &&
                        !customKB
                          ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                )}

              </div>

              <div className="mt-3 flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">

                <input
                  type="number"
                  min="1"
                  placeholder="Any other size"
                  value={customKB}
                  onChange={(event) =>
                    setCustomKB(
                      event.target.value
                    )
                  }
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                />

                <div className="flex items-center border-l border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-500">
                  KB
                </div>

              </div>

            </div>

            {/* Dimensions */}
            <div className="mb-7">

              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <label className="text-sm font-semibold text-slate-800">
                  Image Dimensions
                </label>

                <div className="inline-flex rounded-xl bg-slate-100 p-1">

                  {(
                    [
                      ["px", "Pixels"],
                      ["mm", "MM"],
                      ["cm", "CM"],
                    ] as [
                      DimensionUnit,
                      string
                    ][]
                  ).map(
                    ([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setDimensionUnit(
                            value
                          )
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          dimensionUnit ===
                          value
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}

                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white">

                  <input
                    type="number"
                    min="1"
                    placeholder="Width"
                    value={targetWidth}
                    onChange={(event) =>
                      setTargetWidth(
                        event.target.value
                      )
                    }
                    className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                  />

                  <span className="flex items-center bg-slate-50 px-4 text-xs font-semibold text-slate-400">
                    {dimensionUnit}
                  </span>

                </div>

                <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white">

                  <input
                    type="number"
                    min="1"
                    placeholder="Height"
                    value={targetHeight}
                    onChange={(event) =>
                      setTargetHeight(
                        event.target.value
                      )
                    }
                    className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                  />

                  <span className="flex items-center bg-slate-50 px-4 text-xs font-semibold text-slate-400">
                    {dimensionUnit}
                  </span>

                </div>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Leave width and height empty to keep the
                original dimensions.
              </p>

            </div>

            {/* Upload */}
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() =>
                setDragActive(false)
              }
              onDrop={handleDrop}
              className={`rounded-[24px] border-2 border-dashed px-6 py-10 text-center transition ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-slate-50/70"
              }`}
            >

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                <svg
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M12 16V4" />
                  <path d="M8 8l4-4 4 4" />
                  <path d="M5 20h14" />
                </svg>

              </div>

              <h2 className="text-base font-semibold text-slate-800">
                Select Or Drag & Drop Images Here
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                JPG, PNG, WebP and other browser-supported
                images
              </p>

              <button
                type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Select Images
              </button>

            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Selected images */}
            {images.length > 0 && (

              <div className="mt-7">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <h2 className="text-base font-semibold text-slate-900">
                      Selected Images
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {images.length} image
                      {images.length !== 1
                        ? "s"
                        : ""}{" "}
                      selected
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    Clear All
                  </button>

                </div>

                <div className="space-y-3">

                  {images.map(
                    (image) => (
                      <div
                        key={image.id}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
                      >

                        <img
                          src={image.preview}
                          alt={image.file.name}
                          className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200"
                        />

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold text-slate-800">
                            {image.file.name}
                          </p>

                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">

                            <span>
                              Original:{" "}
                              {formatSize(
                                image.file
                                  .size
                              )}
                            </span>

                            <span>
                              {image.width} ×{" "}
                              {image.height} px
                            </span>

                          </div>

                          {image.compressedSize && (
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">

                              <span className="font-semibold text-green-600">
                                Compressed:{" "}
                                {formatSize(
                                  image.compressedSize
                                )}
                              </span>

                              <span className="text-slate-500">
                                {displayDimensions(
                                  image
                                )}
                              </span>

                            </div>
                          )}

                        </div>

                        {image.compressedUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              downloadImage(
                                image
                              )
                            }
                            className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                          >
                            Download
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                image.id
                              )
                            }
                            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}

                      </div>
                    )
                  )}

                </div>

                {/* Reduce button */}
                <button
                  type="button"
                  onClick={reduceImages}
                  disabled={isCompressing}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isCompressing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Reducing Size...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 3v12" />
                        <path d="M8 11l4 4 4-4" />
                        <path d="M5 21h14" />
                      </svg>

                      Reduce Size
                    </>
                  )}

                </button>

              </div>

            )}

          </div>

        </section>

        {/* Feature cards */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

              <svg
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>

            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Target File Size
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Compress images toward 20 KB, 50 KB, 100 KB,
              200 KB or any custom size.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">

              <svg
                className="h-5 w-5 text-violet-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M8 8h8v8H8z" />
              </svg>

            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Image Dimensions
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Set width and height using Pixels, MM or CM.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">

              <svg
                className="h-5 w-5 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>

            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Easy Download
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Download each compressed image immediately
              after processing.
            </p>

          </div>

        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Images are processed locally in your browser. No
          image upload to a server is required.
        </p>

      </div>
    </main>
  );
}