CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_id TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX idx_comments_visit_id ON comments(visit_id, created_at);
