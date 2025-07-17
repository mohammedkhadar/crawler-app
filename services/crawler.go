package services

import (
        "database/sql"
        "fmt"
        "net/http"
        "net/url"
        "strings"
        "sync"
        "time"

        "github.com/PuerkitoBio/goquery"
        "web-crawler/models"
)

type Crawler struct {
        db          *sql.DB
        activeJobs  map[string]chan bool
        jobsMutex   sync.RWMutex
        httpClient  *http.Client
}

func NewCrawler(db *sql.DB) *Crawler {
        return &Crawler{
                db:         db,
                activeJobs: make(map[string]chan bool),
                httpClient: &http.Client{
                        Timeout: 30 * time.Second,
                },
        }
}

func (c *Crawler) CrawlURL(urlID string) {
        // Set up cancellation channel
        c.jobsMutex.Lock()
        stopChan := make(chan bool, 1)
        c.activeJobs[urlID] = stopChan
        c.jobsMutex.Unlock()

        // Clean up when done
        defer func() {
                c.jobsMutex.Lock()
                delete(c.activeJobs, urlID)
                c.jobsMutex.Unlock()
        }()

        // Update status to crawling
        c.updateStatus(urlID, "crawling")
        
        // Get URL from database
        urlRecord, err := models.GetURLByID(c.db, urlID)
        if err != nil {
                c.updateError(urlID, "Failed to get URL from database")
                return
        }

        // Check if job was cancelled
        select {
        case <-stopChan:
                c.updateStatus(urlID, "stopped")
                return
        default:
        }

        // Fetch the webpage
        resp, err := c.httpClient.Get(urlRecord.URL)
        if err != nil {
                c.updateError(urlID, fmt.Sprintf("Failed to fetch URL: %v", err))
                return
        }
        defer resp.Body.Close()

        // Check if job was cancelled
        select {
        case <-stopChan:
                c.updateStatus(urlID, "stopped")
                return
        default:
        }

        // Parse HTML
        doc, err := goquery.NewDocumentFromReader(resp.Body)
        if err != nil {
                c.updateError(urlID, fmt.Sprintf("Failed to parse HTML: %v", err))
                return
        }

        // Add a delay to make crawling slower for testing stop functionality
        time.Sleep(5 * time.Second)

        // Extract data
        data := c.extractData(doc, urlRecord.URL)

        // Check if job was cancelled
        select {
        case <-stopChan:
                c.updateStatus(urlID, "stopped")
                return
        default:
        }

        // Check if job was cancelled
        select {
        case <-stopChan:
                c.updateStatus(urlID, "stopped")
                return
        default:
        }

        // Check for broken links (this takes time, so add cancellation check)
        brokenLinks := c.checkBrokenLinks(doc, urlRecord.URL)
        data["broken_links"] = len(brokenLinks)

        // Store broken links
        for _, link := range brokenLinks {
                models.CreateBrokenLink(c.db, urlID, link.URL, link.StatusCode, link.Error)
        }

        // Update database
        err = models.UpdateURLData(c.db, urlID, data)
        if err != nil {
                c.updateError(urlID, fmt.Sprintf("Failed to update database: %v", err))
                return
        }
        
        // Update status to completed
        c.updateStatus(urlID, "completed")
}

func (c *Crawler) StopCrawl(urlID string) {
        c.jobsMutex.Lock()
        stopChan, exists := c.activeJobs[urlID]
        if exists {
                select {
                case stopChan <- true:
                        // Also immediately update status to stopped
                        c.updateStatus(urlID, "stopped")
                default:
                        // If channel is full, force stop by updating status
                        c.updateStatus(urlID, "stopped")
                }
                delete(c.activeJobs, urlID)
        } else {
                // If job not found in active jobs, just update status
                c.updateStatus(urlID, "stopped")
        }
        c.jobsMutex.Unlock()
}

func (c *Crawler) extractData(doc *goquery.Document, baseURL string) map[string]interface{} {
        data := make(map[string]interface{})

        // Extract title
        data["title"] = doc.Find("title").Text()

        // Extract HTML version
        htmlVersion := c.detectHTMLVersion(doc)
        data["html_version"] = htmlVersion

        // Count heading tags
        data["h1_count"] = doc.Find("h1").Length()
        data["h2_count"] = doc.Find("h2").Length()
        data["h3_count"] = doc.Find("h3").Length()
        data["h4_count"] = doc.Find("h4").Length()
        data["h5_count"] = doc.Find("h5").Length()
        data["h6_count"] = doc.Find("h6").Length()

        // Count internal vs external links
        internalLinks, externalLinks := c.countLinks(doc, baseURL)
        data["internal_links"] = internalLinks
        data["external_links"] = externalLinks

        // Check for login form
        data["has_login_form"] = c.hasLoginForm(doc)

        return data
}

func (c *Crawler) detectHTMLVersion(doc *goquery.Document) string {
        // Check for HTML5 doctype
        if strings.Contains(doc.Find("html").First().Text(), "<!DOCTYPE html>") {
                return "HTML5"
        }

        // Check for XHTML doctypes
        doctype := doc.Find("html").First().AttrOr("xmlns", "")
        if strings.Contains(doctype, "xhtml") {
                return "XHTML"
        }

        // Check for HTML4 doctypes
        html := doc.Find("html").First()
        if html.Length() > 0 {
                // Look for common HTML4 patterns
                return "HTML4"
        }

        return "Unknown"
}

func (c *Crawler) countLinks(doc *goquery.Document, baseURL string) (int, int) {
        baseURLParsed, err := url.Parse(baseURL)
        if err != nil {
                return 0, 0
        }

        internal := 0
        external := 0

        doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
                href, exists := s.Attr("href")
                if !exists {
                        return
                }

                linkURL, err := url.Parse(href)
                if err != nil {
                        return
                }

                // Resolve relative URLs
                if linkURL.IsAbs() {
                        if linkURL.Host == baseURLParsed.Host {
                                internal++
                        } else {
                                external++
                        }
                } else {
                        internal++ // Relative links are internal
                }
        })

        return internal, external
}

func (c *Crawler) hasLoginForm(doc *goquery.Document) bool {
        // Look for common login form patterns
        loginPatterns := []string{
                "input[type='password']",
                "input[name*='password']",
                "input[id*='password']",
                "form[action*='login']",
                "form[id*='login']",
                "form[class*='login']",
        }

        for _, pattern := range loginPatterns {
                if doc.Find(pattern).Length() > 0 {
                        return true
                }
        }

        return false
}

type BrokenLink struct {
        URL        string
        StatusCode int
        Error      string
}

func (c *Crawler) checkBrokenLinks(doc *goquery.Document, baseURL string) []BrokenLink {
        var brokenLinks []BrokenLink
        var wg sync.WaitGroup
        var mutex sync.Mutex

        // Limit concurrent requests
        semaphore := make(chan struct{}, 10)

        doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
                href, exists := s.Attr("href")
                if !exists {
                        return
                }

                // Skip non-HTTP links
                if !strings.HasPrefix(href, "http") && !strings.HasPrefix(href, "https") {
                        // Try to resolve relative URLs
                        linkURL, err := url.Parse(href)
                        if err != nil {
                                return
                        }
                        baseURLParsed, err := url.Parse(baseURL)
                        if err != nil {
                                return
                        }
                        href = baseURLParsed.ResolveReference(linkURL).String()
                }

                wg.Add(1)
                go func(linkURL string) {
                        defer wg.Done()
                        semaphore <- struct{}{}
                        defer func() { <-semaphore }()

                        resp, err := c.httpClient.Head(linkURL)
                        if err != nil {
                                mutex.Lock()
                                brokenLinks = append(brokenLinks, BrokenLink{
                                        URL:        linkURL,
                                        StatusCode: 0,
                                        Error:      err.Error(),
                                })
                                mutex.Unlock()
                                return
                        }
                        defer resp.Body.Close()

                        if resp.StatusCode >= 400 {
                                mutex.Lock()
                                brokenLinks = append(brokenLinks, BrokenLink{
                                        URL:        linkURL,
                                        StatusCode: resp.StatusCode,
                                        Error:      fmt.Sprintf("HTTP %d", resp.StatusCode),
                                })
                                mutex.Unlock()
                        }
                }(href)
        })

        wg.Wait()
        return brokenLinks
}

func (c *Crawler) updateError(urlID, errorMsg string) {
        query := `UPDATE urls SET status = 'error', error_message = ? WHERE id = ?`
        c.db.Exec(query, errorMsg, urlID)
}

func (c *Crawler) updateStatus(urlID, status string) {
        query := `UPDATE urls SET status = ?, last_crawled = CURRENT_TIMESTAMP WHERE id = ?`
        c.db.Exec(query, status, urlID)
}
