import build from '@hono/vite-build/cloudflare-workers'
import adapter from '@hono/vite-dev-server/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import honox from 'honox/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    honox({
      devServer: { adapter },
      client: { input: ['/app/client.ts', '/app/style.css'] },
    }),
    tailwindcss(),
    mdx({
      jsxImportSource: 'hono/jsx',
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    build(),
  ],
  ssr: {
    external: [
      'microcms-js-sdk',
      '@modelcontextprotocol/sdk',
      'dayjs',
      'microcms-rich-editor-handler',
      'shiki',
    ],
    noExternal: ['async-retry'],
  },
  build: {
    rollupOptions: {
      external: ['shiki'],
    },
  },
})
