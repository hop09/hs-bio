"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticate, logout, requireAdmin } from "@/lib/auth";
import { deleteProfile, saveProfile } from "@/lib/profiles";
import { themeIds, type BioProfile } from "@/lib/types";

export type ActionState = { error?: string };

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const result = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: "Enter a valid email and password." };
  try {
    if (!(await authenticate(result.data.email, result.data.password))) return { error: "The email or password is incorrect. Passwords are case-sensitive." };
  } catch { return { error: "Authentication is not configured yet." }; }
  redirect("/admin");
}

export async function logoutAction() { await logout(); redirect("/admin/login"); }

export async function saveProfileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const profile = JSON.parse(String(formData.get("profileJson") ?? "")) as BioProfile;
    if (!profile.slug?.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) return { error: "Use a lowercase slug with letters, numbers, or hyphens." };
    if (!profile.name || !profile.username || !profile.bio) return { error: "Name, username, and bio are required." };
    if (!themeIds.includes(profile.theme)) return { error: "Choose a valid theme." };
    await saveProfile(profile);
    revalidatePath("/"); revalidatePath(`/${profile.slug}`);
  } catch (error) {
    return { error: error instanceof SyntaxError ? "The profile JSON is invalid." : "Could not save. The slug may already exist." };
  }
  redirect("/admin");
}

export async function deleteProfileAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteProfile(id);
  revalidatePath("/"); redirect("/admin");
}
