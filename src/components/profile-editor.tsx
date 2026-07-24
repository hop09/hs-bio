"use client";
import { useActionState, useMemo, useState } from "react";
import { Code2, Save, WandSparkles } from "lucide-react";
import { saveProfileAction } from "@/app/admin/actions";
import { themeIds, type BioProfile } from "@/lib/types";

const blank: BioProfile = {
  slug: "", name: "", username: "@", bio: "", profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=90",
  coverImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=90",
  verified: false, theme: "minimal", published: false, socialLinks: [], blocks: [],
};

export function ProfileEditor({ initial }: { initial?: BioProfile }) {
  const [profile, setProfile] = useState(initial ?? blank);
  const [advanced, setAdvanced] = useState(false);
  const [json, setJson] = useState(() => JSON.stringify(initial ?? blank, null, 2));
  const [state, action, pending] = useActionState(saveProfileAction, {});
  const sync = (next: BioProfile) => { setProfile(next); setJson(JSON.stringify(next, null, 2)); };
  const themeOptions = useMemo(() => themeIds.map((id) => <option key={id} value={id}>{id[0].toUpperCase()+id.slice(1)}</option>), []);
  return <form action={action} className="editor-form">
    <div className="editor-toolbar"><div><p>Profile studio</p><h1>{initial ? `Edit ${initial.name}` : "Create a bio page"}</h1></div><div><button type="button" className="ghost-button" onClick={() => setAdvanced(!advanced)}><Code2 size={17} />{advanced ? "Visual fields" : "Advanced content"}</button><button className="save-button" disabled={pending}><Save size={17} />{pending ? "Saving…" : "Save profile"}</button></div></div>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    {advanced ? <div className="json-panel"><div><WandSparkles /><h2>Advanced content editor</h2><p>Edit social profiles, links, galleries, posts, blogs, videos, ads, and section order using the typed profile document.</p></div><textarea name="profileJson" value={json} onChange={(event) => { setJson(event.target.value); try { setProfile(JSON.parse(event.target.value)); } catch {} }} spellCheck={false} /></div> :
    <div className="field-grid">
      <input type="hidden" name="profileJson" value={JSON.stringify(profile)} />
      <section className="field-card"><h2>Identity</h2><label>Display name<input value={profile.name} onChange={e=>sync({...profile,name:e.target.value})} required /></label><label>Username<input value={profile.username} onChange={e=>sync({...profile,username:e.target.value})} required /></label><label>Slug<input value={profile.slug} onChange={e=>sync({...profile,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"")})} required placeholder="jane-doe" /></label><label>Short bio<textarea value={profile.bio} onChange={e=>sync({...profile,bio:e.target.value})} rows={4} required /></label></section>
      <section className="field-card"><h2>Visuals</h2><label>Profile image URL<input type="url" value={profile.profileImage} onChange={e=>sync({...profile,profileImage:e.target.value})} /></label><label>Cover image URL<input type="url" value={profile.coverImage} onChange={e=>sync({...profile,coverImage:e.target.value})} /></label><label>Default design<select value={profile.theme} onChange={e=>sync({...profile,theme:e.target.value as BioProfile["theme"]})}>{themeOptions}</select></label><div className="toggle-row"><label><input type="checkbox" checked={profile.verified} onChange={e=>sync({...profile,verified:e.target.checked})} /> Verified badge</label><label><input type="checkbox" checked={profile.published} onChange={e=>sync({...profile,published:e.target.checked})} /> Published</label></div></section>
      <section className="field-card field-wide"><h2>Content summary</h2><div className="content-stats"><span><strong>{profile.socialLinks.length}</strong>Social profiles</span><span><strong>{profile.blocks.length}</strong>Sections</span><span><strong>{profile.blocks.filter(b=>b.type==="blogs").reduce((n,b)=>n+(b.type==="blogs"?b.items.length:0),0)}</strong>Stories</span></div><button type="button" className="advanced-cta" onClick={()=>setAdvanced(true)}><Code2 /> Manage all content and ordering <ArrowHint /></button></section>
    </div>}
  </form>;
}
function ArrowHint(){return <span aria-hidden>→</span>}
