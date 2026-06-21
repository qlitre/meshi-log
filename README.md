# 飯ログ (Meshi-Log)

自分が訪れた飲食店の記録を残すための個人的なログサイトです。

「どこで何を食べたか」「そのとき何を感じたか」を記録していきます。

→ [meshi-log.info](https://meshi-log.info/)

## Feed

Atom Feedを配信しています。RSSリーダーに以下のURLを登録すると最新の訪問記事が受け取れます。

[https://meshi-log.info/feed.atom](https://meshi-log.info/feed.atom)

## MCP

リモートMCPサーバーとして情報を配信しています。MCPクライアントから以下のURLに接続すると、AIアシスタントを通じて飯ログの情報を検索・取得できます。

[https://meshi-log.info/mcp](https://meshi-log.info/mcp)

## 使用技術

- **HonoX**: フレームワーク
- **microCMS**: ヘッドレスCMS（店舗情報・訪問記録の管理）
- **Cloudflare Workers**: デプロイ環境
- **Tailwind CSS v4**: スタイリング

## 開発

```bash
yarn dev      # 開発サーバー起動
yarn build    # ビルド
yarn preview  # wrangler でローカルプレビュー
yarn deploy   # Cloudflare Workers へデプロイ
```
