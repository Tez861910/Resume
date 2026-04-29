import { useEffect, useState } from "react";

type LockableScreenOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
};

export default function usePortraitTouchLayout(lockLandscape = false) {
  const [isPortraitTouch, setIsPortraitTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateOrientationState = () => {
      const isTouchDevice =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches;
      setIsPortraitTouch(isTouchDevice && window.innerHeight > window.innerWidth);
    };

    updateOrientationState();
    window.addEventListener("resize", updateOrientationState);
    window.addEventListener("orientationchange", updateOrientationState);

    return () => {
      window.removeEventListener("resize", updateOrientationState);
      window.removeEventListener("orientationchange", updateOrientationState);
    };
  }, []);

  useEffect(() => {
    if (!lockLandscape || typeof window === "undefined") return;

    const orientation = window.screen?.orientation as
      | LockableScreenOrientation
      | undefined;
    if (typeof orientation?.lock !== "function") return;

    orientation.lock("landscape").catch(() => undefined);
  }, [lockLandscape]);

  return isPortraitTouch;
}
