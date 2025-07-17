package models

import (
        "database/sql"
        "fmt"
        "os"

        _ "github.com/lib/pq"
)

func InitDB() (*sql.DB, error) {
        // Use PostgreSQL connection string from environment
        dsn := os.Getenv("DATABASE_URL")
        if dsn == "" {
                // Fallback to individual PostgreSQL environment variables
                dbHost := os.Getenv("PGHOST")
                if dbHost == "" {
                        dbHost = "localhost"
                }
                
                dbPort := os.Getenv("PGPORT")
                if dbPort == "" {
                        dbPort = "5432"
                }
                
                dbUser := os.Getenv("PGUSER")
                if dbUser == "" {
                        dbUser = "postgres"
                }
                
                dbPassword := os.Getenv("PGPASSWORD")
                if dbPassword == "" {
                        dbPassword = "password"
                }
                
                dbName := os.Getenv("PGDATABASE")
                if dbName == "" {
                        dbName = "web_crawler"
                }

                dsn = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
                        dbHost, dbPort, dbUser, dbPassword, dbName)
        }

        db, err := sql.Open("postgres", dsn)
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
                        status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'error', 'stopped')),
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
