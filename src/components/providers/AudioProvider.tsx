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

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = new Audio(TRACK);
    el.loop = true;
    el.preload = "none";
    el.volume = 0;
    audioRef.current = el;
    return () => {
      el.pause();
      audioRef.current = null;
    };
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

  const enable = useCallback(() => {
    const el = audioRef.current;
    if (!el || enabled) return;
    el.play()
      .then(() => {
        setEnabled(true);
        fadeTo(TARGET_VOLUME);
      })
      .catch(() => {
        // Autoplay blocked — will succeed on the next user gesture.
        setEnabled(false);
      });
  }, [enabled, fadeTo]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (enabled) {
      fadeTo(0, () => el.pause());
      setEnabled(false);
    } else {
      el.play()
        .then(() => {
          setEnabled(true);
          fadeTo(TARGET_VOLUME);
        })
        .catch(() => setEnabled(false));
    }
  }, [enabled, fadeTo]);

  // Gently duck the audio when the tab is hidden.
  useEffect(() => {
    function onVisibility() {
      const el = audioRef.current;
      if (!el || !enabled) return;
      if (document.hidden) fadeTo(0.08);
      else fadeTo(TARGET_VOLUME);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled, fadeTo]);

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
