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
      "/api/jobs": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/api/images": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
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
    "import.meta.env.GOOGLE_CLIENT_ID": JSON.stringify(process.env.GOOGLE_CLIENT_ID || null),
    "import.meta.env.GOOGLE_LOGIN_SECRET_KEY": JSON.stringify(process.env.GOOGLE_LOGIN_SECRET_KEY || null),
  },
})
