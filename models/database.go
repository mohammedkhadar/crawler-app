package models

import (
        "database/sql"
        "os"

        _ "github.com/mattn/go-sqlite3"
)

func InitDB() (*sql.DB, error) {
        // Use SQLite database file
        dbPath := os.Getenv("DB_PATH")
        if dbPath == "" {
                dbPath = "./web_crawler.db"
        }

        db, err := sql.Open("sqlite3", dbPath)
        if err != nil {
                return nil, err
        }

        if err := db.Ping(); err != nil {
                return nil, err
        }

        // Create tables if they don't exist
        if err := createTables(db); err != nil {
                return nil, err
        }

        return db, nil
}

func createTables(db *sql.DB) error {
        queries := []string{
                `CREATE TABLE IF NOT EXISTS urls (
                        id VARCHAR(36) PRIMARY KEY,
                        url TEXT NOT NULL,
                        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'crawling', 'completed', 'error', 'stopped')),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        last_crawled TIMESTAMP NULL,
                        title TEXT,
                        html_version VARCHAR(50),
                        h1_count INT DEFAULT 0,
                        h2_count INT DEFAULT 0,
                        h3_count INT DEFAULT 0,
                        h4_count INT DEFAULT 0,
                        h5_count INT DEFAULT 0,
                        h6_count INT DEFAULT 0,
                        internal_links INT DEFAULT 0,
                        external_links INT DEFAULT 0,
                        broken_links INT DEFAULT 0,
                        has_login_form BOOLEAN DEFAULT FALSE,
                        error_message TEXT
                )`,
                `CREATE TABLE IF NOT EXISTS broken_links (
                        id VARCHAR(36) PRIMARY KEY,
                        url_id VARCHAR(36) NOT NULL,
                        link_url TEXT NOT NULL,
                        status_code INT NOT NULL,
                        error_message TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE
                )`,
        }

        for _, query := range queries {
                if _, err := db.Exec(query); err != nil {
                        return err
                }
        }

        return nil
}
