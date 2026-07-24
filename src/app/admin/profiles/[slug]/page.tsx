import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProfileBySlug } from "@/lib/profiles";
import { ProfileEditor } from "@/components/profile-editor";
export default async function EditProfile({params}:{params:Promise<{slug:string}>}){await requireAdmin();const profile=await getProfileBySlug((await params).slug);if(!profile)notFound();return <main className="editor-page"><ProfileEditor initial={profile}/></main>}
