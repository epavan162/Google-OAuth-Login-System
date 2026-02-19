package handlers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/oauth-app/backend/internal/models"
	"github.com/oauth-app/backend/internal/services"
)

// GET /api/users/me
func GetUser(c *gin.Context) {
	userID := fmt.Sprintf("%v", c.MustGet("userID"))
	user, err := services.FindUserByID(context.Background(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// PUT /api/users/me
func UpdateUser(c *gin.Context) {
	userID := fmt.Sprintf("%v", c.MustGet("userID"))

	var req models.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	user, err := services.UpdateUser(context.Background(), userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		return
	}

	_ = services.LogActivity(context.Background(), userID, "Updated profile")

	c.JSON(http.StatusOK, user)
}

// PUT /api/users/me/username
func UpdateUsername(c *gin.Context) {
	userID := fmt.Sprintf("%v", c.MustGet("userID"))

	var req models.UpdateUsernameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username must be 3-50 characters"})
		return
	}

	if err := services.UpdateUsername(context.Background(), userID, req.Username); err != nil {
		if err.Error() == "username already taken" {
			c.JSON(http.StatusConflict, gin.H{"error": "username already taken"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update username"})
		return
	}

	_ = services.LogActivity(context.Background(), userID, fmt.Sprintf("Changed username to %s", req.Username))

	c.JSON(http.StatusOK, gin.H{"message": "username updated"})
}

// PUT /api/users/me/toggle-public
func TogglePublic(c *gin.Context) {
	userID := fmt.Sprintf("%v", c.MustGet("userID"))

	user, err := services.FindUserByID(context.Background(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	newPublic := !user.IsPublic
	req := models.UpdateUserRequest{IsPublic: &newPublic}
	updated, err := services.UpdateUser(context.Background(), userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to toggle visibility"})
		return
	}

	action := "Set profile to private"
	if newPublic {
		action = "Set profile to public"
	}
	_ = services.LogActivity(context.Background(), userID, action)

	c.JSON(http.StatusOK, updated)
}

// DELETE /api/users/me — Permanently delete user and all related data
func DeleteUser(c *gin.Context) {
	userID := fmt.Sprintf("%v", c.MustGet("userID"))

	if err := services.HardDeleteUser(context.Background(), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete account"})
		return
	}

	// Clear auth cookie
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("token", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "account permanently deleted"})
}

// GET /api/users/me/stats
func GetUserStats(c *gin.Context) {
	userID := fmt.Sprintf("%v", c.MustGet("userID"))
	ctx := context.Background()

	user, err := services.FindUserByID(ctx, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	viewCount, _ := services.GetProfileViewCount(ctx, userID)
	activities, _ := services.GetRecentActivity(ctx, userID, 5)

	completion := calculateCompletion(user)

	c.JSON(http.StatusOK, gin.H{
		"user":               user,
		"profile_views":      viewCount,
		"recent_activity":    activities,
		"profile_completion": completion,
	})
}

func calculateCompletion(user *models.User) int {
	total := 0
	fields := 0

	check := func(val string) {
		fields++
		if val != "" {
			total++
		}
	}

	check(user.Name)
	check(user.Bio)
	check(user.Phone)
	check(user.Location)
	check(user.Image)

	if fields == 0 {
		return 0
	}
	return (total * 100) / fields
}
