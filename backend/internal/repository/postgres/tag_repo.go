package postgres

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
	"gorm.io/gorm"
)

type tagRepository struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) domain.TagRepository {
	return &tagRepository{db: db}
}

// FindOrCreate cerca il tag per (user_id, name); se non esiste lo crea.
// Il vincolo UNIQUE sul DB garantisce la consistenza anche in caso di race condition.
func (r *tagRepository) FindOrCreate(ctx context.Context, userID uuid.UUID, name string) (*domain.Tag, error) {
	var tag domain.Tag

	err := r.db.WithContext(ctx).
		Where("user_id = ? AND name = ?", userID, name).
		First(&tag).Error

	if err == nil {
		return &tag, nil
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	tag = domain.Tag{
		ID:     uuid.New(),
		UserID: userID,
		Name:   name,
	}
	if err := r.db.WithContext(ctx).Create(&tag).Error; err != nil {
		return nil, err
	}
	return &tag, nil
}

func (r *tagRepository) FindAll(ctx context.Context, userID uuid.UUID) ([]domain.Tag, error) {
	var tags []domain.Tag
	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Find(&tags).Error; err != nil {
		return nil, err
	}
	return tags, nil
}

func (r *tagRepository) Delete(ctx context.Context, userID, id uuid.UUID) error {
	return r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&domain.Tag{}).Error
}
