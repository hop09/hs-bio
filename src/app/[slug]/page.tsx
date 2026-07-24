import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BioPage } from "@/components/bio-page";
import { getPublishedProfile } from "@/lib/profiles";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublishedProfile(slug);
  if (!profile) return { title: "Profile not found" };
  const title = profile.seo?.title || `${profile.name} (${profile.username})`;
  const description = profile.seo?.description || profile.bio;
  const image = profile.seo?.ogImage || profile.coverImage;
  return { title, description, openGraph: { title, description, type: "profile", images: [{ url: image }] }, twitter: { card: "summary_large_image", title, description, images: [image] } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const profile = await getPublishedProfile((await params).slug);
  if (!profile) notFound();
  return <BioPage profile={profile} />;
}
