package models

import "time"

type ProfileView struct {
	ID       string    `json:"id"`
	UserID   string    `json:"user_id"`
	ViewerIP string    `json:"viewer_ip"`
	ViewedAt time.Time `json:"viewed_at"`
}
