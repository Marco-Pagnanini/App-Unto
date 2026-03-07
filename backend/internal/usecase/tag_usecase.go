package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
)

type tagUseCase struct {
	tagRepo domain.TagRepository
}

func NewTagUseCase(tagRepo domain.TagRepository) domain.TagUseCase {
	return &tagUseCase{tagRepo: tagRepo}
}

func (uc *tagUseCase) GetAllTags(ctx context.Context, userID uuid.UUID) ([]domain.Tag, error) {
	return uc.tagRepo.FindAll(ctx, userID)
}

func (uc *tagUseCase) DeleteTag(ctx context.Context, userID, id uuid.UUID) error {
	return uc.tagRepo.Delete(ctx, userID, id)
}
