"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { BioPage } from "@/components/bio-page";
import type { BioProfile } from "@/lib/types";

export function PreviewReceiver() {
  const [profile, setProfile] = useState<BioProfile | null>(null);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === "hsbio-preview-profile" &&
        event.data.profile?.slug !== undefined
      ) {
        setProfile(event.data.profile as BioProfile);
      }
    };
    window.addEventListener("message", receive);
    window.parent.postMessage(
      { type: "hsbio-preview-ready" },
      window.location.origin,
    );
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!profile) {
    return (
      <main className="preview-awaiting">
        <Eye size={26} />
        <strong>Preparing preview</strong>
        <span>Your page will appear here.</span>
      </main>
    );
  }

  return (
    <div
      className="preview-renderer"
      onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a")) event.preventDefault();
      }}
    >
      <BioPage profile={profile} />
    </div>
  );
}
