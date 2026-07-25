"use client";

import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  BookOpen,
  GalleryHorizontal,
  Images,
  Link2,
  Megaphone,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import type {
  AdBlock,
  BlogBlock,
  ContentBlock,
  GalleryBlock,
  LinkBlock,
  PostsBlock,
  TextBlock,
  VideoBlock,
} from "@/lib/types";

const uid = () => crypto.randomUUID();

const blockChoices = [
  { type: "links", label: "Links", detail: "Buttons and destinations", icon: Link2 },
  { type: "gallery", label: "Gallery", detail: "Linked image collection", icon: Images },
  { type: "posts", label: "Short posts", detail: "Compact updates and notes", icon: AlignLeft },
  { type: "blogs", label: "Blog posts", detail: "Long-form articles", icon: BookOpen },
  { type: "videos", label: "Videos", detail: "YouTube, Vimeo or MP4", icon: Video },
  { type: "ad", label: "Advertisement", detail: "Adsterra, iframe or banner", icon: Megaphone },
  { type: "text", label: "Text", detail: "A flexible text section", icon: GalleryHorizontal },
] as const;

function newBlock(type: (typeof blockChoices)[number]["type"]): ContentBlock {
  const id = uid();
  if (type === "links") return { id, type, title: "Featured links", items: [] };
  if (type === "gallery") return { id, type, title: "Gallery", layout: "grid", items: [] };
  if (type === "posts") return { id, type, title: "Latest notes", items: [] };
  if (type === "blogs") return { id, type, title: "Stories", items: [] };
  if (type === "videos") return { id, type, title: "Watch", items: [] };
  if (type === "ad") return { id, type, title: "Advertisement", format: "html", code: "", enabled: true };
  return { id, type: "text", title: "About", content: "" };
}

export function ContentBuilder({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const update = (id: string, next: ContentBlock) =>
    onChange(blocks.map((block) => (block.id === id ? next : block)));
  const remove = (id: string) => onChange(blocks.filter((block) => block.id !== id));
  const move = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (destination < 0 || destination >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[destination]] = [next[destination], next[index]];
    onChange(next);
  };

  return (
    <div className="builder-layout">
      <aside className="section-palette">
        <div className="palette-heading">
          <Plus size={18} />
          <div><strong>Add a section</strong><span>Choose what appears next.</span></div>
        </div>
        <div className="palette-grid">
          {blockChoices.map(({ type, label, detail, icon: Icon }) => (
            <button key={type} type="button" onClick={() => onChange([...blocks, newBlock(type)])}>
              <Icon size={19} /><span><strong>{label}</strong><small>{detail}</small></span><Plus size={15} />
            </button>
          ))}
        </div>
      </aside>

      <div className="section-list">
        {blocks.length === 0 && (
          <div className="empty-builder"><GalleryHorizontal size={28} /><h3>Your page is ready for content</h3><p>Choose a section to start building.</p></div>
        )}
        {blocks.map((block, index) => (
          <section className="builder-section" key={block.id}>
            <header>
              <span className="section-number">{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{blockChoices.find((choice) => choice.type === block.type)?.label}</strong><small>Drag-free, accessible ordering</small></div>
              <div className="section-actions">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move section up"><ArrowUp size={17} /></button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === blocks.length - 1} aria-label="Move section down"><ArrowDown size={17} /></button>
                <button type="button" className="danger-icon" onClick={() => remove(block.id)} aria-label="Delete section"><Trash2 size={17} /></button>
              </div>
            </header>
            <BlockFields block={block} onChange={(next) => update(block.id, next)} />
          </section>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  wide = false,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
  hint?: string;
}) {
  return <label className={wide ? "builder-field wide" : "builder-field"}><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function Repeater({
  children,
  onAdd,
  addLabel,
}: {
  children: React.ReactNode;
  onAdd: () => void;
  addLabel: string;
}) {
  return <div className="repeater"><div className="repeater-items">{children}</div><button type="button" className="add-item-button" onClick={onAdd}><Plus size={16} />{addLabel}</button></div>;
}

function ItemShell({ title, onDelete, children }: { title: string; onDelete: () => void; children: React.ReactNode }) {
  return <div className="repeater-item"><header><strong>{title}</strong><button type="button" onClick={onDelete} aria-label={`Delete ${title}`}><Trash2 size={15} /></button></header><div className="builder-fields">{children}</div></div>;
}

function BlockFields({ block, onChange }: { block: ContentBlock; onChange: (block: ContentBlock) => void }) {
  if (block.type === "links") return <LinksFields block={block} onChange={onChange} />;
  if (block.type === "gallery") return <GalleryFields block={block} onChange={onChange} />;
  if (block.type === "posts") return <PostsFields block={block} onChange={onChange} />;
  if (block.type === "blogs") return <BlogsFields block={block} onChange={onChange} />;
  if (block.type === "videos") return <VideosFields block={block} onChange={onChange} />;
  if (block.type === "ad") return <AdFields block={block} onChange={onChange} />;
  return <TextFields block={block} onChange={onChange} />;
}

function LinksFields({ block, onChange }: { block: LinkBlock; onChange: (block: LinkBlock) => void }) {
  const items = block.items;
  return <><div className="builder-fields"><Field label="Section heading" wide><input value={block.title || ""} onChange={(e) => onChange({ ...block, title: e.target.value })} /></Field></div>
    <Repeater addLabel="Add link" onAdd={() => onChange({ ...block, items: [...items, { id: uid(), label: "", description: "", url: "", featured: false }] })}>
      {items.map((item, index) => <ItemShell key={item.id} title={`Link ${index + 1}`} onDelete={() => onChange({ ...block, items: items.filter((entry) => entry.id !== item.id) })}>
        <Field label="Button label"><input value={item.label} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, label: e.target.value } : entry) })} /></Field>
        <Field label="Destination URL"><input type="url" value={item.url} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, url: e.target.value } : entry) })} /></Field>
        <Field label="Description" wide><input value={item.description || ""} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, description: e.target.value } : entry) })} /></Field>
        <label className="check-field"><input type="checkbox" checked={item.featured || false} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, featured: e.target.checked } : entry) })} /> Feature this link</label>
      </ItemShell>)}
    </Repeater></>;
}

function GalleryFields({ block, onChange }: { block: GalleryBlock; onChange: (block: GalleryBlock) => void }) {
  const items = block.items;
  return <><div className="builder-fields"><Field label="Section heading"><input value={block.title || ""} onChange={(e) => onChange({ ...block, title: e.target.value })} /></Field><Field label="Gallery layout"><select value={block.layout || "grid"} onChange={(e) => onChange({ ...block, layout: e.target.value as GalleryBlock["layout"] })}><option value="grid">Balanced grid</option><option value="featured">Featured first image</option><option value="masonry">Masonry rhythm</option></select></Field></div>
    <Repeater addLabel="Add image" onAdd={() => onChange({ ...block, items: [...items, { id: uid(), src: "", alt: "", caption: "", url: "" }] })}>
      {items.map((item, index) => <ItemShell key={item.id} title={`Image ${index + 1}`} onDelete={() => onChange({ ...block, items: items.filter((entry) => entry.id !== item.id) })}>
        <Field label="Image URL" wide><input type="url" value={item.src} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, src: e.target.value } : entry) })} /></Field>
        <Field label="Alt text"><input value={item.alt} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, alt: e.target.value } : entry) })} /></Field>
        <Field label="Caption"><input value={item.caption || ""} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, caption: e.target.value } : entry) })} /></Field>
        <Field label="Click-through URL" wide hint="Optional: visitors are redirected when they click the image."><input type="url" value={item.url || ""} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, url: e.target.value } : entry) })} /></Field>
      </ItemShell>)}
    </Repeater></>;
}

function PostsFields({ block, onChange }: { block: PostsBlock; onChange: (block: PostsBlock) => void }) {
  const items = block.items;
  return <><div className="builder-fields"><Field label="Section heading" wide><input value={block.title || ""} onChange={(e) => onChange({ ...block, title: e.target.value })} /></Field></div>
    <Repeater addLabel="Add short post" onAdd={() => onChange({ ...block, items: [...items, { id: uid(), content: "", publishedAt: new Date().toISOString().slice(0, 10) }] })}>
      {items.map((item, index) => <ItemShell key={item.id} title={`Post ${index + 1}`} onDelete={() => onChange({ ...block, items: items.filter((entry) => entry.id !== item.id) })}>
        <Field label="Post text" wide><textarea rows={4} value={item.content} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, content: e.target.value } : entry) })} /></Field>
        <Field label="Publish date"><input type="date" value={item.publishedAt} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, publishedAt: e.target.value } : entry) })} /></Field>
        <Field label="Optional image URL"><input type="url" value={item.image || ""} onChange={(e) => onChange({ ...block, items: items.map((entry) => entry.id === item.id ? { ...entry, image: e.target.value } : entry) })} /></Field>
      </ItemShell>)}
    </Repeater></>;
}

function BlogsFields({ block, onChange }: { block: BlogBlock; onChange: (block: BlogBlock) => void }) {
  const items = block.items;
  const updateItem = (id: string, values: Partial<BlogBlock["items"][number]>) => onChange({ ...block, items: items.map((entry) => entry.id === id ? { ...entry, ...values } : entry) });
  return <><div className="builder-fields"><Field label="Section heading" wide><input value={block.title || ""} onChange={(e) => onChange({ ...block, title: e.target.value })} /></Field></div>
    <Repeater addLabel="Add blog post" onAdd={() => onChange({ ...block, items: [...items, { id: uid(), slug: "", title: "", excerpt: "", coverImage: "", publishedAt: new Date().toISOString().slice(0, 10), authorName: "", content: "" }] })}>
      {items.map((item, index) => <ItemShell key={item.id} title={`Article ${index + 1}`} onDelete={() => onChange({ ...block, items: items.filter((entry) => entry.id !== item.id) })}>
        <Field label="Title"><input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} /></Field>
        <Field label="URL slug"><input value={item.slug} onChange={(e) => updateItem(item.id, { slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} /></Field>
        <Field label="Excerpt" wide><textarea rows={3} value={item.excerpt} onChange={(e) => updateItem(item.id, { excerpt: e.target.value })} /></Field>
        <Field label="Cover image URL" wide><input type="url" value={item.coverImage} onChange={(e) => updateItem(item.id, { coverImage: e.target.value })} /></Field>
        <Field label="Author"><input value={item.authorName} onChange={(e) => updateItem(item.id, { authorName: e.target.value })} /></Field>
        <Field label="Publish date"><input type="date" value={item.publishedAt} onChange={(e) => updateItem(item.id, { publishedAt: e.target.value })} /></Field>
        <Field label="Full article" wide><textarea className="article-editor" rows={12} value={item.content} onChange={(e) => updateItem(item.id, { content: e.target.value })} /></Field>
      </ItemShell>)}
    </Repeater></>;
}

function VideosFields({ block, onChange }: { block: VideoBlock; onChange: (block: VideoBlock) => void }) {
  const items = block.items;
  const updateItem = (id: string, values: Partial<VideoBlock["items"][number]>) => onChange({ ...block, items: items.map((entry) => entry.id === id ? { ...entry, ...values } : entry) });
  return <><div className="builder-fields"><Field label="Section heading" wide><input value={block.title || ""} onChange={(e) => onChange({ ...block, title: e.target.value })} /></Field></div>
    <Repeater addLabel="Add video" onAdd={() => onChange({ ...block, items: [...items, { id: uid(), provider: "youtube", source: "", title: "", description: "", redirectDelaySeconds: 12 }] })}>
      {items.map((item, index) => <ItemShell key={item.id} title={`Video ${index + 1}`} onDelete={() => onChange({ ...block, items: items.filter((entry) => entry.id !== item.id) })}>
        <Field label="Title"><input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} /></Field>
        <Field label="Provider"><select value={item.provider} onChange={(e) => updateItem(item.id, { provider: e.target.value as VideoBlock["items"][number]["provider"] })}><option value="youtube">YouTube</option><option value="vimeo">Vimeo</option><option value="mp4">Direct MP4</option><option value="embed">Embed URL</option></select></Field>
        <Field label="Video URL" wide><input type="url" value={item.source} onChange={(e) => updateItem(item.id, { source: e.target.value })} /></Field>
        <Field label="Description" wide><textarea rows={3} value={item.description || ""} onChange={(e) => updateItem(item.id, { description: e.target.value })} /></Field>
        <Field label="Thumbnail URL"><input type="url" value={item.thumbnail || ""} onChange={(e) => updateItem(item.id, { thumbnail: e.target.value })} /></Field>
        <Field label="First-click external URL"><input type="url" value={item.externalUrl || ""} onChange={(e) => updateItem(item.id, { externalUrl: e.target.value })} /></Field>
        <Field label="Unlock delay (seconds)" hint="Recommended: 10–15 seconds."><input type="number" min={0} max={60} value={item.redirectDelaySeconds || 12} onChange={(e) => updateItem(item.id, { redirectDelaySeconds: Number(e.target.value) })} /></Field>
        <Field label="CTA URL"><input type="url" value={item.ctaUrl || ""} onChange={(e) => updateItem(item.id, { ctaUrl: e.target.value })} /></Field>
      </ItemShell>)}
    </Repeater></>;
}

function AdFields({ block, onChange }: { block: AdBlock; onChange: (block: AdBlock) => void }) {
  return <div className="builder-fields">
    <Field label="Internal label"><input value={block.title || ""} onChange={(e) => onChange({ ...block, title: e.target.value })} /></Field>
    <Field label="Ad format"><select value={block.format} onChange={(e) => onChange({ ...block, format: e.target.value as AdBlock["format"] })}><option value="html">HTML / Adsterra code</option><option value="script">Script ad</option><option value="iframe">Iframe embed</option><option value="image">Banner image</option></select></Field>
    {block.format === "image" ? <><Field label="Banner image URL" wide><input type="url" value={block.imageUrl || ""} onChange={(e) => onChange({ ...block, imageUrl: e.target.value })} /></Field><Field label="Destination URL" wide><input type="url" value={block.destinationUrl || ""} onChange={(e) => onChange({ ...block, destinationUrl: e.target.value })} /></Field></> :
      <Field label="Trusted ad code" wide hint="Paste code supplied by Adsterra or another trusted network."><textarea className="code-field" rows={9} value={block.code || ""} onChange={(e) => onChange({ ...block, code: e.target.value })} /></Field>}
    <label className="check-field"><input type="checkbox" checked={block.enabled} onChange={(e) => onChange({ ...block, enabled: e.target.checked })} /> Enable this advertisement</label>
  </div>;
}

function TextFields({ block, onChange }: { block: TextBlock; onChange: (block: TextBlock) => void }) {
  return <div className="builder-fields"><Field label="Section heading" wide><input value={block.title || ""} onChange={(e) => onChange({ ...block, title: e.target.value })} /></Field><Field label="Text content" wide><textarea rows={8} value={block.content} onChange={(e) => onChange({ ...block, content: e.target.value })} /></Field></div>;
}
