import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { emergentOverlay } from "@emergentbase/overlay/vite";
import visualEdits from "@emergentbase/visual-edits/vite";

export default defineConfig({
  plugins: [react(), visualEdits(), emergentOverlay()],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  envPrefix: ["VITE_", "REACT_APP_"],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: "wss",
    },
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    },
  },
  build: {
    outDir: "build",
    sourcemap: false,
  },
});
