package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
	"github.com/Marco-Pagnanini/App-Unto/backend/pkg/middleware"
)

type NoteHandler struct {
	noteUseCase domain.NoteUseCase
}

func NewNoteHandler(noteUseCase domain.NoteUseCase) *NoteHandler {
	return &NoteHandler{noteUseCase: noteUseCase}
}

type createNoteRequest struct {
	Title   string   `json:"title"   binding:"required"`
	Content string   `json:"content"`
	Tags    []string `json:"tags"`
}

type createNoteResponse struct {
	ID uuid.UUID `json:"id"`
	Title string    `json:"title"`
	Content string    `json:"content"`
}

type updateNoteRequest struct {
	Title   string   `json:"title"   binding:"required"`
	Content string   `json:"content"`
	Tags    []string `json:"tags"`
}

func (h *NoteHandler) Create(c *gin.Context) {
	user := c.MustGet(middleware.UserContextKey).(*domain.User)

	var req createNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	note, err := h.noteUseCase.CreateNote(c.Request.Context(), user.ID, req.Title, req.Content, req.Tags)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, note)
}

func (h *NoteHandler) GetAll(c *gin.Context) {
	user := c.MustGet(middleware.UserContextKey).(*domain.User)

	notes, err := h.noteUseCase.GetAllNotes(c.Request.Context(), user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notes)
}

func (h *NoteHandler) GetByID(c *gin.Context) {
	user := c.MustGet(middleware.UserContextKey).(*domain.User)

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note id"})
		return
	}

	note, err := h.noteUseCase.GetNote(c.Request.Context(), user.ID, id)
	if err != nil {
		if err == domain.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "note not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, note)
}

func (h *NoteHandler) Update(c *gin.Context) {
	user := c.MustGet(middleware.UserContextKey).(*domain.User)

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note id"})
		return
	}

	var req updateNoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	note, err := h.noteUseCase.UpdateNote(c.Request.Context(), user.ID, id, req.Title, req.Content, req.Tags)
	if err != nil {
		if err == domain.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "note not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, note)
}

func (h *NoteHandler) Delete(c *gin.Context) {
	user := c.MustGet(middleware.UserContextKey).(*domain.User)

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note id"})
		return
	}

	if err := h.noteUseCase.DeleteNote(c.Request.Context(), user.ID, id); err != nil {
		if err == domain.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "note not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
