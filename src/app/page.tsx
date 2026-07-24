import Link from "next/link";
import { ArrowRight, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return <main className="home-page">
    <nav className="home-nav"><Link href="/" className="brand-mark"><span>HS</span> Bio</Link><div><ThemeSwitcher compact /><Link href="/admin" className="nav-login">Admin</Link></div></nav>
    <section className="home-hero">
      <p className="eyebrow"><Sparkles size={15} /> A home for everything you make</p>
      <h1>One link.<br/><em>Entirely yours.</em></h1>
      <p className="hero-copy">Distinctive bio pages for people who care about how their work is presented. Fast, focused, and made to feel personal.</p>
      <div className="hero-actions"><Link href="/hamza" className="primary-cta">View Hamza <ArrowRight size={18} /></Link><Link href="/sheza" className="secondary-cta">View Sheza</Link></div>
      <div className="profile-peek peek-one"><span>EDITORIAL</span><strong>Hamza</strong><small>Designer & builder</small></div>
      <div className="profile-peek peek-two"><span>GRADIENT</span><strong>Sheza</strong><small>Creative director</small></div>
    </section>
    <section className="home-features">
      <article><Layers3 /><h2>Ten real personalities</h2><p>Layouts with genuinely different structure, typography, geometry, and atmosphere.</p></article>
      <article><ShieldCheck /><h2>Made for production</h2><p>Secure admin access, MongoDB persistence, dynamic SEO, and responsive media.</p></article>
      <article><Sparkles /><h2>Every kind of story</h2><p>Links, galleries, notes, blogs, video, and flexible advertising in one coherent page.</p></article>
    </section>
  </main>;
}
