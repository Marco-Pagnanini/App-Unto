package handler

import (
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
