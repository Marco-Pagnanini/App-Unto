package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/handler"
	postgresRepo "github.com/Marco-Pagnanini/App-Unto/backend/internal/repository/postgres"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/setup"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/usecase"
	"github.com/Marco-Pagnanini/App-Unto/backend/pkg/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Wizard al primo avvio (quando API_KEY non è ancora configurata)
	if setup.IsFirstRun() {
		if err := setup.Run(); err != nil {
			log.Fatalf("setup failed: %v", err)
		}
	}

	// 2. Carica le variabili dal file .env nel processo corrente
	if err := setup.LoadEnv(); err != nil {
		log.Fatalf("failed to load .env: %v", err)
	}

	// 3. Config
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	if cfg.Server.APIKey == "" {
		log.Fatal("API_KEY non configurata — esegui il setup: rm .env && ./notes-server")
	}

	// 4. Database — retry perché Postgres potrebbe impiegare qualche secondo ad avviarsi
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Name,
		cfg.Database.SSLMode,
	)

	db, err := connectWithRetry(dsn, 15)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// 5. Auto migrate
	if err := db.AutoMigrate(&domain.User{}, &domain.Tag{}, &domain.Note{}); err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}

	// 6. Repositories
	userRepo := postgresRepo.NewUserRepository(db)
	noteRepo := postgresRepo.NewNoteRepository(db)
	tagRepo := postgresRepo.NewTagRepository(db)

	// 7. Seed: crea l'utente admin al primo avvio
	if err := seedDefaultUser(userRepo, cfg.Server.APIKey); err != nil {
		log.Fatalf("failed to seed default user: %v", err)
	}

	// 8. Use cases
	noteUseCase := usecase.NewNoteUseCase(noteRepo, tagRepo)
	tagUseCase := usecase.NewTagUseCase(tagRepo)

	// 9. Handlers e router
	noteHandler := handler.NewNoteHandler(noteUseCase)
	tagHandler := handler.NewTagHandler(tagUseCase)
	r := handler.SetupRouter(noteHandler, tagHandler, userRepo)

	log.Printf("server listening on port %s", cfg.Server.Port)
	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

// connectWithRetry tenta la connessione al database con backoff lineare.
func connectWithRetry(dsn string, maxAttempts int) (*gorm.DB, error) {
	var db *gorm.DB
	var err error
	for i := 1; i <= maxAttempts; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			return db, nil
		}
		log.Printf("database not ready, retry %d/%d...", i, maxAttempts)
		time.Sleep(time.Duration(i) * time.Second)
	}
	return nil, err
}

// seedDefaultUser crea l'utente "admin" al primo avvio dell'applicazione.
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
