import { useMemo } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/**
 * Tasteful, cheap post stack for the station: mip-blur bloom so every emissive
 * trim glows, plus a soft vignette to focus the frame. Bloom is disabled on
 * mobile UA to protect frame time.
 */
export default function HomeBasePost() {
  const isMobile = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    [],
  );

  if (isMobile) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.25}
        mipmapBlur
        radius={0.7}
      />
      <Vignette eskil={false} offset={0.28} darkness={0.78} />
    </EffectComposer>
  );
}
