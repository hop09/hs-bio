import { PreviewReceiver } from "@/components/preview-receiver";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPreviewPage() {
  await requireAdmin();
  return <PreviewReceiver />;
}
