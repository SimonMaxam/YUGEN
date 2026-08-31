"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM, SOLIDS, HOTSPOTS } from "./config";

export interface JoystickState {
  x: number; // strafe  (-1 left … 1 right)
  y: number; // forward (-1 back … 1 forward)
}

const SPEED = 3.4;
const RUN = 5.6;
const MARGIN = 0.38;

/**
 * A lightweight, robust first-person controller.
 *
 * Movement (WASD / arrows / joystick) ALWAYS works — it never depends on
 * pointer lock. Looking works three ways so it can't feel broken:
 *   • desktop: pointer-lock mouse-look after a click (Esc exits), OR
 *   • desktop fallback: click-and-drag to look if lock is unavailable, OR
 *   • touch: drag anywhere on the canvas.
 * All motion is resolved against the room walls + furniture.
 */
export function WalkControls({
  enabled,
  isTouch,
  joystick,
  onNearest,
  onExit,
}: {
  enabled: boolean;
  isTouch: boolean;
  joystick: React.MutableRefObject<JoystickState>;
  onNearest: (index: number | null) => void;
  onExit: () => void;
}) {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(Math.PI);
  const pitch = useRef(-0.03);
  const bob = useRef(0);
  const lastNearest = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const dom = gl.domElement;

    // Face into the room from the entrance, at eye height.
    camera.position.set(0, ROOM.eye, ROOM.halfD - 1.2);
    yaw.current = Math.PI;
    pitch.current = -0.03;

    let dragging = false;
    let wasLocked = false;

    const kd = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === "Escape") onExit();
    };
    const ku = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    const applyLook = (dx: number, dy: number, sens: number) => {
      yaw.current -= dx * sens;
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * sens, -0.9, 0.9);
    };

    // ---- Desktop: pointer lock + drag fallback ----
    const onMouseDown = () => {
      dragging = true;
      if (document.pointerLockElement !== dom) {
        // requestPointerLock may return a promise that rejects if the browser
        // blocks it — swallow it so it never surfaces as an error.
        const req = dom.requestPointerLock() as unknown as Promise<void> | undefined;
        req?.catch?.(() => {});
      }
    };
    const onMouseUp = () => {
      dragging = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      const locked = document.pointerLockElement === dom;
      if (!locked && !dragging) return;
      applyLook(e.movementX, e.movementY, 0.0024);
    };
    const onLockChange = () => {
      const locked = document.pointerLockElement === dom;
      if (locked) wasLocked = true;
      else if (wasLocked) onExit(); // user pressed Esc to leave the lock
    };

    // ---- Touch: drag to look ----
    const touch = { id: null as number | null, x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      if (touch.id !== null) return;
      const t = e.changedTouches[0];
      touch.id = t.identifier;
      touch.x = t.clientX;
      touch.y = t.clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === touch.id) {
          applyLook(t.clientX - touch.x, t.clientY - touch.y, 0.005);
          touch.x = t.clientX;
          touch.y = t.clientY;
        }
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === touch.id) touch.id = null;
      }
    };

    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    if (isTouch) {
      dom.addEventListener("touchstart", onTouchStart, { passive: true });
      dom.addEventListener("touchmove", onTouchMove, { passive: true });
      dom.addEventListener("touchend", onTouchEnd, { passive: true });
    } else {
      dom.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("mousemove", onMouseMove);
      document.addEventListener("pointerlockchange", onLockChange);
      dom.style.cursor = "grab";
    }

    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      dom.removeEventListener("touchstart", onTouchStart);
      dom.removeEventListener("touchmove", onTouchMove);
      dom.removeEventListener("touchend", onTouchEnd);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onLockChange);
      if (document.pointerLockElement === dom) document.exitPointerLock();
      dom.style.cursor = "";
      keys.current = {};
      onNearest(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isTouch]);

  useFrame((_, rawDelta) => {
    if (!enabled) return;
    const dt = Math.min(rawDelta, 0.05);
    const k = keys.current;

    let fwd = 0;
    let strafe = 0;
    if (k["KeyW"] || k["ArrowUp"]) fwd += 1;
    if (k["KeyS"] || k["ArrowDown"]) fwd -= 1;
    if (k["KeyD"] || k["ArrowRight"]) strafe += 1;
    if (k["KeyA"] || k["ArrowLeft"]) strafe -= 1;
    fwd += joystick.current.y;
    strafe += joystick.current.x;

    const moving = Math.abs(fwd) > 0.01 || Math.abs(strafe) > 0.01;
    const speed = k["ShiftLeft"] || k["ShiftRight"] ? RUN : SPEED;

    if (moving) {
      const mag = Math.min(1, Math.hypot(fwd, strafe));
      const norm = Math.hypot(fwd, strafe) || 1;
      fwd = (fwd / norm) * mag;
      strafe = (strafe / norm) * mag;

      const sinY = Math.sin(yaw.current);
      const cosY = Math.cos(yaw.current);
      let nx = camera.position.x - (sinY * fwd - cosY * strafe) * speed * dt;
      let nz = camera.position.z - (cosY * fwd + sinY * strafe) * speed * dt;

      nx = THREE.MathUtils.clamp(nx, -ROOM.halfW + MARGIN, ROOM.halfW - MARGIN);
      nz = THREE.MathUtils.clamp(nz, -ROOM.halfD + MARGIN, ROOM.halfD - MARGIN);
      for (const s of SOLIDS) {
        const dx = nx - s.x;
        const dz = nz - s.z;
        const ox = s.hw + MARGIN - Math.abs(dx);
        const oz = s.hd + MARGIN - Math.abs(dz);
        if (ox > 0 && oz > 0) {
          if (ox < oz) nx = s.x + Math.sign(dx || 1) * (s.hw + MARGIN);
          else nz = s.z + Math.sign(dz || 1) * (s.hd + MARGIN);
        }
      }
      camera.position.x = nx;
      camera.position.z = nz;
      bob.current += dt * speed * 1.9;
    } else {
      bob.current += dt * 2;
    }

    camera.position.y =
      ROOM.eye +
      (moving ? Math.sin(bob.current) * 0.035 : Math.sin(bob.current) * 0.008);
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");

    let near: number | null = null;
    let best = Infinity;
    for (const h of HOTSPOTS) {
      const d = Math.hypot(camera.position.x - h.x, camera.position.z - h.z);
      if (d < h.radius && d < best) {
        best = d;
        near = h.index;
      }
    }
    if (near !== lastNearest.current) {
      lastNearest.current = near;
      onNearest(near);
    }
  });

  return null;
}
