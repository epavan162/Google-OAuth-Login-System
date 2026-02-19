package services

import (
	"context"

	"github.com/oauth-app/backend/internal/database"
	"github.com/oauth-app/backend/internal/models"
)

func LogActivity(ctx context.Context, userID, action string) error {
	_, err := database.Pool.Exec(ctx,
		`INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)`, userID, action)
	return err
}

func GetRecentActivity(ctx context.Context, userID string, limit int) ([]models.ActivityLog, error) {
	rows, err := database.Pool.Query(ctx,
		`SELECT id, user_id, action, created_at FROM activity_logs
		 WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []models.ActivityLog
	for rows.Next() {
		var a models.ActivityLog
		if err := rows.Scan(&a.ID, &a.UserID, &a.Action, &a.CreatedAt); err != nil {
			return nil, err
		}
		activities = append(activities, a)
	}
	return activities, nil
}
