import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
      <span className="font-jp text-7xl text-accent">迷</span>
      <h1 className="mt-6 font-serif text-fluid-h2 text-ink">Lost in the garden</h1>
      <p className="mt-4 max-w-sm text-muted">
        This path leads nowhere on the menu. Let us guide you back to {site.name}.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-9 py-4 text-[0.72rem] uppercase tracking-wider2 text-bg transition-all duration-500 hover:brightness-110"
      >
        Return home
      </Link>
    </section>
  );
}
