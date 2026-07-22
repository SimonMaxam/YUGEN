import { dietaryMeta, type MenuItem } from "@/lib/menu";
import { cn } from "@/lib/utils";

export function SpiceLevel({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={`Spice level ${level} of 3`}>
      <span className="sr-only">Spice level {level} of 3</span>
      {[1, 2, 3].map((i) => (
        <svg
          key={i}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          aria-hidden
          className={cn(i <= level ? "text-accent" : "text-line")}
        >
          <path
            d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 3-4 5-10z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}

export function PopularBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/12 px-2.5 py-1 text-[0.58rem] uppercase tracking-wider2 text-accent">
      <span className="h-1 w-1 rounded-full bg-accent" />
      Guest favourite
    </span>
  );
}

export function ChefBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 px-2.5 py-1 text-[0.58rem] uppercase tracking-wider2 text-gold">
      ✦ Chef's choice
    </span>
  );
}

export function DietaryTags({ tags }: { tags: MenuItem["dietary"] }) {
  if (!tags?.length) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          title={dietaryMeta[t].label}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-line px-1.5 text-[0.56rem] font-medium uppercase tracking-wide text-muted"
        >
          {dietaryMeta[t].symbol}
          <span className="sr-only">{dietaryMeta[t].label}</span>
        </span>
      ))}
    </span>
  );
}
