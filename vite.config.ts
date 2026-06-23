import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/ap_crossword/",
    define: {
      "process.env": {},
    },
    server: {
      host: true,
      allowedHosts: [env.VITE_PUBLIC_HOST],
    },
  };
});
