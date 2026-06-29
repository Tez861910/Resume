import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/**
 * Error boundary that swallows post-processing init failures.
 *
 * The underlying `postprocessing` EffectComposer reads
 * `renderer.getContext().getContextAttributes().alpha` when a pass is added.
 * If the WebGL context is lost or unavailable (driver hiccup, throttled GPU,
 * some headless/software renderers) that call throws and would otherwise crash
 * the whole canvas to a blank/white frame. Catching it lets the station keep
 * rendering — just without the bloom/vignette flourish.
 */
class PostFXBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn("[HomeBasePost] post-processing disabled:", err);
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function PostStack() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.45}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.18}
        mipmapBlur
        radius={0.55}
      />
      <Vignette eskil={false} offset={0.3} darkness={0.62} />
    </EffectComposer>
  );
}

/**
 * Tasteful, cheap post stack for the station: mip-blur bloom so every emissive
 * trim glows, plus a soft vignette to focus the frame. Disabled on mobile UA
 * and whenever the WebGL context drops, and wrapped in an error boundary so a
 * post-processing failure can never blank the scene.
 */
export default function HomeBasePost({ disabled = false }: { disabled?: boolean }) {
  const gl = useThree((s) => s.gl);
  const [contextLost, setContextLost] = useState(false);

  const isMobile = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    [],
  );

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = () => setContextLost(true);
    const onRestored = () => setContextLost(false);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    // Guard against a context that is already gone at mount time.
    const ctx = gl.getContext();
    if (!ctx || ctx.isContextLost?.()) setContextLost(true);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl]);

  if (isMobile || contextLost || disabled) return null;

  return (
    <PostFXBoundary>
      <PostStack />
    </PostFXBoundary>
  );
}
