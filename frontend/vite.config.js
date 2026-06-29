import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // raise the chunk warning limit to reduce noisy warnings; adjust if needed
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Example manualChunks to split vendor code into smaller bundles.
        // Adjust groups based on your app's dependency graph.
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom"))
              return "react-vendor";
            if (
              id.includes("axios") ||
              id.includes("socket.io-client") ||
              id.includes("zustand")
            )
              return "libs";
            if (id.includes("lucide-react") || id.includes("daisyui"))
              return "ui";
            return "vendor";
          }
        },
      },
    },
  },
});
