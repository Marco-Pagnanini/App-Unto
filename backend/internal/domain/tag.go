package domain

import (
	"context"

	"github.com/google/uuid"
)

type Tag struct {
	ID     uuid.UUID `gorm:"type:uuid;primaryKey"                          json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;not null;index:idx_user_tag,unique"  json:"-"`
	Name   string    `gorm:"not null;index:idx_user_tag,unique"            json:"name"`
}

// TagRepository definisce le operazioni sul DB.
type TagRepository interface {
	FindOrCreate(ctx context.Context, userID uuid.UUID, name string) (*Tag, error)
	FindAll(ctx context.Context, userID uuid.UUID) ([]Tag, error)
	Delete(ctx context.Context, userID, id uuid.UUID) error
}

// TagUseCase definisce la logica di business sui tag.
type TagUseCase interface {
	GetAllTags(ctx context.Context, userID uuid.UUID) ([]Tag, error)
	DeleteTag(ctx context.Context, userID, id uuid.UUID) error
}
