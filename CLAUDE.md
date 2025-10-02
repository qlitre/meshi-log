# CLAUDE.md

日本語で回答してください。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**飯ログアプリ**: 訪問した飲食店の記録を管理するアプリケーション

- **HonoX** application targeting **Cloudflare Workers**
- **microCMS** をヘッドレスCMSとして使用
- HonoXはHono上に構築されたメタフレームワークで、ファイルベースルーティングとIslandsアーキテクチャ、SSRを提供

## Key Technologies

- **Hono**: Edge向け高速Webフレームワーク
- **HonoX**: ファイルベースルーティングとIslandsアーキテクチャを持つメタフレームワーク
- **Cloudflare Workers**: デプロイ先
- **microCMS**: ヘッドレスCMS（店舗情報・訪問記録の管理）
- **microcms-js-sdk**: microCMS JavaScript SDK
- **Vite**: ビルドツール・開発サーバー
- **Wrangler**: Cloudflare Workers CLI
- **Tailwind CSS v4**: `@tailwindcss/vite`経由でスタイリング
- **JSX**: Honoの JSX runtime使用 (`jsxImportSource: "hono/jsx"`)

## Development Commands

```bash
# Start development server
yarn dev

# Build for production (builds client first, then server)
yarn build

# Preview production build locally with Wrangler
yarn preview

# Deploy to Cloudflare Workers
yarn deploy
```

## Architecture

### Directory Structure

```
app/
├── client.ts          # Client-side entry point (creates HonoX client)
├── server.ts          # Server-side entry point (creates HonoX app)
├── global.d.ts        # Type definitions for Hono Env (Variables & Bindings)
├── style.css          # Global styles
├── routes/            # File-based routing
│   ├── index.tsx      # Route handlers using createRoute()
│   ├── _renderer.tsx  # Layout renderer with jsxRenderer()
│   ├── _404.tsx       # 404 handler (NotFoundHandler)
│   └── _error.tsx     # Error handler (ErrorHandler)
└── islands/           # Interactive client components
    └── counter.tsx    # Islands use useState from 'hono/jsx'
```

### Routing Conventions

- **Routes**: Files in `app/routes/` map to URL paths
  - `index.tsx` → `/`
  - Use `createRoute()` from `honox/factory` to define route handlers
  - Access request context via `c` parameter (query, params, etc.)

- **Special Files**:
  - `_renderer.tsx`: Layout wrapper using `jsxRenderer()` from `hono/jsx-renderer`
  - `_404.tsx`: Custom 404 handler (type: `NotFoundHandler`)
  - `_error.tsx`: Global error handler (type: `ErrorHandler`)

### Islands Architecture

- **Islands**: Interactive components in `app/islands/`
  - Use `useState` from `hono/jsx` (not React)
  - Automatically hydrated on the client side
  - Import islands into route components to use them

### Build Process

The build is a two-step process (see `package.json`):
1. **Client build**: `vite build --mode client` - Bundles client-side code
2. **Server build**: `vite build` - Bundles server-side code

Both builds are configured in `vite.config.ts`:
- HonoX plugin handles the dual client/server compilation
- Client entry points: `/app/client.ts` and `/app/style.css`
- Output goes to `dist/` directory
- Tailwind CSS is processed via `@tailwindcss/vite` plugin

### Deployment

- Deploy target: Cloudflare Workers
- Configuration: `wrangler.jsonc`
- Main entry: `./dist/index.js`
- Assets served from: `./dist` directory
- Compatibility date: `2025-10-02` with `nodejs_compat` flag

### microCMS Integration

microCMSの型定義は `app/types/microcms.ts` に定義されています:

```typescript
// microcms-js-sdkから基本型をimport
import type { MicroCMSContentId, MicroCMSDate, MicroCMSListResponse } from 'microcms-js-sdk'

// コンテンツ型
export interface Area extends MicroCMSContentId, MicroCMSDate {
  name: string
}

export interface Genre extends MicroCMSContentId, MicroCMSDate {
  name: string
}

export interface Shop extends MicroCMSContentId, MicroCMSDate {
  name: string
  address: string
  area?: Area
  genre?: Genre
  memo?: string
  rateing?: number
}

export interface Visit extends MicroCMSContentId, MicroCMSDate {
  shop?: Shop
  visit_date?: string
  memo?: string // richEditorV2
}
```

**microCMS API構成:**
- `area`: エリアマスター
- `genre`: ジャンルマスター
- `shop`: 店舗情報（area, genreはrelation）
- `visits`: 訪問記録（shopはrelation、memoはrichEditorV2）

### Type Definitions

Hono型の拡張は `app/global.d.ts` で行います:
```typescript
declare module 'hono' {
  interface Env {
    Variables: {}  // コンテキスト変数を追加
    Bindings: {
      MICROCMS_API_KEY: string  // 環境変数
      MICROCMS_SERVICE_DOMAIN: string
    }
  }
}
```

## Working with This Codebase

### Adding Routes

1. `app/routes/` に新しいファイルを作成 (例: `about.tsx`)
2. `createRoute()` from `honox/factory` を使用
3. `c.render()` でJSXコンテンツを返す

### Adding Interactive Components

1. `app/islands/` に新しいコンポーネントを作成
2. 状態管理には `useState` from `hono/jsx` を使用
3. routeコンポーネントでislandをimportして使用

### Styling

- グローバルスタイル: `app/style.css`
- Tailwind CSS v4はViteプラグイン経由で設定済み
- JSX内でTailwindユーティリティクラスを直接使用
