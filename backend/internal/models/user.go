package models

import "time"

type User struct {
	ID          string    `json:"id"`
	GoogleID    string    `json:"google_id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Image       string    `json:"image"`
	Username    string    `json:"username"`
	Bio         string    `json:"bio"`
	Phone       string    `json:"phone"`
	Location    string    `json:"location"`
	IsPublic    bool      `json:"is_public"`
	LoginCount  int       `json:"login_count"`
	LastLoginAt time.Time `json:"last_login_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type UpdateUserRequest struct {
	Name     *string `json:"name"`
	Bio      *string `json:"bio"`
	Phone    *string `json:"phone"`
	Location *string `json:"location"`
	IsPublic *bool   `json:"is_public"`
}

type UpdateUsernameRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
}
