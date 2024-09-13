import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import packageJson from "./package.json"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      "/api/": {
        target: "https://api.piktid.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
    "import.meta.env.BASE_API_URL": JSON.stringify(process.env.BASE_API_URL || ""),
  },
})
