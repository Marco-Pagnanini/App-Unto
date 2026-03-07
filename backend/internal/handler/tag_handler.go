package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/Marco-Pagnanini/App-Unto/backend/internal/domain"
	"github.com/Marco-Pagnanini/App-Unto/backend/pkg/middleware"
)

type TagHandler struct {
	tagUseCase domain.TagUseCase
}

func NewTagHandler(tagUseCase domain.TagUseCase) *TagHandler {
	return &TagHandler{tagUseCase: tagUseCase}
}


func (h *TagHandler) GetAll(c *gin.Context) {
	user := c.MustGet(middleware.UserContextKey).(*domain.User)

	tags, err := h.tagUseCase.GetAllTags(c.Request.Context(), user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tags)
}

func (h *TagHandler) Delete(c *gin.Context) {
	user := c.MustGet(middleware.UserContextKey).(*domain.User)

	idParam, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}
	if err := h.tagUseCase.DeleteTag(c.Request.Context(), user.ID, idParam); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
