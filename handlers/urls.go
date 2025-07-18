package handlers

import (
        "database/sql"
        "net/http"
        "strconv"

        "github.com/gin-gonic/gin"
        "web-crawler/models"
        "web-crawler/services"
)

type URLHandler struct {
        db      *sql.DB
        crawler *services.Crawler
}

type CreateURLRequest struct {
        URL string `json:"url" binding:"required"`
}

type BulkActionRequest struct {
        Action string   `json:"action" binding:"required"`
        IDs    []string `json:"ids" binding:"required"`
}

func NewURLHandler(db *sql.DB, crawler *services.Crawler) *URLHandler {
        return &URLHandler{
                db:      db,
                crawler: crawler,
        }
}

func (h *URLHandler) GetURLs(c *gin.Context) {
        page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
        limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
        search := c.Query("search")
        sortBy := c.DefaultQuery("sort", "created_at")
        sortOrder := c.DefaultQuery("order", "desc")

        urls, total, err := models.GetURLs(h.db, page, limit, search, sortBy, sortOrder)
        if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch URLs"})
                return
        }

        c.JSON(http.StatusOK, gin.H{
                "urls":  urls,
                "total": total,
                "page":  page,
                "limit": limit,
        })
}

func (h *URLHandler) CreateURL(c *gin.Context) {
        var req CreateURLRequest
        if err := c.ShouldBindJSON(&req); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
                return
        }

        // Check if URL already exists
        existingURL, err := models.GetURLByURL(h.db, req.URL)
        if err == nil && existingURL != nil {
                c.JSON(http.StatusConflict, gin.H{"error": "URL already exists"})
                return
        }

        url, err := models.CreateURL(h.db, req.URL)
        if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create URL"})
                return
        }

        // Automatically start crawling the new URL
        go h.crawler.CrawlURL(url.ID)

        c.JSON(http.StatusCreated, url)
}

func (h *URLHandler) UpdateURL(c *gin.Context) {
        id := c.Param("id")
        var req CreateURLRequest
        if err := c.ShouldBindJSON(&req); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
                return
        }

        url, err := models.UpdateURL(h.db, id, req.URL)
        if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update URL"})
                return
        }

        c.JSON(http.StatusOK, url)
}

func (h *URLHandler) DeleteURL(c *gin.Context) {
        id := c.Param("id")
        err := models.DeleteURL(h.db, id)
        if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete URL"})
                return
        }

        c.JSON(http.StatusOK, gin.H{"message": "URL deleted successfully"})
}

func (h *URLHandler) StartCrawl(c *gin.Context) {
        id := c.Param("id")
        
        // Update status to running
        err := models.UpdateURLStatus(h.db, id, "running")
        if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
                return
        }

        // Start crawling in background
        go h.crawler.CrawlURL(id)

        c.JSON(http.StatusOK, gin.H{"message": "Crawl started"})
}

func (h *URLHandler) StopCrawl(c *gin.Context) {
        id := c.Param("id")
        
        h.crawler.StopCrawl(id)
        
        // Status will be updated by the crawler when it actually stops
        c.JSON(http.StatusOK, gin.H{"message": "Crawl stop requested"})
}

func (h *URLHandler) GetStatus(c *gin.Context) {
        id := c.Param("id")
        
        url, err := models.GetURLByID(h.db, id)
        if err != nil {
                c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
                return
        }

        c.JSON(http.StatusOK, gin.H{
                "status": url.Status,
                "last_crawled": url.LastCrawled,
        })
}

func (h *URLHandler) BulkAction(c *gin.Context) {
        var req BulkActionRequest
        if err := c.ShouldBindJSON(&req); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
                return
        }

        switch req.Action {
        case "delete":
                for _, id := range req.IDs {
                        models.DeleteURL(h.db, id)
                }
        case "start":
                for _, id := range req.IDs {
                        models.UpdateURLStatus(h.db, id, "pending")
                        go h.crawler.CrawlURL(id)
                }
        case "stop":
                for _, id := range req.IDs {
                        h.crawler.StopCrawl(id)
                        // Status will be updated by the crawler when it actually stops
                }
        case "recrawl":
                for _, id := range req.IDs {
                        models.UpdateURLStatus(h.db, id, "pending")
                        go h.crawler.CrawlURL(id)
                }
        default:
                c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action"})
                return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Bulk action completed"})
}

func (h *URLHandler) GetBrokenLinks(c *gin.Context) {
        id := c.Param("id")
        
        brokenLinks, err := models.GetBrokenLinks(h.db, id)
        if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch broken links"})
                return
        }

        c.JSON(http.StatusOK, brokenLinks)
}
