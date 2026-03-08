package handler

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
	"github.com/Marco-Pagnanini/App-Unto/backend/pkg/middleware"
)

func SetupRouter(
	noteHandler *NoteHandler,
	tagHandler *TagHandler,
	userRepo domain.UserRepository,
) *gin.Engine {
	r := gin.Default()
	r.SetTrustedProxies(nil)

	// --- CONFIGURAZIONE CORS ---
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:1420"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Tutte le route sotto /api/v1 richiedono autenticazione
	api := r.Group("/api/v1")
	api.Use(middleware.Auth(userRepo))
	{
		notes := api.Group("/notes")
		{
			notes.POST("", noteHandler.Create)
			notes.GET("", noteHandler.GetAll)
			notes.GET("/:id", noteHandler.GetByID)
			notes.PUT("/:id", noteHandler.Update)
			notes.DELETE("/:id", noteHandler.Delete)
		}

		tags := api.Group("/tags")
		{
			tags.GET("", tagHandler.GetAll)
			tags.DELETE("/:id", tagHandler.Delete)
		}
	}

	return r
}