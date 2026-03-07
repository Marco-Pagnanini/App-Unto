package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
)

type noteUseCase struct {
	noteRepo domain.NoteRepository
	tagRepo  domain.TagRepository
}

func NewNoteUseCase(noteRepo domain.NoteRepository, tagRepo domain.TagRepository) domain.NoteUseCase {
	return &noteUseCase{
		noteRepo: noteRepo,
		tagRepo:  tagRepo,
	}
}

func (uc *noteUseCase) CreateNote(ctx context.Context, userID uuid.UUID, title, content string, tagNames []string) (*domain.Note, error) {
	tags, err := uc.resolveTags(ctx, userID, tagNames)
	if err != nil {
		return nil, err
	}

	note := &domain.Note{
		ID:      uuid.New(),
		UserID:  userID,
		Title:   title,
		Content: content,
		Tags:    tags,
	}

	if err := uc.noteRepo.Create(ctx, note); err != nil {
		return nil, err
	}
	return note, nil
}

func (uc *noteUseCase) GetNote(ctx context.Context, userID, id uuid.UUID) (*domain.Note, error) {
	return uc.noteRepo.FindByID(ctx, userID, id)
}

func (uc *noteUseCase) GetAllNotes(ctx context.Context, userID uuid.UUID) ([]domain.Note, error) {
	return uc.noteRepo.FindAll(ctx, userID)
}

func (uc *noteUseCase) UpdateNote(ctx context.Context, userID, id uuid.UUID, title, content string, tagNames []string) (*domain.Note, error) {
	note, err := uc.noteRepo.FindByID(ctx, userID, id)
	if err != nil {
		return nil, err
	}

	tags, err := uc.resolveTags(ctx, userID, tagNames)
	if err != nil {
		return nil, err
	}

	note.Title = title
	note.Content = content
	note.Tags = tags

	if err := uc.noteRepo.Update(ctx, note); err != nil {
		return nil, err
	}
	return note, nil
}

func (uc *noteUseCase) DeleteNote(ctx context.Context, userID, id uuid.UUID) error {
	// Verifica che la nota esista prima di cancellarla
	if _, err := uc.noteRepo.FindByID(ctx, userID, id); err != nil {
		return err
	}
	return uc.noteRepo.Delete(ctx, userID, id)
}

// resolveTags trasforma una lista di nomi in entità Tag, creandoli se non esistono.
func (uc *noteUseCase) resolveTags(ctx context.Context, userID uuid.UUID, tagNames []string) ([]domain.Tag, error) {
	tags := make([]domain.Tag, 0, len(tagNames))
	for _, name := range tagNames {
		if name == "" {
			continue
		}
		tag, err := uc.tagRepo.FindOrCreate(ctx, userID, name)
		if err != nil {
			return nil, err
		}
		tags = append(tags, *tag)
	}
	return tags, nil
}
