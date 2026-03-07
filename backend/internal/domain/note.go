package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Note struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey"   json:"id"`
	UserID    uuid.UUID      `gorm:"type:uuid;not null;index" json:"-"`
	Title     string         `gorm:"not null"               json:"title"`
	Content   string         `gorm:"type:text"              json:"content"`
	Tags      []Tag          `gorm:"many2many:note_tags;"   json:"tags"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index"                  json:"-"` // soft delete
}

// NoteRepository definisce le operazioni sul DB.
type NoteRepository interface {
	Create(ctx context.Context, note *Note) error
	FindByID(ctx context.Context, userID, id uuid.UUID) (*Note, error)
	FindAll(ctx context.Context, userID uuid.UUID) ([]Note, error)
	Update(ctx context.Context, note *Note) error
	Delete(ctx context.Context, userID, id uuid.UUID) error
}

// NoteUseCase definisce la logica di business sulle note.
type NoteUseCase interface {
	CreateNote(ctx context.Context, userID uuid.UUID, title, content string, tagNames []string) (*Note, error)
	GetNote(ctx context.Context, userID, id uuid.UUID) (*Note, error)
	GetAllNotes(ctx context.Context, userID uuid.UUID) ([]Note, error)
	UpdateNote(ctx context.Context, userID, id uuid.UUID, title, content string, tagNames []string) (*Note, error)
	DeleteNote(ctx context.Context, userID, id uuid.UUID) error
}
