"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface AudioContextValue {
  enabled: boolean;
  toggle: () => void;
  enable: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

const TRACK = "/audio/ambient.mp3";
const TARGET_VOLUME = 0.32;
const FADE_MS = 1600;
const STORAGE_KEY = "yugen-sound";

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enabledRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  const setEnabledBoth = useCallback((v: boolean) => {
    enabledRef.current = v;
    setEnabled(v);
  }, []);

  const fadeTo = useCallback((target: number, onDone?: () => void) => {
    const el = audioRef.current;
    if (!el) return;
    if (fadeRef.current) clearInterval(fadeRef.current);
    const start = el.volume;
    const startTime = performance.now();
    fadeRef.current = setInterval(() => {
      const t = Math.min(1, (performance.now() - startTime) / FADE_MS);
      el.volume = start + (target - start) * t;
      if (t >= 1) {
        if (fadeRef.current) clearInterval(fadeRef.current);
        onDone?.();
      }
    }, 40);
  }, []);

  const persist = (value: "on" | "off") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage unavailable — ignore */
    }
  };

  const enable = useCallback(() => {
    const el = audioRef.current;
    if (!el || enabledRef.current) return;
    el.play()
      .then(() => {
        setEnabledBoth(true);
        persist("on");
        fadeTo(TARGET_VOLUME);
      })
      .catch(() => {
        // Autoplay still blocked — a later gesture will retry.
        setEnabledBoth(false);
      });
  }, [fadeTo, setEnabledBoth]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (enabledRef.current) {
      fadeTo(0, () => el.pause());
      setEnabledBoth(false);
      persist("off");
    } else {
      el.play()
        .then(() => {
          setEnabledBoth(true);
          persist("on");
          fadeTo(TARGET_VOLUME);
        })
        .catch(() => setEnabledBoth(false));
    }
  }, [fadeTo, setEnabledBoth]);

  // Create the element and, unless the visitor previously muted, arm the
  // soundtrack to begin on the very first interaction (autoplay-policy safe).
  useEffect(() => {
    const el = new Audio(TRACK);
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    audioRef.current = el;

    let pref: string | null = null;
    try {
      pref = localStorage.getItem(STORAGE_KEY);
    } catch {
      pref = null;
    }

    let cleanupGesture: (() => void) | undefined;
    if (pref !== "off") {
      // Try immediately (works if the tab already has engagement), otherwise
      // wait for the first gesture anywhere on the page.
      el.play()
        .then(() => {
          setEnabledBoth(true);
          fadeTo(TARGET_VOLUME);
        })
        .catch(() => {
          const start = () => {
            enable();
            cleanupGesture?.();
          };
          const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
          events.forEach((e) =>
            window.addEventListener(e, start, { once: true, passive: true }),
          );
          cleanupGesture = () =>
            events.forEach((e) => window.removeEventListener(e, start));
        });
    }

    return () => {
      cleanupGesture?.();
      el.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gently duck the audio when the tab is hidden.
  useEffect(() => {
    function onVisibility() {
      const el = audioRef.current;
      if (!el || !enabledRef.current) return;
      if (document.hidden) fadeTo(0.08);
      else fadeTo(TARGET_VOLUME);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [fadeTo]);

  const value = useMemo(
    () => ({ enabled, toggle, enable }),
    [enabled, toggle, enable],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
