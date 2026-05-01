import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/tucsonmesh-configgen/",
  plugins: [react()],
  build: {
    outDir: "build",
  },
});
