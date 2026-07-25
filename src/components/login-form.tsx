"use client";
import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, action, pending] = useActionState(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);
  return <form action={action} className="login-form">
    <div className="login-icon"><LockKeyhole /></div><h1>Welcome back</h1><p>Sign in to manage your bio pages.</p>
    <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" defaultValue={defaultEmail} /></label>
    <label>Password<div className="password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="••••••••••••" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <button disabled={pending}>{pending ? "Signing in…" : "Sign in"}<ArrowRight size={18} /></button>
  </form>;
}
