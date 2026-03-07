package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"  json:"id"`
	Username  string    `gorm:"uniqueIndex;not null"  json:"username"`
	APIKey    string    `gorm:"uniqueIndex;not null"  json:"-"` // mai esposta nel JSON
	CreatedAt time.Time `json:"created_at"`
}

// UserRepository definisce le operazioni sul DB — implementato nel layer repository.
// Il domain non sa nulla di Postgres o GORM.
type UserRepository interface {
	FindByAPIKey(ctx context.Context, apiKey string) (*User, error)
	Create(ctx context.Context, user *User) error
	Count(ctx context.Context) (int64, error)
}
