package main

import (
	"context"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/handler"
	postgresRepo "github.com/Marco-Pagnanini/App-Unto/backend/internal/repository/postgres"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/usecase"
	"github.com/Marco-Pagnanini/App-Unto/backend/pkg/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Config
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	if cfg.Server.APIKey == "" {
		log.Fatal("API_KEY must be set in environment or .env file")
	}

	// 2. Database
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Name,
		cfg.Database.SSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// 3. Auto migrate — crea/aggiorna le tabelle in base alle struct del domain
	if err := db.AutoMigrate(&domain.User{}, &domain.Tag{}, &domain.Note{}); err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}

	// 4. Repositories
	userRepo := postgresRepo.NewUserRepository(db)
	noteRepo := postgresRepo.NewNoteRepository(db)
	tagRepo := postgresRepo.NewTagRepository(db)

	// 5. Seed: crea l'utente admin al primo avvio se non esiste
	if err := seedDefaultUser(userRepo, cfg.Server.APIKey); err != nil {
		log.Fatalf("failed to seed default user: %v", err)
	}

	// 6. Use cases
	noteUseCase := usecase.NewNoteUseCase(noteRepo, tagRepo)
	tagUseCase := usecase.NewTagUseCase(tagRepo)

	// 7. Handlers
	noteHandler := handler.NewNoteHandler(noteUseCase)
	tagHandler := handler.NewTagHandler(tagUseCase)

	// 8. Router
	r := handler.SetupRouter(noteHandler, tagHandler, userRepo)

	log.Printf("server listening on port %s", cfg.Server.Port)
	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

// seedDefaultUser crea l'utente "admin" al primo avvio dell'applicazione.
// Nei successivi avvii non fa nulla se l'utente esiste già.
func seedDefaultUser(userRepo domain.UserRepository, apiKey string) error {
	ctx := context.Background()

	count, err := userRepo.Count(ctx)
	if err != nil {
		return fmt.Errorf("checking user count: %w", err)
	}

	if count > 0 {
		log.Println("default user already exists, skipping seed")
		return nil
	}

	user := &domain.User{
		ID:       uuid.New(),
		Username: "admin",
		APIKey:   apiKey,
	}

	if err := userRepo.Create(ctx, user); err != nil {
		return fmt.Errorf("creating default user: %w", err)
	}

	log.Printf("default user created with id: %s", user.ID)
	return nil
}
