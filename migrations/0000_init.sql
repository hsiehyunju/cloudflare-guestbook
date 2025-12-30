-- Migration number: 0001 	 2025-12-30T16:30:00.000Z
-- schema.sql
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_id TEXT NOT NULL,            -- Generic Identifier (e.g., Article ID, Product ID, etc.)
    parent_id INTEGER DEFAULT NULL,     -- Two-level hierarchy using NULL for the first layer.
    nickname TEXT NOT NULL,
    content TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    created_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
);


-- Add indexes to optimize query performance for target-specific comments.
CREATE INDEX idx_target_id ON comments(target_id);