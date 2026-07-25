"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Expand,
  FolderKanban,
  Images,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectsBlock } from "@/lib/types";

type Project = ProjectsBlock["items"][number];

export function ProjectsSection({ block }: { block: ProjectsBlock }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [slide, setSlide] = useState(0);

  function open(project: Project) {
    const defaultIndex = Math.max(
      0,
      project.images.findIndex(
        (image) => image.id === project.defaultImageId,
      ),
    );
    setSlide(defaultIndex);
    setSelected(project);
  }

  return (
    <section className="content-section projects-section">
      {block.title && <h2 className="section-title">{block.title}</h2>}
      <div className="project-card-grid">
        {block.items.map((project) => {
          const cover =
            project.images.find(
              (image) => image.id === project.defaultImageId,
            ) || project.images[0];
          return (
            <button
              type="button"
              className="project-card"
              key={project.id}
              onClick={() => open(project)}
            >
              <span className="project-card-image">
                {cover?.src ? (
                  <Image
                    src={cover.src}
                    alt={cover.alt || project.title}
                    fill
                    sizes="(max-width: 700px) 100vw, 400px"
                  />
                ) : (
                  <span className="project-image-placeholder">
                    <FolderKanban size={30} />
                  </span>
                )}
                <span className="project-card-shade" />
                <span className="project-expand"><Expand size={17} /></span>
              </span>
              <span className="project-card-copy">
                <strong>{project.title || "Untitled project"}</strong>
                <small>{project.caption}</small>
                <span><Images size={14} /> {project.images.length} image{project.images.length === 1 ? "" : "s"}</span>
              </span>
            </button>
          );
        })}
      </div>
      {selected &&
        typeof document !== "undefined" &&
        createPortal(
          <ProjectDialog
            project={selected}
            slide={slide}
            onSlide={setSlide}
            onClose={() => setSelected(null)}
          />,
          document.body,
        )}
    </section>
  );
}

function ProjectDialog({
  project,
  slide,
  onSlide,
  onClose,
}: {
  project: Project;
  slide: number;
  onSlide: (index: number) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && project.images.length > 1)
        onSlide((slide + 1) % project.images.length);
      if (event.key === "ArrowLeft" && project.images.length > 1)
        onSlide((slide - 1 + project.images.length) % project.images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, onSlide, project.images.length, slide]);

  const current = project.images[slide];
  const next = () => onSlide((slide + 1) % project.images.length);
  const previous = () =>
    onSlide((slide - 1 + project.images.length) % project.images.length);

  return (
    <div className="project-dialog-backdrop" onMouseDown={onClose}>
      <section
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="project-dialog-close"
          onClick={onClose}
          aria-label="Close project"
        >
          <X />
        </button>
        <div className="project-slider">
          {current?.src ? (
            <Image
              src={current.src}
              alt={current.alt || project.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 65vw"
            />
          ) : (
            <span className="project-image-placeholder">
              <FolderKanban size={42} />
            </span>
          )}
          {project.images.length > 1 && (
            <>
              <button type="button" className="slider-arrow previous" onClick={previous} aria-label="Previous image"><ArrowLeft /></button>
              <button type="button" className="slider-arrow next" onClick={next} aria-label="Next image"><ArrowRight /></button>
              <span className="slider-count">{slide + 1} / {project.images.length}</span>
            </>
          )}
        </div>
        <div className="project-dialog-content">
          <p className="project-dialog-kicker">{project.caption}</p>
          <h2 id="project-dialog-title">{project.title}</h2>
          <div className="project-description">
            {(project.description || "")
              .split("\n\n")
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
          </div>
          {project.images.length > 1 && (
            <div className="project-thumbnails" aria-label="Project images">
              {project.images.map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  className={slide === index ? "active" : ""}
                  onClick={() => onSlide(index)}
                  aria-label={`Show image ${index + 1}`}
                >
                  {image.src && (
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="76px"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
