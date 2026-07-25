"use client";

import { Monitor, RefreshCw, Smartphone } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BioProfile } from "@/lib/types";

type Device = "mobile" | "desktop";

export function LiveProfilePreview({ profile }: { profile: BioProfile }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<Device>("mobile");
  const [scale, setScale] = useState(1);
  const [stageHeight, setStageHeight] = useState(700);
  const [revision, setRevision] = useState(0);

  const postProfile = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "hsbio-preview-profile", profile },
      window.location.origin,
    );
  }, [profile]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === "hsbio-preview-ready"
      ) {
        postProfile();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postProfile]);

  useEffect(() => {
    postProfile();
  }, [postProfile, revision]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const targetWidth = device === "mobile" ? 390 : 900;
      setScale(Math.min(1, (entry.contentRect.width - 18) / targetWidth));
      setStageHeight(entry.contentRect.height);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [device]);

  const targetWidth = device === "mobile" ? 390 : 900;
  const targetHeight = Math.max(760, stageHeight / Math.max(scale, 0.1));

  return (
    <aside className="live-preview-panel">
      <header>
        <div>
          <strong>Live preview</strong>
          <span>Unsaved changes update instantly.</span>
        </div>
        <div className="preview-device-controls">
          <button
            type="button"
            className={device === "mobile" ? "active" : ""}
            onClick={() => setDevice("mobile")}
            aria-label="Mobile preview"
            title="Mobile preview"
          >
            <Smartphone size={16} />
          </button>
          <button
            type="button"
            className={device === "desktop" ? "active" : ""}
            onClick={() => setDevice("desktop")}
            aria-label="Desktop preview"
            title="Desktop preview"
          >
            <Monitor size={16} />
          </button>
          <button
            type="button"
            onClick={() => setRevision((value) => value + 1)}
            aria-label="Refresh preview"
            title="Refresh preview"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>
      <div
        ref={stageRef}
        className={`preview-stage preview-${device}`}
      >
        <iframe
          key={revision}
          ref={frameRef}
          src="/admin/preview"
          title={`${device} live profile preview`}
          onLoad={postProfile}
          style={{
            width: targetWidth,
            height: targetHeight,
            transform: `translateX(-50%) scale(${scale})`,
          }}
        />
      </div>
      <footer>
        <span>{device === "mobile" ? "390 px" : "900 px"}</span>
        <span>Scroll inside preview</span>
      </footer>
    </aside>
  );
}
