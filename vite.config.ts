import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkgjsn from "./package.json";

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    build: {
      rollupOptions: {
        input: resolve(__dirname, "src/index.ts"),
        output: {
          entryFileNames: `${pkgjsn.name}${isDev ? '.dev' : ''}.user.js`,
          dir: resolve(__dirname, "dist"),
        },
      },
      sourcemap: isDev ? "inline" : false,
      minify: isDev ? false : 'terser',
    },
    plugins: [tsconfigPaths()],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      __DEV__: isDev,
      __VERSION__: JSON.stringify(pkgjsn.version),
    },
  };
});
