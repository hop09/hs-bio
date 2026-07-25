"use client";

import { useActionState, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  ExternalLink,
  Globe2,
  ImageIcon,
  LayoutDashboard,
  Link2,
  Plus,
  Save,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { saveProfileAction } from "@/app/admin/actions";
import { ContentBuilder } from "@/components/content-builder";
import { MediaUploadField } from "@/components/media-upload-field";
import {
  themeIds,
  type BioProfile,
  type SocialLink,
  type SocialPlatform,
} from "@/lib/types";

const blank: BioProfile = {
  slug: "",
  name: "",
  username: "@",
  bio: "",
  profileImage:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=90",
  coverImage:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=90",
  verified: false,
  theme: "minimal",
  published: false,
  socialLinks: [],
  blocks: [],
  seo: {},
};

const tabs = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "social", label: "Social links", icon: Link2 },
  { id: "content", label: "Page sections", icon: LayoutDashboard },
  { id: "seo", label: "SEO & sharing", icon: Search },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ProfileEditor({ initial }: { initial?: BioProfile }) {
  const [profile, setProfile] = useState(initial ?? blank);
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [state, action, pending] = useActionState(saveProfileAction, {});
  const themeOptions = useMemo(
    () =>
      themeIds.map((id) => (
        <option key={id} value={id}>
          {id[0].toUpperCase() + id.slice(1)}
        </option>
      )),
    [],
  );

  return (
    <form action={action} className="editor-form visual-editor">
      <input type="hidden" name="profileJson" value={JSON.stringify(profile)} />
      <div className="editor-toolbar">
        <div>
          <Link href="/admin" className="back-link"><ArrowLeft size={16} /> All profiles</Link>
          <h1>{initial ? `Edit ${initial.name}` : "Create a bio page"}</h1>
          <p>{initial ? `/${initial.slug}` : "Build a complete page without touching code."}</p>
        </div>
        <div className="editor-publish-actions">
          {initial?.published && <Link href={`/${initial.slug}`} target="_blank" className="ghost-button"><Eye size={17} /> Preview live</Link>}
          <button className="save-button" disabled={pending}><Save size={17} />{pending ? "Saving…" : "Save profile"}</button>
        </div>
      </div>

      {state.error && <p className="form-error editor-error" role="alert">{state.error}</p>}

      <div className="editor-tabs" role="tablist" aria-label="Profile editor">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)} role="tab" aria-selected={activeTab === id}>
            <Icon size={18} /><span>{label}</span>
            {id === "social" && profile.socialLinks.length > 0 && <small>{profile.socialLinks.length}</small>}
            {id === "content" && profile.blocks.length > 0 && <small>{profile.blocks.length}</small>}
          </button>
        ))}
      </div>

      <div className="editor-workspace">
        {activeTab === "profile" && (
          <ProfileTab profile={profile} onChange={setProfile} themeOptions={themeOptions} />
        )}
        {activeTab === "social" && (
          <SocialTab links={profile.socialLinks} onChange={(socialLinks) => setProfile({ ...profile, socialLinks })} />
        )}
        {activeTab === "content" && (
          <ContentBuilder blocks={profile.blocks} onChange={(blocks) => setProfile({ ...profile, blocks })} />
        )}
        {activeTab === "seo" && (
          <SeoTab profile={profile} onChange={setProfile} />
        )}
      </div>

      <div className="sticky-save-bar">
        <div><CheckCircle2 size={17} /><span>Changes stay local until you save.</span></div>
        <button className="save-button" disabled={pending}><Save size={17} />{pending ? "Saving…" : "Save profile"}</button>
      </div>
    </form>
  );
}

function ProfileTab({
  profile,
  onChange,
  themeOptions,
}: {
  profile: BioProfile;
  onChange: (profile: BioProfile) => void;
  themeOptions: React.ReactNode;
}) {
  return (
    <div className="visual-fields-grid">
      <section className="settings-card">
        <header><UserRound size={19} /><div><h2>Identity</h2><p>The essentials visitors see first.</p></div></header>
        <div className="settings-fields">
          <label>Display name<input value={profile.name} onChange={(e) => onChange({ ...profile, name: e.target.value })} required placeholder="Jane Doe" /></label>
          <label>Username<input value={profile.username} onChange={(e) => onChange({ ...profile, username: e.target.value })} required placeholder="@janedoe" /></label>
          <label>Page slug<div className="slug-field"><span>/</span><input value={profile.slug} onChange={(e) => onChange({ ...profile, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} required placeholder="jane-doe" /></div></label>
          <label>Short bio<textarea value={profile.bio} onChange={(e) => onChange({ ...profile, bio: e.target.value })} rows={5} required placeholder="A concise introduction…" /></label>
        </div>
      </section>

      <section className="settings-card">
        <header><ImageIcon size={19} /><div><h2>Profile media</h2><p>Use high-quality public image URLs.</p></div></header>
        <div className="media-preview cover-preview" style={{ backgroundImage: `url("${profile.coverImage}")` }}>
          <div className="avatar-preview" style={{ backgroundImage: `url("${profile.profileImage}")` }} />
        </div>
        <div className="settings-fields">
          <label>Profile image<MediaUploadField kind="image" aspect={1} value={profile.profileImage} onChange={(profileImage) => onChange({ ...profile, profileImage })} /></label>
          <label>Cover image<MediaUploadField kind="image" aspect={3} value={profile.coverImage} onChange={(coverImage) => onChange({ ...profile, coverImage })} /></label>
        </div>
      </section>

      <section className="settings-card">
        <header><LayoutDashboard size={19} /><div><h2>Design & status</h2><p>Choose the permanent public presentation.</p></div></header>
        <div className="settings-fields">
          <label>Default theme<select value={profile.theme} onChange={(e) => onChange({ ...profile, theme: e.target.value as BioProfile["theme"] })}>{themeOptions}</select></label>
          <div className="switch-list">
            <label><span><strong>Verified profile</strong><small>Display the blue verification badge.</small></span><input type="checkbox" checked={profile.verified} onChange={(e) => onChange({ ...profile, verified: e.target.checked })} /></label>
            <label><span><strong>Publish page</strong><small>Make this slug publicly accessible.</small></span><input type="checkbox" checked={profile.published} onChange={(e) => onChange({ ...profile, published: e.target.checked })} /></label>
          </div>
        </div>
      </section>

      <section className="settings-card theme-summary">
        <header><Globe2 size={19} /><div><h2>Public address</h2><p>Your profile will be available here.</p></div></header>
        <div className="public-url"><span>Public profile</span><strong>/{profile.slug || "your-slug"}</strong></div>
        <p className="theme-note">Selected design: <strong>{profile.theme}</strong>. Visitors see this theme by default.</p>
      </section>
    </div>
  );
}

function SocialTab({ links, onChange }: { links: SocialLink[]; onChange: (links: SocialLink[]) => void }) {
  const add = () => onChange([...links, { id: crypto.randomUUID(), platform: "website", label: "", url: "" }]);
  const update = (id: string, values: Partial<SocialLink>) => onChange(links.map((link) => link.id === id ? { ...link, ...values } : link));
  return (
    <section className="settings-card social-settings">
      <header><Link2 size={19} /><div><h2>Social profiles</h2><p>Add icon links shown below the profile bio.</p></div><button type="button" className="add-item-button compact" onClick={add}><Plus size={16} /> Add social link</button></header>
      {links.length === 0 && <div className="empty-inline"><Link2 /><p>No social profiles yet.</p><button type="button" onClick={add}>Add your first profile</button></div>}
      <div className="social-editor-list">
        {links.map((link, index) => (
          <div className="social-editor-row" key={link.id}>
            <span className="row-index">{index + 1}</span>
            <label>Platform<select value={link.platform} onChange={(e) => update(link.id, { platform: e.target.value as SocialPlatform })}><option value="website">Website</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option><option value="github">GitHub</option><option value="twitter">X / Twitter</option><option value="facebook">Facebook</option><option value="mail">Email</option></select></label>
            <label>Accessible label<input value={link.label} onChange={(e) => update(link.id, { label: e.target.value })} placeholder="My Instagram" /></label>
            <label>URL<input type={link.platform === "mail" ? "text" : "url"} value={link.url} onChange={(e) => update(link.id, { url: e.target.value })} placeholder={link.platform === "mail" ? "mailto:hello@example.com" : "https://…"} /></label>
            <button type="button" className="danger-icon" onClick={() => onChange(links.filter((entry) => entry.id !== link.id))} aria-label="Delete social link"><Trash2 size={17} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}

function SeoTab({ profile, onChange }: { profile: BioProfile; onChange: (profile: BioProfile) => void }) {
  const seo = profile.seo || {};
  const update = (values: NonNullable<BioProfile["seo"]>) => onChange({ ...profile, seo: { ...seo, ...values } });
  return (
    <div className="visual-fields-grid seo-grid">
      <section className="settings-card">
        <header><Search size={19} /><div><h2>Search appearance</h2><p>Customize page titles and descriptions.</p></div></header>
        <div className="settings-fields">
          <label>SEO title<input value={seo.title || ""} onChange={(e) => update({ title: e.target.value })} placeholder={`${profile.name || "Profile name"} — Official bio`} /></label>
          <label>Meta description<textarea rows={5} value={seo.description || ""} onChange={(e) => update({ description: e.target.value })} placeholder={profile.bio || "Describe this profile…"} /></label>
          <label>Social sharing image<MediaUploadField kind="image" aspect={1200 / 630} value={seo.ogImage || ""} onChange={(ogImage) => update({ ogImage })} placeholder={profile.coverImage} /></label>
        </div>
      </section>
      <section className="settings-card search-preview-card">
        <header><ExternalLink size={19} /><div><h2>Preview</h2><p>An approximate search result preview.</p></div></header>
        <div className="search-preview"><span>HS Bio › {profile.slug || "profile"}</span><h3>{seo.title || `${profile.name || "Profile name"} — Official bio`}</h3><p>{seo.description || profile.bio || "Your profile description will appear here."}</p></div>
      </section>
    </div>
  );
}
