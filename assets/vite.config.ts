import { defineConfig, loadEnv } from 'vite'

import griffel from '@griffel/vite-plugin'
import react from '@vitejs/plugin-react'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      outDir: '../priv/static',
      target: ['es2020'],
      rollupOptions: {
        input: 'src/app.tsx',
        output: {
          assetFileNames: 'assets/[name][extname]',
          chunkFileNames: 'assets/chunk/[name].js',
          entryFileNames: 'assets/[name].js',
        },
      },
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    plugins: [
      TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
      react(),
      command === 'build' && griffel(),
    ],
    publicDir: false,
  }
})
