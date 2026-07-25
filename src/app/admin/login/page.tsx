import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { BrandLogo } from "@/components/brand-logo";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return <main className="login-page"><nav><Link href="/" aria-label="HS Bio home"><BrandLogo /></Link><ThemeSwitcher compact /></nav><div className="login-panel"><LoginForm defaultEmail={process.env.ADMIN_EMAIL} /><aside><p>“A profile should feel like a room someone chose to make their own.”</p><span>HS Bio Studio</span></aside></div></main>;
}
