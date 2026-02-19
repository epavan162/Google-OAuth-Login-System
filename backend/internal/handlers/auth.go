package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/oauth-app/backend/internal/services"
	"golang.org/x/oauth2"
)

type GoogleUserInfo struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Picture string `json:"picture"`
}

// GET /auth/google — Redirects to Google consent screen
func GoogleLogin(c *gin.Context) {
	url := services.GoogleOAuthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// GET /auth/google/callback — Handles OAuth callback
func GoogleCallback(c *gin.Context) {
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	code := c.Query("code")
	if code == "" {
		c.Redirect(http.StatusTemporaryRedirect, frontendURL+"?error=no_code")
		return
	}

	token, err := services.GoogleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		log.Printf("OAuth exchange error: %v", err)
		c.Redirect(http.StatusTemporaryRedirect, frontendURL+"?error=exchange_failed")
		return
	}

	// Fetch user info from Google
	client := services.GoogleOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		log.Printf("Failed to get user info: %v", err)
		c.Redirect(http.StatusTemporaryRedirect, frontendURL+"?error=userinfo_failed")
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var googleUser GoogleUserInfo
	if err := json.Unmarshal(body, &googleUser); err != nil {
		log.Printf("Failed to parse user info: %v", err)
		c.Redirect(http.StatusTemporaryRedirect, frontendURL+"?error=parse_failed")
		return
	}

	ctx := context.Background()

	// Find or create user (always fresh — no soft delete/restore)
	user, err := services.FindUserByGoogleID(ctx, googleUser.ID)
	if err != nil {
		// New user — create fresh account
		user, err = services.CreateUser(ctx, googleUser.ID, googleUser.Name, googleUser.Email, googleUser.Picture)
		if err != nil {
			log.Printf("Failed to create user: %v", err)
			c.Redirect(http.StatusTemporaryRedirect, frontendURL+"?error=create_failed")
			return
		}
		_ = services.LogActivity(ctx, user.ID, "Account created")
	} else {
		// Existing user — increment login
		if err := services.IncrementLoginCount(ctx, user.ID); err != nil {
			log.Printf("Failed to increment login count: %v", err)
		}
		user, _ = services.FindUserByID(ctx, user.ID)
	}

	// Log login activity
	_ = services.LogActivity(ctx, user.ID, "Logged in")

	// Generate JWT
	jwtToken, err := services.GenerateJWT(user.ID, user.Email, user.Username)
	if err != nil {
		log.Printf("Failed to generate JWT: %v", err)
		c.Redirect(http.StatusTemporaryRedirect, frontendURL+"?error=jwt_failed")
		return
	}

	// Set HTTP-only cookie
	secure := false // Set to true in production with HTTPS
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("token", jwtToken, 7*24*3600, "/", "", secure, true)

	c.Redirect(http.StatusTemporaryRedirect, frontendURL+"/dashboard")
}

// POST /auth/logout
func Logout(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

// GET /auth/me — Returns current user info
func GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, err := services.FindUserByID(context.Background(), fmt.Sprintf("%v", userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}
