import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Link2 } from "lucide-react";
import type { BioProfile, ContentBlock } from "@/lib/types";
import { formatDate, safeExternalUrl } from "@/lib/utils";
import { VideoCard } from "@/components/video-card";
import { AdSlot } from "@/components/ad-slot";
import { ProjectsSection } from "@/components/projects-section";

function SectionHeading({ children }: { children?: React.ReactNode }) {
  return children ? <h2 className="section-title">{children}</h2> : null;
}

export function ContentSections({ profile }: { profile: BioProfile }) {
  return <div className="content-sections">{profile.blocks.map((block) => <ContentSection key={block.id} block={block} slug={profile.slug} />)}</div>;
}

function ContentSection({ block, slug }: { block: ContentBlock; slug: string }) {
  if (block.type === "links") return (
    <section className="content-section links-section"><SectionHeading>{block.title}</SectionHeading><div className="link-stack">
      {block.items.map((item) => <a className={`link-card ${item.featured ? "featured" : ""}`} key={item.id} href={safeExternalUrl(item.url)} target="_blank" rel="noopener noreferrer">
        <span className="link-icon"><Link2 size={18} /></span><span className="link-copy"><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span><ArrowUpRight size={19} />
      </a>)}
    </div></section>
  );
  if (block.type === "gallery") return (
    <section className="content-section gallery-section"><SectionHeading>{block.title}</SectionHeading><div className={`gallery-grid layout-${block.layout || "grid"}`}>
      {block.items.map((item, index) => {
        const image = <><Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 100vw, 50vw" /><span className="gallery-tint" />{item.caption && <span className="gallery-caption">{item.caption}</span>}</>;
        return item.url ? <a key={item.id} href={safeExternalUrl(item.url)} target="_blank" rel="noopener noreferrer" className={`gallery-item item-${index + 1}`}>{image}</a> : <div key={item.id} className={`gallery-item item-${index + 1}`}>{image}</div>;
      })}
    </div></section>
  );
  if (block.type === "posts") return (
    <section className="content-section posts-section"><SectionHeading>{block.title}</SectionHeading><div className="posts-list">
      {block.items.map((post) => <article className="post-card" key={post.id}><p>{post.content}</p><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></article>)}
    </div></section>
  );
  if (block.type === "blogs") return (
    <section className="content-section blogs-section"><SectionHeading>{block.title}</SectionHeading><div className="blog-list">
      {block.items.map((post) => <Link className="blog-card" key={post.id} href={`/${slug}/blog/${post.slug}`}>
        <div className="blog-image"><Image src={post.coverImage} alt="" fill sizes="(max-width: 700px) 100vw, 300px" /></div>
        <div className="blog-copy"><span><CalendarDays size={14} />{formatDate(post.publishedAt)}</span><h3>{post.title}</h3><p>{post.excerpt}</p><strong>Read story <ArrowUpRight size={15} /></strong></div>
      </Link>)}
    </div></section>
  );
  if (block.type === "videos") return <section className="content-section videos-section"><SectionHeading>{block.title}</SectionHeading><div className="video-list">{block.items.map((video) => <VideoCard key={video.id} video={video} />)}</div></section>;
  if (block.type === "projects") return <ProjectsSection block={block} />;
  if (block.type === "ad") return <AdSlot block={block} />;
  if (block.type === "text") return <section className="content-section text-section"><SectionHeading>{block.title}</SectionHeading><div className="rich-text">{block.content}</div></section>;
  return null;
}
