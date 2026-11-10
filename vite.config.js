import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" => kisi bhi repo name par GitHub Pages pe chalega
export default defineConfig({
  base: "./",
  plugins: [react()],
});
