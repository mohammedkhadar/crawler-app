package models

import (
        "database/sql"
        "time"

        "github.com/google/uuid"
)

type URL struct {
        ID            string     `json:"id"`
        URL           string     `json:"url"`
        Status        string     `json:"status"`
        CreatedAt     time.Time  `json:"created_at"`
        LastCrawled   *time.Time `json:"last_crawled"`
        Title         *string    `json:"title"`
        HTMLVersion   *string    `json:"html_version"`
        H1Count       int        `json:"h1_count"`
        H2Count       int        `json:"h2_count"`
        H3Count       int        `json:"h3_count"`
        H4Count       int        `json:"h4_count"`
        H5Count       int        `json:"h5_count"`
        H6Count       int        `json:"h6_count"`
        InternalLinks int        `json:"internal_links"`
        ExternalLinks int        `json:"external_links"`
        BrokenLinks   int        `json:"broken_links"`
        HasLoginForm  bool       `json:"has_login_form"`
        ErrorMessage  *string    `json:"error_message"`
}

type BrokenLink struct {
        ID           string    `json:"id"`
        URLID        string    `json:"url_id"`
        LinkURL      string    `json:"link_url"`
        StatusCode   int       `json:"status_code"`
        ErrorMessage *string   `json:"error_message"`
        CreatedAt    time.Time `json:"created_at"`
}

func GetURLs(db *sql.DB, page, limit int, search, sortBy, sortOrder string) ([]URL, int, error) {
        // Calculate offset
        offset := (page - 1) * limit

        // Build query
        whereClause := ""
        args := []interface{}{}
        
        if search != "" {
                whereClause = "WHERE url LIKE ? OR title LIKE ?"
                args = append(args, "%"+search+"%", "%"+search+"%")
        }

        // Count total
        countQuery := "SELECT COUNT(*) FROM urls " + whereClause
        var total int
        err := db.QueryRow(countQuery, args...).Scan(&total)
        if err != nil {
                return nil, 0, err
        }

        // Main query
        query := `SELECT id, url, status, created_at, last_crawled, title, html_version, 
                          h1_count, h2_count, h3_count, h4_count, h5_count, h6_count, 
                          internal_links, external_links, broken_links, has_login_form, error_message
                          FROM urls ` + whereClause + ` ORDER BY ` + sortBy + ` ` + sortOrder + ` LIMIT ? OFFSET ?`
        
        args = append(args, limit, offset)
        rows, err := db.Query(query, args...)
        if err != nil {
                return nil, 0, err
        }
        defer rows.Close()

        var urls []URL
        for rows.Next() {
                var url URL
                err := rows.Scan(&url.ID, &url.URL, &url.Status, &url.CreatedAt, &url.LastCrawled,
                        &url.Title, &url.HTMLVersion, &url.H1Count, &url.H2Count, &url.H3Count,
                        &url.H4Count, &url.H5Count, &url.H6Count, &url.InternalLinks,
                        &url.ExternalLinks, &url.BrokenLinks, &url.HasLoginForm, &url.ErrorMessage)
                if err != nil {
                        return nil, 0, err
                }
                urls = append(urls, url)
        }

        return urls, total, nil
}

func CreateURL(db *sql.DB, urlStr string) (*URL, error) {
        id := uuid.New().String()
        now := time.Now()

        query := `INSERT INTO urls (id, url, status, created_at) VALUES (?, ?, 'pending', ?)`
        _, err := db.Exec(query, id, urlStr, now)
        if err != nil {
                return nil, err
        }

        return &URL{
                ID:        id,
                URL:       urlStr,
                Status:    "pending",
                CreatedAt: now,
        }, nil
}

func UpdateURL(db *sql.DB, id, urlStr string) (*URL, error) {
        query := `UPDATE urls SET url = ? WHERE id = ?`
        _, err := db.Exec(query, urlStr, id)
        if err != nil {
                return nil, err
        }

        return GetURLByID(db, id)
}

func DeleteURL(db *sql.DB, id string) error {
        query := `DELETE FROM urls WHERE id = ?`
        _, err := db.Exec(query, id)
        return err
}

func GetURLByID(db *sql.DB, id string) (*URL, error) {
        query := `SELECT id, url, status, created_at, last_crawled, title, html_version, 
                          h1_count, h2_count, h3_count, h4_count, h5_count, h6_count, 
                          internal_links, external_links, broken_links, has_login_form, error_message
                          FROM urls WHERE id = ?`
        
        var url URL
        err := db.QueryRow(query, id).Scan(&url.ID, &url.URL, &url.Status, &url.CreatedAt,
                &url.LastCrawled, &url.Title, &url.HTMLVersion, &url.H1Count, &url.H2Count,
                &url.H3Count, &url.H4Count, &url.H5Count, &url.H6Count, &url.InternalLinks,
                &url.ExternalLinks, &url.BrokenLinks, &url.HasLoginForm, &url.ErrorMessage)
        
        if err != nil {
                return nil, err
        }

        return &url, nil
}

func GetURLByURL(db *sql.DB, urlStr string) (*URL, error) {
        query := `SELECT id, url, status, created_at, last_crawled, title, html_version, 
                          h1_count, h2_count, h3_count, h4_count, h5_count, h6_count, 
                          internal_links, external_links, broken_links, has_login_form, error_message
                          FROM urls WHERE url = ?`
        
        var url URL
        err := db.QueryRow(query, urlStr).Scan(&url.ID, &url.URL, &url.Status, &url.CreatedAt,
                &url.LastCrawled, &url.Title, &url.HTMLVersion, &url.H1Count, &url.H2Count,
                &url.H3Count, &url.H4Count, &url.H5Count, &url.H6Count, &url.InternalLinks,
                &url.ExternalLinks, &url.BrokenLinks, &url.HasLoginForm, &url.ErrorMessage)
        
        if err != nil {
                return nil, err
        }

        return &url, nil
}

func UpdateURLStatus(db *sql.DB, id, status string) error {
        query := `UPDATE urls SET status = ? WHERE id = ?`
        _, err := db.Exec(query, status, id)
        return err
}

func UpdateURLData(db *sql.DB, id string, data map[string]interface{}) error {
        now := time.Now()
        
        query := `UPDATE urls SET 
                          last_crawled = ?, title = ?, html_version = ?, 
                          h1_count = ?, h2_count = ?, h3_count = ?, h4_count = ?, h5_count = ?, h6_count = ?,
                          internal_links = ?, external_links = ?, broken_links = ?, has_login_form = ?, 
                          status = 'completed'
                          WHERE id = ?`
        
        _, err := db.Exec(query, now, data["title"], data["html_version"],
                data["h1_count"], data["h2_count"], data["h3_count"], data["h4_count"],
                data["h5_count"], data["h6_count"], data["internal_links"],
                data["external_links"], data["broken_links"], data["has_login_form"], id)
        
        return err
}

func GetBrokenLinks(db *sql.DB, urlID string) ([]BrokenLink, error) {
        query := `SELECT id, url_id, link_url, status_code, error_message, created_at 
                          FROM broken_links WHERE url_id = ?`
        
        rows, err := db.Query(query, urlID)
        if err != nil {
                return nil, err
        }
        defer rows.Close()

        var links []BrokenLink
        for rows.Next() {
                var link BrokenLink
                err := rows.Scan(&link.ID, &link.URLID, &link.LinkURL, &link.StatusCode,
                        &link.ErrorMessage, &link.CreatedAt)
                if err != nil {
                        return nil, err
                }
                links = append(links, link)
        }

        return links, nil
}

func CreateBrokenLink(db *sql.DB, urlID, linkURL string, statusCode int, errorMsg string) error {
        id := uuid.New().String()
        query := `INSERT INTO broken_links (id, url_id, link_url, status_code, error_message) 
                          VALUES (?, ?, ?, ?, ?)`
        _, err := db.Exec(query, id, urlID, linkURL, statusCode, errorMsg)
        return err
}
