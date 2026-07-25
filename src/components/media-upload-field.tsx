"use client";

import {
  CheckCircle2,
  FileVideo2,
  ImageIcon,
  LoaderCircle,
  Pencil,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { ImageCropDialog } from "@/components/image-crop-dialog";

export function MediaUploadField({
  value,
  onChange,
  kind,
  placeholder,
  aspect = 4 / 3,
}: {
  value: string;
  onChange: (url: string) => void;
  kind: "image" | "video";
  placeholder?: string;
  aspect?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const [cropping, setCropping] = useState(false);

  function upload(file?: File) {
    if (!file) return;
    setError("");
    setUploaded(false);
    setUploading(true);
    setProgress(0);

    const body = new FormData();
    body.append("file", file);
    body.append("kind", kind);
    const request = new XMLHttpRequest();
    request.open("POST", "/api/uploads");
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onload = () => {
      setUploading(false);
      try {
        const result = JSON.parse(request.responseText) as {
          url?: string;
          error?: string;
        };
        if (request.status >= 200 && request.status < 300 && result.url) {
          onChange(result.url);
          setProgress(100);
          setUploaded(true);
        } else {
          setError(result.error || "Upload failed.");
        }
      } catch {
        setError("Upload failed. Check the server upload limit.");
      }
    };
    request.onerror = () => {
      setUploading(false);
      setError("Upload failed. Check your connection.");
    };
    request.send(body);
  }

  const Icon = kind === "image" ? ImageIcon : FileVideo2;
  return (
    <div className="media-upload-control">
      <div className="media-url-row">
        <span className="media-kind-icon"><Icon size={16} /></span>
        <input
          type="text"
          value={value}
          onChange={(event) => {
            setUploaded(false);
            onChange(event.target.value);
          }}
          placeholder={placeholder || (kind === "image" ? "Upload or paste an image URL" : "Upload or paste a video URL")}
        />
        {kind === "image" && value && (
          <button
            type="button"
            className="crop-trigger"
            onClick={() => setCropping(true)}
            disabled={uploading}
            aria-label="Crop image"
            title="Crop image"
          >
            <Pencil size={16} />
          </button>
        )}
        <button
          type="button"
          className="upload-trigger"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <LoaderCircle className="spin" size={17} /> : uploaded ? <CheckCircle2 size={17} /> : <UploadCloud size={17} />}
          <span>{uploading ? `${progress}%` : uploaded ? "Uploaded" : "Upload"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="sr-only-file"
        accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/gif,image/avif" : "video/mp4,video/webm,video/ogg,video/quicktime"}
        onChange={(event) => {
          upload(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {uploading && <div className="upload-progress"><span style={{ width: `${progress}%` }} /></div>}
      {error && <p className="upload-error" role="alert">{error}</p>}
      {cropping && (
        <ImageCropDialog
          source={value}
          initialAspect={aspect}
          busy={uploading}
          onClose={() => setCropping(false)}
          onApply={(file) => {
            setCropping(false);
            upload(file);
          }}
        />
      )}
    </div>
  );
}
