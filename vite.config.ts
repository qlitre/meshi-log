import build from '@hono/vite-build/cloudflare-workers'
import adapter from '@hono/vite-dev-server/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import honox from 'honox/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
  const alias: Record<string, string> = {}
  if (command === 'serve') {
    alias['cloudflare:email'] = '/app/libs/cloudflare-email-stub.ts'
  }
  return {
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
    resolve: { alias },
    ssr: {
      external: [
        'microcms-js-sdk',
        '@modelcontextprotocol/sdk',
        'dayjs',
        'microcms-rich-editor-handler',
        'shiki',
        'mimetext',
      ],
      noExternal: ['async-retry'],
    },
    build: {
      rollupOptions: {
        external: ['shiki', 'cloudflare:email'],
      },
    },
  }
})
