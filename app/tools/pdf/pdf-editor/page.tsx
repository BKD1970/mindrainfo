"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent, PointerEvent as ReactPointerEvent } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  Bold, Check, ChevronLeft, ChevronRight, Download, FileImage,
  FileText, Italic, Minus, MousePointer2, Plus, Redo2, Trash2,
  Type, Undo2, Upload,
} from "lucide-react";

type PdfJsPage = {
  getViewport: (options: { scale: number }) => any;
  getTextContent: () => Promise<{ items: Array<any> }>;
  render: (options: { canvasContext: CanvasRenderingContext2D; viewport: any }) => { promise: Promise<void> };
};
type PdfJsDocument = { numPages: number; getPage: (pageNumber: number) => Promise<PdfJsPage> };
type TextRegion = {
  id: string; page: number; x: number; y: number; w: number; h: number;
  text: string; originalText: string; fontSize: number; color: string;
  bold: boolean; italic: boolean; edited: boolean; fontFamily?: string;
};
type AddedItem = {
  id: string; type: "text" | "image" | "line"; page: number;
  x: number; y: number; w: number; h: number; text?: string;
  imageData?: string; imageType?: "png" | "jpg"; fontSize: number;
  bold: boolean; italic: boolean; color: string;
};
type HistoryState = { textRegions: TextRegion[]; items: AddedItem[] };

const btn = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/75 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-px hover:bg-white disabled:cursor-not-allowed disabled:opacity-40";
const accentBtn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:opacity-40";
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = filename; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function hexRgb(value: string) {
  return rgb(parseInt(value.slice(1, 3), 16) / 255, parseInt(value.slice(3, 5), 16) / 255, parseInt(value.slice(5, 7), 16) / 255);
}

function sampleTextColor(canvas: HTMLCanvasElement, x: number, y: number, w: number, h: number) {
  // Use the original rendered glyph pixels to estimate a line's ink colour.
  // PDF.js text-content items do not expose text fill colour directly.
  try {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return "#222222";
    const left = Math.max(0, Math.floor(x));
    const top = Math.max(0, Math.floor(y));
    const right = Math.min(canvas.width, Math.ceil(x + w));
    const bottom = Math.min(canvas.height, Math.ceil(y + h));
    if (right <= left || bottom <= top) return "#222222";
    const pixels = context.getImageData(left, top, right - left, bottom - top).data;
    const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
      if (a < 180) continue;
      const luminance = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
      const saturation = Math.max(r, g, b) - Math.min(r, g, b);
      if (luminance > 175 || (luminance > 125 && saturation < 28)) continue;
      const key = `${Math.round(r / 24)},${Math.round(g / 24)},${Math.round(b / 24)}`;
      const current = buckets.get(key) ?? { count: 0, r: 0, g: 0, b: 0 };
      current.count += 1; current.r += r; current.g += g; current.b += b;
      buckets.set(key, current);
    }
    const best = [...buckets.values()].sort((a, b) => b.count - a.count)[0];
    if (!best) return "#222222";
    const r = Math.round(best.r / best.count).toString(16).padStart(2, "0");
    const g = Math.round(best.g / best.count).toString(16).padStart(2, "0");
    const b = Math.round(best.b / best.count).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  } catch {
    return "#222222";
  }
}

export default function PdfEditorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PdfJsDocument | null>(null);
  const originalPdfRef = useRef<Uint8Array | null>(null);
  const renderTaskRef = useRef(0);
  const historyRef = useRef<HistoryState[]>([]);
  const historyIndexRef = useRef(-1);
  const dragRef = useRef<{ id: string; kind: "added" | "text"; handle?: string; px: number; py: number; x: number; y: number; w: number; h: number } | null>(null);

  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [textRegions, setTextRegions] = useState<TextRegion[]>([]);
  const [items, setItems] = useState<AddedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedKind, setSelectedKind] = useState<"added" | "text" | null>(null);
  const [fontSize, setFontSize] = useState(12);
  const [textColor, setTextColor] = useState("#222222");
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [editingTarget, setEditingTarget] = useState<{ id: string; kind: "text" | "added" } | null>(null);
  const [draftText, setDraftText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedText = textRegions.find((item) => item.id === selectedId) ?? null;
  const selectedAdded = items.find((item) => item.id === selectedId) ?? null;
  const selectedItem = selectedKind === "text" ? selectedText : selectedAdded;
  const pageTexts = textRegions.filter((item) => item.page === currentPage);
  const pageItems = items.filter((item) => item.page === currentPage);
  const hasChanges = textRegions.some((t) => t.edited) || items.length > 0;
  const displayScale = stageRef.current && pageSize.width ? stageRef.current.clientWidth / pageSize.width : zoom;

  const saveHistory = useCallback((nextTexts: TextRegion[], nextItems: AddedItem[]) => {
    const next = { textRegions: nextTexts, items: nextItems };
    const truncated = historyRef.current.slice(0, historyIndexRef.current + 1);
    truncated.push(next);
    if (truncated.length > 80) truncated.shift();
    historyRef.current = truncated;
    historyIndexRef.current = truncated.length - 1;
  }, []);

  const commitTexts = useCallback((next: TextRegion[]) => {
    setTextRegions(next); saveHistory(next, items);
  }, [items, saveHistory]);
  const commitItems = useCallback((next: AddedItem[]) => {
    setItems(next); saveHistory(textRegions, next);
  }, [textRegions, saveHistory]);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1; const state = historyRef.current[historyIndexRef.current];
    setTextRegions(state.textRegions); setItems(state.items); setSelectedId(null); setSelectedKind(null);
  }, []);
  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1; const state = historyRef.current[historyIndexRef.current];
    setTextRegions(state.textRegions); setItems(state.items); setSelectedId(null); setSelectedKind(null);
  }, []);

  const renderPage = useCallback(async (pageNumber: number) => {
    const pdf = pdfRef.current; const canvas = canvasRef.current;
    if (!pdf || !canvas) return;
    const taskId = ++renderTaskRef.current;
    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      if (taskId !== renderTaskRef.current) return;
      const context = canvas.getContext("2d"); if (!context) throw new Error("Could not initialize the PDF canvas.");
      const width = Math.round(viewport.width); const height = Math.round(viewport.height);
      canvas.width = width; canvas.height = height; canvas.style.display = "block";
      setPageSize({ width, height });
      await page.render({ canvasContext: context, viewport }).promise;
      if (taskId !== renderTaskRef.current) return;
      const content = await page.getTextContent();
      const styles = (content as any).styles ?? {};
      const extracted: TextRegion[] = [];
      const util = (await import("pdfjs-dist/legacy/build/pdf.mjs")).Util;
      const fragments: Array<{ str: string; x: number; baseline: number; top: number; w: number; h: number; fontSizePx: number; fontName: string; fontFamily: string; bold: boolean; italic: boolean }> = [];

      // PDF.js often splits a visible line into many tiny text items. Convert them
      // into editable runs first so a tap selects a useful chunk instead of one word.
      for (const entry of content.items) {
        if (!entry || typeof entry.str !== "string" || !entry.str.trim() || !entry.transform) continue;
        const tx = util.transform(viewport.transform, entry.transform);
        const fontSizePx = Math.max(6, Math.hypot(tx[2], tx[3]));
        const fontName = String(entry.fontName ?? "");
        const style = styles[fontName] ?? {};
        const fontFamily = String(style.fontFamily ?? "Arial, sans-serif");
        const styleName = `${fontName} ${fontFamily}`;
        const ascent = typeof style.ascent === "number" ? style.ascent : 0.8;
        const descent = typeof style.descent === "number" ? style.descent : -0.2;
        const glyphHeight = Math.max(fontSizePx, fontSizePx * (ascent - descent));
        fragments.push({
          str: entry.str, x: tx[4], baseline: tx[5], top: tx[5] - fontSizePx * ascent,
          w: Math.max(1, Number(entry.width || 0) * viewport.scale), h: glyphHeight,
          fontSizePx, fontName, fontFamily,
          bold: /bold|black|heavy|demi/i.test(styleName),
          italic: /italic|oblique/i.test(styleName),
        });
      }

      fragments.sort((a, b) => a.baseline - b.baseline || a.x - b.x);
      const rows: typeof fragments[] = [];
      for (const fragment of fragments) {
        let row = rows.find((candidate) => Math.abs(candidate[0].baseline - fragment.baseline) <= Math.max(2.5, Math.min(6, fragment.fontSizePx * 0.28)));
        if (!row) { row = []; rows.push(row); }
        row.push(fragment);
      }
      rows.sort((a, b) => Math.min(...a.map((f) => f.top)) - Math.min(...b.map((f) => f.top)));
      let runIndex = 0;
      for (const row of rows) {
        row.sort((a, b) => a.x - b.x);
        let run: typeof fragments = [];
        const flushRun = () => {
          if (!run.length) return;
          const first = run[0];
          const left = Math.max(0, Math.min(width - 1, first.x));
          const right = Math.min(width, Math.max(...run.map((f) => f.x + f.w)) + 1);
          const top = Math.max(0, Math.min(height - 1, Math.min(...run.map((f) => f.top))));
          const bottom = Math.min(height, Math.max(...run.map((f) => f.top + f.h)) + 1);
          let text = "";
          run.forEach((f, i) => {
            if (i > 0) {
              const previous = run[i - 1];
              const gap = f.x - (previous.x + previous.w);
              if (gap > Math.max(1.5, f.fontSizePx * 0.12) && !text.endsWith(" ") && !f.str.startsWith(" ")) text += " ";
            }
            text += f.str;
          });
          const regionHeight = Math.max(6, bottom - top);
          extracted.push({
            id: `pdftext-${pageNumber}-${runIndex++}`, page: pageNumber,
            x: left / width, y: top / height,
            w: Math.max(0.01, Math.min(1 - left / width, (right - left) / width)),
            h: Math.max(0.009, Math.min(1 - top / height, regionHeight / height)),
            text, originalText: text,
            // Keep PDF-point size here; multiply by renderScale only for the screen preview.
            fontSize: Math.max(4, first.fontSizePx / viewport.scale),
            color: sampleTextColor(canvas, left, top, Math.max(1, right - left), Math.max(1, bottom - top)),
            bold: first.bold, italic: first.italic, edited: false, fontFamily: first.fontFamily,
          });
          run = [];
        };
        for (const fragment of row) {
          const previous = run[run.length - 1];
          const sameStyle = previous && previous.fontName === fragment.fontName;
          const gap = previous ? fragment.x - (previous.x + previous.w) : 0;
          const closeEnough = previous && gap <= Math.max(18, fragment.fontSizePx * 2.2) && gap >= -fragment.fontSizePx * 0.6;
          if (run.length && !(sameStyle && closeEnough)) flushRun();
          run.push(fragment);
        }
        flushRun();
      }

      setTextRegions((current) => {
        const otherPages = current.filter((t) => t.page !== pageNumber);
        const edits = new Map(current.filter((t) => t.page === pageNumber).map((t) => [t.id, t]));
        const next = [...otherPages, ...extracted.map((t) => edits.get(t.id) ?? t)];
        // Before the first user edit, keep the undo baseline in sync with pages parsed so far.
        if (historyIndexRef.current === 0 && historyRef.current.length === 1) {
          historyRef.current = [{ textRegions: next, items }];
        }
        return next;
      });
      setError("");
    } catch (err) {
      console.error("PDF rendering failed:", err);
      if (taskId === renderTaskRef.current) setError(err instanceof Error ? `Could not display page ${pageNumber}: ${err.message}` : "Could not display this PDF page.");
    }
  }, []);

  useEffect(() => { if (pdfRef.current) void renderPage(currentPage); }, [currentPage, renderPage]);

  // Focus the actual textarea as soon as the edit sheet mounts. This gives mobile
  // browsers the best opportunity to open the on-screen keyboard automatically.
  useLayoutEffect(() => {
    if (!editingTarget) return;
    const input = textInputRef.current;
    if (!input) return;
    input.focus({ preventScroll: true });
    const end = input.value.length;
    try { input.setSelectionRange(end, end); } catch { /* unsupported input selection */ }
  }, [editingTarget]);

  async function handlePdfUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) { setError("Choose a PDF file."); return; }
    if (file.size > 40 * 1024 * 1024) { setError("Choose a PDF smaller than 40 MB."); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjs.getDocument({ data: bytes.slice() }).promise as unknown as PdfJsDocument;
      originalPdfRef.current = bytes; pdfRef.current = pdf; setFileName(file.name); setPageCount(pdf.numPages); setCurrentPage(1);
      setTextRegions([]); setItems([]); setSelectedId(null); setSelectedKind(null); setEditingTarget(null); setDraftText(""); setZoom(1);
      historyRef.current = [{ textRegions: [], items: [] }]; historyIndexRef.current = 0;
      setMessage("PDF opened. Tap existing text to edit it, or add text and images.");
      window.setTimeout(() => void renderPage(1), 0);
    } catch (err) { console.error("PDF open failed:", err); setError("This PDF could not be opened. It may be damaged, encrypted, or unsupported."); }
    finally { setLoading(false); }
  }

  function openTextEditor(id: string, kind: "text" | "added", initialText?: string) {
    const region = textRegions.find((t) => t.id === id);
    const added = items.find((t) => t.id === id && t.type === "text");
    const value = initialText ?? (kind === "text" ? region?.text : added?.text) ?? "";
    setSelectedId(id);
    setSelectedKind(kind);
    setDraftText(value);
    setEditingTarget({ id, kind });
  }

  function cancelTextEdit() {
    setEditingTarget(null);
  }

  function applyTextEdit() {
    if (!editingTarget) return;
    if (editingTarget.kind === "text") {
      const next = textRegions.map((region) => region.id === editingTarget.id
        ? { ...region, text: draftText, edited: draftText !== region.originalText }
        : region);
      setTextRegions(next);
      saveHistory(next, items);
    } else {
      const next = items.map((item) => item.id === editingTarget.id && item.type === "text"
        ? { ...item, text: draftText }
        : item);
      setItems(next);
      saveHistory(textRegions, next);
    }
    setEditingTarget(null);
    setMessage("Text updated. Review the page, then download your edited PDF.");
  }

  function addText() {
    const id = crypto.randomUUID();
    const next = [...items, { id, type: "text" as const, page: currentPage, x: 0.1, y: 0.12, w: 0.7, h: 0.09, text: "", fontSize, bold: false, italic: false, color: textColor }];
    commitItems(next);
    setSelectedId(id); setSelectedKind("added");
    setDraftText(""); setEditingTarget({ id, kind: "added" });
    setMessage("New text box added.");
  }
  function addLine() {
    const id = crypto.randomUUID(); const next = [...items, { id, type: "line" as const, page: currentPage, x: 0.1, y: 0.25, w: 0.65, h: 0.008, fontSize: 1, bold: false, italic: false, color: textColor }];
    commitItems(next); setSelectedId(id); setSelectedKind("added");
  }
  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) { setError("Choose a PNG or JPG image."); return; }
    if (file.size > 12 * 1024 * 1024) { setError("Choose an image smaller than 12 MB."); return; }
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Could not read this image.")); reader.readAsDataURL(file); });
      const id = crypto.randomUUID(); const next = [...items, { id, type: "image" as const, page: currentPage, x: 0.1, y: 0.32, w: 0.3, h: 0.2, imageData: dataUrl, imageType: file.type === "image/png" ? "png" as const : "jpg" as const, fontSize: 12, bold: false, italic: false, color: textColor }];
      commitItems(next); setSelectedId(id); setSelectedKind("added");
    } catch (err) { setError(err instanceof Error ? err.message : "Image upload failed."); }
  }

  function startDrag(event: ReactPointerEvent<HTMLElement>, id: string, kind: "added" | "text", handle?: string) {
    if (!stageRef.current) return; event.preventDefault(); event.stopPropagation();
    const entry = kind === "text" ? textRegions.find((t) => t.id === id) : items.find((t) => t.id === id);
    if (!entry) return;
    setSelectedId(id); setSelectedKind(kind);
    dragRef.current = { id, kind, handle, px: event.clientX, py: event.clientY, x: entry.x, y: entry.y, w: entry.w, h: entry.h };
    const move = (e: PointerEvent) => {
      const d = dragRef.current; const stage = stageRef.current; if (!d || !stage) return;
      const r = stage.getBoundingClientRect(); const dx = (e.clientX - d.px) / r.width; const dy = (e.clientY - d.py) / r.height;
      const resize = Boolean(d.handle);
      const change = (entry: any) => {
        let x = d.x, y = d.y, w = d.w, h = d.h;
        if (!resize) { x += dx; y += dy; }
        else {
          if (d.handle?.includes("e")) w = Math.max(0.025, d.w + dx);
          if (d.handle?.includes("s")) h = Math.max(0.015, d.h + dy);
          if (d.handle?.includes("w")) { x = d.x + dx; w = Math.max(0.025, d.w - dx); }
          if (d.handle?.includes("n")) { y = d.y + dy; h = Math.max(0.015, d.h - dy); }
        }
        return { ...entry, x: Math.max(0, Math.min(0.98, x)), y: Math.max(0, Math.min(0.98, y)), w: Math.max(0.02, Math.min(1 - Math.max(0, x), w)), h: Math.max(0.012, Math.min(1 - Math.max(0, y), h)) };
      };
      if (d.kind === "added") setItems((current) => current.map((t) => t.id === d.id ? change(t) : t));
      else setTextRegions((current) => current.map((t) => t.id === d.id ? change(t) : t));
    };
    const stop = () => {
      const d = dragRef.current; dragRef.current = null;
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); window.removeEventListener("pointercancel", stop);
      if (d) saveHistory(textRegions, items);
    };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", stop); window.addEventListener("pointercancel", stop);
  }

  function deleteSelected() {
    if (!selectedId) return;
    if (selectedKind === "added") commitItems(items.filter((t) => t.id !== selectedId));
    else if (selectedKind === "text") {
      const next = textRegions.map((t) => t.id === selectedId ? { ...t, text: "", edited: true } : t); commitTexts(next);
    }
    setSelectedId(null); setSelectedKind(null);
  }

  async function exportPdf() {
    const original = originalPdfRef.current; if (!original) return;
    setExporting(true); setError(""); setMessage("");
    try {
      const pdf = await PDFDocument.load(original); const pages = pdf.getPages();
      const regular = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
      const boldItalic = await pdf.embedFont(StandardFonts.HelveticaBoldOblique);
      const timesRegular = await pdf.embedFont(StandardFonts.TimesRoman);
      const timesBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
      const timesItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
      const timesBoldItalic = await pdf.embedFont(StandardFonts.TimesRomanBoldItalic);
      const courierRegular = await pdf.embedFont(StandardFonts.Courier);
      const courierBold = await pdf.embedFont(StandardFonts.CourierBold);
      const courierItalic = await pdf.embedFont(StandardFonts.CourierOblique);
      const courierBoldItalic = await pdf.embedFont(StandardFonts.CourierBoldOblique);
      for (const region of textRegions) {
        if (!region.edited) continue;
        const page = pages[region.page - 1]; if (!page) continue; const { width, height } = page.getSize();
        const x = region.x * width; const top = region.y * height; const w = region.w * width; const h = region.h * height;
        // Mask the original glyph area before drawing the replacement. Complex backgrounds may need manual touch-up.
        const family = (region.fontFamily ?? "").toLowerCase();
        const useTimes = /times|serif/.test(family) && !/sans/.test(family);
        const useCourier = /courier|mono/.test(family);
        const familyRegular = useCourier ? courierRegular : useTimes ? timesRegular : regular;
        const familyBold = useCourier ? courierBold : useTimes ? timesBold : bold;
        const familyItalic = useCourier ? courierItalic : useTimes ? timesItalic : italic;
        const familyBoldItalic = useCourier ? courierBoldItalic : useTimes ? timesBoldItalic : boldItalic;
        const chosen = region.bold && region.italic ? familyBoldItalic : region.bold ? familyBold : region.italic ? familyItalic : familyRegular;
        const size = Math.max(4, region.fontSize); const lines = region.text.split("\n");
        const estimatedReplacementWidth = Math.max(0, ...lines.map((line) => chosen.widthOfTextAtSize(line, size)));
        const maskWidth = Math.min(width - x, Math.max(w + 1, estimatedReplacementWidth + 2));
        const maskHeight = Math.max(h, lines.length * size * 1.25);
        page.drawRectangle({ x: Math.max(0, x - 0.4), y: height - top - maskHeight, width: maskWidth, height: Math.max(maskHeight, 3), color: rgb(1, 1, 1), opacity: 1 });
        lines.forEach((line, index) => { if (line) page.drawText(line, { x, y: height - top - size - index * size * 1.25, size, font: chosen, color: hexRgb(region.color), maxWidth: Math.max(1, maskWidth) }); });
      }
      for (const item of items) {
        const page = pages[item.page - 1]; if (!page) continue; const { width, height } = page.getSize();
        const x = item.x * width; const top = item.y * height; const w = item.w * width; const h = item.h * height;
        if (item.type === "line") page.drawLine({ start: { x, y: height - top }, end: { x: x + w, y: height - top }, thickness: Math.max(0.7, item.fontSize), color: hexRgb(item.color) });
        if (item.type === "text" && item.text) {
          const f = item.bold && item.italic ? boldItalic : item.bold ? bold : item.italic ? italic : regular;
          item.text.split("\n").forEach((line, index) => { if (line) page.drawText(line, { x, y: height - top - item.fontSize - index * item.fontSize * 1.25, size: item.fontSize, font: f, color: hexRgb(item.color), maxWidth: w }); });
        }
        if (item.type === "image" && item.imageData) {
          const raw = Uint8Array.from(atob(item.imageData.split(",")[1]), (c) => c.charCodeAt(0));
          const img = item.imageType === "png" ? await pdf.embedPng(raw) : await pdf.embedJpg(raw);
          page.drawImage(img, { x, y: height - top - h, width: w, height: h });
        }
      }
      const bytes = await pdf.save(); downloadBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }), `${fileName.replace(/\.pdf$/i, "") || "document"}-edited.pdf`);
      setMessage("Your edited PDF has been downloaded to your device.");
    } catch (err) { console.error("PDF export failed:", err); setError("Could not export this PDF. Try another file or remove a very large image."); }
    finally { setExporting(false); }
  }

  function updateAdded(changes: Partial<AddedItem>) {
    if (!selectedId || selectedKind !== "added") return;
    commitItems(items.map((t) => t.id === selectedId ? { ...t, ...changes } : t));
  }
  function updateTextRegion(changes: Partial<TextRegion>) {
    if (!selectedId || selectedKind !== "text") return;
    commitTexts(textRegions.map((t) => t.id === selectedId ? { ...t, ...changes, edited: true } : t));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_#e0e7ff_0%,_#f5f3ff_32%,_#f8fafc_72%)] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"/><div className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-violet-300/25 blur-3xl"/></div>
      <div className="relative mx-auto max-w-[1500px] px-2 pb-24 pt-3 sm:px-6 sm:py-7 sm:pb-7">
        <header className="mb-3 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/65 p-3 shadow-[0_12px_40px_rgba(79,70,229,0.09)] backdrop-blur-2xl sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:p-6">
          <div className="flex items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20"><FileText size={23}/></div><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-indigo-600">MindraInfo · PDF studio</p><h1 className="mt-1 text-xl font-black tracking-tight sm:text-3xl">PDF Editor</h1><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">Edit text, place content, and save a new copy — right in your browser.</p><div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold"><span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">No sign-up</span><span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">No payment required</span><span className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-slate-600">Files stay in your browser</span></div></div></div>
          <button type="button" className={`${accentBtn} min-h-12 w-full sm:w-auto`} onClick={exportPdf} disabled={!fileName || exporting || !hasChanges}>{exporting ? <span className="animate-spin">◌</span> : <Download size={18}/>} {exporting ? "Preparing PDF…" : "Download edited PDF"}</button>
        </header>
        <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handlePdfUpload}/>
        <input ref={imageInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleImageUpload}/>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0 overflow-hidden rounded-3xl border border-white/70 bg-white/55 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto border-b border-white/70 p-2.5 sm:flex-wrap sm:overflow-visible sm:p-4" style={{ WebkitOverflowScrolling: "touch" }}>
              <button className={`${btn} shrink-0`} onClick={() => fileInputRef.current?.click()}><Upload size={16}/>{fileName ? "Open PDF" : "Open PDF"}</button>
              {fileName && <span className="max-w-[220px] truncate text-xs font-semibold text-slate-500">{fileName}</span>}
              <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block"/>
              <button className={`${btn} shrink-0`} onClick={undo} disabled={historyIndexRef.current <= 0} title="Undo"><Undo2 size={16}/><span className="hidden xs:inline">Undo</span></button>
              <button className={`${btn} shrink-0`} onClick={redo} disabled={historyIndexRef.current >= historyRef.current.length - 1} title="Redo"><Redo2 size={16}/><span className="hidden xs:inline">Redo</span></button>
              <button className={`${btn} shrink-0`} onClick={addText} disabled={!fileName}><Type size={16}/>Text</button>
              <button className={`${btn} shrink-0`} onClick={addLine} disabled={!fileName}><Minus size={16}/>Line</button>
              <button className={`${btn} shrink-0`} onClick={() => imageInputRef.current?.click()} disabled={!fileName}><FileImage size={16}/>Photo</button>
            </div>
            {error && <div role="alert" className="mx-3 mt-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-3 text-sm text-rose-800 sm:mx-4">{error}<button className="ml-2 underline" onClick={() => setError("")}>Dismiss</button></div>}
            {message && <p role="status" className="px-4 pt-3 text-xs font-medium text-slate-500">{message}</p>}
            {!fileName ? <div className="m-4 rounded-3xl border-2 border-dashed border-indigo-200 bg-white/50 px-5 py-16 text-center sm:py-24"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700"><Upload size={27}/></div><h2 className="mt-5 text-xl font-extrabold">Bring your PDF into the studio</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Tap existing text to select it, add new content, or place an image. Your original file remains unchanged.</p><button className={`${accentBtn} mt-5`} onClick={() => fileInputRef.current?.click()} disabled={loading}>{loading ? "Opening PDF…" : "Choose a PDF"}</button><p className="mt-4 text-xs text-slate-400">PDF files up to 40 MB · No account needed</p></div> : <>
              <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4"><div className="flex items-center gap-2"><button className={btn} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}><ChevronLeft size={16}/><span className="hidden sm:inline">Previous</span></button><span className="min-w-24 text-center text-xs font-bold tabular-nums text-slate-600">Page {currentPage} / {pageCount}</span><button className={btn} onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))} disabled={currentPage >= pageCount}><span className="hidden sm:inline">Next</span><ChevronRight size={16}/></button></div><div className="flex items-center gap-2"><button className={btn} onClick={() => setZoom((z) => Math.max(.6, z - .1))} aria-label="Zoom out"><Minus size={15}/></button><span className="min-w-12 text-center text-xs font-bold tabular-nums">{Math.round(zoom * 100)}%</span><button className={btn} onClick={() => setZoom((z) => Math.min(1.8, z + .1))} aria-label="Zoom in"><Plus size={15}/></button></div></div>
              <div className="max-h-[68vh] overflow-auto bg-slate-200/55 p-1.5 sm:max-h-[78vh] sm:p-6"><div className="mx-auto w-full max-w-4xl"><div ref={stageRef} className="relative mx-auto bg-white shadow-[0_18px_55px_rgba(15,23,42,0.20)]" style={{aspectRatio: pageSize.width && pageSize.height ? `${pageSize.width}/${pageSize.height}` : "1/1.414", width: `${zoom * 100}%`, maxWidth: "none"}} onPointerDown={(e) => { if (e.target === stageRef.current || e.target === canvasRef.current) { setSelectedId(null); setSelectedKind(null); } }}>
                <canvas ref={canvasRef} className="pointer-events-none relative z-0 block h-auto w-full" style={{display:"block",maxWidth:"100%"}}/>
                {pageTexts.map((t) => {
                  const active = selectedId === t.id && selectedKind === "text";
                  return <div
                    key={t.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Edit PDF text: ${t.text.slice(0, 80)}`}
                    onClick={() => openTextEditor(t.id, "text")}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openTextEditor(t.id, "text"); } }}
                    className={`absolute z-10 overflow-visible ${active ? "rounded-sm outline outline-2 outline-indigo-500" : "hover:outline hover:outline-1 hover:outline-indigo-300"} ${t.edited ? "bg-white" : "bg-transparent"}`}
                    style={{
                      left: `${t.x * 100}%`, top: `${t.y * 100}%`, width: `${t.w * 100}%`,
                      minHeight: `${Math.max(t.h * 100, 0.9)}%`,
                      // PDF.js extraction height uses the page render scale (1.5). Apply it
                      // back when drawing DOM text, otherwise edited text appears too small.
                      fontSize: `${Math.max(6, t.fontSize * 1.5 * displayScale)}px`,
                      fontFamily: t.fontFamily || "Arial, sans-serif",
                      fontWeight: t.bold ? 700 : 400, fontStyle: t.italic ? "italic" : "normal",
                      lineHeight: 1, color: t.color, cursor: "text", whiteSpace: "pre", touchAction: "manipulation",
                      overflowWrap: "normal", maxWidth: "none",
                    }}
                    title="Tap to edit this text in the editor"
                  >
                    <span className={`block min-h-full outline-none ${t.edited ? "whitespace-pre" : "pointer-events-none select-none text-transparent"}`}>
                      {t.edited ? t.text : t.originalText}
                    </span>
                  </div>;
                })}
                {pageItems.map((item) => {
                  const active = selectedId === item.id && selectedKind === "added";
                  return <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id); setSelectedKind("added");
                      if (item.type === "text") openTextEditor(item.id, "added");
                    }}
                    className={`absolute z-20 ${active ? "outline outline-2 outline-indigo-500" : "hover:outline hover:outline-1 hover:outline-indigo-300"}`}
                    style={{ left: `${item.x * 100}%`, top: `${item.y * 100}%`, width: `${item.w * 100}%`, height: `${item.h * 100}%`, cursor: "pointer", color: item.color, fontSize: `${item.fontSize * displayScale * 1.5}px`, fontWeight: item.bold ? 700 : 400, fontStyle: item.italic ? "italic" : "normal", lineHeight: 1.25, whiteSpace: "pre-wrap", overflow: "visible", touchAction: "manipulation" }}
                  >
                    {item.type === "text" && <span className="block h-full w-full overflow-visible break-words">{item.text || "Tap to type"}</span>}
                    {item.type === "line" && <span className="absolute left-0 right-0 top-1/2 block" style={{ borderTop: `2px solid ${item.color}` }} />}
                    {item.type === "image" && item.imageData && <img src={item.imageData} alt="Added to PDF" draggable={false} className="pointer-events-none h-full w-full object-fill" />}
                    {active && <button type="button" aria-label="Move selected object" onPointerDown={(e) => { e.stopPropagation(); startDrag(e, item.id, "added"); }} className="absolute -top-8 left-0 z-30 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-md">Move</button>}
                    {active && item.type === "image" && <>{["nw", "ne", "sw", "se"].map((h) => <button key={h} type="button" aria-label={`Resize ${h}`} onPointerDown={(e) => startDrag(e, item.id, "added", h)} className={`absolute z-30 h-8 w-8 touch-none rounded-full border-2 border-white bg-indigo-600 shadow-md sm:h-4 sm:w-4 sm:rounded-sm ${h.includes("n") ? "top-[-16px] sm:top-[-8px]" : "bottom-[-16px] sm:bottom-[-8px]"} ${h.includes("w") ? "left-[-16px] sm:left-[-8px]" : "right-[-16px] sm:right-[-8px]"}`} />)}</>}
                  </div>;
                })}
              </div></div></div>
              <div className="border-t border-white/70 px-4 py-3 text-xs leading-5 text-slate-500">Tap a text region to open the large text editor. Backspace and Delete use the phone keyboard normally. PDF formatting is preserved approximately; complex paragraphs and embedded fonts cannot always be reconstructed exactly.</div>
            </>}
          </section>
          <aside id="pdf-editor-properties" className={`${showProperties ? "block" : "hidden"} h-fit rounded-2xl border border-white/70 bg-white/80 p-3 shadow-[0_12px_40px_rgba(79,70,229,0.08)] backdrop-blur-2xl sm:sticky sm:top-4 sm:block sm:rounded-3xl sm:p-5`}>
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-indigo-600">Properties</p><h2 className="mt-1 text-lg font-black">Selection</h2></div><MousePointer2 className="text-indigo-500" size={20}/></div>
            {!selectedItem ? <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/50 p-4 text-sm leading-6 text-slate-500">Select text or an added object on the page to edit its properties.</div> : <div className="mt-4 space-y-4">
              {(selectedKind === "text" || selectedAdded?.type === "text") && <button className={`${accentBtn} w-full`} onClick={() => openTextEditor(selectedId!, selectedKind === "text" ? "text" : "added")}><Type size={16}/>Open large text editor</button>}
              <div className="grid grid-cols-2 gap-3"><label className="block text-xs font-bold text-slate-600">Font size<select value={selectedItem.fontSize} onChange={(e) => selectedKind === "text" ? updateTextRegion({fontSize:Number(e.target.value)}) : updateAdded({fontSize:Number(e.target.value)})} className="mt-2 min-h-10 w-full rounded-xl border border-white bg-white px-2 text-sm">{[8,9,10,11,12,14,16,18,20,24,28,32,36].map((s)=><option key={s} value={s}>{s} pt</option>)}</select></label><label className="block text-xs font-bold text-slate-600">Text color<input type="color" value={selectedItem.color} onChange={(e) => selectedKind === "text" ? updateTextRegion({color:e.target.value}) : updateAdded({color:e.target.value})} className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white bg-white p-1"/></label></div>
              {(selectedKind === "text" || selectedAdded?.type === "text") && <div className="flex gap-2"><button className={`${btn} flex-1`} onClick={() => selectedKind === "text" ? updateTextRegion({bold:!selectedText?.bold}) : updateAdded({bold:!selectedAdded?.bold})} aria-pressed={selectedItem.bold}><Bold size={16}/>Bold</button><button className={`${btn} flex-1`} onClick={() => selectedKind === "text" ? updateTextRegion({italic:!selectedText?.italic}) : updateAdded({italic:!selectedAdded?.italic})} aria-pressed={selectedItem.italic}><Italic size={16}/>Italic</button></div>}
              <button className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100" onClick={deleteSelected}><Trash2 size={16}/>{selectedKind === "text" ? "Clear selected text" : "Delete selected object"}</button>
            </div>}
            <div className="my-5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"/><h3 className="text-sm font-extrabold">Quick tools</h3><div className="mt-3 grid grid-cols-2 gap-2"><button className={btn} onClick={addText} disabled={!fileName}><Type size={15}/>Add text</button><button className={btn} onClick={addLine} disabled={!fileName}><Minus size={15}/>Add line</button><button className={`${btn} col-span-2`} onClick={() => imageInputRef.current?.click()} disabled={!fileName}><FileImage size={15}/>Add photo</button></div>
            <button className={`${accentBtn} mt-4 w-full`} onClick={exportPdf} disabled={!fileName || exporting || !hasChanges}>{exporting ? "Preparing…" : <><Download size={17}/>Download PDF</>}</button>
            <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">Free to use · No sign-up · No payment required</p>
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3 text-xs leading-5 text-emerald-900"><Check size={15} className="mb-1"/><strong>Local document processing.</strong> This editor reads your selected PDF in the browser and does not send the PDF to a MindraInfo upload endpoint. The PDF.js worker script is loaded from cdnjs. Your original file is not overwritten.</div>
          </aside>
        </div>

        <section aria-labelledby="pdf-editor-guide" className="mx-auto mt-5 max-w-5xl rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_16px_55px_rgba(79,70,229,0.07)] backdrop-blur-2xl sm:mt-8 sm:p-8">
          <header className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-indigo-600">MindraInfo PDF tools</p>
            <h2 id="pdf-editor-guide" className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">How to edit a PDF online on your phone</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Use the PDF editor in your mobile browser to make supported text changes, add text or lines, place photos, and download a separate edited copy. No account is required and there is no payment required to use this tool.</p>
          </header>

          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            <li className="rounded-2xl border border-slate-100 bg-white/80 p-4"><h3 className="font-extrabold text-slate-900">1. Open a PDF</h3><p className="mt-1 text-sm leading-6 text-slate-600">Tap Open PDF and choose a PDF file from your phone. Files over 40 MB are rejected to help prevent browser memory problems.</p></li>
            <li className="rounded-2xl border border-slate-100 bg-white/80 p-4"><h3 className="font-extrabold text-slate-900">2. Select and edit text</h3><p className="mt-1 text-sm leading-6 text-slate-600">Tap a recognized text region to open the larger text editor. Type or delete text, then apply your changes and review the page.</p></li>
            <li className="rounded-2xl border border-slate-100 bg-white/80 p-4"><h3 className="font-extrabold text-slate-900">3. Add content</h3><p className="mt-1 text-sm leading-6 text-slate-600">Use the editing tools to add a text box, a line, or a JPG/PNG photo. Select added items to move or resize them where supported.</p></li>
            <li className="rounded-2xl border border-slate-100 bg-white/80 p-4"><h3 className="font-extrabold text-slate-900">4. Download a new copy</h3><p className="mt-1 text-sm leading-6 text-slate-600">Use Download edited PDF to save a new file to your device. The original PDF is not overwritten. Open the downloaded copy to verify the final result.</p></li>
          </ol>

          <div className="mt-7 grid gap-6 border-t border-slate-100 pt-6 md:grid-cols-2">
            <section aria-labelledby="pdf-editor-privacy">
              <h2 id="pdf-editor-privacy" className="text-lg font-black text-slate-900">How your PDF is processed</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">In this editor, the selected file is read with browser file APIs and its bytes are passed to PDF.js in the browser. Changes and the downloaded PDF are created with pdf-lib in the browser. This page's editor code does not upload your selected PDF to a MindraInfo endpoint. The PDF.js worker script itself is requested from cdnjs, and the page still makes normal website asset requests. Avoid using a shared device for sensitive documents and close the page when finished.</p>
            </section>
            <section aria-labelledby="pdf-editor-limits">
              <h2 id="pdf-editor-limits" className="text-lg font-black text-slate-900">What to know before editing</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">PDFs usually store text at fixed positions rather than as flowing Word-style paragraphs. This editor rebuilds recognized text regions and uses standard fonts for replacements, so exact fonts, spacing, wrapping, and colored or complex backgrounds may not be preserved perfectly. Scanned PDFs usually contain page images instead of a text layer; OCR is not included. Always review the downloaded PDF before sharing it.</p>
            </section>
          </div>

          <section aria-labelledby="pdf-editor-faq" className="mt-7 border-t border-slate-100 pt-6">
            <h2 id="pdf-editor-faq" className="text-lg font-black text-slate-900">PDF editor FAQs</h2>
            <div className="mt-3 divide-y divide-slate-100">
              <details className="py-3"><summary className="cursor-pointer font-bold text-slate-800">Can I use this PDF editor on my phone?</summary><p className="mt-2 text-sm leading-6 text-slate-600">Yes. The interface is designed for mobile screens, with a larger text-editing panel and touch-friendly controls. Very large PDFs may still exceed a phone's available memory.</p></details>
              <details className="py-3"><summary className="cursor-pointer font-bold text-slate-800">Do I need an account or payment?</summary><p className="mt-2 text-sm leading-6 text-slate-600">No sign-up or payment is required to use the current editor.</p></details>
              <details className="py-3"><summary className="cursor-pointer font-bold text-slate-800">Will the original PDF font and layout stay exactly the same?</summary><p className="mt-2 text-sm leading-6 text-slate-600">Not in every PDF. Replacements use a closest available standard font, and PDF text does not behave exactly like a Word document. Review the exported copy, especially for mixed fonts, complex paragraphs, forms, and colored backgrounds.</p></details>
              <details className="py-3"><summary className="cursor-pointer font-bold text-slate-800">Can I edit a scanned PDF?</summary><p className="mt-2 text-sm leading-6 text-slate-600">Not as existing selectable text unless the PDF includes a text layer. This tool does not currently run OCR. You can still add supported text or images over a scanned page.</p></details>
              <details className="py-3"><summary className="cursor-pointer font-bold text-slate-800">What file size is supported?</summary><p className="mt-2 text-sm leading-6 text-slate-600">The current editor accepts PDF files up to 40 MB and JPG/PNG images up to 12 MB. Device memory and PDF complexity can also affect processing.</p></details>
            </div>
          </section>

          <p className="mt-6 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">Looking for another utility? <a href="/tools" className="font-bold text-indigo-700 underline decoration-indigo-300 underline-offset-4 hover:text-indigo-900">Browse all MindraInfo tools</a>.</p>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/70 bg-white/90 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:hidden">
          <div className="mx-auto grid max-w-lg grid-cols-5 gap-1.5">
            <button className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold text-slate-700 active:bg-indigo-50" onClick={() => fileInputRef.current?.click()}><Upload size={18}/>Open</button>
            <button className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold text-slate-700 active:bg-indigo-50" onClick={undo} disabled={historyIndexRef.current <= 0}><Undo2 size={18}/>Undo</button>
            <button className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold text-slate-700 active:bg-indigo-50" onClick={addText} disabled={!fileName}><Type size={18}/>Text</button>
            <button className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold text-slate-700 active:bg-indigo-50" onClick={() => { setShowProperties((v) => !v); if (!showProperties) window.setTimeout(() => document.getElementById("pdf-editor-properties")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }}><MousePointer2 size={18}/>{showProperties ? "Hide" : "Edit"}</button>
            <button className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-indigo-600 text-[10px] font-bold text-white disabled:opacity-40" onClick={exportPdf} disabled={!fileName || exporting || !hasChanges}><Download size={18}/>{exporting ? "Saving" : "Save PDF"}</button>
          </div>
        </div>
        {editingTarget && <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(e) => { if (e.target === e.currentTarget) cancelTextEdit(); }}
          onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
          role="presentation"
        >
          <section
            role="dialog" aria-modal="true" aria-labelledby="pdf-text-editor-title"
            className="flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.75rem] border border-white/80 bg-white/95 shadow-[0_-20px_80px_rgba(15,23,42,.25)] backdrop-blur-2xl sm:rounded-3xl"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-indigo-600">MindraInfo · Text editor</p>
                <h2 id="pdf-text-editor-title" className="mt-1 text-lg font-black text-slate-900 sm:text-xl">Edit text</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Tap inside the text to position the cursor. Backspace, Delete, select and type work like a normal text field.</p>
              </div>
              <button type="button" aria-label="Close text editor" onClick={cancelTextEdit} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 active:bg-slate-200">×</button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              <label htmlFor="pdf-text-draft" className="mb-2 block text-sm font-bold text-slate-700">Selected text</label>
              <textarea
                id="pdf-text-draft" ref={textInputRef} autoFocus value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={8} spellCheck={false} autoCapitalize="sentences" enterKeyHint="done"
                className="min-h-[30dvh] w-full resize-y rounded-2xl border-2 border-indigo-100 bg-white px-4 py-4 text-[17px] leading-7 text-slate-900 shadow-inner outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:min-h-[220px] sm:text-base"
                placeholder="Write or edit your text here…"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">The PDF preview updates when you apply. Original font matching depends on the fonts and structure stored in the PDF.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 px-4 pt-3 sm:px-6">
              <button type="button" onClick={cancelTextEdit} className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 active:bg-slate-50">Cancel</button>
              <button type="button" onClick={applyTextEdit} className="min-h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/20 active:brightness-95"><Check size={17} className="mr-2 inline"/>Apply text</button>
            </div>
          </section>
        </div>}
        <footer className="py-8 text-center text-xs text-slate-400">MindraInfo PDF Studio · Designed for mobile editing</footer>
      </div>
    </main>
  );
}
