import Link from "next/link";
import { ArrowUpRight, LogOut, Plus, Settings2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listProfiles } from "@/lib/profiles";
import { deleteProfileAction, logoutAction } from "@/app/admin/actions";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { BrandLogo } from "@/components/brand-logo";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  await requireAdmin(); const profiles = await listProfiles();
  return <main className="admin-page"><aside className="admin-sidebar"><Link href="/" aria-label="HS Bio home"><BrandLogo /></Link><nav><Link href="/admin" className="active"><Settings2 size={18}/>Profiles</Link></nav><div><ThemeSwitcher compact/><form action={logoutAction}><button><LogOut size={17}/>Sign out</button></form></div></aside>
    <section className="admin-main"><header><div><p>Workspace</p><h1>Bio pages</h1></div><Link href="/admin/profiles/new" className="save-button"><Plus size={17}/>New profile</Link></header>
    <div className="admin-stats"><span><strong>{profiles.length}</strong>Total profiles</span><span><strong>{profiles.filter(p=>p.published).length}</strong>Published</span><span><strong>{profiles.reduce((n,p)=>n+p.blocks.length,0)}</strong>Content sections</span></div>
    <div className="profile-table">{profiles.map(profile=><article key={profile._id}><div className="table-avatar" style={{backgroundImage:`url(${profile.profileImage})`}}/><div><h2>{profile.name}{profile.verified&&<span>Verified</span>}</h2><p>/{profile.slug} · {profile.theme}</p></div><span className={profile.published?"status live":"status"}>{profile.published?"Live":"Draft"}</span><div className="row-actions"><Link href={`/${profile.slug}`} target="_blank" aria-label={`View ${profile.name}`}><ArrowUpRight size={18}/></Link><Link href={`/admin/profiles/${profile.slug}`}>Edit</Link><form action={deleteProfileAction}><input type="hidden" name="id" value={profile._id}/><button type="submit">Delete</button></form></div></article>)}</div>
    </section></main>;
}
