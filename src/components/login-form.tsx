"use client";
import { useActionState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return <form action={action} className="login-form">
    <div className="login-icon"><LockKeyhole /></div><h1>Welcome back</h1><p>Sign in to manage your bio pages.</p>
    <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required placeholder="••••••••••••" /></label>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <button disabled={pending}>{pending ? "Signing in…" : "Sign in"}<ArrowRight size={18} /></button>
  </form>;
}
