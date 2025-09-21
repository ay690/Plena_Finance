import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise the default 500 kB warning limit to 1000 kB (1 MB)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manually split large, frequently-used libraries into dedicated chunks
        manualChunks: {
          react: ["react", "react-dom"],
          wagmi: ["wagmi", "viem", "@rainbow-me/rainbowkit"],
          radix: ["@radix-ui/react-dropdown-menu", "@radix-ui/react-slot"],
          charts: ["recharts"],
          motion: ["framer-motion"],
        },
      },
    },
  },
})