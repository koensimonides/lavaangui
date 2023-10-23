import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    minify: true,
    outDir: "../inst/www",
    sourcemap: false,
    emptyOutDir: true,
  },
  //base: "",
});
