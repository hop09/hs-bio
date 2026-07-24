import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublishedProfile } from "@/lib/profiles";
import { formatDate } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const dynamic = "force-dynamic";

async function findPost(slug: string, postSlug: string) {
  const profile = await getPublishedProfile(slug);
  const block = profile?.blocks.find((item) => item.type === "blogs");
  const post = block?.type === "blogs" ? block.items.find((item) => item.slug === postSlug) : undefined;
  return { profile, post };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; postSlug: string }> }): Promise<Metadata> {
  const value = await params; const { post } = await findPost(value.slug, value.postSlug);
  if (!post) return { title: "Story not found" };
  return { title: post.title, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, type: "article", images: [{ url: post.coverImage }] } };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string; postSlug: string }> }) {
  const value = await params; const { profile, post } = await findPost(value.slug, value.postSlug);
  if (!profile || !post) notFound();
  return <main className={`article-page theme-${profile.theme}`}><article className="article-shell">
    <nav className="article-nav"><Link href={`/${profile.slug}`}><ArrowLeft size={18} /> Back to {profile.name}</Link><ThemeSwitcher compact /></nav>
    <header><p className="article-kicker"><CalendarDays size={15} /> {formatDate(post.publishedAt)} · {post.authorName}</p><h1>{post.title}</h1><p>{post.excerpt}</p></header>
    <div className="article-cover"><Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 1000px) 100vw, 960px" /></div>
    <div className="article-content">{post.content.split("\n\n").map((paragraph) => <p key={paragraph.slice(0, 30)}>{paragraph}</p>)}</div>
  </article></main>;
}
