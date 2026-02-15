CREATE TABLE daily_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_path TEXT NOT NULL,
    content_id TEXT NOT NULL,
    page_type TEXT NOT NULL,
    date TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    UNIQUE(page_path, date)
);

CREATE INDEX idx_daily_pages_date ON daily_pages(date);
CREATE INDEX idx_daily_pages_content ON daily_pages(content_id, page_type);

CREATE TABLE popular_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_path TEXT NOT NULL,
    content_id TEXT NOT NULL,
    page_type TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    thumbnail_url TEXT NOT NULL DEFAULT '',
    shop_name TEXT NOT NULL DEFAULT '',
    total_count INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    UNIQUE(page_path)
);

CREATE INDEX idx_popular_pages_total ON popular_pages(total_count DESC);
CREATE INDEX idx_popular_pages_type ON popular_pages(page_type, total_count DESC);
