"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!mounted) return <span className="size-10" aria-hidden />;
  const dark = resolvedTheme === "dark";
  return (
    <button type="button" className="mode-toggle" onClick={() => setTheme(dark ? "light" : "dark")} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      {!compact && <span>{dark ? "Light" : "Dark"}</span>}
    </button>
  );
}
