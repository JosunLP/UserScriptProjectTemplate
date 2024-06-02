import { defineConfig } from "vite";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import pkgjsn from "./package.json";

export default defineConfig({
  build: {
    rollupOptions: {
      input: resolve(__dirname, "src/index.ts"),
      output: {
        entryFileNames: `${pkgjsn.name}.user.js`,
        dir: resolve(__dirname, "dist"),
      },
    },
    sourcemap: "inline", // Equivalent to 'inline-source-map'
  },
  plugins: [tsconfigPaths()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
});
