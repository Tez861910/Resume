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
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js core — large, changes rarely, benefits most from caching
          "three-core": ["three"],
          // React Three Fiber ecosystem — changes on library updates only
          r3f: [
            "@react-three/fiber",
            "@react-three/drei",
            "@react-three/postprocessing",
          ],
          // React + routing — stable vendor chunk
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // UI / animation utilities
          "vendor-ui": [
            "framer-motion",
            "react-icons",
            "react-intersection-observer",
          ],
        },
      },
    },
  },
});
