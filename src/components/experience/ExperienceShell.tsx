"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { isTouchDevice } from "@/lib/device";
import { Cursor } from "./Cursor";
import { ControlDock } from "./ControlDock";
import { Loader } from "./Loader";

// Ambient particles are nice but expensive — load after the shell is ready.
const AmbientCanvas = dynamic(() => import("./AmbientCanvas").then((m) => m.AmbientCanvas), {
  ssr: false,
  loading: () => null,
});

/**
 * Mounts client-only ambience layers and gates the opening overture so it
 * plays once per browsing session.
 */
export function ExperienceShell() {
  const [showLoader, setShowLoader] = useState(false);
  const [checked, setChecked] = useState(false);
  const [ambience, setAmbience] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("yugen-entered");
    if (!seen) {
      setShowLoader(true);
      document.body.style.overflow = "hidden";
    }
    setChecked(true);

    if (isTouchDevice()) return;

    const t = window.setTimeout(() => setAmbience(true), seen ? 400 : 2600);
    return () => clearTimeout(t);
  }, []);

  function handleDone() {
    sessionStorage.setItem("yugen-entered", "1");
    document.body.style.overflow = "";
    setShowLoader(false);
    if (!isTouchDevice()) setAmbience(true);
  }

  return (
    <>
      <div className="grain pointer-events-none" aria-hidden />
      {ambience && <AmbientCanvas />}
      <Cursor />
      <ControlDock />
      {checked && showLoader && <Loader onDone={handleDone} />}
    </>
  );
}
