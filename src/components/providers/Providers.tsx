"use client";

import { ThemeProvider } from "./ThemeProvider";
import { AudioProvider } from "./AudioProvider";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AudioProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </AudioProvider>
    </ThemeProvider>
  );
}
