"use client";

import { useEffect, useState } from "react";
import { Cursor } from "./Cursor";
import { AmbientCanvas } from "./AmbientCanvas";
import { ControlDock } from "./ControlDock";
import { Loader } from "./Loader";

/**
 * Mounts every client-only ambience layer and gates the opening overture so it
 * plays once per browsing session (subsequent navigations skip it).
 */
export function ExperienceShell() {
  const [showLoader, setShowLoader] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("yugen-entered");
    if (!seen) {
      setShowLoader(true);
      document.body.style.overflow = "hidden";
    }
    setChecked(true);
  }, []);

  function handleDone() {
    sessionStorage.setItem("yugen-entered", "1");
    document.body.style.overflow = "";
    setShowLoader(false);
  }

  return (
    <>
      <div className="grain" aria-hidden />
      <AmbientCanvas />
      <Cursor />
      <ControlDock />
      {checked && showLoader && <Loader onDone={handleDone} />}
    </>
  );
}
