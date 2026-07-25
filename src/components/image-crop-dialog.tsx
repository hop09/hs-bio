"use client";

import { Check, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

const aspectChoices = [
  { label: "Square", value: 1 },
  { label: "Portrait", value: 4 / 5 },
  { label: "Landscape", value: 4 / 3 },
  { label: "Widescreen", value: 16 / 9 },
  { label: "Banner", value: 3 },
];

export function ImageCropDialog({
  source,
  initialAspect,
  busy,
  onClose,
  onApply,
}: {
  source: string;
  initialAspect: number;
  busy: boolean;
  onClose: () => void;
  onApply: (file: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(initialAspect);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !processing) onClose();
    };
    document.addEventListener("keydown", close);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, processing]);

  async function apply() {
    if (!pixels) return;
    setProcessing(true);
    setError("");
    try {
      onApply(await cropImage(source, pixels));
    } catch {
      setError(
        "This remote image cannot be cropped because its host blocks editing. Upload the image first, then use the pencil.",
      );
      setProcessing(false);
    }
  }

  return (
    <div className="crop-dialog-backdrop" role="presentation">
      <section
        className="crop-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-dialog-title"
      >
        <header>
          <div><strong id="crop-dialog-title">Crop image</strong><span>Move and zoom to keep exactly what you need.</span></div>
          <button type="button" onClick={onClose} disabled={processing} aria-label="Close crop editor"><X /></button>
        </header>
        <div className="crop-stage">
          <Cropper
            image={source}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedPixels) => setPixels(croppedPixels)}
            showGrid
          />
        </div>
        <div className="crop-controls">
          <div className="aspect-picker" aria-label="Crop shape">
            {aspectChoices.map((choice) => (
              <button
                type="button"
                key={choice.label}
                className={Math.abs(aspect - choice.value) < 0.01 ? "active" : ""}
                onClick={() => setAspect(choice.value)}
              >
                {choice.label}
              </button>
            ))}
          </div>
          <div className="zoom-control">
            <Minus size={16} />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              aria-label="Zoom image"
            />
            <Plus size={16} />
            <button type="button" onClick={() => { setCrop({ x: 0, y: 0 }); setZoom(1); }} aria-label="Reset crop"><RotateCcw size={16} /></button>
          </div>
          {error && <p className="crop-error" role="alert">{error}</p>}
        </div>
        <footer>
          <button type="button" className="ghost-button" onClick={onClose} disabled={processing}>Cancel</button>
          <button type="button" className="save-button" onClick={apply} disabled={processing || busy || !pixels}><Check size={17} />{processing ? "Preparing…" : "Apply crop"}</button>
        </footer>
      </section>
    </div>
  );
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

async function cropImage(source: string, area: Area) {
  const image = await loadImage(source);
  const maxWidth = 1800;
  const scale = Math.min(1, maxWidth / area.width);
  const width = Math.max(1, Math.round(area.width * scale));
  const height = Math.max(1, Math.round(area.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    width,
    height,
  );
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.92),
  );
  if (!blob) throw new Error("Could not generate cropped image");
  return new File([blob], `crop-${Date.now()}.webp`, {
    type: "image/webp",
  });
}
