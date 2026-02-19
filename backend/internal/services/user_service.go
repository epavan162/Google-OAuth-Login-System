package services

import (
	"context"
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/oauth-app/backend/internal/database"
	"github.com/oauth-app/backend/internal/models"
)

var userSelectFields = `id, google_id, name, email, image, username, bio, phone, location,
	is_public, login_count, last_login_at, created_at, updated_at`

func scanUser(row interface{ Scan(dest ...any) error }) (*models.User, error) {
	var user models.User
	err := row.Scan(
		&user.ID, &user.GoogleID, &user.Name, &user.Email, &user.Image, &user.Username,
		&user.Bio, &user.Phone, &user.Location,
		&user.IsPublic, &user.LoginCount, &user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func FindUserByGoogleID(ctx context.Context, googleID string) (*models.User, error) {
	row := database.Pool.QueryRow(ctx,
		fmt.Sprintf(`SELECT %s FROM users WHERE google_id = $1`, userSelectFields), googleID)
	return scanUser(row)
}

func FindUserByID(ctx context.Context, id string) (*models.User, error) {
	row := database.Pool.QueryRow(ctx,
		fmt.Sprintf(`SELECT %s FROM users WHERE id = $1`, userSelectFields), id)
	return scanUser(row)
}

func FindUserByUsername(ctx context.Context, username string) (*models.User, error) {
	row := database.Pool.QueryRow(ctx,
		fmt.Sprintf(`SELECT %s FROM users WHERE username = $1`, userSelectFields), username)
	return scanUser(row)
}

func CreateUser(ctx context.Context, googleID, name, email, image string) (*models.User, error) {
	username := generateUsername(name)

	// Ensure uniqueness
	for i := 0; i < 10; i++ {
		existing, _ := FindUserByUsername(ctx, username)
		if existing == nil {
			break
		}
		username = generateUsername(name)
	}

	row := database.Pool.QueryRow(ctx,
		fmt.Sprintf(`INSERT INTO users (google_id, name, email, image, username, login_count, last_login_at)
		 VALUES ($1, $2, $3, $4, $5, 1, NOW())
		 RETURNING %s`, userSelectFields),
		googleID, name, email, image, username)
	return scanUser(row)
}

func IncrementLoginCount(ctx context.Context, userID string) error {
	_, err := database.Pool.Exec(ctx,
		`UPDATE users SET login_count = login_count + 1, last_login_at = NOW(), updated_at = NOW() WHERE id = $1`, userID)
	return err
}

func UpdateUser(ctx context.Context, userID string, req models.UpdateUserRequest) (*models.User, error) {
	query := "UPDATE users SET updated_at = NOW()"
	args := []interface{}{}
	argIdx := 1

	if req.Name != nil {
		query += fmt.Sprintf(", name = $%d", argIdx)
		args = append(args, *req.Name)
		argIdx++
	}
	if req.Bio != nil {
		query += fmt.Sprintf(", bio = $%d", argIdx)
		args = append(args, *req.Bio)
		argIdx++
	}
	if req.Phone != nil {
		query += fmt.Sprintf(", phone = $%d", argIdx)
		args = append(args, *req.Phone)
		argIdx++
	}
	if req.Location != nil {
		query += fmt.Sprintf(", location = $%d", argIdx)
		args = append(args, *req.Location)
		argIdx++
	}
	if req.IsPublic != nil {
		query += fmt.Sprintf(", is_public = $%d", argIdx)
		args = append(args, *req.IsPublic)
		argIdx++
	}

	query += fmt.Sprintf(" WHERE id = $%d", argIdx)
	args = append(args, userID)

	_, err := database.Pool.Exec(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return FindUserByID(ctx, userID)
}

func UpdateUsername(ctx context.Context, userID, username string) error {
	existing, _ := FindUserByUsername(ctx, username)
	if existing != nil && existing.ID != userID {
		return fmt.Errorf("username already taken")
	}

	_, err := database.Pool.Exec(ctx,
		`UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2`,
		username, userID)
	return err
}

// HardDeleteUser permanently removes user and all related data (CASCADE)
func HardDeleteUser(ctx context.Context, userID string) error {
	_, err := database.Pool.Exec(ctx, `DELETE FROM users WHERE id = $1`, userID)
	return err
}

func GetProfileViewCount(ctx context.Context, userID string) (int, error) {
	var count int
	err := database.Pool.QueryRow(ctx,
		`SELECT COUNT(*) FROM profile_views WHERE user_id = $1`, userID).Scan(&count)
	return count, err
}

func RecordProfileView(ctx context.Context, userID, viewerIP string) error {
	_, err := database.Pool.Exec(ctx,
		`INSERT INTO profile_views (user_id, viewer_ip) VALUES ($1, $2)`, userID, viewerIP)
	return err
}

func generateUsername(name string) string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	base := strings.ToLower(strings.ReplaceAll(name, " ", ""))
	clean := ""
	for _, c := range base {
		if (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') {
			clean += string(c)
		}
	}
	if len(clean) > 15 {
		clean = clean[:15]
	}
	if clean == "" {
		clean = "user"
	}
	return fmt.Sprintf("%s%d", clean, r.Intn(9999)+1)
}
