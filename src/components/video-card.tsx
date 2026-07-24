"use client";
import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { VideoBlock } from "@/lib/types";

type VideoItem = VideoBlock["items"][number];

function embedUrl(video: VideoItem) {
  if (video.provider === "youtube") {
    const id = video.source.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : video.source;
  }
  if (video.provider === "vimeo") {
    const id = video.source.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : video.source;
  }
  return video.source;
}

export function VideoCard({ video }: { video: VideoItem }) {
  const key = `hsbio-video-unlock:${video.id}`;
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(!video.externalUrl);
  const source = useMemo(() => embedUrl(video), [video]);

  useEffect(() => {
    if (!video.externalUrl) return;
    const redirectedAt = Number(sessionStorage.getItem(key));
    const wait = (video.redirectDelaySeconds ?? 12) * 1000;
    if (redirectedAt && Date.now() - redirectedAt >= wait) {
      const timer = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(timer);
    }
    else if (redirectedAt) {
      const timer = window.setTimeout(() => setReady(true), wait - (Date.now() - redirectedAt));
      return () => window.clearTimeout(timer);
    }
  }, [key, video.externalUrl, video.redirectDelaySeconds]);

  function activate() {
    if (video.externalUrl && !ready) {
      sessionStorage.setItem(key, String(Date.now()));
      window.open(video.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setPlaying(true);
  }

  return (
    <article className="video-card">
      <div className="video-frame">
        {playing ? (
          video.provider === "mp4" ? <video src={source} controls autoPlay playsInline /> :
          <iframe src={source} title={video.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={activate} aria-label={`Play ${video.title}`}>
            {video.thumbnail && <Image src={video.thumbnail} alt="" fill sizes="(max-width: 700px) 100vw, 700px" />}
            <span className="video-overlay" />
            <span className="play-button">{ready ? <Play fill="currentColor" /> : <ExternalLink />}</span>
          </button>
        )}
      </div>
      <div className="video-copy"><h3>{video.title}</h3>{video.description && <p>{video.description}</p>}</div>
    </article>
  );
}
