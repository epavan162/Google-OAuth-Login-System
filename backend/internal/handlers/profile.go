package handlers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/oauth-app/backend/internal/services"
)

// GET /api/profile/:username
func GetPublicProfile(c *gin.Context) {
	username := c.Param("username")

	user, err := services.FindUserByUsername(context.Background(), username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	// Check if the viewer is the profile owner (via JWT cookie)
	isOwner := false
	tokenString, cookieErr := c.Cookie("token")
	if cookieErr == nil && tokenString != "" {
		claims, claimErr := services.ValidateJWT(tokenString)
		if claimErr == nil && claims.UserID == user.ID {
			isOwner = true
		}
	}

	if !user.IsPublic && !isOwner {
		c.JSON(http.StatusOK, gin.H{
			"is_public": false,
			"username":  user.Username,
		})
		return
	}

	// Record profile view (only from non-owners)
	if !isOwner {
		viewerIP := c.ClientIP()
		_ = services.RecordProfileView(context.Background(), user.ID, viewerIP)
	}

	c.JSON(http.StatusOK, gin.H{
		"is_public": true,
		"name":      user.Name,
		"username":  user.Username,
		"bio":       user.Bio,
		"location":  user.Location,
		"image":     user.Image,
	})
}
