"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { AdBlock } from "@/lib/types";
import { safeExternalUrl } from "@/lib/utils";

export function AdSlot({ block }: { block: AdBlock }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current || !block.code || !["html", "script", "iframe"].includes(block.format)) return;
    const range = document.createRange();
    range.selectNode(host.current);
    const fragment = range.createContextualFragment(block.code);
    host.current.replaceChildren(fragment);
  }, [block.code, block.format]);
  if (!block.enabled) return null;
  return (
    <aside className="ad-slot" aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      {block.format === "image" && block.imageUrl ? (
        <a href={safeExternalUrl(block.destinationUrl)} target="_blank" rel="sponsored noopener noreferrer">
          <Image src={block.imageUrl} alt={block.title || "Advertisement"} width={1200} height={300} sizes="(max-width: 900px) 100vw, 760px" />
        </a>
      ) : <div ref={host} className="ad-code" />}
    </aside>
  );
}
