import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import pkgjsn from './package.json';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src/index.ts'),
        output: {
          entryFileNames: `${pkgjsn.name}${isDev ? '.dev' : ''}.user.js`,
          dir: resolve(__dirname, 'dist'),
          // Disable code splitting - everything in one file for UserScript
          inlineDynamicImports: true,
          manualChunks: undefined,
          // Optimize output format
          format: 'iife',
          // Remove unnecessary comments in production
          banner: isDev ? undefined : '',
          footer: isDev ? undefined : '',
        },
        // Prevent any external dependencies
        external: [],
        // Tree-shaking optimizations
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
      },
      sourcemap: isDev ? 'inline' : false,
      minify: isDev ? false : 'terser',
      // Enhanced Terser options for maximum compression
      terserOptions: isDev
        ? undefined
        : {
            compress: {
              drop_console: false, // Keep console for UserScript debugging
              drop_debugger: true,
              pure_funcs: ['console.debug'],
              passes: 2,
              unsafe: true,
              unsafe_arrows: true,
              unsafe_comps: true,
              unsafe_math: true,
              unsafe_methods: true,
              unsafe_proto: true,
              unsafe_regexp: true,
              unsafe_undefined: true,
              hoist_funs: true,
              hoist_props: true,
              hoist_vars: false,
              if_return: true,
              join_vars: true,
              sequences: true,
              side_effects: true,
              switches: true,
              typeofs: true,
              booleans: true,
              collapse_vars: true,
              comparisons: true,
              computed_props: true,
              conditionals: true,
              dead_code: true,
              directives: true,
              evaluate: true,
              expression: false,
              global_defs: {},
              keep_fargs: false,
              keep_infinity: false,
              loops: true,
              negate_iife: true,
              properties: true,
              reduce_funcs: true,
              reduce_vars: true,
              toplevel: true,
              unused: true,
            },
            mangle: {
              toplevel: true,
              safari10: false,
              properties: {
                regex: /^_/,
              },
            },
            format: {
              comments: false,
              beautify: false,
            },
            ecma: 2020,
            toplevel: true,
            safari10: false,
            ie8: false,
          },
      // Ensure all assets are inlined
      assetsInlineLimit: Number.MAX_SAFE_INTEGER,
      // Disable CSS code splitting
      cssCodeSplit: false,
      // Target modern browsers for better optimization
      target: ['es2020', 'chrome80', 'firefox78', 'safari14'],
      // Report compressed file sizes
      reportCompressedSize: true,
      // Chunk size warnings
      chunkSizeWarningLimit: 500,
    },
    plugins: [tsconfigPaths()],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      __DEV__: isDev,
      __VERSION__: JSON.stringify(pkgjsn.version),
      // Production optimizations
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
      // Remove debug code in production
      __DEBUG__: isDev,
      // UserScript environment flags
      __USERSCRIPT__: true,
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [],
      exclude: [],
    },
    // Enable esbuild optimizations
    esbuild: {
      target: 'es2020',
      legalComments: 'none',
      ...(isDev
        ? {}
        : {
            drop: ['debugger'],
            minifyIdentifiers: true,
            minifySyntax: true,
            minifyWhitespace: true,
          }),
    },
  };
});
