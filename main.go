package main

import (
        "log"
        "os"

        "github.com/gin-contrib/cors"
        "github.com/gin-gonic/gin"
        "web-crawler/handlers"
        "web-crawler/middleware"
        "web-crawler/models"
        "web-crawler/services"
)

func main() {
        // Initialize database
        db, err := models.InitDB()
        if err != nil {
                log.Fatal("Failed to connect to database:", err)
        }
        defer db.Close()

        // Initialize crawler service
        crawler := services.NewCrawler(db)

        // Initialize handlers
        authHandler := handlers.NewAuthHandler()
        urlHandler := handlers.NewURLHandler(db, crawler)

        // Setup router
        router := gin.Default()

        // CORS middleware
        config := cors.DefaultConfig()
        config.AllowOrigins = []string{"*"}
        config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
        config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
        router.Use(cors.New(config))

        // Serve static files for production
        router.Static("/static", "./public")
        router.StaticFile("/", "./public/index.html")

        // API routes
        api := router.Group("/api")
        {
                // Auth routes
                api.POST("/auth/login", authHandler.Login)
                api.POST("/auth/verify", authHandler.Verify)

                // Protected routes
                protected := api.Group("/")
                protected.Use(middleware.AuthMiddleware())
                {
                        protected.GET("/urls", urlHandler.GetURLs)
                        protected.POST("/urls", urlHandler.CreateURL)
                        protected.PUT("/urls/:id", urlHandler.UpdateURL)
                        protected.DELETE("/urls/:id", urlHandler.DeleteURL)
                        protected.POST("/urls/:id/crawl", urlHandler.StartCrawl)
                        protected.POST("/urls/:id/stop", urlHandler.StopCrawl)
                        protected.GET("/urls/:id/status", urlHandler.GetStatus)
                        protected.GET("/urls/:id/broken-links", urlHandler.GetBrokenLinks)
                        protected.POST("/urls/bulk", urlHandler.BulkAction)
                }
        }

        port := os.Getenv("PORT")
        if port == "" {
                port = "8000"
        }

        log.Printf("Server starting on port %s", port)
        if err := router.Run("0.0.0.0:" + port); err != nil {
                log.Fatal("Failed to start server:", err)
        }
}
