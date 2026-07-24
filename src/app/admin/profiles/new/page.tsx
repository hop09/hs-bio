import { requireAdmin } from "@/lib/auth";
import { ProfileEditor } from "@/components/profile-editor";
export default async function NewProfile(){await requireAdmin();return <main className="editor-page"><ProfileEditor/></main>}
