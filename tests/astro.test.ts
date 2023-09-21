import nodejs from '@astrojs/node'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import { expect, test } from 'vitest'

import { createPartialMergeWithDestination } from '@/src/factory'

const originalConfig = defineConfig({
  build: {
    format: 'file',
    server: 'server',
  },
  integrations: [react(), tailwind()],
  image: {
    // Example: Allow remote image optimization from a single domain
    domains: ['astro.build'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  server: { port: 1234, host: true },
  //  server: ({ command }) => ({ port: command === 'dev' ? 4321 : 4000 })
  root: new URL('foo', import.meta.url).toString(),
  // Resolves to the "./public" directory, relative to this config file
  publicDir: new URL('public', import.meta.url).toString(),
  adapter: nodejs({
    mode: 'middleware', // or 'standalone'
  }),
  redirects: {
    '/other': {
      status: 302,
      destination: '/place',
    },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'entry.[hash].mjs',
          chunkFileNames: 'chunks/chunk.[hash].mjs',
          assetFileNames: 'assets/asset.[hash][extname]',
        },
      },
    },
  },
})

test.skip('a', () => {
  const compiledDestination = createPartialMergeWithDestination({
    build: { format: 'buffer' },
  })
  expect(compiledDestination(originalConfig)).toMatchObject({
    build: {
      format: 'file',
      server: 'server',
    },
  })
})
