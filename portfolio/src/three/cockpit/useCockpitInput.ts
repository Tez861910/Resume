import { useEffect, useMemo, useRef } from "react";

export interface InputState {
  // Analog from -1..1
  throttle: number;       // W=+1, S=-1
  yaw: number;            // A=-1, D=+1
  pitch: number;          // mouse/touch pitch
  roll: number;           // Q=-1, E=+1
  boost: boolean;
  fire: boolean;
  /** incremented each time fire should spawn a shot (rate-limited by controller) */
  fireTrigger: number;
  _mobileThrottle?: boolean;
  _mobileYaw?: boolean;
  _mobilePitch?: boolean;
  _mobileRoll?: boolean;
}

export function createInitialInput(): InputState {
  return {
    throttle: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
    boost: false,
    fire: false,
    fireTrigger: 0,
  };
}

/**
 * Subscribes global input (keyboard, mouse) to a shared input ref.
 * Only activates while `active` is true. Touch input is driven separately
 * by <MobileControls>.
 */
export function useCockpitInput(active: boolean) {
  const inputRef = useRef<InputState>(createInitialInput());
  const keysRef = useRef<Record<string, boolean>>({});
  // Mouse-derived pitch/yaw offsets (decayed each frame in PlayerController)
  const mouseRef = useRef({ dx: 0, dy: 0 });
  const pointerLockedRef = useRef(false);
  const lastFireRef = useRef(0);

  // Keyboard
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;
      if (k === " ") {
        e.preventDefault();
        const now = performance.now();
        if (now - lastFireRef.current > 160) {
          lastFireRef.current = now;
          inputRef.current.fireTrigger++;
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    const onBlur = () => {
      keysRef.current = {};
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      keysRef.current = {};
    };
  }, [active]);

  // Mouse (drag OR pointer lock)
  useEffect(() => {
    if (!active) return;
    let dragging = false;
    const onDown = (e: MouseEvent) => {
      if (e.button === 0) {
        dragging = true;
        const now = performance.now();
        if (now - lastFireRef.current > 160) {
          lastFireRef.current = now;
          inputRef.current.fireTrigger++;
        }
      }
    };
    const onUp = () => {
      dragging = false;
    };
    const onMove = (e: MouseEvent) => {
      if (pointerLockedRef.current || dragging) {
        mouseRef.current.dx += e.movementX;
        mouseRef.current.dy += e.movementY;
      }
    };
    const onLockChange = () => {
      pointerLockedRef.current = !!document.pointerLockElement;
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("pointerlockchange", onLockChange);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerlockchange", onLockChange);
    };
  }, [active]);

  // Per-frame: translate held keys into analog input. Consumers should call
  // `sampleKeyboard()` each frame (done inside PlayerController).
  const api = useMemo(() => {
    return {
      input: inputRef,
      keys: keysRef,
      mouse: mouseRef,
      sampleKeyboard() {
        const k = keysRef.current;
        const i = inputRef.current;
        // Merge keyboard into analog axes (mobile can override via setAnalog)
        const kbThrottle = (k["w"] ? 1 : 0) + (k["s"] ? -1 : 0);
        const kbYaw = (k["d"] ? 1 : 0) + (k["a"] ? -1 : 0);
        const kbRoll = (k["e"] ? 1 : 0) + (k["q"] ? -1 : 0);
        // Only overwrite if keyboard is actively giving input, otherwise
        // leave whatever mobile joysticks set.
        if (kbThrottle !== 0) i.throttle = kbThrottle;
        if (kbYaw !== 0) i.yaw = kbYaw;
        if (kbRoll !== 0) i.roll = kbRoll;
        if (kbThrottle === 0 && !i._mobileThrottle) i.throttle = 0;
        if (kbYaw === 0 && !i._mobileYaw) i.yaw = 0;
        if (kbRoll === 0 && !i._mobileRoll) i.roll = 0;
        i.boost = !!k["shift"];
      },
      /** Mobile controls write analog axes here and set _mobile* flags */
      setAnalog(
        partial: Partial<
          Pick<InputState, "throttle" | "yaw" | "pitch" | "roll" | "boost">
        > & {
          mobileThrottle?: boolean;
          mobileYaw?: boolean;
          mobilePitch?: boolean;
          mobileRoll?: boolean;
        },
      ) {
        const i = inputRef.current;
        if (partial.throttle !== undefined) i.throttle = partial.throttle;
        if (partial.yaw !== undefined) i.yaw = partial.yaw;
        if (partial.pitch !== undefined) i.pitch = partial.pitch;
        if (partial.roll !== undefined) i.roll = partial.roll;
        if (partial.boost !== undefined) i.boost = partial.boost;
        if (partial.mobileThrottle !== undefined)
          i._mobileThrottle = partial.mobileThrottle;
        if (partial.mobileYaw !== undefined) i._mobileYaw = partial.mobileYaw;
        if (partial.mobilePitch !== undefined)
          i._mobilePitch = partial.mobilePitch;
        if (partial.mobileRoll !== undefined) i._mobileRoll = partial.mobileRoll;
      },
      triggerFire() {
        const now = performance.now();
        if (now - lastFireRef.current > 160) {
          lastFireRef.current = now;
          inputRef.current.fireTrigger++;
        }
      },
    };
  }, []);

  return api;
}

export type CockpitInputApi = ReturnType<typeof useCockpitInput>;
