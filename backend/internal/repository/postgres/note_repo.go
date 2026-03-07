package postgres

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
	"gorm.io/gorm"
)

type noteRepository struct {
	db *gorm.DB
}

func NewNoteRepository(db *gorm.DB) domain.NoteRepository {
	return &noteRepository{db: db}
}

func (r *noteRepository) Create(ctx context.Context, note *domain.Note) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Salviamo i tag separatamente per evitare che GORM tenti di ri-crearli
		tags := note.Tags
		note.Tags = nil

		if err := tx.Create(note).Error; err != nil {
			return err
		}

		if len(tags) > 0 {
			return tx.Model(note).Association("Tags").Append(tags)
		}
		return nil
	})
}

func (r *noteRepository) FindByID(ctx context.Context, userID, id uuid.UUID) (*domain.Note, error) {
	var note domain.Note
	err := r.db.WithContext(ctx).
		Preload("Tags").
		Where("id = ? AND user_id = ?", id, userID).
		First(&note).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &note, nil
}

func (r *noteRepository) FindAll(ctx context.Context, userID uuid.UUID) ([]domain.Note, error) {
	var notes []domain.Note
	err := r.db.WithContext(ctx).
		Preload("Tags").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&notes).Error

	if err != nil {
		return nil, err
	}
	return notes, nil
}

// Update aggiorna title e content, poi sostituisce i tag associati.
// Usiamo una transazione per garantire consistenza.
func (r *noteRepository) Update(ctx context.Context, note *domain.Note) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Updates con mappa aggiorna solo i campi specificati e gestisce updated_at automaticamente
		if err := tx.Model(note).Updates(map[string]interface{}{
			"title":   note.Title,
			"content": note.Content,
		}).Error; err != nil {
			return err
		}

		// Replace sostituisce completamente i tag associati nella join table
		return tx.Model(note).Association("Tags").Replace(note.Tags)
	})
}

func (r *noteRepository) Delete(ctx context.Context, userID, id uuid.UUID) error {
	// GORM gestisce il soft delete automaticamente grazie al campo DeletedAt nel modello
	return r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&domain.Note{}).Error
}
