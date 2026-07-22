"use client";

import { useAudio } from "@/components/providers/AudioProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { timeOfDayLabel } from "@/lib/time-of-day";

/** Fixed dock: ambient-sound toggle + time-of-day switch. */
export function ControlDock() {
  const audio = useAudio();
  const { theme, auto, cycle } = useTheme();

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 md:bottom-7 md:right-7">
      <button
        onClick={cycle}
        aria-label={`Ambience: ${auto ? "Automatic" : timeOfDayLabel[theme]}. Click to change.`}
        className="glass group flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.62rem] uppercase tracking-wider2 text-ink transition-all duration-500 hover:text-accent"
      >
        <ThemeGlyph theme={theme} />
        <span className="hidden sm:inline">
          {auto ? "Auto" : timeOfDayLabel[theme]}
        </span>
      </button>

      <button
        onClick={audio.toggle}
        aria-pressed={audio.enabled}
        aria-label={audio.enabled ? "Mute ambient sound" : "Play ambient sound"}
        className="glass flex h-11 w-11 items-center justify-center rounded-full text-ink transition-all duration-500 hover:text-accent"
      >
        <MusicNote active={audio.enabled} />
      </button>
    </div>
  );
}

function ThemeGlyph({ theme }: { theme: string }) {
  if (theme === "night") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.4" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={12 + Math.cos(a) * 7}
            y1={12 + Math.sin(a) * 7}
            x2={12 + Math.cos(a) * 9.4}
            y2={12 + Math.sin(a) * 9.4}
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/** A musical note — gently bobs when the ambient track is playing, and shows a
 *  slash when muted, so the on/off state reads at a glance. */
function MusicNote({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        style={{
          animation: active ? "note-bob 1.6s ease-in-out infinite" : "none",
        }}
      >
        <path
          d="M9 17V5.2l10-2.2v11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          cx="6.4"
          cy="17.2"
          rx="2.6"
          ry="2.2"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <ellipse
          cx="16.4"
          cy="14"
          rx="2.6"
          ry="2.2"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {!active && (
        <span className="absolute h-[1.5px] w-[22px] rotate-45 rounded-full bg-current" />
      )}
      <style jsx>{`
        @keyframes note-bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
}
