import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      // Bun's install drops several sub-directories from pixi.js (lib/assets,
      // lib/events, lib/scene/graphics, etc.), so the loose ES-module tree
      // doesn't resolve. Use the pre-bundled single-file build instead.
      "pixi.js": fileURLToPath(new URL("./node_modules/pixi.js/dist/pixi.mjs", import.meta.url)),
      // Pin gsap so shared/src files (which sit outside site/node_modules
      // walk-up) can still resolve it.
      gsap: fileURLToPath(new URL("./node_modules/gsap/index.js", import.meta.url)),
    },
  },
  server: {
    port: 5181,
    fs: {
      allow: [
        fileURLToPath(new URL("./", import.meta.url)),
        fileURLToPath(new URL("./src/shared", import.meta.url)),
      ],
    },
  },
});
