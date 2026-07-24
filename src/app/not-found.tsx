import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="not-found"><div><span>404</span><h1>This page stepped out.</h1><p>The bio you are looking for does not exist or is not published yet.</p><Link href="/"><ArrowLeft size={17} /> Return home</Link></div></main>;
}
