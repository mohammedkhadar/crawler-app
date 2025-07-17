CREATE DATABASE IF NOT EXISTS web_crawler;
USE web_crawler;

CREATE TABLE IF NOT EXISTS urls (
    id VARCHAR(36) PRIMARY KEY,
    url TEXT NOT NULL,
    status ENUM('queued', 'running', 'completed', 'error', 'stopped') DEFAULT 'queued',
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
    error_message TEXT,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_last_crawled (last_crawled)
);

CREATE TABLE IF NOT EXISTS broken_links (
    id VARCHAR(36) PRIMARY KEY,
    url_id VARCHAR(36) NOT NULL,
    link_url TEXT NOT NULL,
    status_code INT NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE,
    INDEX idx_url_id (url_id),
    INDEX idx_status_code (status_code)
);

-- Insert sample data for testing (optional)
INSERT INTO urls (id, url, status, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count, internal_links, external_links, broken_links, has_login_form) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'https://example.com', 'completed', 'Example Domain', 'HTML5', 1, 2, 0, 0, 0, 0, 5, 3, 0, FALSE),
('550e8400-e29b-41d4-a716-446655440001', 'https://github.com', 'completed', 'GitHub', 'HTML5', 1, 5, 10, 2, 1, 0, 25, 15, 2, TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'https://stackoverflow.com', 'running', NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, FALSE);
