# microCMS Schema

このディレクトリには、microCMS Management APIから取得した最新のスキーマ定義が格納されています。

## ファイル一覧

- `genre.json` - ジャンルマスター
- `area.json` - エリアマスター
- `shop.json` - 店舗情報
- `visits.json` - 訪問記録

## 更新方法

MCPツールを使用してスキーマを取得・更新:

```bash
# スキーマ取得（MCPツール経由）
mcp__mesh-log-mcp__get_api_schema
```

## スキーマ構造

### genre (ジャンル)
- `name` (text, 必須): ジャンル名

### area (エリア)
- `name` (text, 必須): エリア名

### shop (店舗)
- `name` (text, 必須): 店名
- `address` (textArea, 必須): 住所
- `area` (relation → area, 必須): エリア
- `genre` (relation → genre, 必須): ジャンル
- `memo` (textArea, 必須): メモ
- `rating` (number, オプショナル): 評価

### visits (訪問記録)
- `title` (text, 必須): タイトル
- `shop` (relation → shop, 必須): お店
- `visit_date` (date, 必須): 訪問日
- `memo` (richEditorV2, 必須): メモ

## リレーション構造

```
visits
  ├─ title
  ├─ shop (relation)
  │   ├─ area (relation)
  │   └─ genre (relation)
  ├─ visit_date
  └─ memo
```
