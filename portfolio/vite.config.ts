import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    chunkSizeWarningLimit: 800,
    // The cockpit (three.js/r3f) is a lazy route. Keep its chunks cacheable but
    // strip them from the main document's eager <link rel="modulepreload"> so the
    // résumé site's first paint never downloads the heavy 3D bundle. When the
    // cockpit route is entered, the dynamic-import preload (hostType "js") still
    // requests them normally.
    modulePreload: {
      resolveDependencies(_url, deps, { hostType }) {
        if (hostType === "html") {
          return deps.filter(
            (dep) => !/(?:^|\/)(?:three-core|r3f|CockpitGame)-/.test(dep),
          );
        }
        return deps;
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          // React + routing — stable vendor chunk, needed on first paint.
          if (
            /node_modules\/react(-dom|-router-dom|-router)?\//.test(id) ||
            id.includes("react/jsx-runtime") ||
            id.includes("scheduler")
          ) {
            return "vendor-react";
          }
          // UI / animation utilities used across the résumé pages.
          if (
            id.includes("framer-motion") ||
            id.includes("react-icons") ||
            id.includes("react-intersection-observer")
          ) {
            return "vendor-ui";
          }
          // three.js + @react-three stay in their own chunks for long-term
          // caching, but because they are only reachable through the lazy
          // cockpit route they remain async and are never preloaded on the
          // main résumé site's first paint.
          if (id.includes("/three/") || id.includes("node_modules/three")) {
            return "three-core";
          }
          if (id.includes("@react-three")) {
            return "r3f";
          }
          return undefined;
        },
      },
    },
  },
});
