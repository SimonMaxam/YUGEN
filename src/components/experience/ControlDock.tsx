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
        <SoundBars active={audio.enabled} />
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

function SoundBars({ active }: { active: boolean }) {
  return (
    <div className="flex h-4 items-end gap-[3px]">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-current transition-all duration-300"
          style={{
            height: active ? undefined : "3px",
            animation: active
              ? `soundbar 900ms ease-in-out ${i * 120}ms infinite`
              : "none",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes soundbar {
          0%,
          100% {
            height: 4px;
          }
          50% {
            height: 15px;
          }
        }
      `}</style>
    </div>
  );
}
