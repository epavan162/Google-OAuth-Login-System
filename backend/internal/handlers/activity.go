package handlers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/oauth-app/backend/internal/models"
	"github.com/oauth-app/backend/internal/services"
)

// GET /api/activity
func GetActivity(c *gin.Context) {
	userID := fmt.Sprintf("%v", c.MustGet("userID"))

	activities, err := services.GetRecentActivity(context.Background(), userID, 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch activity"})
		return
	}

	if activities == nil {
		activities = []models.ActivityLog{}
	}

	c.JSON(http.StatusOK, activities)
}
