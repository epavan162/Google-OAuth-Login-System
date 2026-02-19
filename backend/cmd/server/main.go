package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"github.com/oauth-app/backend/internal/database"
	"github.com/oauth-app/backend/internal/handlers"
	"github.com/oauth-app/backend/internal/middleware"
	"github.com/oauth-app/backend/internal/services"
)

func main() {
	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run migrations
	runMigrations()

	// Initialize auth
	services.InitAuth()

	// Setup Gin
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// CORS
	r.Use(middleware.CORSMiddleware())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Auth routes (public)
	r.GET("/auth/google", handlers.GoogleLogin)
	r.GET("/auth/google/callback", handlers.GoogleCallback)
	r.POST("/auth/logout", handlers.Logout)

	// Protected routes
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.GET("/auth/me", handlers.GetCurrentUser)

		// User routes
		auth.GET("/api/users/me", handlers.GetUser)
		auth.PUT("/api/users/me", handlers.UpdateUser)
		auth.PUT("/api/users/me/username", handlers.UpdateUsername)
		auth.PUT("/api/users/me/toggle-public", handlers.TogglePublic)
		auth.DELETE("/api/users/me", handlers.DeleteUser)
		auth.GET("/api/users/me/stats", handlers.GetUserStats)

		// Activity routes
		auth.GET("/api/activity", handlers.GetActivity)
	}

	// Public profile route
	r.GET("/api/profile/:username", handlers.GetPublicProfile)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func runMigrations() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/oauth_app?sslmode=disable"
	}

	m, err := migrate.New("file://migrations", dbURL)
	if err != nil {
		log.Printf("⚠️  Migration init error: %v", err)
		return
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Printf("⚠️  Migration error: %v", err)
		return
	}

	log.Println("✅ Database migrations applied")
}
